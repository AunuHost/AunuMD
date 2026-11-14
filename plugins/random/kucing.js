// AunuMD • Gambar kucing acak
export const config = { name: 'kucing', alias: ['meow', 'cat'], category: 'random', description: 'Mengirim gambar kucing acak', usage: '.kucing', isOwner: false, isGroup: false, isPrivate: false, cooldown: 4 };
export default async function (m, ctx) {
  try {
    const res = await fetch('https://nekos.life/api/v2/img/meow', { signal: AbortSignal.timeout(20000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const j = await res.json();
    const gambar = j.url;
    if (!gambar) throw new Error('Gambar tidak ditemukan.');
    const caption = '🐱 Kucing acak untukmu';
    await ctx.sock.sendMessage(m.chat, { image: { url: gambar }, caption }, { quoted: m.raw });
  } catch (e) {
    await ctx.reply('Error: ' + e.message);
  }
}
