// AunuMD • Tarian anime acak
export const config = { name: 'dance', alias: [], category: 'random', description: 'Mengirim gambar tarian anime', usage: '.dance', isOwner: false, isGroup: false, isPrivate: false, cooldown: 4 };
export default async function (m, ctx) {
  try {
    const res = await fetch('https://nekos.life/api/v2/img/dance', { signal: AbortSignal.timeout(20000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const j = await res.json();
    const gambar = j.url;
    if (!gambar) throw new Error('Gambar tidak ditemukan.');
    const caption = '💃 Ayo menari!';
    await ctx.sock.sendMessage(m.chat, { image: { url: gambar }, caption }, { quoted: m.raw });
  } catch (e) {
    await ctx.reply('Error: ' + e.message);
  }
}
