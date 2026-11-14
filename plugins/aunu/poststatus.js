// AunuMD • Kirim status teks dengan latar warna
export const config = {
  name: 'poststatus',
  alias: ['status'],
  category: 'aunu',
  description: 'Kirim status teks, opsional dengan warna latar hex',
  usage: '.poststatus [#warna] <teks>',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 3
};
export default async function (m, ctx) {
  const tokens = [...ctx.args];
  const opts = {};
  if (tokens.length && /^#[0-9a-fA-F]{6}$/.test(tokens[0])) {
    opts.backgroundColor = tokens.shift();
  }
  const teks = tokens.join(' ');
  if (!teks) return ctx.reply('Pemakaian: ' + config.usage);
  try {
    await ctx.sock.aunuPostStatus(teks, opts);
    return ctx.reply('Status terkirim ✓');
  } catch (e) {
    return ctx.reply('Error: ' + e.message);
  }
}
