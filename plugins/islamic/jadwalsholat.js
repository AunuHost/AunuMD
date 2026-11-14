// AunuMD • jadwal sholat per kota (MyQuran API).
export const config = {
  name: 'jadwalsholat',
  alias: ['sholat'],
  category: 'islamic',
  description: 'Jadwal sholat hari ini per kota Indonesia',
  usage: '.jadwalsholat <kota>',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 5
};

async function fetchJson(url) {
  const res = await fetch(url, { signal: AbortSignal.timeout(20000) });
  if (!res.ok) throw new Error(`HTTP ${res.status} dari api.myquran.com`);
  return res.json();
}

export default async function (m, ctx) {
  const kota = ctx.text?.trim();
  if (!kota) { await ctx.reply(`Pemakaian: ${config.usage}\nContoh: .jadwalsholat Jakarta`); return; }
  try {
    const cari = await fetchJson(`https://api.myquran.com/v2/sholat/kota/cari/${encodeURIComponent(kota)}`);
    const hasil = cari.data?.[0];
    if (!hasil) { await ctx.reply(`❌ Kota "${kota}" tidak ditemukan di basis data jadwal sholat.`); return; }
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const d = await fetchJson(`https://api.myquran.com/v2/sholat/jadwal/${hasil.id}/${yyyy}/${mm}/${dd}`);
    const j = d.data?.jadwal || d.data || {};
    await ctx.reply(
      `🕌 *Jadwal Sholat — ${hasil.lokasi}*\n` +
      `📅 ${j.tanggal || `${dd}/${mm}/${yyyy}`}\n\n` +
      `🌅 Imsak: ${j.imsak || '-'}\n` +
      `🌄 Subuh: ${j.subuh || '-'}\n` +
      `☀️ Terbit: ${j.terbit || '-'}\n` +
      `🌤️ Dhuha: ${j.dhuha || '-'}\n` +
      `🌞 Dzuhur: ${j.dzuhur || '-'}\n` +
      `🌇 Ashar: ${j.ashar || '-'}\n` +
      `🌆 Maghrib: ${j.maghrib || '-'}\n` +
      `🌙 Isya: ${j.isya || '-'}\n\n` +
      `_Sumber: api.myquran.com_`
    );
  } catch (e) { await ctx.reply(`❌ Error: ${e.message}`); }
}
