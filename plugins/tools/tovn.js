// AunuMD • ubah audio/video yang di-reply menjadi voice note / VN (ffmpeg lokal)
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const runFfmpeg = promisify(execFile);

export const config = {
  name: 'tovn',
  alias: ['toptt'],
  category: 'tools',
  description: 'Ubah audio/video yang di-reply menjadi voice note (VN)',
  usage: '.tovn (reply audio/video)',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 8
};

const EXT_BY_TYPE = { videoMessage: '.mp4', audioMessage: '.ogg', documentMessage: '.bin' };

export default async function (m, ctx) {
  const q = m.quoted;
  if (!q || !['videoMessage', 'audioMessage', 'documentMessage'].includes(q.type)) {
    await ctx.reply('❌ Reply sebuah audio atau video dengan perintah ini.');
    return;
  }
  const buf = await q.download();
  if (!buf) { await ctx.reply('❌ Gagal mengunduh media yang di-reply.'); return; }

  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'aunumd-tovn-'));
  try {
    await m.react('⏳');
    const inp = path.join(dir, 'in' + (EXT_BY_TYPE[q.type] || '.bin'));
    const out = path.join(dir, 'vn.ogg');
    fs.writeFileSync(inp, buf);
    await runFfmpeg('ffmpeg', ['-y', '-i', inp, '-vn', '-c:a', 'libopus', '-ar', '48000', '-ac', '1', '-b:a', '64k', out], { timeout: 180000 });
    const audio = fs.readFileSync(out);
    await ctx.sock.sendMessage(m.chat, {
      audio,
      ptt: true,
      mimetype: 'audio/ogg; codecs=opus'
    }, { quoted: m.raw });
  } catch (e) {
    await ctx.reply(`❌ Error: ${e.code === 'ENOENT' ? 'ffmpeg tidak ditemukan di sistem ini.' : 'Konversi ffmpeg gagal.'}`);
  } finally {
    try { fs.rmSync(dir, { recursive: true, force: true }); } catch {}
  }
}
