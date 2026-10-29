/**
 * Casino room sign-in proof (SIP-018 structured data), the session token and the cookie.
 *
 * Plan: docs/plans/CASINO-PRESENCE-PLAN.md (P0 spike). A player signs ONE message per visit; that proves control of a Stacks
 * address, costs nothing and is not a transaction. The server then hands out a 4 hour session (HMAC-signed cookie) so seat
 * moves and messages need no further wallet prompts.
 *
 * Shared by the test page / casino pages (build the message the wallet signs) and by the Pages Functions (verify it).
 *
 * Deliberately a DIFFERENT SIP-018 domain from the Collection Studio login (creator-proof.ts), so a signature made for one can
 * never be replayed as the other. The challenge is stateless (HMAC over its fields) so it needs no database; single use is
 * enforced by the room's Durable Object remembering the nonce.
 */
import {
  createMessageSignature,
  encodeStructuredData,
  getAddressFromPublicKey,
  publicKeyFromSignatureRsv,
  stringAsciiCV,
  TransactionVersion,
  tupleCV,
  uintCV
} from '@stacks/transactions';
import { hmac } from '@noble/hashes/hmac';
import { ripemd160 } from '@noble/hashes/ripemd160';
import { sha256 } from '@noble/hashes/sha256';
import { bytesToHex, hexToBytes } from '@noble/hashes/utils';
import { networkForAddress, type CreatorNetwork } from './creator-proof';

export const ROOM_PROOF_DOMAIN = 'ParallaX Casino';
export const ROOM_PROOF_PURPOSE = 'Casino room entry; no spending permission';
export const ROOM_CHALLENGE_TTL_MS = 2 * 60 * 1000;
export const ROOM_SESSION_TTL_MS = 4 * 60 * 60 * 1000;
export const ROOM_COOKIE = 'px_room';
export const ROOM_COOKIE_PATH = '/casino/room';
export const ROOM_MIN_SECRET_LENGTH = 32;

export type RoomNetwork = CreatorNetwork;
export type RoomChallenge = {
  address: string;
  network: RoomNetwork;
  nonce: string;
  issued: number;
  expires: number;
  mac: string;
};
export type RoomSession = {
  /** The address that signed. */
  a: string;
  /** hash160 of the signing public key: the same for the SP... and ST... form of one account. */
  k: string;
  /** The nonce this session was created from. */
  n: string;
  iat: number;
  exp: number;
};

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export const normalizeAddress = (value: unknown) => String(value ?? '').trim().toUpperCase();

const chainId = (network: RoomNetwork) => (network === 'mainnet' ? 1 : 2147483648);

/** The two Clarity values the wallet signs. The wallet shows the domain name and these fields to the player. */
export const roomProofData = (challenge: Pick<RoomChallenge, 'address' | 'network' | 'nonce' | 'expires'>) => ({
  domain: tupleCV({
    name: stringAsciiCV(ROOM_PROOF_DOMAIN),
    version: stringAsciiCV('1'),
    'chain-id': uintCV(chainId(challenge.network))
  }),
  message: tupleCV({
    purpose: stringAsciiCV(ROOM_PROOF_PURPOSE),
    address: stringAsciiCV(challenge.address),
    nonce: stringAsciiCV(challenge.nonce),
    expires: uintCV(challenge.expires)
  })
});

// ----------------------------------------------------------------- secret + MAC

export const secretUsable = (secret: unknown): secret is string =>
  typeof secret === 'string' && secret.length >= ROOM_MIN_SECRET_LENGTH;

const macOf = (secret: string, parts: Array<string | number>) =>
  bytesToHex(hmac(sha256, encoder.encode(secret), encoder.encode(parts.join('|'))));

const equalHex = (a: string, b: string) => {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
};

const challengeMac = (secret: string, c: Omit<RoomChallenge, 'mac'>) =>
  macOf(secret, ['room-challenge', 'v1', c.address, c.network, c.nonce, c.issued, c.expires]);

// ----------------------------------------------------------------- challenge

export const issueRoomChallenge = (
  secret: string,
  address: string,
  now = Date.now(),
  random: (bytes: number) => Uint8Array = (n) => crypto.getRandomValues(new Uint8Array(n))
): RoomChallenge => {
  const normalized = normalizeAddress(address);
  const network = networkForAddress(normalized);
  if (!network) throw new Error('That is not a valid Stacks address.');
  const base = {
    address: normalized,
    network,
    nonce: bytesToHex(random(32)),
    issued: now,
    expires: now + ROOM_CHALLENGE_TTL_MS
  };
  return { ...base, mac: challengeMac(secret, base) };
};

