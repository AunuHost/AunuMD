// AunuMD • ganti packname|author stiker/media yang di-reply (sisip EXIF webp lokal).
import { makeSticker } from '../../src/helper.js';
import { insertStickerExif } from '../../src/webp-exif.js';

export const config = {
  name: 'swm',
  alias: ['colong'],
  category: 'sticker',
  description: 'Mengganti packname dan author pada stiker yang di-reply',
  usage: '.swm <packname>|<author> (reply stiker/gambar/video)',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 5
};

export default async function (m, ctx) {
  const type = m.quoted?.type || '';
  if (!m.quoted || !(type.includes('sticker') || type.includes('image') || type.includes('video'))) {
    return ctx.reply(
      `🖼️ *STICKER WATERMARK*\n\n` +
      `> Reply stiker/gambar/video dengan caption:\n` +
      `> \`${ctx.prefix}swm packname|author\`\n\n` +
      `Contoh:\n> \`${ctx.prefix}swm AunuMD\`\n> \`${ctx.prefix}swm AunuMD|Aunu\``
    );
  }

  const input = (ctx.text || '').trim();
  let packname = ctx.config?.botName || 'AunuMD';
  let author = 'AunuMD';
  if (input) {
    const [p = '', a = ''] = input.split('|').map((s) => s.trim());
    if (p) packname = p;
    if (a) author = a;
  }

  let buf;
  try {
    buf = await m.quoted.download();
  } catch (e) {
    return ctx.reply(`❌ Gagal mengunduh media: ${e.message}`);
  }
  if (!buf?.length) return ctx.reply('❌ Gagal mengunduh media.');

  try {
    let webp;
    if (type.includes('sticker')) webp = buf;
    else if (type.includes('video')) webp = await makeSticker(buf, true);
    else webp = await makeSticker(buf);

    let stamped = webp;
    try { stamped = insertStickerExif(webp, packname, author); } catch { /* kirim tanpa exif */ }
    await ctx.sock.sendMessage(m.chat, { sticker: stamped }, { quoted: m.raw });
  } catch (e) {
    return ctx.reply(`❌ Gagal memproses stiker: ${e.message}`);
  }
}
