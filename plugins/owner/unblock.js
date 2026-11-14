// AunuMD • membuka blokir nomor pengguna
export const config = { name: 'unblock', alias: [], category: 'owner', description: 'Buka blokir nomor pengguna', usage: '.unblock @user / 628xxxx', isOwner: true, isGroup: false, isPrivate: false, cooldown: 3 };

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
  if (!target) return ctx.reply('Sertakan nomor/tag/reply target yang ingin dibuka blokirnya.\nContoh: .unblock 6281234567890');
  try {
    await ctx.sock.updateBlockStatus(target, 'unblock');
    await ctx.reply(`✅ Blokir nomor @${target.split('@')[0]} berhasil dibuka.`);
  } catch (e) {
    await ctx.reply('Error: ' + e.message);
  }
}
