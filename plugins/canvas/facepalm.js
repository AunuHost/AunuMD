// AunuMD • Tempel foto ke template facepalm transparan
import { createCanvas, loadImage } from '../../src/canvas.js';
import { getBuffer } from '../../src/helper.js';

export const config = {
  name: 'facepalm',
  alias: [],
  category: 'canvas',
  description: 'Menempelkan foto ke template meme facepalm',
  usage: '.facepalm (balas foto, atau pakai foto profilmu)',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 5
};

const TEMPLATE_URLS = [
  'https://raw.githubusercontent.com/BochilGaming/games-wabot/master/images/facepalm.png',
  'https://raw.githubusercontent.com/BochilGaming/games-wabot/master/src/image/facepalm.png'
];

export default async function (m, ctx) {
  try {
    // unduh template transparan
    let tplBuf = null;
    for (const u of TEMPLATE_URLS) {
      try { tplBuf = await getBuffer(u); if (tplBuf && tplBuf.length > 1000) break; tplBuf = null; } catch { /* coba URL berikutnya */ }
    }
    if (!tplBuf) return ctx.reply('Gagal mengunduh template facepalm dari GitHub. Coba lagi nanti.');
    // foto user: quoted image, atau foto profil pengirim
    let photoBuf = null;
    if (m.quoted && /image/.test(m.quoted.type || '')) {
      photoBuf = await m.quoted.download().catch(() => null);
    }
    if (!photoBuf) {
      try {
        const url = await ctx.sock.profilePictureUrl(m.sender, 'image').catch(() => null);
        if (url) photoBuf = await getBuffer(url);
      } catch { /* abaikan */ }
    }
    if (!photoBuf) return ctx.reply('Balas sebuah foto, atau pastikan kamu punya foto profil untuk dipakai.');
    const tpl = await loadImage(tplBuf);
    const photo = await loadImage(photoBuf);
    const canvas = createCanvas(tpl.width, tpl.height);
    const c = canvas.getContext('2d');
    // foto user menutupi penuh di belakang; area wajah transparan template akan menampakannya
    const s = Math.max(tpl.width / photo.width, tpl.height / photo.height);
    const dw = photo.width * s, dh = photo.height * s;
    c.drawImage(photo, (tpl.width - dw) / 2, (tpl.height - dh) / 2, dw, dh);
    c.drawImage(tpl, 0, 0);
    const png = await canvas.encode('png');
    await ctx.sock.sendMessage(m.chat, { image: png, caption: '🤦 Facepalm!' }, { quoted: m.raw });
  } catch (e) {
    return ctx.reply('Error: ' + e.message);
  }
}
