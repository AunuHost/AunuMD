// AunuMD • melihat daftar admin grup
export const config = { name: 'listadmin', alias: ['adminlist'], category: 'group', description: 'Lihat daftar admin grup beserta perannya', usage: '.listadmin', isOwner: false, isGroup: true, isPrivate: false, cooldown: 3 };

export default async function (m, ctx) {
  try {
    const metadata = await ctx.sock.groupMetadata(m.chat);
    const admins = metadata.participants.filter((p) => p.admin === 'admin' || p.admin === 'superadmin');
    if (!admins.length) return ctx.reply('Tidak ada admin di grup ini.');
    const mentions = admins.map((p) => p.id);
    const lines = admins.map((p, i) => {
      const name = ctx.db.users.get(p.id)?.name;
      const role = p.admin === 'superadmin' ? '👑 Superadmin' : '🛡️ Admin';
      const label = name ? `${name} (@${p.id.split('@')[0]})` : `@${p.id.split('@')[0]}`;
      return `${i + 1}. ${label} — ${role}`;
    });
    const text = `🛡️ *Daftar Admin Grup ${metadata.subject || ''}*\n\n${lines.join('\n')}`;
    await ctx.sock.sendMessage(m.chat, { text, mentions }, { quoted: m.raw });
  } catch (e) {
    await ctx.reply('Error: ' + e.message);
  }
}
