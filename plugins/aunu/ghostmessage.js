// AunuMD • Gelembung pesan kosong
export const config = {
  name: 'ghostmsg',
  alias: ['ghostmessage'],
  category: 'aunu',
  description: 'Kirim gelembung pesan kosong sebanyak 1-10 kali',
  usage: '.ghostmsg [jumlah 1-10]',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 3
};
export default async function (m, ctx) {
  const parsed = parseInt(ctx.args[0], 10);
  const count = Number.isFinite(parsed) && parsed >= 1 && parsed <= 10 ? parsed : 1;
  try {
    await ctx.sock.aunuGhostMessage(m.chat, { count });
  } catch (e) {
    return ctx.reply('Error: ' + e.message);
  }
}
