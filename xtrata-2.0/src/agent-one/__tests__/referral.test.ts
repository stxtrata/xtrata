import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  BPS, DEFAULT_MIN_PAYOUT_USTX, MEMO_MAX_BYTES, SLUG_MAX, XTRATA_FEE_ADDRESS,
  isSelfReferral, parseRegistry, payoutAddressProblem, planPayout, referralMemo, resolvePartner,
  sanitizeSlug, shareToBps, splitFee, type Partner,
} from '../referral';

// Throwaway mainnet addresses generated from fixed bytes (c32address(22, '11'.repeat(20)) etc).
// They are not anyone's wallet; nothing in this file signs or broadcasts.
const PARTNER_A = 'SP8H248H248H248H248H248H248H248H24ARTQ82';
const PARTNER_B = 'SPH248H248H248H248H248H248H248H249PPB6QW';
const PAYER = 'SPSK6CSK6CSK6CSK6CSK6CSK6CSK6CSK6E8654Z3';

const entry = (over: Record<string, unknown> = {}) => ({
  slug: 'fak-fun', name: 'fak.fun', payoutAddress: PARTNER_A, active: true, ...over,
});
const registry = (...entries: unknown[]) => ({ version: 1, partners: entries });
const partner = (over: Partial<Partner> = {}): Partner => ({
  slug: 'fak-fun', name: 'fak.fun', address: PARTNER_A, active: true,
  shareBps: 5000, selfReferral: true, selfShareBps: 5000, minPayoutUstx: 10_000n, ...over,
});

// Small deterministic PRNG so the property-style loops cannot flake.
function lcg(seed: number) {
  let s = seed >>> 0;
  return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 0x100000000; };
}

describe('sanitizeSlug', () => {
  it('lowercases and trims valid slugs', () => {
    expect(sanitizeSlug('fak-fun')).toBe('fak-fun');
    expect(sanitizeSlug('  FAK-FUN  ')).toBe('fak-fun');
    expect(sanitizeSlug('a')).toBe('a');
    expect(sanitizeSlug('abc123')).toBe('abc123');
  });
  it('rejects anything with a slash, dot, query, whitespace or odd character', () => {
    for (const bad of ['a/b', 'a.b', 'a?b=1', 'a b', 'a&b', 'a#b', '../x', 'a\nb', 'a%20b', 'é', '<b>', "a'b", 'a_b', '-a', 'a-', '--', '']) {
      expect(sanitizeSlug(bad), JSON.stringify(bad)).toBeNull();
    }
  });
  it('rejects non-strings', () => {
    for (const bad of [null, undefined, 5, {}, [], true]) expect(sanitizeSlug(bad as any)).toBeNull();
  });
  it('caps the length so the memo fits', () => {
    expect(sanitizeSlug('a'.repeat(SLUG_MAX))).toBe('a'.repeat(SLUG_MAX));
    expect(sanitizeSlug('a'.repeat(SLUG_MAX + 1))).toBeNull();
  });
});

describe('referralMemo', () => {
  it('is xtrata-ref:<slug> and fits the 34-byte memo limit even for the longest slug', () => {
    expect(referralMemo('fak-fun')).toBe('xtrata-ref:fak-fun');
    const longest = referralMemo('a'.repeat(SLUG_MAX));
    expect(new TextEncoder().encode(longest).length).toBeLessThanOrEqual(MEMO_MAX_BYTES);
  });
  it('refuses a slug that is not clean', () => {
    expect(() => referralMemo('a/b')).toThrow();
    expect(() => referralMemo('')).toThrow();
  });
});

describe('shareToBps', () => {
  it('converts 0..1 with up to 4 decimals', () => {
    expect(shareToBps(0.5)).toBe(5000);
    expect(shareToBps(0)).toBe(0);
    expect(shareToBps(1)).toBe(BPS);
    expect(shareToBps(0.7)).toBe(7000);
    expect(shareToBps(0.1234)).toBe(1234);
  });
  it('rejects out-of-range, over-precise and non-numbers', () => {
    for (const bad of [-0.1, 1.01, 0.12345, NaN, Infinity, '0.5', null, undefined]) {
      expect(shareToBps(bad as any), String(bad)).toBeNull();
    }
  });
});

