// AunuMD • Pesan spoiler yang tersembunyi sampai dibuka
export const config = {
  name: 'spoiler',
  alias: ['sp'],
  category: 'aunu',
  description: 'Kirim teks sebagai spoiler',
  usage: '.spoiler <teks>',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 3
};
export default async function (m, ctx) {
  const teks = ctx.text;
  if (!teks) return ctx.reply('Pemakaian: ' + config.usage);
  try {
    await ctx.sock.aunuSendSpoiler(m.chat, { text: teks });
  } catch (e) {
    return ctx.reply('Error: ' + e.message);
  }
}
