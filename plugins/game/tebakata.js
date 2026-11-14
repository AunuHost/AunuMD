// AunuMD • Tebak kata dari huruf yang diacak, hadiah 40 saldo
import { setSession, getSession, sessionKey } from '../../src/game-session.js';
const KATA = [
  'apel', 'buku', 'meja', 'kursi', 'rumah', 'pintu', 'kucing', 'anjing', 'burung', 'ikan',
  'bunga', 'pohon', 'gunung', 'sungai', 'laut', 'pantai', 'bulan', 'bintang', 'sekolah', 'pensil',
  'kertas', 'gunting', 'sepeda', 'mobil', 'kereta', 'pesawat', 'roti', 'susu', 'kopi', 'nasi',
  'telur', 'garam', 'gula', 'pasar', 'jalan', 'taman', 'lampu', 'kunci', 'hujan', 'angin'
];
function acakHuruf(kata) {
  const huruf = kata.split('');
  for (let i = huruf.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [huruf[i], huruf[j]] = [huruf[j], huruf[i]];
  }
  return huruf.join('');
}
export const config = { name: 'tebakata', alias: [], category: 'game', description: 'Tebak kata benda dari huruf acak, 3 kesempatan, hadiah 40 saldo', usage: '.tebakata', isOwner: false, isGroup: false, isPrivate: false, cooldown: 3 };
export default async function (m, ctx) {
  const key = sessionKey(m);
  const aktif = getSession(key);
  if (aktif) return ctx.reply(`⚠️ Kamu masih punya permainan aktif (${aktif.type}). Jawab dulu dengan *.jawab <jawaban>*, atau tunggu sesinya kedaluwarsa.`);
  const kata = KATA[Math.floor(Math.random() * KATA.length)];
  let acak = acakHuruf(kata);
  let percobaan = 0;
  while (acak === kata && percobaan < 20) { acak = acakHuruf(kata); percobaan++; }
  if (acak === kata) {
    const h = kata.split('');
    const i = h.findIndex((c, idx) => idx > 0 && c !== h[0]);
    [h[0], h[i]] = [h[i], h[0]];
    acak = h.join('');
  }
  setSession(key, { type: 'kata', answer: kata, tries: 3, reward: 40 });
  await ctx.reply(`🔤 *Tebak Kata*\n\nSusunlah huruf acak ini menjadi kata benda yang benar:\n\n*${acak.toUpperCase().split('').join(' ')}*\n\nJawab dengan: *.jawab <kata>*\n❤️ Kesempatan: *3* | 🎁 Hadiah: *40 saldo*`);
}
