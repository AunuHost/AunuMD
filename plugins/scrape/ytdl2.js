// AunuMD • unduh video YouTube berdasar ID (pendamping .yts2; dipanggil tombol kartu)
import { ytVideo, pickVideoStream, pickAudioStream } from '../../src/scraper.js';

export const config = {
  name: 'ytdl2',
  alias: [],
  category: 'scrape',
  description: 'Unduh video YouTube dari ID video (dipakai tombol unduh pada hasil .yts2)',
  usage: '.ytdl2 <id video> <mp4|mp3>',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 8
};

export default async function (m, ctx) {
  const id = ctx.args[0] || '';
  const mode = String(ctx.args[1] || 'mp4').toLowerCase();
  if (!/^[\w-]{6,20}$/.test(id)) { await ctx.reply(`Pemakaian: ${config.usage}`); return; }
  try {
    await m.react('⏳').catch(() => {});
    const details = await ytVideo(id);
    if (mode === 'mp3') {
      const s = pickAudioStream(details);
      if (!s?.url) throw new Error('Stream audio tidak tersedia untuk video ini.');
      await ctx.sock.sendMessage(m.chat, {
        audio: { url: s.url },
        mimetype: String(s.type || 'audio/mp4').split(';')[0],
        fileName: `${String(details.title || id).slice(0, 60)}.mp3`
      }, { quoted: m.raw });
    } else {
      const s = pickVideoStream(details);
      if (!s?.url) throw new Error('Stream video tidak tersedia untuk video ini.');
      await ctx.sock.sendMessage(m.chat, {
        video: { url: s.url },
        caption: `🎬 *${details.title}*\n👤 ${details.author}\nKualitas: ${s.qualityLabel || '-'}\n\nDiunduh AunuMD via Invidious`
      }, { quoted: m.raw });
    }
  } catch (e) {
    await ctx.reply('Error: ' + e.message);
  }
}
