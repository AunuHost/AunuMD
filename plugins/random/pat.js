// AunuMD • Tepukan kepala anime acak
export const config = { name: 'pat', alias: [], category: 'random', description: 'Mengirim gambar tepukan kepala anime', usage: '.pat [@user]', isOwner: false, isGroup: false, isPrivate: false, cooldown: 4 };
export default async function (m, ctx) {
  const target = (m.mentionedJid || [])[0] || m.quoted?.sender;
  try {
    const res = await fetch('https://nekos.life/api/v2/img/pat', { signal: AbortSignal.timeout(20000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const j = await res.json();
    const gambar = j.url;
    if (!gambar) throw new Error('Gambar tidak ditemukan.');
    const caption = target
      ? `🤲 @${m.sender.split('@')[0]} menepuk kepala @${target.split('@')[0]}`
      : '🤲 Tepuk-tepuk kepala dulu ya!';
    await ctx.sock.sendMessage(m.chat, { image: { url: gambar }, caption, ...(target ? { mentions: [m.sender, target] } : {}) }, { quoted: m.raw });
  } catch (e) {
    await ctx.reply('Error: ' + e.message);
  }
}
