// flacdec.mjs - minimal dependency-free FLAC decoder (no WASM, no imports).
// decodeFlac(u8, {verify}) -> { sampleRate, channels, bitsPerSample, length, data: Int32Array[] }
// Supports STREAMINFO, constant/verbatim/fixed/LPC subframes, Rice and Rice2 residuals,
// wasted bits, stereo decorrelation, and optional CRC-8/CRC-16 verification.

const CRC8 = new Uint8Array(256);
const CRC16 = new Uint16Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let k = 0; k < 8; k++) c = c & 0x80 ? ((c << 1) ^ 0x07) & 0xff : (c << 1) & 0xff;
  CRC8[i] = c;
  let d = i << 8;
  for (let k = 0; k < 8; k++) d = d & 0x8000 ? ((d << 1) ^ 0x8005) & 0xffff : (d << 1) & 0xffff;
  CRC16[i] = d;
}

class Bits {
  constructor(buf, bytePos) { this.b = buf; this.p = bytePos * 8; }
  bit() { const v = (this.b[this.p >>> 3] >>> (7 - (this.p & 7))) & 1; this.p++; return v; }
  u(n) { // unsigned, n <= 32
    let v = 0;
    while (n > 0) {
      const avail = 8 - (this.p & 7), take = n < avail ? n : avail;
      v = v * (1 << take) + ((this.b[this.p >>> 3] >>> (avail - take)) & ((1 << take) - 1));
      this.p += take; n -= take;
    }
    return v;
  }
  s(n) { const v = this.u(n); return v >= 2 ** (n - 1) ? v - 2 ** n : v; }
  unary() { let q = 0; while (this.bit() === 0) q++; return q; }
  align() { this.p = (this.p + 7) & ~7; }
}

function residual(br, n, order, out) {
  const method = br.u(2);
  if (method > 1) throw new Error("FLAC: bad residual method");
  const po = br.u(4), parts = 1 << po, pbits = method ? 5 : 4, esc = method ? 31 : 15;
  let i = order;
  for (let p = 0; p < parts; p++) {
    const cnt = (p === 0 ? (n >> po) - order : n >> po);
    const k = br.u(pbits);
    if (k === esc) {
      const bits = br.u(5);
      for (let j = 0; j < cnt; j++) out[i++] = bits ? br.s(bits) : 0;
    } else {
      for (let j = 0; j < cnt; j++) {
        const v = (br.unary() << k) + (k ? br.u(k) : 0);
        out[i++] = (v >>> 1) ^ -(v & 1);
      }
    }
  }
}

function subframe(br, n, bps) {
  if (br.bit() !== 0) throw new Error("FLAC: bad subframe pad");
  const type = br.u(6);
  let wasted = 0;
  if (br.bit()) wasted = br.unary() + 1;
  bps -= wasted;
  const out = new Int32Array(n);
  if (type === 0) { out.fill(br.s(bps)); }
  else if (type === 1) { for (let i = 0; i < n; i++) out[i] = br.s(bps); }
  else if (type >= 8 && type <= 12) {
    const order = type & 7;
    for (let i = 0; i < order; i++) out[i] = br.s(bps);
    residual(br, n, order, out);
    for (let i = order; i < n; i++) {
      const a = out[i - 1], b = out[i - 2], c = out[i - 3], d = out[i - 4];
      const pred = order === 0 ? 0 : order === 1 ? a : order === 2 ? 2 * a - b
        : order === 3 ? 3 * a - 3 * b + c : 4 * a - 6 * b + 4 * c - d;
      out[i] += pred;
    }
  } else if (type >= 32) {
    const order = (type & 31) + 1;
    for (let i = 0; i < order; i++) out[i] = br.s(bps);
    const prec = br.u(4) + 1;
    if (prec === 16) throw new Error("FLAC: bad precision");
    const shift = br.s(5);
    if (shift < 0) throw new Error("FLAC: negative shift unsupported");
    const coef = new Array(order);
    for (let j = 0; j < order; j++) coef[j] = br.s(prec);
    residual(br, n, order, out);
    const div = 2 ** shift;
    for (let i = order; i < n; i++) {
      let sum = 0; // doubles are exact here (|sum| < 2^53)
      for (let j = 0; j < order; j++) sum += coef[j] * out[i - 1 - j];
      out[i] += Math.floor(sum / div);
    }
  } else throw new Error("FLAC: reserved subframe type");
  if (wasted) for (let i = 0; i < n; i++) out[i] *= 2 ** wasted;
  return out;
}

