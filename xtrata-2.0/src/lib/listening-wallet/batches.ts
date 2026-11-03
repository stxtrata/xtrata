/**
 * Radio prefunded batches: shared rules for the page and the server.
 *
 * A batch is N gift links made by a creator who pays for every one of them up front, in ONE transfer to the gift
 * treasury (memo `batch <id>`). The links stay dormant until that payment confirms; then all of them go live together.
 * Each copy that is claimed is paid out of the creator's own money; each copy still unclaimed after 30 days goes back to
 * the creator. The treasury never pays for a copy out of its own pocket, and a listener's leftover plays go back to the
 * creator because the creator is recorded as the gift's payer (the same rule friend gifts already follow).
 *
 * The creator signs one SIP-018 request (below). When the batch carries an album (a gift player) the signer must be the
 * player's owner, so only the wallet that holds an album's songs can fund copies of it.
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
import { CAMPAIGN_DOMAIN, CAMPAIGN_MAX_AGE_MS, CAMPAIGN_MAX_LINKS, GIFT_FEE, GIFT_MAX, GIFT_MIN, validGiftAmount } from './gifts';
import { isMainnetStandardAddress } from './link';
import { costPerPlay, DEFAULT_PLAY_FEE, HOLDER_PAYMENT, LIKES_FLOAT, RESERVE } from './policy';

/** Most copies in one batch (several batches are allowed). */
export const BATCH_MAX_COPIES = CAMPAIGN_MAX_LINKS;
export const BATCH_PURPOSE = 'Create a prefunded Xtrata radio gift batch';
/** Batch ids are short and url-safe: they travel in a memo, not in a link. */
export const isBatchId = (id: unknown): id is string => typeof id === 'string' && /^[0-9a-f]{16}$/.test(id);
/** The memo the creator's deposit must carry: `batch <id>` (22 bytes, well inside the 34 a memo allows). */
export const batchDepositMemo = (id: string) => `batch ${id}`;
export const BATCH_MEMO = /^batch ([0-9a-f]{16})$/;

export interface BatchRequest {
  /** The wallet that pays, and the wallet leftovers and refunds go back to. */
  creator: string;
  /** The gift player (album) every copy opens, when there is one. Part of what is signed only when present. */
  player?: string;
  count: number;
  /** microSTX that LAND in each new wallet (plays value + reserve + the likes float for an album), decimal string. */
  amount: string;
  /** A short label shown to recipients, e.g. "Opera launch". ASCII, up to 40 characters. */
  label: string;
  issued: number;
}

export function validateBatch(req: BatchRequest, now = Date.now()): BatchRequest {
  if (!req || typeof req.creator !== 'string' || !isMainnetStandardAddress(req.creator)) throw new Error('A batch needs the creator’s Stacks address.');
  if (!Number.isSafeInteger(req.count) || req.count < 1 || req.count > BATCH_MAX_COPIES) throw new Error(`Make 1 to ${BATCH_MAX_COPIES} copies at a time.`);
  if (typeof req.amount !== 'string' || !/^\d{1,9}$/.test(req.amount) || !validGiftAmount(BigInt(req.amount))) throw new Error('Each copy must be 0.01 to 1 STX.');
  if (typeof req.label !== 'string' || !/^[ -~]{0,40}$/.test(req.label)) throw new Error('Label: up to 40 plain characters.');
  if (req.player !== undefined && !(typeof req.player === 'string' && /^[0-9a-f]{16}$/.test(req.player))) throw new Error('That is not a gift player id.');
  if (!Number.isSafeInteger(req.issued) || req.issued > now + 60_000 || now - req.issued > CAMPAIGN_MAX_AGE_MS) throw new Error('Request expired. Sign again.');
  return req;
}

export const batchData = (req: BatchRequest) => ({
  domain: tupleCV({ name: stringAsciiCV(CAMPAIGN_DOMAIN), version: stringAsciiCV('1'), 'chain-id': uintCV(1) }),
  message: tupleCV({
    purpose: stringAsciiCV(BATCH_PURPOSE),
    creator: stringAsciiCV(req.creator),
    count: uintCV(req.count),
    amount: uintCV(BigInt(req.amount)),
    label: stringAsciiCV(req.label),
    issued: uintCV(req.issued),
    ...(req.player ? { player: stringAsciiCV(req.player) } : {})
  })
});

/** The hash of what the creator signed: each signed request works once. */
export const batchRequestHash = (req: BatchRequest) => bytesToHex(sha256(encodeStructuredData(batchData(req))));

/** True only when `signature` (65-byte RSV hex) was made by `address` over this request. */
export function verifyBatchSignature(req: BatchRequest, signature: unknown, address: string): boolean {
  try {
    if (typeof signature !== 'string') return false;
    const hex = signature.replace(/^0x/, '');
    if (!/^[a-fA-F0-9]{130}$/.test(hex)) return false;
    return getAddressFromPublicKey(publicKeyFromSignatureRsv(batchRequestHash(req), createMessageSignature(hex)), TransactionVersion.Mainnet) === address;
  } catch {
    return false;
  }
}

// ---- money: the creator pays for everything up front, so the form shows all of it ----

/** What one copy must carry for `plays` paid plays: the plays and the return reserve, plus the likes float for an album. */
export const copyAmountForPlays = (plays: number, album: boolean, fee = DEFAULT_PLAY_FEE) =>
  RESERVE + BigInt(plays) * costPerPlay(fee) + (album ? LIKES_FLOAT : 0n);

/** Most paid plays one copy can carry (a copy is at most GIFT_MAX). */
export const maxCopyPlays = (album: boolean, fee = DEFAULT_PLAY_FEE) =>
  Number((GIFT_MAX - RESERVE - (album ? LIKES_FLOAT : 0n)) / costPerPlay(fee));

/** What the creator transfers to the treasury: every copy's amount plus the network fee that sends it (or refunds it). */
export const batchDeposit = (count: number, amount: bigint) => BigInt(count) * (amount + GIFT_FEE);

/** The whole bill, line by line, for the form. All microSTX. */
export function batchBreakdown(count: number, amount: bigint, album: boolean, fee = DEFAULT_PLAY_FEE) {
  const float = album ? LIKES_FLOAT : 0n;
  const playsValue = amount > RESERVE + float ? amount - RESERVE - float : 0n;
  const plays = Number(playsValue / costPerPlay(fee));
  return {
    plays,
    /** Of one copy: what goes to song holders, and what is network fee, if all its plays are used. */
    holders: BigInt(plays) * HOLDER_PAYMENT,
    fees: BigInt(plays) * fee,
    reserve: RESERVE,
    float,
    /** Network fee the treasury spends sending the copy (or refunding it). */
    sendFee: GIFT_FEE,
    perCopy: amount + GIFT_FEE,
    total: batchDeposit(count, amount)
  };
}

export const validBatchAmount = (amount: bigint) => amount >= GIFT_MIN && amount <= GIFT_MAX;

/** What the page shows about a batch (no secrets). */
export interface BatchView {
  id: string;
  /** pending-deposit: waiting for the creator's payment. live: paid, copies can be claimed. */
  status: 'pending-deposit' | 'live';
  count: number;
  amount: string;
  label: string;
  player: string | null;
  /** The deposit the creator must make (microSTX), and the memo it must carry. */
  deposit: string;
  memo: string;
  expires: number;
  /** Copies by state: waiting to be claimed, being sent, claimed, expired and waiting for a refund, refunded. */
  copies: { waiting: number; claiming: number; claimed: number; refunding: number; refunded: number };
}
