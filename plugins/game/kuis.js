// AunuMD • Kuis matematika acak dengan 3 kesempatan, hadiah 30 saldo
import { setSession, getSession, sessionKey } from '../../src/game-session.js';
function rand(min, max) { return min + Math.floor(Math.random() * (max - min + 1)); }
function buatSoal() {
  const level = rand(1, 3);
  const op = ['+', '-', '×', '÷'][Math.floor(Math.random() * 4)];
  let a, b, hasil;
  if (op === '+') {
    if (level === 1) { a = rand(5, 30); b = rand(5, 30); }
    else if (level === 2) { a = rand(25, 150); b = rand(25, 150); }
    else { a = rand(100, 900); b = rand(100, 900); }
    hasil = a + b;
  } else if (op === '-') {
    if (level === 1) { a = rand(10, 40); b = rand(5, a); }
    else if (level === 2) { a = rand(50, 200); b = rand(20, a); }
    else { a = rand(200, 999); b = rand(50, a); }
    hasil = a - b;
  } else if (op === '×') {
    if (level === 1) { a = rand(2, 9); b = rand(2, 9); }
    else if (level === 2) { a = rand(3, 12); b = rand(3, 12); }
    else { a = rand(6, 25); b = rand(4, 19); }
    hasil = a * b;
  } else {
    if (level === 1) { b = rand(2, 9); hasil = rand(2, 9); }
    else if (level === 2) { b = rand(3, 12); hasil = rand(3, 15); }
    else { b = rand(6, 19); hasil = rand(6, 25); }
    a = b * hasil;
  }
  return { level, teks: `${a} ${op} ${b}`, hasil };
}
export const config = { name: 'kuis', alias: ['kuismath'], category: 'game', description: 'Kuis matematika acak, 3 kesempatan, hadiah 30 saldo', usage: '.kuis', isOwner: false, isGroup: false, isPrivate: false, cooldown: 3 };
export default async function (m, ctx) {
  const key = sessionKey(m);
  const aktif = getSession(key);
  if (aktif) return ctx.reply(`⚠️ Kamu masih punya permainan aktif (${aktif.type}). Jawab dulu dengan *.jawab <jawaban>*, atau tunggu sesinya kedaluwarsa.`);
  const soal = buatSoal();
  setSession(key, { type: 'kuis', answer: String(soal.hasil), tries: 3, reward: 30 });
  await ctx.reply(`🧮 *Kuis Matematika — Level ${soal.level}*\n\nBerapakah hasil dari:\n\n*${soal.teks} = ?*\n\nJawab dengan: *.jawab <angka>*\n❤️ Kesempatan: *3* | 🎁 Hadiah: *30 saldo*`);
}
