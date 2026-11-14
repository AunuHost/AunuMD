// AunuMD • Cek shio dan elemen dari tahun lahir
export const config = { name: 'shio', alias: [], category: 'cek', description: 'Cek shio dan elemen dari tahun lahir', usage: '.shio <tahun lahir>', isOwner: false, isGroup: false, isPrivate: false, cooldown: 3 };
const SHIO = [
  { nama: '🐀 Tikus', sifat: 'Cerdas, hemat, dan cepat tanggap. Kamu pandai melihat peluang yang dilewatkan orang lain.' },
  { nama: '🐂 Kerbau', sifat: 'Tekun, sabar, dan bisa diandalkan. Kamu pekerja keras yang setia pada proses.' },
  { nama: '🐅 Macan', sifat: 'Berani, percaya diri, dan berjiwa pemimpin. Kamu tidak takut mengambil risiko.' },
  { nama: '🐇 Kelinci', sifat: 'Lembut, sopan, dan menghindari konflik. Kamu disukai karena pembawaanmu yang tenang.' },
  { nama: '🐉 Naga', sifat: 'Energik, karismatik, dan penuh ambisi. Keberuntungan sering berpihak padamu.' },
  { nama: '🐍 Ular', sifat: 'Bijaksana, intuitif, dan misterius. Kamu berpikir dalam sebelum bertindak.' },
  { nama: '🐎 Kuda', sifat: 'Bebas, aktif, dan ceria. Kamu cepat bosan pada rutinitas dan suka bergerak.' },
  { nama: '🐐 Kambing', sifat: 'Kreatif, penyayang, dan sensitif. Kamu punya jiwa seni dan empati yang tinggi.' },
  { nama: '🐒 Monyet', sifat: 'Lincah, pintar, dan humoris. Akalmu selalu menemukan jalan keluar yang unik.' },
  { nama: '🐓 Ayam', sifat: 'Teliti, rapi, dan blak-blakan. Kamu perfeksionis yang memperhatikan penampilan dan detail.' },
  { nama: '🐕 Anjing', sifat: 'Setia, jujur, dan protektif. Kamu teman yang selalu ada saat dibutuhkan.' },
  { nama: '🐖 Babi', sifat: 'Murah hati, tulus, dan mencintai kenyamanan. Kamu menikmati hal-hal baik dalam hidup.' }
];
const ELEMEN = ['Kayu', 'Kayu', 'Api', 'Api', 'Tanah', 'Tanah', 'Logam', 'Logam', 'Air', 'Air'];
export default async function (m, ctx) {
  const { reply, args } = ctx;
  const tahun = parseInt((args[0] || '').replace(/[^\d]/g, ''), 10);
  if (!tahun || isNaN(tahun) || tahun < 1900 || tahun > 2200) {
    await reply(`🐉 Pemakaian: *${ctx.prefix}shio <tahun lahir>*\nContoh: ${ctx.prefix}shio 2008`);
    return;
  }
  const idx = (((tahun - 4) % 12) + 12) % 12;
  const elemen = ELEMEN[(((tahun - 4) % 10) + 10) % 10];
  const s = SHIO[idx];
  await reply(
    `🧧 *SHIO KAMU* 🧧\n\n` +
    `${s.nama}\n` +
    `📅 Tahun lahir: ${tahun}\n` +
    `🌿 Elemen: *${elemen}*\n\n` +
    `🔮 ${s.sifat}\n\n` +
    `_Catatan: shio berganti di Tahun Baru Imlek, jadi kelahiran Januari–Februari awal bisa berbeda. Untuk hiburan saja ya!_`
  );
}
