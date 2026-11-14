// AunuMD • Kartu lokasi rekayasa
export const config = {
  name: 'fakelocation',
  alias: ['floc'],
  category: 'aunu',
  description: 'Kirim kartu lokasi Monas dengan nama tempat bebas',
  usage: '.fakelocation [nama tempat]',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 3
};
export default async function (m, ctx) {
  const nama = ctx.text || 'Monas';
  try {
    await ctx.sock.aunuFakeLocation(m.chat, {
      lat: -6.175392,
      lng: 106.827153,
      name: nama,
      address: 'Jakarta, Indonesia'
    });
  } catch (e) {
    return ctx.reply('Error: ' + e.message);
  }
}
