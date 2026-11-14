// AunuMD • Tebak-tebakan logika absurd ala Cak Lontong (jawaban ditampilkan terbalik)
const SOAL = [
  { tanya: 'Kenapa air laut asin?', jawab: 'Karena ikan-ikan di dalamnya berkeringat' },
  { tanya: 'Kenapa sepeda tidak bisa berdiri sendiri?', jawab: 'Karena dia sudah lelah berdiri terus' },
  { tanya: 'Kenapa burung bisa terbang?', jawab: 'Karena kalau berenang namanya bukan burung, tapi ikan' },
  { tanya: 'Kenapa guru selalu benar?', jawab: 'Karena kalau salah, namanya bukan guru tapi murid' },
  { tanya: 'Kenapa orang tidur memejamkan mata?', jawab: 'Karena kalau melek namanya bukan tidur, tapi bangun' },
  { tanya: 'Kenapa jam dinding tidak pernah jatuh?', jawab: 'Karena dia memang sudah digantung dari awal' },
  { tanya: 'Kenapa ikan tidak bisa main sepak bola?', jawab: 'Karena lapangannya kering, dia tidak terbiasa' },
  { tanya: 'Kenapa bulan bentuknya bulat?', jawab: 'Karena kalau kotak namanya bukan bulan, tapi kardus' },
  { tanya: 'Kenapa komputer tidak pernah lapar?', jawab: 'Karena makanannya data, bukan nasi' },
  { tanya: 'Kenapa matahari terbit dari timur?', jawab: 'Karena timur sudah antre duluan sejak semalam' },
  { tanya: 'Kenapa pohon tidak pernah pergi ke sekolah?', jawab: 'Karena dia sudah ditanam sejak kecil' },
  { tanya: 'Kenapa kucing tidak bisa main kartu?', jawab: 'Karena kartunya selalu habis dicakar' },
  { tanya: 'Kenapa nasi di rice cooker tidak pernah dingin?', jawab: 'Karena rice cooker-nya tidak pernah membiarkannya kedinginan' },
  { tanya: 'Kenapa pintu tidak pernah jalan-jalan?', jawab: 'Karena dia selalu dijaga gagang dan engsel' }
];
export const config = { name: 'caklontong', alias: [], category: 'fun', description: 'Tebak-tebakan logika absurd ala Cak Lontong', usage: '.caklontong', isOwner: false, isGroup: false, isPrivate: false, cooldown: 3 };
export default async function (m, ctx) {
  const s = SOAL[Math.floor(Math.random() * SOAL.length)];
  const terbalik = s.jawab.split('').reverse().join('');
  await ctx.reply(`🎤 *Cak Lontong Bertanya*\n\n❓ ${s.tanya}\n\n🔒 Jawaban (tertulis terbalik, balik tulisannya untuk membaca):\n${terbalik}`);
}
