// AunuMD • Dokumen dengan klaim ukuran dan halaman palsu
export const config = {
  name: 'fakedoc',
  alias: ['fdoc'],
  category: 'aunu',
  description: 'Kirim dokumen kecil yang diklaim berukuran 2 GB dan 9999 halaman',
  usage: '.fakedoc <namafile> | <isi teks>',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 3
};
export default async function (m, ctx) {
  const parts = ctx.text.split('|');
  const nama = (parts[0] || '').trim();
  const isi = parts.slice(1).join('|').trim();
  if (!nama || !isi) return ctx.reply('Pemakaian: ' + config.usage);
  const document = Buffer.from(isi, 'utf8');
  try {
    await ctx.sock.aunuFakeDoc(m.chat, {
      document,
      fileName: nama,
      mimetype: 'application/pdf',
      fakeSizeBytes: 2000000000,
      fakePages: 9999,
      caption: 'Dokumen dari ' + ctx.config.botName
    });
  } catch (e) {
    return ctx.reply('Error: ' + e.message);
  }
}
