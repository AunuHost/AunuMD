// AunuMD • hitung win beruntun yang dibutuhkan untuk mencapai target winrate MLBB (rumus lokal)
export const config = {
  name: 'hitungwrmlbb',
  alias: ['wrml', 'hitungwr'],
  category: 'tools',
  description: 'Hitung jumlah win beruntun untuk mencapai target winrate MLBB',
  usage: '.hitungwrmlbb <total match> <wr sekarang %> <wr target %>',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 3
};

export default async function (m, ctx) {
  const [totalRaw, wrRaw, targetRaw] = ctx.args;
  const total = parseInt(String(totalRaw || '').replace(/\D/g, ''), 10);
  const wr = parseFloat(String(wrRaw || '').replace('%', '').replace(',', '.'));
  const target = parseFloat(String(targetRaw || '').replace('%', '').replace(',', '.'));

  if (!totalRaw || isNaN(total) || total <= 0 || isNaN(wr) || isNaN(target)) {
    await ctx.reply(
      `🎮 *HITUNG WINRATE MLBB*\n\nPemakaian: ${config.usage}\nContoh: \`${ctx.prefix}hitungwrmlbb 500 52 60\`\n\n` +
      `Artinya: dari 500 match dengan WR 52%, berapa win beruntun agar WR jadi 60%?`
    );
    return;
  }
  if (wr < 0 || wr > 100 || target < 0 || target > 100) {
    await ctx.reply('❌ Persentase WR harus di antara 0–100.');
    return;
  }
  if (target >= 100) {
    await ctx.reply('❌ Target WR 100% mustahil dicapai bila pernah kalah sekali saja — WR hanya bisa mendekati, tidak pernah tepat 100% setelah ada kekalahan.');
    return;
  }

  const menangKini = (total * wr) / 100;
  if (target <= wr) {
    await ctx.reply(
      `🎮 *HASIL HITUNG WR MLBB*\n\n` +
      `• Total match: *${total.toLocaleString('id-ID')}*\n` +
      `• Menang saat ini: *±${menangKini.toFixed(1)}* (WR ${wr}%)\n` +
      `• Target: *${target}%*\n\n` +
      `✅ Target sudah tercapai! WR kamu saat ini (${wr}%) sudah ≥ target (${target}%).`
    );
    return;
  }

  // (W + x) / (M + x) >= target/100  →  x = ceil((target*M - 100*W) / (100 - target))
  const x = Math.ceil(((target * total) - (100 * menangKini)) / (100 - target));
  const totalAkhir = total + x;
  const wrAkhir = ((menangKini + x) / totalAkhir) * 100;

  await ctx.reply(
    `🎮 *HASIL HITUNG WR MLBB*\n\n` +
    `• Total match: *${total.toLocaleString('id-ID')}*\n` +
    `• Menang saat ini: *±${menangKini.toFixed(1)}* (WR ${wr}%)\n` +
    `• Target WR: *${target}%*\n\n` +
    `🏆 Kamu butuh *${x.toLocaleString('id-ID')}x win beruntun* (tanpa kalah) untuk mencapai target.\n` +
    `• Total match akhir: *${totalAkhir.toLocaleString('id-ID')}*\n` +
    `• WR akhir terverifikasi: *${wrAkhir.toFixed(2)}%*`
  );
}
