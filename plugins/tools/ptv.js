// AunuMD • Kirim ulang video yang di-reply sebagai video lingkaran (PTV)
export const config = {
  name: 'ptv',
  alias: [],
  category: 'tools',
  description: 'Kirim ulang video yang di-reply sebagai video lingkaran / pesan video (PTV)',
  usage: '.ptv (reply video)',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 3
};

export default async function (m, ctx) {
  if (!m.quoted || !String(m.quoted.type || '').includes('video')) {
    return ctx.reply('Pemakaian: ' + config.usage);
  }
  const buf = await m.quoted.download();
  if (!buf) return ctx.reply('Error: gagal mengunduh video yang di-reply.');
  try {
    return ctx.sock.sendMessage(m.chat, { video: buf, ptv: true }, { quoted: m.raw });
  } catch (e) {
    return ctx.reply('Error: ' + e.message);
  }
}
