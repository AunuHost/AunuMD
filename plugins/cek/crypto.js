// AunuMD • harga kripto dari CoinGecko.
export const config = {
  name: 'crypto',
  alias: ['kripto'],
  category: 'cek',
  description: 'Harga cryptocurrency (USD & IDR)',
  usage: '.crypto [simbol...]',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 8
};

const PETA = {
  btc: 'bitcoin', eth: 'ethereum', sol: 'solana', bnb: 'binancecoin',
  xrp: 'ripple', doge: 'dogecoin', ada: 'cardano', usdt: 'tether',
  trx: 'tron', ltc: 'litecoin'
};

const fmtUSD = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: n >= 1 ? 2 : 6 }).format(n);
const fmtIDR = (n) => 'Rp ' + new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(Math.round(n));

export default async function (m, ctx) {
  const diminta = (ctx.args || []).map((a) => a.toLowerCase()).filter((a) => PETA[a]);
  const simbol = diminta.length ? diminta : ['btc', 'eth', 'sol', 'usdt'];
  const ids = simbol.map((s) => PETA[s]).join(',');
  try {
    const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd,idr`, { signal: AbortSignal.timeout(20000) });
    if (!res.ok) throw new Error(`HTTP ${res.status} dari CoinGecko`);
    const data = await res.json();
    const lines = simbol.map((s) => {
      const d = data[PETA[s]];
      if (!d) return `• ${s.toUpperCase()}: data tidak tersedia`;
      return `• *${s.toUpperCase()}*: ${fmtUSD(d.usd)} | ${fmtIDR(d.idr)}`;
    });
    if ((ctx.args || []).length && !diminta.length) {
      await ctx.reply(`❌ Simbol tidak dikenal. Pilihan: ${Object.keys(PETA).join(', ').toUpperCase()}`);
      return;
    }
    await ctx.reply(`🪙 *Harga Kripto*\n\n${lines.join('\n')}\n\n_Sumber: CoinGecko_`);
  } catch (e) { await ctx.reply(`❌ Error: ${e.message}`); }
}
