// AunuMD • kalkulator dana program MBG (konstanta & perbandingan mengikuti bot sumber)
export const config = {
  name: 'kalkulatormbg',
  alias: ['kkmbg', 'mbgcalc'],
  category: 'tools',
  description: 'Hitung berapa lama nominal uang membiayai program Makan Bergizi Gratis (MBG)',
  usage: '.kalkulatormbg <nominal> (contoh: .kalkulatormbg 15jt / 1000000000)',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 5
};

// Konstanta dari bot sumber.
const PENGELUARAN_PER_HARI = 319600000000; // ±Rp 319,6 miliar/hari
const HARGA_PORSI = 15000;
const UMR_DKI = 5400000;
const UMR_JATENG = 2040000;
const GAJI_GURU_HONORER = 300000;
const PEMAIN = [
  { nama: 'Cristiano Ronaldo (Al Nassr)', gaji: 4500000000000 },
  { nama: 'Lionel Messi (Inter Miami)', gaji: 2100000000000 },
  { nama: 'Karim Benzema (Al-Ittihad)', gaji: 1700000000000 },
  { nama: 'Kylian Mbappé (Real Madrid)', gaji: 1500000000000 },
  { nama: 'Erling Haaland (Man City)', gaji: 1300000000000 },
  { nama: 'Vinícius Jr. (Real Madrid)', gaji: 960000000000 },
  { nama: 'Mohamed Salah (Liverpool)', gaji: 880000000000 },
  { nama: 'Sadio Mané (Al Nassr)', gaji: 864000000000 },
  { nama: 'Jude Bellingham (Real Madrid)', gaji: 704000000000 },
  { nama: 'Lamine Yamal (Barcelona)', gaji: 688000000000 }
];

function formatRupiah(angka) {
  const formatted = Math.round(angka).toLocaleString('id-ID');
  return angka < 1000 ? `${formatted} Perak` : `Rp ${formatted}`;
}

// Terima: angka polos (1500000 / 1.500.000), atau suffix jt/juta, m/miliar, t/triliun, rb/ribu.
function parseNominal(raw = '') {
  const s = String(raw).trim().toLowerCase().replace(/\s+/g, '');
  const match = /^([\d.,]+)(jt|juta|m|miliar|milyar|t|triliun|rb|ribu|k)?$/.exec(s);
  if (!match) return NaN;
  let numStr = match[1];
  // Titik ribuan (1.500.000) dibuang; koma/titik desimal sebelum suffix diseragamkan.
  if (/^\d{1,3}(\.\d{3})+(,\d+)?$/.test(numStr)) numStr = numStr.replace(/\./g, '').replace(',', '.');
  else numStr = numStr.replace(',', '.');
  const nilai = parseFloat(numStr);
  if (isNaN(nilai)) return NaN;
  const mult = { jt: 1e6, juta: 1e6, m: 1e9, miliar: 1e9, milyar: 1e9, t: 1e12, triliun: 1e12, rb: 1e3, ribu: 1e3, k: 1e3 }[match[2] || ''] || 1;
  return nilai * mult;
}

export default async function (m, ctx) {
  if (!ctx.args[0]) {
    await ctx.reply(
      `🧮 *KALKULATOR MBG (Makan Bergizi Gratis)*\n\n` +
      `Penasaran berapa lama uang kamu bisa menyuplai program Makan Bergizi Gratis se-Indonesia?\n\n` +
      `*Cara pakai:* \`${ctx.prefix}kalkulatormbg <nominal>\`\n` +
      `*Contoh:* \`${ctx.prefix}kalkulatormbg 1000000000\` atau \`${ctx.prefix}kalkulatormbg 15jt\``
    );
    return;
  }

  const uang = parseNominal(ctx.args.join(''));
  if (isNaN(uang) || uang <= 0) {
    await ctx.reply('❌ Masukkan nominal yang valid, misal 500000, 15jt, atau 2m.');
    return;
  }

  const hariFloat = uang / PENGELUARAN_PER_HARI;
  const tahun = Math.floor(hariFloat / 365);
  const bulan = Math.floor((hariFloat % 365) / 30);
  const hari = Math.floor(hariFloat % 30);
  const jam = Math.floor((hariFloat % 1) * 24);
  const menit = Math.floor(((hariFloat * 24) % 1) * 60);
  const detik = (((hariFloat * 24 * 60) % 1) * 60).toFixed(2);
  const porsi = Math.floor(uang / HARGA_PORSI);

  let txt = `🍽️ *HASIL HITUNG KALKULATOR MBG* 🍽️\n\n`;
  txt += `💰 *Dana:* ${formatRupiah(uang)}\n\n`;
  txt += `⏳ *Durasi MBG:*\n`;
  txt += `${tahun} TAHUN, ${bulan} BULAN, ${hari} HARI\n`;
  txt += `${jam} JAM, ${menit} MENIT, ${detik} DETIK\n`;
  txt += `_(Berdasarkan pengeluaran ~Rp ${(PENGELUARAN_PER_HARI / 1e9).toLocaleString('id-ID', { maximumFractionDigits: 1 })} Miliar/hari)_\n\n`;
  txt += `🍱 *Setara Porsi Makan:*\n`;
  txt += `${porsi.toLocaleString('id-ID')} porsi (@ Rp ${HARGA_PORSI.toLocaleString('id-ID')}/porsi)\n\n`;
  txt += `📊 *Perbandingan Gaji Indonesia:*\n`;
  txt += `🏢 UMR DKI Jakarta (Rp 5,4 Jt/bulan): ${((uang / UMR_DKI) * 100).toFixed(1)}%\n`;
  txt += `🏭 UMR Jawa Tengah (Rp 2,04 Jt/bulan): ${((uang / UMR_JATENG) * 100).toFixed(1)}%\n`;
  txt += `👨‍🏫 Gaji Guru Honorer (Rp 300rb/bulan): ${(uang / GAJI_GURU_HONORER).toFixed(1)}x\n\n`;
  txt += `⚽ *Perbandingan Gaji Pesepakbola (per tahun):*\n`;
  for (const p of PEMAIN) {
    const persen = (uang / p.gaji) * 100;
    txt += `🏆 ${p.nama} — ${formatRupiah(p.gaji)}/tahun → *${persen < 0.0001 ? '0%' : persen.toFixed(4) + '%'}*\n`;
  }

  await ctx.reply(txt.trim());
}
