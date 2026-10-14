/**
 * Radio gift wallets: shared rules for the page and the server.
 *
 * A gift link funds a NEW listening wallet from the gift treasury, so someone without any Stacks
 * wallet can start paying artists as they listen. Two kinds:
 *   campaign  made by the radio admin, paid from the treasury's campaign pool
 *   friend    paid up front by a listener (amount + GIFT_FEE) before the link goes live
 * Plan: Xtrata Music project, claude/radio-gift-wallets-plan.md.
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

// ---- admin campaign request (SIP-018 structured data, signed by the admin's own wallet) ----
export const CAMPAIGN_DOMAIN = 'xtrata.xyz/radio/gifts';
export const CAMPAIGN_PURPOSE = 'Create Xtrata radio gift links paid from the gift treasury';
/** A campaign signature is accepted for this long after it was issued. */
export const CAMPAIGN_MAX_AGE_MS = 15 * 60 * 1000;

export interface CampaignRequest {
  admin: string;
  count: number;
  /** microSTX per link, decimal string. */
  amount: string;
  /** A short label shown to recipients, e.g. "Launch week". ASCII, up to 40 characters. */
  label: string;
  issued: number;
  /**
   * A gift player these links open (see gift-players.ts). Part of what the admin signs only when present,
   * so a request without one is exactly what it always was.
   */
  player?: string;
}

export function validateCampaign(req: CampaignRequest, now = Date.now()): CampaignRequest {
  if (!req || typeof req.admin !== 'string') throw new Error('Campaign needs the admin address.');
  if (!Number.isSafeInteger(req.count) || req.count < 1 || req.count > CAMPAIGN_MAX_LINKS) throw new Error(`Make 1 to ${CAMPAIGN_MAX_LINKS} links at a time.`);
  if (typeof req.amount !== 'string' || !/^\d{1,9}$/.test(req.amount) || !validGiftAmount(BigInt(req.amount))) throw new Error('Each gift must be 0.1 to 1 STX.');
  if (typeof req.label !== 'string' || !/^[ -~]{0,40}$/.test(req.label)) throw new Error('Label: up to 40 plain characters.');
  if (req.player !== undefined && !(typeof req.player === 'string' && /^[0-9a-f]{16}$/.test(req.player))) throw new Error('That is not a gift player id.');
  if (!Number.isSafeInteger(req.issued) || req.issued > now + 60_000 || now - req.issued > CAMPAIGN_MAX_AGE_MS) throw new Error('Request expired. Sign again.');
  return req;
}

export const campaignData = (req: CampaignRequest) => ({
  domain: tupleCV({ name: stringAsciiCV(CAMPAIGN_DOMAIN), version: stringAsciiCV('1'), 'chain-id': uintCV(1) }),
  message: tupleCV({
    purpose: stringAsciiCV(CAMPAIGN_PURPOSE),
    admin: stringAsciiCV(req.admin),
    count: uintCV(req.count),
    amount: uintCV(BigInt(req.amount)),
    label: stringAsciiCV(req.label),
    issued: uintCV(req.issued),
    ...(req.player ? { player: stringAsciiCV(req.player) } : {})
  })
});

/** True only when `signature` (65-byte RSV hex) was made by `address` over this request. */
export function verifyCampaignSignature(req: CampaignRequest, signature: unknown, address: string): boolean {
  try {
    if (typeof signature !== 'string') return false;
    const hex = signature.replace(/^0x/, '');
    if (!/^[a-fA-F0-9]{130}$/.test(hex)) return false;
    const hash = bytesToHex(sha256(encodeStructuredData(campaignData(req))));
    return getAddressFromPublicKey(publicKeyFromSignatureRsv(hash, createMessageSignature(hex)), TransactionVersion.Mainnet) === address;
  } catch {
    return false;
  }
}

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
