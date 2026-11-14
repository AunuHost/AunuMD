// AunuMD • ubah stiker animasi yang di-reply menjadi video MP4 (ffmpeg lokal)
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const runFfmpeg = promisify(execFile);

export const config = {
  name: 'tovideo',
  alias: ['tovid'],
  category: 'tools',
  description: 'Ubah stiker animasi yang di-reply menjadi video MP4',
  usage: '.tovideo (reply stiker animasi)',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 8
};

export default async function (m, ctx) {
  const q = m.quoted;
  if (!q || q.type !== 'stickerMessage') {
    await ctx.reply('❌ Reply sebuah stiker (animasi) dengan perintah ini.');
    return;
  }
  const buf = await q.download();
  if (!buf) { await ctx.reply('❌ Gagal mengunduh stiker yang di-reply.'); return; }

  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'aunumd-tovideo-'));
  try {
    await m.react('⏳');
    const inp = path.join(dir, 'in.webp');
    const out = path.join(dir, 'out.mp4');
    fs.writeFileSync(inp, buf);
    await runFfmpeg('ffmpeg', [
      '-y', '-i', inp,
      '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2',
      '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-movflags', '+faststart',
      out
    ], { timeout: 180000 });
    const video = fs.readFileSync(out);
    await ctx.sock.sendMessage(m.chat, {
      video,
      caption: '🎬 Hasil konversi stiker ke video.'
    }, { quoted: m.raw });
  } catch (e) {
    await ctx.reply(`❌ Error: ${e.code === 'ENOENT' ? 'ffmpeg tidak ditemukan di sistem ini.' : 'Konversi ffmpeg gagal (stiker statis? pakai .toimg).'}`);
  } finally {
    try { fs.rmSync(dir, { recursive: true, force: true }); } catch {}
  }
}
