// AunuMD • Fakta unik acak seputar sains, alam, dan sejarah
const FAKTA = [
  'Madu tidak pernah basi. Madu berusia sekitar 3.000 tahun ditemukan di makam Mesir kuno dan masih layak dimakan.',
  'Gurita memiliki tiga jantung dan darah berwarna biru.',
  'Secara botani, pisang termasuk buah beri, sedangkan stroberi justru bukan.',
  'Satu hari di Venus lebih lama daripada satu tahun di Venus, karena rotasinya lebih lambat daripada revolusinya mengelilingi Matahari.',
  'Petir suhunya bisa mencapai sekitar 30.000 Kelvin, kira-kira lima kali lebih panas dari permukaan Matahari.',
  'Semut tidak memiliki paru-paru. Mereka bernapas melalui lubang kecil bernama spirakel di tubuhnya.',
  'Mata burung unta lebih besar daripada otaknya.',
  'Gunung Everest bertambah tinggi sekitar 4 milimeter setiap tahun akibat pergerakan lempeng Bumi.',
  'Tubuh manusia dewasa terdiri dari sekitar 60% air.',
  'Bintang neutron sangat padat: satu sendok teh materinya bisa berbobot miliaran ton.',
  'Koala memiliki sidik jari yang sangat mirip dengan sidik jari manusia.',
  'Biji kakao pernah dipakai sebagai alat tukar alias mata uang oleh peradaban Aztek.',
  'Menara Eiffel bisa menjadi sekitar 15 sentimeter lebih tinggi pada musim panas karena besi memuai oleh panas.',
  'Siput darat bisa tidur hingga tiga tahun saat kondisi lingkungan sangat kering.',
  'Lidah jerapah panjangnya sekitar 50 sentimeter dan berwarna keunguan untuk melindunginya dari sengatan matahari.',
  'Bulan menjauhi Bumi sekitar 3,8 sentimeter setiap tahun.',
  'Auman singa bisa terdengar hingga jarak sekitar 8 kilometer.',
  'Lebah madu mampu mengenali dan mengingat wajah manusia.',
  'Kuku jari tangan tumbuh sekitar empat kali lebih cepat daripada kuku jari kaki.',
  'Jumlah kemungkinan permainan catur lebih besar daripada jumlah atom di alam semesta yang teramati.',
  'Air panas kadang bisa membeku lebih cepat daripada air dingin. Fenomena ini dikenal sebagai efek Mpemba.',
  'Jantung paus biru berukuran sebesar mobil kecil dan detaknya bisa terdengar dari jarak beberapa kilometer.',
  'Kelelawar adalah satu-satunya mamalia yang benar-benar bisa terbang.',
  'Cahaya Matahari membutuhkan waktu sekitar 8 menit 20 detik untuk mencapai Bumi.'
];
export const config = { name: 'faktaunik', alias: ['fakta'], category: 'fun', description: 'Fakta unik acak seputar sains, alam, dan sejarah', usage: '.faktaunik', isOwner: false, isGroup: false, isPrivate: false, cooldown: 3 };
export default async function (m, ctx) {
  const teks = FAKTA[Math.floor(Math.random() * FAKTA.length)];
  await ctx.reply(`🧠 *Tahukah Kamu?*\n\n${teks}`);
}
