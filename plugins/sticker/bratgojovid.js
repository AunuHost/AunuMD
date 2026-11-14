// AunuMD • stiker brat Gojo animasi: teks muncul kata per kata di atas template (frame PNG -> webp animasi via ffmpeg).
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { getBuffer } from '../../src/helper.js';
import { createCanvas, loadImage, wrapText, ensureFonts } from '../../src/canvas.js';

export const config = {
  name: 'bratgojovid',
  alias: [],
  category: 'sticker',
  description: 'Membuat stiker brat Gojo animasi (kata per kata)',
  usage: '.bratgojovid <teks>',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 5
};

const execFileAsync = promisify(execFile);
const TEMPLATE_URL = 'https://raw.githubusercontent.com/Ditzzx-vibecoder/Assets/main/Brat/Gojo.jpeg';
const ZONE = { left: 270, top: 660, right: 990, bottom: 1180 };
const MAX_FRAMES = 20;
let templateCache = null;

async function getTemplate() {
  if (!templateCache) templateCache = await getBuffer(TEMPLATE_URL);
  return templateCache;
}

function renderFrame(img, text) {
  const S = 1254;
  const canvas = createCanvas(S, S);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, S, S);
  const rect = { x: ZONE.left, y: ZONE.top, w: ZONE.right - ZONE.left, h: ZONE.bottom - ZONE.top };
  let size = 90;
  let lines = [];
  while (size > 22) {
    ctx.font = `${size}px Poppins, sans-serif`;
    lines = wrapText(ctx, text, rect.w);
    if (lines.length * Math.ceil(size * 1.18) <= rect.h) break;
    size -= 2;
  }
  ctx.font = `${size}px Poppins, sans-serif`;
  const lh = Math.ceil(size * 1.18);
  let y = rect.y + (rect.h - lines.length * lh) / 2;
  ctx.fillStyle = '#111111';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  for (const line of lines) {
    ctx.fillText(line, rect.x + rect.w / 2, y);
    y += lh;
  }
  return canvas;
}

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
    return ctx.reply(`🎬 *BRAT GOJO VIDEO*\n\n> Masukkan teks\n\nContoh: \`${ctx.prefix}bratgojovid Halo semuanya\``);
  }
  try {
    ensureFonts();
    const img = await loadImage(await getTemplate());
    const words = text.split(/\s+/).filter(Boolean);
    const frameTexts = [];
    const step = Math.max(1, Math.ceil(words.length / MAX_FRAMES));
    for (let i = step; i < words.length; i += step) frameTexts.push(words.slice(0, i).join(' '));
    frameTexts.push(words.join(' '));
    const frames = [];
    for (const ft of frameTexts) frames.push(await renderFrame(img, ft).encode('png'));
    const webp = await framesToWebp(frames);
    await ctx.sock.sendMessage(m.chat, { sticker: webp }, { quoted: m.raw });
  } catch (e) {
    return ctx.reply(`❌ Gagal membuat stiker brat gojo video: ${e.message}`);
  }
}
