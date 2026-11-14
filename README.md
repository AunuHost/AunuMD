# AunuMD

**AunuMD** adalah bot WhatsApp Multi-Device yang dibangun dari nol di atas
[**@aunucore/baileys**](https://www.npmjs.com/package/@aunucore/baileys) (AunuBaileys) —
library WhatsApp Web self-healing dari **AunuCore Creative Network**.

**249 perintah dalam 16 kategori** — ukuran bot MD penuh: seluruh 33 metode
eksperimental AunuBaileys, keluarga sticker/maker (brat, qc, smeme, swm, cari
stiker), canvas prosedural, game ber-sesi dengan ekonomi saldo, RPG, primbon &
cek, perangkat Islami, tools konversi/ffmpeg, sampai scraper tanpa kunci API.

Menu utama dikirim sebagai kartu rich interaktif, daftar lengkap sebagai rich
response HTML, dan info bot sebagai pesan langkah (BotSteps).
**Seluruh balasan teks bot berangkat sebagai rich response** (lapisan
`src/rich.js` mengubah markdown WhatsApp menjadi HTML; bila jalur rich gagal,
balasan yang sama otomatis dikirim sebagai teks polos). Pengecualian hanya
perintah yang isinya memang metadata mention (`.tagall`, `.hidetag`,
`.tagadmin`, `.rank`, `.topuang`, `.listwarn`, `.listabsen`) dan fallback
menu setelah kartu rich gagal.

> ⚡ Powered by @aunucore/baileys — baris ini selalu tampil di menu bot, dengan
> nomor versi yang dibaca langsung dari paket terpasang.

## Daftar perintah per kategori

### 🏠 Utama (5)
`.allmenu` • `.botinfo` • `.menu` • `.owner` • `.ping`

### ✨ AunuBaileys Experimental (33)
`.botsteps` • `.cancelschedule` • `.cancelsd` • `.card` • `.doctor` • `.fakealbum` • `.fakedoc` • `.fakeforward` • `.fakelocation` • `.fakequote` • `.fakevideo` • `.fakevn` • `.ghostmention` • `.ghostmsg` • `.groupstatus` • `.humansend` • `.listschedule` • `.personalcard` • `.personaltagall` • `.poststatus` • `.promocode` • `.reactseq` • `.readwm` • `.schedule` • `.selfdestruct` • `.sidetext` • `.spoiler` • `.stripwm` • `.trapimage` • `.typewriter` • `.vanish` • `.watermark` • `.wordreact`

### 🎨 Sticker & Maker (17)
`.attp` • `.brat` • `.bratextra` • `.bratgojo` • `.bratgojovid` • `.bratgreen` • `.bratvermeil` • `.bratvermeilvid` • `.bratvid` • `.caristiker` • `.emojimix` • `.pinpack` • `.qc` • `.smeme` • `.smemevid` • `.swm` • `.ttp`

### 🖼️ Canvas (20)
`.applemusic` • `.buatquotes` • `.facepalm` • `.fakedev7` • `.fakestory` • `.fakestory2` • `.fakestory3` • `.fakestory4` • `.igstory` • `.igstoryimg` • `.iqc` • `.iqc2` • `.iqcpink` • `.kalender` • `.musiccard` • `.nulis` • `.quotemaker` • `.sroast` • `.topixel` • `.ttqc`

### 🎭 Fun (25)
`.apakah` • `.bisakah` • `.bola8` • `.caklontong` • `.dadu` • `.dare` • `.faktaunik` • `.gombal` • `.jokes` • `.kapankah` • `.katabijak` • `.koin` • `.mood` • `.motivasi` • `.pantun` • `.peribahasa` • `.pick` • `.puisi` • `.quotes` • `.rate` • `.rezeki` • `.ship` • `.siapakah` • `.sifat` • `.truth`

### 🎮 Game (8)
`.emojiquiz` • `.jawab` • `.kuis` • `.slot` • `.suit` • `.tebakangka` • `.tebakata` • `.tekateki`

### 🗺️ RPG (9)
`.berburu` • `.daily` • `.dompet` • `.judi` • `.kerja` • `.mancing` • `.tambang` • `.topuang` • `.transfer`

### 👥 Grup (24)
`.absen` • `.add` • `.antilink` • `.bukagrup` • `.del` • `.demote` • `.groupinfo` • `.linkgrup` • `.hidetag` • `.kick` • `.listabsen` • `.listadmin` • `.listwarn` • `.promote` • `.revoke` • `.setdesc` • `.setname` • `.setppgrup` • `.tagadmin` • `.tagall` • `.tutupgrup` • `.unwarn` • `.warn` • `.welcome`

### 🧰 Tools (33)
`.bandingkanhp` • `.carbon` • `.cekidch` • `.cjstoesm` • `.converter` • `.dafont` • `.delpp` • `.esmtocjs` • `.getpaste` • `.hdvid` • `.hitung` • `.hitungwrmlbb` • `.ipwho` • `.kalkulatormbg` • `.lookup` • `.nikparser` • `.ocr` • `.ptv` • `.qrcustom` • `.readmore` • `.rvo` • `.setbio` • `.setnamebot` • `.setpp` • `.ssweb` • `.styleteks` • `.tempmail` • `.toaudio` • `.toimg` • `.tourl` • `.tovideo` • `.tovn` • `.txt2qr`

### 🔍 Cek & Ramalan (18)
`.artimimpi` • `.artinama` • `.cekgender` • `.cekumur` • `.cekusia` • `.crypto` • `.cuaca` • `.gempa` • `.goldar` • `.harilahir` • `.jodoh` • `.keberuntungan` • `.kurs` • `.nomerhoki` • `.shio` • `.tanggal` • `.weton` • `.zodiak`

### 🕌 Islami (8)
`.alquran` • `.asmaulhusna` • `.ayathariini` • `.doa` • `.dzikir` • `.hadits` • `.jadwalsholat` • `.kisahnabi`

### 🎲 Random (14)
`.anjing` • `.cuddle` • `.dance` • `.feed` • `.hug` • `.kenapa` • `.kiss` • `.kucing` • `.pat` • `.poke` • `.randomfact` • `.slap` • `.tickle` • `.wink`

### 📰 Newsletter (3)
`.follow` • `.nlinfo` • `.unfollow`

### 🌐 Scraper (13)
`.anime` • `.lirik` • `.manga` • `.meme` • `.neko` • `.play` • `.tiktok` • `.tiktokmp3` • `.ytdl2` • `.ytmp3` • `.ytmp4` • `.yts2` • `.ytsearch`

### ℹ️ Info (7)
`.afk` • `.donasi` • `.level` • `.profile` • `.rank` • `.script` • `.totalfitur`

### 👑 Owner (12)
`.backup` • `.block` • `.broadcast` • `.join` • `.leave` • `.listblock` • `.mode` • `.plugins` • `.setbotname` • `.setppbot` • `.setprefix` • `.unblock`

Detail tiap perintah (deskripsi + cara pakai) selalu tersedia di dalam bot
lewat `.allmenu` dan `.totalfitur`.

## Catatan fitur

- **`.yts2`** — pencarian YouTube dengan unduhan per video lewat `.ytdl2
  <id> mp4|mp3`. Tampilan kartu geser (carousel) sengaja TIDAK dirakit di sisi
  bot: atas keputusan pemilik, fitur itu diminta masuk sebagai metode resmi
  AunuBaileys (`aunuCardCarousel`) dan akan diadopsi begitu library merilisnya.
- **Porting dari bot MD lain** — kategori tools/sticker/canvas berasal dari
  bot sumber yang dipelajari pemilik: fitur & perilaku perintahnya dipindahkan,
  kodenya ditulis ulang mengikuti kontrak AunuMD. Perintah yang di sumbernya
  bergantung pada API ber-kunci pihak ketiga diimplementasikan ulang secara
  lokal (canvas/ffmpeg) atau lewat API terbuka tanpa kunci yang terverifikasi
  hidup; 42 perintah gugur (spam NGL, palsu bukti pembayaran, endpoint mati,
  atau kunci pihak ketiga) dan tidak dipasang sebagai fitur mati. Satu-satunya
  pengecualian yang gugur di tengah jalan: `videotranscribe` (endpoint
  berubah bentuk) — dicabut.
- Perintah `.anime`/`.manga` memakai API resmi Jikan v4; dari sebagian
  jaringan API itu bisa tak terjangkau dan bot membalas error secara jujur.

## Instalasi

Butuh Node.js ≥ 20 dan ffmpeg di sistem.

```bash
git clone https://github.com/AunuHost/AunuMD.git
cd AunuMD
npm install
node index.js
```

Saat run pertama bot menanyakan nomor bot, lalu menampilkan **kode pairing
custom `AUNUHOST`**. Hubungkan dari WhatsApp di HP bot: *Setelan > Perangkat
tertataut > Tautkan dengan nomor telepon*, masukkan kode itu.

### Panel (Pterodactyl/Hidencloud) — sudah tahan banting

Paket ini membawa `.npmrc` (`legacy-peer-deps`) dan **libsignal yang
di-vendor** (`vendor/libsignal-node`, diarahkan lewat `overrides`), sehingga
install di panel yang melarang *git fetch* (EALLOWGIT) dan konflik peer
jimp (ERESOLVE) tetap berjalan. Cukup ekstrak, atur startup command
`node index.js`, start.

## Konfigurasi

Semua pengaturan ada di `config.js`: nama bot, owner (di repo publik berupa
placeholder — isi nomor aslimu hanya di salinan lokal saat deploy), nomor bot,
kode pairing (`AUNUHOST` — wajib tepat 8 karakter), prefix (bawaan `.`),
mode (`public`/`self`), tautan donasi & repo. Prefix, nama bot, dan mode juga
bisa diubah saat bot hidup lewat perintah owner; perubahan tersimpan di
`database/settings.json`.

## Struktur

```
AunuMD/
├── index.js            # bootstrap
├── config.js           # konfigurasi pusat
├── src/
│   ├── rich.js           # lapisan rich response untuk SEMUA balasan teks
│   ├── connection.js   # socket: pairing, reconnect anti-bocor listener
│   ├── handler.js      # gerbang perintah + penghitung pesan + hook AFK
│   ├── smsg.js         # serializer pesan
│   ├── loader.js       # plugin loader (plugins/<kategori>/*.js)
│   ├── database.js     # penyimpanan JSON atomik
│   ├── scraper.js      # tikwm + Invidious + nekos.life
│   ├── canvas.js       # renderer @napi-rs/canvas (brat/ttp/meme/quote/pixel)
│   ├── webp-exif.js    # sisip packname/author stiker secara lokal
│   ├── game-session.js # sesi permainan per pengguna
│   ├── helper.js       # durasi, stiker ffmpeg, utilitas
│   └── logger.js
├── plugins/            # satu file = satu perintah (kontrak config + handler)
│   ├── main/ aunu/ sticker/ canvas/ fun/ game/ rpg/ group/
│   ├── tools/ cek/ islamic/ random/ newsletter/ scrape/ info/ owner/
├── assets/fonts/       # Poppins, Inter, Caveat, Plus Jakarta Sans (canvas)
├── vendor/libsignal-node/   # libsignal 6.0.0 ter-vendor (anti EALLOWGIT)
└── database/           # data runtime (JSON, tidak ikut git)
```

Menambah perintah = menambah satu file plugin yang mengekspor `config`
(name, alias, category, description, usage, isOwner, isGroup, isPrivate,
cooldown) dan handler `default async (m, ctx)`. Tidak ada registrasi manual.

## Catatan desain

- Arsitektur plugin dipelajari dari bot MD sejenis; **seluruh kode ditulis
  dari nol**. Tidak memakai `ourin-baileys` dalam bentuk apa pun.
- Tidak ada perintah eval/shell — tidak ada pintu belakang eksekusi kode.
- Satu socket aktif pada satu waktu; socket lama diakhiri sebelum reconnect
  (anti kebocoran listener), sesi LID/PN dirawat oleh mekanisme self-healing
  library.

## Lisensi

MIT © AunuCore Creative Network
