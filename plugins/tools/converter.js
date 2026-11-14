// AunuMD • Konversi media yang di-reply ke format lain (ffmpeg lokal)
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { makeSticker } from '../../src/helper.js';

const execFileAsync = promisify(execFile);

export const config = {
  name: 'converter',
  alias: ['convert', 'konversi2'],
  category: 'tools',
  description: 'Konversi media yang di-reply ke format lain: mp3/mp4/png/jpg/webp/ogg (ffmpeg lokal)',
  usage: '.converter <format> (reply media) — format: mp3, mp4, png, jpg, webp, ogg',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 10
};

const FORMATS = {
  mp3: { args: ['-vn', '-codec:a', 'libmp3lame', '-b:a', '192k'], ext: 'mp3', mime: 'audio/mpeg', label: 'audio MP3' },
  ogg: { args: ['-vn', '-codec:a', 'libopus', '-b:a', '64k'], ext: 'ogg', mime: 'audio/ogg', label: 'audio OGG Opus' },
  mp4: {
    args: ['-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2', '-movflags', '+faststart'],
    ext: 'mp4', mime: 'video/mp4', label: 'video MP4'
  },
  png: { args: ['-frames:v', '1'], ext: 'png', mime: 'image/png', label: 'gambar PNG' },
  jpg: { args: ['-frames:v', '1'], ext: 'jpg', mime: 'image/jpeg', label: 'gambar JPG' }
};

async function convertWithFfmpeg(inputBuf, args, outExt) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'aunumd-conv-'));
  try {
    const input = path.join(dir, 'input');
    const output = path.join(dir, `output.${outExt}`);
    fs.writeFileSync(input, inputBuf);
    await execFileAsync('ffmpeg', ['-y', '-i', input, ...args, output], { timeout: 180000 });
    if (!fs.existsSync(output)) throw new Error('ffmpeg tidak menghasilkan berkas keluaran.');
    return fs.readFileSync(output);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

export default async function (m, ctx) {
  const format = (ctx.args[0] || '').toLowerCase();
  const supported = [...Object.keys(FORMATS), 'webp'];
  if (!supported.includes(format)) {
    return ctx.reply(`Format tidak dikenali.\n\nPemakaian: ${config.usage}\nFormat didukung: ${supported.join(', ')}`);
  }
  if (!m.quoted || typeof m.quoted.download !== 'function') {
    return ctx.reply('Reply sebuah media (gambar/video/audio/stiker) lalu ketik ' + config.usage);
  }
  const input = await m.quoted.download();
  if (!input) return ctx.reply('Error: gagal mengunduh media yang di-reply.');
  try {
    if (format === 'webp') {
      const qType = String(m.quoted.type || '');
      const sticker = await makeSticker(input, qType.includes('video') || qType.includes('gif'));
      return ctx.sock.sendMessage(m.chat, { sticker }, { quoted: m.raw });
    }
    const spec = FORMATS[format];
    const out = await convertWithFfmpeg(input, spec.args, spec.ext);
    await ctx.sock.sendMessage(m.chat, {
      document: out,
      fileName: `convert.${spec.ext}`,
      mimetype: spec.mime,
      caption: `✅ Hasil konversi ke ${spec.label}`
    }, { quoted: m.raw });
  } catch (e) {
    return ctx.reply('Error konversi: ' + e.message + '\nPastikan media sumber sesuai dengan format tujuan (mis. mp3 butuh video/audio, png/jpg butuh gambar/stiker).');
  }
}
