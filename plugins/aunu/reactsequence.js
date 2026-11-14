// AunuMD • Mengirim rangkaian reaksi emoji ke sebuah pesan
export const config = {
  name: 'reactseq',
  alias: ['reactsequence'],
  category: 'aunu',
  description: 'Bereaksi ke pesan yang dibalas dengan rangkaian emoji berurutan',
  usage: '.reactseq <emoji1, emoji2, ...>',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 5
};
export default async function (m, ctx) {
  const { sock, text, reply } = ctx;
  if (!m.quoted) return reply('Balas sebuah pesan dengan perintah ini.');
  let emojis = (text || '').split(/[,\s]+/).filter(Boolean);
  if (emojis.length === 0) emojis = ['✨', '🔥', '💯'];
  try {
    const terkirim = await sock.aunuReactSequence(m.chat, m.quoted.key, emojis, {});
    reply(`${terkirim} reaksi terkirim.`);
  } catch (e) {
    reply('Error: ' + e.message);
  }
}
