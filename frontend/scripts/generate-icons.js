import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Zero-dependency raw PNG generator using node zlib
function createPng(width, height, r, g, b) {
  // PNG signature
  const signature = Buffer.from([137, 80, 78, 72, 13, 10, 26, 10]);

  // IHDR chunk: 13 bytes
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // 8 bits per channel
  ihdrData[9] = 6; // RGBA color type
  ihdrData[10] = 0; // compression method
  ihdrData[11] = 0; // filter method
  ihdrData[12] = 0; // interlace method

  const ihdrChunk = makeChunk('IHDR', ihdrData);

  // Raw image data: height rows, each with 1 filter byte (0) + width * 4 bytes RGBA
  const rawRowLen = 1 + width * 4;
  const rawData = Buffer.alloc(height * rawRowLen);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rawRowLen;
    rawData[rowOffset] = 0; // filter: none

    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 4;

      // Draw white "SC" inside the center
      // Check if coordinate is inside 'S' or 'C' glyph bounding box
      const isGlyph = isScGlyph(x, y, width, height);

      if (isGlyph) {
        rawData[pixelOffset] = 255;     // R
        rawData[pixelOffset + 1] = 255; // G
        rawData[pixelOffset + 2] = 255; // B
        rawData[pixelOffset + 3] = 255; // A
      } else {
        rawData[pixelOffset] = r;       // R
        rawData[pixelOffset + 1] = g;   // G
        rawData[pixelOffset + 2] = b;   // B
        rawData[pixelOffset + 3] = 255; // A
      }
    }
  }

  const compressedData = zlib.deflateSync(rawData);
  const idatChunk = makeChunk('IDAT', compressedData);

  // IEND chunk
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function isScGlyph(x, y, width, height) {
  // Normalize to 100x100
  const nx = (x / width) * 100;
  const ny = (y / height) * 100;

  // S glyph: nx between 25 and 45, ny between 30 and 70
  // Top bar: nx 25-45, ny 30-38
  // Top-left bar: nx 25-32, ny 30-50
  // Middle bar: nx 25-45, ny 46-54
  // Bottom-right bar: nx 38-45, ny 50-70
  // Bottom bar: nx 25-45, ny 62-70
  const inS = 
    (nx >= 25 && nx <= 45 && ny >= 30 && ny <= 38) ||
    (nx >= 25 && nx <= 32 && ny >= 30 && ny <= 50) ||
    (nx >= 25 && nx <= 45 && ny >= 46 && ny <= 54) ||
    (nx >= 38 && nx <= 45 && ny >= 50 && ny <= 70) ||
    (nx >= 25 && nx <= 45 && ny >= 62 && ny <= 70);

  // C glyph: nx between 55 and 75, ny between 30 and 70
  // Top bar: nx 55-75, ny 30-38
  // Left vertical bar: nx 55-62, ny 30-70
  // Bottom bar: nx 55-75, ny 62-70
  const inC =
    (nx >= 55 && nx <= 75 && ny >= 30 && ny <= 38) ||
    (nx >= 55 && nx <= 62 && ny >= 30 && ny <= 70) ||
    (nx >= 55 && nx <= 75 && ny >= 62 && ny <= 70);

  return inS || inC;
}

function makeChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(4 + 4 + len + 4);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);

  const crc = crc32(chunk.subarray(4, 8 + len));
  chunk.writeInt32BE(crc, 8 + len);
  return chunk;
}

// Standard CRC32 table
const crcTable = new Int32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    if (c & 1) {
      c = 0xedb88320 ^ (c >>> 1);
    } else {
      c = c >>> 1;
    }
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return c ^ -1;
}

const publicDir = path.resolve(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Brand-700 color: #0F5C3A => r: 15, g: 92, b: 58
const p192 = createPng(192, 192, 15, 92, 58);
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), p192);

const p512 = createPng(512, 512, 15, 92, 58);
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), p512);

// Also generate a favicon
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), p192);

console.log('Generated PWA icons (192, 512) and favicon successfully.');
