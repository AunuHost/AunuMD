// AunuMD • Kata-kata bijak acak untuk direnungkan
const BIJAK = [
  { teks: 'Jangan menjelaskan dirimu kepada siapa pun. Yang menyukaimu tidak membutuhkan itu, dan yang membencimu tidak akan mempercayainya.', oleh: 'Ali bin Abi Thalib' },
  { teks: 'Ilmu adalah cahaya, dan cahaya tidak akan datang pada hati yang gelap oleh kesombongan.', oleh: 'Imam Syafii' },
  { teks: 'Kesabaran adalah kunci yang membuka pintu yang paling berat sekalipun.', oleh: null },
  { teks: 'Jangan hitung hari-harimu. Buatlah hari-harimu berarti.', oleh: 'Muhammad Ali' },
  { teks: 'Orang bijak belajar dari kesalahan orang lain. Orang biasa belajar dari kesalahannya sendiri.', oleh: null },
  { teks: 'Semakin banyak yang kamu tahu, semakin kamu sadar betapa sedikitnya yang kamu tahu.', oleh: 'Aristoteles' },
  { teks: 'Kebahagiaan bukanlah memiliki semua yang kita inginkan, melainkan mensyukuri semua yang kita miliki.', oleh: null },
  { teks: 'Jangan takut berjalan lambat. Takutlah jika hanya berdiri diam.', oleh: 'Pepatah Tiongkok' },
  { teks: 'Mulutmu adalah harimaumu. Jaga perkataanmu, karena luka dari kata lebih lama sembuhnya daripada luka dari pedang.', oleh: null },
  { teks: 'Sebaik-baik manusia adalah yang paling bermanfaat bagi manusia lainnya.', oleh: 'Nabi Muhammad SAW' },
  { teks: 'Hiduplah seperti pohon yang lebat buahnya: hidup di tepi jalan dan dilempari orang dengan batu, tetapi dibalas dengan buah.', oleh: 'Abdul Muis' },
  { teks: 'Tidak ada yang abadi di dunia ini kecuali perubahan itu sendiri.', oleh: 'Heraclitus' },
  { teks: 'Syukuri apa yang ada, maka hidup akan terasa cukup. Mengejar yang tiada hanya akan membuatmu lelah.', oleh: null },
  { teks: 'Ketenangan adalah kekuatan. Orang yang tenang tidak mudah digoyahkan oleh keadaan.', oleh: null }
];
export const config = { name: 'katabijak', alias: ['bijak'], category: 'fun', description: 'Kata-kata bijak acak untuk direnungkan', usage: '.katabijak', isOwner: false, isGroup: false, isPrivate: false, cooldown: 3 };
export default async function (m, ctx) {
  const b = BIJAK[Math.floor(Math.random() * BIJAK.length)];
  await ctx.reply(`🌿 *Kata Bijak*\n\n"${b.teks}"${b.oleh ? `\n\n— ${b.oleh}` : ''}`);
}
