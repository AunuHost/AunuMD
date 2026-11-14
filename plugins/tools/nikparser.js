// AunuMD • dekode format NIK lokal: provinsi, tanggal lahir, gender, nomor urut
export const config = {
  name: 'nikparser',
  alias: ['parsenik', 'ceknik'],
  category: 'tools',
  description: 'Dekode format NIK (provinsi, tanggal lahir, gender) secara lokal',
  usage: '.nikparser <16 digit NIK>',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 3
};

// Kode provinsi 2 digit pertama NIK (Kemendagri).
const PROVINSI = {
  '11': 'Aceh', '12': 'Sumatera Utara', '13': 'Sumatera Barat', '14': 'Riau',
  '15': 'Jambi', '16': 'Sumatera Selatan', '17': 'Bengkulu', '18': 'Lampung',
  '19': 'Kepulauan Bangka Belitung', '21': 'Kepulauan Riau',
  '31': 'DKI Jakarta', '32': 'Jawa Barat', '33': 'Jawa Tengah', '34': 'DI Yogyakarta',
  '35': 'Jawa Timur', '36': 'Banten', '51': 'Bali', '52': 'Nusa Tenggara Barat',
  '53': 'Nusa Tenggara Timur', '61': 'Kalimantan Barat', '62': 'Kalimantan Tengah',
  '63': 'Kalimantan Selatan', '64': 'Kalimantan Timur', '65': 'Kalimantan Utara',
  '71': 'Sulawesi Utara', '72': 'Sulawesi Tengah', '73': 'Sulawesi Selatan',
  '74': 'Sulawesi Tenggara', '75': 'Gorontalo', '76': 'Sulawesi Barat',
  '81': 'Maluku', '82': 'Maluku Utara', '91': 'Papua Barat', '92': 'Papua',
  '93': 'Papua Selatan', '94': 'Papua Tengah', '95': 'Papua Pegunungan',
  '96': 'Papua Barat Daya'
};

const BULAN = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

export default async function (m, ctx) {
  const nik = (ctx.args[0] || '').replace(/\D/g, '');
  if (!/^\d{16}$/.test(nik)) {
    await ctx.reply(`❌ NIK harus tepat 16 digit angka.\nPemakaian: ${config.usage}`);
    return;
  }

  const prov = nik.slice(0, 2);
  const kab = nik.slice(2, 4);
  const kec = nik.slice(4, 6);
  const tglRaw = parseInt(nik.slice(6, 8), 10);
  const bln = parseInt(nik.slice(8, 10), 10);
  const thn2 = parseInt(nik.slice(10, 12), 10);
  const urut = nik.slice(12, 16);

  const perempuan = tglRaw > 40;
  const tgl = perempuan ? tglRaw - 40 : tglRaw;

  // Patokan tahun berjalan: yy <= tahun 2 digit sekarang -> 20yy, selain itu 19yy.
  const nowYY = new Date().getFullYear() % 100;
  const thn = thn2 <= nowYY ? 2000 + thn2 : 1900 + thn2;

  if (!PROVINSI[prov]) { await ctx.reply(`❌ Kode provinsi *${prov}* tidak dikenal.`); return; }
  if (bln < 1 || bln > 12 || tgl < 1 || tgl > 31) { await ctx.reply('❌ Bagian tanggal lahir pada NIK tidak masuk akal.'); return; }
  const d = new Date(thn, bln - 1, tgl);
  if (d.getFullYear() !== thn || d.getMonth() !== bln - 1 || d.getDate() !== tgl) {
    await ctx.reply('❌ Tanggal lahir hasil dekode bukan tanggal yang valid.');
    return;
  }

  const now = new Date();
  let umur = now.getFullYear() - thn;
  if (now < new Date(now.getFullYear(), bln - 1, tgl)) umur--;

  await ctx.reply(
    `🪪 *HASIL DEKODE NIK*\n\n` +
    `• Provinsi: *${PROVINSI[prov]}* (kode ${prov})\n` +
    `• Kode Kab/Kota: *${kab}*\n` +
    `• Kode Kecamatan: *${kec}*\n` +
    `• Tanggal Lahir: *${tgl} ${BULAN[bln - 1]} ${thn}*\n` +
    `• Jenis Kelamin: *${perempuan ? 'Perempuan' : 'Laki-laki'}*\n` +
    `• Perkiraan Umur: *${umur} tahun*\n` +
    `• Nomor Urut: *${urut}*\n\n` +
    `_Catatan: ini hanya dekode format NIK secara lokal, bukan data penduduk asli dari Dukcapil._`
  );
}
