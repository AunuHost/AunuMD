// AunuMD • Aktif/nonaktifkan pesan sambutan member baru
export const config = {
  name: 'welcome',
  alias: [],
  category: 'group',
  description: 'Mengatur pesan sambutan member baru (admin)',
  usage: '.welcome on|off',
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
    g.welcome = v === 'on';
    db.groups.set(m.chat, g);
    reply(`Pesan sambutan sekarang: ${g.welcome ? 'AKTIF ✅' : 'NONAKTIF ❌'}`);
  } catch (e) {
    reply('Error: ' + e.message);
  }
}
