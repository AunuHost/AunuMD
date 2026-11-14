// AunuMD • Foto jebakan: thumbnail umpan berbeda dari foto asli
export const config = {
  name: 'trapimage',
  alias: ['trap'],
  category: 'aunu',
  description: 'Kirim foto dengan thumbnail umpan yang berbeda dari foto aslinya',
  usage: '.trapimage <caption opsional> (reply foto)',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 3
};
export default async function (m, ctx) {
  if (!m.quoted || !String(m.quoted.type || '').includes('image')) {
    return ctx.reply('Pemakaian: ' + config.usage);
  }
  const image = await m.quoted.download();
  if (!image) return ctx.reply('Error: gagal mengunduh foto yang di-reply.');
  let decoy;
  const thumb = ctx.config.thumbnail;
  if (thumb && /^https?:\/\//.test(thumb)) {
    try {
      const res = await fetch(thumb);
      if (res.ok) decoy = Buffer.from(await res.arrayBuffer());
    } catch {
      decoy = undefined;
    }
  }
  try {
    await ctx.sock.aunuTrapImage(m.chat, {
      image,
      thumbnail: decoy,
      caption: ctx.text || undefined
    });
  } catch (e) {
    return ctx.reply('Error: ' + e.message);
  }
}
