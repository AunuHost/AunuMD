// AunuMD • Kartu promo dengan tombol salin kode
export const config = {
  name: 'promocode',
  alias: ['promo'],
  category: 'aunu',
  description: 'Mengirim kartu promo berisi kode dengan tombol salin',
  usage: '.promocode <KODE> <teks>',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 5
};
export default async function (m, ctx) {
  const { sock, args, reply } = ctx;
  const botCfg = ctx.config;
  const code = args[0];
  if (!code) return reply(`Pemakaian: ${config.usage}`);
  const sisa = args.slice(1).join(' ') || 'Gunakan kode ini sebelum kehabisan!';
  try {
    await sock.aunuPromoCode(m.chat, {
      code,
      title: botCfg.botName,
      text: sisa,
      buttonText: 'Salin Kode'
    });
  } catch (e) {
    reply('Error: ' + e.message);
  }
}
