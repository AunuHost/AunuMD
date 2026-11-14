// AunuMD • unduh video TikTok tanpa watermark (tikwm).
import { tiktokDownload } from '../../src/scraper.js';

export const config = {
  name: 'tiktok',
  alias: ['tt', 'ttdl', 'tiktokdl'],
  category: 'scrape',
  description: 'Unduh video TikTok tanpa watermark',
  usage: '.tiktok <tautan tiktok>',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 5
};

export default async function (m, ctx) {
  const url = ctx.args[0];
  if (!url || !/tiktok\.com/i.test(url)) { await ctx.reply(`Pemakaian: ${config.usage}`); return; }
  try {
    await m.react('⏳');
    const d = await tiktokDownload(url);
    const video = d.hdplay || d.play;
    if (!video) throw new Error('Tautan video tidak ditemukan pada respons tikwm.');
    await ctx.sock.sendMessage(m.chat, {
      video: { url: video },
      caption: `🎵 *${d.title || 'Video TikTok'}*\n👤 ${d.author?.nickname || '-'}\n\nDiunduh AunuMD via tikwm`
    }, { quoted: m.raw });
  } catch (e) { await ctx.reply(`❌ Error: ${e.message}`); }
}
