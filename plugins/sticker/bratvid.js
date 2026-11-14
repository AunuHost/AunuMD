// AunuMD • stiker brat animasi: teks muncul bertahap kata per kata (frame brat lokal -> webp animasi via ffmpeg).
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { bratPng } from '../../src/canvas.js';

export const config = {
  name: 'bratvid',
  alias: [],
  category: 'sticker',
  description: 'Membuat stiker brat animasi (teks muncul bertahap)',
  usage: '.bratvid <teks>',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 5
};

const execFileAsync = promisify(execFile);
const MAX_FRAMES = 12;

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
    return ctx.reply(`🎬 *BRAT ANIMATED*\n\n> Masukkan teks\n\nContoh: \`${ctx.prefix}bratvid Hai semua\``);
  }
  try {
    const words = text.split(/\s+/).filter(Boolean);
    const frameTexts = [];
    const step = Math.max(1, Math.ceil(words.length / MAX_FRAMES));
    for (let i = step; i < words.length; i += step) frameTexts.push(words.slice(0, i).join(' '));
    frameTexts.push(words.join(' '));
    const frames = [];
    for (const ft of frameTexts) frames.push(await bratPng(ft));
    const webp = await framesToWebp(frames);
    await ctx.sock.sendMessage(m.chat, { sticker: webp }, { quoted: m.raw });
  } catch (e) {
    return ctx.reply(`❌ Gagal membuat stiker brat video: ${e.message}`);
  }
}
