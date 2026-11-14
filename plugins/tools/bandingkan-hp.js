// AunuMD • bandingkan spesifikasi 2 HP dari Carisinyal (scrape HTML)
export const config = {
  name: 'bandingkanhp',
  alias: ['vs-hp', 'comparehp', 'bandingkan-hp'],
  category: 'tools',
  description: 'Bandingkan spesifikasi dua smartphone dari Carisinyal',
  usage: '.bandingkanhp <hp1> | <hp2>',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 8
};

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
const KEY_LABEL = /jaringan|layar|chipset|prosesor|cpu|ram|penyimpanan|storage|memori|kamera|baterai|harga|os|sistem operasi|dimensi|berat|resolusi|refresh/i;

async function getHtml(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(30000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

function stripTags(html = '') {
  return String(html)
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalize(text = '') {
  return text.toLowerCase().replace(/[^a-z0-9]/g, '');
}

// Skor kecocokan judul dengan kueri (mengikuti pola bot sumber).
function scoreTitle(title, query) {
  const t = normalize(title);
  const q = normalize(query);
  let s = 0;
  if (t === q) s += 100;
  if (t.includes(q)) s += 80;
  if (q.includes(t)) s += 60;
  const words = q.match(/[a-z]+|\d+/g) || [];
  for (const w of words) if (t.includes(w)) s += 10;
  return s;
}

function parsePhoneList(html) {
  // Daftar HP ada di <select name="hp_1"> pada halaman /compare/.
  const selStart = html.indexOf('name="hp_1"');
  const region = selStart >= 0 ? html.slice(selStart, html.indexOf('</select>', selStart)) : html;
  const list = [];
  const re = /<option[^>]*value="([^"]*)"[^>]*>([\s\S]*?)<\/option>/gi;
  let mm;
  while ((mm = re.exec(region)) !== null) {
    const id = mm[1].trim();
    const title = stripTags(mm[2]);
    if (id && title && !list.some((p) => p.id === id)) list.push({ id, title });
  }
  return list;
}

// Ambil isi sebuah <div ...> mulai dari indeks tag pembukanya (hitung kedalaman div).
function divInner(html, openIdx) {
  const re = /<div\b|<\/div>/gi;
  re.lastIndex = openIdx;
  let depth = 0, contentStart = -1, mm;
  while ((mm = re.exec(html)) !== null) {
    if (mm[0].startsWith('</')) {
      depth--;
      if (depth === 0) return { inner: html.slice(contentStart, mm.index), end: re.lastIndex };
    } else {
      depth++;
      if (depth === 1) contentStart = html.indexOf('>', mm.index) + 1;
    }
  }
  return { inner: '', end: html.length };
}

function extractCell(cellHtml) {
  const img = /<img[^>]+(?:data-src|src)="([^"]+)"/i.exec(cellHtml);
  if (img) return '📸 (gambar)';
  const lis = [...cellHtml.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)].map((x) => stripTags(x[1])).filter(Boolean);
  if (lis.length) return lis.join('; ');
  return stripTags(cellHtml);
}

// Halaman compare Carisinyal: judul seksi = .ct-text-block, baris spek = .ct-new-columns
// dengan 3 sel .ct-div-block (label, nilai HP1, nilai HP2). Mengikuti pola bot sumber.
function parseCompare(html) {
  const sections = [];
  let current = { section: 'Umum', rows: [] };
  const re = /<div[^>]*class="[^"]*(ct-text-block|ct-new-columns)[^"]*"/gi;
  let mm;
  let consumedUntil = -1;
  while ((mm = re.exec(html)) !== null) {
    if (mm.index < consumedUntil) continue;
    const { inner, end } = divInner(html, mm.index);
    consumedUntil = end;
    if (mm[1] === 'ct-text-block') {
      const title = stripTags(inner);
      if (!title) continue;
      if (current.rows.length) sections.push(current);
      current = { section: title, rows: [] };
    } else {
      // Kumpulkan sel anak .ct-div-block di dalam baris ini.
      const cells = [];
      const cellRe = /<div[^>]*class="[^"]*ct-div-block[^"]*"/gi;
      let cm;
      let cellConsumed = -1;
      while ((cm = cellRe.exec(inner)) !== null) {
        if (cm.index < cellConsumed) continue;
        const cell = divInner(inner, cm.index);
        cellConsumed = cell.end;
        cells.push(cell.inner);
      }
      if (cells.length < 3) continue;
      const label = stripTags(cells[0]);
      const value1 = extractCell(cells[1]);
      const value2 = extractCell(cells[2]);
      if (!label || (!value1 && !value2)) continue;
      current.rows.push({ label, value1, value2 });
    }
  }
  if (current.rows.length) sections.push(current);
  return sections;
}

