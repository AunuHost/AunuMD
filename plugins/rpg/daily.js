// AunuMD • Klaim hadiah harian dengan streak (jeda 24 jam)
export const config = { name: 'daily', alias: ['klaim'], category: 'rpg', description: 'Klaim bonus harian Rp 500 + bonus acak', usage: '.daily', isOwner: false, isGroup: false, isPrivate: false, cooldown: 3 };
const JEDA = 24 * 60 * 60 * 1000;
const BATAS_STREAK = 48 * 60 * 60 * 1000;
export default async function (m, ctx) {
  const { reply, db } = ctx;
  const u = db.users.get(m.sender) || {};
  u.balance = u.balance || 0;
  const now = Date.now();
  if (u.lastDaily && now - u.lastDaily < JEDA) {
    const sisaMs = JEDA - (now - u.lastDaily);
    const jam = Math.floor(sisaMs / 3600000);
    const menit = Math.ceil((sisaMs % 3600000) / 60000);
    await reply(`⏳ Kamu sudah klaim hari ini. Klaim berikutnya dalam *${jam} jam ${menit} menit*.\n🔥 Streak saat ini: *${u.dailyStreak || 0} hari*`);
    return;
  }
  if (u.lastDaily && now - u.lastDaily <= BATAS_STREAK) {
    u.dailyStreak = (u.dailyStreak || 0) + 1;
  } else {
    u.dailyStreak = 1;
  }
  const dasar = 500;
  const bonus = Math.floor(Math.random() * 501);
  const total = dasar + bonus;
  u.balance += total;
  u.lastDaily = now;
  db.users.set(m.sender, u);
  await reply(
    `🎁 *KLAIM HARIAN BERHASIL!*\n\n` +
    `💵 Hadiah dasar: Rp ${dasar.toLocaleString('id-ID')}\n` +
    `🍀 Bonus acak: Rp ${bonus.toLocaleString('id-ID')}\n` +
    `💰 Total diterima: *Rp ${total.toLocaleString('id-ID')}*\n` +
    `🔥 Streak: *${u.dailyStreak} hari*\n` +
    `👛 Saldo sekarang: *Rp ${u.balance.toLocaleString('id-ID')}*\n\n` +
    `_Klaim lagi besok, jangan sampai streak putus!_`
  );
}
