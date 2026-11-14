// AunuMD • Screenshot halaman web via thum.io (desktop / --mobile)
export const config = {
  name: 'ssweb',
  alias: ['ss'],
  category: 'tools',
  description: 'Ambil screenshot halaman web (tambah --mobile untuk tampilan ponsel)',
  usage: '.ssweb <url> [--mobile]',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 10
};

export default async function (m, ctx) {
  const args = [...(ctx.args || [])];
  const mobileIdx = args.findIndex((a) => a === '--mobile');
  const mobile = mobileIdx !== -1;
  if (mobile) args.splice(mobileIdx, 1);
  let target = (args.join(' ') || '').trim();
  if (!target) return ctx.reply('Pemakaian: ' + config.usage);
  if (!/^https?:\/\//i.test(target)) target = 'https://' + target;
  const width = mobile ? 720 : 1920;
  const shotUrl = `https://image.thum.io/get/width/${width}/crop/1080/noanimate/${target}`;
  try {
    const res = await fetch(shotUrl, { signal: AbortSignal.timeout(60000) });
    if (!res.ok) throw new Error(`thum.io HTTP ${res.status}`);
    const img = Buffer.from(await res.arrayBuffer());
    return ctx.sock.sendMessage(m.chat, { image: img, caption: `🌐 Screenshot: ${target}` }, { quoted: m.raw });
  } catch (e) {
    return ctx.reply('Error ssweb: ' + e.message);
  }
}
