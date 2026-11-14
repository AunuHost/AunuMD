// AunuMD • Kalimat penyemangat acak untuk pelajar dan para pejuang
const MOTIVASI = [
  'Nilai ujian bukan penentu harga dirimu. Yang menentukan adalah seberapa keras kamu bangkit setelah gagal.',
  'Tidak apa-apa berjalan lambat, yang penting jangan berhenti. Pejuang sejati tidak mengenal kata menyerah.',
  'Setiap ahli dulunya adalah pemula yang menolak untuk berhenti belajar.',
  'Lelah itu wajar, menyerah itu pilihan. Istirahatlah sejenak, lalu lanjutkan perjuanganmu.',
  'Kamu tidak harus jadi yang tercepat. Kamu hanya harus lebih baik dari dirimu yang kemarin.',
  'Mimpi besar memang menakutkan, tapi mimpi kecil tidak akan membawamu ke mana-mana.',
  'Disiplin adalah jembatan antara cita-cita dan kenyataan. Bangunlah jembatan itu setiap hari.',
  'Gagal hari ini bukan akhir cerita. Itu hanya bab yang mengajarkanmu cara menang di bab berikutnya.',
  'Jangan bandingkan prosesmu dengan hasil orang lain. Fokus pada langkahmu sendiri.',
  'Satu halaman yang dibaca hari ini lebih berharga daripada seratus rencana yang tidak pernah dimulai.',
  'Orang tuamu mungkin tidak pernah bercerita tentang lelahnya. Jadikan mereka alasanmu untuk tidak menyerah.',
  'Kesempatan tidak datang dua kali, tapi kerja keras membuka kesempatan baru setiap hari.',
  'Belajar memang melelahkan, tetapi penyesalan karena tidak belajar jauh lebih melelahkan.',
  'Kamu sudah sejauh ini. Terlalu sayang untuk berhenti hanya karena satu hari yang berat.',
  'Keberuntungan berpihak pada mereka yang siap. Persiapkan dirimu, maka kesempatan akan menemukanmu.',
  'Tidak ada jalan pintas menuju tempat yang layak dituju. Nikmati prosesnya, pejuang.',
  'Keraguan membunuh lebih banyak mimpi daripada kegagalan. Percaya pada dirimu sendiri.',
  'Hari ini adalah kesempatan baru untuk memperbaiki yang kemarin terasa kurang.'
];
export const config = { name: 'motivasi', alias: [], category: 'fun', description: 'Kalimat penyemangat acak untuk pelajar dan pejuang', usage: '.motivasi', isOwner: false, isGroup: false, isPrivate: false, cooldown: 3 };
export default async function (m, ctx) {
  const teks = MOTIVASI[Math.floor(Math.random() * MOTIVASI.length)];
  await ctx.reply(`🔥 *Penyemangat Untukmu*\n\n${teks}`);
}
