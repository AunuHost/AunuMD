// AunuMD • tebak gender dari nama (genderize.io).
export const config = {
  name: 'cekgender',
  alias: ['gender'],
  category: 'cek',
  description: 'Tebak gender berdasarkan nama depan',
  usage: '.cekgender <nama>',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 5
};

export default async function (m, ctx) {
  const nama = (ctx.args || [])[0];
  if (!nama) { await ctx.reply(`Pemakaian: ${config.usage}\nContoh: .cekgender Budi`); return; }
  try {
    const res = await fetch(`https://api.genderize.io?name=${encodeURIComponent(nama)}`, { signal: AbortSignal.timeout(20000) });
    if (!res.ok) throw new Error(`HTTP ${res.status} dari genderize.io`);
    const d = await res.json();
    if (!d.gender) { await ctx.reply(`🤔 Nama "${nama}" belum cukup data untuk ditebak gendernya.`); return; }
    const label = d.gender === 'male' ? 'laki-laki 👨' : 'perempuan 👩';
    const persen = Math.round((d.probability || 0) * 100);
    await ctx.reply(
      `🔍 *Cek Gender Nama*\n\n` +
      `📛 Nama: ${nama}\n` +
      `🚻 Kemungkinan: *${label}*\n` +
      `🎯 Keyakinan: ${persen}%\n` +
      `📊 Berdasarkan ${new Intl.NumberFormat('id-ID').format(d.count || 0)} data nama\n\n` +
      `_Sekadar hiburan ya._`
    );
  } catch (e) { await ctx.reply(`❌ Error: ${e.message}`); }
}
