// AunuMD • (Owner) Ganti foto profil bot dari gambar yang di-reply — versi kategori tools
export const config = {
  name: 'setpp',
  alias: [],
  category: 'tools',
  description: '(Owner) Mengubah foto profil bot dari gambar yang di-reply',
  usage: '.setpp (reply gambar)',
  isOwner: true, isGroup: false, isPrivate: false,
  cooldown: 10
};

export default async function (m, ctx) {
  if (!m.quoted || !String(m.quoted.type || '').includes('image')) {
    return ctx.reply('Pemakaian: ' + config.usage);
  }
  const buf = await m.quoted.download();
  if (!buf) return ctx.reply('Error: gagal mengunduh gambar yang di-reply.');
  const rawId = ctx.sock.user?.id || '';
  const bare = rawId.split('@')[0].split(':')[0];
  if (!bare) return ctx.reply('Error: JID bot tidak ditemukan (sock.user kosong).');
  try {
    await ctx.sock.updateProfilePicture(`${bare}@s.whatsapp.net`, buf);
    return ctx.reply('✅ Foto profil bot berhasil diperbarui!');
  } catch (e) {
    return ctx.reply('Error setpp: ' + e.message);
  }
}
