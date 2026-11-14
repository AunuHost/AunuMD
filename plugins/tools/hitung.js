// AunuMD • penghitung statistik teks lokal (karakter, kata, kalimat, waktu baca)
export const config = {
  name: 'hitung',
  alias: ['count', 'hitungteks'],
  category: 'tools',
  description: 'Hitung karakter, kata, kalimat & perkiraan waktu baca sebuah teks',
  usage: '.hitung <teks> (atau reply teks)',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 3
};

export default async function (m, ctx) {
  const text = (ctx.text || '').trim() ? ctx.text : (m.quoted?.text || '');
  if (!text || !text.trim()) { await ctx.reply(`Pemakaian: ${config.usage}`); return; }

  const chars = text.length;
  const charsNoSpace = text.replace(/\s/g, '').length;
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const sentences = text.split(/[.!?]+/).map((s) => s.trim()).filter(Boolean).length;
  const paragraphs = text.split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean).length;
  const lines = text.split('\n').length;
  const readSeconds = Math.ceil((words / 200) * 60);
  const readTime = readSeconds >= 60
    ? `${Math.floor(readSeconds / 60)} menit ${readSeconds % 60} detik`
    : `${readSeconds} detik`;

  await ctx.reply(
    `🔢 *STATISTIK TEKS*\n\n` +
    `• Karakter: *${chars.toLocaleString('id-ID')}*\n` +
    `• Karakter (tanpa spasi): *${charsNoSpace.toLocaleString('id-ID')}*\n` +
    `• Kata: *${words.toLocaleString('id-ID')}*\n` +
    `• Kalimat: *${sentences.toLocaleString('id-ID')}*\n` +
    `• Paragraf: *${paragraphs.toLocaleString('id-ID')}*\n` +
    `• Baris: *${lines.toLocaleString('id-ID')}*\n` +
    `• Perkiraan waktu baca: *±${readTime}* (200 kata/menit)`
  );
}
