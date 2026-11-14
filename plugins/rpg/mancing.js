// AunuMD • Memancing ikan untuk dijual (jeda 10 menit)
export const config = { name: 'mancing', alias: ['fishing'], category: 'rpg', description: 'Mancing ikan dan jual hasilnya', usage: '.mancing', isOwner: false, isGroup: false, isPrivate: false, cooldown: 3 };
const IKAN = [
  { nama: '🐟 Ikan Lele', min: 3000, max: 8000 },
  { nama: '🐟 Ikan Nila', min: 4000, max: 10000 },
  { nama: '🐟 Ikan Mujair', min: 3000, max: 9000 },
  { nama: '🐟 Ikan Gurame', min: 8000, max: 20000 },
  { nama: '🐟 Ikan Mas', min: 5000, max: 12000 },
  { nama: '🐠 Ikan Koi kecil', min: 10000, max: 25000 },
  { nama: '🐟 Ikan Patin', min: 6000, max: 15000 },
  { nama: '🦐 Udang sungai', min: 7000, max: 18000 }
];
const LANGKA = [
  { nama: '✨🐠 Ikan Koi Kohaku premium', min: 100000, max: 250000 },
  { nama: '✨🐟 Arwana Silver', min: 150000, max: 400000 },
  { nama: '✨🦈 Hiu air tawar raksasa', min: 200000, max: 500000 }
];
const SAMPAH = [
  '🩴 Sandal jepit putus. Klasik.',
  '🥫 Kaleng karatan. Lumayan buat malu-maluin.',
  '🧴 Botol plastik kosong. Jaga kebersihan sungai ya!',
  '🦴 Tulang ikan doang. Ikannya sudah kabur duluan.'
];
const JEDA = 10 * 60 * 1000;
export default async function (m, ctx) {
  const { reply, db } = ctx;
  const u = db.users.get(m.sender) || {};
  u.balance = u.balance || 0;
  const now = Date.now();
  if (u.lastFish && now - u.lastFish < JEDA) {
    const sisa = Math.ceil((JEDA - (now - u.lastFish)) / 60000);
    await reply(`🎣 Ikannya lagi pada kabur. Tunggu *${sisa} menit* lagi sebelum mancing.`);
    return;
  }
  u.lastFish = now;
  const roll = Math.random();
  let teks;
  if (roll < 0.60) {
    const ikan = IKAN[Math.floor(Math.random() * IKAN.length)];
    const harga = ikan.min + Math.floor(Math.random() * (ikan.max - ikan.min + 1));
    u.balance += harga;
    teks = `🎣 Kamu menarik kail dan dapat *${ikan.nama}*!\n💵 Langsung laku dijual: *Rp ${harga.toLocaleString('id-ID')}*`;
  } else if (roll < 0.85) {
    const sampah = SAMPAH[Math.floor(Math.random() * SAMPAH.length)];
    teks = `🎣 Kamu menarik kail dan dapat...\n${sampah}\n💵 Hasil jual: *Rp 0*`;
  } else {
    const ikan = LANGKA[Math.floor(Math.random() * LANGKA.length)];
    const harga = ikan.min + Math.floor(Math.random() * (ikan.max - ikan.min + 1));
    u.balance += harga;
    teks = `🎉 *TANGKAPAN LANGKA!*\n🎣 Kamu dapat *${ikan.nama}*!\n💵 Laku keras: *Rp ${harga.toLocaleString('id-ID')}*`;
  }
  db.users.set(m.sender, u);
  await reply(`${teks}\n👛 Saldo sekarang: *Rp ${u.balance.toLocaleString('id-ID')}*`);
}
