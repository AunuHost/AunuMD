// AunuMD • info script & repositori bot.
export const config = {
  name: 'script',
  alias: ['sc', 'sourcecode'],
  category: 'info',
  description: 'Info script dan repositori bot',
  usage: '.script',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 3
};

export default async function (m, ctx) {
  const { total } = ctx.listPlugins();
  await ctx.reply(
    `📦 *Script ${ctx.config.botName || 'AunuMD'}*\n\n` +
    `🤖 Bot: ${ctx.config.botName || 'AunuMD'}\n` +
    `🔗 Repo: ${ctx.config.repo || '-'}\n` +
    `🧩 Total plugin: ${total}\n\n` +
    `⚡ Powered by @aunucore/baileys — AunuBaileys by AunuCore Creative Network`
  );
}
