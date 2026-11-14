// AunuMD • putar/unduh lagu dari YouTube berdasarkan judul (Invidious).
import { ytSearch, ytVideo, pickAudioStream } from '../../src/scraper.js';

export const config = {
  name: 'play',
  alias: ['lagu'],
  category: 'scrape',
  description: 'Cari lagu di YouTube dan kirim audionya',
  usage: '.play <judul lagu>',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 8
};

function fmtDur(sec = 0) {
  return `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, '0')}`;
}

export default async function (m, ctx) {
  if (!ctx.text) { await ctx.reply(`Pemakaian: ${config.usage}`); return; }
  try {
    await m.react('⏳');
    const hasil = await ytSearch(ctx.text);
    const v = hasil?.[0];
    if (!v) { await ctx.reply('🔍 Lagu tidak ditemukan.'); return; }
    await ctx.reply(
      `🎵 *${v.title}*\n` +
      `👤 ${v.author}\n` +
      `⏱ Durasi: ${fmtDur(v.lengthSeconds)}\n` +
      `🔗 https://youtu.be/${v.videoId}\n\n` +
      `Mengunduh audio…`
    );
    const details = await ytVideo(v.videoId);
    const s = pickAudioStream(details);
    if (!s?.url) throw new Error('Stream audio tidak tersedia untuk lagu ini.');
    await ctx.sock.sendMessage(m.chat, {
      audio: { url: s.url },
      mimetype: String(s.type || 'audio/mp4').split(';')[0],
      fileName: `${v.title}.mp3`
    }, { quoted: m.raw });
  } catch (e) { await ctx.reply(`❌ Error: ${e.message}`); }
}
