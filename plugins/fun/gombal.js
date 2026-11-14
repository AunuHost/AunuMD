// AunuMD • Kalimat gombal lucu acak
export const config = { name: 'gombal', alias: ['gombalan'], category: 'fun', description: 'Rayuan gombal lucu acak', usage: '.gombal', isOwner: false, isGroup: false, isPrivate: false, cooldown: 3 };

const GOMBAL = [
  'Kamu tahu bedanya kamu sama lukisan? Lukisan makin lama makin antik, kamu makin lama makin cantik.',
  'Kalau kamu jadi matahari, aku rela jadi bumi yang selalu mengorbit di dekatmu.',
  'Bapak kamu tukang kebun ya? Soalnya kamu bikin hatiku berbunga-bunga.',
  'Kamu itu kayak WiFi, soalnya aku merasa selalu terhubung sama kamu.',
  'Sejak kenal kamu, aku jadi tahu kenapa bintang kalah terang.',
  'Kamu punya peta nggak? Aku tersesat di matamu.',
  'Kalau disuruh melupakanmu, aku butuh ingatan baru, soalnya yang ini isinya kamu semua.',
  'Kamu kayak kopi di pagi hari: bikin aku semangat menjalani hari.',
  'Aku rela jadi sandal jepit, asal bisa selalu melangkah bersamamu. Eh, tapi jangan diinjak ya.',
  'Tau nggak kenapa donat tengahnya bolong? Karena yang utuh cuma cintaku padamu.',
  'Kamu itu ibarat soal matematika: susah dimengerti, tapi selalu ingin aku selesaikan.',
  'Kalau aku jadi superhero, kekuatanku cuma satu: membuatmu tersenyum.',
  'Matahari boleh terbenam, tapi senyum kamu jangan.',
  'Aku nggak butuh peta harta karun, soalnya aku sudah menemukanmu.',
  'Kamu kayak charger, kalau jauh darimu energiku langsung lowbat.',
  'Seandainya aku jadi penulis, kamu pasti jadi judul favorit di setiap bab.'
];

export default async function (m, ctx) {
  const target = m.mentionedJid && m.mentionedJid[0] ? `\n\nUntuk: @${m.mentionedJid[0].split('@')[0]}` : '';
  const g = GOMBAL[Math.floor(Math.random() * GOMBAL.length)];
  return ctx.reply(`💘 *Gombalan hari ini:*\n\n"${g}"${target}`);
}
