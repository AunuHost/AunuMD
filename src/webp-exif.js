// AunuMD • sisip metadata packname/author (chunk EXIF) ke buffer stiker WebP secara lokal
// Format WebP: RIFF chunk; stiker WhatsApp membaca EXIF berisi JSON sticker-pack-*.

function exifPayload(packname, author) {
  const json = Buffer.from(JSON.stringify({
    'sticker-pack-id': `aunumd-${Date.now().toString(36)}`,
    'sticker-pack-name': String(packname || 'AunuMD').slice(0, 60),
    'sticker-pack-publisher': String(author || 'AunuMD').slice(0, 60),
    'sticker-pack-version': '1.0',
    emojis: []
  }), 'utf8');
  // Header TIFF little-endian + satu entri IFD tag 0x5741 (tipe ASCII) menunjuk data JSON
  const head = Buffer.from([
    0x49, 0x49, 0x2a, 0x00, 0x08, 0x00, 0x00, 0x00,
    0x01, 0x00, 0x41, 0x57, 0x07, 0x00,
    0x00, 0x00, 0x00, 0x00, // panjang (diisi di bawah)
    0x16, 0x00, 0x00, 0x00, // offset data = 22
    0x00, 0x00, 0x00, 0x00
  ]);
  head.writeUInt32LE(json.length, 14);
  return Buffer.concat([head, json]);
}

function readChunks(webp) {
  const chunks = [];
  let off = 12;
  while (off + 8 <= webp.length) {
    const id = webp.toString('ascii', off, off + 4);
    const size = webp.readUInt32LE(off + 4);
    const data = webp.subarray(off + 8, off + 8 + size);
    chunks.push({ id, size, data });
    off += 8 + size + (size % 2);
  }
  return chunks;
}

function chunkBuffer(id, data) {
  const head = Buffer.alloc(8);
  head.write(id, 0, 'ascii');
  head.writeUInt32LE(data.length, 4);
  const pad = data.length % 2 ? Buffer.alloc(1) : Buffer.alloc(0);
  return Buffer.concat([head, data, pad]);
}

function vp8Dimensions(chunks) {
  const vp8x = chunks.find((c) => c.id === 'VP8X');
  if (vp8x && vp8x.data.length >= 10) {
    const w = 1 + (vp8x.data[4] | (vp8x.data[5] << 8) | (vp8x.data[6] << 16));
    const h = 1 + (vp8x.data[7] | (vp8x.data[8] << 8) | (vp8x.data[9] << 16));
    return { w, h };
  }
  const lossy = chunks.find((c) => c.id === 'VP8 ');
  if (lossy && lossy.data.length >= 10) {
    const d = lossy.data;
    const w = (d[6] | (d[7] << 8)) & 0x3fff;
    const h = (d[8] | (d[9] << 8)) & 0x3fff;
    if (w && h) return { w, h };
  }
  const lossless = chunks.find((c) => c.id === 'VP8L');
  if (lossless && lossless.data.length >= 5) {
    const d = lossless.data;
    const bits = d[1] | (d[2] << 8) | (d[3] << 16) | (d[4] << 24);
    return { w: (bits & 0x3fff) + 1, h: ((bits >> 14) & 0x3fff) + 1 };
  }
  return { w: 512, h: 512 };
}

// Kembalikan buffer WebP baru dengan EXIF packname/author terpasang.
export function insertStickerExif(webp, packname, author) {
  if (!Buffer.isBuffer(webp) || webp.toString('ascii', 0, 4) !== 'RIFF' || webp.toString('ascii', 8, 12) !== 'WEBP') {
    throw new Error('Buffer bukan WebP yang valid.');
  }
  const chunks = readChunks(webp).filter((c) => c.id !== 'EXIF');
  const { w, h } = vp8Dimensions(chunks);
  const hasVp8x = chunks.some((c) => c.id === 'VP8X');
  const out = [];
  if (!hasVp8x) {
    const vp8xData = Buffer.alloc(10);
    vp8xData[0] = 0x08; // flag EXIF
    vp8xData.writeUIntLE(w - 1, 4, 3);
    vp8xData.writeUIntLE(h - 1, 7, 3);
    out.push(chunkBuffer('VP8X', vp8xData));
  }
  for (const c of chunks) {
    if (c.id === 'VP8X') {
      const data = Buffer.from(c.data);
      data[0] = data[0] | 0x08; // nyalakan flag EXIF
      out.push(chunkBuffer('VP8X', data));
    } else {
      out.push(chunkBuffer(c.id, Buffer.from(c.data)));
    }
  }
  out.push(chunkBuffer('EXIF', exifPayload(packname, author)));
  const body = Buffer.concat(out);
  const riff = Buffer.alloc(12);
  riff.write('RIFF', 0, 'ascii');
  riff.writeUInt32LE(body.length + 4, 4);
  riff.write('WEBP', 8, 'ascii');
  return Buffer.concat([riff, body]);
}
