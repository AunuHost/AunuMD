// AunuMD • Pantun acak 4 baris
export const config = { name: 'pantun', alias: [], category: 'fun', description: 'Pantun acak (jenaka, nasihat, cinta ringan)', usage: '.pantun', isOwner: false, isGroup: false, isPrivate: false, cooldown: 3 };

const PANTUN = [
  'Jalan-jalan ke Kota Blitar,\njangan lupa membeli sukun.\nKalau kamu ingin pintar,\nbelajarlah dengan tekun.',
  'Buah semangka buah kedondong,\ndibawa pulang oleh Pak Somad.\nJangan suka berkata bohong,\nnanti dijauhi sahabat.',
  'Pergi ke pasar membeli ragi,\nragi dibungkus daun pandan.\nSenyummu manis di pagi hari,\nmembuat hati jadi nyaman.',
  'Anak ayam turun sepuluh,\nmati satu tinggal sembilan.\nBelajar giat jangan mengeluh,\ndemi masa depan yang cemerlang.',
  'Ikan sepat ikan gabus,\nmakin cepat makin bagus.\nTidak lebat tidak bagus,\nkerja cepat hasil pun bagus.',
  'Jalan kaki ke tepi kali,\nmenemukan katak di dalam semak.\nRajin-rajinlah mengaji,\nbekal hidup di dunia dan akhirat.',
  'Burung merpati terbang ke awan,\nhinggap sebentar di pohon randu.\nSudah lama tidak berjumpa kawan,\nsekali jumpa melepas rindu.',
  'Beli baju di Pasar Senen,\npulangnya mampir membeli bakwan.\nKatanya senin sampai senin,\nyang ditunggu tak kunjung datang, kawan.',
  'Kalau ada jarum yang patah,\njangan disimpan di dalam peti.\nKalau ada kata yang salah,\njangan disimpan di dalam hati.',
  'Pohon mangga di tepi rawa,\nbuahnya jatuh ke dalam perahu.\nJangan suka tertawa-tawa,\nkalau bicara pakai ilmu.',
  'Pergi berburu ke dalam hutan,\ndapat rusa belang kaki.\nBerguru kepalang ajaran,\nbagai bunga kembang tak jadi.',
  'Makan roti di tepi pantai,\nsambil melihat ombak berlari.\nKamu yang manis dan pandai,\nmembuat hari-hari berseri.',
  'Sore hari minum es teh,\nduduk santai di beranda.\nKalau hati sedang lelah,\nistirahatlah, jangan dipaksa.',
  'Naik sepeda ke rumah paman,\nmelewati sawah yang hijau.\nJaga selalu persahabatan,\nitu harta yang tak ternilai.'
];

export default async function (m, ctx) {
  const p = PANTUN[Math.floor(Math.random() * PANTUN.length)];
  return ctx.reply(`🎤 *Pantun untukmu:*\n\n${p}`);
}
