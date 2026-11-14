// AunuMD • melihat daftar absensi hari ini
export const config = { name: 'listabsen', alias: [], category: 'group', description: 'Lihat daftar member yang sudah absen hari ini', usage: '.listabsen', isOwner: false, isGroup: true, isPrivate: false, cooldown: 3 };

export default async function (m, ctx) {
  const g = ctx.db.groups.get(m.chat) || {};
  const tgl = new Date().toLocaleDateString('en-CA');
  const hariIni = (g.absen || {})[tgl] || {};
  const entries = Object.entries(hariIni);
  if (!entries.length) return ctx.reply('Belum ada yang absen hari ini.');
  const mentions = entries.map(([jid]) => jid);
  const lines = entries.map(([jid, jam], i) => `${i + 1}. @${jid.split('@')[0]} — ${jam}`);
  const text = `📋 *Absensi ${tgl}*\nTotal: ${entries.length} member\n\n${lines.join('\n')}`;
  await ctx.sock.sendMessage(m.chat, { text, mentions }, { quoted: m.raw });
}
