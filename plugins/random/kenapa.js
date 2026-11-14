// AunuMD • Pertanyaan kenapa acak
export const config = { name: 'kenapa', alias: ['why'], category: 'random', description: 'Mengirim pertanyaan kenapa acak', usage: '.kenapa', isOwner: false, isGroup: false, isPrivate: false, cooldown: 3 };
export default async function (m, ctx) {
  try {
    const res = await fetch('https://nekos.life/api/v2/why', { signal: AbortSignal.timeout(20000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const j = await res.json();
    if (!j.why) throw new Error('Pertanyaan tidak ditemukan.');
    await ctx.reply(`🤔 ${j.why}\n(pertanyaan acak dari nekos.life)`);
  } catch (e) {
    await ctx.reply('Error: ' + e.message);
  }
}
