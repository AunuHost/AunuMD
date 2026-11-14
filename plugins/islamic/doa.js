// AunuMD • kumpulan doa harian (lokal, 18 doa).
export const config = {
  name: 'doa',
  alias: [],
  category: 'islamic',
  description: 'Doa harian acak, atau cari berdasarkan kata kunci',
  usage: '.doa [kata kunci]',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 3
};

const DOA = [
  { judul: 'Sebelum Makan', arab: 'بِسْمِ اللَّهِ وَعَلَى بَرَكَةِ اللَّهِ', latin: 'Bismillaahi wa \'alaa barakatillaah', arti: 'Dengan nama Allah dan atas keberkahan Allah.' },
  { judul: 'Sesudah Makan', arab: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ', latin: 'Alhamdulillaahil ladzii ath-amanaa wa saqaanaa wa ja\'alanaa muslimiin', arti: 'Segala puji bagi Allah yang telah memberi kami makan dan minum serta menjadikan kami orang-orang muslim.' },
  { judul: 'Sebelum Tidur', arab: 'بِاسْمِكَ اللَّهُمَّ أَحْيَا وَبِاسْمِكَ أَمُوتُ', latin: 'Bismika allaahumma ahyaa wa bismika amuut', arti: 'Dengan nama-Mu ya Allah aku hidup, dan dengan nama-Mu aku mati.' },
  { judul: 'Bangun Tidur', arab: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ', latin: 'Alhamdulillaahil ladzii ahyaanaa ba\'da maa amaatanaa wa ilaihin nusyuur', arti: 'Segala puji bagi Allah yang telah menghidupkan kami setelah mematikan kami, dan kepada-Nya kami dibangkitkan.' },
  { judul: 'Masuk Rumah', arab: 'بِسْمِ اللَّهِ وَلَجْنَا وَبِسْمِ اللَّهِ خَرَجْنَا وَعَلَى رَبِّنَا تَوَكَّلْنَا', latin: 'Bismillaahi walajnaa wa bismillaahi kharajnaa wa \'alaa rabbinaa tawakkalnaa', arti: 'Dengan nama Allah kami masuk, dengan nama Allah kami keluar, dan kepada Tuhan kami, kami bertawakal.' },
  { judul: 'Keluar Rumah', arab: 'بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ', latin: 'Bismillaahi tawakkaltu \'alallaah, laa haula wa laa quwwata illaa billaah', arti: 'Dengan nama Allah, aku bertawakal kepada Allah. Tiada daya dan kekuatan kecuali dengan pertolongan Allah.' },
  { judul: 'Naik Kendaraan', arab: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ', latin: 'Subhaanal ladzii sakhkhara lanaa haadzaa wa maa kunnaa lahuu muqriniin, wa innaa ilaa rabbinaa lamunqalibuun', arti: 'Mahasuci Allah yang telah menundukkan kendaraan ini untuk kami, padahal sebelumnya kami tidak mampu menguasainya, dan sesungguhnya kami akan kembali kepada Tuhan kami.' },
  { judul: 'Belajar / Menuntut Ilmu', arab: 'رَّبِّ زِدْنِي عِلْمًا', latin: 'Rabbi zidnii \'ilmaa', arti: 'Ya Tuhanku, tambahkanlah ilmu kepadaku. (QS. Thaha: 114)' },
  { judul: 'Untuk Kedua Orang Tua', arab: 'رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا', latin: 'Rabbir hamhumaa kamaa rabbayaanii shaghiiraa', arti: 'Ya Tuhanku, sayangilah kedua orang tuaku sebagaimana mereka telah mendidikku sejak kecil. (QS. Al-Isra: 24)' },
  { judul: 'Masuk Masjid', arab: 'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ', latin: 'Allaahummaf-tah lii abwaaba rahmatik', arti: 'Ya Allah, bukakanlah untukku pintu-pintu rahmat-Mu.' },
  { judul: 'Keluar Masjid', arab: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ', latin: 'Allaahumma innii as-aluka min fadhlika', arti: 'Ya Allah, sesungguhnya aku memohon karunia dari-Mu.' },
  { judul: 'Bercermin', arab: 'اللَّهُمَّ كَمَا حَسَّنْتَ خَلْقِي فَحَسِّنْ خُلُقِي', latin: 'Allaahumma kamaa hassanta khalqii fahassin khuluqii', arti: 'Ya Allah, sebagaimana Engkau telah memperindah rupaku, maka perindahlah pula akhlakku.' },
  { judul: 'Berpakaian', arab: 'الْحَمْدُ لِلَّهِ الَّذِي كَسَانِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ', latin: 'Alhamdulillaahil ladzii kasaanii haadzaa wa razaqaniihi min ghairi haulin minnii wa laa quwwah', arti: 'Segala puji bagi Allah yang telah memberiku pakaian ini dan mengaruniakannya kepadaku tanpa daya dan kekuatan dariku.' },
  { judul: 'Sebelum Ujian', arab: 'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي وَاحْلُلْ عُقْدَةً مِنْ لِسَانِي يَفْقَهُوا قَوْلِي', latin: 'Rabbisy-rahlii shadrii wa yassirlii amrii wahlul \'uqdatam mil lisaanii yafqahuu qaulii', arti: 'Ya Tuhanku, lapangkanlah dadaku, mudahkanlah urusanku, dan lepaskanlah kekakuan lidahku agar mereka memahami perkataanku. (QS. Thaha: 25-28)' },
  { judul: 'Saat Turun Hujan', arab: 'اللَّهُمَّ صَيِّبًا نَافِعًا', latin: 'Allaahumma shayyiban naafi\'aa', arti: 'Ya Allah, jadikanlah hujan ini hujan yang bermanfaat.' },
  { judul: 'Saat Sakit', arab: 'اللَّهُمَّ رَبَّ النَّاسِ أَذْهِبِ الْبَأْسَ اشْفِ أَنْتَ الشَّافِي لَا شِفَاءَ إِلَّا شِفَاؤُكَ', latin: 'Allaahumma rabban naasi adzhibil ba\'sa, isyfi antasy syaafii, laa syifaa-a illaa syifaa-uka', arti: 'Ya Allah, Tuhan seluruh manusia, hilangkanlah penyakit ini. Sembuhkanlah, Engkaulah Maha Penyembuh; tiada kesembuhan kecuali kesembuhan dari-Mu.' },
  { judul: 'Masuk WC / Kamar Mandi', arab: 'بِسْمِ اللَّهِ اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ', latin: 'Bismillaah, allaahumma innii a\'uudzu bika minal khubutsi wal khabaa-its', arti: 'Dengan nama Allah. Ya Allah, aku berlindung kepada-Mu dari godaan setan laki-laki dan perempuan.' },
  { judul: 'Keluar WC / Kamar Mandi', arab: 'غُفْرَانَكَ', latin: 'Ghufraanaka', arti: 'Aku memohon ampunan-Mu (ya Allah).' }
];

export default async function (m, ctx) {
  const kata = (ctx.text || '').trim().toLowerCase();
  let daftar = DOA;
  if (kata) {
    daftar = DOA.filter((d) => d.judul.toLowerCase().includes(kata));
    if (!daftar.length) {
      await ctx.reply(`❌ Tidak ada doa dengan kata "${ctx.text}".\nKategori tersedia: ${DOA.map((d) => d.judul).join(', ')}`);
      return;
    }
  }
  const d = daftar[Math.floor(Math.random() * daftar.length)];
  await ctx.reply(
    `🤲 *Doa ${d.judul}*\n\n` +
    `${d.arab}\n\n` +
    `_${d.latin}_\n\n` +
    `Artinya: "${d.arti}"`
  );
}
