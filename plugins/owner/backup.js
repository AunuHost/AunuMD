// AunuMD • backup file database (users, groups, settings) sebagai dokumen
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const config = { name: 'backup', alias: [], category: 'owner', description: 'Kirim file database (users.json, groups.json, settings.json) sebagai dokumen', usage: '.backup', isOwner: true, isGroup: false, isPrivate: false, cooldown: 3 };

export default async function (m, ctx) {
  const dbDir = fileURLToPath(new URL('../../database/', import.meta.url));
  const files = ['users.json', 'groups.json', 'settings.json'];
  let terkirim = 0;
  for (const fileName of files) {
    const filePath = path.join(dbDir, fileName);
    if (!fs.existsSync(filePath)) continue;
    try {
      await ctx.sock.sendMessage(
        m.chat,
        { document: fs.readFileSync(filePath), fileName, mimetype: 'application/json', caption: fileName },
        { quoted: m.raw }
      );
      terkirim++;
    } catch (e) {
      await ctx.reply(`Gagal mengirim ${fileName}: ${e.message}`);
    }
  }
  if (!terkirim) return ctx.reply('Tidak ada file database yang ditemukan.');
  await ctx.reply(`✅ Backup selesai. ${terkirim} file database terkirim.`);
}
