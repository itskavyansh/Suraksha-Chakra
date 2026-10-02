/**
 * Generates simple PNG icons using pure JavaScript (no external deps).
 * Uses the pngjs-like raw pixel approach with zlib compression.
 * Run: node scripts/gen-icons.cjs
 */
const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

function createPNG(width, height, pixelFn) {
  const pixels = Buffer.alloc(width * height * 4);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const [r, g, b, a] = pixelFn(x, y, width, height);
      pixels[idx] = r;
      pixels[idx + 1] = g;
      pixels[idx + 2] = b;
      pixels[idx + 3] = a;
    }
  }

  // Build raw scanline data (filter type 0 = None, prepended to each row)
  const rawRows = [];
  for (let y = 0; y < height; y++) {
    const row = Buffer.alloc(1 + width * 4);
    row[0] = 0; // filter = None
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      row[1 + x * 4] = pixels[idx];
      row[1 + x * 4 + 1] = pixels[idx + 1];
      row[1 + x * 4 + 2] = pixels[idx + 2];
      row[1 + x * 4 + 3] = pixels[idx + 3];
    }
    rawRows.push(row);
  }
  const rawData = Buffer.concat(rawRows);
  const compressed = zlib.deflateSync(rawData);

  function chunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const typeBytes = Buffer.from(type, 'ascii');
    const crcInput = Buffer.concat([typeBytes, data]);
    const crc = crc32(crcInput);
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crc >>> 0);
    return Buffer.concat([len, typeBytes, data, crcBuf]);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 6;  // color type RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const png = Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', compressed),
    chunk('IEND', Buffer.alloc(0)),
  ]);
  return png;
}

// CRC-32 implementation
function crc32(buf) {
  const table = makeCrcTable();
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ 0xffffffff);
}

let _crcTable = null;
function makeCrcTable() {
  if (_crcTable) return _crcTable;
  _crcTable = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    _crcTable[n] = c;
  }
  return _crcTable;
}

// Draw a rounded-rect green icon with "SC" text using a simple pixel-drawing approach
function iconPixel(x, y, w, h) {
  const radius = w * 0.15;
  const cx = w / 2;
  const cy = h / 2;

  // Check if within rounded rect
  function inRoundedRect(px, py) {
    const rx = Math.min(Math.max(px, radius), w - radius);
    const ry = Math.min(Math.max(py, radius), h - radius);
    return (px - rx) ** 2 + (py - ry) ** 2 <= radius ** 2 ||
           (px >= radius && px <= w - radius) ||
           (py >= radius && py <= h - radius);
  }

  if (!inRoundedRect(x, y)) {
    return [247, 250, 248, 0]; // transparent (surface color)
  }

  // Background: brand-700 green
  const bg = [15, 92, 58, 255];

  // Draw "S" and "C" as simple block letters using bounding boxes
  // We'll approximate using scaled positions
  const fs = w * 0.42; // font-size equivalent
  const textY = cy + h * 0.03;
  const letterWidth = fs * 0.55;
  const gap = fs * 0.08;
  const totalWidth = letterWidth * 2 + gap;
  const startX = cx - totalWidth / 2;

  // S bounding box
  const sx = startX;
  const ex = sx + letterWidth;
  const sy = textY - fs * 0.5;
  const ey = textY + fs * 0.5;

  // C bounding box
  const cx2 = ex + gap;
  const ex2 = cx2 + letterWidth;

  const inS = x >= sx && x <= ex && y >= sy && y <= ey;
  const inC = x >= cx2 && x <= ex2 && y >= sy && y <= ey;

  const strokeW = w * 0.06;

  if (inS) {
    // S: top bar, middle bar, bottom bar + connectors
    const topBar = y <= sy + strokeW;
    const midBar = y >= textY - strokeW / 2 && y <= textY + strokeW / 2;
    const botBar = y >= ey - strokeW;
    const topLeft = x <= sx + strokeW && y <= textY;
    const botRight = x >= ex - strokeW && y >= textY;
    if (topBar || midBar || botBar || topLeft || botRight) {
      return [255, 255, 255, 255];
    }
  }

  if (inC) {
    const topBar = y <= sy + strokeW;
    const botBar = y >= ey - strokeW;
    const leftBar = x <= cx2 + strokeW;
    if (topBar || botBar || leftBar) {
      return [255, 255, 255, 255];
    }
  }

  return bg;
}

const sizes = [192, 512];
const outDir = path.join(__dirname, '..', 'public', 'icons');
fs.mkdirSync(outDir, { recursive: true });

for (const size of sizes) {
  const png = createPNG(size, size, (x, y, w, h) => iconPixel(x, y, w, h));
  const outPath = path.join(outDir, `icon-${size}.png`);
  fs.writeFileSync(outPath, png);
  console.log(`Written: ${outPath}`);
}
console.log('Done!');
