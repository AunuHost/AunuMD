// AunuMD • stiker teks gaya brat (teks hitam di kotak putih), digambar lokal via canvas.
import { makeSticker } from '../../src/helper.js';
import { bratPng } from '../../src/canvas.js';

export const config = {
  name: 'brat',
  alias: ['bratimg'],
  category: 'sticker',
  description: 'Membuat stiker teks gaya brat',
  usage: '.brat <teks>',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 5
};

export default async function (m, ctx) {
  const text = (ctx.text || '').trim() || (m.quoted?.text || '').trim();
  if (!text) {
    return ctx.reply(`🖼️ *BRAT*\n\n> Masukkan teks\n\nContoh: \`${ctx.prefix}brat Hai semua\``);
  }
  try {
    const png = await bratPng(text);
    const webp = await makeSticker(png);
    await ctx.sock.sendMessage(m.chat, { sticker: webp }, { quoted: m.raw });
  } catch (e) {
    return ctx.reply(`❌ Gagal membuat stiker brat: ${e.message}`);
  }
}
