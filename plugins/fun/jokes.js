// AunuMD • Lelucon receh acak ala bapak-bapak (sopan)
export const config = { name: 'jokes', alias: ['joke', 'lawak'], category: 'fun', description: 'Lelucon receh acak ala bapak-bapak', usage: '.jokes', isOwner: false, isGroup: false, isPrivate: false, cooldown: 3 };

const JOKES = [
  'Kenapa ayam kalau berkokok matanya merem? Karena sudah hafal teksnya.',
  'Hewan apa yang paling sederhana? Ala kadal-nya.',
  'Kenapa Superman bajunya ada huruf S? Kalau M atau L, kegedean.',
  'Sayur apa yang bisa nyanyi? Kol-play.',
  'Kenapa pohon kelapa di depan rumah harus ditebang? Soalnya kalau dicabut berat.',
  'Ikan apa yang bisa terbang? Ikan lele-lawar.',
  'Apa bedanya sarung dan kotak? Kalau sarung bisa buat salat, kalau kotak buat sarung… eh kebalik.',
  'Kenapa kuda tidak pernah pakai sepatu? Karena kakinya sudah sepatu-an dari sananya.',
  'Buah apa yang paling romantis? Buah hati.',
  'Kenapa dokter kalau operasi pakai masker? Kalau pakai topeng, nanti dikira pahlawan bertopeng.',
  'Apa bahasa Jepangnya "saya lapar"? Takana si kuda.',
  'Hewan apa yang bersaudara? Katak beradik.',
  'Kenapa tukang bakso sering bawa mangkok? Kalau bawa piring, nanti dikira prasmanan.',
  'Burung apa yang bisa angkat barbel? Burung perkasa… tetap saja tidak bisa, ini jokes receh.',
  'Apa bedanya kamu sama modem? Modem terhubung ke internet, kamu terhubung ke hatiku.',
  'Kenapa sepeda tidak bisa berdiri sendiri? Karena dia two-tired (terlalu lelah).',
  'Sayur apa yang jago akting? Terong-terongan… maksudnya terong yang drama.',
  'Kenapa jam kalau dilihat terus malah bikin grogi? Karena dia punya banyak tangan… eh jarum.',
  'Kota apa yang selalu sedih? Kota Malang, namanya saja sudah malang.',
  'Apa yang punya leher tapi tidak punya kepala? Botol.',
  'Kenapa air laut asin? Karena ikannya berkeringat habis berenang terus.',
  'Pintu apa yang didorong 10 orang tidak bisa terbuka? Pintu yang ada tulisan "TARIK".'
];

export default async function (m, ctx) {
  const j = JOKES[Math.floor(Math.random() * JOKES.length)];
  return ctx.reply(`😂 *Jokes receh:*\n\n${j}`);
}
