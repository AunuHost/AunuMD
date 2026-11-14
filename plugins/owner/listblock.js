// AunuMD • melihat daftar nomor yang diblokir
export const config = { name: 'listblock', alias: ['blocked'], category: 'owner', description: 'Lihat daftar nomor yang diblokir bot', usage: '.listblock', isOwner: true, isGroup: false, isPrivate: false, cooldown: 3 };

export default async function (m, ctx) {
  try {
    const list = await ctx.sock.fetchBlocklist();
    if (!list || !list.length) return ctx.reply('Daftar blokir kosong.');
    const lines = list.map((jid, i) => `${i + 1}. ${String(jid).split('@')[0]}`);
    await ctx.reply(`🚫 *Daftar Blokir* (${list.length})\n\n${lines.join('\n')}`);
  } catch (e) {
    await ctx.reply('Error: ' + e.message);
  }
}
