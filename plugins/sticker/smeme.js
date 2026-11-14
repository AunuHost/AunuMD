// AunuMD • stiker meme: teks atas|bawah di atas gambar/stiker yang di-reply (digambar lokal via canvas).
import { makeSticker } from '../../src/helper.js';
import { memePng } from '../../src/canvas.js';

export const config = {
  name: 'smeme',
  alias: [],
  category: 'sticker',
  description: 'Membuat stiker meme dari gambar/stiker yang di-reply',
  usage: '.smeme <atas>|<bawah> (reply gambar/stiker)',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 5
};

export default async function (m, ctx) {
  const type = m.quoted?.type || '';
  if (!m.quoted || !(type.includes('image') || type.includes('sticker'))) {
    return ctx.reply(`😂 *MEME STICKER*\n\n> Reply gambar/stiker dengan caption:\n> \`${ctx.prefix}smeme Atas|Bawah\`\n\nContoh: \`${ctx.prefix}smeme Ketika|Kamu Lupa\``);
  }
  const input = (ctx.text || '').trim();
  if (!input) {
    return ctx.reply(`😂 *MEME STICKER*\n\n> Format: atas|bawah (salah satu boleh kosong)\n\nContoh: \`${ctx.prefix}smeme Ketika|Kamu Lupa\``);
  }
  const [top = '', bottom = ''] = input.split('|').map((s) => s.trim());

  let buf;
  try {
    buf = await m.quoted.download();
  } catch (e) {
    return ctx.reply(`❌ Gagal mengunduh media: ${e.message}`);
  }
  if (!buf?.length) return ctx.reply('❌ Gagal mengunduh media.');

  try {
    const png = await memePng(buf, top, bottom);
    const webp = await makeSticker(png);
    await ctx.sock.sendMessage(m.chat, { sticker: webp }, { quoted: m.raw });
  } catch (e) {
    return ctx.reply(`❌ Gagal membuat stiker meme: ${e.message}`);
  }
}
