// AunuMD • Informasi channel/newsletter WhatsApp
export const config = {
  name: 'nlinfo',
  alias: [],
  category: 'newsletter',
  description: 'Menampilkan info channel/newsletter',
  usage: '.nlinfo <link channel / jid@newsletter>',
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
    const meta = input.jid
      ? await sock.newsletterMetadata('jid', input.jid)
      : await sock.newsletterMetadata('invite', input.code);
    if (!meta) return reply('Channel tidak ditemukan.');
    const name = meta.name || meta.thread_metadata?.name?.text || '-';
    const id = meta.id || input.jid || '-';
    const subscribers = meta.subscribers || meta.thread_metadata?.subscribers_count || '-';
    const description = meta.description || meta.thread_metadata?.description?.text || '-';
    const teks = [
      '📣 *INFO CHANNEL*',
      '',
      `Nama: ${name}`,
      `ID: ${id}`,
      `Pengikut: ${subscribers}`,
      `Deskripsi: ${description}`
    ].join('\n');
    reply(teks);
  } catch (e) {
    reply('Error: ' + e.message);
  }
}
