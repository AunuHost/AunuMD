// AunuMD • tanggal hari ini: Masehi, Hijriah, pasaran Jawa.
export const config = {
  name: 'tanggal',
  alias: ['hariini'],
  category: 'cek',
  description: 'Tanggal hari ini lengkap (Masehi, Hijriah, pasaran Jawa)',
  usage: '.tanggal',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 3
};

const PASARAN = ['Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon'];

export default async function (m, ctx) {
  const now = new Date();
  const masehi = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  }).format(now);
  const hijriah = new Intl.DateTimeFormat('id-ID-u-ca-islamic', {
    day: 'numeric', month: 'long', year: 'numeric'
  }).format(now);
  // Anchor: 1970-01-01 = Kamis Legi -> indeks Legi = 0 pada hari epoch 0.
  const hariEpoch = Math.floor(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86400000);
  const pasaran = PASARAN[((hariEpoch % 5) + 5) % 5];
  const namaHari = new Intl.DateTimeFormat('id-ID', { weekday: 'long' }).format(now);
  const awalTahun = new Date(now.getFullYear(), 0, 1);
  const akhirTahun = new Date(now.getFullYear(), 11, 31);
  const keN = Math.floor((new Date(now.getFullYear(), now.getMonth(), now.getDate()) - awalTahun) / 86400000) + 1;
  const sisa = Math.floor((akhirTahun - new Date(now.getFullYear(), now.getMonth(), now.getDate())) / 86400000);
  await ctx.reply(
    `📅 *Tanggal Hari Ini*\n\n` +
    `🗓️ Masehi: ${masehi}\n` +
    `🌙 Hijriah: ${hijriah}\n` +
    `🌀 Pasaran Jawa: ${namaHari} ${pasaran}\n` +
    `🔢 Hari ke-${keN} di tahun ${now.getFullYear()}\n` +
    `⏳ Sisa hari tahun ini: ${sisa} hari`
  );
}
