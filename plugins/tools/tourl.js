// AunuMD • Upload media yang di-reply ke host berkas publik (0x0.st → catbox → uguu → tmpfiles)
export const config = {
  name: 'tourl',
  alias: ['upload'],
  category: 'tools',
  description: 'Upload media yang di-reply dan dapatkan URL publiknya (beberapa host cadangan)',
  usage: '.tourl (reply gambar/video/audio/dokumen)',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 10
};

const TIMEOUT = 60000;

function guessName(type = '') {
  if (type.includes('sticker')) return 'file.webp';
  if (type.includes('image')) return 'file.png';
  if (type.includes('video')) return 'file.mp4';
  if (type.includes('audio')) return 'file.mp3';
  return 'file.bin';
}

async function try0x0(buf) {
  const fd = new FormData();
  fd.append('file', new Blob([buf]), 'file.bin');
  const res = await fetch('https://0x0.st', {
    method: 'POST',
    headers: { 'User-Agent': 'AunuMD/1.0' },
    body: fd,
    signal: AbortSignal.timeout(TIMEOUT)
  });
  const text = (await res.text()).trim();
  if (!res.ok || !/^https?:\/\//.test(text)) throw new Error(text.slice(0, 120) || `HTTP ${res.status}`);
  return text;
}

async function tryCatbox(buf, name) {
  const fd = new FormData();
  fd.append('reqtype', 'fileupload');
  fd.append('fileToUpload', new Blob([buf]), name);
  const res = await fetch('https://catbox.moe/user/api.php', { method: 'POST', body: fd, signal: AbortSignal.timeout(TIMEOUT) });
  const text = (await res.text()).trim();
  if (!res.ok || !/^https?:\/\//.test(text)) throw new Error(text.slice(0, 120) || `HTTP ${res.status}`);
  return text;
}

async function tryUguu(buf, name) {
  const fd = new FormData();
  fd.append('files[]', new Blob([buf]), name);
  const res = await fetch('https://uguu.se/upload.php', { method: 'POST', body: fd, signal: AbortSignal.timeout(TIMEOUT) });
  const json = await res.json().catch(() => null);
  const url = json?.files?.[0]?.url;
  if (!res.ok || !url) throw new Error('uguu tidak mengembalikan URL.');
  return url;
}

async function tryTmpfiles(buf, name) {
  const fd = new FormData();
  fd.append('file', new Blob([buf]), name);
  const res = await fetch('https://tmpfiles.org/api/v1/upload', { method: 'POST', body: fd, signal: AbortSignal.timeout(TIMEOUT) });
  const json = await res.json().catch(() => null);
  const url = json?.data?.url;
  if (!res.ok || !url) throw new Error('tmpfiles tidak mengembalikan URL.');
  return url;
}

export default async function (m, ctx) {
  if (!m.quoted || typeof m.quoted.download !== 'function') {
    return ctx.reply('Pemakaian: ' + config.usage);
  }
  const buf = await m.quoted.download();
  if (!buf) return ctx.reply('Error: gagal mengunduh media yang di-reply.');
  const name = guessName(String(m.quoted.type || ''));
  const hosts = [
    ['0x0.st', () => try0x0(buf)],
    ['catbox.moe', () => tryCatbox(buf, name)],
    ['uguu.se', () => tryUguu(buf, name)],
    ['tmpfiles.org', () => tryTmpfiles(buf, name)]
  ];
  const failures = [];
  for (const [label, fn] of hosts) {
    try {
      const url = await fn();
      return ctx.reply(`✅ *Upload berhasil* (via ${label})\n\n${url}`);
    } catch (e) {
      failures.push(`${label}: ${e.message}`);
    }
  }
  return ctx.reply('❌ Semua host upload gagal:\n' + failures.map((f) => '• ' + f).join('\n'));
}
