// AunuMD • Menyisipkan watermark tak terlihat ke dalam teks
import { sendRichText } from '../../src/rich.js';
export const config = {
  name: 'watermark',
  alias: ['wm'],
  category: 'aunu',
  description: 'Menyisipkan watermark zero-width ke dalam teks',
  usage: '.wm <teks> | <tag>',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 3
};
export default async function (m, ctx) {
  const { sock, text, reply } = ctx;
  const botCfg = ctx.config;
  if (!text) return reply(`Pemakaian: ${config.usage}`);
  const bagian = text.split('|').map((s) => s.trim());
  const teks = bagian[0];
  if (!teks) return reply(`Pemakaian: ${config.usage}`);
  const tag = bagian[1] || botCfg.botName;
  try {
    const hasil = sock.aunuWatermark(teks, tag);
    await sendRichText(sock, m.chat, hasil, { quoted: m.raw, title: botCfg.botName });
  } catch (e) {
    reply('Error: ' + e.message);
  }
}
