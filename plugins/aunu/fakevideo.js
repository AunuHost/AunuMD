// AunuMD • Video dengan klaim durasi palsu
export const config = {
  name: 'fakevideo',
  alias: ['fvid'],
  category: 'aunu',
  description: 'Kirim ulang video dengan klaim durasi palsu',
  usage: '.fakevideo [detik] [caption] (reply video)',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 3
};
export default async function (m, ctx) {
  if (!m.quoted || !String(m.quoted.type || '').includes('video')) {
    return ctx.reply('Pemakaian: ' + config.usage);
  }
  const video = await m.quoted.download();
  if (!video) return ctx.reply('Error: gagal mengunduh video yang di-reply.');
  const parsed = parseInt(ctx.args[0], 10);
  const firstIsNumber = Number.isFinite(parsed) && parsed > 0;
  const fakeSeconds = firstIsNumber ? parsed : 3600;
  const caption = firstIsNumber ? ctx.args.slice(1).join(' ') : ctx.text;
  try {
    await ctx.sock.aunuFakeVideo(m.chat, {
      video,
      fakeSeconds,
      caption: caption || undefined
    });
  } catch (e) {
    return ctx.reply('Error: ' + e.message);
  }
}
