// AunuMD • ping & kecepatan respons.
export const config = {
  name: 'ping',
  alias: ['p', 'speed'],
  category: 'main',
  description: 'Cek bot hidup + kecepatan respons',
  usage: '.ping',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 2
};

export default async function (m) {
  const t0 = Date.now();
  await m.react('🏓');
  const dt = Date.now() - t0;
  await m.reply(`🏓 *Pong!*\nRespons: ${dt} ms\nBot aktif sejak ${new Date(Date.now() - process.uptime() * 1000).toLocaleTimeString('id-ID')}`);
}
