// AunuMD • Ganti nama/judul grup
export const config = {
  name: 'setname',
  alias: ['setjudul'],
  category: 'group',
  description: 'Mengganti nama grup (admin)',
  usage: '.setname <nama baru>',
  isOwner: false, isGroup: true, isPrivate: false,
  cooldown: 3
};
export default async function (m, ctx) {
  const { sock, reply, text } = ctx;
  if (!ctx.isAdmin) return reply('Perintah ini hanya untuk admin grup.');
  if (!ctx.isBotAdmin) return reply('Bot harus menjadi admin grup untuk menjalankan perintah ini.');
  if (!text) return reply('Pemakaian: ' + config.usage);
  try {
    await sock.groupUpdateSubject(m.chat, text);
    reply('Nama grup berhasil diganti.');
  } catch (e) {
    reply('Error: ' + e.message);
  }
}