export default async function (m, ctx) {
  const text = ctx.text || '';
  if (!text.includes('|')) {
    await ctx.reply(
      `⚖️ *PERBANDINGAN HP (Carisinyal)*\n\nPemakaian: \`${ctx.prefix}bandingkanhp <hp pertama> | <hp kedua>\`\n` +
      `Contoh: \`${ctx.prefix}bandingkanhp iphone 13 | samsung galaxy s22\``
    );
    return;
  }
  const [q1, q2] = text.split('|').map((v) => v.trim());
  if (!q1 || !q2) { await ctx.reply('❌ Format salah — masukkan dua nama HP dipisah tanda `|`.'); return; }

  try {
    await m.react('⏳');
    const listHtml = await getHtml('https://carisinyal.com/compare/');
    const list = parsePhoneList(listHtml);
    if (!list.length) {
      await ctx.reply('❌ Daftar HP Carisinyal tidak terbaca (struktur halaman berubah). Coba lagi nanti.');
      return;
    }
    const pick = (q) => list.map((p) => ({ ...p, s: scoreTitle(p.title, q) })).sort((a, b) => b.s - a.s)[0];
    const phone1 = pick(q1);
    const phone2 = pick(q2);
    if (!phone1 || phone1.s <= 0 || !phone2 || phone2.s <= 0) {
      await ctx.reply(`❌ HP tidak ditemukan di database Carisinyal untuk: ${(!phone1 || phone1.s <= 0) ? q1 : q2}`);
      return;
    }

    const html = await getHtml(`https://carisinyal.com/compare/?hp_1=${encodeURIComponent(phone1.id)}&hp_2=${encodeURIComponent(phone2.id)}`);
    const sections = parseCompare(html);
    const totalRows = sections.reduce((a, s) => a + s.rows.length, 0);
    if (!totalRows) {
      await ctx.reply('❌ Tabel spesifikasi tidak terbaca dari halaman Carisinyal (struktur halaman berubah).');
      return;
    }

    // Maks 25 baris; bila lebih, prioritaskan baris kunci (jaringan/layar/chipset/dll).
    let budget = 25;
    const out = [];
    for (const sec of sections) {
      if (budget <= 0) break;
      let rows = sec.rows;
      if (rows.length > budget) {
        const keys = rows.filter((r) => KEY_LABEL.test(r.label));
        const rest = rows.filter((r) => !KEY_LABEL.test(r.label));
        rows = [...keys, ...rest].slice(0, budget);
      }
      if (!rows.length) continue;
      budget -= rows.length;
      out.push({ section: sec.section, rows });
    }

    let txt = `⚖️ *PERBANDINGAN SMARTPHONE*\n\n📱 *HP 1:* ${phone1.title}\n📱 *HP 2:* ${phone2.title}\n`;
    for (const sec of out) {
      txt += `\n✨ *${sec.section.toUpperCase()}*\n`;
      for (const row of sec.rows) {
        txt += `🔹 *${row.label}:*\n  1️⃣ ${row.value1 || '-'}\n  2️⃣ ${row.value2 || '-'}\n`;
      }
    }
    txt += `\n🔗 Sumber: Carisinyal`;
    if (txt.length > 3900) txt = txt.slice(0, 3900) + '\n…(dipotong)';
    await ctx.reply(txt);
  } catch (e) {
    await ctx.reply(`❌ Gagal mengambil data dari Carisinyal: ${e.message}`);
  }
}
