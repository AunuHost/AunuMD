// AunuMD • DNS lookup + WHOIS domain via hackertarget.com
export const config = {
  name: 'lookup',
  alias: ['dns'],
  category: 'tools',
  description: 'Lihat rekaman DNS sebuah domain (dan WHOIS bila kuota hackertarget tersedia)',
  usage: '.lookup <domain>',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 5
};

export default async function (m, ctx) {
  let domain = (ctx.args[0] || '').trim().toLowerCase();
  domain = domain.replace(/^https?:\/\//, '').split('/')[0].split(':')[0];
  if (!domain || !domain.includes('.')) return ctx.reply('Pemakaian: ' + config.usage + '\nContoh: .lookup google.com');
  try {
    const [dnsRes, whoisRes] = await Promise.all([
      fetch(`https://api.hackertarget.com/dnslookup/?q=${encodeURIComponent(domain)}`, { signal: AbortSignal.timeout(20000) }),
      fetch(`https://api.hackertarget.com/whois/?q=${encodeURIComponent(domain)}`, { signal: AbortSignal.timeout(20000) }).catch(() => null)
    ]);
    const dns = (await dnsRes.text()).trim();
    if (!dns || /^error/i.test(dns)) return ctx.reply(`❌ DNS lookup gagal untuk ${domain}: ${dns || 'tidak ada respons.'}`);
    let out = `🔎 *DNS Lookup — ${domain}*\n\n${dns.slice(0, 3000)}`;
    if (whoisRes?.ok) {
      const whois = (await whoisRes.text()).trim();
      // Respons kuota habis dari hackertarget pendek; hanya tampilkan WHOIS yang benar-benar berisi data.
      if (whois.length > 80) out += `\n\n📋 *WHOIS — ${domain}*\n\n${whois.slice(0, 1200)}`;
    }
    return ctx.reply(out);
  } catch (e) {
    return ctx.reply('Error lookup: ' + e.message);
  }
}
