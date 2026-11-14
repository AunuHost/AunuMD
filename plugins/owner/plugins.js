// AunuMD • Daftar semua plugin terdaftar
export const config = {
  name: 'plugins',
  alias: ['listplugin'],
  category: 'owner',
  description: 'Menampilkan daftar plugin per kategori (owner)',
  usage: '.plugins',
  isOwner: true, isGroup: false, isPrivate: false,
  cooldown: 3
};
export default async function (m, ctx) {
  const { reply } = ctx;
  try {
    const { total, categories } = ctx.listPlugins();
    const lines = [`🔌 *DAFTAR PLUGIN* — total ${total}`, ''];
    for (const [cat, arr] of categories) {
      const names = arr.map((p) => p.config.name).join(', ');
      lines.push(`• *${cat}* (${arr.length}): ${names}`);
    }
    reply(lines.join('\n'));
  } catch (e) {
    reply('Error: ' + e.message);
  }
}
