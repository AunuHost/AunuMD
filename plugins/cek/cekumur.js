// AunuMD • Hitung umur lengkap dari tanggal lahir
export const config = { name: 'cekumur', alias: ['umur'], category: 'cek', description: 'Hitung umur, total hari hidup, dan countdown ulang tahun', usage: '.cekumur <DD-MM-YYYY>', isOwner: false, isGroup: false, isPrivate: false, cooldown: 3 };
export default async function (m, ctx) {
  const { reply, args } = ctx;
  const mentah = (args[0] || '').trim();
  const cocok = mentah.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
  if (!cocok) {
    await reply(`🎂 Pemakaian: *${ctx.prefix}cekumur <DD-MM-YYYY>*\nContoh: ${ctx.prefix}cekumur 17-08-2008`);
    return;
  }
  const d = parseInt(cocok[1], 10);
  const mo = parseInt(cocok[2], 10);
  const y = parseInt(cocok[3], 10);
  const lahir = new Date(y, mo - 1, d);
  if (lahir.getDate() !== d || lahir.getMonth() !== mo - 1 || lahir.getFullYear() !== y) {
    await reply('❌ Tanggal tidak valid. Cek lagi hari dan bulannya ya.');
    return;
  }
  const kini = new Date();
  kini.setHours(0, 0, 0, 0);
  if (lahir > kini) {
    await reply('❌ Tanggal lahirnya di masa depan. Kamu belum lahir dong 😅');
    return;
  }
  let tahun = kini.getFullYear() - y;
  let bulan = kini.getMonth() - (mo - 1);
  let hari = kini.getDate() - d;
  if (hari < 0) {
    bulan -= 1;
    const bulanLalu = new Date(kini.getFullYear(), kini.getMonth(), 0);
    hari += bulanLalu.getDate();
  }
  if (bulan < 0) {
    tahun -= 1;
    bulan += 12;
  }
  const totalHari = Math.floor((kini - lahir) / 86400000);
  let ultahBerikut = new Date(kini.getFullYear(), mo - 1, d);
  if (ultahBerikut < kini) ultahBerikut = new Date(kini.getFullYear() + 1, mo - 1, d);
  const menujuUltah = Math.floor((ultahBerikut - kini) / 86400000);
  await reply(
    `🎂 *UMUR KAMU* 🎂\n\n` +
    `📅 Tanggal lahir: ${String(d).padStart(2, '0')}-${String(mo).padStart(2, '0')}-${y}\n` +
    `🧮 Umur: *${tahun} tahun, ${bulan} bulan, ${hari} hari*\n` +
    `📆 Total hari hidup: *${totalHari.toLocaleString('id-ID')} hari*\n` +
    (menujuUltah === 0
      ? `🎉 *HARI INI KAMU ULANG TAHUN!* Selamat ulang tahun yang ke-${tahun}! 🥳`
      : `⏳ Ulang tahun berikutnya (${tahun + 1} tahun) dalam: *${menujuUltah} hari* lagi`)
  );
}
