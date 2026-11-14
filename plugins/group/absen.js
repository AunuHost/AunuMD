// AunuMD • absensi harian member grup
export const config = { name: 'absen', alias: ['hadir'], category: 'group', description: 'Absen kehadiran hari ini di grup', usage: '.absen', isOwner: false, isGroup: true, isPrivate: false, cooldown: 3 };

export default async function (m, ctx) {
  const g = ctx.db.groups.get(m.chat) || {};
  g.absen = g.absen || {};
  const tgl = new Date().toLocaleDateString('en-CA');
  g.absen[tgl] = g.absen[tgl] || {};

  if (g.absen[tgl][m.sender]) {
    return ctx.reply(`Kamu sudah absen hari ini (jam ${g.absen[tgl][m.sender]}).`);
  }

  const jam = new Date().toLocaleTimeString('id-ID');
  g.absen[tgl][m.sender] = jam;
  ctx.db.groups.set(m.chat, g);
  const posisi = Object.keys(g.absen[tgl]).length;
  await ctx.reply(`✅ Absen berhasil! Kamu absen ke-${posisi} hari ini (${tgl}, jam ${jam}).`);
}
