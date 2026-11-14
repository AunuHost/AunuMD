// AunuMD • tebak usia rata-rata dari nama (agify.io).
export const config = {
  name: 'cekusia',
  alias: ['agify'],
  category: 'cek',
  description: 'Tebak usia rata-rata berdasarkan nama depan',
  usage: '.cekusia <nama>',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 5
};

export default async function (m, ctx) {
  const nama = (ctx.args || [])[0];
  if (!nama) { await ctx.reply(`Pemakaian: ${config.usage}\nContoh: .cekusia Siti`); return; }
  try {
    const res = await fetch(`https://api.agify.io?name=${encodeURIComponent(nama)}`, { signal: AbortSignal.timeout(20000) });
    if (!res.ok) throw new Error(`HTTP ${res.status} dari agify.io`);
    const d = await res.json();
    if (d.age === null || d.age === undefined) { await ctx.reply(`🤔 Nama "${nama}" belum cukup data untuk ditebak usianya.`); return; }
    await ctx.reply(
      `🎂 *Cek Usia Nama*\n\n` +
      `📛 Nama: ${nama}\n` +
      `🔢 Usia rata-rata pemilik nama ini: *${d.age} tahun*\n` +
      `📊 Berdasarkan ${new Intl.NumberFormat('id-ID').format(d.count || 0)} data nama\n\n` +
      `_Ini statistik nama dari agify.io, bukan usia aslimu — sekadar hiburan._`
    );
  } catch (e) { await ctx.reply(`❌ Error: ${e.message}`); }
}
