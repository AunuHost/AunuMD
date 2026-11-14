// AunuMD • Fake quote ala komentar TikTok (latar hitam, nama terverifikasi)
import { createCanvas, loadImage, ensureFonts, wrapText } from '../../src/canvas.js';
import { getBuffer } from '../../src/helper.js';

export const config = {
  name: 'ttqc',
  alias: [],
  category: 'canvas',
  description: 'Membuat fake quote bergaya komentar TikTok',
  usage: '.ttqc <teks> atau .ttqc <Nama>|<teks>',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 5
};

// angka interaksi deterministik dari teks (selalu sama untuk teks yang sama)
function hashNum(str, max) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h % max;
}
const fmt = (n) => n >= 1000 ? (n / 1000).toFixed(1).replace('.', ',').replace(',0', '') + ' rb' : String(n);

export default async function (m, ctx) {
  let nama = m.pushName || 'pengguna';
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
    const W = 900;
    const meas = createCanvas(8, 8).getContext('2d');
    meas.font = '34px "Plus Jakarta Sans", sans-serif';
    const lines = wrapText(meas, teks, W - 150 - 40);
    const H = Math.max(300, 150 + lines.length * 46 + 120);
    const canvas = createCanvas(W, H);
    const c = canvas.getContext('2d');
    c.fillStyle = '#000000';
    c.fillRect(0, 0, W, H);
    // avatar bulat kiri atas
    const ax = 40, ay = 40, ar = 42;
    c.save();
    c.beginPath(); c.arc(ax + ar, ay + ar, ar, 0, Math.PI * 2); c.clip();
    if (avatarBuffer) {
      try {
        const av = await loadImage(avatarBuffer);
        c.drawImage(av, ax, ay, ar * 2, ar * 2);
      } catch { c.fillStyle = '#333'; c.fillRect(ax, ay, ar * 2, ar * 2); }
    } else { c.fillStyle = '#333'; c.fillRect(ax, ay, ar * 2, ar * 2); }
    c.restore();
    // nama + centang verifikasi
    const tx = 150;
    c.textBaseline = 'top';
    c.textAlign = 'left';
    c.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
    c.fillStyle = '#ffffff';
    const namaTampil = String(nama).slice(0, 30);
    c.fillText(namaTampil, tx, 44);
    const nw = c.measureText(namaTampil).width;
    const bx = tx + nw + 16, by = 62;
    c.beginPath(); c.arc(bx, by, 13, 0, Math.PI * 2);
    c.fillStyle = '#20d5ec';
    c.fill();
    c.fillStyle = '#000000';
    c.font = 'bold 16px Inter, sans-serif';
    c.textAlign = 'center';
    c.fillText('✔', bx, by - 9);
    c.textAlign = 'left';
    // teks komentar
    c.font = '34px "Plus Jakarta Sans", sans-serif';
    c.fillStyle = '#f1f1f2';
    lines.forEach((line, i) => c.fillText(line, tx, 100 + i * 46));
    // bar interaksi bawah
    const likes = fmt(100 + hashNum(teks + nama, 98500));
    const comments = fmt(3 + hashNum(teks + 'k', 4800));
    const iy = H - 78;
    c.font = '30px Inter, sans-serif';
    c.fillStyle = '#ff2e63';
    c.fillText('❤', tx, iy);
    c.fillStyle = '#a8a8a8';
    c.font = '28px "Plus Jakarta Sans", sans-serif';
    c.fillText(likes, tx + 46, iy + 2);
    c.fillStyle = '#a8a8a8';
    c.fillText('💬', tx + 240, iy);
    c.fillText(comments, tx + 292, iy + 2);
    c.fillStyle = '#71767b';
    c.font = '26px "Plus Jakarta Sans", sans-serif';
    c.fillText('· 2 jam', tx + 480, iy + 4);
    const png = await canvas.encode('png');
    await ctx.sock.sendMessage(m.chat, { image: png, caption: '🎵 Fake quote TikTok selesai!' }, { quoted: m.raw });
  } catch (e) {
    return ctx.reply('Error: ' + e.message);
  }
}
