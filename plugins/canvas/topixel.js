// AunuMD • Ubah foto menjadi pixel art
import { pixelatePng } from '../../src/canvas.js';

export const config = {
  name: 'topixel',
  alias: ['pixel', 'pixelate'],
  category: 'canvas',
  description: 'Mengubah foto yang dibalas menjadi pixel art retro',
  usage: '.topixel [level 4-64] (balas foto)',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 5
};

export default async function (m, ctx) {
  if (!m.quoted || !/image/.test(m.quoted.type || '')) {
    return ctx.reply('Balas sebuah foto dengan perintah ' + ctx.prefix + 'topixel [level].');
  }
  let level = parseInt((ctx.args && ctx.args[0]) || '', 10);
  if (isNaN(level)) level = 14;
  level = Math.max(4, Math.min(64, level));
  try {
    const buf = await m.quoted.download();
    if (!buf) return ctx.reply('Gagal mengunduh foto.');
    const png = await pixelatePng(buf, level);
    await ctx.sock.sendMessage(m.chat, { image: png, caption: `👾 Pixel art level ${level} — makin besar levelnya, makin halus.` }, { quoted: m.raw });
  } catch (e) {
    return ctx.reply('Error: ' + e.message);
  }
}
