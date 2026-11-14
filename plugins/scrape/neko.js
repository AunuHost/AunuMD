// AunuMD • gambar anime acak (nekos.life).
import { nekoImage, NEKO_CATEGORIES } from '../../src/scraper.js';

export const config = {
  name: 'neko',
  alias: ['animepic', 'waifupic'],
  category: 'scrape',
  description: 'Gambar anime acak (nekos.life)',
  usage: '.neko [kategori]',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 4
};

export default async function (m, ctx) {
  const cat = (ctx.args[0] || 'neko').toLowerCase();
  if (!NEKO_CATEGORIES.includes(cat)) {
    await ctx.reply(`Kategori tidak dikenal. Pilihan: ${NEKO_CATEGORIES.join(', ')}`);
    return;
  }
  try {
    const url = await nekoImage(cat);
    await ctx.sock.sendMessage(m.chat, {
      image: { url },
      caption: `🐱 Kategori: ${cat} — via nekos.life`
    }, { quoted: m.raw });
  } catch (e) { await ctx.reply(`❌ Error: ${e.message}`); }
}
