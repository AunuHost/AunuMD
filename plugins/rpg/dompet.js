// AunuMD • Lihat dompet: saldo, jumlah pesan, dan level pengguna
export const config = { name: 'dompet', alias: ['saldo', 'bal'], category: 'rpg', description: 'Lihat saldo, jumlah pesan, dan level kamu', usage: '.dompet', isOwner: false, isGroup: false, isPrivate: false, cooldown: 3 };
export default async function (m, ctx) {
  const { reply, db } = ctx;
  const u = db.users.get(m.sender) || {};
  const saldo = u.balance || 0;
  const msgs = u.msgs || 0;
  const level = 1 + Math.floor(Math.sqrt(msgs / 50));
  const nama = m.pushName || 'Pengguna';
  await reply(
    `👛 *DOMPET ${nama.toUpperCase()}*\n\n` +
    `💰 Saldo: *Rp ${saldo.toLocaleString('id-ID')}*\n` +
    `💬 Jumlah pesan: *${msgs.toLocaleString('id-ID')}*\n` +
    `⭐ Level: *${level}*\n\n` +
    `_Terus aktif di chat untuk naik level!_`
  );
}
