// AunuMD • profil pengguna: nama, saldo, jumlah pesan, level, status AFK.
export const config = {
  name: 'profile',
  alias: ['profil', 'me'],
  category: 'info',
  description: 'Lihat profil pengguna (atau dirimu sendiri)',
  usage: '.profile [@user]',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 3
};

export default async function (m, ctx) {
  const target = m.mentionedJid?.[0] || m.quoted?.sender || m.sender;
  const u = ctx.db.users.get(target) || {};
  const msgs = u.msgs || 0;
  const level = 1 + Math.floor(Math.sqrt(msgs / 50));
  const name = u.name || (target === m.sender ? m.pushName : null) || '-';
  let status = 'Aktif';
  if (u.afk) {
    const reason = typeof u.afk === 'object' ? (u.afk.reason || '') : String(u.afk);
    status = `💤 ${reason}`.trim();
  }
  await ctx.reply(
    `👤 *Profil Pengguna*\n\n` +
    `📛 Nama: ${name}\n` +
    `📱 Nomor: ${target.split('@')[0]}\n` +
    `💰 Saldo: Rp ${(u.balance || 0).toLocaleString('id-ID')}\n` +
    `💬 Jumlah pesan: ${msgs}\n` +
    `⭐ Level: ${level}\n` +
    `📌 Status: ${status}`
  );
}
