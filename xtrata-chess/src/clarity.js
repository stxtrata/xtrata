// A minimal Clarity value codec, plus the address encoding needed to show who
// sent a move.
//
// This exists so the inscribed board is self-contained. An inscription cannot
// pull a wallet SDK off a CDN, and the board only needs to encode two uints and
// decode the handful of types this contract returns, so bundling a general
// library would cost far more bytes than it saves.
//
// It is not a general Clarity implementation. It is exactly enough, and
// tests/clarity.test.js checks it byte for byte against @stacks/transactions so
// "exactly enough" stays honest.

const C32 = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

export const CV = {
  INT: 0x00,
  UINT: 0x01,
  BUFFER: 0x02,
  TRUE: 0x03,
  FALSE: 0x04,
  PRINCIPAL_STANDARD: 0x05,
  PRINCIPAL_CONTRACT: 0x06,
  RESPONSE_OK: 0x07,
  RESPONSE_ERR: 0x08,
  NONE: 0x09,
  SOME: 0x0a,
  LIST: 0x0b,
  TUPLE: 0x0c,
  STRING_ASCII: 0x0d,
  STRING_UTF8: 0x0e
};

// ---------------------------------------------------------------------------
// sha256, needed for the address checksum
// ---------------------------------------------------------------------------

const K = new Uint32Array([
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
]);

function rotr(x, n) {
  return (x >>> n) | (x << (32 - n));
}

export function sha256(input) {
  const length = input.length;
  const blocks = Math.ceil((length + 9) / 64);
  const padded = new Uint8Array(blocks * 64);
  padded.set(input);
  padded[length] = 0x80;

  const view = new DataView(padded.buffer);
  const bits = length * 8;
  view.setUint32(padded.length - 8, Math.floor(bits / 0x100000000));
  view.setUint32(padded.length - 4, bits >>> 0);

  const H = new Uint32Array([
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
  ]);
  const w = new Uint32Array(64);

  for (let block = 0; block < blocks; block++) {
    const offset = block * 64;
    for (let i = 0; i < 16; i++) w[i] = view.getUint32(offset + i * 4);
    for (let i = 16; i < 64; i++) {
      const s0 = rotr(w[i - 15], 7) ^ rotr(w[i - 15], 18) ^ (w[i - 15] >>> 3);
      const s1 = rotr(w[i - 2], 17) ^ rotr(w[i - 2], 19) ^ (w[i - 2] >>> 10);
      w[i] = (w[i - 16] + s0 + w[i - 7] + s1) >>> 0;
    }

    let a = H[0];
    let b = H[1];
    let c = H[2];
    let d = H[3];
    let e = H[4];
    let f = H[5];
    let g = H[6];
    let h = H[7];

    for (let i = 0; i < 64; i++) {
      const S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
      const ch = (e & f) ^ (~e & g);
      const t1 = (h + S1 + ch + K[i] + w[i]) >>> 0;
      const S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const t2 = (S0 + maj) >>> 0;
      h = g;
      g = f;
      f = e;
      e = (d + t1) >>> 0;
      d = c;
      c = b;
      b = a;
      a = (t1 + t2) >>> 0;
    }

    H[0] = (H[0] + a) >>> 0;
    H[1] = (H[1] + b) >>> 0;
    H[2] = (H[2] + c) >>> 0;
    H[3] = (H[3] + d) >>> 0;
    H[4] = (H[4] + e) >>> 0;
    H[5] = (H[5] + f) >>> 0;
    H[6] = (H[6] + g) >>> 0;
    H[7] = (H[7] + h) >>> 0;
  }

  const out = new Uint8Array(32);
  const outView = new DataView(out.buffer);
  for (let i = 0; i < 8; i++) outView.setUint32(i * 4, H[i]);
  return out;
}

// ---------------------------------------------------------------------------
// Addresses
// ---------------------------------------------------------------------------

