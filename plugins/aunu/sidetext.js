// AunuMD • Teks dengan foto kecil di samping nama
export const config = {
  name: 'sidetext',
  alias: ['st'],
  category: 'aunu',
  description: 'Kirim teks bergaya side text dengan foto profil di samping',
  usage: '.sidetext [--deleted] <teks>',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 3
};
export default async function (m, ctx) {
  const deleted = ctx.args.includes('--deleted');
  const teks = ctx.args.filter((a) => a !== '--deleted').join(' ');
  if (!teks) return ctx.reply('Pemakaian: ' + config.usage);
  const title = m.pushName || ctx.config.botName;
  const opts = deleted
    ? { text: teks, title, deletedProfile: true }
    : { text: teks, title, profileOf: m.sender };
  try {
    await ctx.sock.aunuSideText(m.chat, opts);
  } catch (e) {
    return ctx.reply('Error: ' + e.message);
  }
}
