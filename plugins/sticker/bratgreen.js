// AunuMD • stiker brat hijau khas (latar #8ACE00, teks hitam), digambar lokal via canvas.
import { makeSticker } from '../../src/helper.js';
import { bratPng } from '../../src/canvas.js';

export const config = {
  name: 'bratgreen',
  alias: [],
  category: 'sticker',
  description: 'Membuat stiker brat versi hijau',
  usage: '.bratgreen <teks>',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 5
};

export default async function (m, ctx) {
  const text = (ctx.text || '').trim() || (m.quoted?.text || '').trim();
  if (!text) {
    return ctx.reply(`🖼️ *BRAT GREEN*\n\n> Masukkan teks\n\nContoh: \`${ctx.prefix}bratgreen Hai semua\``);
  }
  try {
    const png = await bratPng(text, { bg: '#8ACE00', fg: '#000000' });
    const webp = await makeSticker(png);
    await ctx.sock.sendMessage(m.chat, { sticker: webp }, { quoted: m.raw });
  } catch (e) {
    return ctx.reply(`❌ Gagal membuat stiker brat green: ${e.message}`);
  }
}
