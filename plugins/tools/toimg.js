// AunuMD • Ubah stiker yang dibalas menjadi gambar
export const config = {
  name: 'toimg',
  alias: ['toimage'],
  category: 'tools',
  description: 'Mengubah stiker menjadi gambar (balas stiker)',
  usage: '.toimg (balas stiker)',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 5
};
export default async function (m, ctx) {
  const { sock, reply } = ctx;
  if (!m.quoted) return reply('Pemakaian: ' + config.usage);
  const type = m.quoted.type || '';
  if (type !== 'stickerMessage' && !type.includes('sticker')) {
    return reply('Balas sebuah stiker untuk diubah menjadi gambar.');
  }
  try {
    const buf = await m.quoted.download();
    if (!buf) return reply('Gagal mengunduh stiker. Coba lagi.');
    await sock.sendMessage(m.chat, { image: buf, caption: 'Hasil konversi' }, { quoted: m.raw });
  } catch (e) {
    reply('Error: ' + e.message);
  }
}
