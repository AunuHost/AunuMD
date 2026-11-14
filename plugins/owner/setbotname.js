// AunuMD • Ganti nama bot
export const config = {
  name: 'setbotname',
  alias: [],
  category: 'owner',
  description: 'Mengganti nama bot (owner)',
  usage: '.setbotname <nama baru>',
  isOwner: true, isGroup: false, isPrivate: false,
  cooldown: 3
};
export default async function (m, ctx) {
  const { reply, text, db } = ctx;
  if (!text) return reply('Pemakaian: ' + config.usage);
  try {
    db.settings.set('botName', text);
    reply(`Nama bot berhasil diganti menjadi: ${text}`);
  } catch (e) {
    reply('Error: ' + e.message);
  }
}
