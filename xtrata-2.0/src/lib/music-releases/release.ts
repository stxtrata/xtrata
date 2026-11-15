/**
 * Artists release their own music (docs/music/ARTIST-RELEASES.md, stage 1): shared rules for the page, the wallet
 * box and the server.
 *
 * A RELEASE is an album definition (a title, songs in order, a cover: the same shape as a gift player,
 * gift-players.ts) made by the wallet that holds every one of its songs, signed by that wallet. It comes with no
 * plays: a listener adds it to their player and plays it with their own plays, each of which pays the song's holder.
 * No money passes through Xtrata.
 *
 * A listener's SHELF is the releases their player has added. It follows the player, not the device, so it is kept
 * on the server, and every change (and every read: a shelf is private) is signed by the player's own key inside the
 * wallet box. Both signatures are SIP-018 structured data under their own domains: they are not transactions and
 * cannot be used as one.
 */
import {
  createMessageSignature, createStacksPrivateKey, encodeStructuredData, getAddressFromPublicKey, publicKeyFromSignatureRsv,
  signMessageHashRsv, stringAsciiCV, TransactionVersion, tupleCV, uintCV
} from '@stacks/transactions';
import { sha256 } from '@noble/hashes/sha256';
import { bytesToHex } from '@noble/hashes/utils';
import { isMainnetStandardAddress } from '../listening-wallet/link';
import { isPlayerId, playerHash, type PlayerDefinition } from '../listening-wallet/gift-players';

export const RELEASE_DOMAIN = 'xtrata.xyz/music/release';
export const RELEASE_PURPOSE = 'Release music on Xtrata Music; no spending permission';
/** A signed request (to release, or to change a shelf) is good for this long. */
export const RELEASE_MAX_AGE_MS = 15 * 60 * 1000;
export const SHELF_DOMAIN = 'xtrata.xyz/music/shelf';
export const SHELF_PURPOSE = 'Keep my Xtrata Music albums; no spending permission';
export const SHELF_MAX_AGE_MS = 5 * 60 * 1000;
/** Albums one player may keep. */
export const SHELF_MAX = 200;

const verify = (hash: string, signature: unknown, address: string): boolean => {
  try {
    if (typeof signature !== 'string') return false;
    const hex = signature.replace(/^0x/, '');
    if (!/^[a-fA-F0-9]{130}$/.test(hex)) return false;
    return getAddressFromPublicKey(publicKeyFromSignatureRsv(hash, createMessageSignature(hex)), TransactionVersion.Mainnet) === address;
  } catch { return false; }
};
const fresh = (issued: unknown, now: number, max: number) => Number.isSafeInteger(issued) && (issued as number) <= now + 60_000 && now - (issued as number) <= max;

// ---------------------------------------------------------------- releasing
/** What the artist's wallet signs: the hash of the definition, so the signature covers every song and word. */
export interface ReleaseRequest { artist: string; hash: string; issued: number }

export function validateReleaseRequest(req: ReleaseRequest, def: PlayerDefinition, now = Date.now()): ReleaseRequest {
  if (!req || !isMainnetStandardAddress(req.artist)) throw new Error('A release needs the artist’s wallet address.');
  if (typeof req.hash !== 'string' || req.hash !== playerHash(def)) throw new Error('The signed request is for a different release.');
  if (!fresh(req.issued, now, RELEASE_MAX_AGE_MS)) throw new Error('Request expired. Sign again.');
  return { artist: req.artist, hash: req.hash, issued: req.issued };
}
export const releaseData = (req: ReleaseRequest) => ({
  domain: tupleCV({ name: stringAsciiCV(RELEASE_DOMAIN), version: stringAsciiCV('1'), 'chain-id': uintCV(1) }),
  message: tupleCV({ purpose: stringAsciiCV(RELEASE_PURPOSE), artist: stringAsciiCV(req.artist), release: stringAsciiCV(req.hash), issued: uintCV(req.issued) })
});
export const releaseDigest = (req: ReleaseRequest) => bytesToHex(sha256(encodeStructuredData(releaseData(req))));
export const verifyReleaseSignature = (req: ReleaseRequest, signature: unknown): boolean => verify(releaseDigest(req), signature, req.artist);

// ---------------------------------------------------------------- a player's shelf
/** add: keep this release · hide / show: out of sight, or back · remove: take it off · list: read my shelf */
export const SHELF_ACTIONS = ['add', 'hide', 'show', 'remove', 'list'] as const;
export type ShelfAction = typeof SHELF_ACTIONS[number];
export interface ShelfRequest {
  action: ShelfAction;
  /** The release's id; empty for `list`. */
  release: string;
  /** The player: the passkey's own wallet. Its key signs. */
  player: string;
  issued: number;
}

