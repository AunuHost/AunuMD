// AunuMD • Tamparan anime acak
export const config = { name: 'slap', alias: [], category: 'random', description: 'Mengirim gambar tamparan anime', usage: '.slap [@user]', isOwner: false, isGroup: false, isPrivate: false, cooldown: 4 };
export default async function (m, ctx) {
  const target = (m.mentionedJid || [])[0] || m.quoted?.sender;
  try {
    const res = await fetch('https://nekos.life/api/v2/img/slap', { signal: AbortSignal.timeout(20000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const j = await res.json();
    const gambar = j.url;
    if (!gambar) throw new Error('Gambar tidak ditemukan.');
    const caption = target
      ? `👋 @${m.sender.split('@')[0]} menampar @${target.split('@')[0]}`
      : '👋 Tamparan untukmu!';
    await ctx.sock.sendMessage(m.chat, { image: { url: gambar }, caption, ...(target ? { mentions: [m.sender, target] } : {}) }, { quoted: m.raw });
  } catch (e) {
    await ctx.reply('Error: ' + e.message);
  }
}
