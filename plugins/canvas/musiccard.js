// AunuMD • Kartu pemutar musik (cover + judul + artis + progress bar)
import { createCanvas, loadImage, ensureFonts, roundRectPath } from '../../src/canvas.js';
import { getBuffer } from '../../src/helper.js';

export const config = {
  name: 'musiccard',
  alias: ['mcard'],
  category: 'canvas',
  description: 'Membuat kartu pemutar musik dari cover dan judul lagu',
  usage: '.musiccard <Judul>|<Artis> (cover: balas foto / foto profilmu)',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 5
};

function trunc(c, text, maxW) {
  let t = String(text);
  if (c.measureText(t).width <= maxW) return t;
  while (t.length && c.measureText(t + '…').width > maxW) t = t.slice(0, -1);
  return t + '…';
}

export default async function (m, ctx) {
  const raw = (ctx.text || '').trim();
  if (!raw.includes('|')) return ctx.reply('Pemakaian: ' + config.usage + '\nContoh: .musiccard Perfect|Ed Sheeran');
  const [judul, artis] = raw.split('|').map((s) => s.trim());
  if (!judul) return ctx.reply('Judul lagunya kosong.');
  try {
    ensureFonts();
    // cover: quoted image, fallback avatar pengirim
    let coverBuf = null;
    if (m.quoted && /image/.test(m.quoted.type || '')) coverBuf = await m.quoted.download().catch(() => null);
    if (!coverBuf) {
      try {
        const url = await ctx.sock.profilePictureUrl(m.sender, 'image').catch(() => null);
        if (url) coverBuf = await getBuffer(url);
      } catch { /* opsional */ }
    }
    const W = 1000, H = 420;
    const canvas = createCanvas(W, H);
    const c = canvas.getContext('2d');
    roundRectPath(c, 4, 4, W - 8, H - 8, 36);
    c.fillStyle = '#181818';
    c.fill();
    // cover persegi rounded kiri
    const cv = 300, cx = 56, cy = (H - cv) / 2;
    c.save();
    roundRectPath(c, cx, cy, cv, cv, 22);
    c.clip();
    if (coverBuf) {
      try {
        const img = await loadImage(coverBuf);
        const s = Math.max(cv / img.width, cv / img.height);
        const dw = img.width * s, dh = img.height * s;
        c.drawImage(img, cx + (cv - dw) / 2, cy + (cv - dh) / 2, dw, dh);
      } catch { c.fillStyle = '#282828'; c.fillRect(cx, cy, cv, cv); }
    } else {
      const g = c.createLinearGradient(cx, cy, cx + cv, cy + cv);
      g.addColorStop(0, '#1db954'); g.addColorStop(1, '#0f5132');
      c.fillStyle = g;
      c.fillRect(cx, cy, cv, cv);
      c.fillStyle = '#ffffff';
      c.font = 'bold 120px Poppins, sans-serif';
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      c.fillText('♪', cx + cv / 2, cy + cv / 2);
    }
    c.restore();
    // judul + artis
    const tx = cx + cv + 48;
    const maxW = W - tx - 48;
    c.textAlign = 'left';
    c.textBaseline = 'alphabetic';
    c.font = 'bold 44px Poppins, sans-serif';
    c.fillStyle = '#ffffff';
    c.fillText(trunc(c, judul, maxW), tx, 118);
    c.font = '30px Inter, sans-serif';
    c.fillStyle = '#b3b3b3';
    c.fillText(trunc(c, artis || 'Unknown Artist', maxW), tx, 162);
    // progress bar
    const barY = 224, barW = maxW;
    roundRectPath(c, tx, barY, barW, 9, 5);
    c.fillStyle = '#4d4d4d';
    c.fill();
    roundRectPath(c, tx, barY, barW * 0.4, 9, 5);
    c.fillStyle = '#ffffff';
    c.fill();
    c.beginPath(); c.arc(tx + barW * 0.4, barY + 4.5, 10, 0, Math.PI * 2);
    c.fillStyle = '#ffffff';
    c.fill();
    // waktu
    c.font = '24px Inter, sans-serif';
    c.fillStyle = '#b3b3b3';
    c.fillText('1:24', tx, barY + 42);
    c.textAlign = 'right';
    c.fillText('3:30', tx + barW, barY + 42);
    // kontrol
    c.textAlign = 'center';
    c.font = '54px Inter, sans-serif';
    c.fillStyle = '#ffffff';
    c.fillText('⏮   ▶   ⏭', tx + barW / 2, 360);
    const png = await canvas.encode('png');
    await ctx.sock.sendMessage(m.chat, { image: png, caption: `🎧 Now playing: *${judul}* — ${artis || 'Unknown Artist'}` }, { quoted: m.raw });
  } catch (e) {
    return ctx.reply('Error: ' + e.message);
  }
}
