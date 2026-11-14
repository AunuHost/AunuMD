// AunuMD • cari font di DaFont & unduh file-nya (scrape HTML + sesi pilih nomor)
import { setSession, getSession, clearSession, sessionKey } from '../../src/game-session.js';

export const config = {
  name: 'dafont',
  alias: ['carifont', 'font'],
  category: 'tools',
  description: 'Cari font di DaFont lalu unduh file font-nya',
  usage: '.dafont <nama font> / .dafont ambil <nomor>',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 5
};

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

function humanize(slug) {
  return slug.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

// Hasil pencarian DaFont: slug dari tautan /<slug>.font (href relatif), nama font dari
// blok .lv1left ("<Nama> by <Author>") — keduanya muncul dalam urutan yang sama.
function parseResults(html) {
  const slugs = [];
  const seen = new Set();
  const slugRe = /href="(?:https?:\/\/www\.dafont\.com)?\/?([a-z0-9][a-z0-9\-_]*)\.font"/gi;
  let mm;
  while ((mm = slugRe.exec(html)) !== null) {
    const slug = mm[1].toLowerCase();
    if (seen.has(slug)) continue;
    if (['new-fonts', 'themes', 'authors', 'forum', 'faq'].includes(slug)) continue;
    seen.add(slug);
    slugs.push(slug);
  }
  const names = [];
  const nameRe = /class="lv1left[^"]*"[^>]*>([\s\S]*?)<\/div>/gi;
  while ((mm = nameRe.exec(html)) !== null) {
    let txt = mm[1].replace(/<[^>]+>/g, ' ').replace(/&nbsp;|&agrave;|&euro;/g, ' ').replace(/\s+/g, ' ').trim();
    txt = txt.split(/\s+by\s+/i)[0].trim();
    if (txt) names.push(txt);
  }
  return slugs.map((slug, i) => ({ slug, name: names[i] || humanize(slug) }));
}

export default async function (m, ctx) {
  const key = sessionKey(m);

  // Sub-perintah: .dafont ambil <nomor>
  if ((ctx.args[0] || '').toLowerCase() === 'ambil') {
    const n = parseInt(ctx.args[1], 10);
    const session = getSession(key);
    if (!session || session.type !== 'dafont') {
      await ctx.reply('❌ Tidak ada hasil pencarian font aktif. Cari dulu: `.dafont <nama font>`');
      return;
    }
    const item = session.items[n - 1];
    if (!item) { await ctx.reply(`❌ Nomor tidak valid. Pilih 1–${session.items.length}.`); return; }
    try {
      await m.react('⏳');
      const res = await fetch(`https://dl.dafont.com/dl/?f=${encodeURIComponent(item.slug)}`, {
        headers: { 'User-Agent': UA },
        signal: AbortSignal.timeout(60000)
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 100) throw new Error('File unduhan kosong/tidak valid.');
      clearSession(key);
      await ctx.sock.sendMessage(m.chat, {
        document: buf,
        fileName: `${item.slug}.zip`,
        mimetype: 'application/zip',
        caption: `🔤 *${item.name}*\nSumber: DaFont (https://www.dafont.com/${item.slug}.font)\n_Perhatikan lisensi font sebelum dipakai komersial._`
      }, { quoted: m.raw });
    } catch (e) {
      await ctx.reply(`❌ Gagal mengunduh font: ${e.message}`);
    }
    return;
  }

  const query = (ctx.text || '').trim();
  if (!query) { await ctx.reply(`Pemakaian: ${config.usage}`); return; }

  try {
    await m.react('⏳');
    const res = await fetch(`https://www.dafont.com/search.php?q=${encodeURIComponent(query)}`, {
      headers: { 'User-Agent': UA },
      signal: AbortSignal.timeout(30000)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();
    const items = parseResults(html).slice(0, 10);
    if (!items.length) {
      await ctx.reply(`❌ Tidak ada hasil untuk *${query}* (atau struktur halaman DaFont berubah). Coba kata kunci lain.`);
      return;
    }
    setSession(key, { type: 'dafont', items }, 300000);
    let txt = `🔤 *DaFont — Hasil untuk "${query}"*\n\n`;
    items.forEach((v, i) => { txt += `*${i + 1}.* ${v.name}\n`; });
    txt += `\n📥 Unduh dengan: \`${ctx.prefix}dafont ambil <nomor>\` (berlaku 5 menit)`;
    await ctx.reply(txt);
  } catch (e) {
    await ctx.reply(`❌ Error: ${e.message}`);
  }
}
