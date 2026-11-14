// AunuMD • hapus foto profil bot (khusus owner)
export const config = {
  name: 'delpp',
  alias: ['removepp', 'hapuspp'],
  category: 'tools',
  description: 'Hapus foto profil bot (khusus owner)',
  usage: '.delpp',
  isOwner: true, isGroup: false, isPrivate: false,
  cooldown: 5
};

export default async function (m, ctx) {
  try {
    const jidBare = String(ctx.sock.user?.id || '').split(':')[0].split('@')[0] + '@s.whatsapp.net';
    await ctx.sock.removeProfilePicture(jidBare);
    await ctx.reply('✅ Foto profil bot berhasil dihapus.');
  } catch (e) {
    await ctx.reply(`❌ Error: ${e.message}`);
  }
}
