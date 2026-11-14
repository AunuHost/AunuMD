// AunuMD • IG Story dengan stiker teks (kotak semi-transparan di tengah foto)
import { createCanvas, loadImage, ensureFonts, wrapText, roundRectPath } from '../../src/canvas.js';

export const config = {
  name: 'fakestory3',
  alias: [],
  category: 'canvas',
  description: 'Fake IG Story: foto + stiker teks ala Instagram di tengah',
  usage: '.fakestory3 <teks> (balas foto)',
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
    return ctx.reply('Balas sebuah foto dengan perintah ' + ctx.prefix + 'fakestory3 <teks>.');
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
    // header ringkas
    c.fillStyle = 'rgba(255,255,255,0.35)';
    c.fillRect(16, 22, W - 32, 4);
    c.fillStyle = '#ffffff';
    c.fillRect(16, 22, (W - 32) * 0.3, 4);
    c.font = 'bold 27px Inter, sans-serif';
    c.textBaseline = 'middle';
    c.textAlign = 'left';
    c.shadowColor = 'rgba(0,0,0,0.6)';
    c.shadowBlur = 8;
    c.fillStyle = '#ffffff';
    c.fillText(String(m.pushName || 'pengguna').slice(0, 24), 24, 66);
    c.shadowBlur = 0;
    // stiker teks: ukur teks dulu
    c.font = 'bold 40px "Plus Jakarta Sans", sans-serif';
    const lines = wrapText(c, teks, 520).slice(0, 5);
    let textW = 0;
    for (const l of lines) textW = Math.max(textW, c.measureText(l).width);
    const boxW = Math.min(W - 60, textW + 72);
    const boxH = lines.length * 52 + 44;
    const bx = (W - boxW) / 2, by = (H - boxH) / 2;
    roundRectPath(c, bx, by, boxW, boxH, 26);
    c.fillStyle = 'rgba(255,255,255,0.92)';
    c.fill();
    c.fillStyle = '#111111';
    c.textAlign = 'center';
    c.textBaseline = 'top';
    lines.forEach((line, i) => c.fillText(line, W / 2, by + 24 + i * 52));
    const png = await canvas.encode('png');
    await ctx.sock.sendMessage(m.chat, { image: png, caption: '📸 Fake IG Story + stiker teks selesai!' }, { quoted: m.raw });
  } catch (e) {
    return ctx.reply('Error: ' + e.message);
  }
}
