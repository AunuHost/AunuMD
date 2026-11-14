// AunuMD • Melihat daftar pesan terjadwal
export const config = {
  name: 'listschedule',
  alias: ['listjadwal'],
  category: 'aunu',
  description: 'Menampilkan semua pesan yang sedang terjadwal',
  usage: '.listschedule',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 3
};
export default async function (m, ctx) {
  const { sock, reply } = ctx;
  try {
    const list = sock.aunuListScheduled();
    if (!list || list.length === 0) return reply('Tidak ada pesan terjadwal.');
    const baris = list.map((e, i) => `${i + 1}. id: ${e.id}\n    Tujuan: ${e.jid}\n    Waktu: ${new Date(e.at).toLocaleString('id-ID')}`);
    reply(`*Pesan Terjadwal (${list.length})*\n\n${baris.join('\n')}`);
  } catch (e) {
    reply('Error: ' + e.message);
  }
}
