// AunuMD • Tag-all personal: satu kartu foto+nama untuk setiap member grup
export const config = {
  name: 'personaltagall',
  alias: ['ptagall'],
  category: 'aunu',
  description: 'Mengirim kartu personal (foto profil + nama) ke setiap member grup, mention tepat ke orangnya',
  usage: '.personaltagall <teks template>',
  isOwner: false, isGroup: true, isPrivate: false,
  cooldown: 10
};
export default async function (m, ctx) {
  const { sock, text, reply, db } = ctx;
  const template = text || 'Hai {mention} 👋';
  try {
    const result = await sock.aunuPersonalTagAll(m.chat, {
      text: template,
      getName: (jid) => db.users.get(jid)?.name
    });
    reply(`Selesai: ${result?.sent ?? result?.total ?? '?'} kartu terkirim.`);
  } catch (e) {
    reply('Error: ' + e.message);
  }
}
