// AunuMD • Reset link undangan grup
export const config = {
  name: 'revoke',
  alias: ['revokelink'],
  category: 'group',
  description: 'Mereset link undangan grup (admin)',
  usage: '.revoke',
  isOwner: false, isGroup: true, isPrivate: false,
  cooldown: 3
};
export default async function (m, ctx) {
  const { sock, reply } = ctx;
  if (!ctx.isAdmin) return reply('Perintah ini hanya untuk admin grup.');
  if (!ctx.isBotAdmin) return reply('Bot harus menjadi admin grup untuk menjalankan perintah ini.');
  try {
    await sock.groupRevokeInvite(m.chat);
    const code = await sock.groupInviteCode(m.chat);
    reply(`Link undangan berhasil direset.\n🔗 Link baru: https://chat.whatsapp.com/${code}`);
  } catch (e) {
    reply('Error: ' + e.message);
  }
}
