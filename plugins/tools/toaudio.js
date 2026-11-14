// AunuMD • ubah video/audio yang di-reply menjadi audio MP3 (ffmpeg lokal)
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const runFfmpeg = promisify(execFile);

export const config = {
  name: 'toaudio',
  alias: ['mp3'],
  category: 'tools',
  description: 'Ubah video/audio yang di-reply menjadi audio MP3',
  usage: '.toaudio (reply video/audio)',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 8
};

const EXT_BY_TYPE = { videoMessage: '.mp4', audioMessage: '.ogg', documentMessage: '.bin' };

export default async function (m, ctx) {
  const q = m.quoted;
  if (!q || !['videoMessage', 'audioMessage', 'documentMessage'].includes(q.type)) {
    await ctx.reply('❌ Reply sebuah video atau audio dengan perintah ini.');
    return;
  }
  const buf = await q.download();
  if (!buf) { await ctx.reply('❌ Gagal mengunduh media yang di-reply.'); return; }

  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'aunumd-toaudio-'));
  try {
    await m.react('⏳');
    const inp = path.join(dir, 'in' + (EXT_BY_TYPE[q.type] || '.bin'));
    const out = path.join(dir, 'audio.mp3');
    fs.writeFileSync(inp, buf);
    await runFfmpeg('ffmpeg', ['-y', '-i', inp, '-vn', '-ar', '44100', '-ac', '2', '-b:a', '192k', out], { timeout: 180000 });
    const audio = fs.readFileSync(out);
    await ctx.sock.sendMessage(m.chat, {
      audio,
      mimetype: 'audio/mpeg',
      fileName: 'audio.mp3'
    }, { quoted: m.raw });
  } catch (e) {
    await ctx.reply(`❌ Error: ${e.code === 'ENOENT' ? 'ffmpeg tidak ditemukan di sistem ini.' : 'Konversi ffmpeg gagal.'}`);
  } finally {
    try { fs.rmSync(dir, { recursive: true, force: true }); } catch {}
  }
}
