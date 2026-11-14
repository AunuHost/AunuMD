// AunuMD • Laporan kesehatan socket & library AunuBaileys
export const config = {
  name: 'doctor',
  alias: ['aunudoctor'],
  category: 'aunu',
  description: 'Menampilkan laporan kesehatan koneksi dan library (aunuDoctor)',
  usage: '.doctor',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 5
};
export default async function (m, ctx) {
  const { sock, reply } = ctx;
  try {
    const r = sock.aunuDoctor();
    const val = (v) => (v === null || v === undefined ? '-' : v);
    reply(
      `🩺 *AunuDoctor*\n` +
      `• Versi WA terbundel: ${val(r.bundledWaVersion)}\n` +
      `• Terdaftar: ${val(r.registered)}\n` +
      `• Nomor bot: ${val(r.me)}\n` +
      `• WebSocket terbuka: ${val(r.wsOpen)}\n` +
      `• Pasangan LID dikenal: ${val(r.lidPairsKnown)}\n` +
      `• Jadwal menunggu: ${val(r.scheduledPending)}\n` +
      `• Musnah-sendiri menunggu: ${val(r.selfDestructPending)}\n` +
      `Library: @aunucore/baileys`
    );
  } catch (e) {
    reply('Error: ' + e.message);
  }
}
