// AunuMD • utilitas umum: durasi, buffer, stiker (ffmpeg), kepemilikan.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Nomor murni dari sebuah JID (buang domain + suffix device).
export function extractNum(jid = '') {
  return String(jid).split('@')[0].split(':')[0].replace(/\D/g, '');
}

export function isOwnerJid(jid, cfg) {
  const num = extractNum(jid);
  if (!num) return false;
  return (cfg.owners || []).some((o) => extractNum(o.number) === num);
}

// '10s' | '5m' | '2h' | '7d' -> milidetik (null bila format salah).
export function parseDuration(str = '') {
  const m = /^(\d+)\s*(s|m|h|d)$/i.exec(String(str).trim());
  if (!m) return null;
  const mult = { s: 1e3, m: 6e4, h: 36e5, d: 864e5 }[m[2].toLowerCase()];
  return parseInt(m[1], 10) * mult;
}

export function formatUptime(totalSeconds) {
  const s = Math.floor(totalSeconds);
  const d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60), sec = s % 60;
  const parts = [];
  if (d) parts.push(`${d} hari`);
  if (h) parts.push(`${h} jam`);
  if (m) parts.push(`${m} menit`);
  parts.push(`${sec} detik`);
  return parts.join(' ');
}

export async function getBuffer(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} saat mengambil ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

// Konversi gambar/video pendek menjadi stiker WebP 512x512 lewat ffmpeg sistem.
// Argumen selalu berupa array (tanpa shell) — tidak ada injeksi perintah.
export function makeSticker(buffer, isVideo = false) {
  return new Promise((resolve, reject) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const inFile = path.join(os.tmpdir(), `aunumd-in-${id}`);
    const outFile = path.join(os.tmpdir(), `aunumd-out-${id}.webp`);
    fs.writeFileSync(inFile, buffer);
    const filter = 'scale=512:512:force_original_aspect_ratio=decrease,fps=15,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000,split[a][b];[a]palettegen=reserve_transparent=on:transparency_color=ffffff[pal];[b][pal]paletteuse';
    const args = ['-y', '-i', inFile];
    if (isVideo) args.push('-t', '10');
    args.push('-vf', filter, '-f', 'webp', outFile);
    const proc = spawn('ffmpeg', args, { stdio: 'ignore' });
    const killer = setTimeout(() => { try { proc.kill('SIGKILL'); } catch {} }, 30000);
    proc.on('error', (e) => {
      clearTimeout(killer);
      cleanup();
      reject(new Error(e.code === 'ENOENT' ? 'ffmpeg tidak ditemukan di sistem ini.' : e.message));
    });
    proc.on('close', (code) => {
      clearTimeout(killer);
      try {
        if (code !== 0 || !fs.existsSync(outFile)) throw new Error('Konversi stiker gagal.');
        resolve(fs.readFileSync(outFile));
      } catch (e) { reject(e); } finally { cleanup(); }
    });
    function cleanup() {
      try { fs.unlinkSync(inFile); } catch {}
      try { fs.unlinkSync(outFile); } catch {}
    }
  });
}

export default { sleep, extractNum, isOwnerJid, parseDuration, formatUptime, getBuffer, makeSticker };
