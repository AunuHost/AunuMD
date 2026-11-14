// AunuMD • Papan peringkat 10 pengguna terkaya
export const config = { name: 'topuang', alias: ['top', 'leaderboard'], category: 'rpg', description: 'Lihat 10 orang terkaya di bot ini', usage: '.topuang', isOwner: false, isGroup: false, isPrivate: false, cooldown: 3 };
export default async function (m, ctx) {
  const { sock, reply, db } = ctx;
  const semua = db.users.all() || {};
  const daftar = Object.entries(semua)
    .filter(([, u]) => (u.balance || 0) > 0)
    .sort((a, b) => (b[1].balance || 0) - (a[1].balance || 0))
    .slice(0, 10);
  if (!daftar.length) {
    await reply('🏆 Papan peringkat masih kosong. Belum ada yang punya saldo.\nJadilah yang pertama: ketik ' + ctx.prefix + 'kerja');
    return;
  }
  const medali = ['🥇', '🥈', '🥉'];
  const mentions = daftar.map(([jid]) => jid);
  let teks = `🏆 *TOP ${daftar.length} ORANG TERKAYA* 💰\n`;
  daftar.forEach(([jid, u], i) => {
    const peringkat = medali[i] || `${i + 1}.`;
    teks += `\n${peringkat} @${jid.split('@')[0]}\n   💵 Rp ${(u.balance || 0).toLocaleString('id-ID')}`;
  });
  teks += `\n\n_Siapa yang bakal jadi nomor 1 berikutnya?_`;
  await sock.sendMessage(m.chat, { text: teks, mentions }, { quoted: m.raw });
}
