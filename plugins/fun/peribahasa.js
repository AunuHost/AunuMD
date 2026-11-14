// AunuMD • Peribahasa Indonesia + artinya, bisa dicari dengan kata kunci
export const config = { name: 'peribahasa', alias: [], category: 'fun', description: 'Peribahasa Indonesia acak + artinya (bisa filter kata kunci)', usage: '.peribahasa [kata kunci]', isOwner: false, isGroup: false, isPrivate: false, cooldown: 3 };

const DATA = [
  { p: 'Ada gula ada semut', a: 'Di mana ada kesenangan atau keuntungan, di situ banyak orang datang.' },
  { p: 'Air beriak tanda tak dalam', a: 'Orang yang banyak bicara biasanya ilmunya dangkal.' },
  { p: 'Berat sama dipikul, ringan sama dijinjing', a: 'Pekerjaan akan terasa ringan jika dikerjakan bersama-sama.' },
  { p: 'Besar pasak daripada tiang', a: 'Pengeluaran lebih besar daripada penghasilan.' },
  { p: 'Di mana bumi dipijak, di situ langit dijunjung', a: 'Kita harus menghormati adat dan aturan tempat kita berada.' },
  { p: 'Hemat pangkal kaya', a: 'Orang yang suka menabung dan tidak boros akan hidup berkecukupan.' },
  { p: 'Kacang lupa akan kulitnya', a: 'Orang yang lupa diri dan asal-usulnya setelah sukses.' },
  { p: 'Malas pangkal pandir', a: 'Kemalasan membuat seseorang menjadi bodoh.' },
  { p: 'Rajin pangkal pandai', a: 'Orang yang rajin belajar akan menjadi pandai.' },
  { p: 'Sambil menyelam minum air', a: 'Melakukan dua pekerjaan dalam satu waktu.' },
  { p: 'Sedikit demi sedikit, lama-lama menjadi bukit', a: 'Usaha kecil yang tekun lama-lama menghasilkan sesuatu yang besar.' },
  { p: 'Sepandai-pandai tupai melompat, akhirnya jatuh juga', a: 'Sehebat apa pun seseorang, suatu saat bisa berbuat salah.' },
  { p: 'Tak ada gading yang tak retak', a: 'Tidak ada sesuatu yang sempurna di dunia ini.' },
  { p: 'Tong kosong nyaring bunyinya', a: 'Orang yang banyak bicara tetapi tidak berilmu.' },
  { p: 'Habis manis sepah dibuang', a: 'Setelah tidak berguna lagi, seseorang ditinggalkan begitu saja.' },
  { p: 'Sekali merengkuh dayung, dua tiga pulau terlampaui', a: 'Sekali melakukan pekerjaan, beberapa maksud sekaligus tercapai.' }
];

export default async function (m, ctx) {
  const kunci = ctx.text.trim().toLowerCase();
  let daftar = DATA;
  if (kunci) {
    daftar = DATA.filter((d) => d.p.includes(kunci) || d.p.toLowerCase().includes(kunci) || d.a.toLowerCase().includes(kunci));
    if (!daftar.length) return ctx.reply(`Tidak ada peribahasa yang cocok dengan kata kunci "${ctx.text}". Coba kata lain, atau pakai .peribahasa tanpa kata kunci.`);
  }
  const acak = [...daftar].sort(() => Math.random() - 0.5).slice(0, kunci ? 3 : 1);
  const isi = acak.map((d) => `📖 *${d.p}*\n💡 Artinya: ${d.a}`).join('\n\n');
  return ctx.reply(isi);
}
