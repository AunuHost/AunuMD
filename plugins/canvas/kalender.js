// AunuMD • Kalender Indonesia 2026 bergambar dengan hari libur nasional
import { createCanvas, ensureFonts } from '../../src/canvas.js';

export const config = {
  name: 'kalender',
  alias: ['calendar', 'tanggalan'],
  category: 'canvas',
  description: 'Gambar kalender 2026 lengkap dengan hari libur nasional Indonesia',
  usage: '.kalender [bulan 1-12]',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 5
};

// Tanggal libur 2026 — kunci "bulan-tanggal". est: tanggal perkiraan (menunggu SKB resmi).
const LIBUR = {
  '1-1': 'Tahun Baru Masehi',
  '1-16': 'Isra Mikraj Nabi Muhammad SAW*',
  '2-17': 'Tahun Baru Imlek 2577 Kongzili',
  '3-18': 'Hari Suci Nyepi (Tahun Baru Saka 1948)',
  '3-19': 'Cuti Bersama Nyepi',
  '3-20': 'Hari Raya Idul Fitri 1447 H*',
  '3-21': 'Hari Raya Idul Fitri 1447 H*',
  '3-23': 'Cuti Bersama Idul Fitri',
  '3-24': 'Cuti Bersama Idul Fitri',
  '4-3': 'Wafat Yesus Kristus (Jumat Agung)',
  '4-5': 'Hari Paskah',
  '5-1': 'Hari Buruh Internasional',
  '5-14': 'Kenaikan Yesus Kristus',
  '5-15': 'Cuti Bersama Kenaikan Yesus Kristus',
  '5-27': 'Hari Raya Idul Adha 1447 H*',
  '5-28': 'Cuti Bersama Idul Adha',
  '5-31': 'Hari Raya Waisak 2570 BE',
  '6-1': 'Hari Lahir Pancasila',
  '6-16': 'Tahun Baru Islam 1448 H',
  '8-17': 'Hari Kemerdekaan Republik Indonesia',
  '8-25': 'Maulid Nabi Muhammad SAW*',
  '12-24': 'Cuti Bersama Natal',
  '12-25': 'Hari Raya Natal',
  '12-26': 'Cuti Bersama Natal'
};
const NAMA_BULAN = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const NAMA_HARI = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

export default async function (m, ctx) {
  try {
    ensureFonts();
    const now = new Date();
    let bulan = now.getMonth() + 1;
    let tahun = now.getFullYear();
    const arg = parseInt((ctx.args && ctx.args[0]) || '', 10);
    if (arg >= 1 && arg <= 12) { bulan = arg; tahun = 2026; }
    const W = 1000, gridTop = 190, cellW = (W - 80) / 7, cellH = 62;
    const first = new Date(tahun, bulan - 1, 1);
    const daysInMonth = new Date(tahun, bulan, 0).getDate();
    const startDay = first.getDay();
    const rows = Math.ceil((startDay + daysInMonth) / 7);
    const listLibur = Object.keys(LIBUR)
      .filter((k) => parseInt(k.split('-')[0], 10) === bulan)
      .map((k) => ({ tgl: parseInt(k.split('-')[1], 10), nama: LIBUR[k] }))
      .filter((l) => l.tgl <= daysInMonth)
      .sort((a, b) => a.tgl - b.tgl);
    const H = 760 + Math.max(0, listLibur.length - 4) * 30;
    const canvas = createCanvas(W, H);
    const c = canvas.getContext('2d');
    c.fillStyle = '#fffdf7';
    c.fillRect(0, 0, W, H);
    // header
    const grad = c.createLinearGradient(0, 0, W, 0);
    grad.addColorStop(0, '#a6192e');
    grad.addColorStop(1, '#7a0f20');
    c.fillStyle = grad;
    c.fillRect(0, 0, W, 120);
    c.fillStyle = '#ffffff';
    c.font = 'bold 52px Poppins, sans-serif';
    c.textBaseline = 'middle';
    c.textAlign = 'left';
    c.fillText(`${NAMA_BULAN[bulan - 1]} ${tahun}`, 40, 62);
    c.font = '26px Inter, sans-serif';
    c.fillStyle = '#efdfb8';
    c.textAlign = 'right';
    c.fillText('Kalender Indonesia', W - 40, 62);
    // header nama hari
    c.textAlign = 'center';
    NAMA_HARI.forEach((h, i) => {
      c.font = 'bold 26px Inter, sans-serif';
      c.fillStyle = i === 0 ? '#b5473e' : '#5a4a3a';
      c.fillText(h, 40 + cellW * i + cellW / 2, gridTop - 28);
    });
    const isToday = (d) => tahun === now.getFullYear() && bulan === now.getMonth() + 1 && d === now.getDate();
    // grid tanggal
    for (let d = 1; d <= daysInMonth; d++) {
      const pos = startDay + d - 1;
      const col = pos % 7, row = Math.floor(pos / 7);
      const cx = 40 + cellW * col + cellW / 2;
      const cy = gridTop + row * cellH + cellH / 2;
      const libur = LIBUR[`${bulan}-${d}`];
      if (isToday(d)) {
        c.beginPath();
        c.arc(cx, cy, 27, 0, Math.PI * 2);
        c.fillStyle = '#b7862c';
        c.fill();
        c.fillStyle = '#ffffff';
      } else if (libur) c.fillStyle = '#c0272d';
      else if (col === 0) c.fillStyle = '#b5473e';
      else c.fillStyle = '#221a17';
      c.font = (libur || isToday(d)) ? 'bold 30px Inter, sans-serif' : '28px Inter, sans-serif';
      c.fillText(String(d), cx, cy);
    }
    // daftar libur bulan ini
    let ly = gridTop + rows * cellH + 46;
    c.textAlign = 'left';
    c.font = 'bold 26px Poppins, sans-serif';
    c.fillStyle = '#7a0f20';
    c.fillText('🔴 Hari Libur & Cuti Bersama', 40, ly);
    ly += 36;
    c.font = '24px Inter, sans-serif';
    if (!listLibur.length) {
      c.fillStyle = '#8a8078';
      c.fillText('Tidak ada tanggal merah bulan ini.', 40, ly);
    } else {
      for (const l of listLibur) {
        c.fillStyle = '#c0272d';
        c.fillText(String(l.tgl).padStart(2, '0'), 40, ly);
        c.fillStyle = '#221a17';
        c.fillText(l.nama, 92, ly);
        ly += 30;
      }
    }
    c.font = '20px Inter, sans-serif';
    c.fillStyle = '#8a8078';
    c.fillText('* tanggal perkiraan, menunggu SKB resmi pemerintah.', 40, H - 24);
    const png = await canvas.encode('png');
    await ctx.sock.sendMessage(m.chat, { image: png, caption: `📅 Kalender ${NAMA_BULAN[bulan - 1]} ${tahun} — ${listLibur.length} hari libur/cuti.` }, { quoted: m.raw });
  } catch (e) {
    return ctx.reply('Error: ' + e.message);
  }
}
