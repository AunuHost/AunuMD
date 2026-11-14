// AunuMD • Aktif/nonaktifkan anti-link grup
export const config = {
  name: 'antilink',
  alias: [],
  category: 'group',
  description: 'Mengatur anti-link grup (admin)',
  usage: '.antilink on|off',
  isOwner: false, isGroup: true, isPrivate: false,
  cooldown: 3
};
export default async function (m, ctx) {
  const { reply, args, db } = ctx;
  if (!ctx.isAdmin) return reply('Perintah ini hanya untuk admin grup.');
  const v = (args[0] || '').toLowerCase();
  if (v !== 'on' && v !== 'off') return reply('Pemakaian: ' + config.usage);
  try {
    const g = db.groups.get(m.chat) || {};
    g.antilink = v === 'on';
    db.groups.set(m.chat, g);
    reply(`Anti-link sekarang: ${g.antilink ? 'AKTIF ✅' : 'NONAKTIF ❌'}`);
  } catch (e) {
    reply('Error: ' + e.message);
  }
}
