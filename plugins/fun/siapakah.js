// AunuMD • Pilih satu member grup secara acak untuk pertanyaan "siapakah"
export const config = { name: 'siapakah', alias: [], category: 'fun', description: 'Pilih member grup acak untuk pertanyaan siapakah', usage: '.siapakah <pertanyaan>', isOwner: false, isGroup: true, isPrivate: false, cooldown: 3 };

export default async function (m, ctx) {
  if (!ctx.text) return ctx.reply(`Pemakaian: ${config.usage}\nContoh: .siapakah yang paling rajin di grup ini?`);
  try {
    const meta = await ctx.sock.groupMetadata(m.chat);
    const peserta = (meta.participants || []).filter((p) => p.id);
    if (!peserta.length) return ctx.reply('Tidak ada peserta yang bisa dipilih di grup ini.');
    const terpilih = peserta[Math.floor(Math.random() * peserta.length)].id;
    const nomor = terpilih.split('@')[0];
    const teks = `❓ Siapakah ${ctx.text.replace(/^siapakah\s+/i, '')}\n\n👉 @${nomor}`;
    // Khusus plugin ini: mention adalah isi balasan, jadi dikirim langsung via sendMessage.
    return ctx.sock.sendMessage(m.chat, { text: teks, mentions: [terpilih] }, { quoted: m.raw });
  } catch (e) {
    return ctx.reply('Error: ' + e.message);
  }
}
