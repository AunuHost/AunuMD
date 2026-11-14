// AunuMD • stiker quote chat (avatar + nama + teks) dengan warna latar pilihan, via API siputzx; fallback kartu quote lokal.
import { getBuffer, makeSticker } from '../../src/helper.js';
import { quoteCardPng } from '../../src/canvas.js';

export const config = {
  name: 'qc',
  alias: ['q', 'quote'],
  category: 'sticker',
  description: 'Membuat stiker quote chat dengan warna custom',
  usage: '.qc <warna> <teks> atau reply pesan + .qc <warna>',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 5
};

const COLORS = {
  pink: '#f68ac9', blue: '#6cace4', red: '#f44336', green: '#4caf50',
  yellow: '#ffeb3b', purple: '#9c27b0', darkblue: '#0d47a1', lightblue: '#03a9f4',
  ash: '#9e9e9e', orange: '#ff9800', black: '#000000', white: '#ffffff',
  teal: '#008080', lightpink: '#FFC0CB', chocolate: '#A52A2A', salmon: '#FFA07A',
  magenta: '#FF00FF', tan: '#D2B48C', wheat: '#F5DEB3', deeppink: '#FF1493',
  fire: '#B22222', skyblue: '#00BFFF', brightskyblue: '#1E90FF', hotpink: '#FF69B4',
  lightskyblue: '#87CEEB', seagreen: '#20B2AA', darkred: '#8B0000', orangered: '#FF4500',
  cyan: '#48D1CC', violet: '#BA55D3', mossgreen: '#00FF7F', darkgreen: '#008000',
  navyblue: '#191970', darkorange: '#FF8C00', darkpurple: '#9400D3', fuchsia: '#FF00FF',
  darkmagenta: '#8B008B', darkgray: '#2F4F4F', peachpuff: '#FFDAB9', darkishgreen: '#BDB76B',
  darkishred: '#DC143C', goldenrod: '#DAA520', darkishgray: '#696969', darkishpurple: '#483D8B',
  gold: '#FFD700', silver: '#C0C0C0'
};

const DEFAULT_PP = 'https://files.catbox.moe/nwvkbt.png';

export default async function (m, ctx) {
  const args = ctx.args || [];
  let colorName = null;
  let message = (ctx.text || '').trim();

  if (args.length && COLORS[String(args[0]).toLowerCase()]) {
    colorName = String(args[0]).toLowerCase();
    message = args.slice(1).join(' ').trim();
  }
  if (!colorName) {
    const keys = Object.keys(COLORS);
    colorName = keys[Math.floor(Math.random() * keys.length)];
  }
  const backgroundColor = COLORS[colorName];

  // Pembicara default = pengirim; bila teks dari quoted, pembicara = pengirim quoted.
  let speaker = m.sender;
  let speakerName = m.pushName || 'Pengguna';
  if (!message && m.quoted?.text) {
    message = String(m.quoted.text).trim();
    if (m.quoted.sender) {
      speaker = m.quoted.sender;
      let saved = null;
      try { saved = ctx.db?.users?.get?.(m.quoted.sender)?.name || null; } catch { /* abaikan */ }
      speakerName = saved || String(m.quoted.sender).split('@')[0];
    }
  }

  if (!message) {
    const colorList = Object.keys(COLORS).join(', ');
    return ctx.reply(
      `💬 *QUOTE STICKER*\n\n` +
      `Cara pakai:\n` +
      `• \`${ctx.prefix}qc <warna> <teks>\`\n` +
      `• Reply pesan + \`${ctx.prefix}qc <warna>\`\n` +
      `• \`${ctx.prefix}qc <teks>\` (warna acak)\n\n` +
      `Contoh: \`${ctx.prefix}qc pink Hai semuanya!\`\n\n` +
      `🎨 *Warna:* ${colorList}`
    );
  }
  if (message.length > 80) {
    return ctx.reply(`❌ Teks terlalu panjang! Maksimal 80 karakter (saat ini: ${message.length}).`);
  }

  let avatarUrl = null;
  try { avatarUrl = await ctx.sock.profilePictureUrl(speaker, 'image'); } catch { /* pakai default */ }
  if (!avatarUrl) avatarUrl = DEFAULT_PP;

  const payload = {
    messages: [
      {
        from: {
          id: Math.floor(Math.random() * 10),
          first_name: speakerName,
          last_name: '',
          name: '',
          photo: { url: avatarUrl }
        },
        text: message,
        entities: [],
        avatar: true,
        media: { url: '' },
        mediaType: '',
        replyMessage: { name: '', text: '', entities: [], chatId: Math.floor(Math.random() * 10) }
      }
    ],
    backgroundColor,
    width: 512,
    height: 512,
    scale: 2,
    type: 'quote',
    format: 'png',
    emojiStyle: 'apple'
  };

  let png = null;
  try {
    const res = await fetch('https://brat.siputzx.my.id/quoted', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(90000)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    png = Buffer.from(await res.arrayBuffer());
    if (!png.length) throw new Error('Respons kosong');
  } catch {
    // Fallback lokal: kartu quote digambar dengan canvas.
    let avatarBuffer = null;
    try { avatarBuffer = await getBuffer(avatarUrl); } catch { /* tanpa avatar */ }
    png = await quoteCardPng({ name: speakerName, text: message, avatarBuffer, nameColor: backgroundColor });
  }

  const webp = await makeSticker(png);
  await ctx.sock.sendMessage(m.chat, { sticker: webp }, { quoted: m.raw });
}
