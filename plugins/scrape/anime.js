// AunuMD • cari anime via Jikan API (MyAnimeList).
export const config = {
  name: 'anime',
  alias: [],
  category: 'scrape',
  description: 'Cari info anime di MyAnimeList',
  usage: '.anime <judul anime>',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 5
};

export default async function (m, ctx) {
  if (!ctx.text) { await ctx.reply(`Pemakaian: ${config.usage}`); return; }
  try {
    await m.react('⏳');
    const res = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(ctx.text)}&limit=5&order_by=score&sort=desc`, {
      signal: AbortSignal.timeout(20000)
    });
    const json = await res.json().catch(() => ({}));
    const data = Array.isArray(json.data) ? json.data : [];
    if (!data.length) { await ctx.reply('🔍 Anime tidak ditemukan.'); return; }
    const lines = data.map((a, i) =>
      `${i + 1}. *${a.title}*\n` +
      `   📺 ${a.type || '-'} • ${a.year || '-'} • ⭐ ${a.score ?? '-'} • 🎞 ${a.episodes ?? '-'} episode\n` +
      `   ${(a.synopsis || '-').slice(0, 120)}…\n` +
      `   🔗 ${a.url}`
    );
    await ctx.reply(`🎌 *Hasil pencarian anime: ${ctx.text}*\n\n${lines.join('\n\n')}`);
  } catch (e) { await ctx.reply(`❌ Error: ${e.message}`); }
}
