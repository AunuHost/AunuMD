// AunuMD • Lama bot berjalan dan info runtime
export const config = {
  name: 'runtime',
  alias: ['uptime'],
  category: 'tools',
  description: 'Menampilkan lama bot berjalan',
  usage: '.runtime',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 3
};
export default async function (m, ctx) {
  const { reply } = ctx;
  let s = Math.floor(process.uptime());
  const d = Math.floor(s / 86400); s -= d * 86400;
  const h = Math.floor(s / 3600); s -= h * 3600;
  const min = Math.floor(s / 60); s -= min * 60;
  const parts = [];
  if (d) parts.push(`${d} hari`);
  if (h) parts.push(`${h} jam`);
  if (min) parts.push(`${min} menit`);
  parts.push(`${s} detik`);
  const teks = [
    '⏱️ *RUNTIME BOT*',
    '',
    `Aktif selama: ${parts.join(' ')}`,
    `Platform: ${process.platform}`,
    `Node.js: ${process.version}`
  ].join('\n');
  reply(teks);
}
