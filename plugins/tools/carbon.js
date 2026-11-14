// AunuMD • Gambar kode gaya Carbon (carbon.now.sh + screenshot microlink)
import { getBuffer } from '../../src/helper.js';

export const config = {
  name: 'carbon',
  alias: ['carbonize'],
  category: 'tools',
  description: 'Buat gambar kode program bergaya Carbon dari teks kode',
  usage: '.carbon <kode> (atau reply pesan berisi kode)',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 10
};

export default async function (m, ctx) {
  const code = (ctx.text || m.quoted?.text || '').trim();
  if (!code) return ctx.reply('Pemakaian: ' + config.usage);
  try {
    await ctx.reply('🎨 Membuat gambar Carbon...');
    const carbonUrl = `https://carbon.now.sh/?code=${encodeURIComponent(code)}&theme=seti&language=auto`;
    const params = new URLSearchParams({
      url: carbonUrl,
      screenshot: 'true',
      meta: 'false',
      'screenshot.element': '.export-container'
    });
    const res = await fetch(`https://api.microlink.io?${params.toString()}`, { signal: AbortSignal.timeout(60000) });
    const json = await res.json().catch(() => null);
    const shotUrl = json?.data?.screenshot?.url;
    if (!shotUrl) throw new Error('Microlink tidak mengembalikan screenshot.');
    const img = await getBuffer(shotUrl);
    return ctx.sock.sendMessage(m.chat, { image: img, caption: '🎨 Carbon — dibuat oleh AunuMD' }, { quoted: m.raw });
  } catch (e) {
    return ctx.reply('Error carbon: ' + e.message);
  }
}
