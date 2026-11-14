// AunuMD • Ramalan rezeki harian deterministik dari hash nama dan tanggal hari ini
const KATEGORI = [
  {
    nama: '💰 Rezeki Nomplok',
    pesan: [
      'Ada peluang uang tak terduga mendekat hari ini. Tetap waspada membaca setiap kesempatan.',
      'Seseorang mungkin membalas kebaikanmu dengan cara yang tidak kamu sangka. Bersiaplah tersenyum.',
      'Keberuntungan finansial sedang berpihak. Gunakan dengan bijak, jangan dihamburkan.'
    ]
  },
  {
    nama: '🌊 Rezeki Lancar',
    pesan: [
      'Arus rezekimu mengalir stadil hari ini. Tidak deras, tapi tidak pernah berhenti.',
      'Usaha yang kamu jalani mulai menunjukkan hasil. Teruskan ritme baik ini.',
      'Hari yang baik untuk menata keuangan dan merapikan rencana jangka panjang.'
    ]
  },
  {
    nama: '🌱 Rezeki Bertumbuh',
    pesan: [
      'Rezekimu hari ini berbentuk benih: kecil sekarang, besar nanti bila dirawat dengan sabar.',
      'Ilmu dan relasi yang kamu bangun hari ini adalah rezeki yang nilainya tumbuh diam-diam.',
      'Jangan remehkan langkah kecil. Hari ini adalah fondasi rezeki besarmu.'
    ]
  },
  {
    nama: '🤝 Rezeki dari Teman',
    pesan: [
      'Pintu rezekimu hari ini terbuka lewat orang lain. Jaga silaturahmi dan jangan sungkan membantu.',
      'Ada kabar baik yang datang melalui teman atau kenalan. Dengarkan baik-baik.',
      'Networking adalah kunci hari ini. Satu obrolan ringan bisa jadi awal peluang besar.'
    ]
  },
  {
    nama: '🧗 Rezeki Butuh Perjuangan',
    pesan: [
      'Rezeki hari ini tidak datang sendiri; ia menunggu di ujung usahamu. Bergeraklah lebih dulu.',
      'Hari ini bukan hari keberuntungan instan, tapi hari pembuktian. Yang tekun akan memanen.',
      'Tantangan finansial kecil mungkin muncul, tapi kamu punya cukup bekal untuk melewatinya.'
    ]
  },
  {
    nama: '🛑 Rezeki Seret, Waktunya Irit',
    pesan: [
      'Arus keluar terasa lebih deras dari arus masuk. Tahan dulu keinginan yang tidak mendesak.',
      'Hari yang tepat untuk mengevaluasi pengeluaran. Dompetmu akan berterima kasih nanti.',
      'Jangan memaksakan keberuntungan hari ini. Simpan energimu, esok bisa jadi berbeda.'
    ]
  }
];
function hashStr(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}
export const config = { name: 'rezeki', alias: ['ramalrezeki'], category: 'fun', description: 'Ramalan rezeki hari ini dari nama (deterministik per hari)', usage: '.rezeki [nama]', isOwner: false, isGroup: false, isPrivate: false, cooldown: 3 };
export default async function (m, ctx) {
  const nama = (ctx.text || '').trim() || m.pushName || 'Kamu';
  const hariIni = new Date().toISOString().slice(0, 10);
  const seed = hashStr((nama + '|' + hariIni).toLowerCase());
  const kat = KATEGORI[seed % KATEGORI.length];
  const pesan = kat.pesan[(seed >> 4) % kat.pesan.length];
  await ctx.reply(`🔮 *Ramalan Rezeki — ${hariIni}*\n\nNama: *${nama}*\nKategori: *${kat.nama}*\n\n${pesan}\n\n_Ingat, ini hanya hiburan. Rezeki sungguhan tetap lahir dari usaha dan doa._`);
}
