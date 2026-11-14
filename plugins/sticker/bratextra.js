// AunuMD • stiker brat extra via API aqul-brat (balikan PNG langsung).
import { makeSticker } from '../../src/helper.js';

export const config = {
  name: 'bratextra',
  alias: [],
  category: 'sticker',
  description: 'Membuat stiker brat versi extra',
  usage: '.bratextra <teks>',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 5
};

export default async function (m, ctx) {
  const text = (ctx.text || '').trim() || (m.quoted?.text || '').trim();
  if (!text) {
    return ctx.reply(`🖼️ *BRAT EXTRA*\n\n> Masukkan teks\n\nContoh: \`${ctx.prefix}bratextra Halo semuanya\``);
  }
  try {
    const res = await fetch(`https://aqul-brat.hf.space/?text=${encodeURIComponent(text)}`, {
      signal: AbortSignal.timeout(60000),
      headers: { Referer: 'https://aqul-brat.hf.space/' }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const png = Buffer.from(await res.arrayBuffer());
    if (!png.length) throw new Error('Respons kosong dari server');
    const webp = await makeSticker(png);
    await ctx.sock.sendMessage(m.chat, { sticker: webp }, { quoted: m.raw });
  } catch (e) {
    return ctx.reply(`❌ Gagal membuat stiker brat extra: ${e.message}`);
  }
}
