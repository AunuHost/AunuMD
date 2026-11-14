// AunuMD • Menebak sifat dominan seseorang dari hash namanya (deterministik)
const SIFAT = [
  { nama: 'Pemimpin', desc: 'Kamu punya jiwa kepemimpinan alami; orang lain cenderung mengikutimu tanpa diminta.' },
  { nama: 'Petualang', desc: 'Kamu mudah bosan dengan rutinitas dan selalu haus pengalaman baru yang menantang.' },
  { nama: 'Pendiam', desc: 'Kamu lebih banyak mengamati daripada bicara, tapi sekali bicara isinya berbobot.' },
  { nama: 'Periang', desc: 'Energi positifmu menular; kehadiranmu membuat suasana yang muram jadi cerah.' },
  { nama: 'Pekerja Keras', desc: 'Kamu tidak percaya keberuntungan buta; semua hasil menurutmu lahir dari usaha.' },
  { nama: 'Santai', desc: 'Kamu menjalani hidup dengan tenang dan jarang panik, bahkan saat keadaan genting.' },
  { nama: 'Kreatif', desc: 'Kepalamu penuh ide liar yang sering membuat orang lain berkata: kok bisa kepikiran?' },
  { nama: 'Analitis', desc: 'Kamu selalu berpikir logis dan berbasis data sebelum mengambil keputusan apa pun.' },
  { nama: 'Setia', desc: 'Sekali kamu berkomitmen pada seseorang atau sesuatu, kamu akan bertahan sampai akhir.' },
  { nama: 'Berani', desc: 'Kamu berani mengambil risiko dan tidak gentar menghadapi hal yang ditakuti orang lain.' },
  { nama: 'Bijaksana', desc: 'Kamu berpikir jauh ke depan dan sering jadi tempat orang meminta nasihat.' },
  { nama: 'Humoris', desc: 'Bagimu hidup terlalu singkat untuk diseriusi terus; tawa adalah senjatamu.' }
];
function hashStr(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}
export const config = { name: 'sifat', alias: [], category: 'fun', description: 'Tebak sifat dominan dari nama (deterministik)', usage: '.sifat [nama]', isOwner: false, isGroup: false, isPrivate: false, cooldown: 3 };
export default async function (m, ctx) {
  const nama = (ctx.text || '').trim() || m.pushName || 'Kamu';
  const s = SIFAT[hashStr(nama.toLowerCase()) % SIFAT.length];
  await ctx.reply(`🔮 *Cek Sifat*\n\nNama: *${nama}*\nSifat dominan: *${s.nama}*\n\n${s.desc}`);
}
