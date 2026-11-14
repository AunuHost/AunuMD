// AunuMD • Membaca watermark yang tersembunyi di dalam teks
export const config = {
  name: 'readwm',
  alias: ['readwatermark'],
  category: 'aunu',
  description: 'Membaca tag watermark dari teks (balas teks ber-watermark atau sertakan teksnya)',
  usage: '.readwm <teks>',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 3
};
export default async function (m, ctx) {
  const { sock, text, reply } = ctx;
  const target = m.quoted?.text || text;
  if (!target) return reply(`Pemakaian: ${config.usage} — atau balas sebuah teks ber-watermark.`);
  try {
    const tag = sock.aunuReadWatermark(target);
    reply(tag ? `Watermark ditemukan: ${tag}` : 'Tidak ada watermark pada teks itu.');
  } catch (e) {
    reply('Error: ' + e.message);
  }
}
