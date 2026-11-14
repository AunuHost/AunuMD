// AunuMD • Tulisan tangan di kertas bergaris (digambar prosedural)
import { createCanvas, ensureFonts, wrapText } from '../../src/canvas.js';

export const config = {
  name: 'nulis',
  alias: ['tulis'],
  category: 'canvas',
  description: 'Menulis teks sebagai tulisan tangan di kertas bergaris',
  usage: '.nulis <teks>',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 5
};

export default async function (m, ctx) {
  const teks = (ctx.text || m.quoted?.text || '').trim();
  if (!teks) return ctx.reply('Pemakaian: ' + config.usage);
  if (teks.length > 600) return ctx.reply('Teks terlalu panjang (maks 600 karakter).');
  try {
    ensureFonts();
    const W = 900, H = 1200, lineH = 48, marginX = 70, topY = 140;
    const canvas = createCanvas(W, H);
    const c = canvas.getContext('2d');
    c.fillStyle = '#ffffff';
    c.fillRect(0, 0, W, H);
    // garis horizontal biru muda mengikuti baris tulisan
    c.strokeStyle = '#a9c7e8';
    c.lineWidth = 2;
    for (let y = topY + lineH; y < H - 30; y += lineH) {
      c.beginPath(); c.moveTo(0, y); c.lineTo(W, y); c.stroke();
    }
    // garis margin merah vertikal
    c.strokeStyle = '#e57373';
    c.lineWidth = 3;
    c.beginPath(); c.moveTo(marginX, 0); c.lineTo(marginX, H); c.stroke();
    // header hari + tanggal
    const now = new Date();
    const hari = new Intl.DateTimeFormat('id-ID', { weekday: 'long' }).format(now);
    const tgl = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(now);
    c.fillStyle = '#666666';
    c.font = '34px Caveat, cursive';
    c.textBaseline = 'alphabetic';
    c.textAlign = 'right';
    c.fillText(`${hari}, ${tgl}`, W - 40, 84);
    c.textAlign = 'left';
    // teks tulisan tangan per baris mengikuti garis
    c.fillStyle = '#1a1a2e';
    c.font = '40px Caveat, cursive';
    const lines = wrapText(c, teks, 780);
    const maxLines = Math.floor((H - 60 - topY) / lineH);
    lines.slice(0, maxLines).forEach((line, i) => {
      c.fillText(line, marginX + 24, topY + i * lineH + 36);
    });
    const png = await canvas.encode('png');
    await ctx.sock.sendMessage(m.chat, { image: png, caption: '📝 Tulisan tanganmu sudah jadi!' }, { quoted: m.raw });
  } catch (e) {
    return ctx.reply('Error: ' + e.message);
  }
}
