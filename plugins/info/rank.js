// AunuMD • peringkat 10 pengguna dengan jumlah pesan terbanyak.
export const config = {
  name: 'rank',
  alias: ['topchat'],
  category: 'info',
  description: 'Peringkat 10 pengguna teraktif berdasarkan jumlah pesan',
  usage: '.rank',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 3
};

export default async function (m, ctx) {
  const all = ctx.db.users.all() || {};
  const rows = Object.entries(all)
    .map(([jid, u]) => ({ jid, msgs: u?.msgs || 0 }))
    .filter((r) => r.msgs > 0)
    .sort((a, b) => b.msgs - a.msgs)
    .slice(0, 10);
  if (!rows.length) { await ctx.reply('📊 Belum ada data pesan pengguna.'); return; }
  const medals = ['🥇', '🥈', '🥉'];
  const lines = rows.map((r, i) => {
    const lvl = 1 + Math.floor(Math.sqrt(r.msgs / 50));
    return `${medals[i] || `${i + 1}.`} @${r.jid.split('@')[0]} — ${r.msgs} pesan (Level ${lvl})`;
  });
  await ctx.sock.sendMessage(m.chat, {
    text: `🏆 *Top Chat — 10 Pengguna Teraktif*\n\n${lines.join('\n')}`,
    mentions: rows.map((r) => r.jid)
  }, { quoted: m.raw });
}
