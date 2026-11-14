// AunuMD • Berhenti mengikuti channel/newsletter WhatsApp
export const config = {
  name: 'unfollow',
  alias: ['nlunfollow'],
  category: 'newsletter',
  description: 'Berhenti mengikuti channel/newsletter',
  usage: '.unfollow <link channel / jid@newsletter>',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 3
};
function parseInput(raw) {
  const token = (raw || '').trim().split(/\s+/)[0];
  if (!token) return null;
  if (token.includes('@newsletter')) return { jid: token };
  return { code: token.replace(/\/+$/, '').split('/').pop() };
}
export default async function (m, ctx) {
  const { sock, reply, text } = ctx;
  const input = parseInput(text);
  if (!input) return reply('Pemakaian: ' + config.usage);
  try {
    let jid = input.jid;
    if (!jid) {
      const meta = await sock.newsletterMetadata('invite', input.code);
      jid = meta?.id;
    }
    if (!jid) return reply('Gagal menemukan channel dari link itu.');
    await sock.newsletterUnfollow(jid);
    reply(`Berhasil berhenti mengikuti channel: ${jid}`);
  } catch (e) {
    reply('Error: ' + e.message);
  }
}
