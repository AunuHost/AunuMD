// AunuMD • Memilih satu opsi secara acak dari daftar yang diberikan
export const config = { name: 'pick', alias: ['pilih'], category: 'fun', description: 'Pilih satu opsi secara acak (pisahkan dengan | atau koma)', usage: '.pick <opsi1>|<opsi2>|...', isOwner: false, isGroup: false, isPrivate: false, cooldown: 3 };
export default async function (m, ctx) {
  const mentah = (ctx.text || '').trim();
  if (!mentah) return ctx.reply('Mau pilih apa? Contoh: *.pick nasi goreng|mie ayam|bakso* atau *.pick merah, biru, hijau*');
  const opsi = (mentah.includes('|') ? mentah.split('|') : mentah.split(',')).map((s) => s.trim()).filter(Boolean);
  if (opsi.length < 2) return ctx.reply('Butuh minimal *2 opsi* ya. Pisahkan dengan tanda | atau koma.\nContoh: *.pick kopi|teh|susu*');
  const terpilih = opsi[Math.floor(Math.random() * opsi.length)];
  await ctx.reply(`🤔 Dari ${opsi.length} opsi:\n${opsi.map((o) => `• ${o}`).join('\n')}\n\n🎯 Aku pilih: *${terpilih}*`);
}
