// AunuMD • Cek ID pengirim dan info chat
export const config = {
  name: 'myid',
  alias: ['cekid'],
  category: 'tools',
  description: 'Menampilkan ID dan info pengirim',
  usage: '.myid',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 3
};
export default async function (m, ctx) {
  const { reply } = ctx;
  const teks = [
    '🪪 *INFO KAMU*',
    '',
    `ID: ${m.sender}`,
    `ID alternatif: ${m.senderAlt || '-'}`,
    `Nama: ${m.pushName || '-'}`,
    `Chat: ${m.chat}`,
    `Tipe: ${m.isGroup ? 'Grup' : 'Pribadi'}`
  ].join('\n');
  reply(teks);
}
