// AunuMD • OCR: ekstrak teks dari gambar yang di-reply (tesseract.js, offline)
import Tesseract from 'tesseract.js';

export const config = {
  name: 'ocr',
  alias: ['bacagambar', 'imgtotext'],
  category: 'tools',
  description: 'Ekstrak teks dari gambar yang di-reply (OCR lokal via tesseract.js; unduhan data bahasa saat pertama kali bisa lambat)',
  usage: '.ocr (reply gambar)',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 10
};

export default async function (m, ctx) {
  if (!m.quoted || !String(m.quoted.type || '').includes('image')) {
    return ctx.reply('Pemakaian: ' + config.usage);
  }
  const buf = await m.quoted.download();
  if (!buf) return ctx.reply('Error: gagal mengunduh gambar yang di-reply.');
  try {
    await ctx.reply('🔎 Membaca teks pada gambar... (OCR pertama kali bisa lambat karena unduh data bahasa)');
    const { data } = await Tesseract.recognize(buf, 'eng+ind');
    const text = (data?.text || '').trim();
    if (!text) return ctx.reply('Tidak ada teks terbaca pada gambar itu.');
    return ctx.reply('📄 *Hasil OCR:*\n\n' + text.slice(0, 4000));
  } catch (e) {
    return ctx.reply('Error OCR: ' + e.message);
  }
}
