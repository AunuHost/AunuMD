// AunuMD • Foto dengan bingkai ring story Instagram (gradien oranye-ungu)
import { createCanvas, loadImage, ensureFonts } from '../../src/canvas.js';

export const config = {
  name: 'igstory',
  alias: [],
  category: 'canvas',
  description: 'Membuat foto profil bergaya ring story Instagram',
  usage: '.igstory (balas foto)',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 5
};

export default async function (m, ctx) {
  if (!m.quoted || !/image/.test(m.quoted.type || '')) {
    return ctx.reply('Balas sebuah foto dengan perintah ' + ctx.prefix + 'igstory.');
  }
  try {
    ensureFonts();
    const buf = await m.quoted.download();
    if (!buf) return ctx.reply('Gagal mengunduh foto.');
    const img = await loadImage(buf);
    const S = 720;
    const canvas = createCanvas(S, S);
    const c = canvas.getContext('2d');
    c.fillStyle = '#ffffff';
    c.fillRect(0, 0, S, S);
    const cx = S / 2, cy = 320, ringR = 218, photoR = 196;
    // ring gradien Instagram (digambar per segmen busur)
    const stops = ['#feda75', '#fa7e1e', '#d62976', '#962fbf', '#4f5bd5'];
    const segs = 72;
    c.lineWidth = (ringR - photoR);
    for (let i = 0; i < segs; i++) {
      const a0 = (i / segs) * Math.PI * 2 - Math.PI / 2;
      const a1 = ((i + 1.5) / segs) * Math.PI * 2 - Math.PI / 2;
      const t = i / (segs - 1) * (stops.length - 1);
      const i0 = Math.floor(t), i1 = Math.min(stops.length - 1, i0 + 1);
      const mix = (h1, h2, f) => {
        const p = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
        const A = p(h1), B = p(h2);
        return `rgb(${A.map((v, k) => Math.round(v + (B[k] - v) * f)).join(',')})`;
      };
      c.strokeStyle = mix(stops[i0], stops[i1], t - i0);
      c.beginPath();
      c.arc(cx, cy, (ringR + photoR) / 2, a0, a1);
      c.stroke();
    }
    // foto bulat di dalam ring (cover persegi tengah)
    c.save();
    c.beginPath(); c.arc(cx, cy, photoR, 0, Math.PI * 2); c.clip();
    const s = Math.max((photoR * 2) / img.width, (photoR * 2) / img.height);
    const dw = img.width * s, dh = img.height * s;
    c.drawImage(img, cx - dw / 2, cy - dh / 2, dw, dh);
    c.restore();
    // nama di bawah
    c.font = 'bold 40px Inter, sans-serif';
    c.fillStyle = '#111111';
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.fillText(String(m.pushName || 'pengguna').slice(0, 26), cx, 610);
    c.font = '26px Inter, sans-serif';
    c.fillStyle = '#8e8e8e';
    c.fillText('Cerita Anda • ketuk untuk melihat', cx, 652);
    const png = await canvas.encode('png');
    await ctx.sock.sendMessage(m.chat, { image: png, caption: '🌈 Ring story Instagram selesai!' }, { quoted: m.raw });
  } catch (e) {
    return ctx.reply('Error: ' + e.message);
  }
}
