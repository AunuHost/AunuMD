// AunuMD • ubah stiker yang di-reply menjadi gambar PNG (ffmpeg lokal)
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const runFfmpeg = promisify(execFile);

export const config = {
  name: 'toimg',
  alias: ['toimage'],
  category: 'tools',
  description: 'Ubah stiker yang di-reply menjadi gambar PNG',
  usage: '.toimg (reply stiker)',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 5
};

export default async function (m, ctx) {
  const q = m.quoted;
  if (!q || q.type !== 'stickerMessage') {
    await ctx.reply('❌ Reply sebuah stiker dengan perintah ini.');
    return;
  }
  const buf = await q.download();
  if (!buf) { await ctx.reply('❌ Gagal mengunduh stiker yang di-reply.'); return; }

  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'aunumd-toimg-'));
  try {
    await m.react('⏳');
    const inp = path.join(dir, 'in.webp');
    const out = path.join(dir, 'out.png');
    fs.writeFileSync(inp, buf);
    // Frame pertama saja: cukup untuk stiker statis maupun animasi.
    await runFfmpeg('ffmpeg', ['-y', '-i', inp, '-frames:v', '1', out], { timeout: 60000 });
    const image = fs.readFileSync(out);
    await ctx.sock.sendMessage(m.chat, {
      image,
      caption: '🖼️ Hasil konversi stiker ke gambar.'
    }, { quoted: m.raw });
  } catch (e) {
    await ctx.reply(`❌ Error: ${e.code === 'ENOENT' ? 'ffmpeg tidak ditemukan di sistem ini.' : 'Konversi ffmpeg gagal.'}`);
  } finally {
    try { fs.rmSync(dir, { recursive: true, force: true }); } catch {}
  }
}
