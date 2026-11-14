// AunuMD • Judi lempar koin: menang gandakan taruhan, kalah hangus
export const config = { name: 'judi', alias: ['bet'], category: 'rpg', description: 'Lempar koin: menang saldo bertambah, kalah berkurang', usage: '.judi <jumlah>', isOwner: false, isGroup: false, isPrivate: false, cooldown: 3 };
export default async function (m, ctx) {
  const { reply, db, args } = ctx;
  const u = db.users.get(m.sender) || {};
  u.balance = u.balance || 0;
  const jumlah = parseInt((args[0] || '').replace(/[^\d]/g, ''), 10);
  if (!jumlah || isNaN(jumlah) || jumlah <= 0) {
    await reply(`🎲 Pemakaian: *${ctx.prefix}judi <jumlah>*\nContoh: ${ctx.prefix}judi 1000\n\n👛 Saldo kamu: *Rp ${u.balance.toLocaleString('id-ID')}*`);
    return;
  }
  if (jumlah > u.balance) {
    await reply(`❌ Saldo tidak cukup! Kamu cuma punya *Rp ${u.balance.toLocaleString('id-ID')}*, sedangkan taruhanmu Rp ${jumlah.toLocaleString('id-ID')}.\nKerja dulu sana: ${ctx.prefix}kerja`);
    return;
  }
  const menang = Math.random() < 0.5;
  if (menang) {
    u.balance += jumlah;
  } else {
    u.balance -= jumlah;
  }
  db.users.set(m.sender, u);
  await reply(
    `🪙 Koin dilempar... dan berhenti di *${menang ? 'ANGKA 👑' : 'GAMBAR 🦅'}*!\n\n` +
    (menang
      ? `🎉 *KAMU MENANG!* Taruhanmu kembali plus untung.\n💵 +Rp ${jumlah.toLocaleString('id-ID')}`
      : `💀 *KAMU KALAH!* Taruhanmu hangus dimakan bandar.\n💸 -Rp ${jumlah.toLocaleString('id-ID')}`) +
    `\n👛 Saldo akhir: *Rp ${u.balance.toLocaleString('id-ID')}*`
  );
}
