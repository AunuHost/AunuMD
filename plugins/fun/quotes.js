// AunuMD • Kutipan motivasi acak dari tokoh dunia dan Indonesia
const QUOTES = [
  { teks: 'Hidup itu seperti mengendarai sepeda. Untuk menjaga keseimbangan, kamu harus terus bergerak.', oleh: 'Albert Einstein' },
  { teks: 'Satu-satunya cara melakukan pekerjaan hebat adalah mencintai apa yang kamu lakukan.', oleh: 'Steve Jobs' },
  { teks: 'Masa depan adalah milik mereka yang percaya pada keindahan mimpi-mimpi mereka.', oleh: 'Eleanor Roosevelt' },
  { teks: 'Jangan menunggu. Waktunya tidak akan pernah benar-benar tepat.', oleh: 'Napoleon Hill' },
  { teks: 'Kegagalan adalah bumbu yang memberi rasa pada kesuksesan.', oleh: 'Truman Capote' },
  { teks: 'Hidup adalah 10% apa yang terjadi padamu dan 90% bagaimana kamu meresponsnya.', oleh: 'Charles R. Swindoll' },
  { teks: 'Pendidikan adalah senjata paling ampuh yang bisa kamu gunakan untuk mengubah dunia.', oleh: 'Nelson Mandela' },
  { teks: 'Gantungkan cita-citamu setinggi langit. Bermimpilah setinggi langit. Jika engkau jatuh, engkau akan jatuh di antara bintang-bintang.', oleh: 'Soekarno' },
  { teks: 'Beri aku 10 pemuda, niscaya akan kuguncangkan dunia.', oleh: 'Soekarno' },
  { teks: 'Habis gelap terbitlah terang.', oleh: 'R.A. Kartini' },
  { teks: 'Hiduplah seolah engkau mati besok. Belajarlah seolah engkau hidup selamanya.', oleh: 'Mahatma Gandhi' },
  { teks: 'Kesuksesan bukanlah kunci kebahagiaan. Kebahagiaanlah kunci kesuksesan.', oleh: 'Albert Schweitzer' },
  { teks: 'Aku bisa menerima kegagalan, tapi aku tidak bisa menerima untuk tidak mencoba.', oleh: 'Michael Jordan' },
  { teks: 'Ilmu tanpa amal adalah kegilaan, dan amal tanpa ilmu adalah kesia-siaan.', oleh: 'Imam Al-Ghazali' },
  { teks: 'Kurang cerdas dapat diperbaiki dengan belajar, kurang cakap dapat dihilangkan dengan pengalaman, namun tidak jujur itu sulit diperbaiki.', oleh: 'Mohammad Hatta' },
  { teks: 'Terbentur, terbentur, terbentur, terbentuk.', oleh: 'Tan Malaka' },
  { teks: 'Satu-satunya batasan untuk mewujudkan hari esok kita adalah keraguan kita hari ini.', oleh: 'Franklin D. Roosevelt' },
  { teks: 'Barangsiapa ingin mutiara, harus berani terjun di lautan yang dalam.', oleh: 'Soekarno' }
];
export const config = { name: 'quotes', alias: ['quote'], category: 'fun', description: 'Kutipan motivasi acak dari tokoh dunia dan Indonesia', usage: '.quotes', isOwner: false, isGroup: false, isPrivate: false, cooldown: 3 };
export default async function (m, ctx) {
  const q = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  await ctx.reply(`💬 *Kutipan Hari Ini*\n\n"${q.teks}"\n\n— ${q.oleh}`);
}
