// A minimal Clarity value codec, plus the address encoding needed to say who
// sent something.
//
// This exists so the inscribed board is self-contained. An inscription cannot
// pull an SDK off a CDN, and every byte it carries is permanent, so bundling a
// general library would cost far more than it saves. What is needed is: encode
// the handful of argument types the contract's read-only functions take, and
// decode the handful of types they return.
//
// It is not a general Clarity implementation. It is exactly enough, and
// tests/protocol/clarity.test.ts checks it byte for byte against
// @stacks/transactions so that "exactly enough" stays honest.

import { sha256 } from '../protocol/sha256.js';

export { bytesToHex, hexToBytes } from '../protocol/sha256.js';
import { bytesToHex, hexToBytes } from '../protocol/sha256.js';

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
} as const;

// ---------------------------------------------------------------------------
// Addresses
// ---------------------------------------------------------------------------

function c32encode(bytes: Uint8Array): string {
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

function c32decode(text: string): Uint8Array {
  let value = 0n;
  for (const ch of text) {
    const index = C32.indexOf(ch.toUpperCase());
    if (index < 0) throw new Error(`bad c32 character: ${ch}`);
    value = value * 32n + BigInt(index);
  }

  const bytes: number[] = [];
  while (value > 0n) {
    bytes.unshift(Number(value & 0xffn));
    value >>= 8n;
  }
  // A hash160 plus a four byte checksum. Left-padding to the known length is
  // what restores any leading zero bytes the encoding dropped.
  while (bytes.length < 24) bytes.unshift(0);
  return new Uint8Array(bytes);
}

export interface ParsedAddress {
  version: number;
  hash160: Uint8Array;
}

/**
 * Split an address into its version byte and hash160, checking the checksum on
 * the way so that a mistyped address fails here rather than quietly becoming a
 * lookup for an account that does not exist.
 *
 * Stacks addresses are NOT a fixed width. Roughly a quarter are not 41
 * characters, because the encoding drops leading zero bytes. Anything
 * downstream that assumes otherwise is wrong.
 */
export function parseAddress(address: string): ParsedAddress {
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

export function c32address(version: number, hash160: Uint8Array): string {
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
// Serialising
// ---------------------------------------------------------------------------

const hexValue = (bytes: Uint8Array): string => `0x${bytesToHex(bytes)}`;

export function serializeUint(value: number | bigint): string {
  const out = new Uint8Array(17);
  out[0] = CV.UINT;
  let n = BigInt(value);
  if (n < 0n) throw new Error('a uint cannot be negative');
  for (let i = 16; i >= 1; i--) {
    out[i] = Number(n & 0xffn);
    n >>= 8n;
  }
  return hexValue(out);
}

export function serializeBool(value: boolean): string {
  return `0x${(value ? CV.TRUE : CV.FALSE).toString(16).padStart(2, '0')}`;
}

export function serializeBuffer(value: string | Uint8Array): string {
  const body = typeof value === 'string' ? hexToBytes(value) : value;
  const out = new Uint8Array(5 + body.length);
  out[0] = CV.BUFFER;
  new DataView(out.buffer).setUint32(1, body.length);
  out.set(body, 5);
  return hexValue(out);
}

export function serializeNone(): string {
  return `0x${CV.NONE.toString(16).padStart(2, '0')}`;
}

/** Wraps an already-serialised value, so callers compose rather than pass types. */
export function serializeSome(innerHex: string): string {
  return `0x${CV.SOME.toString(16).padStart(2, '0')}${String(innerHex).replace(/^0x/, '')}`;
}

export function serializeStringAscii(value: string): string {
  const body = new TextEncoder().encode(value);
  for (const byte of body) {
    if (byte > 0x7f) throw new Error('string-ascii cannot hold a non-ASCII character');
  }
  const out = new Uint8Array(5 + body.length);
  out[0] = CV.STRING_ASCII;
  new DataView(out.buffer).setUint32(1, body.length);
  out.set(body, 5);
  return hexValue(out);
}

export function serializePrincipal(address: string): string {
  const { version, hash160 } = parseAddress(address);
  const out = new Uint8Array(22);
  out[0] = CV.PRINCIPAL_STANDARD;
  out[1] = version;
  out.set(hash160, 2);
  return hexValue(out);
}

// ---------------------------------------------------------------------------
// Deserialising
// ---------------------------------------------------------------------------

export interface ClarityResponse {
  ok: boolean;
  value: ClarityJs;
}

export type ClarityJs =
  | bigint
  | boolean
  | string
  | null
  | Uint8Array
  | ClarityResponse
  | ClarityJs[]
  | { [key: string]: ClarityJs };

interface Cursor {
  offset: number;
}

function readValue(bytes: Uint8Array, cursor: Cursor, view: DataView): ClarityJs {
  const type = bytes[cursor.offset];
  cursor.offset += 1;

  switch (type) {
    case CV.INT:
    case CV.UINT: {
      // BigInt, so nothing is silently rounded. A uint128 does not fit in a
      // Number, and a move sequence that rounded would point at the wrong entry.
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
      const name = new TextDecoder().decode(bytes.slice(cursor.offset, cursor.offset + nameLength));
      cursor.offset += nameLength;
      return `${c32address(version, hash)}.${name}`;
    }

    case CV.RESPONSE_OK:
      return { ok: true, value: readValue(bytes, cursor, view) };

    case CV.RESPONSE_ERR:
      return { ok: false, value: readValue(bytes, cursor, view) };

    case CV.NONE:
      return null;

    case CV.SOME:
      return readValue(bytes, cursor, view);

    case CV.LIST: {
      const length = view.getUint32(cursor.offset);
      cursor.offset += 4;
      const out: ClarityJs[] = [];
      for (let i = 0; i < length; i++) out.push(readValue(bytes, cursor, view));
      return out;
    }

    case CV.TUPLE: {
      const length = view.getUint32(cursor.offset);
      cursor.offset += 4;
      const out: { [key: string]: ClarityJs } = {};
      for (let i = 0; i < length; i++) {
        const nameLength = bytes[cursor.offset];
        cursor.offset += 1;
        const name = new TextDecoder().decode(
          bytes.slice(cursor.offset, cursor.offset + nameLength)
        );
        cursor.offset += nameLength;
        out[name] = readValue(bytes, cursor, view);
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
      throw new Error(`unsupported Clarity type 0x${(type ?? 0).toString(16)}`);
  }
}

/**
 * Decode a hex-encoded Clarity value into plain JavaScript.
 *
 * Optionals become null, responses become `{ok, value}`, tuples become objects,
 * lists become arrays, and uints become BigInt.
 *
 * The BigInt is worth knowing about downstream: it breaks `JSON.stringify`, and
 * a throw inside a try once made a SUCCESSFUL read report itself as a failure.
 * Convert deliberately at the edge rather than stringifying a decoded value.
 */
export function deserialize(hex: string): ClarityJs {
  const bytes = hexToBytes(hex);
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  return readValue(bytes, { offset: 0 }, view);
}
