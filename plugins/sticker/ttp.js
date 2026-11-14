// AunuMD • stiker dari teks saja dengan warna cerah acak (digambar lokal via canvas).
import { makeSticker } from '../../src/helper.js';
import { textStickerPng } from '../../src/canvas.js';

export const config = {
  name: 'ttp',
  alias: [],
  category: 'sticker',
  description: 'Membuat stiker dari teks dengan warna acak',
  usage: '.ttp <teks>',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 5
};

const PALETTE = ['#FF5733', '#FFC300', '#2E86AB', '#4CC9F0', '#A23B72', '#3DDC84', '#F18F01', '#7209B7'];

export default async function (m, ctx) {
  const text = (ctx.text || '').trim() || (m.quoted?.text || '').trim();
  if (!text) {
    return ctx.reply(`❌ *Teksnya mana?*\n\nMasukkan teks yang ingin dijadikan stiker.\n\nContoh: \`${ctx.prefix}ttp Hai Cantik\``);
  }
  try {
    const fg = PALETTE[Math.floor(Math.random() * PALETTE.length)];
    const png = await textStickerPng(text, { fg, bg: null });
    const webp = await makeSticker(png);
    await ctx.sock.sendMessage(m.chat, { sticker: webp }, { quoted: m.raw });
  } catch (e) {
    return ctx.reply(`❌ Gagal membuat stiker teks: ${e.message}`);
  }
}
