// AunuMD • IG Story satu foto full dengan teks besar di tengah
import { createCanvas, loadImage, ensureFonts, wrapText } from '../../src/canvas.js';

export const config = {
  name: 'fakestory2',
  alias: [],
  category: 'canvas',
  description: 'Fake IG Story: foto penuh + teks besar bergaya stiker di tengah',
  usage: '.fakestory2 <teks> (balas foto)',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 5
};

function drawCover(c, img, x, y, w, h) {
  const s = Math.max(w / img.width, h / img.height);
  const dw = img.width * s, dh = img.height * s;
  c.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
}

export default async function (m, ctx) {
  if (!m.quoted || !/image/.test(m.quoted.type || '')) {
    return ctx.reply('Balas sebuah foto dengan perintah ' + ctx.prefix + 'fakestory2 <teks>.');
  }
  const teks = (ctx.text || '').trim();
  if (!teks) return ctx.reply('Pemakaian: ' + config.usage);
  try {
    ensureFonts();
    const buf = await m.quoted.download();
    if (!buf) return ctx.reply('Gagal mengunduh foto.');
    const img = await loadImage(buf);
    const W = 720, H = 1280;
    const canvas = createCanvas(W, H);
    const c = canvas.getContext('2d');
    drawCover(c, img, 0, 0, W, H);
    // bar progres + header ringkas
    c.fillStyle = 'rgba(255,255,255,0.35)';
    c.fillRect(16, 22, W - 32, 4);
    c.fillStyle = '#ffffff';
    c.fillRect(16, 22, (W - 32) * 0.6, 4);
    c.font = 'bold 27px Inter, sans-serif';
    c.textBaseline = 'middle';
    c.textAlign = 'left';
    c.shadowColor = 'rgba(0,0,0,0.6)';
    c.shadowBlur = 8;
    c.fillStyle = '#ffffff';
    c.fillText(String(m.pushName || 'pengguna').slice(0, 24), 24, 66);
    c.shadowBlur = 0;
    // teks besar tengah dengan stroke hitam
    c.font = 'bold 64px Poppins, sans-serif';
    const lines = wrapText(c, teks, W - 90);
    const lh = 78;
    let y = (H - lines.length * lh) / 2;
    c.textAlign = 'center';
    c.lineWidth = 10;
    c.strokeStyle = '#000000';
    c.lineJoin = 'round';
    for (const line of lines.slice(0, 6)) {
      c.strokeText(line, W / 2, y + 32);
      c.fillStyle = '#ffffff';
      c.fillText(line, W / 2, y + 32);
      y += lh;
    }
    const png = await canvas.encode('png');
    await ctx.sock.sendMessage(m.chat, { image: png, caption: '📸 Fake IG Story + teks selesai!' }, { quoted: m.raw });
  } catch (e) {
    return ctx.reply('Error: ' + e.message);
  }
}
