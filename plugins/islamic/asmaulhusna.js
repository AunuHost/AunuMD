// AunuMD • Asmaul Husna: 99 nama Allah beserta artinya (lokal).
export const config = {
  name: 'asmaulhusna',
  alias: ['asmaul'],
  category: 'islamic',
  description: 'Asmaul Husna (acak 5, atau nomor 1-99)',
  usage: '.asmaulhusna [nomor 1-99]',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 3
};

const NAMA = [
  ['Ar-Rahman', 'Yang Maha Pengasih'], ['Ar-Rahim', 'Yang Maha Penyayang'],
  ['Al-Malik', 'Yang Maha Raja'], ['Al-Quddus', 'Yang Maha Suci'],
  ['As-Salam', 'Yang Maha Memberi Kesejahteraan'], ['Al-Mu\'min', 'Yang Maha Memberi Keamanan'],
  ['Al-Muhaimin', 'Yang Maha Memelihara'], ['Al-Aziz', 'Yang Maha Perkasa'],
  ['Al-Jabbar', 'Yang Maha Kuasa'], ['Al-Mutakabbir', 'Yang Maha Memiliki Kebesaran'],
  ['Al-Khaliq', 'Yang Maha Pencipta'], ['Al-Bari', 'Yang Maha Mengadakan'],
  ['Al-Mushawwir', 'Yang Maha Membentuk Rupa'], ['Al-Ghaffar', 'Yang Maha Pengampun'],
  ['Al-Qahhar', 'Yang Maha Menundukkan'], ['Al-Wahhab', 'Yang Maha Pemberi Karunia'],
  ['Ar-Razzaq', 'Yang Maha Pemberi Rezeki'], ['Al-Fattah', 'Yang Maha Pembuka Rahmat'],
  ['Al-Alim', 'Yang Maha Mengetahui'], ['Al-Qabidh', 'Yang Maha Menyempitkan'],
  ['Al-Basith', 'Yang Maha Melapangkan'], ['Al-Khafidh', 'Yang Maha Merendahkan'],
  ['Ar-Rafi', 'Yang Maha Meninggikan'], ['Al-Mu\'izz', 'Yang Maha Memuliakan'],
  ['Al-Mudzill', 'Yang Maha Menghinakan'], ['As-Sami', 'Yang Maha Mendengar'],
  ['Al-Bashir', 'Yang Maha Melihat'], ['Al-Hakam', 'Yang Maha Menetapkan Hukum'],
  ['Al-Adl', 'Yang Maha Adil'], ['Al-Lathif', 'Yang Maha Lembut'],
  ['Al-Khabir', 'Yang Maha Waspada'], ['Al-Halim', 'Yang Maha Penyantun'],
  ['Al-Azhim', 'Yang Maha Agung'], ['Al-Ghafur', 'Yang Maha Pengampun'],
  ['Asy-Syakur', 'Yang Maha Pembalas Budi'], ['Al-Aliy', 'Yang Maha Tinggi'],
  ['Al-Kabir', 'Yang Maha Besar'], ['Al-Hafizh', 'Yang Maha Pemelihara'],
  ['Al-Muqit', 'Yang Maha Pemberi Kecukupan'], ['Al-Hasib', 'Yang Maha Penghitung'],
  ['Al-Jalil', 'Yang Maha Luhur'], ['Al-Karim', 'Yang Maha Mulia'],
  ['Ar-Raqib', 'Yang Maha Mengawasi'], ['Al-Mujib', 'Yang Maha Mengabulkan'],
  ['Al-Wasi', 'Yang Maha Luas'], ['Al-Hakim', 'Yang Maha Bijaksana'],
  ['Al-Wadud', 'Yang Maha Mengasihi'], ['Al-Majid', 'Yang Maha Mulia'],
  ['Al-Ba\'its', 'Yang Maha Membangkitkan'], ['Asy-Syahid', 'Yang Maha Menyaksikan'],
  ['Al-Haqq', 'Yang Maha Benar'], ['Al-Wakil', 'Yang Maha Mewakili'],
  ['Al-Qawiyy', 'Yang Maha Kuat'], ['Al-Matin', 'Yang Maha Kokoh'],
  ['Al-Waliyy', 'Yang Maha Melindungi'], ['Al-Hamid', 'Yang Maha Terpuji'],
  ['Al-Muhshi', 'Yang Maha Menghitung Segala Sesuatu'], ['Al-Mubdi', 'Yang Maha Memulai'],
  ['Al-Mu\'id', 'Yang Maha Mengembalikan Kehidupan'], ['Al-Muhyi', 'Yang Maha Menghidupkan'],
  ['Al-Mumit', 'Yang Maha Mematikan'], ['Al-Hayy', 'Yang Maha Hidup'],
  ['Al-Qayyum', 'Yang Maha Mandiri'], ['Al-Wajid', 'Yang Maha Penemu'],
  ['Al-Maajid', 'Yang Maha Mulia'], ['Al-Wahid', 'Yang Maha Tunggal'],
  ['Al-Ahad', 'Yang Maha Esa'], ['Ash-Shamad', 'Yang Maha Dibutuhkan, Tempat Meminta'],
  ['Al-Qadir', 'Yang Maha Berkuasa'], ['Al-Muqtadir', 'Yang Maha Berkuasa Penuh'],
  ['Al-Muqaddim', 'Yang Maha Mendahulukan'], ['Al-Mu\'akhkhir', 'Yang Maha Mengakhirkan'],
  ['Al-Awwal', 'Yang Maha Awal'], ['Al-Akhir', 'Yang Maha Akhir'],
  ['Azh-Zhahir', 'Yang Maha Nyata'], ['Al-Bathin', 'Yang Maha Ghaib'],
  ['Al-Wali', 'Yang Maha Memerintah'], ['Al-Muta\'ali', 'Yang Maha Tinggi'],
  ['Al-Barr', 'Yang Maha Penderma'], ['At-Tawwab', 'Yang Maha Penerima Taubat'],
  ['Al-Muntaqim', 'Yang Maha Pemberi Balasan'], ['Al-Afuww', 'Yang Maha Pemaaf'],
  ['Ar-Ra\'uf', 'Yang Maha Pengasih'], ['Malikul Mulk', 'Yang Maha Penguasa Kerajaan'],
  ['Dzul Jalali wal Ikram', 'Yang Maha Pemilik Kebesaran dan Kemuliaan'], ['Al-Muqsith', 'Yang Maha Pemberi Keadilan'],
  ['Al-Jami', 'Yang Maha Mengumpulkan'], ['Al-Ghaniyy', 'Yang Maha Kaya'],
  ['Al-Mughni', 'Yang Maha Pemberi Kekayaan'], ['Al-Mani', 'Yang Maha Mencegah'],
  ['Adh-Dharr', 'Yang Maha Penimpa Kemudaratan'], ['An-Nafi', 'Yang Maha Pemberi Manfaat'],
  ['An-Nur', 'Yang Maha Bercahaya'], ['Al-Hadi', 'Yang Maha Pemberi Petunjuk'],
  ['Al-Badi', 'Yang Maha Pencipta Tiada Bandingan'], ['Al-Baqi', 'Yang Maha Kekal'],
  ['Al-Warits', 'Yang Maha Pewaris'], ['Ar-Rasyid', 'Yang Maha Pandai'],
  ['Ash-Shabur', 'Yang Maha Sabar']
];

export default async function (m, ctx) {
  const arg = (ctx.args || [])[0];
  if (arg !== undefined) {
    const n = parseInt(arg, 10);
    if (!n || n < 1 || n > 99) { await ctx.reply(`Pemakaian: ${config.usage} — nomor harus 1 sampai 99.`); return; }
    const [nama, arti] = NAMA[n - 1];
    await ctx.reply(`✨ *Asmaul Husna ke-${n}*\n\n*${nama}*\n${arti}`);
    return;
  }
  const acak = new Set();
  while (acak.size < 5) acak.add(Math.floor(Math.random() * 99));
  const lines = [...acak].map((i) => `${i + 1}. *${NAMA[i][0]}* — ${NAMA[i][1]}`);
  await ctx.reply(`✨ *Asmaul Husna — 5 Nama Pilihan*\n\n${lines.join('\n')}\n\n_Ketik .asmaulhusna <1-99> untuk nama tertentu._`);
}
