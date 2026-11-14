// AunuMD • Jadikan member sebagai admin grup
export const config = {
  name: 'promote',
  alias: ['pm'],
  category: 'group',
  description: 'Menjadikan member sebagai admin (admin)',
  usage: '.promote @user / balas pesan user',
  isOwner: false, isGroup: true, isPrivate: false,
  cooldown: 3
};
function collectTargets(m, args) {
  const out = new Set();
  for (const j of m.mentionedJid || []) out.add(j);
  if (m.quoted?.sender) out.add(m.quoted.sender);
  for (const a of args || []) {
    const d = String(a).replace(/\D/g, '');
    if (d.length >= 9) out.add(d + '@s.whatsapp.net');
    else if (String(a).includes('@')) out.add(String(a));
  }
  return [...out];
}
export default async function (m, ctx) {
  const { sock, reply, args } = ctx;
  if (!ctx.isAdmin) return reply('Perintah ini hanya untuk admin grup.');
  if (!ctx.isBotAdmin) return reply('Bot harus menjadi admin grup untuk menjalankan perintah ini.');
  const targets = collectTargets(m, args);
  if (!targets.length) return reply('Pemakaian: ' + config.usage);
  try {
    await sock.groupParticipantsUpdate(m.chat, targets, 'promote');
    reply(`Berhasil menjadikan ${targets.length} member sebagai admin.`);
  } catch (e) {
    reply('Error: ' + e.message);
  }
}
