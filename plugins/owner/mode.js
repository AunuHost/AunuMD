// AunuMD • Atur mode bot public/self
export const config = {
  name: 'mode',
  alias: [],
  category: 'owner',
  description: 'Mengatur mode bot: public atau self (owner)',
  usage: '.mode public|self',
  isOwner: true, isGroup: false, isPrivate: false,
  cooldown: 3
};
export default async function (m, ctx) {
  const { reply, args, db } = ctx;
  const v = (args[0] || '').toLowerCase();
  if (!v) {
    const current = db.settings.get('mode') || ctx.config.mode || 'public';
    return reply(`Mode bot saat ini: ${current}\nPemakaian: ${config.usage}`);
  }
  if (v !== 'public' && v !== 'self') return reply('Pemakaian: ' + config.usage);
  try {
    db.settings.set('mode', v);
    reply(`Mode bot berhasil diganti menjadi: ${v}`);
  } catch (e) {
    reply('Error: ' + e.message);
  }
}
