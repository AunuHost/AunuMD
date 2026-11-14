// AunuMD • menghapus pesan yang di-quote
export const config = { name: 'del', alias: ['delete', 'hapus'], category: 'group', description: 'Hapus pesan yang di-reply/quote', usage: '.del (reply pesan)', isOwner: false, isGroup: true, isPrivate: false, cooldown: 3 };

export default async function (m, ctx) {
  if (!m.quoted) return ctx.reply('Reply pesan yang ingin dihapus, lalu kirim .del');
  const allowed = ctx.isAdmin || ctx.isOwner || m.quoted.sender === m.sender;
  if (!allowed) return ctx.reply('⛔ Kamu hanya bisa menghapus pesanmu sendiri. Pesan orang lain hanya bisa dihapus admin/owner.');
  try {
    await ctx.sock.sendMessage(m.chat, { delete: m.quoted.key });
  } catch (e) {
    await ctx.reply('Error: ' + e.message);
  }
}
