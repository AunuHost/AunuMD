// AunuMD • mengganti foto profil grup dari gambar yang di-quote
export const config = { name: 'setppgrup', alias: ['setppgc'], category: 'group', description: 'Ganti foto profil grup (reply gambar)', usage: '.setppgrup (reply gambar)', isOwner: false, isGroup: true, isPrivate: false, cooldown: 3 };

export default async function (m, ctx) {
  if (!ctx.isAdmin) return ctx.reply('⛔ Khusus admin grup.');
  if (!ctx.isBotAdmin) return ctx.reply('⛔ Bot harus jadi admin dulu.');
  if (!m.quoted || !(m.quoted.type || '').includes('image')) {
    return ctx.reply('Reply sebuah gambar, lalu kirim .setppgrup');
  }
  try {
    const buf = await m.quoted.download();
    await ctx.sock.updateProfilePicture(m.chat, buf);
    await ctx.reply('✅ Foto profil grup berhasil diganti.');
  } catch (e) {
    await ctx.reply('Error: ' + e.message);
  }
}
