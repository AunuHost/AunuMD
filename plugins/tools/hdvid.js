// AunuMD • upscale video yang di-reply menjadi "HD" 2x + sharpen (ffmpeg lokal)
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const runFfmpeg = promisify(execFile);

export const config = {
  name: 'hdvid',
  alias: ['hdvideo'],
  category: 'tools',
  description: 'Tingkatkan video yang di-reply jadi HD (upscale 2x + sharpen)',
  usage: '.hdvid (reply video, maks 25MB)',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 30
};

const MAX_BYTES = 25 * 1024 * 1024;

export default async function (m, ctx) {
  const q = m.quoted;
  if (!q || q.type !== 'videoMessage') {
    await ctx.reply('❌ Reply sebuah video dengan perintah ini.');
    return;
  }
  const buf = await q.download();
  if (!buf) { await ctx.reply('❌ Gagal mengunduh video yang di-reply.'); return; }
  if (buf.length > MAX_BYTES) {
    await ctx.reply(`❌ Video terlalu besar (${(buf.length / 1048576).toFixed(1)}MB). Batas proses HD adalah 25MB.`);
    return;
  }

  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'aunumd-hdvid-'));
  try {
    await m.react('⏳');
    await ctx.reply('🎬 Video sedang diproses ke HD (upscale 2x + sharpen). Proses ini bisa memakan waktu cukup lama, mohon tunggu...');
    const inp = path.join(dir, 'in.mp4');
    const out = path.join(dir, 'out.mp4');
    fs.writeFileSync(inp, buf);
    await runFfmpeg('ffmpeg', [
      '-y', '-i', inp,
      '-vf', 'scale=iw*2:ih*2:flags=lanczos,unsharp=5:5:1.0:5:5:0.0',
      '-c:v', 'libx264', '-crf', '23', '-preset', 'veryfast', '-c:a', 'copy',
      out
    ], { timeout: 600000 });
    const video = fs.readFileSync(out);
    await ctx.sock.sendMessage(m.chat, {
      video,
      caption: '✅ Video versi HD (upscale 2x + sharpen).'
    }, { quoted: m.raw });
  } catch (e) {
    await ctx.reply(`❌ Error: ${e.code === 'ENOENT' ? 'ffmpeg tidak ditemukan di sistem ini.' : 'Proses HD gagal atau timeout.'}`);
  } finally {
    try { fs.rmSync(dir, { recursive: true, force: true }); } catch {}
  }
}
