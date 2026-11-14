// AunuMD • Layout IG Story: latar blur dari foto yang sama + foto asli di tengah
import { createCanvas, loadImage, ensureFonts } from '../../src/canvas.js';
import { getBuffer } from '../../src/helper.js';

export const config = {
  name: 'igstoryimg',
  alias: [],
  category: 'canvas',
  description: 'Menata foto ke layout story 9:16 dengan latar blur',
  usage: '.igstoryimg (balas foto)',
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
    return ctx.reply('Balas sebuah foto dengan perintah ' + ctx.prefix + 'igstoryimg.');
  }
  try {
    ensureFonts();
    const buf = await m.quoted.download();
    if (!buf) return ctx.reply('Gagal mengunduh foto.');
    const img = await loadImage(buf);
    const W = 720, H = 1280;
    const canvas = createCanvas(W, H);
    const c = canvas.getContext('2d');
    // latar: foto yang sama diperbesar (cover) lalu digelapkan — efek blur semu
    drawCover(c, img, -40, -40, W + 80, H + 80);
    c.fillStyle = 'rgba(0,0,0,0.45)';
    c.fillRect(0, 0, W, H);
    // foto asli contain di tengah dengan bingkai putih tipis
    const maxW = W - 56, maxH = H - 320;
    const s = Math.min(maxW / img.width, maxH / img.height);
    const dw = Math.round(img.width * s), dh = Math.round(img.height * s);
    const dx = (W - dw) / 2, dy = (H - dh) / 2;
    c.fillStyle = '#ffffff';
    c.fillRect(dx - 6, dy - 6, dw + 12, dh + 12);
    c.drawImage(img, dx, dy, dw, dh);
    // header story
    c.fillStyle = 'rgba(255,255,255,0.35)';
    c.fillRect(16, 22, W - 32, 4);
    c.fillStyle = '#ffffff';
    c.fillRect(16, 22, (W - 32) * 0.4, 4);
    let avBuf = null;
    try {
      const url = await ctx.sock.profilePictureUrl(m.sender, 'image').catch(() => null);
      if (url) avBuf = await getBuffer(url);
    } catch { /* opsional */ }
    c.save();
    c.beginPath(); c.arc(50, 72, 23, 0, Math.PI * 2); c.clip();
    if (avBuf) {
      try { const av = await loadImage(avBuf); c.drawImage(av, 27, 49, 46, 46); }
      catch { c.fillStyle = '#888'; c.fillRect(27, 49, 46, 46); }
    } else { c.fillStyle = '#888'; c.fillRect(27, 49, 46, 46); }
    c.restore();
    c.font = 'bold 27px Inter, sans-serif';
    c.textBaseline = 'middle';
    c.textAlign = 'left';
    c.fillStyle = '#ffffff';
    c.fillText(String(m.pushName || 'pengguna').slice(0, 24), 86, 64);
    c.font = '23px Inter, sans-serif';
    c.fillStyle = 'rgba(255,255,255,0.75)';
    c.fillText('baru saja', 86, 94);
    // footer
    c.font = '34px Inter, sans-serif';
    c.fillStyle = '#ffffff';
    c.textAlign = 'center';
    c.fillText('❤  ➤', W / 2, H - 52);
    const png = await canvas.encode('png');
    await ctx.sock.sendMessage(m.chat, { image: png, caption: '📸 Layout IG Story selesai!' }, { quoted: m.raw });
  } catch (e) {
    return ctx.reply('Error: ' + e.message);
  }
}
