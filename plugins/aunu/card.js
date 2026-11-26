// AunuMD • Kartu foto interaktif dengan tombol Suka / Tidak Suka
import { sendCard, CARD_ENABLED } from '../../src/card.js';
export const config = {
  name: 'card',
  alias: ['kartu'],
  category: 'aunu',
  description: 'Mengirim kartu foto interaktif (foto header menyatu dengan teks + tombol 👍/👎)',
  usage: '.card <teks>',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 5
};
export default async function (m, ctx) {
  const { sock, text, reply } = ctx;
  const botCfg = ctx.config;
  if (!text) return reply(`Pemakaian: ${config.usage}`);
  if (!CARD_ENABLED) return reply('ℹ️ Kartu interaktif sementara dinonaktifkan — jalur interaktif library sedang diperbaiki. Pakai .menu untuk daftar perintah.');
  try {
    let image;
    if (m.quoted && typeof m.quoted.type === 'string' && m.quoted.type.includes('image')) {
      image = (await m.quoted.download().catch(() => null)) || undefined;
    }
    if (!image && typeof botCfg.thumbnail === 'string' && botCfg.thumbnail) {
      image = botCfg.thumbnail; // string: URL atau path lokal — diselesaikan+di-cache oleh sendCard
    }
    await sendCard(sock, m.chat, {
      title: botCfg.botName,
      text,
      footer: 'AunuMD • @aunucore/baileys',
      image,
      likeDislike: true
    });
  } catch (e) {
    reply('Error: ' + e.message);
  }
}
