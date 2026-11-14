// AunuMD • Mention semua member grup dalam satu pesan
export const config = {
  name: 'tagall',
  alias: ['tag'],
  category: 'group',
  description: 'Mention semua member grup',
  usage: '.tagall <teks opsional>',
  isOwner: false, isGroup: true, isPrivate: false,
  cooldown: 5
};
export default async function (m, ctx) {
  const { sock, reply, text } = ctx;
  try {
    const metadata = await sock.groupMetadata(m.chat);
    const participants = metadata.participants || [];
    if (!participants.length) return reply('Tidak ada member yang bisa di-tag.');
    const teks = text || 'Tag semua member';
    const body = teks + '\n\n' + participants.map((p) => `• @${p.id.split('@')[0]}`).join('\n');
    await sock.sendMessage(m.chat, { text: body, mentions: participants.map((p) => p.id) }, { quoted: m.raw });
  } catch (e) {
    reply('Error: ' + e.message);
  }
}
