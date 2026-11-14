// AunuMD • Suit batu-gunting-kertas melawan bot, menang dapat 20 saldo
const PILIHAN = ['batu', 'gunting', 'kertas'];
const EMOJI = { batu: '✊', gunting: '✌️', kertas: '🖐️' };
const KALAH_DARI = { batu: 'kertas', gunting: 'batu', kertas: 'gunting' }; // kunci dikalahkan oleh nilai
export const config = { name: 'suit', alias: [], category: 'game', description: 'Suit batu/gunting/kertas melawan bot, menang +20 saldo', usage: '.suit <batu|gunting|kertas>', isOwner: false, isGroup: false, isPrivate: false, cooldown: 3 };
export default async function (m, ctx) {
  const { db } = ctx;
  const beri = (n) => { const u = db.users.get(m.sender) || {}; u.balance = (u.balance || 0) + n; db.users.set(m.sender, u); };
  const user = (ctx.args[0] || ctx.text || '').trim().toLowerCase();
  if (!PILIHAN.includes(user)) return ctx.reply('Pilih dulu senjatamu: *.suit batu*, *.suit gunting*, atau *.suit kertas*');
  const bot = PILIHAN[Math.floor(Math.random() * PILIHAN.length)];
  const kepala = `Kamu: ${EMOJI[user]} *${user}*\nBot: ${EMOJI[bot]} *${bot}*`;
  if (user === bot) return ctx.reply(`${kepala}\n\n🤝 *SERI!* Pilihan kita sama. Tidak ada saldo yang berpindah.`);
  if (KALAH_DARI[user] === bot) {
    return ctx.reply(`${kepala}\n\n😢 *KAMU KALAH!* ${bot} mengalahkan ${user}. Coba lagi ya.`);
  }
  beri(20);
  const saldo = (db.users.get(m.sender) || {}).balance || 0;
  await ctx.reply(`${kepala}\n\n🎉 *KAMU MENANG!* ${user} mengalahkan ${bot}.\n\n💰 +20 saldo\n💼 Saldo kamu sekarang: *${saldo}*`);
}
