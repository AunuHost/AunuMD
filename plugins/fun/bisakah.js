// AunuMD • Jawab pertanyaan "bisakah" secara acak
export const config = { name: 'bisakah', alias: [], category: 'fun', description: 'Jawab pertanyaan bisakah… secara acak', usage: '.bisakah <pertanyaan>', isOwner: false, isGroup: false, isPrivate: false, cooldown: 3 };

const JAWABAN = [
  'Bisa banget, gas! 💪', 'Bisa, asal mau usaha.', 'Kemungkinan besar bisa.',
  'Bisa, tapi tidak semudah itu.', 'Hmm, kemungkinannya kecil.',
  'Sepertinya tidak bisa.', 'Jelas tidak bisa, jangan dipaksa.',
  'Bisa! Tinggal mulai saja dari sekarang.'
];
const EMOJI = [' 🤔', ' 😎', ' 🙌', ' ✨', ''];

export default async function (m, ctx) {
  if (!ctx.text) return ctx.reply(`Pemakaian: ${config.usage}\nContoh: .bisakah aku lulus ujian?`);
  const jawab = JAWABAN[Math.floor(Math.random() * JAWABAN.length)];
  const emoji = EMOJI[Math.floor(Math.random() * EMOJI.length)];
  return ctx.reply(`❓ Bisakah ${ctx.text.replace(/^bisakah\s+/i, '')}\n\n💬 *${jawab}*${emoji}`);
}
