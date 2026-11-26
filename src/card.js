// AunuMD • pengirim kartu interaktif (header foto + isi + footer + tombol native-flow).
//
// KENAPA TIDAK PAKAI sock.aunuCard: di @aunucore/baileys 2.7.0 cabang 'interactive'
// pada generateWAMessageContent HILANG saat porting v7 — konten { interactive }
// jatuh ke cabang media dan meledak Boom 400 "Invalid media type", sehingga
// aunuCard selalu gagal dan menu jatuh ke teks polos (tanpa foto/tombol/footer).
// Terbukti A/B 26 Nov 2026: input yang sama di 1.0.88 menghasilkan
// { messageContextInfo, interactiveMessage } yang utuh.
// Helper ini merakit proto InteractiveMessage persis seperti cabang v6 dulu
// lalu me-relay-nya langsung. Semantik opsi meniru aunuCard (termasuk likeDislike)
// supaya pemanggil tidak berubah bentuk. Cabut helper ini begitu library
// memulihkan cabang interactive-nya.
//
// KECEPATAN (26 Nov 2026): gambar header dari URL eksternal pernah membuat .menu
// baru muncul ±2 menit — unduhan CDN dari jaringan server lambat, dan kegagalannya
// baru terjadi SETELAH unduh+unggah selesai dicoba. Karena itu di sini:
//   • sumber gambar diselesaikan SEKALI lalu di-cache sebagai Buffer per proses,
//   • seluruh persiapan gambar dibatasi timeout (bawaan 12 detik),
//   • bila gambar gagal/lambat, kartu TETAP terkirim tanpa foto — tidak pernah
//     menggantung dan tidak pernah menggagalkan kartu.
import { readFile } from 'node:fs/promises';
import { prepareWAMessageMedia, generateWAMessageFromContent } from '@aunucore/baileys';

// MODE SEMENTARA (26 Nov 2026): kartu interaktif DINONAKTIFKAN dari pemanggil.
// relayMessage InteractiveMessage di socket live 2.7.0 tidak pernah sampai dan
// promise-nya diduga tidak settle (menu hening total, fallback tak terjangkau).
// Menunggu hasil deepscan + perbaikan library (HB-500 dan lanjutannya).
export const CARD_ENABLED = false;

const ROOT = new URL('../', import.meta.url); // akar paket bot (src/ satu tingkat di bawah)
const imageCache = new Map(); // kunci sumber -> Buffer

// Selesaikan sumber gambar menjadi Buffer (atau null bila bentuknya diteruskan
// apa adanya ke prepareWAMessageMedia, mis. { stream }).
export async function resolveImage(input, timeoutMs = 12000) {
  if (!input) return null;
  if (Buffer.isBuffer(input) || input instanceof Uint8Array) return input;
  const url = typeof input === 'string' ? input : (typeof input?.url === 'string' ? input.url : null);
  if (!url) return null;
  if (imageCache.has(url)) return imageCache.get(url);
  let buf;
  if (/^https?:\/\//i.test(url)) {
    const res = await fetch(url, { signal: AbortSignal.timeout(timeoutMs) });
    if (!res.ok) throw new Error(`unduh gambar gagal: HTTP ${res.status}`);
    buf = Buffer.from(await res.arrayBuffer());
  } else {
    buf = await readFile(new URL(url.replace(/^\.?\//, ''), ROOT));
  }
  imageCache.set(url, buf);
  return buf;
}

function withTimeout(promise, ms) {
  const guarded = Promise.resolve(promise);
  guarded.catch(() => {}); // telan penolakan susulan setelah timeout menang
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(`persiapan gambar melewati ${ms}ms`)), ms);
  });
  return Promise.race([guarded, timeout]).finally(() => clearTimeout(timer));
}

// Pemetaan tombol — identik dengan mapCardButton di aunu-experimental library.
function mapCardButton(b) {
  if (!b || typeof b !== 'object') return null;
  if (b.name && typeof b.buttonParamsJson !== 'undefined') {
    return {
      name: b.name,
      buttonParamsJson: typeof b.buttonParamsJson === 'string' ? b.buttonParamsJson : JSON.stringify(b.buttonParamsJson ?? {})
    };
  }
  const display_text = b.displayText || b.text || '';
  switch (b.type) {
    case 'url':
      return { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text, url: b.url || '', merchant_url: b.url || '' }) };
    case 'copy':
      return { name: 'cta_copy', buttonParamsJson: JSON.stringify({ display_text, id: b.id || 'copy', copy_code: b.copyCode || '' }) };
    case 'call':
      return { name: 'cta_call', buttonParamsJson: JSON.stringify({ display_text, id: b.phoneNumber || '' }) };
    case 'reply':
    default:
      return { name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text, id: b.id || display_text }) };
  }
}

export async function sendCard(sock, jid, options = {}) {
  let imageMessage = options.imageMessage;
  if (!imageMessage && options.image) {
    const timeoutMs = options.imageTimeoutMs ?? 12000;
    try {
      imageMessage = await withTimeout((async () => {
        const buf = await resolveImage(options.image, timeoutMs);
        const prepared = await prepareWAMessageMedia({ image: buf ?? options.image }, { upload: sock.waUploadToServer });
        return prepared.imageMessage;
      })(), timeoutMs);
    } catch { imageMessage = undefined; } // degradasi anggun: kartu tetap terkirim, tanpa foto
  }
  const buttons = (options.buttons || []).map(mapCardButton).filter(Boolean);
  if (options.likeDislike) {
    buttons.push({ name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: '👍 Suka', id: options.likeId || 'aunu_like' }) });
    buttons.push({ name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: '👎 Tidak Suka', id: options.dislikeId || 'aunu_dislike' }) });
  }
  const interactiveMessage = {
    header: (options.title || options.subtitle || imageMessage)
      ? { title: options.title || '', subtitle: options.subtitle, hasMediaAttachment: !!imageMessage, imageMessage }
      : undefined,
    body: { text: options.text || '' },
    footer: options.footer ? { text: options.footer } : undefined,
    nativeFlowMessage: { buttons, messageParamsJson: '' }
  };
  const content = {
    interactiveMessage,
    messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 }
  };
  const waMsg = generateWAMessageFromContent(jid, content, { userJid: sock.user?.id || '' });
  await sock.relayMessage(jid, waMsg.message, { messageId: waMsg.key.id });
  return waMsg;
}

export default { sendCard, resolveImage };
