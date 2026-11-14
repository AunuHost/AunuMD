// AunuMD • level pengirim berdasarkan jumlah pesan, lengkap dengan progress bar.
export const config = {
  name: 'level',
  alias: [],
  category: 'info',
  description: 'Cek level dan progres pesanmu',
  usage: '.level',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 3
};

export default async function (m, ctx) {
  const u = ctx.db.users.get(m.sender) || {};
  const msgs = u.msgs || 0;
  const level = 1 + Math.floor(Math.sqrt(msgs / 50));
  const floorNow = Math.pow(level - 1, 2) * 50;
  const next = Math.pow(level, 2) * 50;
  const kurang = next - msgs;
  const progress = Math.min(1, Math.max(0, (msgs - floorNow) / (next - floorNow)));
  const filled = Math.round(progress * 10);
  const bar = '█'.repeat(filled) + '░'.repeat(10 - filled);
  await ctx.reply(
    `⭐ *Level Kamu*\n\n` +
    `🏅 Level: ${level}\n` +
    `💬 Total pesan: ${msgs}\n` +
    `📊 Progress: [${bar}] ${Math.floor(progress * 100)}%\n` +
    `🎯 Butuh ${kurang} pesan lagi untuk naik ke level ${level + 1}.`
  );
}
