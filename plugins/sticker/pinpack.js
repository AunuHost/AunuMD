// AunuMD • cari gambar Pinterest lalu kirim sebagai stiker (maks 5) via API siputzx.
import { getBuffer, makeSticker, sleep } from '../../src/helper.js';

export const config = {
  name: 'pinpack',
  alias: [],
  category: 'sticker',
  description: 'Cari gambar Pinterest lalu jadikan stiker',
  usage: '.pinpack <query>',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 5
};

const MAX_STICKERS = 5;

export default async function (m, ctx) {
  const query = (ctx.text || '').trim();
  if (!query) {
    return ctx.reply(
      `📌 *PIN PACK*\n\n` +
      `Cari gambar Pinterest → jadikan stiker!\n\n` +
      `Cara pakai: \`${ctx.prefix}pinpack <query>\`\n` +
      `Contoh: \`${ctx.prefix}pinpack anime cat\``
    );
  }

  let results = [];
  try {
    const res = await fetch(`https://api.siputzx.my.id/api/s/pinterest?query=${encodeURIComponent(query)}`, {
      signal: AbortSignal.timeout(20000)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    results = Array.isArray(json?.data) ? json.data : [];
  } catch (e) {
    return ctx.reply(`❌ Gagal mencari di Pinterest: ${e.message}`);
  }

  const urls = results
    .map((it) => it?.image_url || it?.url || it?.image || it?.link)
    .filter(Boolean)
    .slice(0, MAX_STICKERS);

  if (!urls.length) {
    return ctx.reply(`📌 Tidak ditemukan hasil untuk: *${query}*`);
  }

  await ctx.reply(`📌 Mengirim ${urls.length} stiker dari Pinterest untuk *${query}*...`);

  let sent = 0;
  for (const url of urls) {
    try {
      const buf = await getBuffer(url);
      const webp = await makeSticker(buf);
      await ctx.sock.sendMessage(m.chat, { sticker: webp }, { quoted: m.raw });
      sent++;
    } catch { /* lewati gambar yang gagal */ }
    if (sent) await sleep(500);
  }

  if (!sent) return ctx.reply('❌ Gagal mengunduh semua gambar. Coba query lain.');
  return ctx.reply(`✅ Berhasil mengirim *${sent}* stiker Pinterest untuk *${query}*.`);
}
