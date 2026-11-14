// AunuMD • Menjawab permainan aktif (tebak angka, kuis, tebak kata, teka-teki, emoji)
import { getSession, clearSession, sessionKey } from '../../src/game-session.js';
export const config = { name: 'jawab', alias: [], category: 'game', description: 'Menjawab permainan yang sedang aktif', usage: '.jawab <jawaban>', isOwner: false, isGroup: false, isPrivate: false, cooldown: 1 };
export default async function (m, ctx) {
  const { db } = ctx;
  const beri = (n) => { const u = db.users.get(m.sender) || {}; u.balance = (u.balance || 0) + n; db.users.set(m.sender, u); };
  const saldo = () => (db.users.get(m.sender) || {}).balance || 0;
  const key = sessionKey(m);
  const s = getSession(key);
  if (!s) return ctx.reply('Tidak ada permainan aktif. Mulai: .tebakangka / .kuis / .tebakata / .tekateki / .emojiquiz');
  const masukan = (ctx.text || '').trim();
  if (!masukan) return ctx.reply('Tulis jawabanmu sekalian ya. Contoh: *.jawab 42*');
  if (s.type === 'angka') {
    const tebak = Number(masukan);
    if (!Number.isFinite(tebak)) return ctx.reply('Untuk tebak angka, jawabanmu harus berupa angka. Contoh: *.jawab 42*');
    if (tebak === Number(s.answer)) {
      beri(s.reward);
      clearSession(key);
      return ctx.reply(`🎉 *BENAR!* Angka rahasianya memang *${s.answer}*.\n\n💰 +${s.reward} saldo\n💼 Saldo kamu sekarang: *${saldo()}*`);
    }
    s.tries--;
    if (s.tries <= 0) {
      const ans = s.answer;
      clearSession(key);
      return ctx.reply(`💀 Kesempatan habis! Angka yang benar adalah *${ans}*.\nAyo coba lagi dengan *.tebakangka*`);
    }
    const petunjuk = tebak < Number(s.answer)
      ? '🔼 Terlalu kecil! Coba angka yang *lebih besar*.'
      : '🔽 Terlalu besar! Coba angka yang *lebih kecil*.';
    return ctx.reply(`${petunjuk}\n❤️ Sisa kesempatan: *${s.tries}*`);
  }
  const norm = (x) => String(x).toLowerCase().trim().replace(/\s+/g, ' ');
  if (norm(masukan) === norm(s.answer)) {
    beri(s.reward);
    clearSession(key);
    return ctx.reply(`🎉 *BENAR!* Jawabannya: *${s.answer}*\n\n💰 +${s.reward} saldo\n💼 Saldo kamu sekarang: *${saldo()}*`);
  }
  s.tries--;
  if (s.tries <= 0) {
    const ans = s.answer;
    clearSession(key);
    return ctx.reply(`💀 Kesempatan habis! Jawaban yang benar adalah *${ans}*.\nAyo mulai permainan baru!`);
  }
  await ctx.reply(`❌ Belum tepat, coba lagi ya.\n❤️ Sisa kesempatan: *${s.tries}*`);
}
