// referral.ts — referral (affiliate) payout rules for the MUSIC wizard.
//
// PURE functions only: no window, no localStorage, no network, no signing. Nothing in
// agent-core.ts imports this yet (stage 1 of the referral build; see the project docs
// referral-program-plan.md and referral-program-build-stages.md).
//
// What a referral is: a registered partner (e.g. fak.fun) gets a link to the music wizard.
// The user's price never changes. When an inscription completes, the partner is paid a
// share of the WIZARD fee (the 10% the temporary wallet already sends to Xtrata); the core
// protocol fee is untouched.
//
// Amounts are microSTX as bigint. Shares are basis points (integers, 0..10000) so no
// floating point ever touches money.

import { validateStacksAddress } from '@stacks/transactions';

/** Where the wizard fee goes today (the Xtrata deployer / xtrata.btc wallet). */
export const XTRATA_FEE_ADDRESS = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';

export const BPS = 10_000;
/**
 * Standard partner share of the wizard fee when an entry gives no `share`: 25%. A bigger share (fak.fun's 50%)
 * is a negotiated deal and is written into that partner's entry explicitly, so it can never arrive by omission.
 */
export const DEFAULT_SHARE_BPS = 2_500;
/** Below this the partner transfer is not worth sending; the amount goes to Xtrata instead (0.01 STX). */
export const DEFAULT_MIN_PAYOUT_USTX = 10_000n;
const MAX_MIN_PAYOUT_USTX = 100_000_000n; // 100 STX: anything bigger is a typo

/**
 * A Stacks STX-transfer memo is at most 34 bytes. The memo is `xtrata-ref:<slug>`, and the
 * prefix takes 11, so a slug can be at most 23 characters.
 */
export const REFERRAL_MEMO_PREFIX = 'xtrata-ref:';
export const MEMO_MAX_BYTES = 34;
export const SLUG_MAX = MEMO_MAX_BYTES - REFERRAL_MEMO_PREFIX.length; // 23

