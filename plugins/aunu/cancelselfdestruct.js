// AunuMD • Membatalkan / menghapus paksa pesan musnah-sendiri
export const config = {
  name: 'cancelsd',
  alias: ['cancelselfdestruct'],
  category: 'aunu',
  description: 'Membatalkan timer musnah-sendiri / menghapus pesan musnah-sendiri sekarang',
  usage: '.cancelsd <id>',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 3
};
export default async function (m, ctx) {
  const { sock, args, reply } = ctx;
  const id = args[0] || m.quoted?.key?.id;
  if (!id) return reply(`Pemakaian: ${config.usage} — atau balas pesan musnah-sendiri dengan perintah ini.`);
  try {
    const ok = sock.aunuCancelSelfDestruct(id);
    reply(ok ? `Musnah-sendiri ${id} dibatalkan ✓` : `Gagal: id ${id} tidak ditemukan atau sudah terhapus.`);
  } catch (e) {
    reply('Error: ' + e.message);
  }
}
