// AunuMD • meme wholesome acak dari meme-api.com (dengan filter NSFW).
export const config = {
  name: 'meme',
  alias: [],
  category: 'scrape',
  description: 'Meme wholesome acak',
  usage: '.meme',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 5
};

export default async function (m, ctx) {
  try {
    await m.react('⏳');
    const ambil = async () => {
      const res = await fetch('https://meme-api.com/gimme/wholesomememes', {
        signal: AbortSignal.timeout(20000)
      });
      if (!res.ok) throw new Error(`meme-api membalas HTTP ${res.status}`);
      return res.json();
    };
    let d = await ambil();
    if (d.nsfw) d = await ambil();
    if (d.nsfw || !d.url) { await ctx.reply('Meme aman tidak ditemukan, coba lagi.'); return; }
    await ctx.sock.sendMessage(m.chat, {
      image: { url: d.url },
      caption: `😂 *${d.title}*\n👍 ${d.ups} • r/${d.subreddit}`
    }, { quoted: m.raw });
  } catch (e) { await ctx.reply(`❌ Error: ${e.message}`); }
}