describe('payoutAddressProblem', () => {
  it('accepts a valid mainnet address', () => {
    expect(payoutAddressProblem(PARTNER_A)).toBeNull();
  });
  it('rejects testnet, bad checksum, contract principals, empty, whitespace and non-strings', () => {
    expect(payoutAddressProblem('ST3JB6BCKV14CG25NF017CR7KRVSM8RAGHB52DWHX')).toMatch(/SP/);
    expect(payoutAddressProblem(PARTNER_A.slice(0, -1) + 'X')).toMatch(/valid/);
    expect(payoutAddressProblem(PARTNER_A + '.some-contract')).toMatch(/valid/);
    expect(payoutAddressProblem('')).toMatch(/SP/);
    expect(payoutAddressProblem(' ' + PARTNER_A)).toMatch(/whitespace/);
    expect(payoutAddressProblem(null)).toMatch(/string/);
  });
  it('refuses the Xtrata fee address (any case)', () => {
    expect(payoutAddressProblem(XTRATA_FEE_ADDRESS)).toMatch(/fee address/);
    expect(payoutAddressProblem(XTRATA_FEE_ADDRESS.toLowerCase())).not.toBeNull();
  });
});

describe('splitFee', () => {
  it('splits 50% exactly and floors the partner side', () => {
    expect(splitFee(610_000n, 5000, 10_000n)).toEqual({ partner: 305_000n, xtrata: 305_000n });
    expect(splitFee(100_001n, 5000, 10_000n)).toEqual({ partner: 50_000n, xtrata: 50_001n });
  });
  it('handles share 0 and share 100%', () => {
    expect(splitFee(610_000n, 0, 10_000n)).toEqual({ partner: 0n, xtrata: 610_000n });
    expect(splitFee(610_000n, BPS, 10_000n)).toEqual({ partner: 610_000n, xtrata: 0n });
  });
  it('gives the partner nothing below the minimum payout and Xtrata keeps all of it', () => {
    expect(splitFee(19_999n, 5000, 10_000n)).toEqual({ partner: 0n, xtrata: 19_999n });
    expect(splitFee(20_000n, 5000, 10_000n)).toEqual({ partner: 10_000n, xtrata: 10_000n });
    expect(splitFee(0n, 5000, 10_000n)).toEqual({ partner: 0n, xtrata: 0n });
  });
  it('a zero minimum still never pays a zero-amount transfer', () => {
    expect(splitFee(1n, 5000, 0n)).toEqual({ partner: 0n, xtrata: 1n });
  });
  it('rejects invalid inputs instead of guessing', () => {
    expect(() => splitFee(-1n, 5000, 0n)).toThrow(RangeError);
    expect(() => splitFee(1n, -1, 0n)).toThrow(RangeError);
    expect(() => splitFee(1n, BPS + 1, 0n)).toThrow(RangeError);
    expect(() => splitFee(1n, 0.5 as any, 0n)).toThrow(RangeError);
    expect(() => splitFee(1n, 5000, -1n)).toThrow(RangeError);
    expect(() => splitFee(5 as any, 5000, 0n)).toThrow(RangeError);
  });
  it('property: partner + xtrata always equals the fee; both non-negative; partner is the floor or zero', () => {
    const rnd = lcg(12345);
    const mins = [0n, 1n, 10_000n, 5_000_000n];
    for (let i = 0; i < 5000; i++) {
      const fee = BigInt(Math.floor(rnd() * 2 ** 40));
      const bps = Math.floor(rnd() * (BPS + 1));
      const min = mins[Math.floor(rnd() * mins.length)];
      const { partner: p, xtrata: x } = splitFee(fee, bps, min);
      expect(p + x).toBe(fee);
      expect(p >= 0n && x >= 0n).toBe(true);
      const floor = (fee * BigInt(bps)) / BigInt(BPS);
      expect(p === 0n || p === floor).toBe(true);
      if (p > 0n) expect(p >= min).toBe(true);
    }
  });
  it('the real 4 MB music quote splits as planned: 0.61 STX fee -> 0.305 each', () => {
    expect(splitFee(610_000n, 5000, DEFAULT_MIN_PAYOUT_USTX)).toEqual({ partner: 305_000n, xtrata: 305_000n });
  });
});

describe('isSelfReferral', () => {
  it('matches the partner address case-insensitively and ignores surrounding space', () => {
    expect(isSelfReferral(PARTNER_A, partner())).toBe(true);
    expect(isSelfReferral(PARTNER_A.toLowerCase(), partner())).toBe(true);
    expect(isSelfReferral(' ' + PARTNER_A + ' ', partner())).toBe(true);
  });
  it('is false for another payer, an unknown payer or junk', () => {
    expect(isSelfReferral(PAYER, partner())).toBe(false);
    for (const bad of [null, undefined, '', '   ', 5, {}]) expect(isSelfReferral(bad, partner())).toBe(false);
  });
});

