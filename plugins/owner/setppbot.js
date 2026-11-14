// AunuMD • mengganti foto profil bot dari gambar yang di-quote
export const config = { name: 'setppbot', alias: [], category: 'owner', description: 'Ganti foto profil bot (reply gambar)', usage: '.setppbot (reply gambar)', isOwner: true, isGroup: false, isPrivate: false, cooldown: 3 };

export default async function (m, ctx) {
  if (!m.quoted || !(m.quoted.type || '').includes('image')) {
    return ctx.reply('Reply sebuah gambar, lalu kirim .setppbot');
  }
  try {
    const buf = await m.quoted.download();
    const me = (ctx.sock.user?.id || '').split(':')[0].split('@')[0] + '@s.whatsapp.net';
    await ctx.sock.updateProfilePicture(me, buf);
    await ctx.reply('✅ Foto profil bot berhasil diganti.');
  } catch (e) {
    await ctx.reply('Error: ' + e.message);
  }
}
