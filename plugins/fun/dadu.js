// AunuMD • Lempar dadu acak
export const config = { name: 'dadu', alias: [], category: 'fun', description: 'Lempar dadu (sisi custom atau format 2d6)', usage: '.dadu [sisi | NdS]', isOwner: false, isGroup: false, isPrivate: false, cooldown: 3 };

export default async function (m, ctx) {
  const arg = (ctx.args[0] || '').toLowerCase();
  let jumlah = 1;
  let sisi = 6;
  const pola = /^(\d+)d(\d+)$/.exec(arg);
  if (pola) {
    jumlah = parseInt(pola[1], 10);
    sisi = parseInt(pola[2], 10);
  } else if (/^\d+$/.test(arg)) {
    sisi = parseInt(arg, 10);
  } else if (arg) {
    return ctx.reply(`Format tidak dikenal.\nPemakaian: ${config.usage}\nContoh: .dadu, .dadu 20, .dadu 2d6`);
  }
  if (jumlah < 1 || jumlah > 20) return ctx.reply('Jumlah dadu harus 1–20.');
  if (sisi < 2 || sisi > 100) return ctx.reply('Sisi dadu harus 2–100.');
  const hasil = [];
  for (let i = 0; i < jumlah; i++) hasil.push(Math.floor(Math.random() * sisi) + 1);
  const total = hasil.reduce((a, b) => a + b, 0);
  const baris = hasil.map((h, i) => `🎲 Dadu ${i + 1}: *${h}*`).join('\n');
  return ctx.reply(`${baris}\n\n🧮 Total: *${total}* (dari ${jumlah}d${sisi})`);
}
