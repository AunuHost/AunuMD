// AunuMD • kisah singkat 25 nabi (lokal).
export const config = {
  name: 'kisahnabi',
  alias: ['nabi'],
  category: 'islamic',
  description: 'Kisah singkat 25 nabi (acak atau cari nama)',
  usage: '.kisahnabi [nama nabi]',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 3
};

const NABI = [
  { nama: 'Adam AS', kisah: 'Manusia pertama yang diciptakan Allah dan nabi pertama. Setelah tergelincir memakan buah larangan di surga, beliau bertaubat dengan sungguh-sungguh dan Allah menerima taubatnya.' },
  { nama: 'Idris AS', kisah: 'Nabi yang dikenal pandai, disebut sebagai orang pertama yang menulis dengan pena dan menjahit pakaian. Allah mengangkatnya ke tempat yang tinggi.' },
  { nama: 'Nuh AS', kisah: 'Berdakwah selama 950 tahun dengan hanya sedikit pengikut. Atas perintah Allah beliau membuat bahtera besar yang menyelamatkan orang beriman dari banjir dahsyat.' },
  { nama: 'Hud AS', kisah: 'Diutus kepada kaum \'Ad yang sombong dengan kekuatan fisiknya. Kaumnya yang menolak dakwah dibinasakan oleh angin topan yang sangat dingin selama tujuh malam delapan hari.' },
  { nama: 'Shalih AS', kisah: 'Diutus kepada kaum Tsamud. Mukjizatnya adalah seekor unta betina yang keluar dari batu besar, namun kaumnya yang ingkar justru membunuh unta itu.' },
  { nama: 'Ibrahim AS', kisah: 'Bapak para nabi (Abul Anbiya). Pencari kebenaran yang menghancurkan berhala, selamat dari api Namrud, dan bersama putranya Ismail membangun Ka\'bah di Makkah.' },
  { nama: 'Luth AS', kisah: 'Diutus kepada penduduk Sodom yang berbuat keji. Kota mereka dijungkirbalikkan Allah, dan hanya Luth beserta pengikutnya yang beriman yang selamat.' },
  { nama: 'Ismail AS', kisah: 'Putra Ibrahim AS yang sabar dan taat; ketika kecil ditinggal di lembah Makkah yang tandus hingga memancar air Zamzam, dan kelak membantu ayahnya meninggikan fondasi Ka\'bah.' },
  { nama: 'Ishaq AS', kisah: 'Putra Ibrahim AS dari Sarah, lahir di usia senja kedua orang tuanya sebagai kabar gembira dari malaikat. Dari keturunannya lahir banyak nabi Bani Israil.' },
  { nama: 'Yaqub AS', kisah: 'Bergelar Israil; putra Ishaq AS dan ayah dari 12 anak yang menjadi cikal bakal Bani Israil. Beliau sangat sabar ketika kehilangan putra kesayangannya, Yusuf.' },
  { nama: 'Yusuf AS', kisah: 'Nabi yang rupawan; dibuang ke sumur oleh saudara-saudaranya, difitnah hingga dipenjara, lalu menjadi bendahara Mesir berkat kepandaiannya menakwilkan mimpi — dan memaafkan saudara-saudaranya.' },
  { nama: 'Ayyub AS', kisah: 'Simbol kesabaran luar biasa: diuji dengan penyakit bertahun-tahun dan kehilangan harta serta anak, namun tidak pernah berhenti bersyukur hingga Allah memulihkannya.' },
  { nama: 'Syu\'aib AS', kisah: 'Diutus kepada penduduk Madyan yang curang dalam timbangan. Beliau dijuluki Khatibul Anbiya (ahli pidato para nabi) karena kefasihan dakwahnya.' },
  { nama: 'Musa AS', kisah: 'Nabi yang berbicara langsung dengan Allah (Kalimullah). Membawa Bani Israil keluar dari perbudakan Fir\'aun; dengan izin Allah tongkatnya membelah Laut Merah, dan beliau menerima Taurat.' },
  { nama: 'Harun AS', kisah: 'Saudara Musa AS yang fasih lisannya, diangkat menjadi nabi untuk mendampingi Musa menghadapi Fir\'aun dan menjaga Bani Israil.' },
  { nama: 'Dzulkifli AS', kisah: 'Nabi yang dikenal sangat sabar dan adil; beliau sanggup berpuasa di siang hari, beribadah di malam hari, dan memutuskan perkara dengan tidak marah.' },
  { nama: 'Dawud AS', kisah: 'Raja sekaligus nabi yang menerima kitab Zabur. Suaranya sangat merdu saat membaca Zabur hingga gunung dan burung ikut bertasbih; beliau juga pembuat baju besi.' },
  { nama: 'Sulaiman AS', kisah: 'Putra Dawud AS; raja bijaksana yang memahami bahasa hewan dan menundukkan jin serta angin. Kisahnya dengan Ratu Bilqis dari Saba menjadi pelajaran tentang dakwah dan kekuasaan.' },
  { nama: 'Ilyas AS', kisah: 'Diutus kepada Bani Israil yang menyembah berhala Ba\'al. Beliau menegakkan tauhid di tengah kaumnya yang durhaka.' },
  { nama: 'Ilyasa AS', kisah: 'Nabi penerus dakwah Ilyas AS di kalangan Bani Israil, yang memimpin kaumnya dengan petunjuk Allah setelah Ilyas tiada.' },
  { nama: 'Yunus AS', kisah: 'Ditelan ikan besar setelah meninggalkan kaumnya sebelum ada izin Allah. Di dalam perut ikan beliau berdoa dengan penuh penyesalan ("La ilaha illa anta...") hingga Allah menyelamatkannya.' },
  { nama: 'Zakariya AS', kisah: 'Nabi yang mengasuh Maryam di Baitul Maqdis. Di usia sangat tua beliau berdoa memohon keturunan dan Allah mengaruniakan Yahya.' },
  { nama: 'Yahya AS', kisah: 'Putra Zakariya AS; nabi yang diberi hikmah sejak kecil, sangat zuhud dan berani menegakkan kebenaran di hadapan penguasa zalim.' },
  { nama: 'Isa AS', kisah: 'Lahir dari Maryam tanpa ayah sebagai tanda kebesaran Allah. Mukjizatnya antara lain berbicara saat bayi, menghidupkan orang mati dengan izin Allah, dan menerima kitab Injil.' },
  { nama: 'Muhammad SAW', kisah: 'Nabi terakhir dan penutup para nabi (Khatamun Nabiyyin), lahir di Makkah tahun Gajah. Menerima wahyu pertama di Gua Hira pada usia 40 tahun dan menerima mukjizat terbesar, Al-Qur\'an, sebagai rahmat bagi seluruh alam.' }
];

export default async function (m, ctx) {
  const cari = (ctx.text || '').trim().toLowerCase().replace(/\s*(as|saw)$/i, '').trim();
  let pilihan = NABI;
  if (cari) {
    pilihan = NABI.filter((n) => n.nama.toLowerCase().includes(cari));
    if (!pilihan.length) {
      await ctx.reply(`❌ Nabi "${ctx.text}" tidak ditemukan.\nDaftar: ${NABI.map((n) => n.nama.replace(/ (AS|SAW)$/, '')).join(', ')}`);
      return;
    }
  }
  const n = pilihan[Math.floor(Math.random() * pilihan.length)];
  await ctx.reply(
    `📚 *Kisah Nabi ${n.nama}*\n\n` +
    `${n.kisah}\n\n` +
    `_Sumber ringkasan: kisah-kisah dalam Al-Qur'an._`
  );
}
