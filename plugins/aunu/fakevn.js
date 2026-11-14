// AunuMD • Voice note dengan durasi palsu
export const config = {
  name: 'fakevn',
  alias: ['fvn'],
  category: 'aunu',
  description: 'Kirim ulang audio sebagai voice note dengan klaim durasi palsu',
  usage: '.fakevn [detik] (reply audio)',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 3
};
export default async function (m, ctx) {
  if (!m.quoted || !String(m.quoted.type || '').includes('audio')) {
    return ctx.reply('Pemakaian: ' + config.usage);
  }
  const audio = await m.quoted.download();
  if (!audio) return ctx.reply('Error: gagal mengunduh audio yang di-reply.');
  const parsed = parseInt(ctx.args[0], 10);
  const seconds = Number.isFinite(parsed) && parsed > 0 ? parsed : 3600;
  try {
    await ctx.sock.aunuFakeVN(m.chat, { audio, seconds });
  } catch (e) {
    return ctx.reply('Error: ' + e.message);
  }
}
