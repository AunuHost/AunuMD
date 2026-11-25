// AunuMD • stiker bersuara (sound sticker): reply gambar/video/stiker dengan
// judul lagu — musiknya dicari dari YouTube (Invidious), dipotong maks 30 detik,
// lalu ditempel sebagai audio di dalam stiker memakai sendSoundSticker
// @aunucore/baileys 2.7.0 (stickerAudio: StickerMessage field 26 + EXIF
// "sound-sha256" yang memasangkan stiker dengan suaranya).
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { makeSticker, getBuffer } from '../../src/helper.js';
import { extractYtId, ytSearch, ytVideo, pickAudioStream } from '../../src/scraper.js';

const execFileAsync = promisify(execFile);
const MAX_AUDIO_BYTES = 25 * 1024 * 1024;
const TRIM_SECONDS = 30;

export const config = {
  name: 'astc',
  alias: ['audiosticker', 'soundsticker'],
  category: 'sticker',
  description: 'Stiker bersuara: reply gambar dengan judul lagu — musik dicari dari YouTube dan ditempel ke stiker (maks 30 detik)',
  usage: '.astc <judul lagu / link YouTube> (reply gambar)',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 10
};

// Audio apa pun -> OGG/Opus (format yang dideklarasikan stickerAudio) + durasi.
async function toOggOpus(buffer) {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const inFile = path.join(os.tmpdir(), `aunumd-astc-in-${id}`);
  const outFile = path.join(os.tmpdir(), `aunumd-astc-out-${id}.ogg`);
  fs.writeFileSync(inFile, buffer);
  try {
    await execFileAsync('ffmpeg', ['-y', '-i', inFile, '-vn', '-t', String(TRIM_SECONDS), '-c:a', 'libopus', '-b:a', '48k', '-ar', '48000', '-ac', '1', outFile], { timeout: 120000 });
    const out = fs.readFileSync(outFile);
    let seconds;
    try {
      const { stdout } = await execFileAsync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', outFile], { timeout: 30000 });
      const d = parseFloat(String(stdout).trim());
      if (Number.isFinite(d) && d > 0) seconds = Math.round(d);
    } catch { /* ffprobe tak ada — durasi memang opsional */ }
    return { buffer: out, seconds };
  } finally {
    try { fs.unlinkSync(inFile); } catch {}
    try { fs.unlinkSync(outFile); } catch {}
  }
}

export default async function (m, ctx) {
  const { sock, text, reply } = ctx;
  const type = m.quoted?.type || '';
  const quotedIsVisual = type.includes('image') || type.includes('video') || type.includes('sticker');
  if (!m.quoted || !quotedIsVisual) {
    return reply(
      `🔊 *AUDIO STICKER*\n\n` +
      `> Reply *gambar/video/stiker* dengan caption:\n> \`${ctx.prefix}astc <judul lagu>\`\n\n` +
      `> Musiknya dicari dari YouTube, dipotong maks ${TRIM_SECONDS} detik, lalu ditempel ke stiker.\n` +
      `> Contoh: \`${ctx.prefix}astc dandelions ruth b\``
    );
  }
  if (!text) return reply(`Pemakaian: ${config.usage} — isi judul lagunya.`);
  if (typeof sock.sendSoundSticker !== 'function') {
    return reply('❌ Library yang terpasang belum mendukung stiker bersuara (butuh @aunucore/baileys ≥ 2.7.0).');
  }
  try {
    await m.react('⏳');
    // --- cari musiknya di YouTube ---
    let id = extractYtId(text);
    if (!id) {
      const first = (await ytSearch(text))[0];
      if (!first) return reply('🎵 Lagu tidak ditemukan di YouTube.');
      id = first.videoId;
    }
    const details = await ytVideo(id);
    const stream = pickAudioStream(details);
    if (!stream?.url) throw new Error('Stream audio tidak tersedia untuk video ini.');
    const audioRaw = await getBuffer(stream.url);
    if (!audioRaw?.length) throw new Error('Audio kosong / gagal diunduh.');
    if (audioRaw.length > MAX_AUDIO_BYTES) throw new Error('Audio terlalu besar (maks 25 MB sebelum dipotong).');
    const { buffer: audioOgg, seconds } = await toOggOpus(audioRaw);
    // --- stiker dari media yang di-reply ---
    const visualBuf = await m.quoted.download();
    if (!visualBuf?.length) throw new Error('Media yang di-reply gagal diunduh.');
    const stickerWebp = type.includes('sticker') ? visualBuf : await makeSticker(visualBuf, type.includes('video'));
    // --- kirim stiker bersuara ---
    await sock.sendSoundSticker(m.chat, { sticker: stickerWebp, audio: audioOgg, ...(seconds ? { seconds } : {}) }, { quoted: m.raw });
    await m.react('✅');
    return reply(`🔊 Stiker bersuara terkirim — 🎵 ${details.title || text}`);
  } catch (e) {
    return reply(`❌ Error: ${e.message}`);
  }
}
