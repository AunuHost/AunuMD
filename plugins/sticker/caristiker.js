// AunuMD • cari stiker di Sticker.ly dan kirim hasil teratas sebagai stiker
// Rute: API pencarian stickerly (tanpa kunci) — respons berisi pack dengan
// resourceUrlPrefix + resourceFiles; URL stiker = prefix + nama file.
import { getBuffer, makeSticker } from '../../src/helper.js';

export const config = {
  name: 'caristiker',
  alias: ['stickerly', 'caristicker'],
  category: 'sticker',
  description: 'Cari stiker dari Sticker.ly lalu kirim sebagai stiker WhatsApp',
  usage: '.caristiker <kata kunci>',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 8
};

export default async function (m, ctx) {
  if (!ctx.text) { await ctx.reply(`Pemakaian: ${config.usage}`); return; }
  try {
    await m.react('🔎').catch(() => {});
    const res = await fetch(`https://my.izuka-api.xyz/api/search/stickerly-search?query=${encodeURIComponent(ctx.text)}`, { signal: AbortSignal.timeout(45000) });
    const j = await res.json().catch(() => null);
    const packs = Array.isArray(j?.result) ? j.result : [];
    if (!packs.length) { await ctx.reply('Stiker tidak ditemukan untuk kata kunci itu.'); return; }
    // Kumpulkan kandidat URL stiker dari 2 pack teratas
    const kandidat = [];
    for (const pack of packs.slice(0, 2)) {
      const prefix = String(pack.resourceUrlPrefix || '');
      const files = Array.isArray(pack.resourceFiles) ? pack.resourceFiles : [];
      for (const f of files.slice(0, 4)) kandidat.push({ url: prefix + f, pack: pack.name || 'Sticker.ly' });
      if (kandidat.length >= 6) break;
    }
    let terkirim = 0;
    const packNames = new Set();
    for (const k of kandidat) {
      if (terkirim >= 5) break;
      try {
        const buf = await getBuffer(k.url);
        const webp = await makeSticker(buf);
        await ctx.sock.sendMessage(m.chat, { sticker: webp }, { quoted: m.raw });
        terkirim++;
        packNames.add(k.pack);
      } catch { /* lewati stiker yang gagal */ }
    }
    if (!terkirim) { await ctx.reply('❌ Semua stiker hasil pencarian gagal diunduh. Coba kata kunci lain.'); return; }
    await ctx.reply(`✅ ${terkirim} stiker terkirim dari pack: ${[...packNames].join(', ')}\nSumber: Sticker.ly`);
  } catch (e) {
    await ctx.reply('❌ Gagal mencari stiker: ' + e.message);
  }
}
