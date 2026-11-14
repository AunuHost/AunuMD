// AunuMD • buat QR code dari teks/URL (lokal, paket qrcode)
import QRCode from 'qrcode';

export const config = {
  name: 'txt2qr',
  alias: ['qrteks'],
  category: 'tools',
  description: 'Buat QR code dari teks atau URL',
  usage: '.txt2qr <teks/url>',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 3
};

export default async function (m, ctx) {
  const text = (ctx.text || '').trim() || (m.quoted?.text || '').trim();
  if (!text) { await ctx.reply(`Pemakaian: ${config.usage}`); return; }
  if (text.length > 800) { await ctx.reply('❌ Teks terlalu panjang (maks 800 karakter).'); return; }
  try {
    const buf = await QRCode.toBuffer(text, { width: 512, margin: 2 });
    await ctx.sock.sendMessage(m.chat, {
      image: buf,
      caption: `📱 *QR Code*\n> ${text.length > 80 ? text.slice(0, 80) + '...' : text}`
    }, { quoted: m.raw });
  } catch (e) {
    await ctx.reply(`❌ Error: ${e.message}`);
  }
}
