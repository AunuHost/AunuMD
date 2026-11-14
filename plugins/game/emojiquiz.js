// AunuMD • Tebak frasa dari rangkaian emoji, hadiah 40 saldo
import { setSession, getSession, sessionKey } from '../../src/game-session.js';
const KUIS_EMOJI = [
  { emoji: '🌧️ 💰', jawab: 'hujan uang' },
  { emoji: '☀️ 🌻', jawab: 'bunga matahari' },
  { emoji: '👁️ 🐅', jawab: 'mata harimau' },
  { emoji: '🦶 🐘', jawab: 'kaki gajah' },
  { emoji: '❤️ 💔', jawab: 'patah hati' },
  { emoji: '🐜 🔥', jawab: 'semut api' },
  { emoji: '🍚 🍗', jawab: 'nasi ayam' },
  { emoji: '🥛 🐄', jawab: 'susu sapi' },
  { emoji: '⚽ 🏆', jawab: 'piala dunia' },
  { emoji: '🌋 🔥', jawab: 'gunung berapi' },
  { emoji: '⛈️ ⚡', jawab: 'badai petir' },
  { emoji: '🎂 🎈', jawab: 'ulang tahun' },
  { emoji: '👰 💍', jawab: 'pernikahan' },
  { emoji: '📚 ✏️', jawab: 'alat tulis' },
  { emoji: '🎸 🎤', jawab: 'konser musik' },
  { emoji: '🐝 🍯', jawab: 'madu lebah' },
  { emoji: '🌙 ⭐', jawab: 'bulan bintang' },
  { emoji: '🚗 💨', jawab: 'mobil balap' }
];
export const config = { name: 'emojiquiz', alias: ['tebakemoji'], category: 'game', description: 'Tebak frasa dari rangkaian emoji, 3 kesempatan, hadiah 40 saldo', usage: '.emojiquiz', isOwner: false, isGroup: false, isPrivate: false, cooldown: 3 };
export default async function (m, ctx) {
  const key = sessionKey(m);
  const aktif = getSession(key);
  if (aktif) return ctx.reply(`⚠️ Kamu masih punya permainan aktif (${aktif.type}). Jawab dulu dengan *.jawab <jawaban>*, atau tunggu sesinya kedaluwarsa.`);
  const q = KUIS_EMOJI[Math.floor(Math.random() * KUIS_EMOJI.length)];
  setSession(key, { type: 'emoji', answer: q.jawab, tries: 3, reward: 40 });
  await ctx.reply(`🎲 *Tebak Emoji*\n\nFrasa apa yang digambarkan emoji ini?\n\n${q.emoji}\n\nJawab dengan: *.jawab <frasa>*\n❤️ Kesempatan: *3* | 🎁 Hadiah: *40 saldo*`);
}