const SLUG_RE = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
const NAME_RE = /^[\p{L}\p{N} ._()'-]{1,60}$/u;

export type Partner = {
  slug: string;
  name: string;
  /** Mainnet payout address. Always comes from the registry, never from a URL or a request body. */
  address: string;
  active: boolean;
  /** Partner's share of the wizard fee, in basis points. */
  shareBps: number;
  /** When the payer IS the partner: rebate the share to the payer as change instead of paying the partner. */
  selfReferral: boolean;
  /** Share used for that rebate. Falls back to `shareBps`. */
  selfShareBps: number;
  minPayoutUstx: bigint;
};

export type RegistryParse = {
  /** Every valid entry, active or not (resolvePartner filters on `active`). */
  partners: Partner[];
  /** Human-readable problems. The repo's schema test requires this to be empty. */
  errors: string[];
};

/** `?ref=` value -> a safe slug, or null. Lowercases; only a-z, 0-9 and inner hyphens; 1..23 chars. */
export function sanitizeSlug(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  const s = raw.trim().toLowerCase();
  if (s.length < 1 || s.length > SLUG_MAX) return null;
  return SLUG_RE.test(s) ? s : null;
}

/** 0..1 with at most 4 decimals -> basis points; anything else -> null. */
export function shareToBps(share: unknown): number | null {
  if (typeof share !== 'number' || !Number.isFinite(share) || share < 0 || share > 1) return null;
  const bps = Math.round(share * BPS);
  return Math.abs(share * BPS - bps) < 1e-6 ? bps : null;
}

/** Returns a problem description, or null when the address is acceptable as a payout address. */
export function payoutAddressProblem(addr: unknown, feeAddress: string = XTRATA_FEE_ADDRESS): string | null {
  if (typeof addr !== 'string') return 'payoutAddress must be a string';
  if (addr !== addr.trim()) return 'payoutAddress has surrounding whitespace';
  if (!addr.startsWith('SP')) return 'payoutAddress must be a mainnet SP address';
  if (!validateStacksAddress(addr)) return 'payoutAddress is not a valid Stacks address';
  if (addr.toUpperCase() === feeAddress.toUpperCase()) return 'payoutAddress must not be the Xtrata fee address';
  return null;
}

/** `xtrata-ref:<slug>`, the public tag put in the memo of the partner transfer. */
export function referralMemo(slug: string): string {
  const s = sanitizeSlug(slug);
  if (!s) throw new RangeError('invalid referral slug');
  return REFERRAL_MEMO_PREFIX + s;
}

function parseEntry(raw: unknown, path: string, feeAddress: string): { partner?: Partner; errors: string[] } {
  const errors: string[] = [];
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return { errors: [`${path}: must be an object`] };
  const e = raw as Record<string, unknown>;

  const slug = sanitizeSlug(e.slug);
  if (!slug || slug !== e.slug) errors.push(`${path}.slug: must be 1-${SLUG_MAX} lowercase letters, digits or inner hyphens`);

  const name = typeof e.name === 'string' ? e.name.trim() : '';
  if (!NAME_RE.test(name)) errors.push(`${path}.name: must be 1-60 letters, digits, spaces or . _ ( ) ' -`);

  const addrProblem = payoutAddressProblem(e.payoutAddress, feeAddress);
  if (addrProblem) errors.push(`${path}.payoutAddress: ${addrProblem}`);

  if (typeof e.active !== 'boolean') errors.push(`${path}.active: must be true or false`);

  const shareBps = e.share === undefined ? DEFAULT_SHARE_BPS : shareToBps(e.share);
  if (shareBps === null) errors.push(`${path}.share: must be a number from 0 to 1 with at most 4 decimals`);

  const selfShareBps = e.selfShare === undefined ? shareBps : shareToBps(e.selfShare);
  if (selfShareBps === null) errors.push(`${path}.selfShare: must be a number from 0 to 1 with at most 4 decimals`);

  if (e.selfReferral !== undefined && typeof e.selfReferral !== 'boolean') errors.push(`${path}.selfReferral: must be true or false`);

  let minPayout = DEFAULT_MIN_PAYOUT_USTX;
  if (e.minPayoutUstx !== undefined) {
    const m = e.minPayoutUstx;
    if (typeof m !== 'number' || !Number.isSafeInteger(m) || m < 0 || BigInt(m) > MAX_MIN_PAYOUT_USTX) {
      errors.push(`${path}.minPayoutUstx: must be a whole number of microSTX from 0 to ${MAX_MIN_PAYOUT_USTX}`);
    } else {
      minPayout = BigInt(m);
    }
  }

  if (errors.length || !slug || shareBps === null || selfShareBps === null) return { errors };
  return {
    errors,
    partner: {
      slug, name, address: e.payoutAddress as string, active: e.active as boolean,
      shareBps, selfReferral: e.selfReferral === undefined ? false : (e.selfReferral as boolean),
      selfShareBps, minPayoutUstx: minPayout,
    },
  };
}

/**
 * Validate and parse the registry JSON: `{ "version": 1, "partners": [ ... ] }`.
 * Invalid entries are dropped (and reported) so one bad edit cannot disable the others.
 * A slug that appears more than once is ambiguous, so EVERY copy is dropped. A payout
 * address shared by two slugs is reported but kept (one partner can have two campaigns).
 */
export function parseRegistry(raw: unknown, feeAddress: string = XTRATA_FEE_ADDRESS): RegistryParse {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return { partners: [], errors: ['registry must be an object { version: 1, partners: [...] }'] };
  }
  const r = raw as Record<string, unknown>;
  if (r.version !== 1) return { partners: [], errors: ['registry.version must be 1'] };
  if (!Array.isArray(r.partners)) return { partners: [], errors: ['registry.partners must be an array'] };

  const errors: string[] = [];
  const valid: Partner[] = [];
  r.partners.forEach((entry, i) => {
    const res = parseEntry(entry, `partners[${i}]`, feeAddress);
    errors.push(...res.errors);
    if (res.partner) valid.push(res.partner);
  });

  const counts = new Map<string, number>();
  for (const p of valid) counts.set(p.slug, (counts.get(p.slug) || 0) + 1);
  const dupSlugs = [...counts.entries()].filter(([, n]) => n > 1).map(([s]) => s);
  for (const s of dupSlugs) errors.push(`duplicate slug "${s}": all copies ignored`);
  const partners = valid.filter((p) => !dupSlugs.includes(p.slug));

  const byAddr = new Map<string, string>();
  for (const p of partners) {
    const key = p.address.toUpperCase();
    const first = byAddr.get(key);
    if (first) errors.push(`payout address shared by "${first}" and "${p.slug}"`);
    else byAddr.set(key, p.slug);
  }
  return { partners, errors };
}

