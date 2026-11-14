// AunuMD • Mengirim pesan dengan efek mengetik seperti manusia
export const config = {
  name: 'humansend',
  alias: ['hs'],
  category: 'aunu',
  description: 'Mengirim teks dengan jeda mengetik natural seperti manusia',
  usage: '.humansend <teks>',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 3
};
export default async function (m, ctx) {
  const { sock, text, reply } = ctx;
  if (!text) return reply(`Pemakaian: ${config.usage}`);
  try {
    await sock.aunuHumanSend(m.chat, { text }, { quoted: m.raw });
  } catch (e) {
    reply('Error: ' + e.message);
  }
}
