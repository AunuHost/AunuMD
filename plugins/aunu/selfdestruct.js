// AunuMD • Mengirim pesan yang musnah sendiri setelah beberapa detik
import { sendRichText } from '../../src/rich.js';
export const config = {
  name: 'selfdestruct',
  alias: ['sd'],
  category: 'aunu',
  description: 'Mengirim pesan yang terhapus sendiri setelah N detik (5–3600)',
  usage: '.selfdestruct <detik> <teks>',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 3
};
export default async function (m, ctx) {
  const { sock, args, reply } = ctx;
  const detik = Number(args[0]);
  const teks = args.slice(1).join(' ');
  if (!Number.isFinite(detik) || detik < 5 || detik > 3600 || !teks) {
    return reply(`Pemakaian: ${config.usage}\nContoh: .selfdestruct 30 Pesan ini hilang dalam 30 detik`);
  }
  try {
    const msg = await sock.aunuSelfDestruct(m.chat, { text: teks }, detik);
    await sendRichText(sock, m.chat, `Pesan musnah-sendiri terkirim (id: ${msg?.key?.id || '?'}). Hapus paksa: .cancelsd <id>`, { title: ctx.config.botName });
  } catch (e) {
    reply('Error: ' + e.message);
  }
}
