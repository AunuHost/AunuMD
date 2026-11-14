// AunuMD • Kartu profil developer palsu (tema Python, gradien gelap biru-ungu)
import { createCanvas, loadImage, ensureFonts } from '../../src/canvas.js';
import { getBuffer } from '../../src/helper.js';

export const config = {
  name: 'fakedev7',
  alias: ['fakedev'],
  category: 'canvas',
  description: 'Membuat kartu developer bergaya profil Python developer',
  usage: '.fakedev7 [Nama] | [Projects] | [Followers] | [Stars]',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 5
};

export default async function (m, ctx) {
  try {
    ensureFonts();
    const parts = (ctx.text || '').split('|').map((s) => s.trim());
    const nama = parts[0] || m.pushName || 'Developer';
    const rnd = (min, max) => Math.floor(min + Math.random() * (max - min));
    const stats = [
      { label: 'Projects', value: parts[1] || String(rnd(8, 64)) },
      { label: 'Followers', value: parts[2] || String(rnd(120, 9800)) },
      { label: 'Stars', value: parts[3] || String(rnd(40, 3200)) }
    ];
    let avBuf = null;
    try {
      const url = await ctx.sock.profilePictureUrl(m.sender, 'image').catch(() => null);
      if (url) avBuf = await getBuffer(url);
    } catch { /* opsional */ }
    const W = 1000, H = 560;
    const canvas = createCanvas(W, H);
    const c = canvas.getContext('2d');
    const grad = c.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, '#0f2027');
    grad.addColorStop(0.5, '#203a43');
    grad.addColorStop(1, '#2c5364');
    c.fillStyle = grad;
    c.fillRect(0, 0, W, H);
    // logo kode samar di pojok kanan atas
    c.font = 'bold 210px Poppins, sans-serif';
    c.fillStyle = 'rgba(255,255,255,0.06)';
    c.textAlign = 'right';
    c.textBaseline = 'top';
    c.fillText('</>', W - 30, -20);
    // aksen Python (dua lingkaran biru & kuning)
    c.beginPath(); c.arc(880, 470, 34, 0, Math.PI * 2); c.fillStyle = 'rgba(55,118,171,0.85)'; c.fill();
    c.beginPath(); c.arc(930, 505, 34, 0, Math.PI * 2); c.fillStyle = 'rgba(255,212,59,0.85)'; c.fill();
    // avatar bulat besar kiri
    const ax = 70, ay = 110, ar = 130;
    c.beginPath(); c.arc(ax + ar, ay + ar, ar + 8, 0, Math.PI * 2);
    c.fillStyle = 'rgba(255,255,255,0.15)';
    c.fill();
    c.save();
    c.beginPath(); c.arc(ax + ar, ay + ar, ar, 0, Math.PI * 2); c.clip();
    if (avBuf) {
      try { const av = await loadImage(avBuf); c.drawImage(av, ax, ay, ar * 2, ar * 2); }
      catch { c.fillStyle = '#3776ab'; c.fillRect(ax, ay, ar * 2, ar * 2); }
    } else {
      c.fillStyle = '#3776ab';
      c.fillRect(ax, ay, ar * 2, ar * 2);
      c.fillStyle = '#ffffff';
      c.font = 'bold 110px Poppins, sans-serif';
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      c.fillText((nama || 'D').charAt(0).toUpperCase(), ax + ar, ay + ar + 4);
    }
    c.restore();
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.font = '24px Inter, sans-serif';
    c.fillStyle = '#ffd43b';
    c.fillText('🐍 Python Developer', ax + ar, ay + ar * 2 + 42);
    // nama + role kanan
    const tx = 400;
    c.textAlign = 'left';
    c.fillStyle = '#ffffff';
    c.font = 'bold 52px Poppins, sans-serif';
    c.fillText(String(nama).slice(0, 22), tx, 150);
    c.font = '30px Inter, sans-serif';
    c.fillStyle = '#9fb6c3';
    c.fillText('Python Developer • Open Source', tx, 205);
    c.font = '24px Inter, sans-serif';
    c.fillStyle = '#6f8b9a';
    c.fillText('"Code. Coffee. Deploy. Repeat."', tx, 248);
    // bar statistik
    const bw = 168, bh = 130, by = 320, gap = 22;
    stats.forEach((s, i) => {
      const bx = tx + i * (bw + gap);
      c.fillStyle = 'rgba(255,255,255,0.08)';
      c.beginPath();
      c.moveTo(bx + 18, by);
      c.lineTo(bx + bw - 18, by); c.lineTo(bx + bw, by + 18); c.lineTo(bx + bw, by + bh - 18);
      c.lineTo(bx + bw - 18, by + bh); c.lineTo(bx + 18, by + bh); c.lineTo(bx, by + bh - 18); c.lineTo(bx, by + 18);
      c.closePath(); c.fill();
      c.textAlign = 'center';
      c.fillStyle = '#ffffff';
      c.font = 'bold 46px Poppins, sans-serif';
      c.fillText(String(s.value), bx + bw / 2, by + 48);
      c.font = '23px Inter, sans-serif';
      c.fillStyle = '#9fb6c3';
      c.fillText(s.label, bx + bw / 2, by + 96);
    });
    c.textAlign = 'left';
    c.font = '22px Inter, sans-serif';
    c.fillStyle = '#55707f';
    c.fillText('github.com/' + String(nama).toLowerCase().replace(/[^a-z0-9]+/g, ''), tx, 505);
    const png = await canvas.encode('png');
    await ctx.sock.sendMessage(m.chat, { image: png, caption: '👨‍💻 Kartu developer selesai!' }, { quoted: m.raw });
  } catch (e) {
    return ctx.reply('Error: ' + e.message);
  }
}
