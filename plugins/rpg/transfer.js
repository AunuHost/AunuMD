// AunuMD • Transfer saldo ke pengguna lain lewat mention atau reply
export const config = { name: 'transfer', alias: ['tf'], category: 'rpg', description: 'Transfer saldo ke teman via mention/reply', usage: '.transfer @teman <jumlah>', isOwner: false, isGroup: false, isPrivate: false, cooldown: 3 };
export default async function (m, ctx) {
  const { reply, db, args } = ctx;
  const u = db.users.get(m.sender) || {};
  u.balance = u.balance || 0;
  const target = (m.mentionedJid && m.mentionedJid[0]) || (m.quoted ? m.quoted.sender : null);
  const jumlah = parseInt((args.join(' ').replace(/@\d+/g, '').replace(/[^\d]/g, '') || ''), 10);
  if (!target) {
    await reply(`💸 Pemakaian: *${ctx.prefix}transfer @teman <jumlah>*\nMention temanmu atau reply pesannya, lalu tulis jumlahnya.\nContoh: ${ctx.prefix}transfer @6281234567890 5000`);
    return;
  }
  if (!jumlah || isNaN(jumlah) || jumlah <= 0) {
    await reply(`❌ Jumlah transfer tidak valid. Contoh: *${ctx.prefix}transfer @teman 5000*`);
    return;
  }
  if (target === m.sender) {
    await reply(`🤨 Transfer ke diri sendiri? Uangnya cuma muter di dompet yang sama. Tidak bisa ya.`);
    return;
  }
  if (jumlah > u.balance) {
    await reply(`❌ Saldo tidak cukup! Saldo kamu *Rp ${u.balance.toLocaleString('id-ID')}*, mau transfer Rp ${jumlah.toLocaleString('id-ID')}.\nIsi dulu dompetmu: ${ctx.prefix}kerja`);
    return;
  }
  const penerima = db.users.get(target) || {};
  penerima.balance = (penerima.balance || 0) + jumlah;
  u.balance -= jumlah;
  db.users.set(m.sender, u);
  db.users.set(target, penerima);
  const teksKonfirmasi =
    `✅ *TRANSFER BERHASIL!*\n\n` +
    `💸 Terkirim: *Rp ${jumlah.toLocaleString('id-ID')}*\n` +
    `👤 Ke: @${target.split('@')[0]}\n` +
    `👛 Saldo kamu sekarang: *Rp ${u.balance.toLocaleString('id-ID')}*`;
  try {
    await reply(teksKonfirmasi, null, [target]);
  } catch {
    await reply(teksKonfirmasi);
  }
}
