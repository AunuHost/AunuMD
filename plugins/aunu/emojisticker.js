// AunuMD • stiker emoji besar 512x512 dari aset Twemoji (aunuSendEmojiSticker).
export const config = {
  name: 'emojisticker',
  alias: ['emosticker', 'bigemoji'],
  category: 'aunu',
  description: 'Mengirim satu emoji sebagai stiker besar transparan 512x512 (render Twemoji)',
  usage: '.emojisticker <emoji>',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 5
};

export default async function (m, ctx) {
  const { sock, text, reply } = ctx;
  if (!text) return reply(`Pemakaian: ${config.usage}`);
  const emoji = text.trim().split(/\s+/)[0];
  try {
    await sock.aunuSendEmojiSticker(m.chat, emoji, { quoted: m.raw });
  } catch (e) {
    reply('Error: ' + e.message);
  }
}
