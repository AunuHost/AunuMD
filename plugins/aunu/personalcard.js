// AunuMD • Kartu personal untuk satu orang (foto profil + namanya sendiri)
export const config = {
  name: 'personalcard',
  alias: ['pcard'],
  category: 'aunu',
  description: 'Mengirim kartu personal (foto profil + nama) untuk satu orang yang ditandai/dibalas',
  usage: '.personalcard @user',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 5
};
export default async function (m, ctx) {
  const { sock, reply } = ctx;
  const target = m.mentionedJid?.[0] || m.quoted?.sender || m.sender;
  try {
    await sock.aunuPersonalCard(m.chat, target, {});
  } catch (e) {
    reply('Error: ' + e.message);
  }
}
