// AunuMD • Pesan terusan palsu dengan atribusi saluran
export const config = {
  name: 'fakeforward',
  alias: ['ffwd'],
  category: 'aunu',
  description: 'Kirim teks seolah diteruskan berkali-kali dari sebuah saluran',
  usage: '.fakeforward <teks> | <nama channel opsional>',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 3
};
export default async function (m, ctx) {
  const parts = ctx.text.split('|');
  const teks = (parts[0] || '').trim();
  const namaChannel = (parts[1] || '').trim();
  if (!teks) return ctx.reply('Pemakaian: ' + config.usage);
  try {
    await ctx.sock.aunuFakeForward(m.chat, { text: teks }, {
      score: 999,
      channelName: namaChannel || undefined
    });
  } catch (e) {
    return ctx.reply('Error: ' + e.message);
  }
}
