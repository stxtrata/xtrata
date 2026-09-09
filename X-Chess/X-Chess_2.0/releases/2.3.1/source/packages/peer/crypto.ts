import { sha256Hex, bytesToHex, hexToBytes } from '../protocol/sha256.js';
export function check(ok: unknown, message: string): asserts ok { if (!ok) throw Error(message); }
export const integer = (n: unknown, min = 0, max = Number.MAX_SAFE_INTEGER): n is number => Number.isSafeInteger(n) && Number(n) >= min && Number(n) <= max;
export function canonical(value: unknown, depth = 0): string {
  check(depth <= 24, 'Message nesting is too deep');
  if (Array.isArray(value)) return '[' + value.map(v => canonical(v, depth + 1)).join(',') + ']';
  if (value && typeof value === 'object') {
    check(Object.getPrototypeOf(value) === Object.prototype, 'Expected plain record');
    const r = value as Record<string, unknown>;
    return '{' + Object.keys(r).sort().map(k => JSON.stringify(k) + ':' + canonical(r[k], depth + 1)).join(',') + '}';
  }
  check(value === null || ['string','number','boolean'].includes(typeof value), 'Unsupported value');
  if (typeof value === 'number') check(integer(value), 'Expected nonnegative integer');
  return JSON.stringify(value);
}
export const hash = (v: unknown): string => sha256Hex(canonical(v));
export const same = (a: unknown, b: unknown, why = 'Record mismatch'): void => check(canonical(a) === canonical(b), why);
export const raw = (hex: string): Uint8Array<ArrayBuffer> => new Uint8Array(hexToBytes(hex));
export const encode = (v: unknown): Uint8Array<ArrayBuffer> => new TextEncoder().encode(canonical(v));
export const pubValid = (key: unknown): key is string => typeof key === 'string' && /^04[0-9a-f]{128}$/.test(key);
export const randomHex = (length = 32): string => bytesToHex(crypto.getRandomValues(new Uint8Array(length)));
export interface GameKey { public: string; secret: CryptoKey }
export interface Signed<T> { payload: T; signature: string }
export async function generateKey(): Promise<GameKey> {
  check(globalThis.crypto?.subtle, 'Peer play needs browser cryptography. Use HTTPS or a trusted local file.');
  const pair = await crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, true, ['sign','verify']);
  return { public: bytesToHex(new Uint8Array(await crypto.subtle.exportKey('raw', pair.publicKey))), secret: pair.privateKey };
}
export async function sign<T>(payload: T, key: CryptoKey): Promise<Signed<T>> {
  return { payload, signature: bytesToHex(new Uint8Array(await crypto.subtle.sign({name:'ECDSA',hash:'SHA-256'}, key, encode(payload)))) };
}
const publicKeys=new Map<string,CryptoKey>();
export async function publicKey(pub:string):Promise<CryptoKey> {
  check(pubValid(pub),'Invalid player key encoding');const cached=publicKeys.get(pub);if(cached)return cached;
  const key=await crypto.subtle.importKey('raw',raw(pub),{name:'ECDSA',namedCurve:'P-256'},false,['verify']);
  if(publicKeys.size>=64)publicKeys.delete(publicKeys.keys().next().value!);publicKeys.set(pub,key);return key;
}
export async function verify<T>(signed: Signed<T>, pub: string): Promise<void> {
  check(pubValid(pub) && signed && typeof signed.signature === 'string' && /^[0-9a-f]{128}$/.test(signed.signature), 'Invalid signature encoding');
  same(Object.keys(signed).sort(), ['payload','signature'], 'Unknown signature fields');
  const key = await publicKey(pub);
  check(await crypto.subtle.verify({name:'ECDSA',hash:'SHA-256'}, key, raw(signed.signature), encode(signed.payload)), 'Signature verification failed');
}
export function parseBounded(text: string, max = 2_000_000): unknown {
  check(new TextEncoder().encode(text).length <= max, 'Message is too large');
  let depth = 0, quoted = false, escape = false;
  for (const c of text) {
    if (quoted) { if (escape) escape = false; else if (c === '\\') escape = true; else if (c === '"') quoted = false; }
    else if (c === '"') quoted = true;
    else if (c === '[' || c === '{') check(++depth <= 24, 'Message nesting is too deep');
    else if (c === ']' || c === '}') depth--;
  }
  return JSON.parse(text);
}
