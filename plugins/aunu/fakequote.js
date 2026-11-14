// AunuMD • Mengirim pesan dengan kutipan rekayasa (fake quote)
export const config = {
  name: 'fakequote',
  alias: ['fq'],
  category: 'aunu',
  description: 'Mengirim pesan seolah membalas kutipan rekayasa dari seseorang',
  usage: '.fakequote <teks kutipan> | <teks balasan>',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 3
};
export default async function (m, ctx) {
  const { sock, text, reply } = ctx;
  if (!text) return reply(`Pemakaian: ${config.usage}`);
  const bagian = text.split('|').map((s) => s.trim());
  let kutipan, balasan;
  if (bagian.length > 1 && bagian[1]) {
    kutipan = bagian[0];
    balasan = bagian.slice(1).join(' | ');
  } else {
    balasan = text;
    kutipan = m.quoted?.text || '...';
  }
  const from = m.mentionedJid?.[0] || m.sender;
  try {
    await sock.aunuFakeQuote(m.chat, { text: balasan }, { from, text: kutipan });
  } catch (e) {
    reply('Error: ' + e.message);
  }
}
