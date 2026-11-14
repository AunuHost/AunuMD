// AunuMD • Hitung weton Jawa (hari + pasaran + neptu) dari tanggal lahir
export const config = { name: 'weton', alias: [], category: 'cek', description: 'Hitung weton, pasaran, dan neptu dari tanggal lahir', usage: '.weton <DD-MM-YYYY>', isOwner: false, isGroup: false, isPrivate: false, cooldown: 3 };
const HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const PASARAN = ['Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon'];
const NEPTU_HARI = { Minggu: 5, Senin: 4, Selasa: 3, Rabu: 7, Kamis: 8, Jumat: 6, Sabtu: 9 };
const NEPTU_PASARAN = { Legi: 5, Pahing: 9, Pon: 7, Wage: 4, Kliwon: 8 };
function watak(neptu) {
  if (neptu <= 8) return 'Kamu cenderung tenang, sederhana, dan tidak neko-neko. Hidupmu mengalir apa adanya, dan kamu mudah merasa cukup dengan yang kamu punya.';
  if (neptu <= 12) return 'Kamu pribadi yang seimbang dan mudah bergaul. Pandai menyesuaikan diri di berbagai situasi dan disukai banyak orang.';
  if (neptu <= 16) return 'Kamu punya semangat dan ambisi yang besar. Enerjik dalam mengejar keinginan, tapi perlu belajar menahan diri agar tidak terburu-buru.';
  return 'Kamu berjiwa pemimpin dengan tekad baja dan keberuntungan yang kuat. Pengaruhmu besar pada orang sekitar, jaga agar tetap rendah hati.';
}
export default async function (m, ctx) {
  const { reply, args } = ctx;
  const mentah = (args[0] || '').trim();
  const cocok = mentah.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
  if (!cocok) {
    await reply(`🗓️ Pemakaian: *${ctx.prefix}weton <DD-MM-YYYY>*\nContoh: ${ctx.prefix}weton 17-08-2008`);
    return;
  }
  const d = parseInt(cocok[1], 10);
  const mo = parseInt(cocok[2], 10);
  const y = parseInt(cocok[3], 10);
  const utc = Date.UTC(y, mo - 1, d);
  const tanggal = new Date(utc);
  if (tanggal.getUTCDate() !== d || tanggal.getUTCMonth() !== mo - 1 || tanggal.getUTCFullYear() !== y) {
    await reply('❌ Tanggal tidak valid. Cek lagi hari dan bulannya ya.');
    return;
  }
  const hari = HARI[tanggal.getUTCDay()];
  const idx = ((Math.floor(utc / 86400000) % 5) + 5) % 5;
  const pasaran = PASARAN[idx];
  const neptu = NEPTU_HARI[hari] + NEPTU_PASARAN[pasaran];
  await reply(
    `🗓️ *WETON KAMU* 🗓️\n\n` +
    `📅 Tanggal: ${String(d).padStart(2, '0')}-${String(mo).padStart(2, '0')}-${y}\n` +
    `🌟 Weton: *${hari} ${pasaran}*\n` +
    `🔢 Neptu: ${NEPTU_HARI[hari]} (${hari}) + ${NEPTU_PASARAN[pasaran]} (${pasaran}) = *${neptu}*\n\n` +
    `🔮 Watak: ${watak(neptu)}\n\n` +
    `_Perhitungan weton berdasarkan primbon Jawa, untuk hiburan dan pelestarian budaya._`
  );
}
