// AunuMD • koneksi WhatsApp: satu socket aktif, handler terdaftar sekali per socket,
// socket lama diakhiri sebelum reconnect (anti kebocoran listener).
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
import { sleep } from './helper.js';

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

  const sock = makeWASocket({
    ...(version ? { version } : {}),
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, pinoLogger)
    },
    logger: pinoLogger,
    browser: ['AunuMD', 'Chrome', '1.0.0'],
    printQRInTerminal: false,
    markOnlineOnConnect: false,
    syncFullHistory: false
  });
  activeSock = sock;

  if (!state.creds.registered) {
    const number = (config.botNumber || '').replace(/\D/g, '') || await askNumber();
    await sleep(1500);
    const code = await sock.requestPairingCode(number, config.pairingCode);
    log.success(`Kode pairing untuk ${number}: ${code}`);
    log.info('Hubungkan lewat WhatsApp di HP bot: Setelan > Perangkat tertaut > Tautkan dengan nomor telepon.');
  }

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;
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

  return sock;
}

export default { startConnection };
