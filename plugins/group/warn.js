// AunuMD • memberi peringatan (warn) ke member, 3x warn = kick
export const config = { name: 'warn', alias: [], category: 'group', description: 'Beri peringatan ke member (3x warn akan dikeluarkan)', usage: '.warn @user', isOwner: false, isGroup: true, isPrivate: false, cooldown: 3 };

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
  if (!target) return ctx.reply('Tag/reply member yang ingin diberi peringatan.\nContoh: .warn @user');
  if (target === m.sender) return ctx.reply('Tidak bisa memberi warn ke diri sendiri.');

  const g = ctx.db.groups.get(m.chat) || {};
  g.warns = g.warns || {};
  const n = (g.warns[target] || 0) + 1;
  g.warns[target] = n;
  ctx.db.groups.set(m.chat, g);

  const num = target.split('@')[0];
  try {
    await ctx.sock.sendMessage(
      m.chat,
      { text: `⚠️ @${num} mendapat peringatan ke-${n} dari 3.`, mentions: [target] },
      { quoted: m.raw }
    );
  } catch (e) {
    return ctx.reply('Error: ' + e.message);
  }

  if (n >= 3) {
    if (ctx.isBotAdmin) {
      try {
        await ctx.sock.groupParticipantsUpdate(m.chat, [target], 'remove');
        g.warns[target] = 0;
        ctx.db.groups.set(m.chat, g);
        await ctx.reply(`🚫 @${num} dikeluarkan dari grup karena sudah mencapai 3 peringatan. Warn direset.`);
      } catch (e) {
        await ctx.reply('Error: ' + e.message);
      }
    } else {
      await ctx.reply(`⚠️ @${num} sudah mencapai 3 peringatan, tapi bot bukan admin sehingga tidak bisa mengeluarkannya.`);
    }
  }
}