export function validateShelfRequest(req: ShelfRequest, now = Date.now()): ShelfRequest {
  if (!req || !(SHELF_ACTIONS as readonly unknown[]).includes(req.action)) throw new Error('Choose what to do with the album.');
  if (!isMainnetStandardAddress(req.player)) throw new Error('A player address is required.');
  if (req.action === 'list' ? req.release !== '' : !isPlayerId(req.release)) throw new Error('That is not an album.');
  if (!fresh(req.issued, now, SHELF_MAX_AGE_MS)) throw new Error('Request expired. Try again.');
  return { action: req.action, release: req.release, player: req.player, issued: req.issued };
}
export const shelfData = (req: ShelfRequest) => ({
  domain: tupleCV({ name: stringAsciiCV(SHELF_DOMAIN), version: stringAsciiCV('1'), 'chain-id': uintCV(1) }),
  message: tupleCV({ purpose: stringAsciiCV(SHELF_PURPOSE), action: stringAsciiCV(req.action), release: stringAsciiCV(req.release), player: stringAsciiCV(req.player), issued: uintCV(req.issued) })
});
export const shelfDigest = (req: ShelfRequest) => bytesToHex(sha256(encodeStructuredData(shelfData(req))));
export const verifyShelfSignature = (req: ShelfRequest, signature: unknown): boolean => verify(shelfDigest(req), signature, req.player);
/** Used only inside the wallet origin, where the key lives. */
export const signShelfRequest = (req: ShelfRequest, privateKey: string): string =>
  signMessageHashRsv({ messageHash: shelfDigest(req), privateKey: createStacksPrivateKey(privateKey) }).data;

// ---------------------------------------------------------------- selling a release (stage 3)
/**
 * An artist may put a price on a release. A listener then adds it by paying that price STRAIGHT to the artist's
 * wallet: one STX transfer whose memo names the order. Xtrata never holds the money, takes no part of it and cannot
 * refund it. The price is what the artist signs here (not a transaction: it only says what the price is).
 */
export const PRICE_PURPOSE = 'Set the price of my release on Xtrata Music; no spending permission';
/** A price is 0 (free) or between these (microSTX): 0.1 STX to 1,000 STX. */
export const PRICE_MIN = 100_000n;
export const PRICE_MAX = 1_000_000_000n;
export const validPrice = (price: bigint) => price === 0n || (price >= PRICE_MIN && price <= PRICE_MAX);
export interface PriceRequest { artist: string; release: string; /** microSTX, decimal string; "0" makes it free */ price: string; issued: number }

export function validatePriceRequest(req: PriceRequest, now = Date.now()): PriceRequest {
  if (!req || !isMainnetStandardAddress(req.artist)) throw new Error('A price needs the artist’s wallet address.');
  if (!isPlayerId(req.release)) throw new Error('That is not a release.');
  if (typeof req.price !== 'string' || !/^(0|[1-9]\d{0,11})$/.test(req.price) || !validPrice(BigInt(req.price))) throw new Error('A price is free, or 0.1 to 1,000 STX.');
  if (!fresh(req.issued, now, RELEASE_MAX_AGE_MS)) throw new Error('Request expired. Sign again.');
  return { artist: req.artist, release: req.release, price: req.price, issued: req.issued };
}
export const priceData = (req: PriceRequest) => ({
  domain: tupleCV({ name: stringAsciiCV(RELEASE_DOMAIN), version: stringAsciiCV('1'), 'chain-id': uintCV(1) }),
  message: tupleCV({ purpose: stringAsciiCV(PRICE_PURPOSE), artist: stringAsciiCV(req.artist), release: stringAsciiCV(req.release), price: uintCV(BigInt(req.price)), issued: uintCV(req.issued) })
});
export const priceDigest = (req: PriceRequest) => bytesToHex(sha256(encodeStructuredData(priceData(req))));
export const verifyPriceSignature = (req: PriceRequest, signature: unknown): boolean => verify(priceDigest(req), signature, req.artist);

/** An order: one listener's purchase of one release. Its id travels in the payment's memo. */
export const isOrderId = (id: unknown): id is string => typeof id === 'string' && /^[0-9a-f]{16}$/.test(id);
export const orderMemo = (id: string) => `buy ${id}`;
/** What a buyer needs to pay an order (public: an address, an amount and a memo). */
export interface OrderView { order: string; release: string; to: string; amount: string; memo: string; status: 'pending' | 'confirming' | 'paid' }
/** "2", "0.5", "12.25": a price for people. */
export const stxText = (micro: bigint | string) => { const m = BigInt(micro); const whole = m / 1_000_000n, frac = (m % 1_000_000n).toString().padStart(6, '0').replace(/0+$/, ''); return frac ? `${whole}.${frac}` : `${whole}`; };
/** What someone typed as a price, in microSTX; null when it is not an amount. */
export const parseStx = (text: string): bigint | null => { const m = /^\s*(\d{1,6})(?:\.(\d{1,6}))?\s*$/.exec(text); return m ? BigInt(m[1]) * 1_000_000n + BigInt((m[2] ?? '').padEnd(6, '0') || '0') : null; };