/** Throws a player-readable Error unless the challenge is one this server issued and is still fresh. */
export const validateRoomChallenge = (secret: string, challenge: unknown, now = Date.now()): RoomChallenge => {
  const c = challenge as RoomChallenge;
  if (
    !c || typeof c !== 'object' ||
    typeof c.address !== 'string' || typeof c.network !== 'string' || typeof c.mac !== 'string' ||
    !/^[a-f0-9]{64}$/.test(String(c.nonce)) || !/^[a-f0-9]{64}$/.test(c.mac)
  ) {
    throw new Error('Invalid sign-in request.');
  }
  if (normalizeAddress(c.address) !== c.address || networkForAddress(c.address) !== c.network) {
    throw new Error('Invalid sign-in address.');
  }
  if (!Number.isSafeInteger(c.issued) || !Number.isSafeInteger(c.expires) ||
      c.expires - c.issued !== ROOM_CHALLENGE_TTL_MS || c.issued > now + 30_000) {
    throw new Error('Invalid sign-in request.');
  }
  if (!equalHex(c.mac, challengeMac(secret, c))) throw new Error('Invalid sign-in request.');
  if (now > c.expires) throw new Error('Sign-in request expired. Try again.');
  return c;
};

/** The signer's address and account key hash when `signature` (65-byte RSV hex) was made over this challenge, else null. */
export const verifyRoomProof = (challenge: RoomChallenge, signature: unknown): { address: string; hash160: string } | null => {
  try {
    if (typeof signature !== 'string') return null;
    const hex = signature.replace(/^0x/, '');
    if (!/^[a-fA-F0-9]{130}$/.test(hex)) return null;
    const hash = bytesToHex(sha256(encodeStructuredData(roomProofData(challenge))));
    const publicKey = publicKeyFromSignatureRsv(hash, createMessageSignature(hex));
    const version = challenge.network === 'mainnet' ? TransactionVersion.Mainnet : TransactionVersion.Testnet;
    if (getAddressFromPublicKey(publicKey, version) !== challenge.address) return null;
    return { address: challenge.address, hash160: bytesToHex(ripemd160(sha256(hexToBytes(publicKey)))) };
  } catch {
    return null;
  }
};

// ----------------------------------------------------------------- session token

const b64url = (bytes: Uint8Array) => {
  let s = '';
  bytes.forEach((b) => { s += String.fromCharCode(b); });
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};
const fromB64url = (text: string) => {
  const pad = text.length % 4 ? '='.repeat(4 - (text.length % 4)) : '';
  const raw = atob(text.replace(/-/g, '+').replace(/_/g, '/') + pad);
  return Uint8Array.from(raw, (ch) => ch.charCodeAt(0));
};

export const signRoomSession = (secret: string, session: RoomSession) => {
  const body = b64url(encoder.encode(JSON.stringify(session)));
  return `v1.${body}.${macOf(secret, ['room-session', body])}`;
};

export const readRoomSessionToken = (secret: string, token: unknown, now = Date.now()): RoomSession | null => {
  try {
    if (typeof token !== 'string') return null;
    const [version, body, mac, extra] = token.split('.');
    if (version !== 'v1' || !body || !mac || extra !== undefined) return null;
    if (!equalHex(mac, macOf(secret, ['room-session', body]))) return null;
    const session = JSON.parse(decoder.decode(fromB64url(body))) as RoomSession;
    if (!session || typeof session.a !== 'string' || typeof session.k !== 'string' ||
        !Number.isSafeInteger(session.exp) || !Number.isSafeInteger(session.iat)) return null;
    if (now > session.exp || session.iat > now + 30_000) return null;
    return session;
  } catch {
    return null;
  }
};

// ----------------------------------------------------------------- cookie

export const readCookie = (request: Request, name: string) => {
  const header = request.headers.get('cookie') || '';
  for (const part of header.split(';')) {
    const index = part.indexOf('=');
    if (index > 0 && part.slice(0, index).trim() === name) {
      try { return decodeURIComponent(part.slice(index + 1).trim()); } catch { return null; }
    }
  }
  return null;
};

const secureFlag = (request: Request) => (new URL(request.url).protocol === 'https:' ? '; Secure' : '');

export const roomSessionCookie = (token: string, request: Request, maxAgeSeconds = Math.floor(ROOM_SESSION_TTL_MS / 1000)) =>
  `${ROOM_COOKIE}=${encodeURIComponent(token)}; Path=${ROOM_COOKIE_PATH}; HttpOnly; SameSite=Strict; Max-Age=${maxAgeSeconds}${secureFlag(request)}`;

export const clearRoomSessionCookie = (request: Request) =>
  `${ROOM_COOKIE}=; Path=${ROOM_COOKIE_PATH}; HttpOnly; SameSite=Strict; Max-Age=0${secureFlag(request)}`;

export const readRoomSession = (secret: string, request: Request, now = Date.now()) =>
  readRoomSessionToken(secret, readCookie(request, ROOM_COOKIE), now);
