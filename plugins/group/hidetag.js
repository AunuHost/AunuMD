// AunuMD • mention semua member grup tanpa menampilkan daftar tag
export const config = { name: 'hidetag', alias: ['h'], category: 'group', description: 'Kirim pesan dengan mention tersembunyi ke semua member grup', usage: '.hidetag [pesan]', isOwner: false, isGroup: true, isPrivate: false, cooldown: 3 };

export default async function (m, ctx) {
  try {
    const metadata = await ctx.sock.groupMetadata(m.chat);
    const mentions = metadata.participants.map((p) => p.id);
    const text = ctx.text || '📣 Pengumuman';
    await ctx.sock.sendMessage(m.chat, { text, mentions }, { quoted: m.raw });
  } catch (e) {
    await ctx.reply('Error: ' + e.message);
  }
}
