// AunuMD • scraper mandiri (tanpa kunci API pihak ketiga): TikTok via tikwm,
// YouTube via instance Invidious publik, gambar anime via nekos.life.
// Setiap fungsi melempar Error berpesan jelas bila endpoint gagal — plugin yang menangkapnya.
const INVIDIOUS = 'https://yt.chocolatemoo53.com';
const UA = { 'user-agent': 'Mozilla/5.0 (AunuMD Bot)' };

async function fetchJson(url, timeout = 25000) {
  const res = await fetch(url, { headers: UA, signal: AbortSignal.timeout(timeout) });
  if (!res.ok) throw new Error(`HTTP ${res.status} dari ${new URL(url).hostname}`);
  return res.json();
}

// ---------- TikTok (tikwm) ----------
export async function tiktokDownload(videoUrl) {
  const json = await fetchJson(`https://www.tikwm.com/api/?url=${encodeURIComponent(videoUrl)}&hd=1`);
  if (json.code !== 0 || !json.data) {
    throw new Error(`tikwm: ${json.msg || 'gagal memproses tautan'} (coba lagi sebentar, batas API gratis 1 req/detik)`);
  }
  return json.data; // { play, hdplay, title, author: { nickname }, music, duration, ... }
}

// ---------- YouTube (Invidious) ----------
export function extractYtId(input = '') {
  const s = String(input).trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(s)) return s;
  const m = /(?:youtube\.com\/(?:watch\?v=|shorts\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/.exec(s);
  return m ? m[1] : null;
}

export async function ytSearch(query, page = 1) {
  const json = await fetchJson(`${INVIDIOUS}/api/v1/search?q=${encodeURIComponent(query)}&type=video&page=${page}`);
  return (Array.isArray(json) ? json : []).filter((v) => v.type === 'video');
}

export async function ytVideo(id) {
  return fetchJson(`${INVIDIOUS}/api/v1/videos/${encodeURIComponent(id)}`);
}

export function pickVideoStream(details) {
  const streams = details?.formatStreams || [];
  if (!streams.length) return null;
  const height = (s) => parseInt(String(s.qualityLabel || '').replace(/\D/g, ''), 10) || 0;
  return [...streams].sort((a, b) => height(a) - height(b)).at(-1);
}

export function pickAudioStream(details) {
  const formats = (details?.adaptiveFormats || []).filter((f) => String(f.type || '').startsWith('audio'));
  if (!formats.length) return null;
  return [...formats].sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0))[0];
}

// ---------- Gambar anime (nekos.life) ----------
export const NEKO_CATEGORIES = ['neko', 'waifu', 'avatar', 'hug', 'kiss', 'pat', 'wink', 'dance', 'cuddle', 'feed', 'tickle', 'fox_girl', 'gecg', 'goose', 'wallpaper'];
export async function nekoImage(category = 'neko') {
  const json = await fetchJson(`https://nekos.life/api/v2/img/${encodeURIComponent(category)}`);
  if (!json.url) throw new Error('nekos.life tidak mengembalikan gambar.');
  return json.url;
}

export default { tiktokDownload, extractYtId, ytSearch, ytVideo, pickVideoStream, pickAudioStream, nekoImage, NEKO_CATEGORIES };
