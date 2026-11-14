// AunuMD • unduh audio (musik) dari video TikTok (tikwm).
import { tiktokDownload } from '../../src/scraper.js';

export const config = {
  name: 'tiktokmp3',
  alias: ['ttmp3'],
  category: 'scrape',
  description: 'Unduh audio/musik dari video TikTok',
  usage: '.tiktokmp3 <tautan tiktok>',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 5
};

export default async function (m, ctx) {
  const url = ctx.args[0];
  if (!url || !/tiktok\.com/i.test(url)) { await ctx.reply(`Pemakaian: ${config.usage}`); return; }
  try {
    await m.react('⏳');
    const d = await tiktokDownload(url);
    const audio = d.music;
    if (!audio) throw new Error('Tautan audio tidak ditemukan pada respons tikwm.');
    await ctx.sock.sendMessage(m.chat, {
      audio: { url: audio },
      mimetype: 'audio/mpeg',
      fileName: 'tiktok-audio.mp3'
    }, { quoted: m.raw });
    await ctx.reply(`🎵 *${d.title || 'Audio TikTok'}*\n👤 ${d.author?.nickname || '-'}`);
  } catch (e) { await ctx.reply(`❌ Error: ${e.message}`); }
}
