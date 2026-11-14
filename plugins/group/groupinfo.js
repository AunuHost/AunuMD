// AunuMD • Informasi lengkap grup saat ini
export const config = {
  name: 'groupinfo',
  alias: ['gcinfo', 'infogrup'],
  category: 'group',
  description: 'Menampilkan informasi grup',
  usage: '.groupinfo',
  isOwner: false, isGroup: true, isPrivate: false,
  cooldown: 3
};
export default async function (m, ctx) {
  const { sock, reply } = ctx;
  try {
    const metadata = await sock.groupMetadata(m.chat);
    const dibuat = metadata.creation ? new Date(metadata.creation * 1000).toLocaleString('id-ID') : '-';
    const teks = [
      '👥 *INFO GRUP*',
      '',
      `Nama: ${metadata.subject || '-'}`,
      `ID: ${metadata.id || m.chat}`,
      `Owner: ${metadata.owner ? '@' + metadata.owner.split('@')[0] : '-'}`,
      `Jumlah member: ${(metadata.participants || []).length}`,
      `Dibuat: ${dibuat}`,
      `Deskripsi: ${metadata.desc || '-'}`
    ].join('\n');
    reply(teks);
  } catch (e) {
    reply('Error: ' + e.message);
  }
}
