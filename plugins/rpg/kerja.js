// AunuMD • Bekerja untuk mendapatkan gaji (jeda 1 jam)
export const config = { name: 'kerja', alias: ['work'], category: 'rpg', description: 'Bekerja dan dapatkan gaji acak', usage: '.kerja', isOwner: false, isGroup: false, isPrivate: false, cooldown: 3 };
const PEKERJAAN = [
  { nama: 'kurir paket', min: 30000, max: 80000 },
  { nama: 'barista', min: 25000, max: 70000 },
  { nama: 'programmer lepas', min: 80000, max: 250000 },
  { nama: 'guru les', min: 40000, max: 120000 },
  { nama: 'driver ojol', min: 35000, max: 90000 },
  { nama: 'desainer grafis', min: 50000, max: 180000 },
  { nama: 'petani', min: 20000, max: 60000 },
  { nama: 'nelayan', min: 30000, max: 110000 },
  { nama: 'penulis konten', min: 35000, max: 130000 },
  { nama: 'teknisi AC', min: 45000, max: 140000 },
  { nama: 'penjaga toko', min: 20000, max: 55000 },
  { nama: 'tukang ojek pangkalan', min: 25000, max: 75000 }
];
const JEDA = 60 * 60 * 1000;
export default async function (m, ctx) {
  const { reply, db } = ctx;
  const u = db.users.get(m.sender) || {};
  u.balance = u.balance || 0;
  const now = Date.now();
  if (u.lastWork && now - u.lastWork < JEDA) {
    const sisa = Math.ceil((JEDA - (now - u.lastWork)) / 60000);
    await reply(`😴 Kamu masih lelah habis bekerja. Istirahat dulu, coba lagi dalam *${sisa} menit*.`);
    return;
  }
  const job = PEKERJAAN[Math.floor(Math.random() * PEKERJAAN.length)];
  const gaji = job.min + Math.floor(Math.random() * (job.max - job.min + 1));
  u.balance += gaji;
  u.lastWork = now;
  db.users.set(m.sender, u);
  await reply(
    `💼 Kamu bekerja sebagai *${job.nama}* seharian penuh.\n\n` +
    `💵 Gaji diterima: *Rp ${gaji.toLocaleString('id-ID')}*\n` +
    `👛 Saldo sekarang: *Rp ${u.balance.toLocaleString('id-ID')}*\n\n` +
    `_Kerja lagi tersedia 1 jam lagi._`
  );
}
