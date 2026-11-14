// AunuMD • helper gambar berbasis @napi-rs/canvas (brat, ttp, meme, quote card, pixelate)
import { createCanvas, loadImage, GlobalFonts } from '@napi-rs/canvas';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const FONT_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'assets', 'fonts');
let fontsReady = false;

export function ensureFonts() {
  if (fontsReady) return;
  fontsReady = true;
  const wanted = [
    ['Poppins.ttf', 'Poppins'],
    ['Inter.ttf', 'Inter'],
    ['Caveat.ttf', 'Caveat'],
    ['PlusJakartaSans.ttf', 'Plus Jakarta Sans']
  ];
  for (const [file, family] of wanted) {
    const p = path.join(FONT_DIR, file);
    if (fs.existsSync(p)) { try { GlobalFonts.registerFromPath(p, family); } catch { /* fallback sistem */ } }
  }
}

export { createCanvas, loadImage };

export function roundRectPath(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

export function wrapText(ctx, text, maxWidth) {
  const out = [];
  for (const para of String(text).split('\n')) {
    const words = para.split(/\s+/).filter(Boolean);
    if (!words.length) { out.push(''); continue; }
    let line = '';
    for (const word of words) {
      if (ctx.measureText(word).width > maxWidth) {
        if (line) { out.push(line); line = ''; }
        let chunk = '';
        for (const ch of word) {
          if (ctx.measureText(chunk + ch).width > maxWidth) { out.push(chunk); chunk = ch; } else chunk += ch;
        }
        line = chunk;
        continue;
      }
      const trial = line ? line + ' ' + word : word;
      if (ctx.measureText(trial).width > maxWidth) { out.push(line); line = word; } else line = trial;
    }
    if (line) out.push(line);
  }
  return out;
}

// Gambar teks memenuhi kanvas (gaya brat/ttp): ukuran font dicari agar blok teks pas.
export function drawTextBlock(ctx, text, { x, y, maxWidth, maxHeight, family = 'Poppins', weight = 'bold', color = '#000000', align = 'left', startPx = 96, minPx = 14, lineHeightRatio = 1.12 }) {
  ensureFonts();
  let px = startPx;
  let lines = [];
  while (px > minPx) {
    ctx.font = `${weight} ${px}px ${family}, sans-serif`;
    lines = wrapText(ctx, text, maxWidth);
    if (lines.length * px * lineHeightRatio <= maxHeight) break;
    px -= 4;
  }
  ctx.font = `${weight} ${px}px ${family}, sans-serif`;
  ctx.fillStyle = color;
  ctx.textBaseline = 'top';
  ctx.textAlign = align;
  const drawX = align === 'center' ? x + maxWidth / 2 : x;
  lines.forEach((line, i) => ctx.fillText(line, drawX, y + i * px * lineHeightRatio));
  return { px, lines, height: lines.length * px * lineHeightRatio };
}

// Stiker teks polos: kanvas persegi, latar opsional, teks di tengah.
export async function textStickerPng(text, { bg = null, fg = '#000000', family = 'Poppins', size = 512 } = {}) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  if (bg) { ctx.fillStyle = bg; ctx.fillRect(0, 0, size, size); }
  drawTextBlock(ctx, text, { x: 28, y: 28, maxWidth: size - 56, maxHeight: size - 56, family, color: fg, align: 'left', startPx: 110 });
  return canvas.encode('png');
}

// Gaya "brat": latar putih (atau hijau), teks hitam memenuhi kanvas dari kiri-atas.
export async function bratPng(text, { bg = '#ffffff', fg = '#000000', size = 512 } = {}) {
  return textStickerPng(text, { bg, fg, size });
}

