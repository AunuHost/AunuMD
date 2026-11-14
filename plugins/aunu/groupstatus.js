// AunuMD • Kirim status khusus grup
export const config = {
  name: 'groupstatus',
  alias: ['gstatus'],
  category: 'aunu',
  description: 'Kirim status grup berupa teks atau foto dari reply',
  usage: '.groupstatus <teks> atau reply foto dengan caption',
  isOwner: false, isGroup: true, isPrivate: false,
  cooldown: 3
};
export default async function (m, ctx) {
  let content = null;
  if (m.quoted && String(m.quoted.type || '').includes('image')) {
    const buf = await m.quoted.download();
    if (buf) content = { image: buf, caption: ctx.text || undefined };
  }
  if (!content) {
    if (!ctx.text) return ctx.reply('Pemakaian: ' + config.usage);
    content = { text: ctx.text };
  }
  try {
    await ctx.sock.aunuSendGroupStatus(m.chat, content);
  } catch (e) {
    return ctx.reply('Error: ' + e.message);
  }
}
