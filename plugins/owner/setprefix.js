// AunuMD • Ganti prefix perintah bot
export const config = {
  name: 'setprefix',
  alias: [],
  category: 'owner',
  description: 'Mengganti prefix perintah (owner)',
  usage: '.setprefix <1 karakter>',
  isOwner: true, isGroup: false, isPrivate: false,
  cooldown: 3
};
export default async function (m, ctx) {
  const { reply, args, db } = ctx;
  if (!args[0] || args[0].length !== 1) return reply('Pemakaian: ' + config.usage);
  try {
    db.settings.set('prefix', args[0]);
    reply(`Prefix berhasil diganti menjadi: ${args[0]}`);
  } catch (e) {
    reply('Error: ' + e.message);
  }
}
