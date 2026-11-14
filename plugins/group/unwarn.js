// AunuMD • mengurangi peringatan (warn) member
export const config = { name: 'unwarn', alias: [], category: 'group', description: 'Kurangi 1 peringatan (warn) member', usage: '.unwarn @user', isOwner: false, isGroup: true, isPrivate: false, cooldown: 3 };

function getTarget(m, ctx) {
  const targets = new Set();
  for (const jid of m.mentionedJid || []) targets.add(jid);
  if (m.quoted?.sender) targets.add(m.quoted.sender);
  for (const a of ctx.args || []) {
    const num = String(a).replace(/\D/g, '');
    if (num.length >= 9) targets.add(num + '@s.whatsapp.net');
  }
  return [...targets][0] || null;
}

export default async function (m, ctx) {
  if (!ctx.isAdmin) return ctx.reply('⛔ Khusus admin grup.');
  const target = getTarget(m, ctx);
  if (!target) return ctx.reply('Tag/reply member yang ingin dikurangi peringatannya.\nContoh: .unwarn @user');

  const g = ctx.db.groups.get(m.chat) || {};
  g.warns = g.warns || {};
  const sisa = Math.max(0, (g.warns[target] || 0) - 1);
  g.warns[target] = sisa;
  ctx.db.groups.set(m.chat, g);

  await ctx.reply(`✅ Peringatan @${target.split('@')[0]} dikurangi. Sisa warn: ${sisa} dari 3.`);
}
