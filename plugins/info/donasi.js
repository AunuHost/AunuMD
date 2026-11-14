// AunuMD • info donasi untuk mendukung pengembangan bot.
export const config = {
  name: 'donasi',
  alias: ['donate', 'traktir'],
  category: 'info',
  description: 'Tautan donasi untuk mendukung bot',
  usage: '.donasi',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 3
};

export default async function (m, ctx) {
  if (!ctx.config.donate) { await ctx.reply('Belum ada tautan donasi.'); return; }
  await ctx.reply(
    `🙏 *Terima Kasih!*\n\n` +
    `Dukunganmu membantu ${ctx.config.botName || 'AunuMD'} tetap hidup dan terus dikembangkan.\n\n` +
    `💖 Donasi: ${ctx.config.donate}\n` +
    `🌐 Web: ${ctx.config.web || '-'}`
  );
}
