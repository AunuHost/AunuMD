// AunuMD • Analisis arti nama playful dan deterministik (murni hiburan)
export const config = { name: 'artinama', alias: [], category: 'cek', description: 'Analisis makna nama dari huruf dan strukturnya', usage: '.artinama [nama]', isOwner: false, isGroup: false, isPrivate: false, cooldown: 3 };
const HURUF_PERTAMA = [
  { huruf: 'ABC', makna: 'Awal namamu memancarkan jiwa pemimpin dan keberanian memulai hal baru.' },
  { huruf: 'DEF', makna: 'Awal namamu melambangkan keteguhan dan daya tahan — kamu tidak mudah goyah.' },
  { huruf: 'GHI', makna: 'Awal namamu membawa keceriaan dan rasa ingin tahu yang besar terhadap dunia.' },
  { huruf: 'JKL', makna: 'Awal namamu menunjukkan keadilan dan keberuntungan yang menyertai langkahmu.' },
  { huruf: 'MNO', makna: 'Awal namamu memancarkan ketulusan, kesetiaan, dan hati yang hangat.' },
  { huruf: 'PQR', makna: 'Awal namamu melambangkan kecerdasan praktis dan kemampuan memecahkan masalah.' },
  { huruf: 'STU', makna: 'Awal namamu membawa kekuatan, kesuksesan, dan semangat yang menyala-nyala.' },
  { huruf: 'VWXYZ', makna: 'Awal namamu menunjukkan keunikan dan keberanian tampil beda dari yang lain.' }
];
export default async function (m, ctx) {
  const { reply, text } = ctx;
  const nama = ((text || '').trim() || m.pushName || '').trim();
  if (!nama) {
    await reply(`✍️ Pemakaian: *${ctx.prefix}artinama <nama>*\nContoh: ${ctx.prefix}artinama Aunu`);
    return;
  }
  const bersih = nama.replace(/[^a-zA-Z\s]/g, '').trim();
  const huruf = bersih.replace(/\s/g, '');
  if (!huruf) {
    await reply('❌ Nama harus mengandung huruf ya. Coba nama lain.');
    return;
  }
  const pertama = huruf[0].toUpperCase();
  const maknaHuruf = (HURUF_PERTAMA.find((h) => h.huruf.includes(pertama)) || HURUF_PERTAMA[0]).makna;
  let kategoriPanjang;
  if (huruf.length <= 4) kategoriPanjang = 'Nama yang singkat dan padat — pemiliknya biasanya tegas, simpel, dan tidak suka bertele-tele.';
  else if (huruf.length <= 7) kategoriPanjang = 'Panjang nama yang seimbang — pemiliknya fleksibel, mudah bergaul, dan pandai menempatkan diri.';
  else if (huruf.length <= 11) kategoriPanjang = 'Nama yang cukup panjang — pemiliknya detail, punya banyak sisi menarik, dan berkesan mendalam.';
  else kategoriPanjang = 'Nama yang panjang dan megah — pemiliknya berkarakter kuat dan gampang diingat banyak orang.';
  const vokal = huruf.toLowerCase().split('').filter((c) => 'aiueo'.includes(c));
  const hitung = {};
  vokal.forEach((v) => { hitung[v] = (hitung[v] || 0) + 1; });
  const dominan = Object.keys(hitung).sort((a, b) => hitung[b] - hitung[a])[0] || 'a';
  const maknaVokal = {
    a: 'Vokal "A" dominan: semangat dan ambisi menyala dalam dirimu.',
    i: 'Vokal "I" dominan: kecerdasan dan ketajaman intuisi adalah kekuatanmu.',
    u: 'Vokal "U" dominan: ketenangan dan keteguhan hati mewarnai langkahmu.',
    e: 'Vokal "E" dominan: kepekaan dan empati membuatmu disukai banyak orang.',
    o: 'Vokal "O" dominan: optimisme dan keberuntungan sering berpihak padamu.'
  }[dominan];
  await reply(
    `✍️ *ARTI NAMA: ${nama.toUpperCase()}* ✍️\n\n` +
    `🔤 Huruf pertama "${pertama}": ${maknaHuruf}\n\n` +
    `📏 Jumlah huruf: ${huruf.length} huruf.\n${kategoriPanjang}\n\n` +
    `🗣️ ${maknaVokal}\n\n` +
    `⚠️ _Analisis ini murni hiburan berbasis pola huruf, bukan ramalan sungguhan._`
  );
}
