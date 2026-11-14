// AunuMD • cari lirik lagu via lyrics.ovh.
export const config = {
  name: 'lirik',
  alias: ['lyrics'],
  category: 'scrape',
  description: 'Cari lirik lagu (format: artis | judul)',
  usage: '.lirik <artis> | <judul>',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 5
};

export default async function (m, ctx) {
  let artis = '', judul = '';
  if (ctx.text.includes('|')) {
    [artis, judul] = ctx.text.split('|').map((s) => s.trim());
  } else if (ctx.text.includes(' - ')) {
    const i = ctx.text.indexOf(' - ');
    artis = ctx.text.slice(0, i).trim();
    judul = ctx.text.slice(i + 3).trim();
  }
  if (!artis || !judul) { await ctx.reply(`Pemakaian: ${config.usage}`); return; }
  try {
    await m.react('⏳');
    const res = await fetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(artis)}/${encodeURIComponent(judul)}`, {
      signal: AbortSignal.timeout(20000)
    });
    const json = await res.json().catch(() => ({}));
    const lyrics = (json.lyrics || '').trim();
    if (!res.ok || json.error || !lyrics) { await ctx.reply('Lirik tidak ditemukan.'); return; }
    let out = lyrics;
    let potong = false;
    if (out.length > 5000) { out = out.slice(0, 5000); potong = true; }
    await ctx.reply(`🎵 *${judul}* — ${artis}\n\n${out}${potong ? '\n\n…(lirik terpotong, terlalu panjang)' : ''}`);
  } catch (e) { await ctx.reply(`❌ Error: ${e.message}`); }
}
