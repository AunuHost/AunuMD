// AunuMD • membuka grup (semua member boleh chat)
export const config = { name: 'bukagrup', alias: ['opengc'], category: 'group', description: 'Buka grup agar semua member bisa mengirim pesan', usage: '.bukagrup', isOwner: false, isGroup: true, isPrivate: false, cooldown: 3 };

export default async function (m, ctx) {
  if (!ctx.isAdmin) return ctx.reply('⛔ Khusus admin grup.');
  if (!ctx.isBotAdmin) return ctx.reply('⛔ Bot harus jadi admin dulu.');
  try {
    await ctx.sock.groupSettingUpdate(m.chat, 'not_announcement');
    await ctx.reply('✅ Grup dibuka. Semua member sekarang bisa mengirim pesan.');
  } catch (e) {
    await ctx.reply('Error: ' + e.message);
  }
}
