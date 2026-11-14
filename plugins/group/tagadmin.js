// AunuMD • mention semua admin grup
export const config = { name: 'tagadmin', alias: [], category: 'group', description: 'Mention semua admin grup', usage: '.tagadmin', isOwner: false, isGroup: true, isPrivate: false, cooldown: 3 };

export default async function (m, ctx) {
  try {
    const metadata = await ctx.sock.groupMetadata(m.chat);
    const admins = metadata.participants.filter((p) => p.admin === 'admin' || p.admin === 'superadmin');
    if (!admins.length) return ctx.reply('Tidak ada admin di grup ini.');
    const mentions = admins.map((p) => p.id);
    const lines = admins.map((p) => `• @${p.id.split('@')[0]}${p.admin === 'superadmin' ? ' 👑' : ''}`);
    const text = `🛡️ *Admin Grup ${metadata.subject || ''}*\n\n${lines.join('\n')}`;
    await ctx.sock.sendMessage(m.chat, { text, mentions }, { quoted: m.raw });
  } catch (e) {
    await ctx.reply('Error: ' + e.message);
  }
}
