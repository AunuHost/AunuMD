// AunuMD • Cek persentase kecocokan jodoh dua nama (deterministik, untuk hiburan)
export const config = { name: 'jodoh', alias: ['cekjodoh'], category: 'cek', description: 'Cek kecocokan dua nama dalam persen', usage: '.jodoh <nama1> & <nama2>', isOwner: false, isGroup: false, isPrivate: false, cooldown: 3 };
function hashNama(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) >>> 0;
  }
  return h;
}
const KATEGORI = [
  { maks: 20, judul: '💔 Belum Jodoh', teks: 'Kecocokannya masih kecil. Tapi tenang, kata orang jodoh itu misteri — kadang yang tidak disangka malah jadi.', saran: 'Saran lucu: coba perbanyak ngobrol dulu, siapa tahu persennya naik di dunia nyata. 😄' },
  { maks: 40, judul: '🌱 Teman Dulu Aja', teks: 'Ada potensi, tapi masih perlu banyak penyesuaian. Fondasi pertemanan kalian cukup kuat untuk dibangun.', saran: 'Saran lucu: mulai dari traktir kopi dulu, jangan langsung traktir masa depan. ☕' },
  { maks: 60, judul: '😊 Lumayan Cocok', teks: 'Kecocokan sedang — cukup banyak kesamaan, sisanya tinggal komunikasi dan saling pengertian.', saran: 'Saran lucu: kurangi debat soal makanan, tambah debat soal film. Lebih aman. 🍿' },
  { maks: 80, judul: '💖 Cocok Banget', teks: 'Kecocokan kalian tinggi! Vibenya nyambung dan saling melengkapi. Tinggal dijaga saja komunikasinya.', saran: 'Saran lucu: jangan lupa undang admin grup kalau jadi ada acara. 😎' },
  { maks: 100, judul: '💍 JODOH SEJATI!', teks: 'Kecocokan nyaris sempurna! Kata primbon nama, pasangan seperti ini langka — seperti sinyal full di tengah hutan.', saran: 'Saran lucu: segera amankan sebelum "diambil orang" seperti kata lagu. 🎶' }
];
export default async function (m, ctx) {
  const { reply, text } = ctx;
  const mentah = (text || '').trim();
  let nama1, nama2;
  if (mentah.includes('&')) {
    const bagian = mentah.split('&').map((s) => s.trim()).filter(Boolean);
    nama1 = bagian[0];
    nama2 = bagian[1];
  } else if (mentah) {
    nama1 = m.pushName || 'Kamu';
    nama2 = mentah;
  }
  if (!nama1 || !nama2) {
    await reply(`💘 Pemakaian: *${ctx.prefix}jodoh <nama1> & <nama2>*\nContoh: ${ctx.prefix}jodoh Budi & Sari\nAtau cukup: ${ctx.prefix}jodoh Sari (dibandingkan dengan namamu)`);
    return;
  }
  const kunci = [nama1.toLowerCase(), nama2.toLowerCase()].sort().join('&');
  const persen = hashNama(kunci) % 101;
  const kat = KATEGORI.find((k) => persen <= k.maks) || KATEGORI[KATEGORI.length - 1];
  const bar = '█'.repeat(Math.round(persen / 10)) + '░'.repeat(10 - Math.round(persen / 10));
  await reply(
    `💘 *CEK JODOH* 💘\n\n` +
    `👤 ${nama1}\n💞 dengan\n👤 ${nama2}\n\n` +
    `📊 Kecocokan: *${persen}%*\n[${bar}]\n\n` +
    `${kat.judul}\n${kat.teks}\n\n${kat.saran}\n\n` +
    `_Hasil selalu sama untuk pasangan nama yang sama. Ini cuma hiburan, jodoh beneran urusan hati dan usaha!_`
  );
}
