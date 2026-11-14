// AunuMD • Menghitung persentase kecocokan dua nama secara deterministik (hash nama)
function hashStr(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}
function komentar(persen) {
  if (persen <= 10) return 'Zonk total. Mungkin lebih cocok jadi rival abadi. 💔';
  if (persen <= 25) return 'Kecocokannya tipis banget. Butuh keajaiban dan banyak kompromi.';
  if (persen <= 40) return 'Ada sedikit percikan, tapi jalannya masih terjal.';
  if (persen <= 55) return 'Lumayan cocok. Dengan usaha, bisa jadi sesuatu yang manis.';
  if (persen <= 70) return 'Cocok! Chemistry-nya terasa, tinggal dirawat baik-baik.';
  if (persen <= 85) return 'Cocok banget! Seperti kopi dan pagi hari, saling melengkapi.';
  if (persen <= 99) return 'Nyaris jodoh sempurna! Semesta seperti merestui. 💖';
  return 'JODOH SEJATI 100%! Ini bukan kebetulan, ini takdir. 💍🎉';
}
export const config = { name: 'ship', alias: [], category: 'fun', description: 'Hitung persentase kecocokan dengan seseorang (mention/balas/tulis nama)', usage: '.ship <nama/@tag>', isOwner: false, isGroup: false, isPrivate: false, cooldown: 3 };
export default async function (m, ctx) {
  let targetNama = (ctx.text || '').trim();
  let targetTampil = targetNama;
  if (!targetNama && (m.mentionedJid || []).length) {
    targetNama = m.mentionedJid[0].split('@')[0];
    targetTampil = '@' + targetNama;
  } else if (!targetNama && m.quoted?.sender) {
    targetNama = m.quoted.sender.split('@')[0];
    targetTampil = '@' + targetNama;
  }
  if (!targetNama) return ctx.reply('Mau di-ship dengan siapa? Contoh: *.ship Budi*, atau tag/balas orangnya lalu ketik *.ship*');
  const namaPengirim = m.pushName || 'Kamu';
  const persen = hashStr((namaPengirim + '❤' + targetNama).toLowerCase()) % 101;
  const penuh = Math.round(persen / 10);
  const bar = '▰'.repeat(penuh) + '▱'.repeat(10 - penuh);
  await ctx.reply(`💘 *Ship Meter*\n\n${namaPengirim} ❤️ ${targetTampil}\n\n${bar} *${persen}%*\n\n${komentar(persen)}`);
}
