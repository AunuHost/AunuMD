// AunuMD • Fake quote gaya iOS dengan bar status (jam, jaringan, baterai)
import { createCanvas, loadImage, ensureFonts, quoteCardPng } from '../../src/canvas.js';
import { getBuffer } from '../../src/helper.js';

export const config = {
  name: 'iqc2',
  alias: [],
  category: 'canvas',
  description: 'Fake quote dengan bar status HP di bagian atas',
  usage: '.iqc2 <teks> atau .iqc2 <Nama>|<teks>',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 5
};

async function getAvatar(ctx, jid) {
  try {
    const url = await ctx.sock.profilePictureUrl(jid, 'image').catch(() => null);
    return url ? await getBuffer(url) : null;
  } catch { return null; }
}

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
    const avatarBuffer = await getAvatar(ctx, m.quoted?.sender || m.sender);
    const cardBuf = await quoteCardPng({ name: nama, text: teks, avatarBuffer, nameColor: '#53bdeb', dark: true });
    const card = await loadImage(cardBuf);
    const barH = 54;
    const canvas = createCanvas(card.width, card.height + barH);
    const c = canvas.getContext('2d');
    c.fillStyle = '#111b21';
    c.fillRect(0, 0, canvas.width, canvas.height);
    // bar status
    const jam = new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date()).replace('.', ':');
    c.fillStyle = '#e9edef';
    c.font = 'bold 24px Inter, sans-serif';
    c.textBaseline = 'middle';
    c.textAlign = 'left';
    c.fillText(jam, 26, barH / 2);
    c.textAlign = 'right';
    c.font = '22px Inter, sans-serif';
    c.fillText('📶 5G  🔋 87%', canvas.width - 26, barH / 2);
    c.drawImage(card, 0, barH);
    const png = await canvas.encode('png');
    await ctx.sock.sendMessage(m.chat, { image: png, caption: '📱 Fake quote + bar status selesai!' }, { quoted: m.raw });
  } catch (e) {
    return ctx.reply('Error: ' + e.message);
  }
}
