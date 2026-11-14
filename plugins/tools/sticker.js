// AunuMD • Ubah gambar/video yang dibalas menjadi stiker
import { makeSticker } from '../../src/helper.js';
export const config = {
  name: 'sticker',
  alias: ['s', 'stiker'],
  category: 'tools',
  description: 'Membuat stiker dari gambar/video (balas media)',
  usage: '.sticker (balas gambar/video)',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 5
};
export default async function (m, ctx) {
  const { sock, reply } = ctx;
  if (!m.quoted) return reply('Pemakaian: ' + config.usage);
  const type = m.quoted.type || '';
  if (!type.includes('image') && !type.includes('video')) {
    return reply('Balas sebuah gambar atau video untuk dijadikan stiker.');
  }
  try {
    const buf = await m.quoted.download();
    if (!buf) return reply('Gagal mengunduh media. Coba lagi.');
    const isVideo = type.includes('video');
    const webp = await makeSticker(buf, isVideo);
    await sock.sendMessage(m.chat, { sticker: webp }, { quoted: m.raw });
  } catch (e) {
    reply('Error: ' + e.message);
  }
}