// Meme: gambar menutupi 512x512 + teks impact atas/bawah.
export async function memePng(imageBuffer, top = '', bottom = '') {
  ensureFonts();
  const img = await loadImage(imageBuffer);
  const size = 512;
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  const scale = Math.max(size / img.width, size / img.height);
  const w = img.width * scale, h = img.height * scale;
  ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
  const drawCap = (txt, isTop) => {
    if (!txt) return;
    let px = 46;
    let lines = [];
    do {
      ctx.font = `bold ${px}px Poppins, sans-serif`;
      lines = wrapText(ctx, txt.toUpperCase(), size - 32);
      px -= 3;
    } while ((lines.length > 3 || ctx.measureText(lines[0] || '').width > size - 24) && px > 16);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    const lh = px * 1.15;
    lines.forEach((line, i) => {
      const yy = isTop ? 12 + i * lh : size - 12 - (lines.length - i) * lh;
      ctx.lineWidth = Math.max(4, px / 7);
      ctx.strokeStyle = '#000000';
      ctx.strokeText(line, size / 2, yy);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(line, size / 2, yy);
    });
  };
  drawCap(top, true);
  drawCap(bottom, false);
  return canvas.encode('png');
}

// Kartu quote ala chat (dipakai iqc/quote lokal): gelembung gelap + avatar + nama berwarna.
export async function quoteCardPng({ name = 'Pengguna', text = '', avatarBuffer = null, nameColor = '#53bdeb', dark = true }) {
  ensureFonts();
  const width = 720;
  const pad = 28;
  const avatarR = 34;
  const textX = pad + avatarR * 2 + 20;
  const maxText = width - textX - pad;
  const meas = createCanvas(8, 8).getContext('2d');
  meas.font = '30px Inter, sans-serif';
  const lines = wrapText(meas, text, maxText);
  const textH = lines.length * 38;
  const height = Math.max(pad * 2 + textH + 34, pad * 2 + avatarR * 2);
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = dark ? '#111b21' : '#ffffff';
  ctx.fillRect(0, 0, width, height);
  roundRectPath(ctx, 12, 12, width - 24, height - 24, 24);
  ctx.fillStyle = dark ? '#1f2c34' : '#f0f2f5';
  ctx.fill();
  // avatar
  ctx.save();
  ctx.beginPath();
  ctx.arc(pad + avatarR, pad + avatarR, avatarR, 0, Math.PI * 2);
  ctx.clip();
  if (avatarBuffer) {
    try {
      const av = await loadImage(avatarBuffer);
      ctx.drawImage(av, pad, pad, avatarR * 2, avatarR * 2);
    } catch { ctx.fillStyle = '#3b4a54'; ctx.fillRect(pad, pad, avatarR * 2, avatarR * 2); }
  } else { ctx.fillStyle = '#3b4a54'; ctx.fillRect(pad, pad, avatarR * 2, avatarR * 2); }
  ctx.restore();
  ctx.textBaseline = 'top';
  ctx.textAlign = 'left';
  ctx.font = 'bold 27px Inter, sans-serif';
  ctx.fillStyle = nameColor;
  ctx.fillText(String(name).slice(0, 40), textX, pad + 2);
  ctx.font = '30px Inter, sans-serif';
  ctx.fillStyle = dark ? '#e9edef' : '#111b21';
  lines.forEach((line, i) => ctx.fillText(line, textX, pad + 40 + i * 38));
  return canvas.encode('png');
}

// Pixel art: perkecil tajam lalu besarkan tanpa smoothing.
export async function pixelatePng(imageBuffer, level = 12) {
  const img = await loadImage(imageBuffer);
  const blocks = Math.max(4, Math.min(64, Math.round(level)));
  const scale = blocks / Math.max(img.width, img.height);
  const sw = Math.max(1, Math.round(img.width * scale));
  const sh = Math.max(1, Math.round(img.height * scale));
  const small = createCanvas(sw, sh);
  const sctx = small.getContext('2d');
  sctx.drawImage(img, 0, 0, sw, sh);
  const out = createCanvas(img.width, img.height);
  const octx = out.getContext('2d');
  octx.imageSmoothingEnabled = false;
  octx.drawImage(small, 0, 0, img.width, img.height);
  return out.encode('png');
}
