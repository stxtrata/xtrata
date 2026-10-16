/**
 * Radio gift wallets: shared rules for the page and the server.
 *
 * A gift link funds a NEW listening wallet from the gift treasury, so someone without any Stacks
 * wallet can start paying artists as they listen. Two kinds:
 *   campaign  made by the radio admin, paid from the treasury's campaign pool
 *   friend    paid up front by a listener (amount + GIFT_FEE) before the link goes live
 * Plan: Xtrata Music project, claude/radio-gift-wallets-plan.md.
 */
import { sha256 } from '@noble/hashes/sha256';
import { bytesToHex } from '@noble/hashes/utils';
import { costPerPlay, DEFAULT_PLAY_FEE, RESERVE } from './policy';

/** Smallest gift: about 277 paid plays. */
export const GIFT_MIN = 100_000n;
/** Largest gift: the listening wallet's own cap. */
export const GIFT_MAX = 1_000_000n;
/** Network fee for the treasury's transfer to the new wallet (and for a refund); a friend gifter pays it up front. */
export const GIFT_FEE = 3_000n;
/** An unclaimed link expires after this long; an expired friend gift is refunded to the gifter. */
export const GIFT_EXPIRY_MS = 30 * 24 * 60 * 60 * 1000;
/** Memo on every treasury transfer, so gifts are recognisable on-chain. */
export const GIFT_MEMO = 'xtrata radio gift';
/** Highest fee a stuck treasury send is re-signed with (same nonce, so only one can ever land). */
export const GIFT_FEE_CAP = 20_000n;
/**
 * Memo a friend's deposit must carry: it ties the payment to ONE gift, so nobody watching the
 * mempool can claim someone else's deposit for a gift of their own.
 */
export const giftDepositMemo = (id: string) => `gift ${id}`;
/** Gift links carry the code in the fragment (#gift=…), which browsers never send to a server. */
export const giftLink = (radioUrl: string, code: string) => `${radioUrl}#gift=${code}`;
/** Most links in one admin campaign request. */
export const CAMPAIGN_MAX_LINKS = 100;

export const validGiftAmount = (amount: bigint) => amount >= GIFT_MIN && amount <= GIFT_MAX;
/** Paid plays a gift buys at the default fee, after the return reserve. */
export const giftPlays = (amount: bigint, fee = DEFAULT_PLAY_FEE) => (amount <= RESERVE ? 0 : Number((amount - RESERVE) / costPerPlay(fee)));

/** Gift codes are 22 url-safe characters (16 random bytes). Only their hash is ever stored. */
export const isGiftCode = (code: unknown): code is string => typeof code === 'string' && /^[A-Za-z0-9_-]{22}$/.test(code);
export const giftCodeHash = (code: string) => bytesToHex(sha256(new TextEncoder().encode('xtrata-radio-gift:' + code)));
export function newGiftCode(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// ---- signing domain shared by the admin's SIP-018 requests (prefunded batches: batches.ts; gift players: gift-players.ts) ----
export const CAMPAIGN_DOMAIN = 'xtrata.xyz/radio/gifts';
export const CAMPAIGN_PURPOSE = 'Create Xtrata radio gift links paid from the gift treasury';
/** A signed admin request is accepted for this long after it was issued. */
export const CAMPAIGN_MAX_AGE_MS = 15 * 60 * 1000;

/** What the page shows about a gift (no secrets). */
export interface GiftView {
  status: 'pending-deposit' | 'live' | 'claiming' | 'claimed' | 'expired' | 'refunding' | 'refunded' | 'unknown';
  amount: string;
  source: 'campaign' | 'friend';
  /** Who paid for it: the gifter's address, or null for a campaign. */
  from: string | null;
  label: string;
  expires: number;
  /** The gift player this link opens, when it has one (resolved from the catalogue by the server). */
  player?: import('./gift-players').PlayerView | null;
}
