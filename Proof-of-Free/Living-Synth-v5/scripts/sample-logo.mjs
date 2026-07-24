#!/usr/bin/env node
/* Living Synth v4 — regenerate the 32×32 LOGO_MASK from a real Xtrata PNG.
 *
 * usage: node scripts/sample-logo.mjs path/to/xtrata-logo.png
 *
 * Downsamples the image to 32×32, classifies each cell into a family
 * (dark / white / blue / orange) by average colour, prints the mask block
 * ready to paste into packages/genome/genome.js (LOGO_MASK), and writes a
 * preview to manifests/logo-preview.ppm. No external dependencies — a minimal
 * PNG decoder (8-bit truecolour / truecolour+alpha, non-interlaced) is inline.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { inflateSync } from "node:zlib";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const file = process.argv[2];
if (!file) { console.error("usage: node scripts/sample-logo.mjs <logo.png>"); process.exit(1); }
const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");

function decodePng(buf) {
  if (buf.readUInt32BE(0) !== 0x89504e47) throw new Error("Not a PNG.");
  let off = 8, w = 0, h = 0, bitDepth = 0, colorType = 0; const idat = [];
  while (off < buf.length) {
    const len = buf.readUInt32BE(off), type = buf.toString("ascii", off + 4, off + 8), data = buf.subarray(off + 8, off + 8 + len);
    if (type === "IHDR") { w = data.readUInt32BE(0); h = data.readUInt32BE(4); bitDepth = data[8]; colorType = data[9]; }
    else if (type === "IDAT") idat.push(data);
    else if (type === "IEND") break;
    off += 12 + len;
  }
  if (bitDepth !== 8 || (colorType !== 2 && colorType !== 6)) throw new Error(`Unsupported PNG (bitDepth ${bitDepth}, colorType ${colorType}); export as 8-bit RGB/RGBA.`);
  const ch = colorType === 6 ? 4 : 3, raw = inflateSync(Buffer.concat(idat)), stride = w * ch, out = Buffer.alloc(h * stride);
  const paeth = (a, b, c) => { const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c); return pa <= pb && pa <= pc ? a : pb <= pc ? b : c; };
  let pos = 0;
  for (let y = 0; y < h; y++) {
    const filter = raw[pos++]; for (let x = 0; x < stride; x++) {
      const rawByte = raw[pos++], a = x >= ch ? out[y * stride + x - ch] : 0, b = y > 0 ? out[(y - 1) * stride + x] : 0, c = x >= ch && y > 0 ? out[(y - 1) * stride + x - ch] : 0;
      let val; switch (filter) { case 0: val = rawByte; break; case 1: val = rawByte + a; break; case 2: val = rawByte + b; break; case 3: val = rawByte + ((a + b) >> 1); break; case 4: val = rawByte + paeth(a, b, c); break; default: throw new Error("Bad filter"); }
      out[y * stride + x] = val & 255;
    }
  }
  return { w, h, ch, data: out };
}

function classify(r, g, b) {
  const max = Math.max(r, g, b), lum = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
  if (lum < 0.16) return ".";                       // dark ground
  if (max > 40 && r > b + 24 && r >= g && g > b - 10) return "O";  // warm / orange
  if (b > r + 18 && b > 60) return "B";             // blue
  if (lum > 0.5) return "W";                        // light / white
  return b >= r ? "B" : (lum > 0.3 ? "W" : ".");
}

const img = decodePng(readFileSync(file));
const N = 32, rows = [];
for (let gy = 0; gy < N; gy++) {
  let row = "";
  for (let gx = 0; gx < N; gx++) {
    let r = 0, g = 0, b = 0, count = 0;
    const x0 = Math.floor(gx * img.w / N), x1 = Math.max(x0 + 1, Math.floor((gx + 1) * img.w / N));
    const y0 = Math.floor(gy * img.h / N), y1 = Math.max(y0 + 1, Math.floor((gy + 1) * img.h / N));
    for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) { const i = (y * img.w + x) * img.ch; r += img.data[i]; g += img.data[i + 1]; b += img.data[i + 2]; count++; }
    row += classify(r / count, g / count, b / count);
  }
  rows.push(row);
}

console.log("Paste into LOGO_MASK in packages/genome/genome.js:\n");
console.log("  const LOGO_MASK = Object.freeze([");
console.log(rows.map(r => `    ${JSON.stringify(r)}`).join(",\n"));
console.log("  ]);");

const COL = { ".": [9, 9, 13], W: [206, 211, 220], B: [40, 84, 148], O: [180, 106, 42] }, S = 12;
const px = Buffer.alloc(N * S * N * S * 3);
for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { const col = COL[rows[y][x]]; for (let sy = 0; sy < S; sy++) for (let sx = 0; sx < S; sx++) { const p = ((y * S + sy) * N * S + (x * S + sx)) * 3; px[p] = col[0]; px[p + 1] = col[1]; px[p + 2] = col[2]; } }
mkdirSync(join(rootDir, "manifests"), { recursive: true });
writeFileSync(join(rootDir, "manifests/logo-preview.ppm"), Buffer.concat([Buffer.from(`P6\n${N * S} ${N * S}\n255\n`), px]));
console.error("\npreview → manifests/logo-preview.ppm");
