// AunuMD • Efek mengetik: teks muncul bertahap lewat edit pesan
export const config = {
  name: 'typewriter',
  alias: ['tw'],
  category: 'aunu',
  description: 'Mengirim teks dengan efek mesin tik (muncul bertahap)',
  usage: '.typewriter <teks>',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 5
};
export default async function (m, ctx) {
  const { sock, text, reply } = ctx;
  if (!text) return reply(`Pemakaian: ${config.usage}`);
  try {
    await sock.aunuTypewriter(m.chat, text, {});
  } catch (e) {
    reply('Error: ' + e.message);
  }
}
