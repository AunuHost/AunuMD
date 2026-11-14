// AunuMD • cari video YouTube — hasil sebagai daftar kaya + unduhan per video via .ytdl2
// Catatan: tampilan kartu geser (carousel) TIDAK disediakan dari sisi bot — atas perintah
// Aunu (14 Nov 2026) fitur itu diminta masuk sebagai metode resmi AunuBaileys
// (aunuCardCarousel); begitu library merilisnya, plugin ini akan mengadopsinya.
import { ytSearch } from '../../src/scraper.js';
import { sendRichText } from '../../src/rich.js';

export const config = {
  name: 'yts2',
  alias: ['ytsearch2', 'youtubesearch2'],
  category: 'scrape',
  description: 'Cari video YouTube — tiap hasil bisa langsung diunduh MP4/MP3 lewat .ytdl2',
  usage: '.yts2 <judul video>',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 6
};

function fmtDurasi(s) {
  const n = Number(s) || 0;
  const mnt = Math.floor(n / 60);
  const dtk = String(n % 60).padStart(2, '0');
  return `${mnt}:${dtk}`;
}

export default async function (m, ctx) {
  if (!ctx.text) { await ctx.reply(`Pemakaian: ${config.usage}`); return; }
  try {
    await m.react('🔎').catch(() => {});
    const hasil = (await ytSearch(ctx.text)).slice(0, 8);
    if (!hasil.length) { await ctx.reply('Video tidak ditemukan.'); return; }
    const p = ctx.prefix || '.';
    const daftar = hasil.map((r, i) => {
      const views = r.viewCountText || (r.viewCount ? Number(r.viewCount).toLocaleString('id-ID') : '-');
      return `${i + 1}. ▶️ *${r.title}*\n   ⏱ ${fmtDurasi(r.lengthSeconds)} • 👁 ${views} • ${r.author}\n   🎬 MP4: ${p}ytdl2 ${r.videoId} mp4\n   🎵 MP3: ${p}ytdl2 ${r.videoId} mp3`;
    }).join('\n\n');
    const teks = `🎬 *Hasil pencarian:* "${ctx.text}"\n\n${daftar}\n\n_Ketuk/salin perintah unduh pada video yang diinginkan._`;
    await sendRichText(ctx.sock, m.chat, teks, { quoted: m.raw, title: ctx.config.botName })
      .catch(() => ctx.reply(teks));
  } catch (e) {
    await ctx.reply('Error: ' + e.message);
  }
}
