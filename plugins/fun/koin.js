// AunuMD • Lempar koin kepala/ekor
export const config = { name: 'koin', alias: ['coinflip'], category: 'fun', description: 'Lempar koin: Kepala atau Ekor', usage: '.koin', isOwner: false, isGroup: false, isPrivate: false, cooldown: 3 };

export default async function (m, ctx) {
  const kepala = Math.random() < 0.5;
  await m.react('🪙');
  return ctx.reply(kepala
    ? '🪙 Koin berputar-putar… dan hasilnya: *KEPALA*! 👑'
    : '🪙 Koin berputar-putar… dan hasilnya: *EKOR*! 🦅');
}
