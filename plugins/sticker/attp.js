// AunuMD • stiker teks animasi berganti warna (frame teks lokal -> webp animasi via ffmpeg).
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { textStickerPng } from '../../src/canvas.js';

export const config = {
  name: 'attp',
  alias: [],
  category: 'sticker',
  description: 'Membuat stiker teks animasi berganti warna',
  usage: '.attp <teks>',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 5
};

const execFileAsync = promisify(execFile);
const PALETTE = ['#FF5733', '#FFC300', '#2E86AB', '#A23B72', '#4CC9F0', '#3DDC84'];

async function framesToWebp(frameBuffers) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'aunumd-'));
  try {
    frameBuffers.forEach((buf, i) => {
      fs.writeFileSync(path.join(dir, `f${String(i).padStart(2, '0')}.png`), buf);
    });
    const out = path.join(dir, 'out.webp');
    await execFileAsync('ffmpeg', ['-y', '-framerate', '3', '-i', path.join(dir, 'f%02d.png'), '-vcodec', 'libwebp', '-loop', '0', '-q:v', '60', '-vf', 'scale=512:512', '-an', out], { timeout: 120000 });
    return fs.readFileSync(out);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

export default async function (m, ctx) {
  const text = (ctx.text || '').trim() || (m.quoted?.text || '').trim();
  if (!text) {
    return ctx.reply(`🎨 *ANIMATED TEXT STICKER*\n\n> Masukkan teks untuk stiker\n\nContoh: \`${ctx.prefix}attp Hello World\``);
  }
  if (text.length > 100) {
    return ctx.reply('❌ Teks terlalu panjang! Maksimal 100 karakter.');
  }
  try {
    const frames = [];
    for (const fg of PALETTE) frames.push(await textStickerPng(text, { fg, bg: null }));
    const webp = await framesToWebp(frames);
    await ctx.sock.sendMessage(m.chat, { sticker: webp }, { quoted: m.raw });
  } catch (e) {
    return ctx.reply(`❌ Gagal membuat stiker attp: ${e.message}`);
  }
}