describe('planPayout', () => {
  const fee = 610_000n;
  const sum = (p: { toPartner: bigint; toXtrata: bigint; rebateToPayer: bigint }) => p.toPartner + p.toXtrata + p.rebateToPayer;

  it('normal referral: partner gets the share, Xtrata the rest, no rebate', () => {
    const plan = planPayout({ agentFee: fee, partner: partner(), payer: PAYER });
    expect(plan).toEqual({ toPartner: 305_000n, toXtrata: 305_000n, rebateToPayer: 0n, selfReferral: false });
  });
  it('self-referral on: no partner transfer; the rebate stays for the payer; Xtrata keeps the rest', () => {
    const plan = planPayout({ agentFee: fee, partner: partner(), payer: PARTNER_A });
    expect(plan).toEqual({ toPartner: 0n, toXtrata: 305_000n, rebateToPayer: 305_000n, selfReferral: true });
  });
  it('self-referral uses selfShare, which can differ from the normal share', () => {
    const plan = planPayout({ agentFee: fee, partner: partner({ selfShareBps: 3000 }), payer: PARTNER_A });
    expect(plan.rebateToPayer).toBe(183_000n);
    expect(plan.toXtrata).toBe(427_000n);
    expect(sum(plan)).toBe(fee);
  });
  it('self-referral off: the partner is paid like anyone else', () => {
    const plan = planPayout({ agentFee: fee, partner: partner({ selfReferral: false }), payer: PARTNER_A });
    expect(plan).toEqual({ toPartner: 305_000n, toXtrata: 305_000n, rebateToPayer: 0n, selfReferral: true });
  });
  it('an unknown payer is treated as a normal referral', () => {
    const plan = planPayout({ agentFee: fee, partner: partner(), payer: null });
    expect(plan.toPartner).toBe(305_000n);
    expect(plan.selfReferral).toBe(false);
  });
  it('the minimum payout applies to the rebate too', () => {
    const plan = planPayout({ agentFee: 19_000n, partner: partner(), payer: PARTNER_A });
    expect(plan).toEqual({ toPartner: 0n, toXtrata: 19_000n, rebateToPayer: 0n, selfReferral: true });
  });
  it('property: the three parts always add up to the fee', () => {
    const rnd = lcg(777);
    for (let i = 0; i < 3000; i++) {
      const agentFee = BigInt(Math.floor(rnd() * 2 ** 36));
      const p = partner({
        shareBps: Math.floor(rnd() * (BPS + 1)), selfShareBps: Math.floor(rnd() * (BPS + 1)),
        selfReferral: rnd() < 0.5, minPayoutUstx: BigInt(Math.floor(rnd() * 50_000)),
      });
      const payer = rnd() < 0.5 ? PARTNER_A : PAYER;
      const plan = planPayout({ agentFee, partner: p, payer });
      expect(sum(plan)).toBe(agentFee);
      expect(plan.toPartner >= 0n && plan.toXtrata >= 0n && plan.rebateToPayer >= 0n).toBe(true);
    }
  });
});

