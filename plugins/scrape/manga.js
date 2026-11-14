// AunuMD • cari manga via Jikan API (MyAnimeList).
export const config = {
  name: 'manga',
  alias: [],
  category: 'scrape',
  description: 'Cari info manga di MyAnimeList',
  usage: '.manga <judul manga>',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 5
};

export default async function (m, ctx) {
  if (!ctx.text) { await ctx.reply(`Pemakaian: ${config.usage}`); return; }
  try {
    await m.react('⏳');
    const res = await fetch(`https://api.jikan.moe/v4/manga?q=${encodeURIComponent(ctx.text)}&limit=5&order_by=score&sort=desc`, {
      signal: AbortSignal.timeout(20000)
    });
    const json = await res.json().catch(() => ({}));
    const data = Array.isArray(json.data) ? json.data : [];
    if (!data.length) { await ctx.reply('🔍 Manga tidak ditemukan.'); return; }
    const lines = data.map((g, i) =>
      `${i + 1}. *${g.title}*\n` +
      `   📚 ${g.type || '-'} • ⭐ ${g.score ?? '-'} • 📖 ${g.chapters ?? '-'} chapter • 📦 ${g.volumes ?? '-'} volume\n` +
      `   ${(g.synopsis || '-').slice(0, 120)}…\n` +
      `   🔗 ${g.url}`
    );
    await ctx.reply(`📚 *Hasil pencarian manga: ${ctx.text}*\n\n${lines.join('\n\n')}`);
  } catch (e) { await ctx.reply(`❌ Error: ${e.message}`); }
}
