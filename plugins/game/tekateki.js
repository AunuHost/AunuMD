// AunuMD • Teka-teki klasik dengan jawaban singkat, hadiah 40 saldo
import { setSession, getSession, sessionKey } from '../../src/game-session.js';
const TEKI = [
  { soal: 'Aku punya kota tapi tak punya rumah, punya hutan tapi tak punya pohon, punya sungai tapi tak punya air. Apakah aku?', jawab: 'peta' },
  { soal: 'Semakin banyak diambil, aku semakin besar. Apakah aku?', jawab: 'lubang' },
  { soal: 'Aku selalu datang, tapi tak pernah benar-benar tiba. Apakah aku?', jawab: 'hari esok' },
  { soal: 'Aku bisa berlari tapi tak pernah berjalan, punya mulut tapi tak pernah bicara, punya tempat tidur tapi tak pernah tidur. Apakah aku?', jawab: 'sungai' },
  { soal: 'Aku ringan seperti bulu, tapi orang terkuat pun tak bisa menahanku lama. Apakah aku?', jawab: 'napas' },
  { soal: 'Semakin kering keadaan, semakin basah aku. Apakah aku?', jawab: 'handuk' },
  { soal: 'Aku punya leher, tapi tak punya kepala. Apakah aku?', jawab: 'botol' },
  { soal: 'Apa yang selalu naik tapi tak pernah turun?', jawab: 'umur' },
  { soal: 'Aku punya banyak kunci, tapi tak bisa membuka satu pintu pun. Apakah aku?', jawab: 'piano' },
  { soal: 'Huruf apa yang ada di tengah-tengah kata "air"?', jawab: 'huruf i' },
  { soal: 'Aku selalu berada di depanmu, tapi tak pernah bisa kamu lihat. Apakah aku?', jawab: 'masa depan' },
  { soal: 'Aku bisa dipegang dan ditepati, tapi tak bisa disentuh. Apakah aku?', jawab: 'janji' },
  { soal: 'Semakin banyak kamu beri aku makan, semakin lapar aku. Beri aku minum, aku mati. Apakah aku?', jawab: 'api' },
  { soal: 'Aku punya mata, tapi tak bisa melihat. Apakah aku?', jawab: 'jarum' },
  { soal: 'Aku terbang tanpa sayap dan menangis tanpa mata. Apakah aku?', jawab: 'awan' },
  { soal: 'Aku punya banyak gigi, tapi tak pernah menggigit. Apakah aku?', jawab: 'sisir' },
  { soal: 'Aku penuh lubang, tapi tetap bisa menahan air. Apakah aku?', jawab: 'spons' }
];
export const config = { name: 'tekateki', alias: ['teka'], category: 'game', description: 'Teka-teki klasik, 3 kesempatan, hadiah 40 saldo', usage: '.tekateki', isOwner: false, isGroup: false, isPrivate: false, cooldown: 3 };
export default async function (m, ctx) {
  const key = sessionKey(m);
  const aktif = getSession(key);
  if (aktif) return ctx.reply(`⚠️ Kamu masih punya permainan aktif (${aktif.type}). Jawab dulu dengan *.jawab <jawaban>*, atau tunggu sesinya kedaluwarsa.`);
  const t = TEKI[Math.floor(Math.random() * TEKI.length)];
  setSession(key, { type: 'teka', answer: t.jawab, tries: 3, reward: 40 });
  await ctx.reply(`🧩 *Teka-Teki*\n\n${t.soal}\n\nJawab dengan: *.jawab <jawaban>*\n❤️ Kesempatan: *3* | 🎁 Hadiah: *40 saldo*`);
}