function c32encode(bytes) {
  let value = 0n;
  for (const byte of bytes) value = (value << 8n) | BigInt(byte);

  let out = '';
  while (value > 0n) {
    out = C32[Number(value & 31n)] + out;
    value >>= 5n;
  }

  let leadingZeros = 0;
  for (const byte of bytes) {
    if (byte !== 0) break;
    leadingZeros++;
  }

  return '0'.repeat(leadingZeros) + out;
}

// The inverse of c32address. Needed to build a principal argument, which is
// how the BNS-V2 contract is asked for a wallet's primary name.
function c32decode(text) {
  let value = 0n;
  for (const ch of text) {
    const index = C32.indexOf(ch.toUpperCase());
    if (index < 0) throw new Error(`bad c32 character: ${ch}`);
    value = value * 32n + BigInt(index);
  }

  const bytes = [];
  while (value > 0n) {
    bytes.unshift(Number(value & 0xffn));
    value >>= 8n;
  }
  // hash160 plus a four byte checksum. Left-padding to the known length is what
  // restores any leading zero bytes the encoding dropped.
  while (bytes.length < 24) bytes.unshift(0);
  return new Uint8Array(bytes);
}

/**
 * Split an address back into its version byte and hash160, checking the
 * checksum on the way so a mistyped address fails here rather than becoming a
 * lookup for an account that does not exist.
 */
export function parseAddress(address) {
  const text = String(address || '').trim().toUpperCase();
  if (!text.startsWith('S') || text.length < 20) throw new Error('not a Stacks address');

  const version = C32.indexOf(text[1]);
  if (version < 0) throw new Error('bad address version');

  const body = c32decode(text.slice(2));
  const hash160 = body.slice(0, 20);
  const checksum = body.slice(20);

  const payload = new Uint8Array(21);
  payload[0] = version;
  payload.set(hash160, 1);
  const expected = sha256(sha256(payload)).slice(0, 4);

  for (let i = 0; i < 4; i++) {
    if (checksum[i] !== expected[i]) throw new Error('address checksum does not match');
  }

  return { version, hash160 };
}

export function serializePrincipal(address) {
  const { version, hash160 } = parseAddress(address);
  const out = new Uint8Array(22);
  out[0] = CV.PRINCIPAL_STANDARD;
  out[1] = version;
  out.set(hash160, 2);
  return `0x${bytesToHex(out)}`;
}

export function c32address(version, hash160) {
  const payload = new Uint8Array(1 + hash160.length);
  payload[0] = version;
  payload.set(hash160, 1);
  const checksum = sha256(sha256(payload)).slice(0, 4);

  const body = new Uint8Array(hash160.length + 4);
  body.set(hash160);
  body.set(checksum, hash160.length);

  return `S${C32[version]}${c32encode(body)}`;
}

// ---------------------------------------------------------------------------
// Hex helpers
// ---------------------------------------------------------------------------

export function bytesToHex(bytes) {
  let out = '';
  for (const byte of bytes) out += byte.toString(16).padStart(2, '0');
  return out;
}

export function hexToBytes(hex) {
  const clean = hex.startsWith('0x') ? hex.slice(2) : hex;
  if (clean.length % 2 !== 0) throw new Error('odd length hex');
  const out = new Uint8Array(clean.length / 2);
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}

// ---------------------------------------------------------------------------
// Serialising (only what the contract's read-only functions take)
// ---------------------------------------------------------------------------

export function serializeUint(value) {
  const out = new Uint8Array(17);
  out[0] = CV.UINT;
  let n = BigInt(value);
  for (let i = 16; i >= 1; i--) {
    out[i] = Number(n & 0xffn);
    n >>= 8n;
  }
  return `0x${bytesToHex(out)}`;
}

export function serializeBuffer(value) {
  const body = typeof value === 'string' ? hexToBytes(value) : value;
  const out = new Uint8Array(5 + body.length);
  out[0] = CV.BUFFER;
  new DataView(out.buffer).setUint32(1, body.length);
  out.set(body, 5);
  return `0x${bytesToHex(out)}`;
}