export function decodeFlac(buf, { verify = false } = {}) {
  if (buf[0] !== 0x66 || buf[1] !== 0x4c || buf[2] !== 0x61 || buf[3] !== 0x43) throw new Error("not FLAC");
  let p = 4, info = null;
  for (;;) {
    const h = buf[p], type = h & 0x7f, len = (buf[p + 1] << 16) | (buf[p + 2] << 8) | buf[p + 3];
    p += 4;
    if (type === 0) {
      const q = p;
      info = {
        sampleRate: (buf[q + 10] << 12) | (buf[q + 11] << 4) | (buf[q + 12] >> 4),
        channels: ((buf[q + 12] >> 1) & 7) + 1,
        bitsPerSample: (((buf[q + 12] & 1) << 4) | (buf[q + 13] >> 4)) + 1,
        total: (buf[q + 13] & 15) * 2 ** 32 + (((buf[q + 14] << 24) | (buf[q + 15] << 16) | (buf[q + 16] << 8) | buf[q + 17]) >>> 0),
      };
    }
    p += len;
    if (h & 0x80) break;
  }
  if (!info) throw new Error("FLAC: no STREAMINFO");
  const chans = Array.from({ length: info.channels }, () => new Int32Array(info.total));
  let pos = 0;
  while (p < buf.length && pos < info.total) {
    const start = p, br = new Bits(buf, p);
    if (br.u(14) !== 0x3ffe) throw new Error("FLAC: lost sync at byte " + p);
    br.u(2);
    const bsc = br.u(4), src = br.u(4), cc = br.u(4), ssc = br.u(3); br.u(1);
    const first = br.u(8); // UTF-8 coded frame/sample number: skip continuation bytes
    if (first >= 0xc0) { let n = first >= 0xfe ? 6 : first >= 0xfc ? 5 : first >= 0xf8 ? 4 : first >= 0xf0 ? 3 : first >= 0xe0 ? 2 : 1; while (n--) br.u(8); }
    let n = bsc === 1 ? 192 : bsc >= 2 && bsc <= 5 ? 576 << (bsc - 2) : bsc === 6 ? br.u(8) + 1 : bsc === 7 ? br.u(16) + 1 : 256 << (bsc - 8);
    if (src === 12) br.u(8); else if (src === 13 || src === 14) br.u(16);
    const hdrEnd = br.p >>> 3, crc8 = br.u(8);
    if (verify) { let c = 0; for (let i = start; i < hdrEnd; i++) c = CRC8[c ^ buf[i]]; if (c !== crc8) throw new Error("FLAC: header CRC-8"); }
    const bps = ssc === 0 ? info.bitsPerSample : [0, 8, 12, 0, 16, 20, 24, 32][ssc];
    const nch = cc < 8 ? cc + 1 : 2;
    const sub = [];
    for (let c = 0; c < nch; c++) sub.push(subframe(br, n, bps + (cc === 8 && c === 1) + (cc === 9 && c === 0) + (cc === 10 && c === 1)));
    br.align();
    const end = br.p >>> 3, crc16 = br.u(16);
    if (verify) { let c = 0; for (let i = start; i < end; i++) c = ((c << 8) & 0xffff) ^ CRC16[(c >>> 8) ^ buf[i]]; if (c !== crc16) throw new Error("FLAC: frame CRC-16"); }
    if (cc === 8) { for (let i = 0; i < n; i++) sub[1][i] = sub[0][i] - sub[1][i]; }
    else if (cc === 9) { for (let i = 0; i < n; i++) sub[0][i] += sub[1][i]; }
    else if (cc === 10) { for (let i = 0; i < n; i++) { const s = sub[1][i], m = (sub[0][i] * 2) | (s & 1); sub[0][i] = (m + s) >> 1; sub[1][i] = (m - s) >> 1; } }
    for (let c = 0; c < nch; c++) chans[c].set(n + pos > info.total ? sub[c].subarray(0, info.total - pos) : sub[c], pos);
    pos += n; p = br.p >>> 3;
  }
  return { sampleRate: info.sampleRate, channels: info.channels, bitsPerSample: info.bitsPerSample, length: info.total, data: chans };
}
