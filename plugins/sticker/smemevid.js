// AunuMD • stiker meme animasi dari video yang di-reply + teks atas|bawah (drawtext ffmpeg -> webp animasi).
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';

export const config = {
  name: 'smemevid',
  alias: [],
  category: 'sticker',
  description: 'Membuat stiker meme animasi dari video yang di-reply',
  usage: '.smemevid <atas>|<bawah> (reply video)',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 5
};

const execFileAsync = promisify(execFile);
const FONT_PATH = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'assets', 'fonts', 'Poppins.ttf');

function escDrawtext(s) {
  return s
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/:/g, '\\:')
    .replace(/%/g, '\\%')
    .replace(/,/g, '\\,');
}

export default async function (m, ctx) {
  const type = m.quoted?.type || '';
  if (!m.quoted || !type.includes('video')) {
    return ctx.reply(`🎬 *MEME VIDEO*\n\n> Reply video dengan caption:\n> \`${ctx.prefix}smemevid Atas|Bawah\`\n\nContoh: \`${ctx.prefix}smemevid WIDTH OR HEIGHT|WHY NOT BOTH?\``);
  }
  const input = (ctx.text || '').trim();
  if (!input) {
    return ctx.reply(`🎬 *MEME VIDEO*\n\n> Format: atas|bawah (salah satu boleh kosong)\n\nContoh: \`${ctx.prefix}smemevid Atas|Bawah\``);
  }
  const [top = '', bottom = ''] = input.split('|').map((s) => s.trim().toUpperCase());

  let buf;
  try {
    buf = await m.quoted.download();
  } catch (e) {
    return ctx.reply(`❌ Gagal mengunduh video: ${e.message}`);
  }
  if (!buf?.length) return ctx.reply('❌ Gagal mengunduh video.');

  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'aunumd-'));
  try {
    const inFile = path.join(dir, 'in.mp4');
    const midFile = path.join(dir, 'mid.mp4');
    const outFile = path.join(dir, 'out.webp');
    fs.writeFileSync(inFile, buf);

    let src = inFile;
    const filters = [];
    if (top) filters.push(`drawtext=fontfile=${FONT_PATH}:text='${escDrawtext(top)}':fontcolor=white:borderw=3:bordercolor=black:fontsize=34:x=(w-text_w)/2:y=8`);
    if (bottom) filters.push(`drawtext=fontfile=${FONT_PATH}:text='${escDrawtext(bottom)}':fontcolor=white:borderw=3:bordercolor=black:fontsize=34:x=(w-text_w)/2:y=h-text_h-8`);
    if (filters.length) {
      await execFileAsync('ffmpeg', ['-y', '-i', inFile, '-vf', filters.join(','), '-an', '-c:v', 'libx264', '-preset', 'fast', '-crf', '26', midFile], { timeout: 120000 });
      src = midFile;
    }

    await execFileAsync('ffmpeg', ['-y', '-i', src, '-t', '8', '-vf', 'fps=12,scale=512:-1:flags=lanczos', '-vcodec', 'libwebp', '-loop', '0', '-q:v', '55', '-an', outFile], { timeout: 120000 });
    const webp = fs.readFileSync(outFile);
    await ctx.sock.sendMessage(m.chat, { sticker: webp }, { quoted: m.raw });
  } catch (e) {
    return ctx.reply(`❌ Gagal membuat stiker meme video: ${e.message}`);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}
