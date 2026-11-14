// AunuMD • memblokir nomor pengguna
export const config = { name: 'block', alias: [], category: 'owner', description: 'Blokir nomor pengguna', usage: '.block @user / 628xxxx', isOwner: true, isGroup: false, isPrivate: false, cooldown: 3 };

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
  const target = getTarget(m, ctx);
  if (!target) return ctx.reply('Sertakan nomor/tag/reply target yang ingin diblokir.\nContoh: .block 6281234567890');
  try {
    await ctx.sock.updateBlockStatus(target, 'block');
    await ctx.reply(`🚫 Nomor @${target.split('@')[0]} berhasil diblokir.`);
  } catch (e) {
    await ctx.reply('Error: ' + e.message);
  }
}
