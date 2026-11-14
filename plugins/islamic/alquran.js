// AunuMD • info surah Al-Qur'an + 3 ayat pertama (equran.id).
export const config = {
  name: 'alquran',
  alias: ['surah'],
  category: 'islamic',
  description: 'Info surah Al-Qur\'an dan 3 ayat pertamanya',
  usage: '.alquran <nomor 1-114>',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 5
};

export default async function (m, ctx) {
  const n = parseInt((ctx.args || [])[0], 10);
  if (!n || n < 1 || n > 114) {
    await ctx.reply(`Pemakaian: ${config.usage}\nContoh: .alquran 36 (Ya Sin)`);
    return;
  }
  try {
    const res = await fetch(`https://equran.id/api/v2/surat/${n}`, { signal: AbortSignal.timeout(20000) });
    if (!res.ok) throw new Error(`HTTP ${res.status} dari equran.id`);
    const { data } = await res.json();
    if (!data) throw new Error('Data surah tidak ditemukan.');
    let teks =
      `📖 *Surah ${data.namaLatin} (${data.nama})*\n` +
      `Surah ke-${data.nomor} • ${data.jumlahAyat} ayat • ${data.tempatTurun}\n` +
      `Arti: ${data.arti}\n`;
    if (data.deskripsi) teks += `\n${String(data.deskripsi).slice(0, 280)}${String(data.deskripsi).length > 280 ? '…' : ''}\n`;
    teks += `\n*3 ayat pertama:*\n`;
    for (const a of (data.ayat || []).slice(0, 3)) {
      teks += `\n${a.nomorAyat}. ${a.teksArab}\n_${a.teksIndonesia}_\n`;
    }
    const audio = data.audioFull?.['05'];
    if (audio) teks += `\n🔊 Audio full surah: ${audio}`;
    teks += `\n\n_Sumber: equran.id_`;
    await ctx.reply(teks);
  } catch (e) { await ctx.reply(`❌ Error: ${e.message}`); }
}
