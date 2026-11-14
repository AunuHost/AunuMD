// AunuMD • QR code custom dengan logo gambar (reply) di tengah (lokal: qrcode + canvas)
import QRCode from 'qrcode';
import { createCanvas, loadImage, roundRectPath } from '../../src/canvas.js';

export const config = {
  name: 'qrcustom',
  alias: ['qrcode', 'qr'],
  category: 'tools',
  description: 'Buat QR code custom — reply gambar untuk menjadikannya logo di tengah QR',
  usage: '.qrcustom <teks/url> (reply gambar untuk logo)',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 5
};

export default async function (m, ctx) {
  const text = (ctx.text || '').trim();
  if (!text) {
    await ctx.reply(
      `📱 *QR CODE CUSTOM*\n\nPemakaian: \`${ctx.prefix}qrcustom <url/teks>\`\n` +
      `Contoh: \`${ctx.prefix}qrcustom https://wa.me/628xxx\`\n\n` +
      `💡 Reply sebuah gambar untuk memasang logo di tengah QR.`
    );
    return;
  }
  if (text.length > 800) { await ctx.reply('❌ Teks terlalu panjang (maks 800 karakter).'); return; }

  try {
    await m.react('⏳');
    // Error correction level H: QR tetap terbaca walau tengahnya tertutup logo.
    const qrBuf = await QRCode.toBuffer(text, { width: 640, margin: 2, errorCorrectionLevel: 'H' });
    const qrImg = await loadImage(qrBuf);
    const size = qrImg.width;
    const canvas = createCanvas(size, size);
    const c = canvas.getContext('2d');
    c.drawImage(qrImg, 0, 0);

    let logoBuf = null;
    if (m.quoted?.type === 'imageMessage') logoBuf = await m.quoted.download();

    if (logoBuf) {
      try {
        const logo = await loadImage(logoBuf);
        const logoSize = Math.round(size * 0.22);
        const x = Math.round((size - logoSize) / 2);
        const y = Math.round((size - logoSize) / 2);
        const pad = Math.round(size * 0.015);
        // Latar putih rounded agar logo tidak menyatu dengan modul QR.
        c.fillStyle = '#ffffff';
        roundRectPath(c, x - pad, y - pad, logoSize + pad * 2, logoSize + pad * 2, Math.round(logoSize * 0.18));
        c.fill();
        c.save();
        roundRectPath(c, x, y, logoSize, logoSize, Math.round(logoSize * 0.15));
        c.clip();
        // Cover: skala logo memenuhi kotak.
        const scale = Math.max(logoSize / logo.width, logoSize / logo.height);
        const w = logo.width * scale, h = logo.height * scale;
        c.drawImage(logo, x + (logoSize - w) / 2, y + (logoSize - h) / 2, w, h);
        c.restore();
      } catch { /* logo gagal dimuat — kirim QR polos */ }
    }

    const out = await canvas.encode('png');
    await ctx.sock.sendMessage(m.chat, {
      image: out,
      caption: `📱 *QR Code Custom*\n> ${text.length > 60 ? text.slice(0, 60) + '...' : text}`
    }, { quoted: m.raw });
  } catch (e) {
    await ctx.reply(`❌ Error: ${e.message}`);
  }
}
