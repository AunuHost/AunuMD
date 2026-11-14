// AunuMD • Gambar roast: foto target + teks roasting besar di atasnya
import { createCanvas, loadImage, ensureFonts, wrapText } from '../../src/canvas.js';

export const config = {
  name: 'sroast',
  alias: ['roast'],
  category: 'canvas',
  description: 'Membakar (roast) foto yang dibalas dengan teks lucu',
  usage: '.sroast [teks roast] (balas foto)',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 5
};

const ROAST_BAWAAN = [
  'Foto ini diambil pakai kamera kalkulator ya?',
  'Kata cermin: "kita istirahat dulu ya hari ini"',
  'Filter aja sampai menyerah lihat foto ini',
  'Ini foto atau lukisan abstrak? Susah dibedakan',
  'Senyumnya kayak lagi nahan tagihan',
  'Resolusi rendah, kepercayaan diri tinggi. Salut!',
  'Kamera depan pun minta maaf pas motret ini',
  'Gaya sudah maksimal, hasil tetap pas-pasan',
  'Pose andalan sejak 2015, belum pernah ganti',
  'Kalau aura bisa difoto, ini fotonya blur semua'
];

function drawCover(c, img, x, y, w, h) {
  const s = Math.max(w / img.width, h / img.height);
  const dw = img.width * s, dh = img.height * s;
  c.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
}

export default async function (m, ctx) {
  if (!m.quoted || !/image/.test(m.quoted.type || '')) {
    return ctx.reply('Balas sebuah foto dengan perintah ' + ctx.prefix + 'sroast [teks].');
  }
  try {
    ensureFonts();
    const buf = await m.quoted.download();
    if (!buf) return ctx.reply('Gagal mengunduh foto.');
    const img = await loadImage(buf);
    const teks = (ctx.text || '').trim() || ROAST_BAWAAN[Math.floor(Math.random() * ROAST_BAWAAN.length)];
    const S = 900;
    const canvas = createCanvas(S, S);
    const c = canvas.getContext('2d');
    drawCover(c, img, 0, 0, S, S);
    c.fillStyle = 'rgba(0,0,0,0.30)';
    c.fillRect(0, 0, S, S);
    // label atas
    c.font = 'bold 40px Poppins, sans-serif';
    c.textAlign = 'center';
    c.textBaseline = 'top';
    c.lineWidth = 8;
    c.strokeStyle = '#000000';
    c.lineJoin = 'round';
    c.strokeText('TARGET ROAST 🔥', S / 2, 44);
    c.fillStyle = '#ffb703';
    c.fillText('TARGET ROAST 🔥', S / 2, 44);
    // teks roast tengah bawah dengan stroke
    c.font = 'bold 54px Poppins, sans-serif';
    const lines = wrapText(c, teks, S - 110).slice(0, 5);
    const lh = 68;
    let y = S - 90 - lines.length * lh;
    for (const line of lines) {
      c.lineWidth = 11;
      c.strokeText(line, S / 2, y);
      c.fillStyle = '#ffffff';
      c.fillText(line, S / 2, y);
      y += lh;
    }
    const png = await canvas.encode('png');
    await ctx.sock.sendMessage(m.chat, { image: png, caption: '🔥 Roast selesai. Jangan baper ya!' }, { quoted: m.raw });
  } catch (e) {
    return ctx.reply('Error: ' + e.message);
  }
}
