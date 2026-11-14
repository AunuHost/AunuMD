// AunuMD • Cek hari lahir dan sifat umum berdasarkan hari
export const config = { name: 'harilahir', alias: [], category: 'cek', description: 'Cek kamu lahir hari apa dan sifat umumnya', usage: '.harilahir <DD-MM-YYYY>', isOwner: false, isGroup: false, isPrivate: false, cooldown: 3 };
const HARI = [
  { nama: 'Minggu', sifat: 'Lahir di hari Minggu: kamu ceria, percaya diri, dan suka jadi pusat perhatian. Enerjimu menular ke orang-orang di sekitarmu.' },
  { nama: 'Senin', sifat: 'Lahir di hari Senin: kamu lembut, peka perasaan, dan penyayang. Kamu pandai membaca suasana hati orang lain.' },
  { nama: 'Selasa', sifat: 'Lahir di hari Selasa: kamu bersemangat, berani, dan penuh energi. Kamu tidak suka menunggu dan selalu ingin bergerak maju.' },
  { nama: 'Rabu', sifat: 'Lahir di hari Rabu: kamu cerdas, komunikatif, dan serba bisa. Pikiranmu cepat dan kamu mudah bergaul dengan siapa pun.' },
  { nama: 'Kamis', sifat: 'Lahir di hari Kamis: kamu optimis, berwawasan luas, dan berjiwa pemimpin. Kamu suka belajar hal baru dan berbagi ilmu.' },
  { nama: 'Jumat', sifat: 'Lahir di hari Jumat: kamu ramah, romantis, dan mencintai keindahan. Kamu pandai membuat orang lain merasa nyaman.' },
  { nama: 'Sabtu', sifat: 'Lahir di hari Sabtu: kamu tekun, bertanggung jawab, dan sabar. Kamu tipe yang menyelesaikan apa yang sudah dimulai.' }
];
export default async function (m, ctx) {
  const { reply, args } = ctx;
  const mentah = (args[0] || '').trim();
  const cocok = mentah.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
  if (!cocok) {
    await reply(`📆 Pemakaian: *${ctx.prefix}harilahir <DD-MM-YYYY>*\nContoh: ${ctx.prefix}harilahir 17-08-2008`);
    return;
  }
  const d = parseInt(cocok[1], 10);
  const mo = parseInt(cocok[2], 10);
  const y = parseInt(cocok[3], 10);
  const tanggal = new Date(Date.UTC(y, mo - 1, d));
  if (tanggal.getUTCDate() !== d || tanggal.getUTCMonth() !== mo - 1 || tanggal.getUTCFullYear() !== y) {
    await reply('❌ Tanggal tidak valid. Cek lagi hari dan bulannya ya.');
    return;
  }
  const h = HARI[tanggal.getUTCDay()];
  await reply(
    `📆 *HARI LAHIR KAMU* 📆\n\n` +
    `📅 Tanggal: ${String(d).padStart(2, '0')}-${String(mo).padStart(2, '0')}-${y}\n` +
    `🌟 Kamu lahir pada hari: *${h.nama}*\n\n` +
    `🔮 ${h.sifat}\n\n` +
    `_Sifat berdasarkan hari lahir ini hanya untuk hiburan ya!_`
  );
}
