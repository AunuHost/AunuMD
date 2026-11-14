// AunuMD • Tafsir mimpi sederhana dari kamus kata kunci populer
export const config = { name: 'artimimpi', alias: ['mimpi'], category: 'cek', description: 'Tafsir mimpi berdasarkan kata kunci', usage: '.artimimpi <cerita mimpi>', isOwner: false, isGroup: false, isPrivate: false, cooldown: 3 };
const KAMUS = {
  'gigi copot': 'Konon melambangkan kekhawatiran akan kehilangan — bisa orang terdekat, kesempatan, atau rasa percaya diri. Jaga kesehatan dan hubungan baik-baik ya.',
  'ular besar': 'Ular besar dalam mimpi sering dikaitkan dengan musuh dalam selimut atau godaan besar. Waspada boleh, panik jangan.',
  'ular': 'Mimpi ular sering ditafsirkan sebagai pertanda ada orang yang iri atau masalah yang sedang mengintai. Ada juga yang mengartikannya sebagai rezeki tak terduga.',
  'gigi': 'Mimpi soal gigi berkaitan dengan rasa percaya diri dan penampilan. Mungkin kamu sedang mengkhawatirkan penilaian orang lain.',
  'terbang': 'Mimpi terbang adalah pertanda kebebasan dan ambisi yang sedang tinggi-tingginya. Kamu sedang ingin lepas dari beban dan terbang mengejar cita-cita.',
  'air': 'Air melambangkan emosi dan ketenangan. Air jernih pertanda hati yang damai, air keruh bisa berarti perasaan yang sedang campur aduk.',
  'api': 'Api dalam mimpi melambangkan semangat, amarah, atau perubahan besar yang membara. Ada energi besar yang perlu disalurkan dengan bijak.',
  'menikah': 'Mimpi menikah sering berarti komitmen baru atau babak hidup yang baru akan dimulai — tidak selalu soal pasangan, bisa soal pekerjaan atau keputusan besar.',
  'meninggal': 'Tenang, mimpi meninggal jarang berarti harfiah. Konon ini pertanda umur panjang dan akhir dari satu fase hidup untuk memulai yang baru.',
  'uang': 'Mimpi uang berkaitan dengan kepercayaan diri dan peluang. Uang kertas pertanda rezeki, uang receh bisa berarti hal kecil yang perlu diperhatikan.',
  'bayi': 'Bayi melambangkan awal yang baru, kepolosan, dan harapan. Mungkin ada proyek atau ide baru yang sedang "lahir" dalam hidupmu.',
  'hujan': 'Hujan dalam mimpi adalah simbol berkah dan pelepas penat. Konon pertanda rezeki dan kesedihan yang perlahan luruh.',
  'laut': 'Laut melambangkan luasnya perasaan dan kehidupan. Laut tenang berarti kedamaian, ombak besar berarti tantangan emosional yang sedang datang.',
  'gunung': 'Gunung adalah simbol ambisi dan rintangan besar. Mendaki gunung dalam mimpi berarti kamu sedang berjuang menuju puncak tujuanmu.',
  'rumah': 'Rumah melambangkan dirimu sendiri dan rasa aman. Kondisi rumah dalam mimpi mencerminkan kondisi hatimu saat ini.',
  'hantu': 'Mimpi hantu sering berasal dari rasa takut atau urusan masa lalu yang belum selesai. Ada hal yang perlu kamu hadapi, bukan hindari.',
  'emas': 'Emas adalah simbol kemakmuran dan harga diri. Mimpi emas konon pertanda penghargaan atau peluang berharga akan datang.',
  'jatuh': 'Mimpi jatuh biasanya muncul saat kamu merasa kehilangan kendali atau cemas akan kegagalan. Tarik napas, tidak semua yang jatuh itu berakhir buruk.',
  'berlari': 'Berlari dalam mimpi bisa berarti kamu sedang mengejar sesuatu — atau justru lari dari sesuatu. Coba ingat, kamu lari menuju atau menjauhi apa?',
  'menangis': 'Menangis dalam mimpi justru sering ditafsirkan sebagai pelepasan beban dan pertanda kabar baik setelah masa sulit.',
  'sekolah': 'Mimpi sekolah menandakan pelajaran hidup yang sedang kamu jalani, atau kerinduan pada masa yang lebih sederhana.',
  'darah': 'Darah dalam mimpi melambangkan energi kehidupan dan ikatan keluarga. Bisa juga pertanda kamu perlu lebih menjaga kesehatan.',
  'kecelakaan': 'Mimpi kecelakaan adalah peringatan bawah sadar untuk lebih berhati-hati — dalam berkendara maupun mengambil keputusan.',
  'hamil': 'Mimpi hamil melambangkan sesuatu yang sedang "tumbuh": ide, rencana, atau potensi baru yang perlu waktu untuk lahir.',
  'kucing': 'Kucing melambangkan kemandirian dan intuisi. Kucing yang ramah pertanda baik, kucing yang galak bisa berarti ada yang tidak tulus di sekitarmu.',
  'anjing': 'Anjing adalah simbol kesetiaan dan persahabatan. Mimpi anjing biasanya berkaitan dengan teman setia atau perlindungan.',
  'mobil': 'Mobil melambangkan arah perjalanan hidupmu. Siapa yang menyetir dalam mimpi itu menunjukkan siapa yang mengendalikan hidupmu.',
  'bintang': 'Bintang adalah simbol harapan dan cita-cita tinggi. Mimpi bintang pertanda tujuanmu semakin terlihat jelas.',
  'pohon': 'Pohon melambangkan pertumbuhan dan akar keluarga. Pohon rindang berarti hidup yang stabil dan terus bertumbuh.',
  'sungai': 'Sungai melambangkan perjalanan hidup yang mengalir. Sungai jernih pertanda jalan yang lancar, sungai deras berarti fase hidup yang cepat berubah.'
};
export default async function (m, ctx) {
  const { reply, text } = ctx;
  const cerita = (text || '').toLowerCase().trim();
  if (!cerita) {
    await reply(`🌙 Pemakaian: *${ctx.prefix}artimimpi <cerita mimpimu>*\nContoh: ${ctx.prefix}artimimpi semalam aku mimpi dikejar ular besar`);
    return;
  }
  const kunciUrut = Object.keys(KAMUS).sort((a, b) => b.length - a.length);
  const ketemu = kunciUrut.find((k) => cerita.includes(k));
  if (!ketemu) {
    const populer = ['ular', 'gigi copot', 'terbang', 'menikah', 'uang', 'hantu', 'emas', 'hujan', 'bayi', 'jatuh'];
    await reply(
      `🌙 Maaf, kata kunci mimpimu belum ada di kamus tafsir.\n\n` +
      `Coba ceritakan mimpi yang mengandung kata kunci populer ini:\n${populer.map((k) => `• ${k}`).join('\n')}\n\n` +
      `Contoh: ${ctx.prefix}artimimpi aku mimpi terbang di atas laut`
    );
    return;
  }
  await reply(
    `🌙 *TAFSIR MIMPI* 🌙\n\n` +
    `🔑 Kata kunci: *${ketemu}*\n\n` +
    `🔮 ${KAMUS[ketemu]}\n\n` +
    `_Tafsir mimpi ini berdasarkan kepercayaan populer, murni untuk hiburan ya!_`
  );
}
