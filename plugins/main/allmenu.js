// AunuMD • daftar lengkap semua perintah, dikirim sebagai rich response HTML + fallback teks.
import { buildMenuText } from './menu.js';

export const config = {
  name: 'allmenu',
  alias: ['fullmenu', 'am', 'semua'],
  category: 'main',
  description: 'Semua perintah lengkap per kategori (rich)',
  usage: '.allmenu',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 5
};

function esc(s = '') {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export default async function (m, ctx) {
  const { categories } = ctx.listPlugins();
  const sections = [];
  sections.push(`<h2>${esc(ctx.config.botName)} — Semua Perintah</h2>`);
  for (const [cat, list] of categories) {
    sections.push(`<h3>${esc(cat.toUpperCase())} (${list.length})</h3>`);
    sections.push('<ul>' + list.map((e) =>
      `<li><b>${esc(ctx.prefix + e.config.name)}</b> — ${esc(e.config.description || '')}</li>`).join('') + '</ul>');
  }
  sections.push(`<p><i>Powered by @aunucore/baileys — AunuBaileys by AunuCore Creative Network</i></p>`);
  const html = sections.join('\n');
  try {
    await ctx.sock.sendMessage(m.chat, {
      richHtml: { html, title: `${ctx.config.botName} — Semua Perintah` }
    }, { quoted: m.raw });
    return;
  } catch { /* jatuh ke fallback teks */ }
  await ctx.sock.sendMessage(m.chat, { text: buildMenuText(m, ctx, { full: true }) }, { quoted: m.raw });
}
