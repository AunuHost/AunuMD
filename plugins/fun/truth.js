// AunuMD • Pertanyaan truth acak (sopan, aman)
export const config = { name: 'truth', alias: [], category: 'fun', description: 'Pertanyaan truth acak untuk dijawab jujur', usage: '.truth', isOwner: false, isGroup: false, isPrivate: false, cooldown: 3 };

const TRUTH = [
  'Apa makanan yang paling tidak kamu sukai, dan kenapa?',
  'Kapan terakhir kali kamu menangis, dan karena apa?',
  'Apa kebiasaan kecilmu yang paling aneh?',
  'Siapa guru yang paling berkesan buatmu? Kenapa?',
  'Apa lagu yang paling sering kamu putar akhir-akhir ini?',
  'Kalau bisa mengulang satu hari, hari apa yang kamu pilih?',
  'Apa hal terakhir yang kamu cari di internet?',
  'Siapa teman yang paling kamu percaya untuk curhat?',
  'Apa momen paling memalukan yang pernah kamu alami di sekolah?',
  'Makanan apa yang bisa kamu makan setiap hari tanpa bosan?',
  'Apa cita-citamu waktu kecil dulu?',
  'Kapan terakhir kali kamu begadang, dan sedang apa?',
  'Apa aplikasi yang paling banyak menghabiskan waktumu?',
  'Kalau dapat uang Rp100 ribu sekarang, mau dipakai untuk apa?',
  'Apa ketakutan kecilmu yang terdengar sepele bagi orang lain?',
  'Siapa anggota keluarga yang paling dekat denganmu?',
  'Apa pelajaran sekolah yang paling kamu sukai dan paling kamu hindari?',
  'Apa hal baik terakhir yang dilakukan orang lain untukmu?',
  'Pernahkah kamu pura-pura sakit supaya tidak masuk sekolah? Ceritakan!',
  'Apa satu hal yang ingin kamu ubah dari dirimu sendiri?',
  'Siapa orang pertama yang kamu hubungi saat dapat kabar baik?',
  'Apa kenangan masa kecil yang paling kamu ingat sampai sekarang?'
];

export default async function (m, ctx) {
  const t = TRUTH[Math.floor(Math.random() * TRUTH.length)];
  return ctx.reply(`🤫 Jujur ya…\n\n❓ *${t}*`);
}
