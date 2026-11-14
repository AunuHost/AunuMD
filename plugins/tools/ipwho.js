// AunuMD • Lookup IP via ipwho.is (negara, kota, ISP, ASN + lokasi peta)
export const config = {
  name: 'ipwho',
  alias: ['iplookup'],
  category: 'tools',
  description: 'Cek info alamat IP: negara, kota, ISP, ASN, zona waktu, plus kirim titik lokasinya',
  usage: '.ipwho <alamat IP>',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 5
};

function flagEmoji(cc) {
  if (!cc || cc.length !== 2) return '';
  return String.fromCodePoint(...[...cc.toUpperCase()].map((c) => 127397 + c.codePointAt(0)));
}

export default async function (m, ctx) {
  const ip = (ctx.args[0] || '').trim();
  if (!ip) return ctx.reply('Pemakaian: ' + config.usage + '\nContoh: .ipwho 8.8.8.8');
  try {
    const res = await fetch(`https://ipwho.is/${encodeURIComponent(ip)}`, { signal: AbortSignal.timeout(20000) });
    const d = await res.json().catch(() => null);
    if (!d) throw new Error('Respons ipwho.is tidak valid.');
    if (d.success === false) return ctx.reply(`❌ Lookup gagal: ${d.message || 'IP tidak ditemukan.'}`);
    const conn = d.connection || {};
    const lines = [
      '🌐 *IP Lookup*',
      '',
      `IP: ${d.ip || ip}`,
      `Negara: ${flagEmoji(d.country_code)} ${d.country || '-'} (${d.country_code || '-'})`,
      `Region: ${d.region || '-'}`,
      `Kota: ${d.city || '-'}`,
      `ISP: ${conn.isp || d.isp || '-'}`,
      `Organisasi: ${conn.org || '-'}`,
      `ASN: ${conn.asn ? 'AS' + conn.asn : (d.asn || '-')}`,
      `Zona waktu: ${d.timezone?.id || d.timezone || '-'}`
    ];
    await ctx.reply(lines.join('\n'));
    if (typeof d.latitude === 'number' && typeof d.longitude === 'number') {
      await ctx.sock.sendMessage(m.chat, {
        location: { degreesLatitude: d.latitude, degreesLongitude: d.longitude }
      }, { quoted: m.raw });
    }
  } catch (e) {
    return ctx.reply('Error ipwho: ' + e.message);
  }
}
