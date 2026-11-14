// AunuMD • info bot hidup: laporan aunuDoctor ditampilkan sebagai langkah BotSteps yang ter-update di tempat.
export const config = {
  name: 'botinfo',
  alias: ['info', 'about'],
  category: 'main',
  description: 'Info & kesehatan bot (BotSteps rich)',
  usage: '.botinfo',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 5
};

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

export default async function (m, ctx) {
  const { total } = ctx.listPlugins();
  try {
    const r = ctx.sock.aunuDoctor();
    const ctl = await ctx.sock.aunuBotSteps(m.chat, {
      title: ctx.config.botName,
      body: 'Mengumpulkan info bot…',
      sections: [
        { title: 'Library', body: `@aunucore/baileys — WA v${r.bundledWaVersion || '-'}` },
        { title: 'Koneksi', body: `WebSocket: ${r.wsOpen ? 'terbuka' : 'tertutup'} • Terdaftar: ${r.registered ? 'ya' : 'belum'}` }
      ]
    });
    await wait(700);
    await ctl.step({
      body: `Halo, saya *${ctx.config.botName}*.\n• Akun: ${r.me || '-'}\n• Pasangan LID dikenal: ${r.lidPairsKnown ?? '-'}\n• Terjadwal menunggu: ${r.scheduledPending} • Musnah-sendiri menunggu: ${r.selfDestructPending}\n• Plugin aktif: ${total} • Node ${process.version}\n\n⚡ Powered by @aunucore/baileys — AunuBaileys by AunuCore Creative Network`
    });
    await ctl.done('Info bot selesai ✓');
    return;
  } catch { /* jatuh ke teks biasa */ }
  let extra = '';
  try {
    const r = ctx.sock.aunuDoctor();
    extra = `\n• WA versi paket: ${r.bundledWaVersion || '-'}\n• WebSocket: ${r.wsOpen ? 'terbuka' : 'tertutup'}`;
  } catch {}
  await m.reply(`🤖 *${ctx.config.botName}*\n• Plugin aktif: ${total}\n• Node: ${process.version} (${process.platform})${extra}\n\n⚡ Powered by @aunucore/baileys — AunuBaileys by AunuCore Creative Network`);
}
