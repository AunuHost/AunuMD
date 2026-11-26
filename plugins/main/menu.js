// AunuMD • menu utama rich: kartu interaktif AunuCard + fallback teks. Selalu mencantumkan library yang dipakai.
import { createRequire } from 'node:module';
import { sendCard, CARD_ENABLED } from '../../src/card.js';

const require = createRequire(import.meta.url);
let LIB_VERSION = 'unknown';
try { LIB_VERSION = require('@aunucore/baileys/package.json').version; } catch {}

export const config = {
  name: 'menu',
  alias: ['help', 'start'],
  category: 'main',
  description: 'Menu utama bot (kartu rich)',
  usage: '.menu',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 3
};

export const POWERED_LINE = `⚡ Powered by @aunucore/baileys v${LIB_VERSION} — AunuBaileys by AunuCore Creative Network`;

const CATEGORY_LABELS = {
  main: '🏠 Utama', aunu: '✨ AunuBaileys Experimental', group: '👥 Grup',
  owner: '👑 Owner', tools: '🧰 Tools', newsletter: '📰 Newsletter', scrape: '🌐 Scraper',
  fun: '🎭 Fun', game: '🎮 Game', rpg: '🗺️ RPG', cek: '🔍 Cek & Ramalan',
  islamic: '🕌 Islami', random: '🎲 Random', info: 'ℹ️ Info',
  sticker: '🎨 Sticker & Maker', canvas: '🖼️ Canvas'
};
const CATEGORY_ORDER = ['main', 'aunu', 'sticker', 'canvas', 'fun', 'game', 'rpg', 'group', 'tools', 'cek', 'islamic', 'random', 'newsletter', 'scrape', 'info', 'owner'];

export function buildMenuText(m, ctx, { full = false } = {}) {
  const { categories } = ctx.listPlugins();
  const lines = [];
  lines.push(`Halo, *${m.pushName || 'kawan'}* 👋`);
  lines.push(`Saya *${ctx.config.botName}*, bot WhatsApp Multi-Device.`);
  lines.push('');
  const cats = [...categories.keys()].sort((a, b) => {
    const ia = CATEGORY_ORDER.indexOf(a), ib = CATEGORY_ORDER.indexOf(b);
    return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
  });
  for (const cat of cats) {
    const list = categories.get(cat) || [];
    lines.push(`${CATEGORY_LABELS[cat] || ('📁 ' + cat)} — ${list.length} perintah`);
    if (full) {
      for (const e of list) lines.push(`  ${ctx.prefix}${e.config.name} — ${e.config.description || ''}`);
    }
  }
  if (!full) lines.push('', `Ketik *${ctx.prefix}allmenu* untuk daftar lengkap semua perintah.`);
  lines.push('', POWERED_LINE);
  return lines.join('\n');
}

export default async function (m, ctx) {
  const text = buildMenuText(m, ctx);
  // Jalur rich: kartu interaktif dengan foto header + tombol balas cepat.
  // (Nonaktif selama CARD_ENABLED false — langsung ke fallback teks di bawah.)
  if (CARD_ENABLED) try {
    let image;
    if (m.quoted && String(m.quoted.type).includes('image')) {
      image = await m.quoted.download().catch(() => null) || undefined;
    }
    if (!image && ctx.config.thumbnail) image = ctx.config.thumbnail; // string: URL atau path lokal — diselesaikan+di-cache oleh sendCard
    await sendCard(ctx.sock, m.chat, {
      title: ctx.config.botName,
      subtitle: 'WhatsApp Multi-Device Bot',
      text,
      footer: POWERED_LINE,
      image,
      buttons: [
        { type: 'reply', displayText: '📋 Semua Perintah', id: `${ctx.prefix}allmenu` },
        { type: 'reply', displayText: '🩺 Cek Kesehatan Bot', id: `${ctx.prefix}doctor` },
        { type: 'url', displayText: '🌐 AunuCore', url: ctx.config.web || 'https://ai.aunuhost.bond' }
      ]
    });
    return;
  } catch { /* jatuh ke fallback teks */ }
  await ctx.sock.sendMessage(m.chat, { text }, { quoted: m.raw });
}
