// AunuMD • Menjadwalkan pengiriman pesan
export const config = {
  name: 'schedule',
  alias: ['jadwal'],
  category: 'aunu',
  description: 'Menjadwalkan pesan terkirim nanti (durasi: 10s, 5m, 2h, 1d)',
  usage: '.schedule <durasi> <teks>',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 3
};
export default async function (m, ctx) {
  const { sock, args, text, reply } = ctx;
  const cocok = /^(\d+)(s|m|h|d)$/.exec(args[0] || '');
  const teks = args.slice(1).join(' ');
  if (!cocok || !teks) return reply(`Pemakaian: ${config.usage}\nContoh: .schedule 5m Halo, ini pesan terjadwal`);
  const satuan = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
  const when = Date.now() + Number(cocok[1]) * satuan[cocok[2]];
  try {
    const s = sock.aunuSchedule(m.chat, { text: teks }, when);
    reply(`Terjadwal ✓ id: ${s.id}, terkirim: ${new Date(s.at).toLocaleString('id-ID')}`);
  } catch (e) {
    reply('Error: ' + e.message);
  }
}
