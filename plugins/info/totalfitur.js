// AunuMD • bukti jumlah fitur: total perintah + rincian per kategori.
export const config = {
  name: 'totalfitur',
  alias: ['fitur', 'totalcmd'],
  category: 'info',
  description: 'Total fitur bot dan rincian per kategori',
  usage: '.totalfitur',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 3
};

export default async function (m, ctx) {
  const { total, categories } = ctx.listPlugins();
  const rows = [...categories.entries()]
    .map(([name, list]) => ({ name, count: Array.isArray(list) ? list.length : list }))
    .sort((a, b) => b.count - a.count);
  const detail = rows.map((r) => `• ${r.name}: ${r.count} perintah`).join('\n');
  await ctx.reply(
    `🧩 *Total Fitur ${ctx.config.botName || 'AunuMD'}*\n\n` +
    `✨ Total: *${total} perintah* dari ${rows.length} kategori\n\n` +
    `${detail}`
  );
}
