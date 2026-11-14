// AunuMD • Fakta golongan darah: karakteristik, donor, dan penerima
export const config = { name: 'goldar', alias: [], category: 'cek', description: 'Fakta dan karakteristik golongan darah', usage: '.goldar <A|B|AB|O>', isOwner: false, isGroup: false, isPrivate: false, cooldown: 3 };
const DATA = {
  A: {
    label: 'A',
    karakteristik: 'Teratur, perfeksionis, dan bertanggung jawab. Orang bergolongan darah A cenderung tenang, teliti, dan bisa dipercaya, meski kadang terlalu memikirkan hal kecil.',
    donor: 'Bisa donor ke: A dan AB.',
    terima: 'Bisa menerima dari: A dan O.'
  },
  B: {
    label: 'B',
    karakteristik: 'Kreatif, fleksibel, dan mandiri. Orang bergolongan darah B punya pendirian sendiri, santai, dan tidak suka diatur — tapi sangat setia pada orang terdekat.',
    donor: 'Bisa donor ke: B dan AB.',
    terima: 'Bisa menerima dari: B dan O.'
  },
  AB: {
    label: 'AB',
    karakteristik: 'Rasional, unik, dan sulit ditebak. Orang bergolongan darah AB memadukan sifat A dan B: analitis sekaligus kreatif, dan punya cara pandang yang berbeda dari kebanyakan orang.',
    donor: 'Bisa donor ke: AB saja (sesama golongan langka).',
    terima: 'Bisa menerima dari: SEMUA golongan (A, B, AB, O) — penerima universal untuk plasma/sel darah merah dengan catatan Rh.'
  },
  O: {
    label: 'O',
    karakteristik: 'Optimis, berjiwa pemimpin, dan murah hati. Orang bergolongan darah O energik, mudah bergaul, dan kompetitif — tidak heran golongan ini paling banyak dicari untuk donor.',
    donor: 'Bisa donor ke: SEMUA golongan (A, B, AB, O) — donor universal, terutama O negatif.',
    terima: 'Bisa menerima dari: O saja.'
  }
};
export default async function (m, ctx) {
  const { reply, args } = ctx;
  const mentah = (args[0] || '').toUpperCase().trim();
  const cocok = mentah.match(/^(AB|A|B|O)([+-])?$/);
  if (!cocok) {
    await reply(`🩸 Pemakaian: *${ctx.prefix}goldar <A|B|AB|O>* (boleh tambah + atau -)\nContoh: ${ctx.prefix}goldar O atau ${ctx.prefix}goldar AB+`);
    return;
  }
  const d = DATA[cocok[1]];
  const rhesus = cocok[2] ? `\n🧬 Rhesus: *${cocok[2] === '+' ? 'Positif (+)' : 'Negatif (−)'}*${cocok[2] === '-' ? ' — termasuk langka, donor Rh− sangat berharga!' : ''}` : '';
  await reply(
    `🩸 *GOLONGAN DARAH ${d.label}${cocok[2] || ''}* 🩸\n\n` +
    `🔮 Karakteristik umum:\n${d.karakteristik}\n\n` +
    `💉 ${d.donor}\n💉 ${d.terima}${rhesus}\n\n` +
    `_Info ringkas untuk edukasi — untuk keperluan medis (transfusi), selalu ikuti hasil tes dan arahan petugas PMI/rumah sakit. Karakteristik kepribadian hanya hiburan populer._`
  );
}
