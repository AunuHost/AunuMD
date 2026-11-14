// AunuMD • Menilai sesuatu dengan persentase acak 0-100%
function komentar(nilai) {
  if (nilai <= 10) return 'Nyaris tidak ada harapan. Tapi siapa tahu, keajaiban itu nyata. 😅';
  if (nilai <= 25) return 'Kecil banget. Perlu usaha ekstra kalau mau hasil beda.';
  if (nilai <= 40) return 'Di bawah rata-rata. Masih bisa dikejar kalau serius.';
  if (nilai <= 55) return 'Lumayan, lima puluh-lima puluh. Tergantung usaha dan nasib.';
  if (nilai <= 70) return 'Cukup menjanjikan! Tinggal sedikit polesan lagi.';
  if (nilai <= 85) return 'Tinggi! Potensinya besar, jangan disia-siakan.';
  if (nilai <= 99) return 'Nyaris sempurna! Tinggal selangkah lagi menuju puncak.';
  return 'SEMPURNA! 100%! Ini sih level legendaris. 🎉';
}
export const config = { name: 'rate', alias: [], category: 'fun', description: 'Menilai sesuatu dengan persentase acak 0-100%', usage: '.rate <hal>', isOwner: false, isGroup: false, isPrivate: false, cooldown: 3 };
export default async function (m, ctx) {
  const hal = (ctx.text || '').trim();
  if (!hal) return ctx.reply('Mau nilai apa? Contoh: *.rate seberapa rajin aku belajar*');
  const nilai = Math.floor(Math.random() * 101);
  const penuh = Math.round(nilai / 10);
  const bar = '▰'.repeat(penuh) + '▱'.repeat(10 - penuh);
  await ctx.reply(`📊 *Rating*\n\n"${hal}"\n\n${bar} *${nilai}%*\n\n${komentar(nilai)}`);
}
