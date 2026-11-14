// AunuMD • Pesan lenyap dengan timer kustom
export const config = {
  name: 'vanish',
  alias: ['lenyap'],
  category: 'aunu',
  description: 'Kirim pesan yang lenyap setelah durasi tertentu',
  usage: '.vanish <durasi> <teks>',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 3
};
export default async function (m, ctx) {
  const durasi = ctx.args[0];
  const teks = ctx.args.slice(1).join(' ');
  if (!durasi || !teks) return ctx.reply('Pemakaian: ' + config.usage);
  try {
    await ctx.sock.aunuVanish(m.chat, { text: teks }, durasi);
  } catch (e) {
    return ctx.reply('Error: ' + e.message);
  }
}
