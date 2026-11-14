// AunuMD • Fake quote gaya iOS/WhatsApp (kartu quote lokal prosedural)
import { quoteCardPng } from '../../src/canvas.js';
import { getBuffer } from '../../src/helper.js';

export const config = {
  name: 'iqc',
  alias: [],
  category: 'canvas',
  description: 'Membuat fake quote bergaya chat dari teks kamu',
  usage: '.iqc <teks> atau .iqc <Nama>|<teks>',
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
    const avatarBuffer = await getAvatar(ctx, m.quoted?.sender || m.sender);
    const png = await quoteCardPng({ name: nama, text: teks, avatarBuffer, nameColor: '#53bdeb', dark: true });
    await ctx.sock.sendMessage(m.chat, { image: png, caption: '💬 Fake quote berhasil dibuat!' }, { quoted: m.raw });
  } catch (e) {
    return ctx.reply('Error: ' + e.message);
  }
}
