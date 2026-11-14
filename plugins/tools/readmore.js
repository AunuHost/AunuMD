// AunuMD • Teks "baca selengkapnya" (read more) dengan pemisah tak terlihat
export const config = {
  name: 'readmore',
  alias: [],
  category: 'tools',
  description: 'Buat teks "baca selengkapnya": bagian akhir disembunyikan di balik Read more WhatsApp',
  usage: '.readmore <teks awal>|<teks akhir>',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 3
};

export default async function (m, ctx) {
  const text = ctx.text || m.quoted?.text || '';
  const idx = text.indexOf('|');
  if (idx === -1) {
    return ctx.reply('Pemakaian: ' + config.usage + '\nContoh: .readmore Pengumuman penting!|Isi lengkapnya ada di sini.');
  }
  const awal = text.slice(0, idx).trim();
  const akhir = text.slice(idx + 1).trim();
  if (!awal || !akhir) return ctx.reply('Kedua bagian (awal dan akhir) wajib diisi. ' + config.usage);
  return ctx.reply(awal + '\u200E'.repeat(4001) + akhir);
}
