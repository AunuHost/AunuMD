// AunuMD — konfigurasi pusat. Edit file ini sebelum menjalankan bot.
export default {
  // Identitas bot
  botName: 'AunuMD',
  owners: [
    // GANTI nomor ini dengan nomor WhatsApp owner yang asli sebelum bot dijalankan publik.
    { name: 'AunuXdev', number: '6281234567' }
  ],

  // Pairing: nomor bot (format internasional tanpa +, mis. '6282310330697').
  // Kosongkan untuk ditanya lewat terminal saat run pertama.
  botNumber: '',
  // Kode pairing custom — WAJIB tepat 8 karakter, selain itu server memberi kode acak.
  pairingCode: 'AUNUHOST',
  sessionName: 'session',

  // Perilaku
  prefix: '.',
  mode: 'public', // 'public' = semua orang bisa memakai | 'self' = hanya owner
  debug: false, // true = log diagnostik jalur kirim (send + echo upsert) ke konsol

  // Tampilan: URL gambar untuk header kartu menu & dekoy trapimage (opsional).
  thumbnail: '',
  web: 'https://ai.aunuhost.bond',
  repo: 'https://github.com/AunuHost/AunuMD',
  donate: 'https://sociabuzz.com/aunucore/tribe'
};
