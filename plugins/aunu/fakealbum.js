// AunuMD • Album dengan klaim jumlah item palsu
export const config = {
  name: 'fakealbum',
  alias: ['falbum'],
  category: 'aunu',
  description: 'Kirim album yang mengklaim jumlah foto/video lebih dari isinya',
  usage: '.fakealbum <klaimFoto> <klaimVideo> (opsional: reply foto)',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 3
};
export default async function (m, ctx) {
  let items = [];
  if (m.quoted && String(m.quoted.type || '').includes('image')) {
    const buf = await m.quoted.download();
    if (buf) items = [buf];
  }
  const klaimFoto = parseInt(ctx.args[0], 10);
  const klaimVideo = parseInt(ctx.args[1], 10);
  const fakeImageCount = Number.isFinite(klaimFoto) && klaimFoto >= 0 ? klaimFoto : items.length;
  const fakeVideoCount = Number.isFinite(klaimVideo) && klaimVideo >= 0 ? klaimVideo : 0;
  try {
    const result = await ctx.sock.aunuFakeAlbum(m.chat, {
      items,
      fakeImageCount,
      fakeVideoCount
    });
    const terkirim = result && result.children ? result.children.length : 0;
    return ctx.reply('Album terkirim ✓ (' + terkirim + ' item nyata, klaim ' + fakeImageCount + ' foto + ' + fakeVideoCount + ' video)');
  } catch (e) {
    return ctx.reply('Error: ' + e.message);
  }
}
