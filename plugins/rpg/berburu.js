// AunuMD • Berburu hewan di hutan (jeda 15 menit)
export const config = { name: 'berburu', alias: ['hunt'], category: 'rpg', description: 'Berburu hewan dan jual hasil buruan', usage: '.berburu', isOwner: false, isGroup: false, isPrivate: false, cooldown: 3 };
const HEWAN = [
  { nama: '🐇 Kelinci hutan', min: 10000, max: 25000 },
  { nama: '🦆 Bebek liar', min: 12000, max: 30000 },
  { nama: '🐗 Babi hutan kecil', min: 30000, max: 70000 },
  { nama: '🦌 Rusa muda', min: 50000, max: 120000 },
  { nama: '🐐 Kambing hutan', min: 40000, max: 90000 },
  { nama: '🦃 Ayam hutan', min: 8000, max: 20000 }
];
const JEDA = 15 * 60 * 1000;
export default async function (m, ctx) {
  const { reply, db } = ctx;
  const u = db.users.get(m.sender) || {};
  u.balance = u.balance || 0;
  const now = Date.now();
  if (u.lastHunt && now - u.lastHunt < JEDA) {
    const sisa = Math.ceil((JEDA - (now - u.lastHunt)) / 60000);
    await reply(`🏹 Hewan buruan lagi bersembunyi. Tunggu *${sisa} menit* lagi sebelum berburu.`);
    return;
  }
  u.lastHunt = now;
  const roll = Math.random();
  let teks;
  if (roll < 0.55) {
    const h = HEWAN[Math.floor(Math.random() * HEWAN.length)];
    const harga = h.min + Math.floor(Math.random() * (h.max - h.min + 1));
    u.balance += harga;
    teks = `🏹 Panahmu tepat sasaran! Kamu dapat *${h.nama}*.\n💵 Hasil buruan laku: *Rp ${harga.toLocaleString('id-ID')}*`;
  } else if (roll < 0.80) {
    teks = `🌲 Kamu menyusuri hutan berjam-jam tapi hewan buruan lebih cepat dari kamu.\n💵 Hasil: *Rp 0* — pulang dengan tangan kosong.`;
  } else {
    const denda = Math.min(100, u.balance);
    u.balance -= denda;
    teks = `🤕 *Kamu terluka!* Tersandung akar pohon dan jatuh ke semak berduri.\n💸 Biaya pengobatan: *Rp ${denda.toLocaleString('id-ID')}*`;
  }
  db.users.set(m.sender, u);
  await reply(`${teks}\n👛 Saldo sekarang: *Rp ${u.balance.toLocaleString('id-ID')}*`);
}
