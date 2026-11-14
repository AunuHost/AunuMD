// AunuMD • Permainan tebak angka 1-100 dengan 5 kesempatan
import { setSession, getSession, sessionKey } from '../../src/game-session.js';
export const config = { name: 'tebakangka', alias: ['tebaknomor'], category: 'game', description: 'Tebak angka 1-100 dalam 5 kesempatan, hadiah 50 saldo', usage: '.tebakangka', isOwner: false, isGroup: false, isPrivate: false, cooldown: 3 };
export default async function (m, ctx) {
  const key = sessionKey(m);
  const aktif = getSession(key);
  if (aktif) return ctx.reply(`⚠️ Kamu masih punya permainan aktif (${aktif.type}). Jawab dulu dengan *.jawab <jawaban>*, atau tunggu sesinya kedaluwarsa.`);
  const answer = 1 + Math.floor(Math.random() * 100);
  setSession(key, { type: 'angka', answer, tries: 5, reward: 50 });
  await ctx.reply(`🔢 *Tebak Angka*\n\nAku sudah memilih angka rahasia antara *1 sampai 100*.\nKamu punya *5 kesempatan* untuk menebaknya.\nSetiap tebakan salah akan kuberi petunjuk lebih besar/lebih kecil.\n\nJawab dengan: *.jawab <angka>*\nContoh: *.jawab 42*\n\n🎁 Hadiah bila benar: *50 saldo*. Semoga beruntung!`);
}
