// AunuMD • unduh video YouTube MP4 (Invidious).
import { extractYtId, ytSearch, ytVideo, pickVideoStream } from '../../src/scraper.js';

export const config = {
  name: 'ytmp4',
  alias: ['ytv', 'ytdl'],
  category: 'scrape',
  description: 'Unduh video YouTube (MP4)',
  usage: '.ytmp4 <tautan atau judul>',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 8
};

export default async function (m, ctx) {
  if (!ctx.text) { await ctx.reply(`Pemakaian: ${config.usage}`); return; }
  try {
    await m.react('⏳');
    let id = extractYtId(ctx.text);
    if (!id) {
      const first = (await ytSearch(ctx.text))[0];
      if (!first) { await ctx.reply('Video tidak ditemukan.'); return; }
      id = first.videoId;
    }
    const details = await ytVideo(id);
    const stream = pickVideoStream(details);
    if (!stream?.url) throw new Error('Stream video tidak tersedia untuk video ini.');
    await ctx.sock.sendMessage(m.chat, {
      video: { url: stream.url },
      caption: `🎬 *${details.title}*\n👤 ${details.author}\nKualitas: ${stream.qualityLabel || '-'}\n\nDiunduh AunuMD via Invidious`
    }, { quoted: m.raw });
  } catch (e) { await ctx.reply(`❌ Error: ${e.message}`); }
}