describe('parseRegistry', () => {
  it('accepts a valid entry and applies the defaults', () => {
    const r = parseRegistry(registry(entry()));
    expect(r.errors).toEqual([]);
    expect(r.partners).toHaveLength(1);
    expect(r.partners[0]).toMatchObject({
      slug: 'fak-fun', name: 'fak.fun', address: PARTNER_A, active: true,
      shareBps: 2500, selfReferral: false, selfShareBps: 2500, minPayoutUstx: 10_000n,
    });
  });
  it('a bigger share or self-referral never arrives by omission: both must be written into the entry', () => {
    const deal = parseRegistry(registry(entry({ share: 0.5, selfReferral: true }))).partners[0];
    expect(deal).toMatchObject({ shareBps: 5000, selfReferral: true, selfShareBps: 5000 });
  });
  it('honours explicit share, selfShare, selfReferral and minPayoutUstx; selfShare falls back to share', () => {
    const a = parseRegistry(registry(entry({ share: 0.7, selfReferral: false, minPayoutUstx: 0 }))).partners[0];
    expect(a).toMatchObject({ shareBps: 7000, selfShareBps: 7000, selfReferral: false, minPayoutUstx: 0n });
    const b = parseRegistry(registry(entry({ share: 0.5, selfShare: 0.3 }))).partners[0];
    expect(b).toMatchObject({ shareBps: 5000, selfShareBps: 3000 });
  });
  it('an empty partners list is valid', () => {
    expect(parseRegistry({ version: 1, partners: [] })).toEqual({ partners: [], errors: [] });
  });
  it('rejects a malformed registry as a whole', () => {
    for (const bad of [null, undefined, [], 'x', { partners: [] }, { version: 2, partners: [] }, { version: 1 }, { version: 1, partners: {} }]) {
      const r = parseRegistry(bad as any);
      expect(r.partners).toEqual([]);
      expect(r.errors.length).toBeGreaterThan(0);
    }
  });
  it('drops each bad entry, reports it, and keeps the good ones', () => {
    const cases: Array<[string, Record<string, unknown>]> = [
      ['slug', { slug: 'Bad Slug' }],
      ['slug', { slug: 'FAK' }], // must already be lowercase in the file
      ['name', { name: '<script>' }],
      ['name', { name: '' }],
      ['payoutAddress', { payoutAddress: 'ST3JB6BCKV14CG25NF017CR7KRVSM8RAGHB52DWHX' }],
      ['payoutAddress', { payoutAddress: XTRATA_FEE_ADDRESS }],
      ['active', { active: 'yes' }],
      ['share', { share: 1.5 }],
      ['share', { share: '0.5' }],
      ['selfShare', { selfShare: -1 }],
      ['selfReferral', { selfReferral: 'on' }],
      ['minPayoutUstx', { minPayoutUstx: -1 }],
      ['minPayoutUstx', { minPayoutUstx: 1.5 }],
      ['minPayoutUstx', { minPayoutUstx: 10 ** 12 }],
    ];
    for (const [field, over] of cases) {
      const r = parseRegistry(registry(entry({ slug: 'good', payoutAddress: PARTNER_B }), entry(over)));
      expect(r.partners.map((p) => p.slug), field).toEqual(['good']);
      expect(r.errors.some((e) => e.includes(field)), `${field}: ${r.errors.join('|')}`).toBe(true);
    }
  });
  it('a non-object entry is dropped and reported', () => {
    const r = parseRegistry(registry(null, 5, [], entry()));
    expect(r.partners).toHaveLength(1);
    expect(r.errors).toHaveLength(3);
  });
  it('a duplicate slug drops every copy (ambiguous) and reports it', () => {
    const r = parseRegistry(registry(entry(), entry({ payoutAddress: PARTNER_B }), entry({ slug: 'other', payoutAddress: PAYER })));
    expect(r.partners.map((p) => p.slug)).toEqual(['other']);
    expect(r.errors.some((e) => e.includes('duplicate slug'))).toBe(true);
  });
  it('a payout address shared by two slugs is reported but both are kept', () => {
    const r = parseRegistry(registry(entry(), entry({ slug: 'second' })));
    expect(r.partners.map((p) => p.slug)).toEqual(['fak-fun', 'second']);
    expect(r.errors.some((e) => e.includes('shared'))).toBe(true);
  });
  it('rejects a payout equal to a custom fee address too', () => {
    const r = parseRegistry(registry(entry()), PARTNER_A);
    expect(r.partners).toEqual([]);
    expect(r.errors.some((e) => e.includes('fee address'))).toBe(true);
  });
});

describe('resolvePartner', () => {
  const partners = parseRegistry(registry(
    entry(),
    entry({ slug: 'paused', payoutAddress: PARTNER_B, active: false }),
  )).partners;

  it('resolves an active partner, case-insensitively', () => {
    expect(resolvePartner(partners, 'fak-fun')?.address).toBe(PARTNER_A);
    expect(resolvePartner(partners, 'FAK-FUN')?.slug).toBe('fak-fun');
  });
  it('unknown, inactive, malformed and non-string slugs all give null', () => {
    for (const bad of ['nobody', 'paused', '../fak-fun', 'fak-fun/', '', null, undefined, 5]) {
      expect(resolvePartner(partners, bad as any), String(bad)).toBeNull();
    }
  });
  it('never invents a partner from an empty registry', () => {
    expect(resolvePartner([], 'fak-fun')).toBeNull();
  });
});

describe('the real registry file (public/music-partners.json)', () => {
  const raw = JSON.parse(readFileSync(new URL('../../../public/music-partners.json', import.meta.url), 'utf8'));
  const parsed = parseRegistry(raw);

  it('passes the schema with no errors', () => {
    expect(parsed.errors).toEqual([]);
  });
  it('has unique slugs and unique payout addresses, none equal to the Xtrata fee address', () => {
    const slugs = parsed.partners.map((p) => p.slug);
    const addrs = parsed.partners.map((p) => p.address.toUpperCase());
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(new Set(addrs).size).toBe(addrs.length);
    expect(addrs).not.toContain(XTRATA_FEE_ADDRESS.toUpperCase());
  });
  it('every raw entry survived parsing (nothing silently dropped)', () => {
    expect(parsed.partners).toHaveLength(raw.partners.length);
  });
});
