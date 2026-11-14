// AunuMD • kartu kontak owner.
export const config = {
  name: 'owner',
  alias: ['creator', 'pemilik'],
  category: 'main',
  description: 'Kontak owner bot',
  usage: '.owner',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 3
};

export default async function (m, ctx) {
  const owner = (ctx.config.owners || [])[0];
  if (!owner) { await m.reply('Owner belum diatur di config.'); return; }
  const vcard =
    'BEGIN:VCARD\nVERSION:3.0\n' +
    `FN:${owner.name}\nORG:AunuCore Creative Network\n` +
    `TEL;type=CELL;type=VOICE;waid=${owner.number}:+${owner.number}\nEND:VCARD`;
  await ctx.sock.sendMessage(m.chat, {
    contacts: { displayName: owner.name, contacts: [{ vcard }] }
  }, { quoted: m.raw });
  await m.reply(`👑 Owner: *${owner.name}* (AunuCore Creative Network)\nSilakan hubungi seperlunya.`);
}
