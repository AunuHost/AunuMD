// AunuMD • info gempa terkini dari BMKG.
export const config = {
  name: 'gempa',
  alias: ['infogempa'],
  category: 'cek',
  description: 'Gempa bumi terkini di Indonesia (BMKG)',
  usage: '.gempa',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 5
};

export default async function (m, ctx) {
  try {
    const res = await fetch('https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json', { signal: AbortSignal.timeout(20000) });
    if (!res.ok) throw new Error(`HTTP ${res.status} dari data.bmkg.go.id`);
    const data = await res.json();
    const g = data.Infogempa?.gempa || {};
    const ambil = (...keys) => { for (const k of keys) if (g[k] !== undefined) return g[k]; return '-'; };
    await ctx.reply(
      `🌋 *Gempa Terkini — BMKG*\n\n` +
      `📅 ${ambil('Tanggal', 'tanggal')}, ${ambil('Jam', 'jam')}\n` +
      `📊 Magnitudo: *${ambil('Magnitude', 'magnitude')}*\n` +
      `🕳️ Kedalaman: ${ambil('Kedalaman', 'kedalaman')}\n` +
      `📍 Wilayah: ${ambil('Wilayah', 'wilayah')}\n` +
      `🧭 Koordinat: ${ambil('Coordinates', 'coordinates')}\n` +
      `⚠️ Potensi: ${ambil('Potensi', 'potensi')}\n` +
      `👥 Dirasakan: ${ambil('Dirasakan', 'dirasakan')}\n\n` +
      `_Sumber: BMKG (data.bmkg.go.id)_`
    );
  } catch (e) { await ctx.reply(`❌ Error: ${e.message}`); }
}
