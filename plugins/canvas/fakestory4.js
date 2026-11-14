// AunuMD • IG Story dua gambar: foto utama + avatar besar sebagai sisipan (PiP)
import { createCanvas, loadImage, ensureFonts, roundRectPath } from '../../src/canvas.js';
import { getBuffer } from '../../src/helper.js';

export const config = {
  name: 'fakestory4',
  alias: [],
  category: 'canvas',
  description: 'Fake IG Story: foto utama full + foto profilmu sebagai gambar sisipan',
  usage: '.fakestory4 (balas foto)',
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
    return ctx.reply('Balas sebuah foto dengan perintah ' + ctx.prefix + 'fakestory4.');
  }
  try {
    ensureFonts();
    const buf = await m.quoted.download();
    if (!buf) return ctx.reply('Gagal mengunduh foto.');
    const img = await loadImage(buf);
    const W = 720, H = 1280;
    const canvas = createCanvas(W, H);
    const c = canvas.getContext('2d');
    drawCover(c, img, 0, 0, W, H);
    // header
    const gTop = c.createLinearGradient(0, 0, 0, 200);
    gTop.addColorStop(0, 'rgba(0,0,0,0.5)');
    gTop.addColorStop(1, 'rgba(0,0,0,0)');
    c.fillStyle = gTop;
    c.fillRect(0, 0, W, 200);
    c.fillStyle = 'rgba(255,255,255,0.35)';
    c.fillRect(16, 22, W - 32, 4);
    c.fillStyle = '#ffffff';
    c.fillRect(16, 22, (W - 32) * 0.5, 4);
    c.font = 'bold 27px Inter, sans-serif';
    c.textBaseline = 'middle';
    c.textAlign = 'left';
    c.fillStyle = '#ffffff';
    c.fillText(String(m.pushName || 'pengguna').slice(0, 24), 24, 66);
    // gambar sisipan: avatar pengirim diperbesar, rounded, pojok kanan bawah
    let avBuf = null;
    try {
      const url = await ctx.sock.profilePictureUrl(m.sender, 'image').catch(() => null);
      if (url) avBuf = await getBuffer(url);
    } catch { /* opsional */ }
    const pw = 240, ph = 320, px = W - pw - 28, py = H - ph - 150;
    c.save();
    roundRectPath(c, px - 5, py - 5, pw + 10, ph + 10, 30);
    c.fillStyle = '#ffffff';
    c.fill();
    c.clip();
    roundRectPath(c, px, py, pw, ph, 26);
    c.clip();
    if (avBuf) {
      try { const av = await loadImage(avBuf); drawCover(c, av, px, py, pw, ph); }
      catch { c.fillStyle = '#bbb'; c.fillRect(px, py, pw, ph); }
    } else {
      const g = c.createLinearGradient(px, py, px + pw, py + ph);
      g.addColorStop(0, '#f09433'); g.addColorStop(0.5, '#dc2743'); g.addColorStop(1, '#bc1888');
      c.fillStyle = g;
      c.fillRect(px, py, pw, ph);
      c.fillStyle = '#ffffff';
      c.font = 'bold 34px Inter, sans-serif';
      c.textAlign = 'center';
      c.fillText('FOTO KAMU', px + pw / 2, py + ph / 2);
    }
    c.restore();
    // label sisipan
    c.font = '22px Inter, sans-serif';
    c.textAlign = 'center';
    c.fillStyle = 'rgba(255,255,255,0.9)';
    c.shadowColor = 'rgba(0,0,0,0.7)';
    c.shadowBlur = 6;
    c.fillText('📷 reaksi kamu', px + pw / 2, py + ph + 30);
    c.shadowBlur = 0;
    const png = await canvas.encode('png');
    await ctx.sock.sendMessage(m.chat, { image: png, caption: '📸 Fake IG Story dua gambar selesai!' }, { quoted: m.raw });
  } catch (e) {
    return ctx.reply('Error: ' + e.message);
  }
}
