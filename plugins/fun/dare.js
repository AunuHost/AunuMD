// AunuMD • Tantangan dare acak (ringan, aman, sopan)
export const config = { name: 'dare', alias: [], category: 'fun', description: 'Tantangan dare acak yang ringan dan aman', usage: '.dare', isOwner: false, isGroup: false, isPrivate: false, cooldown: 3 };

const DARE = [
  'Chat temanmu dan bilang "kamu hebat!" tanpa konteks apa pun.',
  'Ganti foto profilmu jadi emoji favoritmu selama 10 menit.',
  'Kirim voice note menyanyikan lagu anak-anak di grup ini.',
  'Tulis status WhatsApp berisi pantun buatanmu sendiri.',
  'Ketik pesan berikutnya hanya dengan huruf kapital semua.',
  'Gambar sesuatu di kertas, foto, lalu kirim ke grup.',
  'Sebutkan 5 hal baik tentang orang yang terakhir kamu chat.',
  'Kirim stiker paling lucu yang kamu punya ke grup.',
  'Bicara pakai bahasa daerahmu di 3 pesan berikutnya.',
  'Buat puisi 2 baris tentang makanan favoritmu dan kirim ke grup.',
  'Tiru gaya bicara tokoh kartun favoritmu di voice note.',
  'Ucapkan terima kasih ke 3 orang hari ini, lalu lapor di grup.',
  'Ganti nama tampilan profilmu jadi judul lagu selama 15 menit.',
  'Kirim foto pemandangan dari jendela rumahmu ke grup.',
  'Tulis pesan tanpa huruf "a" di chat berikutnya.',
  'Ceritakan satu lelucon receh buatanmu sendiri di grup.',
  'Kirim emoji yang menggambarkan perasaanmu sekarang, tanpa kata-kata.',
  'Baca pengumuman ini dengan suara berita TV, kirim voice note-nya.',
  'Sebutkan nama 10 hewan dalam 30 detik, kirim lewat voice note.',
  'Buat daftar 3 hal yang kamu syukuri hari ini dan kirim ke grup.',
  'Jadikan foto makanan terakhir di galerimu sebagai foto profil 10 menit.',
  'Tantang temanmu adu cepat ketik: siapa kalah, kirim stiker memohon ampun.'
];

export default async function (m, ctx) {
  const d = DARE[Math.floor(Math.random() * DARE.length)];
  return ctx.reply(`😈 Berani terima tantangan ini?\n\n🎯 *${d}*`);
}
