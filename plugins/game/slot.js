// AunuMD • Mesin slot emoji gratis: jackpot +200, dua sama +30
const GULUNGAN = ['🍒', '🍋', '🍇', '🍊', '⭐', '💎', '🔔'];
export const config = { name: 'slot', alias: ['slotmachine'], category: 'game', description: 'Mesin slot emoji gratis, jackpot +200 saldo', usage: '.slot', isOwner: false, isGroup: false, isPrivate: false, cooldown: 3 };
export default async function (m, ctx) {
  const { db } = ctx;
  const beri = (n) => { const u = db.users.get(m.sender) || {}; u.balance = (u.balance || 0) + n; db.users.set(m.sender, u); };
  const spin = [0, 1, 2].map(() => GULUNGAN[Math.floor(Math.random() * GULUNGAN.length)]);
  const tampil = `🎰 *MESIN SLOT*\n\n[ ${spin.join(' | ')} ]\n`;
  let hasil;
  let hadiah = 0;
  if (spin[0] === spin[1] && spin[1] === spin[2]) {
    hadiah = 200;
    hasil = '💥 *JACKPOT!!!* Tiga simbol sama! Luar biasa!';
  } else if (spin[0] === spin[1] || spin[1] === spin[2] || spin[0] === spin[2]) {
    hadiah = 30;
    hasil = '✨ *Dua simbol sama!* Lumayan, ada hadiah hiburan.';
  } else {
    hasil = '😅 Belum beruntung kali ini. Tenang, main slot di sini gratis!';
  }
  if (hadiah > 0) beri(hadiah);
  const saldo = (db.users.get(m.sender) || {}).balance || 0;
  await ctx.reply(`${tampil}\n${hasil}\n\n💰 ${hadiah > 0 ? `+${hadiah} saldo` : '+0 saldo'}\n💼 Saldo kamu sekarang: *${saldo}*`);
}
