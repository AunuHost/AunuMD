// AunuMD • Bola kristal 8: jawab pertanyaan ya/tidak
export const config = { name: 'bola8', alias: ['8ball'], category: 'fun', description: 'Tanya bola kristal ajaib', usage: '.bola8 <pertanyaan>', isOwner: false, isGroup: false, isPrivate: false, cooldown: 3 };

const JAWABAN = [
  '🔮 Sudah pasti. Bintang-bintang setuju.',
  '🔮 Tanpa ragu sedikit pun: YA.',
  '🔮 Semua tanda menunjukkan YA.',
  '🔮 Kemungkinan besar terjadi.',
  '🔮 Bola kristal berkata: coba tanya lagi nanti.',
  '🔮 Kabut masih tebal, jawabannya belum jelas.',
  '🔮 Hmm, lebih baik jangan terlalu berharap dulu.',
  '🔮 Fokus dan tanyakan sekali lagi.',
  '🔮 Jangan mengandalkannya.',
  '🔮 Jawabanku: TIDAK.',
  '🔮 Prospeknya suram, sepertinya tidak.',
  '🔮 Sangat meragukan. Persiapkan rencana cadangan.'
];

export default async function (m, ctx) {
  if (!ctx.text) return ctx.reply(`Pemakaian: ${config.usage}\nContoh: .bola8 apakah besok hujan?`);
  const jawab = JAWABAN[Math.floor(Math.random() * JAWABAN.length)];
  return ctx.reply(`❓ *${ctx.text}*\n\n${jawab}`);
}
