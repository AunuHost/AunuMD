// AunuMD • Enam nomor hoki deterministik dari nama + tanggal hari ini
export const config = { name: 'nomerhoki', alias: ['nomorhoki'], category: 'cek', description: 'Dapatkan 6 nomor hoki hari ini', usage: '.nomerhoki', isOwner: false, isGroup: false, isPrivate: false, cooldown: 3 };
function hashStr(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h;
}
export default async function (m, ctx) {
  const { reply } = ctx;
  const nama = (m.pushName || 'Pengguna').toLowerCase();
  const kini = new Date();
  const tglStr = `${kini.getFullYear()}-${String(kini.getMonth() + 1).padStart(2, '0')}-${String(kini.getDate()).padStart(2, '0')}`;
  let seed = hashStr(nama + '|hoki|' + tglStr);
  const angka = new Set();
  let putaran = 0;
  while (angka.size < 6) {
    seed = hashStr(seed.toString() + '|' + nama + '|' + putaran);
    angka.add(seed % 100);
    putaran++;
  }
  const hasil = [...angka].sort((a, b) => a - b);
  await reply(
    `🎰 *NOMOR HOKI HARI INI* 🎰\n\n` +
    `👤 ${m.pushName || 'Pengguna'}\n` +
    `📅 ${tglStr}\n\n` +
    `🔢 ${hasil.map((n) => `*${String(n).padStart(2, '0')}*`).join('  •  ')}\n\n` +
    `_Nomor ini dihitung dari namamu dan tanggal hari ini — selalu sama sepanjang hari, berubah besok. Buat hiburan saja, bukan jaminan apa-apa!_`
  );
}
