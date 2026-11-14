// AunuMD • hadits pendek pilihan (lokal).
export const config = {
  name: 'hadits',
  alias: ['hadist'],
  category: 'islamic',
  description: 'Hadits pendek pilihan acak',
  usage: '.hadits',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 3
};

const HADITS = [
  { teks: 'Sesungguhnya amal itu tergantung niatnya, dan sesungguhnya setiap orang akan mendapatkan apa yang ia niatkan.', sumber: 'HR. Bukhari & Muslim' },
  { teks: 'Sebaik-baik kalian adalah yang mempelajari Al-Qur\'an dan mengajarkannya.', sumber: 'HR. Bukhari' },
  { teks: 'Tidak beriman salah seorang di antara kalian hingga ia mencintai saudaranya sebagaimana ia mencintai dirinya sendiri.', sumber: 'HR. Bukhari & Muslim' },
  { teks: 'Kebersihan itu sebagian dari iman, dan Alhamdulillah memenuhi timbangan.', sumber: 'HR. Muslim' },
  { teks: 'Barangsiapa yang beriman kepada Allah dan hari akhir, maka hendaklah ia berkata baik atau diam.', sumber: 'HR. Bukhari & Muslim' },
  { teks: 'Senyummu di hadapan saudaramu adalah sedekah.', sumber: 'HR. Tirmidzi' },
  { teks: 'Orang muslim adalah orang yang muslim lainnya selamat dari gangguan lisan dan tangannya.', sumber: 'HR. Bukhari & Muslim' },
  { teks: 'Allah Maha Pengasih dan menyayangi orang-orang yang pengasih. Sayangilah yang di bumi, niscaya yang di langit menyayangimu.', sumber: 'HR. Abu Dawud & Tirmidzi' },
  { teks: 'Jauhilah hasad (dengki), karena hasad memakan kebaikan sebagaimana api memakan kayu bakar.', sumber: 'HR. Abu Dawud' },
  { teks: 'Sesungguhnya Allah itu baik dan tidak menerima kecuali yang baik.', sumber: 'HR. Muslim' },
  { teks: 'Manfaatkanlah lima perkara sebelum lima perkara: mudamu sebelum tuamu, sehatmu sebelum sakitmu, kayamu sebelum miskinmu, luangmu sebelum sibukmu, dan hidupmu sebelum matimu.', sumber: 'HR. Hakim' },
  { teks: 'Barangsiapa menempuh jalan untuk mencari ilmu, maka Allah akan memudahkan baginya jalan menuju surga.', sumber: 'HR. Muslim' },
  { teks: 'Dua nikmat yang banyak manusia tertipu di dalamnya: kesehatan dan waktu luang.', sumber: 'HR. Bukhari' },
  { teks: 'Yang paling dicintai Allah adalah amal yang paling konsisten, meskipun sedikit.', sumber: 'HR. Bukhari & Muslim' },
  { teks: 'Bertakwalah kepada Allah di mana pun kamu berada, iringilah keburukan dengan kebaikan yang akan menghapusnya, dan pergaulilah manusia dengan akhlak yang baik.', sumber: 'HR. Tirmidzi' },
  { teks: 'Tidaklah seorang muslim tertimpa kelelahan, penyakit, kesedihan, atau gangguan, melainkan Allah akan menghapus sebagian dosa-dosanya karenanya.', sumber: 'HR. Bukhari & Muslim' },
  { teks: 'Ridha Allah terletak pada ridha orang tua, dan murka Allah terletak pada murka orang tua.', sumber: 'HR. Tirmidzi' }
];

export default async function (m, ctx) {
  const h = HADITS[Math.floor(Math.random() * HADITS.length)];
  await ctx.reply(
    `📜 *Hadits Pilihan*\n\n` +
    `"${h.teks}"\n\n` +
    `— ${h.sumber}`
  );
}
