// AunuMD • Fakta acak
export const config = { name: 'randomfact', alias: ['fact'], category: 'random', description: 'Mengirim fakta acak', usage: '.randomfact', isOwner: false, isGroup: false, isPrivate: false, cooldown: 3 };
export default async function (m, ctx) {
  try {
    const res = await fetch('https://nekos.life/api/v2/fact', { signal: AbortSignal.timeout(20000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const j = await res.json();
    if (!j.fact) throw new Error('Fakta tidak ditemukan.');
    await ctx.reply(`💡 ${j.fact}`);
  } catch (e) {
    await ctx.reply('Error: ' + e.message);
  }
}
