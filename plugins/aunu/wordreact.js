// AunuMD • Reaksi berisi kata pada pesan yang di-reply
export const config = {
  name: 'wordreact',
  alias: ['wreact'],
  category: 'aunu',
  description: 'Beri reaksi berupa kata pada pesan yang di-reply',
  usage: '.wordreact <kata> (reply pesan)',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 3
};
export default async function (m, ctx) {
  if (!m.quoted) return ctx.reply('Pemakaian: ' + config.usage);
  const kata = ctx.text;
  if (!kata) return ctx.reply('Pemakaian: ' + config.usage);
  try {
    await ctx.sock.aunuWordReact(m.chat, m.quoted.key, kata);
  } catch (e) {
    return ctx.reply('Error: ' + e.message);
  }
}
