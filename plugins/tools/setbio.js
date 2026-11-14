// AunuMD • (Owner) Ganti bio / status profil bot
export const config = {
  name: 'setbio',
  alias: [],
  category: 'tools',
  description: '(Owner) Mengubah bio/status profil bot; "clear" untuk mengosongkan',
  usage: '.setbio <teks> | .setbio clear',
  isOwner: true, isGroup: false, isPrivate: false,
  cooldown: 5
};

export default async function (m, ctx) {
  const text = (ctx.text || '').trim();
  const status = text.toLowerCase() === 'clear' ? '' : text;
  try {
    await ctx.sock.updateProfileStatus(status);
    return ctx.reply(status ? `✅ Bio bot diubah menjadi:\n${status}` : '✅ Bio bot dikosongkan.');
  } catch (e) {
    return ctx.reply('Error setbio: ' + e.message);
  }
}
