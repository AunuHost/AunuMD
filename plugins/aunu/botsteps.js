// AunuMD • Pesan langkah-progress bot yang ter-update di tempat
export const config = {
  name: 'botsteps',
  alias: ['steps'],
  category: 'aunu',
  description: 'Tampilkan pesan progress bertahap ala bot AI',
  usage: '.botsteps <teks>',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 3
};
const tunggu = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
export default async function (m, ctx) {
  try {
    const ctl = await ctx.sock.aunuBotSteps(m.chat, {
      title: ctx.config.botName,
      body: ctx.text || 'Memproses permintaan…'
    });
    await tunggu(900);
    await ctl.step({ body: 'Menyusun hasil…' });
    await tunggu(900);
    await ctl.done('Selesai ✓');
  } catch (e) {
    return ctx.reply('Error: ' + e.message);
  }
}
