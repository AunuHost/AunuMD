// AunuMD • Jawab pertanyaan "apakah" secara acak
export const config = { name: 'apakah', alias: [], category: 'fun', description: 'Jawab pertanyaan apakah… secara acak', usage: '.apakah <pertanyaan>', isOwner: false, isGroup: false, isPrivate: false, cooldown: 3 };

const JAWABAN = [
  'Ya.', 'Tidak.', 'Mungkin.', 'Pasti!', 'Jelas tidak.',
  'Kemungkinan besar ya.', 'Sepertinya tidak.', 'Seratus persen ya!'
];
const EMOJI = [' 🤔', ' 😌', ' 🙃', ' ✨', ' 👀', ''];

export default async function (m, ctx) {
  if (!ctx.text) return ctx.reply(`Pemakaian: ${config.usage}\nContoh: .apakah besok libur?`);
  const jawab = JAWABAN[Math.floor(Math.random() * JAWABAN.length)];
  const emoji = EMOJI[Math.floor(Math.random() * EMOJI.length)];
  return ctx.reply(`❓ Apakah ${ctx.text.replace(/^apakah\s+/i, '')}\n\n💬 *${jawab}*${emoji}`);
}