export function serializeNone() {
  return `0x${CV.NONE.toString(16).padStart(2, '0')}`;
}

// Wraps an already-serialised value, so callers compose rather than passing
// types around.
export function serializeSome(innerHex) {
  return `0x${CV.SOME.toString(16).padStart(2, '0')}${String(innerHex).replace(/^0x/, '')}`;
}

export function serializeStringAscii(value) {
  const body = new TextEncoder().encode(value);
  const out = new Uint8Array(5 + body.length);
  out[0] = CV.STRING_ASCII;
  new DataView(out.buffer).setUint32(1, body.length);
  out.set(body, 5);
  return `0x${bytesToHex(out)}`;
}

// ---------------------------------------------------------------------------
// Deserialising
// ---------------------------------------------------------------------------

function readValue(bytes, cursor) {
  const type = bytes[cursor.offset];
  cursor.offset += 1;
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

  switch (type) {
    case CV.INT:
    case CV.UINT: {
      let value = 0n;
      for (let i = 0; i < 16; i++) value = (value << 8n) | BigInt(bytes[cursor.offset + i]);
      cursor.offset += 16;
      if (type === CV.INT && value >= 1n << 127n) value -= 1n << 128n;
      return value;
    }

    case CV.BUFFER: {
      const length = view.getUint32(cursor.offset);
      cursor.offset += 4;
      const out = bytes.slice(cursor.offset, cursor.offset + length);
      cursor.offset += length;
      return out;
    }

    case CV.TRUE:
      return true;

    case CV.FALSE:
      return false;

    case CV.PRINCIPAL_STANDARD: {
      const version = bytes[cursor.offset];
      const hash = bytes.slice(cursor.offset + 1, cursor.offset + 21);
      cursor.offset += 21;
      return c32address(version, hash);
    }

    case CV.PRINCIPAL_CONTRACT: {
      const version = bytes[cursor.offset];
      const hash = bytes.slice(cursor.offset + 1, cursor.offset + 21);
      cursor.offset += 21;
      const nameLength = bytes[cursor.offset];
      cursor.offset += 1;
      const name = new TextDecoder().decode(
        bytes.slice(cursor.offset, cursor.offset + nameLength)
      );
      cursor.offset += nameLength;
      return `${c32address(version, hash)}.${name}`;
    }

    case CV.RESPONSE_OK:
      return { ok: true, value: readValue(bytes, cursor) };

    case CV.RESPONSE_ERR:
      return { ok: false, value: readValue(bytes, cursor) };

    case CV.NONE:
      return null;

    case CV.SOME:
      return readValue(bytes, cursor);

    case CV.LIST: {
      const length = view.getUint32(cursor.offset);
      cursor.offset += 4;
      const out = [];
      for (let i = 0; i < length; i++) out.push(readValue(bytes, cursor));
      return out;
    }

    case CV.TUPLE: {
      const length = view.getUint32(cursor.offset);
      cursor.offset += 4;
      const out = {};
      for (let i = 0; i < length; i++) {
        const nameLength = bytes[cursor.offset];
        cursor.offset += 1;
        const name = new TextDecoder().decode(
          bytes.slice(cursor.offset, cursor.offset + nameLength)
        );
        cursor.offset += nameLength;
        out[name] = readValue(bytes, cursor);
      }
      return out;
    }

    case CV.STRING_ASCII:
    case CV.STRING_UTF8: {
      const length = view.getUint32(cursor.offset);
      cursor.offset += 4;
      const text = new TextDecoder().decode(bytes.slice(cursor.offset, cursor.offset + length));
      cursor.offset += length;
      return text;
    }

    default:
      throw new Error(`unsupported Clarity type 0x${type.toString(16)}`);
  }
}

// Decode a hex-encoded Clarity value into plain JavaScript. Optionals become
// null, responses become {ok, value}, tuples become objects, uints become
// BigInt so nothing is silently rounded.
export function deserialize(hex) {
  const bytes = hexToBytes(hex);
  return readValue(bytes, { offset: 0 });
}
