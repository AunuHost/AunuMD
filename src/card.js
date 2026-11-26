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
import { prepareWAMessageMedia, generateWAMessageFromContent } from '@aunucore/baileys';

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
    const prepared = await prepareWAMessageMedia({ image: options.image }, { upload: sock.waUploadToServer });
    imageMessage = prepared.imageMessage;
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

export default { sendCard };
