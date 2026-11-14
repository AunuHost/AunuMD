// AunuMD • Membatalkan pesan terjadwal berdasarkan id
export const config = {
  name: 'cancelschedule',
  alias: ['bataljadwal'],
  category: 'aunu',
  description: 'Membatalkan pesan terjadwal berdasarkan id-nya',
  usage: '.cancelschedule <id>',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 3
};
export default async function (m, ctx) {
  const { sock, args, reply } = ctx;
  const id = args[0];
  if (!id) return reply(`Pemakaian: ${config.usage}`);
  try {
    const ok = sock.aunuCancelScheduled(id);
    reply(ok ? `Jadwal ${id} dibatalkan ✓` : `Gagal membatalkan: id ${id} tidak ditemukan.`);
  } catch (e) {
    reply('Error: ' + e.message);
  }
}
