// AunuMD • lapisan rich response: SEMUA balasan teks bot dikirim sebagai pesan rich
// (layar HTML AunuBaileys). Bila jalur rich gagal, otomatis jatuh ke teks polos —
// tidak ada balasan yang hilang hanya karena rich bermasalah.
//
// MODE NORMAL: RICH_ENABLED = true. Jalur rich terbukti sehat end-to-end
// (probe deepscan P2 + screenshot penerima, 26 Nov 2026). Periode nonaktif
// pagi 26 Nov ternyata salah alamat, bukan salah format: rich yang dikirim ke
// alamat @lid di-echo server seolah terkirim tetapi tidak pernah tampil di
// klien penerima (richtest v2: 3 varian echo=true, nol yang muncul), sedangkan
// payload identik ke alamat PN tampil penuh. smsg kini menormalisasi chat
// pribadi LID -> PN, jadi rich selalu berangkat ke alamat yang benar.
const RICH_ENABLED = true;
const MAX_RICH = 4000; // teks sangat panjang (mis. tag panjang) tetap teks polos

// Konversi markdown gaya WhatsApp (*tebal*, _miring_, ~coret~, `kode`, ```blok```)
// menjadi HTML sederhana untuk layar rich. HTML selalu di-escape lebih dulu.
export function mdToHtml(text) {
  let s = String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  s = s.replace(/```([\s\S]*?)```/g, (_, code) => `<pre>${code.trim()}</pre>`);
  s = s.replace(/`([^`\n]+)`/g, '<code>$1</code>');
  s = s.replace(/\*([^*\n]+)\*/g, '<b>$1</b>');
  s = s.replace(/_([^_\n]+)_/g, '<i>$1</i>');
  s = s.replace(/~([^~\n]+)~/g, '<s>$1</s>');
  return s.split('\n').map((line) => (line.trim() === '' ? '<br>' : line)).join('<br>\n');
}

// Kirim teks sebagai rich response; fallback teks polos bila gagal/terlalu panjang.
export async function sendRichText(sock, jid, text, { quoted, title = 'AunuMD' } = {}) {
  const str = String(text);
  const opts = quoted ? { quoted } : {};
  if (RICH_ENABLED && str.length <= MAX_RICH) {
    try {
      const html = `<div>${mdToHtml(str)}</div>`;
      return await sock.sendMessage(jid, { richHtml: { html, title } }, opts);
    } catch { /* jatuh ke teks polos */ }
  }
  return sock.sendMessage(jid, { text: str }, opts);
}

export default { mdToHtml, sendRichText };
