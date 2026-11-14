// AunuMD • Cek zodiak dari tanggal lahir
export const config = { name: 'zodiak', alias: [], category: 'cek', description: 'Cek zodiak dari tanggal lahir kamu', usage: '.zodiak <DD-MM>', isOwner: false, isGroup: false, isPrivate: false, cooldown: 3 };
const ZODIAK = [
  { nama: 'Capricorn', simbol: '♑', mulai: [1, 1], akhir: [1, 19], rentang: '22 Des – 19 Jan', sifat: 'Ambisius, disiplin, dan sabar. Kamu tipe pekerja keras yang tidak mudah menyerah demi tujuan besar.' },
  { nama: 'Aquarius', simbol: '♒', mulai: [1, 20], akhir: [2, 18], rentang: '20 Jan – 18 Feb', sifat: 'Unik, visioner, dan mandiri. Kamu suka berpikir di luar kotak dan peduli pada banyak orang.' },
  { nama: 'Pisces', simbol: '♓', mulai: [2, 19], akhir: [3, 20], rentang: '19 Feb – 20 Mar', sifat: 'Peka, imajinatif, dan penuh empati. Perasaanmu dalam, tapi hati-hati jangan terlalu larut.' },
  { nama: 'Aries', simbol: '♈', mulai: [3, 21], akhir: [4, 19], rentang: '21 Mar – 19 Apr', sifat: 'Berani, energik, dan spontan. Kamu pemimpin alami yang tidak takut mengambil langkah pertama.' },
  { nama: 'Taurus', simbol: '♉', mulai: [4, 20], akhir: [5, 20], rentang: '20 Apr – 20 Mei', sifat: 'Setia, sabar, dan mencintai kenyamanan. Sekali punya tujuan, kamu susah digoyahkan.' },
  { nama: 'Gemini', simbol: '♊', mulai: [5, 21], akhir: [6, 20], rentang: '21 Mei – 20 Jun', sifat: 'Cerdas, komunikatif, dan mudah beradaptasi. Pikiranmu cepat dan rasa ingin tahumu besar.' },
  { nama: 'Cancer', simbol: '♋', mulai: [6, 21], akhir: [7, 22], rentang: '21 Jun – 22 Jul', sifat: 'Penyayang, protektif, dan intuitif. Keluarga dan orang terdekat adalah prioritas utamamu.' },
  { nama: 'Leo', simbol: '♌', mulai: [7, 23], akhir: [8, 22], rentang: '23 Jul – 22 Agu', sifat: 'Percaya diri, hangat, dan suka jadi pusat perhatian. Kamu murah hati pada orang yang kamu sayang.' },
  { nama: 'Virgo', simbol: '♍', mulai: [8, 23], akhir: [9, 22], rentang: '23 Agu – 22 Sep', sifat: 'Teliti, analitis, dan perfeksionis. Kamu memperhatikan detail yang dilewatkan orang lain.' },
  { nama: 'Libra', simbol: '♎', mulai: [9, 23], akhir: [10, 22], rentang: '23 Sep – 22 Okt', sifat: 'Harmonis, adil, dan diplomatis. Kamu selalu mencari keseimbangan dalam segala hal.' },
  { nama: 'Scorpio', simbol: '♏', mulai: [10, 23], akhir: [11, 21], rentang: '23 Okt – 21 Nov', sifat: 'Intens, misterius, dan penuh tekad. Sekali fokus, tidak ada yang bisa menghentikanmu.' },
  { nama: 'Sagitarius', simbol: '♐', mulai: [11, 22], akhir: [12, 21], rentang: '22 Nov – 21 Des', sifat: 'Optimis, petualang, dan jujur. Kamu mencintai kebebasan dan pengalaman baru.' },
  { nama: 'Capricorn', simbol: '♑', mulai: [12, 22], akhir: [12, 31], rentang: '22 Des – 19 Jan', sifat: 'Ambisius, disiplin, dan sabar. Kamu tipe pekerja keras yang tidak mudah menyerah demi tujuan besar.' }
];
export default async function (m, ctx) {
  const { reply, args } = ctx;
  const mentah = (args[0] || '').trim();
  const cocok = mentah.match(/^(\d{1,2})-(\d{1,2})(?:-(\d{2,4}))?$/);
  if (!cocok) {
    await reply(`♈ Pemakaian: *${ctx.prefix}zodiak <DD-MM>* atau *<DD-MM-YYYY>*\nContoh: ${ctx.prefix}zodiak 17-08 atau ${ctx.prefix}zodiak 17-08-2008`);
    return;
  }
  const tgl = parseInt(cocok[1], 10);
  const bln = parseInt(cocok[2], 10);
  if (bln < 1 || bln > 12 || tgl < 1 || tgl > 31) {
    await reply('❌ Tanggal tidak valid. Pastikan formatnya DD-MM, contoh: 17-08.');
    return;
  }
  const z = ZODIAK.find((item) => {
    const [mb, db] = item.mulai;
    const [me, de] = item.akhir;
    return (bln === mb && tgl >= db) || (bln === me && tgl <= de && mb !== me) || (mb === me && bln === mb && tgl >= db && tgl <= de);
  }) || ZODIAK.find((item) => bln === item.mulai[0] && tgl >= item.mulai[1]) || ZODIAK[0];
  await reply(
    `✨ *ZODIAK KAMU* ✨\n\n` +
    `${z.simbol} *${z.nama}*\n` +
    `📅 Rentang: ${z.rentang}\n` +
    `🎂 Tanggal lahir: ${String(tgl).padStart(2, '0')}-${String(bln).padStart(2, '0')}${cocok[3] ? '-' + cocok[3] : ''}\n\n` +
    `🔮 ${z.sifat}\n\n` +
    `_Ramalan zodiak hanya untuk hiburan ya!_`
  );
}
