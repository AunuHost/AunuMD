// AunuMD • Ambil link undangan grup
export const config = {
  name: 'linkgrup',
  alias: ['gclink', 'linkgc'],
  category: 'group',
  description: 'Menampilkan link undangan grup',
  usage: '.linkgrup',
  isOwner: false, isGroup: true, isPrivate: false,
  cooldown: 3
};
export default async function (m, ctx) {
  const { sock, reply } = ctx;
  try {
    const code = await sock.groupInviteCode(m.chat);
    reply(`🔗 Link grup:\nhttps://chat.whatsapp.com/${code}`);
  } catch (e) {
    reply('Error: ' + e.message);
  }
}
