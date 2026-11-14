// AunuMD • Ambil isi Pastebin dari URL atau ID (pastebin.com/raw)
import { sendRichText } from '../../src/rich.js';

export const config = {
  name: 'getpaste',
  alias: [],
  category: 'tools',
  description: 'Ambil isi teks sebuah Pastebin dari URL atau ID-nya',
  usage: '.getpaste <url pastebin / ID>',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 5
};

export default async function (m, ctx) {
  let id = (ctx.args[0] || '').trim();
  if (!id) return ctx.reply('Pemakaian: ' + config.usage + '\nContoh: .getpaste https://pastebin.com/AbCdEf12');
  const match = id.match(/pastebin\.com\/(?:raw\/)?([A-Za-z0-9]+)/);
  if (match) id = match[1];
  else id = id.replace(/\/+$/, '').split('/').pop();
  if (!/^[A-Za-z0-9]{4,}$/.test(id)) return ctx.reply('ID Pastebin tidak valid.');
  try {
    const res = await fetch(`https://pastebin.com/raw/${id}`, { signal: AbortSignal.timeout(20000) });
    if (!res.ok) throw new Error(`Pastebin HTTP ${res.status} (paste mungkin tidak ada / privat).`);
    const text = await res.text();
    if (!text.trim()) return ctx.reply('Paste kosong atau tidak ditemukan.');
    if (/^Error, this is a private paste/i.test(text.trim())) return ctx.reply('Paste tersebut privat dan tidak bisa diakses.');
    const header = `📋 *Pastebin ${id}*\n\n`;
    try {
      return await sendRichText(ctx.sock, m.chat, header + text, { quoted: m.raw, title: 'AunuMD • getpaste' });
    } catch {
      return ctx.reply(header + text.slice(0, 4000));
    }
  } catch (e) {
    return ctx.reply('Error getpaste: ' + e.message);
  }
}
