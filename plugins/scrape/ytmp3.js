// AunuMD • unduh audio YouTube (Invidious).
import { extractYtId, ytSearch, ytVideo, pickAudioStream } from '../../src/scraper.js';

export const config = {
  name: 'ytmp3',
  alias: ['yta', 'ytmusic'],
  category: 'scrape',
  description: 'Unduh audio YouTube',
  usage: '.ytmp3 <tautan atau judul>',
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
    const stream = pickAudioStream(details);
    if (!stream?.url) throw new Error('Stream audio tidak tersedia untuk video ini.');
    await ctx.sock.sendMessage(m.chat, {
      audio: { url: stream.url },
      mimetype: String(stream.type || 'audio/mp4').split(';')[0],
      fileName: `${details.title || 'audio'}.mp3`
    }, { quoted: m.raw });
  } catch (e) { await ctx.reply(`❌ Error: ${e.message}`); }
}
