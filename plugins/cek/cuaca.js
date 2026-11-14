// AunuMD • cuaca kota dari Open-Meteo (tanpa API key).
export const config = {
  name: 'cuaca',
  alias: [],
  category: 'cek',
  description: 'Cuaca terkini suatu kota (Open-Meteo)',
  usage: '.cuaca <kota>',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 5
};

const WMO = {
  0: 'Cerah', 1: 'Cerah berawan', 2: 'Berawan sebagian', 3: 'Mendung',
  45: 'Kabut', 48: 'Kabut', 51: 'Gerimis', 53: 'Gerimis', 55: 'Gerimis',
  56: 'Gerimis beku', 57: 'Gerimis beku', 61: 'Hujan ringan', 63: 'Hujan sedang',
  65: 'Hujan lebat', 66: 'Hujan beku', 67: 'Hujan beku', 71: 'Salju', 73: 'Salju',
  75: 'Salju', 77: 'Salju', 80: 'Hujan lokal', 81: 'Hujan lokal', 82: 'Hujan lokal',
  85: 'Salju lokal', 86: 'Salju lokal', 95: 'Badai petir',
  96: 'Badai petir + hujan es', 99: 'Badai petir + hujan es'
};

async function fetchJson(url) {
  const res = await fetch(url, { signal: AbortSignal.timeout(20000) });
  if (!res.ok) throw new Error(`HTTP ${res.status} dari ${new URL(url).hostname}`);
  return res.json();
}

export default async function (m, ctx) {
  const kota = ctx.text?.trim();
  if (!kota) { await ctx.reply(`Pemakaian: ${config.usage}\nContoh: .cuaca Jakarta`); return; }
  try {
    const geo = await fetchJson(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(kota)}&count=1&language=id`);
    const loc = geo.results?.[0];
    if (!loc) { await ctx.reply(`❌ Kota "${kota}" tidak ditemukan.`); return; }
    const wx = await fetchJson(`https://api.open-meteo.com/v1/forecast?latitude=${loc.latitude}&longitude=${loc.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`);
    const c = wx.current || {};
    const kondisi = WMO[c.weather_code] ?? 'Tidak diketahui';
    await ctx.reply(
      `🌤️ *Cuaca ${loc.name}*` + (loc.admin1 ? `, ${loc.admin1}` : '') + (loc.country ? ` (${loc.country})` : '') + `\n\n` +
      `🌦️ Kondisi: ${kondisi}\n` +
      `🌡️ Suhu: ${c.temperature_2m}°C\n` +
      `🥵 Terasa seperti: ${c.apparent_temperature}°C\n` +
      `💧 Kelembapan: ${c.relative_humidity_2m}%\n` +
      `💨 Angin: ${c.wind_speed_10m} km/jam\n\n` +
      `_Sumber: Open-Meteo • zona waktu ${loc.timezone || '-'}_`
    );
  } catch (e) { await ctx.reply(`❌ Error: ${e.message}`); }
}
