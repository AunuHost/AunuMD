// AunuMD • ayat Al-Qur'an pilihan hari ini (lokal, deterministik per tanggal).
export const config = {
  name: 'ayathariini',
  alias: ['ayat'],
  category: 'islamic',
  description: 'Ayat Al-Qur\'an pilihan untuk hari ini',
  usage: '.ayathariini',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 3
};

const AYAT = [
  { ref: 'QS. Al-Baqarah: 286', tema: 'Kekuatan menghadapi ujian', teks: 'Allah tidak membebani seseorang melainkan sesuai dengan kesanggupannya.' },
  { ref: 'QS. Asy-Syarh: 5-6', tema: 'Optimisme', teks: 'Karena sesungguhnya sesudah kesulitan itu ada kemudahan. Sesungguhnya sesudah kesulitan itu ada kemudahan.' },
  { ref: 'QS. Al-Baqarah: 152', tema: 'Syukur dan zikir', teks: 'Karena itu, ingatlah kamu kepada-Ku niscaya Aku ingat (pula) kepadamu, dan bersyukurlah kepada-Ku, dan janganlah kamu mengingkari (nikmat)-Ku.' },
  { ref: 'QS. Ar-Ra\'d: 28', tema: 'Ketenangan hati', teks: '(Yaitu) orang-orang yang beriman dan hati mereka menjadi tenteram dengan mengingat Allah. Ingatlah, hanya dengan mengingat Allah-lah hati menjadi tenteram.' },
  { ref: 'QS. Al-Baqarah: 153', tema: 'Sabar dan shalat', teks: 'Hai orang-orang yang beriman, jadikanlah sabar dan shalat sebagai penolongmu, sesungguhnya Allah beserta orang-orang yang sabar.' },
  { ref: 'QS. At-Talaq: 3', tema: 'Tawakal', teks: 'Dan barangsiapa yang bertawakal kepada Allah niscaya Allah akan mencukupkan (keperluan)nya.' },
  { ref: 'QS. Al-Ankabut: 69', tema: 'Kesungguhan', teks: 'Dan orang-orang yang berjihad untuk (mencari keridhaan) Kami, benar-benar akan Kami tunjukkan kepada mereka jalan-jalan Kami. Dan sesungguhnya Allah benar-benar beserta orang-orang yang berbuat baik.' },
  { ref: 'QS. An-Nahl: 97', tema: 'Amal saleh', teks: 'Barangsiapa yang mengerjakan amal saleh, baik laki-laki maupun perempuan dalam keadaan beriman, maka sesungguhnya akan Kami berikan kepadanya kehidupan yang baik.' },
  { ref: 'QS. Al-Hujurat: 13', tema: 'Kemuliaan takwa', teks: 'Sesungguhnya orang yang paling mulia di antara kamu di sisi Allah ialah orang yang paling takwa di antara kamu.' },
  { ref: 'QS. Al-Baqarah: 216', tema: 'Hikmah di balik ketidaksukaan', teks: 'Boleh jadi kamu membenci sesuatu, padahal ia amat baik bagimu, dan boleh jadi (pula) kamu menyukai sesuatu, padahal ia amat buruk bagimu; Allah mengetahui, sedang kamu tidak mengetahui.' },
  { ref: 'QS. Ibrahim: 7', tema: 'Janji syukur', teks: 'Sesungguhnya jika kamu bersyukur, pasti Kami akan menambah (nikmat) kepadamu, dan jika kamu mengingkari (nikmat-Ku), maka sesungguhnya azab-Ku sangat pedih.' },
  { ref: 'QS. Az-Zumar: 53', tema: 'Harapan ampunan', teks: 'Katakanlah: "Hai hamba-hamba-Ku yang malampaui batas terhadap diri mereka sendiri, janganlah kamu berputus asa dari rahmat Allah. Sesungguhnya Allah mengampuni dosa-dosa semuanya."' },
  { ref: 'QS. Al-Isra: 23', tema: 'Berbakti kepada orang tua', teks: 'Dan Tuhanmu telah memerintahkan supaya kamu jangan menyembah selain Dia dan hendaklah kamu berbuat baik pada ibu bapakmu dengan sebaik-baiknya.' },
  { ref: 'QS. Al-Kahf: 10', tema: 'Doa pemuda beriman', teks: 'Wahai Tuhan kami, berikanlah rahmat kepada kami dari sisi-Mu dan sempurnakanlah bagi kami petunjuk yang lurus dalam urusan kami (ini).' }
];

export default async function (m, ctx) {
  const now = new Date();
  const kunci = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
  let hash = 0;
  for (let i = 0; i < kunci.length; i++) hash = (hash * 31 + kunci.charCodeAt(i)) >>> 0;
  const a = AYAT[hash % AYAT.length];
  await ctx.reply(
    `🌅 *Ayat Hari Ini*\n\n` +
    `📖 ${a.ref}\n` +
    `🏷️ Tema: ${a.tema}\n\n` +
    `"${a.teks}"\n\n` +
    `_Ayat yang sama untuk semua orang hari ini; berganti besok._`
  );
}
