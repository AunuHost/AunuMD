// AunuMD • serializer pesan: mengubah WAMessage mentah menjadi objek m yang nyaman untuk plugin.
import { downloadMediaMessage, getContentType } from '@aunucore/baileys';
import config from '../config.js';
import { getSetting } from './database.js';
import { sendRichText } from './rich.js';

function unwrap(content) {
  // Buka bungkus ephemeral / view-once agar tipe isi sebenarnya yang terbaca.
  let type = getContentType(content);
  let msg = content?.[type];
  let guard = 0;
  while (msg && typeof msg === 'object' && msg.message && guard++ < 4 &&
    ['ephemeralMessage', 'viewOnceMessage', 'viewOnceMessageV2', 'documentWithCaptionMessage'].includes(type)) {
    content = msg.message;
    type = getContentType(content);
    msg = content?.[type];
  }
  return { content, type, msg: msg || {} };
}

function textFrom(type, msg) {
  // 'conversation' berisi string polos — tangani sebelum penjaga objek.
  if (type === 'conversation') return typeof msg === 'string' ? msg : '';
  if (!msg || typeof msg !== 'object') return '';
  switch (type) {
    case 'extendedTextMessage': return msg.text || '';
    case 'imageMessage':
    case 'videoMessage':
    case 'documentMessage': return msg.caption || '';
    case 'buttonsResponseMessage': return msg.selectedButtonId || '';
    case 'listResponseMessage': return msg.singleSelectReply?.selectedRowId || '';
    case 'templateButtonReplyMessage': return msg.selectedId || '';
    default: return msg.text || msg.caption || '';
  }
}

export function smsg(sock, raw, logger) {
  const m = {
    raw,
    key: raw.key || {},
    id: raw.key?.id || '',
    chat: raw.key?.remoteJid || '',
    fromMe: !!raw.key?.fromMe,
    pushName: raw.pushName || ''
  };
  m.isGroup = m.chat.endsWith('@g.us');
  m.sender = m.isGroup ? (raw.key.participant || raw.participant || m.chat) : m.chat;
  m.senderAlt = (m.isGroup ? (raw.key.participantAlt || raw.participantAlt) : raw.key.remoteJidAlt) || null;

  const { content, type, msg } = unwrap(raw.message || {});
  m.type = type || '';
  m.msg = msg;
  m.text = textFrom(m.type, msg);
  m.mentionedJid = msg?.contextInfo?.mentionedJid || [];

  const ci = msg?.contextInfo;
  if (ci?.quotedMessage) {
    const q = unwrap(ci.quotedMessage);
    m.quoted = {
      key: {
        remoteJid: m.chat,
        fromMe: false,
        id: ci.stanzaId || '',
        participant: ci.participant || undefined
      },
      sender: ci.participant || '',
      type: q.type || '',
      msg: q.msg,
      text: textFrom(q.type, q.msg),
      download: async () => {
        try {
          return await downloadMediaMessage(
            { key: m.quoted.key, message: ci.quotedMessage },
            'buffer',
            {},
            { logger, reuploadRequest: sock.updateMediaMessage }
          );
        } catch { return null; }
      }
    };
  } else {
    m.quoted = null;
  }

  // SEMUA balasan teks bot berangkat sebagai rich response (fallback teks polos di dalam sendRichText).
  m.reply = (text) => sendRichText(sock, m.chat, text, { quoted: raw, title: getSetting('botName', config.botName) });
  m.react = (emoji) => sock.sendMessage(m.chat, { react: { text: emoji, key: raw.key } });
  return m;
}

export default smsg;
