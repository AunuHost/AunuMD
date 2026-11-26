// AunuMD • koneksi WhatsApp: satu socket aktif, handler terdaftar sekali per socket,
// socket lama diakhiri sebelum reconnect (anti kebocoran listener).
// Pairing TIDAK PERNAH boleh membunuh proses: semua handler didaftarkan dulu,
// permintaan kode pairing dipicu oleh event qr (alur kanonis) di dalam try/catch —
// penolakan server (mis. bad-request) hanya tercatat di log, bot tetap hidup.
import {
  makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  DisconnectReason
} from '@aunucore/baileys';
import pino from 'pino';
import readline from 'node:readline/promises';
import config from '../config.js';
import { handleMessage, handleParticipants, effectiveConfig } from './handler.js';

const pinoLogger = pino({ level: 'silent' });
let activeSock = null;
let generation = 0;

async function askNumber() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  try {
    const answer = await rl.question('Masukkan nomor bot (format 628xxxxxxxxxx): ');
    return answer.replace(/\D/g, '');
  } finally { rl.close(); }
}

export async function startConnection(log) {
  const myGen = ++generation;
  if (activeSock) {
    try { activeSock.ev.removeAllListeners(); } catch {}
    try { activeSock.end?.(); } catch {}
    try { activeSock.ws?.close(); } catch {}
    activeSock = null;
  }

  const { state, saveCreds } = await useMultiFileAuthState(config.sessionName);
  let version;
  try { ({ version } = await fetchLatestBaileysVersion()); } catch { version = undefined; }
  log.info(version ? `Versi WA dari server: ${version.join('.')}` : 'Versi WA: fetch gagal — memakai versi bawaan library (cek koneksi ke raw.githubusercontent.com).');

  const sock = makeWASocket({
    ...(version ? { version } : {}),
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, pinoLogger)
    },
    logger: pinoLogger,
    // Browser SENGAJA tidak di-set: pakai bawaan library (Browsers.macOS('Chrome')).
    // Tuple kustom ['AunuMD','Chrome','1.0.0'] dicabut 25 Nov 2026 — menghilangkan
    // satu variabel dari diagnosis penolakan companion_hello (bad-request).
    printQRInTerminal: false,
    markOnlineOnConnect: false,
    syncFullHistory: false
  });
  activeSock = sock;

  // --- Debug jalur kirim (config.debug): bungkus sendMessage + dengarkan echo ---
  // Murni logging defensif (try/catch) — tidak mengubah perilaku kirim sama sekali.
  // Membedakan "resolve tapi di-drop server" (tak ada echo) vs "sampai" (ada echo),
  // dan menunjukkan kunci isi hasil akhir proto yang dikembalikan library.
  if (config.debug) {
    const origSend = sock.sendMessage.bind(sock);
    sock.sendMessage = async (jid, content, options) => {
      const result = await origSend(jid, content, options);
      try {
        log.info(`[debug][send] jid=${jid} keys=[${Object.keys(content || {}).join(',')}] -> id=${result?.key?.id || '?'} status=${result?.status ?? '?'} hasil=[${Object.keys(result?.message || {}).join(',')}]`);
      } catch {}
      return result;
    };
    sock.ev.on('messages.upsert', ({ messages, type }) => {
      try {
        for (const mm of messages || []) {
          if (mm?.key?.fromMe) {
            log.info(`[debug][upsert] type=${type} id=${mm.key.id || '?'} keys=[${Object.keys(mm.message || {}).join(',')}]`);
          }
        }
      } catch {}
    });
    log.info('[debug] Mode debug jalur kirim AKTIF.');
  }

  // --- Pairing: dipicu event qr, sekali per socket, kegagalan tidak fatal ---
  let pairingRequested = false;
  const tryPairing = async () => {
    if (pairingRequested || state.creds.registered) return;
    pairingRequested = true;
    try {
      const number = (config.botNumber || '').replace(/\D/g, '') || await askNumber();
      const code = await sock.requestPairingCode(number, config.pairingCode);
      log.success(`Kode pairing untuk ${number}: ${code}`);
      log.info('Hubungkan lewat WhatsApp di HP bot: Setelan > Perangkat tertaut > Tautkan dengan nomor telepon.');
    } catch (e) {
      // SENGAJA tidak di-reset: pairingRequested tetap terkunci untuk socket ini.
      // Mencoba ulang otomatis pada qr berikutnya = spam companion_hello —
      // terbukti 25 Nov 2026: tiga percobaan dalam ±6 menit menaikkan penolakan
      // server dari bad-request menjadi rate-overlimit. Satu proses = satu percobaan;
      // mencoba lagi WAJIB lewat restart manual setelah jeda cooldown.
      log.error(`Pairing gagal: ${e.message} — bot tetap hidup dan TIDAK mencoba ulang otomatis. Tunggu cooldown server (rate-overlimit bisa berjam-jam), lalu restart untuk satu percobaan baru.`);
    }
  };

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update;
    if (qr && !state.creds.registered) tryPairing();
    if (connection === 'open') {
      log.success(`Terhubung sebagai ${sock.user?.id || ''} — ${effectiveConfig().botName} siap.`);
    } else if (connection === 'close') {
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      if (statusCode === DisconnectReason.loggedOut) {
        log.error('Sesi ter-logout. Hapus folder "session" lalu jalankan ulang untuk pairing baru.');
        return;
      }
      log.warn(`Koneksi terputus (kode ${statusCode ?? '?'}). Menyambung ulang…`);
      if (myGen === generation) {
        setTimeout(() => { startConnection(log).catch((e) => log.error(`Reconnect gagal: ${e.message}`)); }, 3000);
      }
    }
  });

  sock.ev.on('messages.upsert', ({ messages, type }) => {
    if (type !== 'notify') return;
    for (const raw of messages || []) {
      handleMessage(sock, raw, log, pinoLogger).catch((e) => log.error(`handler: ${e.message}`));
    }
  });

  sock.ev.on('group-participants.update', (event) => {
    handleParticipants(sock, event, log).catch(() => {});
  });

  // Kegagalan dekripsi dicatat rapi (library menyembuhkan sesi di belakang layar).
  sock.ev.on('messages.decrypt-failure', (info) => {
    try {
      log.warn(`Decrypt failure [${info?.errorClass || 'unknown'}] dari ${info?.remoteJid || info?.key?.remoteJid || '?'}`);
    } catch {}
  });

  // Cadangan: bila event qr tak kunjung tiba dalam 25 detik, coba pairing sekali
  // (requestPairingCode sendiri menunggu handshake selesai; tetap di dalam try/catch).
  if (!state.creds.registered) {
    setTimeout(() => { if (myGen === generation && !state.creds.registered) tryPairing(); }, 25000);
  }

  return sock;
}

export default { startConnection };
