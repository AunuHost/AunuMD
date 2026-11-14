// AunuMD • Puisi pendek original acak bertema senja, hujan, ibu, impian, dan persahabatan
const PUISI = [
  {
    judul: 'Senja di Ujung Hari',
    tema: 'Senja',
    baris: [
      'Senja turun perlahan di ufuk barat,',
      'langit memerah seperti pipi yang malu.',
      'Burung-burung pulang membawa cerita,',
      'tentang hari yang lelah namun berlalu.',
      '',
      'Aku berdiri memandang cahaya terakhir,',
      'menghitung syukur yang tak sempat terucap.',
      'Esok mentari akan terbit lagi,',
      'membawa harapan di setiap langkah.'
    ]
  },
  {
    judul: 'Hujan dan Kenangan',
    tema: 'Hujan',
    baris: [
      'Hujan turun membasahi jendela,',
      'rintiknya mengetuk seperti kabar lama.',
      'Aroma tanah basah menyapa,',
      'membawa pulang kenangan yang terlupa.',
      '',
      'Di antara gemuruh yang syahdu,',
      'aku belajar tentang merelakan.',
      'Bahwa setelah hujan yang paling deras,',
      'selalu ada pelangi yang menenangkan.'
    ]
  },
  {
    judul: 'Untukmu, Ibu',
    tema: 'Ibu',
    baris: [
      'Tanganmu kasar oleh kerja dan waktu,',
      'namun lembutnya tak pernah berkurang.',
      'Doamu adalah payung di setiap langkahku,',
      'pelukmu adalah rumah paling lapang.',
      '',
      'Tak ada kata yang cukup membalas,',
      'pengorbananmu sepanjang usia.',
      'Hanya doa yang kupanjatkan diam-diam:',
      'semoga surga menjadi balasannya.'
    ]
  },
  {
    judul: 'Mengejar Impian',
    tema: 'Impian',
    baris: [
      'Di dada ini ada api kecil menyala,',
      'tak padam meski angin kadang menguji.',
      'Impian bukan sekadar angan di kepala,',
      'ia adalah janji pada diri sendiri.',
      '',
      'Jalan panjang mungkin melelahkan,',
      'dan jatuh adalah hal yang biasa.',
      'Tapi selama langkah tak dihentikan,',
      'puncak itu makin dekat terasa.'
    ]
  },
  {
    judul: 'Sahabat Sejati',
    tema: 'Persahabatan',
    baris: [
      'Kita tertawa pada hal yang sederhana,',
      'dan menangis tanpa perlu berpura-pura.',
      'Jarak dan waktu boleh saja memisahkan,',
      'tapi cerita kita takkan pernah sirna.',
      '',
      'Sahabat adalah bintang di gelap malam,',
      'tak selalu terlihat namun selalu ada.',
      'Terima kasih telah berjalan bersamaku,',
      'di setiap musim, di segala cuaca.'
    ]
  },
  {
    judul: 'Senja di Pelabuhan',
    tema: 'Senja',
    baris: [
      'Perahu-perahu merapat ke dermaga,',
      'layarnya lunglai diterpa angin sore.',
      'Nelayan pulang dengan jala cerita,',
      'tentang laut, nasib, dan rezeki.',
      '',
      'Langit jingga perlahan memudar,',
      'digantikan bintang yang malu-malu.',
      'Hari ini selesai dengan damai,',
      'esok kita berlayar lagi, selalu.'
    ]
  }
];
export const config = { name: 'puisi', alias: [], category: 'fun', description: 'Puisi pendek original acak bertema senja, hujan, ibu, impian, persahabatan', usage: '.puisi', isOwner: false, isGroup: false, isPrivate: false, cooldown: 3 };
export default async function (m, ctx) {
  const p = PUISI[Math.floor(Math.random() * PUISI.length)];
  await ctx.reply(`📜 *${p.judul}*\n_Tema: ${p.tema}_\n\n${p.baris.join('\n')}`);
}
