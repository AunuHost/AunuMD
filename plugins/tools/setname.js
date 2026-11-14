// AunuMD • ganti nama profil bot (khusus owner)
export const config = {
  name: 'setnamebot',
  alias: ['setnamebot'],
  category: 'tools',
  description: 'Ganti nama profil bot (1–25 karakter, khusus owner)',
  usage: '.setnamebot <nama baru>',
  isOwner: true, isGroup: false, isPrivate: false,
  cooldown: 5
};

export default async function (m, ctx) {
  const name = (ctx.text || '').trim();
  if (!name) { await ctx.reply(`Pemakaian: ${config.usage}`); return; }
  if (name.length > 25) { await ctx.reply('❌ Nama profil maksimal 25 karakter.'); return; }
  try {
    await ctx.sock.updateProfileName(name);
    await ctx.reply(`✅ Nama profil bot diganti menjadi *${name}*`);
  } catch (e) {
    await ctx.reply(`❌ Error: ${e.message}`);
  }
}
