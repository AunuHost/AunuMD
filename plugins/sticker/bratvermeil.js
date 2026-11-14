// AunuMD • stiker brat di atas template Vermeil: teks digambar pada zona aman template (canvas lokal).
import { getBuffer, makeSticker } from '../../src/helper.js';
import { createCanvas, loadImage, wrapText, ensureFonts } from '../../src/canvas.js';

export const config = {
  name: 'bratvermeil',
  alias: [],
  category: 'sticker',
  description: 'Membuat stiker brat dengan template Vermeil',
  usage: '.bratvermeil <teks>',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 5
};

const TEMPLATE_URL = 'https://raw.githubusercontent.com/Ditzzx-vibecoder/Assets/main/Brat/Vermile.jpg';
// Zona aman teks pada kanvas 1254x1254 (kiri, atas, kanan, bawah dari template asli).
const ZONE = { left: 282, top: 655, right: 993, bottom: 1118 };
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

export default async function (m, ctx) {
  const text = (ctx.text || '').trim() || (m.quoted?.text || '').trim();
  if (!text) {
    return ctx.reply(`🖼️ *BRAT VERMEIL*\n\n> Masukkan teks\n\nContoh: \`${ctx.prefix}bratvermeil Halo semuanya\``);
  }
  try {
    ensureFonts();
    const img = await loadImage(await getTemplate());
    const png = await renderFrame(img, text).encode('png');
    const webp = await makeSticker(png);
    await ctx.sock.sendMessage(m.chat, { sticker: webp }, { quoted: m.raw });
  } catch (e) {
    return ctx.reply(`❌ Gagal membuat stiker brat vermeil: ${e.message}`);
  }
}
