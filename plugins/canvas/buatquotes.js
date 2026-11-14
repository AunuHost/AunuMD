// AunuMD • Quote teks di atas latar gradien prosedural (8 pilihan warna)
import { createCanvas, ensureFonts, wrapText, drawTextBlock } from '../../src/canvas.js';

export const config = {
  name: 'buatquotes',
  alias: ['bq'],
  category: 'canvas',
  description: 'Buat gambar quote di atas latar gradien warna-warni',
  usage: '.buatquotes [1-8] <teks quote> | [nama]',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 5
};

const GRADIEN = [
  ['#7b2ff7', '#f107a3'], // ungu
  ['#2193b0', '#6dd5ed'], // biru
  ['#ee0979', '#ff6a00'], // pink-oranye
  ['#11998e', '#38ef7d'], // hijau
  ['#f7971e', '#ffd200'], // oranye
  ['#cb2d3e', '#ef473a'], // merah
  ['#0f766e', '#2dd4bf'], // teal
  ['#8e6e00', '#f5d76e']  // emas
];

export default async function (m, ctx) {
  const raw = (ctx.text || '').trim();
  if (!raw) return ctx.reply('Pemakaian: ' + config.usage + '\nContoh: .buatquotes 3 Hidup itu sederhana | Aunu');
  try {
    ensureFonts();
    const parts = raw.split('|').map((s) => s.trim());
    let teks = parts[0];
    const nama = parts[1] || m.pushName || 'Anonim';
    let idx = null;
    const firstToken = teks.split(/\s+/)[0];
    if (/^[1-8]$/.test(firstToken)) {
      idx = parseInt(firstToken, 10) - 1;
      teks = teks.slice(firstToken.length).trim();
    }
    if (!teks) return ctx.reply('Teks quote-nya kosong. Pemakaian: ' + config.usage);
    if (idx === null) idx = Math.floor(Math.random() * GRADIEN.length);
    const [c1, c2] = GRADIEN[idx];
    const W = 1000, H = 600;
    const canvas = createCanvas(W, H);
    const c = canvas.getContext('2d');
    const grad = c.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, c1);
    grad.addColorStop(1, c2);
    c.fillStyle = grad;
    c.fillRect(0, 0, W, H);
    // pola lingkaran samar
    c.fillStyle = 'rgba(255,255,255,0.08)';
    const circles = [[120, 90, 130], [880, 480, 170], [820, 80, 70], [90, 520, 90], [500, 300, 55], [700, 540, 46]];
    for (const [x, y, r] of circles) { c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill(); }
    // tanda kutip besar dekoratif
    c.fillStyle = 'rgba(255,255,255,0.25)';
    c.font = 'bold 150px Poppins, sans-serif';
    c.textBaseline = 'top';
    c.textAlign = 'left';
    c.fillText('“', 56, 18);
    // teks quote di tengah
    c.fillStyle = '#ffffff';
    c.font = '44px Poppins, sans-serif';
    const lines = wrapText(c, teks, 840);
    const blockH = lines.length * 56;
    let y = Math.max(90, (H - blockH) / 2 - 10);
    c.textAlign = 'center';
    for (const line of lines.slice(0, 7)) { c.fillText(line, W / 2, y); y += 56; }
    // nama pembuat di kanan bawah
    c.font = '28px Inter, sans-serif';
    c.textAlign = 'right';
    c.fillStyle = 'rgba(255,255,255,0.9)';
    c.fillText('— ' + String(nama).slice(0, 40), W - 48, H - 58);
    const png = await canvas.encode('png');
    await ctx.sock.sendMessage(m.chat, { image: png, caption: '💬 Quote kamu sudah jadi!' }, { quoted: m.raw });
  } catch (e) {
    return ctx.reply('Error: ' + e.message);
  }
}
