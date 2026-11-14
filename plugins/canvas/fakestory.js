// AunuMD • Simulasi tampilan Instagram Story dari foto yang dibalas
import { createCanvas, loadImage, ensureFonts, roundRectPath } from '../../src/canvas.js';
import { getBuffer } from '../../src/helper.js';

export const config = {
  name: 'fakestory',
  alias: [],
  category: 'canvas',
  description: 'Membuat tampilan fake Instagram Story dari foto',
  usage: '.fakestory (balas foto)',
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
    return ctx.reply('Balas sebuah foto dengan perintah ' + ctx.prefix + 'fakestory.');
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
    // gradien atas
    const gTop = c.createLinearGradient(0, 0, 0, 240);
    gTop.addColorStop(0, 'rgba(0,0,0,0.55)');
    gTop.addColorStop(1, 'rgba(0,0,0,0)');
    c.fillStyle = gTop;
    c.fillRect(0, 0, W, 240);
    // bar progres story
    c.fillStyle = 'rgba(255,255,255,0.35)';
    c.fillRect(16, 22, W - 32, 4);
    c.fillStyle = '#ffffff';
    c.fillRect(16, 22, (W - 32) * 0.45, 4);
    // avatar kecil + nama + waktu
    let avBuf = null;
    try {
      const url = await ctx.sock.profilePictureUrl(m.sender, 'image').catch(() => null);
      if (url) avBuf = await getBuffer(url);
    } catch { /* opsional */ }
    c.save();
    c.beginPath(); c.arc(52, 74, 24, 0, Math.PI * 2); c.clip();
    if (avBuf) {
      try { const av = await loadImage(avBuf); c.drawImage(av, 28, 50, 48, 48); }
      catch { c.fillStyle = '#888'; c.fillRect(28, 50, 48, 48); }
    } else { c.fillStyle = '#888'; c.fillRect(28, 50, 48, 48); }
    c.restore();
    c.textBaseline = 'middle';
    c.textAlign = 'left';
    c.font = 'bold 28px Inter, sans-serif';
    c.fillStyle = '#ffffff';
    c.fillText(String(m.pushName || 'pengguna').slice(0, 24), 90, 66);
    c.font = '24px Inter, sans-serif';
    c.fillStyle = 'rgba(255,255,255,0.75)';
    c.fillText('2j', 90, 98);
    // gradien bawah + kotak kirim pesan
    const gBot = c.createLinearGradient(0, H - 220, 0, H);
    gBot.addColorStop(0, 'rgba(0,0,0,0)');
    gBot.addColorStop(1, 'rgba(0,0,0,0.55)');
    c.fillStyle = gBot;
    c.fillRect(0, H - 220, W, 220);
    c.strokeStyle = 'rgba(255,255,255,0.85)';
    c.lineWidth = 2;
    roundRectPath(c, 24, H - 110, W - 190, 62, 31);
    c.stroke();
    c.font = '26px Inter, sans-serif';
    c.fillStyle = 'rgba(255,255,255,0.85)';
    c.fillText('Kirim pesan...', 48, H - 78);
    c.font = '40px Inter, sans-serif';
    c.fillStyle = '#ffffff';
    c.fillText('❤', W - 138, H - 76);
    c.fillText('➤', W - 72, H - 76);
    const png = await canvas.encode('png');
    await ctx.sock.sendMessage(m.chat, { image: png, caption: '📸 Fake IG Story selesai!' }, { quoted: m.raw });
  } catch (e) {
    return ctx.reply('Error: ' + e.message);
  }
}
