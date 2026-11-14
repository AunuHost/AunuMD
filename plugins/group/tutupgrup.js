// AunuMD • menutup grup (hanya admin yang bisa chat)
export const config = { name: 'tutupgrup', alias: ['closegc'], category: 'group', description: 'Tutup grup agar hanya admin yang bisa mengirim pesan', usage: '.tutupgrup', isOwner: false, isGroup: true, isPrivate: false, cooldown: 3 };

export default async function (m, ctx) {
  if (!ctx.isAdmin) return ctx.reply('⛔ Khusus admin grup.');
  if (!ctx.isBotAdmin) return ctx.reply('⛔ Bot harus jadi admin dulu.');
  try {
    await ctx.sock.groupSettingUpdate(m.chat, 'announcement');
    await ctx.reply('✅ Grup ditutup. Hanya admin yang bisa mengirim pesan.');
  } catch (e) {
    await ctx.reply('Error: ' + e.message);
  }
}
