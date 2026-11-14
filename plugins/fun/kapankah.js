// AunuMD • Jawab pertanyaan "kapankah" dengan waktu acak
export const config = { name: 'kapankah', alias: [], category: 'fun', description: 'Jawab pertanyaan kapankah… dengan tebakan waktu', usage: '.kapankah <pertanyaan>', isOwner: false, isGroup: false, isPrivate: false, cooldown: 3 };

const WAKTU = [
  'Besok.', 'Minggu depan.', 'Tahun depan.', 'Dalam 3 hari lagi.',
  'Nanti malam.', '5 tahun lagi.', 'Tidak akan pernah. 😅',
  'Sebentar lagi, sabar ya.', 'Bulan depan, catat tanggalnya.',
  'Saat kamu paling tidak menyangkanya.'
];

export default async function (m, ctx) {
  if (!ctx.text) return ctx.reply(`Pemakaian: ${config.usage}\nContoh: .kapankah aku kaya?`);
  const jawab = WAKTU[Math.floor(Math.random() * WAKTU.length)];
  return ctx.reply(`❓ Kapankah ${ctx.text.replace(/^kapankah\s+/i, '')}\n\n🕒 *${jawab}*`);
}
