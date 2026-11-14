// AunuMD • melihat daftar member yang terkena warn
export const config = { name: 'listwarn', alias: [], category: 'group', description: 'Lihat daftar member yang terkena peringatan (warn)', usage: '.listwarn', isOwner: false, isGroup: true, isPrivate: false, cooldown: 3 };

export default async function (m, ctx) {
  const g = ctx.db.groups.get(m.chat) || {};
  const warns = g.warns || {};
  const entries = Object.entries(warns).filter(([, n]) => n > 0);
  if (!entries.length) return ctx.reply('Tidak ada yang terkena warn.');
  const mentions = entries.map(([jid]) => jid);
  const lines = entries.map(([jid, n], i) => `${i + 1}. @${jid.split('@')[0]}: ${n} warn`);
  const text = `⚠️ *Daftar Warn Grup*\n\n${lines.join('\n')}`;
  await ctx.sock.sendMessage(m.chat, { text, mentions }, { quoted: m.raw });
}
