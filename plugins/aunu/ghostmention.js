// AunuMD • Mention semua member grup tanpa teks @
export const config = {
  name: 'ghostmention',
  alias: ['gm'],
  category: 'aunu',
  description: 'Kirim teks yang me-mention semua member grup secara tak terlihat',
  usage: '.ghostmention <teks>',
  isOwner: false, isGroup: true, isPrivate: false,
  cooldown: 3
};
export default async function (m, ctx) {
  const teks = ctx.text;
  if (!teks) return ctx.reply('Pemakaian: ' + config.usage);
  try {
    await ctx.sock.aunuGhostMention(m.chat, { text: teks });
  } catch (e) {
    return ctx.reply('Error: ' + e.message);
  }
}