/** Slug (raw `?ref=` text) -> active partner, or null. Unknown, inactive and malformed all give null. */
export function resolvePartner(partners: readonly Partner[], rawSlug: unknown): Partner | null {
  const slug = sanitizeSlug(rawSlug);
  if (!slug) return null;
  return partners.find((p) => p.active && p.slug === slug) || null;
}

/**
 * Split the wizard fee. partner + xtrata === agentFee, always. The partner amount is the
 * floor of fee * share; if that is under the minimum payout it becomes 0 and Xtrata keeps it.
 */
export function splitFee(agentFee: bigint, shareBps: number, minPayoutUstx: bigint): { partner: bigint; xtrata: bigint } {
  if (typeof agentFee !== 'bigint' || agentFee < 0n) throw new RangeError('agentFee must be a non-negative bigint');
  if (!Number.isInteger(shareBps) || shareBps < 0 || shareBps > BPS) throw new RangeError('shareBps must be an integer from 0 to 10000');
  if (typeof minPayoutUstx !== 'bigint' || minPayoutUstx < 0n) throw new RangeError('minPayoutUstx must be a non-negative bigint');
  const raw = (agentFee * BigInt(shareBps)) / BigInt(BPS);
  const partner = raw > 0n && raw >= minPayoutUstx ? raw : 0n;
  return { partner, xtrata: agentFee - partner };
}

/** True when the paying address is the partner's own payout address (case-insensitive). */
export function isSelfReferral(payer: unknown, partner: Pick<Partner, 'address'>): boolean {
  return typeof payer === 'string' && payer.trim().length > 0 && payer.trim().toUpperCase() === partner.address.toUpperCase();
}

export type PayoutPlan = {
  /** Sent to the partner's address (with the referral memo). */
  toPartner: bigint;
  /** Sent to the Xtrata fee address. */
  toXtrata: bigint;
  /** Left in the temporary wallet so it returns to the payer as change (self-referral only). */
  rebateToPayer: bigint;
  selfReferral: boolean;
};

/**
 * Where the wizard fee goes. toPartner + toXtrata + rebateToPayer === agentFee, always.
 *  - Normal referral: partner gets their share, Xtrata the rest.
 *  - Payer is the partner and self-referral is on: no partner transfer. The rebate (at
 *    selfShare) stays in the wallet and comes back as change; Xtrata gets the rest.
 *  - Payer is the partner and self-referral is off: paid like any other referral.
 */
export function planPayout(args: { agentFee: bigint; partner: Partner; payer: unknown }): PayoutPlan {
  const { agentFee, partner, payer } = args;
  const self = isSelfReferral(payer, partner);
  if (self && partner.selfReferral) {
    const { partner: rebate, xtrata } = splitFee(agentFee, partner.selfShareBps, partner.minPayoutUstx);
    return { toPartner: 0n, toXtrata: xtrata, rebateToPayer: rebate, selfReferral: true };
  }
  const { partner: toPartner, xtrata } = splitFee(agentFee, partner.shareBps, partner.minPayoutUstx);
  return { toPartner, toXtrata: xtrata, rebateToPayer: 0n, selfReferral: self };
}
