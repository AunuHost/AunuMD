// AunuMD • Menambang mineral berharga (jeda 20 menit)
export const config = { name: 'tambang', alias: ['mining'], category: 'rpg', description: 'Menambang batu, besi, emas, sampai berlian', usage: '.tambang', isOwner: false, isGroup: false, isPrivate: false, cooldown: 3 };
const JEDA = 20 * 60 * 1000;
export default async function (m, ctx) {
  const { reply, db } = ctx;
  const u = db.users.get(m.sender) || {};
  u.balance = u.balance || 0;
  const now = Date.now();
  if (u.lastMine && now - u.lastMine < JEDA) {
    const sisa = Math.ceil((JEDA - (now - u.lastMine)) / 60000);
    await reply(`⛏️ Tambang lagi ditutup sementara untuk keamanan. Tunggu *${sisa} menit* lagi.`);
    return;
  }
  u.lastMine = now;
  const roll = Math.random();
  let teks;
  const jual = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
  if (roll < 0.35) {
    const harga = jual(2000, 8000);
    u.balance += harga;
    teks = `⛏️ Kamu menggali dan menemukan setumpuk *🪨 batu kali*.\n💵 Laku dijual: *Rp ${harga.toLocaleString('id-ID')}*`;
  } else if (roll < 0.65) {
    const harga = jual(10000, 30000);
    u.balance += harga;
    teks = `⛏️ Cangkulmu membentur sesuatu yang keras: *🔩 bijih besi*!\n💵 Laku dijual: *Rp ${harga.toLocaleString('id-ID')}*`;
  } else if (roll < 0.85) {
    const harga = jual(50000, 150000);
    u.balance += harga;
    teks = `⛏️ Ada kilau kuning di dinding gua: *🥇 bongkahan emas*!\n💵 Laku dijual: *Rp ${harga.toLocaleString('id-ID')}*`;
  } else if (roll < 0.93) {
    const harga = jual(300000, 800000);
    u.balance += harga;
    teks = `🎉 *JACKPOT TAMBANG!*\n⛏️ Kamu menemukan *💎 BERLIAN* sebesar telur ayam!\n💵 Laku dijual: *Rp ${harga.toLocaleString('id-ID')}*`;
  } else {
    teks = `💥 *GUA RUNTUH!* Kamu berhasil lari keluar tepat waktu, tapi semua hasil galian tertimbun.\n💵 Hasil: *Rp 0* — yang penting selamat.`;
  }
  db.users.set(m.sender, u);
  await reply(`${teks}\n👛 Saldo sekarang: *Rp ${u.balance.toLocaleString('id-ID')}*`);
}
