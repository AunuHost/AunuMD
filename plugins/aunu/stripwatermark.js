// AunuMD • Menghapus watermark tak terlihat dari teks
export const config = {
  name: 'stripwm',
  alias: ['stripwatermark'],
  category: 'aunu',
  description: 'Membersihkan watermark zero-width dari teks',
  usage: '.stripwm <teks>',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 3
};
export default async function (m, ctx) {
  const { sock, text, reply } = ctx;
  const target = m.quoted?.text || text;
  if (!target) return reply(`Pemakaian: ${config.usage} — atau balas sebuah teks ber-watermark.`);
  try {
    const bersih = sock.aunuStripWatermark(target);
    reply(bersih || '(teks kosong setelah dibersihkan)');
  } catch (e) {
    reply('Error: ' + e.message);
  }
}
