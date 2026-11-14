// AunuMD • Ganti deskripsi grup
export const config = {
  name: 'setdesc',
  alias: ['setdesk'],
  category: 'group',
  description: 'Mengganti deskripsi grup (admin)',
  usage: '.setdesc <deskripsi baru>',
  isOwner: false, isGroup: true, isPrivate: false,
  cooldown: 3
};
export default async function (m, ctx) {
  const { sock, reply, text } = ctx;
  if (!ctx.isAdmin) return reply('Perintah ini hanya untuk admin grup.');
  if (!ctx.isBotAdmin) return reply('Bot harus menjadi admin grup untuk menjalankan perintah ini.');
  if (!text) return reply('Pemakaian: ' + config.usage);
  try {
    await sock.groupUpdateDescription(m.chat, text);
    reply('Deskripsi grup berhasil diganti.');
  } catch (e) {
    reply('Error: ' + e.message);
  }
}
