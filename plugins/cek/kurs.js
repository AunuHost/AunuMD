// AunuMD • konversi kurs mata uang (ExchangeRate API terbuka).
export const config = {
  name: 'kurs',
  alias: ['valas'],
  category: 'cek',
  description: 'Konversi kurs mata uang dunia',
  usage: '.kurs <jumlah?> <DARI> <KE>',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 5
};

function fmt(n) {
  const max = n >= 1 ? 2 : 6;
  return new Intl.NumberFormat('id-ID', { maximumFractionDigits: max, minimumFractionDigits: 0 }).format(n);
}

export default async function (m, ctx) {
  const args = ctx.args || [];
  if (args.length < 2) {
    await ctx.reply(`Pemakaian: ${config.usage}\nContoh: .kurs 100 USD IDR atau .kurs USD IDR`);
    return;
  }
  let jumlah = 1, dari, ke;
  if (args.length >= 3 && !Number.isNaN(parseFloat(args[0].replace(',', '.')))) {
    jumlah = parseFloat(args[0].replace(',', '.'));
    dari = args[1].toUpperCase();
    ke = args[2].toUpperCase();
  } else {
    dari = args[0].toUpperCase();
    ke = args[1].toUpperCase();
  }
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD', { signal: AbortSignal.timeout(20000) });
    if (!res.ok) throw new Error(`HTTP ${res.status} dari open.er-api.com`);
    const data = await res.json();
    if (data.result !== 'success' || !data.rates) throw new Error('Respons kurs tidak valid.');
    const rates = data.rates;
    if (!(dari in rates)) { await ctx.reply(`❌ Kode mata uang "${dari}" tidak dikenal.`); return; }
    if (!(ke in rates)) { await ctx.reply(`❌ Kode mata uang "${ke}" tidak dikenal.`); return; }
    const nilai = jumlah / rates[dari] * rates[ke];
    await ctx.reply(
      `💱 *Konversi Kurs*\n\n` +
      `${fmt(jumlah)} ${dari} = *${fmt(nilai)} ${ke}*\n\n` +
      `1 USD = Rp ${fmt(rates.IDR)} (referensi)\n` +
      `_Diperbarui: ${data.time_last_update_utc || '-'} • Sumber: open.er-api.com_`
    );
  } catch (e) { await ctx.reply(`❌ Error: ${e.message}`); }
}
