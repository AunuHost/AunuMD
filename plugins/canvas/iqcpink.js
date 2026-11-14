// AunuMD • Fake quote iOS versi pink pastel (digambar lokal)
import { createCanvas, loadImage, ensureFonts, wrapText, roundRectPath } from '../../src/canvas.js';
import { getBuffer } from '../../src/helper.js';

export const config = {
  name: 'iqcpink',
  alias: [],
  category: 'canvas',
  description: 'Membuat fake quote bergaya chat dengan tema pink pastel',
  usage: '.iqcpink <teks> atau .iqcpink <Nama>|<teks>',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 5
};

export default async function (m, ctx) {
  let nama = m.pushName || 'Pengguna';
  let teks = (ctx.text || '').trim();
  if (teks.includes('|')) {
    const [n, t] = teks.split('|');
    if (n && n.trim()) nama = n.trim();
    teks = (t || '').trim();
  }
  if (!teks && m.quoted?.text) teks = m.quoted.text.trim();
  if (!teks) return ctx.reply('Pemakaian: ' + config.usage);
  try {
    ensureFonts();
    let avatarBuffer = null;
    try {
      const url = await ctx.sock.profilePictureUrl(m.quoted?.sender || m.sender, 'image').catch(() => null);
      if (url) avatarBuffer = await getBuffer(url);
    } catch { /* avatar opsional */ }
    const W = 720, pad = 28, avatarR = 34;
    const textX = pad + avatarR * 2 + 20;
    const meas = createCanvas(8, 8).getContext('2d');
    meas.font = '30px Inter, sans-serif';
    const lines = wrapText(meas, teks, W - textX - pad);
    const textH = lines.length * 38;
    const H = Math.max(pad * 2 + textH + 34, pad * 2 + avatarR * 2) + 24;
    const canvas = createCanvas(W, H);
    const c = canvas.getContext('2d');
    // latar pink pastel + bintik dekoratif
    c.fillStyle = '#ffe4ec';
    c.fillRect(0, 0, W, H);
    c.fillStyle = 'rgba(255,92,138,0.10)';
    for (const [x, y, r] of [[60, 40, 46], [660, H - 50, 60], [600, 36, 26], [80, H - 40, 30]]) {
      c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill();
    }
    // gelembung putih
    roundRectPath(c, 12, 12, W - 24, H - 24, 24);
    c.fillStyle = '#ffffff';
    c.fill();
    // avatar bulat
    c.save();
    c.beginPath();
    c.arc(pad + avatarR, pad + 12 + avatarR, avatarR, 0, Math.PI * 2);
    c.clip();
    if (avatarBuffer) {
      try {
        const av = await loadImage(avatarBuffer);
        c.drawImage(av, pad, pad + 12, avatarR * 2, avatarR * 2);
      } catch { c.fillStyle = '#ffb3c6'; c.fillRect(pad, pad + 12, avatarR * 2, avatarR * 2); }
    } else { c.fillStyle = '#ffb3c6'; c.fillRect(pad, pad + 12, avatarR * 2, avatarR * 2); }
    c.restore();
    // nama + teks
    c.textBaseline = 'top';
    c.textAlign = 'left';
    c.font = 'bold 27px Inter, sans-serif';
    c.fillStyle = '#ff5c8a';
    c.fillText(String(nama).slice(0, 40), textX, pad + 14);
    c.font = '30px Inter, sans-serif';
    c.fillStyle = '#3d2430';
    lines.forEach((line, i) => c.fillText(line, textX, pad + 52 + i * 38));
    const png = await canvas.encode('png');
    await ctx.sock.sendMessage(m.chat, { image: png, caption: '🌸 Fake quote pink selesai!' }, { quoted: m.raw });
  } catch (e) {
    return ctx.reply('Error: ' + e.message);
  }
}
