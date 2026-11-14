// AunuMD • tandai diri sedang AFK; handler memberi tahu siapa pun yang menyebutmu
// dan mengembalikan statusmu begitu kamu mengirim pesan lagi.
export const config = {
  name: 'afk',
  alias: [],
  category: 'info',
  description: 'Tandai diri sedang AFK (away from keyboard)',
  usage: '.afk [alasan]',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 3
};

export default async function (m, ctx) {
  const u = ctx.db.users.get(m.sender) || {};
  u.afk = { reason: ctx.text || 'Sedang AFK', at: Date.now() };
  ctx.db.users.set(m.sender, u);
  await ctx.reply(`💤 Kamu sekarang AFK: ${u.afk.reason}\nKirim pesan apa pun untuk kembali.`);
}
