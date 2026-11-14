// AunuMD • cari video YouTube (Invidious).
import { ytSearch } from '../../src/scraper.js';

export const config = {
  name: 'ytsearch',
  alias: ['yts', 'ytcari'],
  category: 'scrape',
  description: 'Cari video YouTube',
  usage: '.ytsearch <kata kunci>',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 5
};

const fmtDur = (s = 0) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

export default async function (m, ctx) {
  if (!ctx.text) { await ctx.reply(`Pemakaian: ${config.usage}`); return; }
  try {
    const results = (await ytSearch(ctx.text)).slice(0, 8);
    if (!results.length) { await ctx.reply('Tidak ada hasil untuk pencarian itu.'); return; }
    const lines = results.map((v, i) =>
      `${i + 1}. *${v.title}*\n   👤 ${v.author} • ⏱ ${fmtDur(v.lengthSeconds)}\n   🔗 https://youtu.be/${v.videoId}`);
    await ctx.reply(`🔎 Hasil pencarian *${ctx.text}*:\n\n${lines.join('\n\n')}\n\nUnduh dengan .ytmp4 <tautan> atau .ytmp3 <tautan>.`);
  } catch (e) { await ctx.reply(`❌ Error: ${e.message}`); }
}
