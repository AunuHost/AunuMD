// AunuMD • dzikir pilihan (lokal).
export const config = {
  name: 'dzikir',
  alias: [],
  category: 'islamic',
  description: 'Dzikir pilihan acak beserta keutamaannya',
  usage: '.dzikir',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 3
};

const DZIKIR = [
  { lafaz: 'Subhanallah', arti: 'Mahasuci Allah', utama: 'Ditulis baginya seribu kebaikan atau dihapus darinya seribu kesalahan. (HR. Muslim)', target: 100 },
  { lafaz: 'Alhamdulillah', arti: 'Segala puji bagi Allah', utama: 'Memenuhi timbangan amal kebaikan. (HR. Muslim)', target: 100 },
  { lafaz: 'Allahu Akbar', arti: 'Allah Mahabesar', utama: 'Kalimat yang dicintai Allah, bagian dari dzikir setelah shalat.', target: 100 },
  { lafaz: 'La ilaha illallah', arti: 'Tiada Tuhan selain Allah', utama: 'Dzikir yang paling utama. (HR. Tirmidzi)', target: 100 },
  { lafaz: 'Subhanallahi wa bihamdihi', arti: 'Mahasuci Allah dan dengan memuji-Nya', utama: 'Siapa membacanya 100 kali sehari, diampuni dosa-dosanya walau sebanyak buih di lautan. (HR. Bukhari & Muslim)', target: 100 },
  { lafaz: 'Subhanallahi wa bihamdihi, subhanallahil azhim', arti: 'Mahasuci Allah dan dengan memuji-Nya, Mahasuci Allah Yang Maha Agung', utama: 'Dua kalimat yang ringan di lisan, berat di timbangan, dan dicintai Ar-Rahman. (HR. Bukhari & Muslim)', target: 100 },
  { lafaz: 'Astaghfirullahal azhim', arti: 'Aku memohon ampun kepada Allah Yang Maha Agung', utama: 'Siapa yang memperbanyak istighfar, Allah jadikan baginya jalan keluar dari setiap kesempitan dan rezeki dari arah tak disangka. (HR. Abu Dawud)', target: 100 },
  { lafaz: 'La hawla wa la quwwata illa billah', arti: 'Tiada daya dan kekuatan kecuali dengan pertolongan Allah', utama: 'Salah satu simpanan kekayaan surga. (HR. Bukhari & Muslim)', target: 100 },
  { lafaz: 'Allahumma shalli ala Muhammad wa ala ali Muhammad', arti: 'Ya Allah, limpahkanlah shalawat kepada Muhammad dan keluarga Muhammad', utama: 'Siapa bershalawat kepadaku satu kali, Allah bershalawat kepadanya sepuluh kali. (HR. Muslim)', target: 100 },
  { lafaz: 'Subhanallah walhamdulillah wa la ilaha illallah wallahu akbar', arti: 'Mahasuci Allah, segala puji bagi Allah, tiada Tuhan selain Allah, Allah Mahabesar', utama: 'Kalimat-kalimat yang paling dicintai Allah. (HR. Muslim)', target: 33 },
  { lafaz: 'Hasbunallah wa ni\'mal wakil', arti: 'Cukuplah Allah menjadi Penolong kami dan Allah adalah sebaik-baik Pelindung', utama: 'Dibaca saat menghadapi kesulitan; ucapan Nabi Ibrahim AS ketika dilempar ke api. (HR. Bukhari)', target: 33 },
  { lafaz: 'La ilaha illa anta subhanaka inni kuntu minazh zhalimin', arti: 'Tidak ada Tuhan selain Engkau, Mahasuci Engkau, sesungguhnya aku termasuk orang-orang yang zalim', utama: 'Doa Nabi Yunus AS; tidaklah seorang muslim berdoa dengannya untuk sesuatu melainkan Allah kabulkan. (HR. Tirmidzi)', target: 33 }
];

export default async function (m, ctx) {
  const d = DZIKIR[Math.floor(Math.random() * DZIKIR.length)];
  await ctx.reply(
    `📿 *Dzikir Pilihan*\n\n` +
    `*${d.lafaz}*\n` +
    `Artinya: "${d.arti}"\n\n` +
    `✨ Keutamaan: ${d.utama}\n` +
    `🔢 Target umum: ${d.target}x`
  );
}
