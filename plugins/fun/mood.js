// AunuMD • Mood acak hari ini dengan deskripsi lucu
const MOODS = [
  { emoji: '🚀', nama: 'Semangat Membara', desc: 'Energi penuh! Hari ini rasanya bisa menaklukkan dunia... atau minimal menaklukkan cucian yang menumpuk.' },
  { emoji: '🦥', nama: 'Mode Kungkang', desc: 'Gerak lambat, motivasi minimal. Bahkan untuk malas pun terasa agak melelahkan.' },
  { emoji: '🌧️', nama: 'Galau Tipis-Tipis', desc: 'Ada sendu yang tak tahu sebabnya. Mungkin cuma butuh lagu mellow dan teh hangat.' },
  { emoji: '🎢', nama: 'Roller Coaster', desc: 'Baru saja tertawa, lima menit lagi overthinking. Emosimu hari ini penuh kejutan.' },
  { emoji: '🍜', nama: 'Fokus Kuliner', desc: 'Otak hanya berisi satu pertanyaan penting: hari ini makan apa?' },
  { emoji: '🧠', nama: 'Overthinking Kronis', desc: 'Percakapan tiga hari lalu masih diputar ulang di kepala. Tenang, tidak ada yang mengingatnya selain kamu.' },
  { emoji: '🌞', nama: 'Cerah Ceria', desc: 'Mood lagi bagus-bagusnya. Senyummu hari ini bisa menular ke siapa saja.' },
  { emoji: '🔋', nama: 'Baterai 12%', desc: 'Masih bisa berfungsi, tapi sebaiknya segera di-charge pakai tidur dan makanan enak.' },
  { emoji: '🎮', nama: 'Mode Santai Maksimal', desc: 'Produktivitas? Nanti dulu. Hari ini waktunya rebahan dan hiburan tanpa rasa bersalah.' },
  { emoji: '💸', nama: 'Dompet Menjerit', desc: 'Mood belanja lagi tinggi, tapi saldo berkata sebaliknya. Bertahanlah, pejuang tanggal tua.' }
];
export const config = { name: 'mood', alias: [], category: 'fun', description: 'Cek mood acak hari ini', usage: '.mood', isOwner: false, isGroup: false, isPrivate: false, cooldown: 3 };
export default async function (m, ctx) {
  const mood = MOODS[Math.floor(Math.random() * MOODS.length)];
  await ctx.reply(`${mood.emoji} *Mood Hari Ini: ${mood.nama}*\n\n${mood.desc}`);
}
