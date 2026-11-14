// AunuMD • Broadcast pesan ke semua grup
export const config = {
  name: 'broadcast',
  alias: ['bc'],
  category: 'owner',
  description: 'Kirim pesan ke semua grup bot (owner)',
  usage: '.broadcast <teks>',
  isOwner: true, isGroup: false, isPrivate: false,
  cooldown: 10
};
export default async function (m, ctx) {
  const { sock, reply, text } = ctx;
  if (!text) return reply('Pemakaian: ' + config.usage);
  try {
    const groups = await sock.groupFetchAllParticipating();
    const jids = Object.keys(groups || {});
    let terkirim = 0;
    for (const jid of jids) {
      try {
        await sock.sendMessage(jid, { text });
        terkirim++;
      } catch {}
      await new Promise((r) => setTimeout(r, 500));
    }
    reply(`Broadcast selesai: terkirim ke ${terkirim} dari ${jids.length} grup.`);
  } catch (e) {
    reply('Error: ' + e.message);
  }
}
