// AunuMD • gabung 2 emoji menjadi satu stiker via Emoji Kitchen (gstatic).
import { makeSticker } from '../../src/helper.js';

export const config = {
  name: 'emojimix',
  alias: ['mixemoji'],
  category: 'sticker',
  description: 'Menggabungkan 2 emoji menjadi 1 stiker (Emoji Kitchen)',
  usage: '.emojimix <emoji1><emoji2>',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 5
};

const DATES = ['20230301', '20201001', '20220503', '20210831'];

function pickEmojis(text) {
  const tokens = text.trim().split(/\s+/).filter(Boolean);
  if (tokens.length >= 2) return [tokens[0], tokens[1]];
  const seg = new Intl.Segmenter('en', { granularity: 'grapheme' });
  const parts = [...seg.segment(text.trim())]
    .map((s) => s.segment)
    .filter((s) => /\p{Extended_Pictographic}/u.test(s));
  return parts.slice(0, 2);
}

function cpString(emoji) {
  return [...emoji]
    .map((c) => 'u' + c.codePointAt(0).toString(16))
    .filter((s) => s !== 'ufe0f')
    .join('_');
}

export default async function (m, ctx) {
  const text = (ctx.text || '').trim();
  if (!text) {
    return ctx.reply(`🎭 *EMOJI MIX*\n\n> Gabungkan 2 emoji menjadi 1 stiker\n\nContoh: \`${ctx.prefix}emojimix 😂🔥\``);
  }
  const [e1, e2] = pickEmojis(text);
  if (!e1 || !e2) {
    return ctx.reply(`❌ Masukkan minimal 2 emoji!\n\nContoh: \`${ctx.prefix}emojimix 😂🔥\``);
  }

  const pairs = [
    [cpString(e1), cpString(e2)],
    [cpString(e2), cpString(e1)]
  ];

  for (const date of DATES) {
    for (const [a, b] of pairs) {
      const firstCp = a.split('_')[0];
      const url = `https://www.gstatic.com/android/keyboard/emojikitchen/${date}/${firstCp}/${a}_${b}.png`;
      try {
        const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
        if (!res.ok) continue;
        const png = Buffer.from(await res.arrayBuffer());
        if (!png.length) continue;
        const webp = await makeSticker(png);
        await ctx.sock.sendMessage(m.chat, { sticker: webp }, { quoted: m.raw });
        return;
      } catch { /* coba kombinasi berikutnya */ }
    }
  }
  return ctx.reply('Kombinasi emoji itu tidak tersedia di Emoji Kitchen.');
}
