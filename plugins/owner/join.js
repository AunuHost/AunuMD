// AunuMD • Bot bergabung ke grup lewat link undangan
export const config = {
  name: 'join',
  alias: [],
  category: 'owner',
  description: 'Bot bergabung ke grup via link (owner)',
  usage: '.join <link grup>',
  isOwner: true, isGroup: false, isPrivate: false,
  cooldown: 3
};
export default async function (m, ctx) {
  const { sock, reply, text } = ctx;
  const match = (text || '').match(/chat\.whatsapp\.com\/([0-9A-Za-z]+)/);
  if (!match) return reply('Pemakaian: ' + config.usage);
  try {
    const jid = await sock.groupAcceptInvite(match[1]);
    reply(`Berhasil bergabung ke grup: ${jid}`);
  } catch (e) {
    reply('Error: ' + e.message);
  }
}
