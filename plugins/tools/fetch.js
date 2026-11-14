// AunuMD • Ambil dan kirim ulang media dari URL langsung
export const config = {
  name: 'fetch',
  alias: ['get'],
  category: 'tools',
  description: 'Mengambil media/dokumen dari URL dan mengirimkannya',
  usage: '.fetch <url>',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 5
};
const MAX = 20 * 1024 * 1024;
export default async function (m, ctx) {
  const { sock, reply, args } = ctx;
  const url = args[0] || '';
  if (!/^https?:\/\//i.test(url)) return reply('Pemakaian: ' + config.usage);
  try {
    const res = await fetch(url);
    if (!res.ok) return reply(`Gagal mengambil URL (HTTP ${res.status}).`);
    const ct = res.headers.get('content-type') || '';
    if (ct.startsWith('image/')) {
      await sock.sendMessage(m.chat, { image: { url } }, { quoted: m.raw });
    } else if (ct.startsWith('video/')) {
      await sock.sendMessage(m.chat, { video: { url } }, { quoted: m.raw });
    } else if (ct.startsWith('audio/')) {
      await sock.sendMessage(m.chat, { audio: { url }, mimetype: ct }, { quoted: m.raw });
    } else {
      const cl = Number(res.headers.get('content-length') || 0);
      if (cl > MAX) return reply('Ukuran file melebihi batas 20MB.');
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length > MAX) return reply('Ukuran file melebihi batas 20MB.');
      let fileName = 'file';
      try {
        const seg = new URL(url).pathname.split('/').filter(Boolean).pop();
        if (seg) fileName = decodeURIComponent(seg);
      } catch {}
      await sock.sendMessage(
        m.chat,
        { document: buf, fileName, mimetype: ct || 'application/octet-stream' },
        { quoted: m.raw }
      );
    }
  } catch (e) {
    reply('Error: ' + e.message);
  }
}
