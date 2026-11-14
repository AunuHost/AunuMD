// AunuMD • Pembuat quote lokal serbaguna dengan pilihan tema (cadangan .qc)
import { quoteCardPng } from '../../src/canvas.js';
import { getBuffer } from '../../src/helper.js';

export const config = {
  name: 'quotemaker',
  alias: ['qmlokal'],
  category: 'canvas',
  description: 'Buat quote chat lokal dengan tema gelap, terang, atau pink',
  usage: '.quotemaker [gelap|terang|pink] <teks>',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 5
};

const TEMA = {
  gelap: { dark: true, nameColor: '#53bdeb' },
  terang: { dark: false, nameColor: '#0a7ea4' },
  pink: { dark: true, nameColor: '#ff5c8a' }
};

export default async function (m, ctx) {
  let raw = (ctx.text || '').trim();
  let tema = 'gelap';
  const first = raw.split(/\s+/)[0]?.toLowerCase();
  if (first && TEMA[first]) {
    tema = first;
    raw = raw.slice(first.length).trim();
  }
  let teks = raw;
  if (!teks && m.quoted?.text) teks = m.quoted.text.trim();
  if (!teks) return ctx.reply('Pemakaian: ' + config.usage + '\nContoh: .quotemaker pink Semangat terus ya!');
  try {
    let avatarBuffer = null;
    try {
      const url = await ctx.sock.profilePictureUrl(m.quoted?.sender || m.sender, 'image').catch(() => null);
      if (url) avatarBuffer = await getBuffer(url);
    } catch { /* avatar opsional */ }
    const t = TEMA[tema];
    const png = await quoteCardPng({
      name: m.pushName || 'Pengguna',
      text: teks,
      avatarBuffer,
      nameColor: t.nameColor,
      dark: t.dark
    });
    await ctx.sock.sendMessage(m.chat, { image: png, caption: `💬 Quote tema *${tema}* selesai!` }, { quoted: m.raw });
  } catch (e) {
    return ctx.reply('Error: ' + e.message);
  }
}
