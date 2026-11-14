// AunuMD • cek info channel WhatsApp dari link/kode invite (metadata newsletter Baileys)
export const config = {
  name: 'cekidch',
  alias: ['cekchannel', 'idch'],
  category: 'tools',
  description: 'Cek info channel WhatsApp (nama, ID, subscriber, verifikasi) dari link channel',
  usage: '.cekidch <link whatsapp.com/channel/...>',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 5
};

function formatSubs(count) {
  const n = Number(count);
  if (!count || isNaN(n) || n === 0) return '0';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  return String(n);
}

export default async function (m, ctx) {
  const raw = (ctx.text || '').trim();
  if (!raw) { await ctx.reply(`Pemakaian: ${config.usage}`); return; }

  const linkMatch = /whatsapp\.com\/channel\/([A-Za-z0-9_-]+)/i.exec(raw);
  const kode = linkMatch ? linkMatch[1] : (/^[A-Za-z0-9_-]{8,}$/.test(raw) ? raw : null);
  if (!kode) {
    await ctx.reply('❌ Link tidak valid. Pastikan formatnya `https://whatsapp.com/channel/<kode>` atau kirim kode invite-nya saja.');
    return;
  }

  if (typeof ctx.sock.newsletterMetadata !== 'function') {
    await ctx.reply('❌ Library belum mendukung metadata channel dari kode invite.');
    return;
  }

  try {
    await m.react('⏳');
    const meta = await ctx.sock.newsletterMetadata('invite', kode);
    if (!meta?.id) {
      await ctx.reply('❌ Channel tidak ditemukan. Mungkin link sudah kedaluwarsa atau channel telah dihapus.');
      return;
    }
    const name = meta.name?.text || meta.name || meta.state || '—';
    const subs = meta.subscriber_count ?? meta.subscribers ?? meta.subscriberCount;
    const verified = (meta.verification === 'VERIFIED' || meta.verified === true || meta.verification === 'verified')
      ? '✓ Terverifikasi'
      : 'Tidak terverifikasi';
    const descRaw = meta.description?.text || meta.description || '';
    const desc = descRaw ? (descRaw.length > 300 ? descRaw.slice(0, 300) + '...' : descRaw) : '—';

    await ctx.reply(
      `📢 *INFO CHANNEL WHATSAPP*\n\n` +
      `• Nama: *${name}*\n` +
      `• ID Channel: \`${meta.id}\`\n` +
      `• Subscriber: *${formatSubs(subs)}*\n` +
      `• Status: *${verified}*\n\n` +
      `*Deskripsi:*\n${desc}`
    );
  } catch (e) {
    await ctx.reply(`❌ Gagal mengambil metadata channel: ${e.message}`);
  }
}
