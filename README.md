# AunuMD

**AunuMD** adalah bot WhatsApp Multi-Device yang dibangun dari nol di atas
[**@aunucore/baileys**](https://www.npmjs.com/package/@aunucore/baileys) (AunuBaileys) —
library WhatsApp Web self-healing dari **AunuCore Creative Network**.

Menu utama dikirim sebagai kartu rich interaktif, daftar lengkap sebagai rich
response HTML, dan info bot sebagai pesan langkah (BotSteps) yang ter-update di
tempat. **Seluruh 33 metode eksperimental AunuBaileys tersedia sebagai perintah
bot**, ditambah perintah inti grup/owner/tools/newsletter dan scraper mandiri
tanpa kunci API pihak ketiga.

> ⚡ Powered by @aunucore/baileys — baris ini juga selalu tampil di menu bot,
> dengan nomor versi yang dibaca langsung dari paket terpasang.

## Fitur

### ✨ Kategori `aunu` — seluruh fitur eksperimental AunuBaileys

| Perintah | Metode | Keterangan |
|---|---|---|
| `.wm <teks> \| <tag>` | `aunuWatermark` | Sisipkan watermark tak terlihat ke teks |
| `.readwm` | `aunuReadWatermark` | Baca watermark dari teks (balas teksnya) |
| `.stripwm` | `aunuStripWatermark` | Bersihkan watermark dari teks |
| `.humansend <teks>` | `aunuHumanSend` | Kirim dengan simulasi mengetik manusia |
| `.schedule <10s/5m/2h/1d> <teks>` | `aunuSchedule` | Jadwalkan pesan |
| `.listschedule` | `aunuListScheduled` | Daftar pesan terjadwal |
| `.cancelschedule <id>` | `aunuCancelScheduled` | Batalkan jadwal |
| `.selfdestruct <detik> <teks>` | `aunuSelfDestruct` | Pesan yang terhapus sendiri |
| `.cancelsd <id>` | `aunuCancelSelfDestruct` | Batalkan musnah-sendiri |
| `.doctor` | `aunuDoctor` | Laporan kesehatan socket & sesi |
| `.personaltagall [template]` | `aunuPersonalTagAll` | Tag-all personal: tiap member menerima kartu foto profil + namanya sendiri |
| `.personalcard [@user]` | `aunuPersonalCard` | Kartu personal untuk satu orang |
| `.card <teks>` | `aunuCard` | Kartu foto interaktif + tombol Suka/Tidak Suka |
| `.promocode <KODE> <teks>` | `aunuPromoCode` | Kartu promo + tombol salin kode |
| `.fakequote <kutipan> \| <balasan>` | `aunuFakeQuote` | Balasan dengan kutipan rekayasa |
| `.typewriter <teks>` | `aunuTypewriter` | Efek mengetik (pesan diedit bertahap) |
| `.reactseq <emoji,...>` | `aunuReactSequence` | Rangkaian reaksi pada pesan yang dibalas |
| `.poststatus [#warna] <teks>` | `aunuPostStatus` | Posting status teks berwarna |
| `.sidetext [--deleted] <teks>` | `aunuSideText` | Teks dengan foto kecil di samping + nama |
| `.ghostmention <teks>` | `aunuGhostMention` | Mention semua member tanpa teks @ |
| `.fakeforward <teks> \| <channel>` | `aunuFakeForward` | Tampilan pesan terusan + atribusi saluran |
| `.vanish <durasi> <teks>` | `aunuVanish` | Pesan lenyap dengan timer kustom |
| `.trapimage` (balas foto) | `aunuTrapImage` | Thumbnail umpan ≠ foto asli |
| `.fakevn [detik]` (balas audio) | `aunuFakeVN` | Klaim durasi VN palsu + waveform |
| `.ghostmsg [jumlah]` | `aunuGhostMessage` | Gelembung pesan kosong |
| `.fakedoc <nama> \| <isi>` | `aunuFakeDoc` | Klaim ukuran/halaman dokumen palsu |
| `.fakevideo [detik]` (balas video) | `aunuFakeVideo` | Klaim durasi video palsu |
| `.fakelocation <nama tempat>` | `aunuFakeLocation` | Kartu lokasi rekayasa |
| `.fakealbum <foto> <video>` | `aunuFakeAlbum` | Klaim jumlah item album (termasuk album hantu) |
| `.wordreact <kata>` | `aunuWordReact` | Reaksi berisi kata pada pesan yang dibalas |
| `.botsteps <teks>` | `aunuBotSteps` | Pesan langkah-progress bot AI |
| `.spoiler <teks>` | `aunuSendSpoiler` | Pesan spoiler |
| `.groupstatus <teks>` | `aunuSendGroupStatus` | Status khusus grup |

### 🏠 Utama
`.menu` (kartu rich + tombol) • `.allmenu` (rich response HTML) • `.ping` •
`.owner` (kartu kontak) • `.botinfo` (BotSteps)

### 👥 Grup
`.tagall` • `.groupinfo` • `.kick` • `.add` • `.promote` • `.demote` •
`.setname` • `.setdesc` • `.linkgrup` • `.revoke` • `.welcome on|off` •
`.antilink on|off`

### 🧰 Tools
`.sticker` (balas foto/video, via ffmpeg) • `.toimg` • `.getpp` • `.fetch` •
`.myid` • `.runtime`

### 📰 Newsletter / Saluran
`.nlinfo <link|jid>` • `.follow <link|jid>` • `.unfollow <link|jid>`

### 🌐 Scraper (mandiri, tanpa API key)
`.tiktok <link>` (tikwm) • `.ytsearch <judul>` • `.ytmp4 <link|judul>` •
`.ytmp3 <link|judul>` (Invidious) • `.neko [kategori]` (nekos.life)

### 👑 Owner
`.setprefix` • `.setbotname` • `.broadcast` • `.join` • `.leave` • `.mode` •
`.plugins`

## Instalasi

Butuh Node.js ≥ 20 dan (untuk `.sticker`) ffmpeg di sistem.

```bash
git clone https://github.com/AunuHost/AunuMD.git
cd AunuMD
npm install
node index.js
```

Saat run pertama bot menanyakan nomor bot, lalu menampilkan **kode pairing
custom `AUNUHOST`**. Hubungkan dari WhatsApp di HP bot: *Setelan > Perangkat
tertataut > Tautkan dengan nomor telepon*, masukkan kode itu.

### Panel (Pterodactyl) — sudah tahan banting

Paket ini membawa `.npmrc` (`legacy-peer-deps`) dan **libsignal yang
di-vendor** (`vendor/libsignal-node`, diarahkan lewat `overrides`), sehingga
install di panel yang melarang *git fetch* (EALLOWGIT) dan konflik peer
jimp (ERESOLVE) tetap berjalan — pola yang sama yang menyelamatkan deploy
Tenka Izumo. Cukup ekstrak, atur startup command `node index.js`, start.

## Konfigurasi

Semua pengaturan ada di `config.js`: nama bot, owner, nomor bot, kode
pairing (`AUNUHOST` — wajib tepat 8 karakter), prefix (bawaan `.`),
mode (`public`/`self`), dan URL thumbnail untuk header kartu menu.
Prefix, nama bot, dan mode juga bisa diubah saat bot hidup lewat perintah
owner; perubahan tersimpan di `database/settings.json`.

## Struktur

```
AunuMD/
├── index.js            # bootstrap
├── config.js           # konfigurasi pusat
├── src/
│   ├── connection.js   # socket: pairing, reconnect anti-bocor listener
│   ├── handler.js      # gerbang perintah: mode/owner/grup/cooldown/antilink
│   ├── smsg.js         # serializer pesan
│   ├── loader.js       # plugin loader (plugins/<kategori>/*.js)
│   ├── database.js     # penyimpanan JSON atomik
│   ├── scraper.js      # tikwm + Invidious + nekos.life
│   ├── helper.js       # durasi, stiker ffmpeg, utilitas
│   └── logger.js
├── plugins/            # satu file = satu perintah (kontrak config + handler)
│   ├── main/  aunu/  group/  owner/  tools/  newsletter/  scrape/
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
