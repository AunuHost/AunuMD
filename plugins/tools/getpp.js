// AunuMD • Ambil foto profil pengguna
export const config = {
  name: 'getpp',
  alias: ['pp'],
  category: 'tools',
  description: 'Mengambil foto profil pengguna',
  usage: '.getpp @user / balas pesan user',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 3
};
export default async function (m, ctx) {
  const { sock, reply } = ctx;
  const target = (m.mentionedJid && m.mentionedJid[0]) || m.quoted?.sender || m.sender;
  try {
    const url = await sock.profilePictureUrl(target, 'image');
    await sock.sendMessage(
      m.chat,
      { image: { url }, caption: `Foto profil @${target.split('@')[0]}`, mentions: [target] },
      { quoted: m.raw }
    );
  } catch (e) {
    reply('Pengguna itu tidak punya foto profil / tidak bisa diakses.');
  }
}
