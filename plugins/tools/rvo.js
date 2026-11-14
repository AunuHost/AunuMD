// AunuMD • Buka pesan view-once: kirim ulang media quoted sebagai media biasa
export const config = {
  name: 'rvo',
  alias: ['readviewonce'],
  category: 'tools',
  description: 'Buka pesan view-once (sekali lihat): unduh media yang di-reply lalu kirim ulang sebagai media biasa',
  usage: '.rvo (reply pesan view-once/media)',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 3
};

export default async function (m, ctx) {
  if (!m.quoted || typeof m.quoted.download !== 'function') {
    return ctx.reply('Pemakaian: ' + config.usage);
  }
  const buf = await m.quoted.download();
  if (!buf) return ctx.reply('Error: gagal mengunduh media yang di-reply.');
  const type = String(m.quoted.type || '');
  const caption = '🔓 View once dibuka oleh AunuMD';
  try {
    if (type.includes('image')) {
      return ctx.sock.sendMessage(m.chat, { image: buf, caption }, { quoted: m.raw });
    }
    if (type.includes('video')) {
      return ctx.sock.sendMessage(m.chat, { video: buf, caption }, { quoted: m.raw });
    }
    if (type.includes('audio')) {
      return ctx.sock.sendMessage(m.chat, { audio: buf, ptt: true, mimetype: 'audio/ogg; codecs=opus' }, { quoted: m.raw });
    }
    return ctx.sock.sendMessage(m.chat, { document: buf, caption, fileName: 'view-once' }, { quoted: m.raw });
  } catch (e) {
    return ctx.reply('Error: ' + e.message);
  }
}
