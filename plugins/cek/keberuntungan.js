// AunuMD • Cek keberuntungan hari ini (deterministik per nama + tanggal)
export const config = { name: 'keberuntungan', alias: ['hoki'], category: 'cek', description: 'Cek skor hoki, warna, dan angka keberuntungan hari ini', usage: '.keberuntungan', isOwner: false, isGroup: false, isPrivate: false, cooldown: 3 };
function hashStr(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h;
}
const WARNA = ['Merah', 'Emas', 'Hijau Zamrud', 'Biru Langit', 'Ungu', 'Oranye', 'Pink', 'Perak', 'Hitam Elegan', 'Putih Bersih', 'Kuning Cerah', 'Toska'];
export default async function (m, ctx) {
  const { reply } = ctx;
  const nama = (m.pushName || 'Pengguna').toLowerCase();
  const kini = new Date();
  const tglStr = `${kini.getFullYear()}-${String(kini.getMonth() + 1).padStart(2, '0')}-${String(kini.getDate()).padStart(2, '0')}`;
  const h = hashStr(nama + '|' + tglStr);
  const skor = h % 101;
  const warna = WARNA[(h >> 3) % WARNA.length];
  const angka = ((h >> 5) % 99) + 1;
  let pesan;
  if (skor >= 85) pesan = '🌟 Hari yang LUAR BIASA! Keberuntungan besar mengikutimu. Waktu yang tepat untuk mengambil peluang yang selama ini ragu kamu ambil.';
  else if (skor >= 65) pesan = '✨ Hari yang bagus! Banyak hal akan berjalan lancar. Tetap semangat dan jangan lewatkan kesempatan kecil hari ini.';
  else if (skor >= 45) pesan = '🙂 Hari yang cukup seimbang. Tidak terlalu beruntung, tidak sial juga. Fokus pada hal-hal yang bisa kamu kendalikan.';
  else if (skor >= 25) pesan = '🌥️ Hoki lagi pas-pasan. Hindari keputusan besar hari ini, selesaikan hal-hal kecil dulu, dan banyak-banyak sabar.';
  else pesan = '🌧️ Hari ini ujiannya agak berat. Pelan-pelan saja, jangan memaksakan diri. Besok skor hokimu dihitung ulang kok, siapa tahu melonjak!';
  const bar = '█'.repeat(Math.round(skor / 10)) + '░'.repeat(10 - Math.round(skor / 10));
  await reply(
    `🍀 *KEBERUNTUNGAN HARI INI* 🍀\n\n` +
    `👤 ${m.pushName || 'Pengguna'}\n` +
    `📅 ${tglStr}\n\n` +
    `📊 Skor hoki: *${skor}/100*\n[${bar}]\n` +
    `🎨 Warna hoki: *${warna}*\n` +
    `🔢 Angka hoki: *${angka}*\n\n` +
    `${pesan}\n\n` +
    `_Skor berubah setiap hari dan selalu sama sepanjang hari ini. Sekadar hiburan penghibur hari!_`
  );
}
