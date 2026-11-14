// AunuMD • Bot keluar dari grup ini
export const config = {
  name: 'leave',
  alias: ['keluar'],
  category: 'owner',
  description: 'Bot keluar dari grup (owner)',
  usage: '.leave',
  isOwner: true, isGroup: false, isPrivate: false,
  cooldown: 3
};
export default async function (m, ctx) {
  const { sock, reply } = ctx;
  if (!m.isGroup) return reply('Perintah ini dipakai di dalam grup yang ingin ditinggalkan bot.');
  try {
    await reply('Sampai jumpa 👋');
    await sock.groupLeave(m.chat);
  } catch (e) {
    reply('Error: ' + e.message);
  }
}
