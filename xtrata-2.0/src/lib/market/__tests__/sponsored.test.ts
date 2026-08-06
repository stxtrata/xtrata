import { describe, expect, it } from 'vitest';
import {
  MIN_FEE_BUDGET_USTX,
  MAX_USEFUL_BUDGET_USTX,
  REFUND_DELAY_BLOCKS,
  isSponsoredMarket,
  validateFeeBudget,
  getSponsoredBuyEligibility,
  sponsorFeeToCharge,
  SPONSOR_FEE_CAP_USTX,
  SPONSOR_FEE_FLOOR_USTX,
  getSellerBudgetSummary
} from '../sponsored';

describe('isSponsoredMarket', () => {
  it('is true only for entries with sponsored: true', () => {
    expect(isSponsoredMarket({ sponsored: true })).toBe(true);
    expect(isSponsoredMarket({ sponsored: false })).toBe(false);
    expect(isSponsoredMarket({})).toBe(false);
    expect(isSponsoredMarket(null)).toBe(false);
    expect(isSponsoredMarket(undefined)).toBe(false);
  });
});

describe('validateFeeBudget', () => {
  it('accepts budgets within [min, max-useful]', () => {
    expect(validateFeeBudget(MIN_FEE_BUDGET_USTX)).toEqual({
      ok: true,
      budgetUstx: MIN_FEE_BUDGET_USTX
    });
    expect(validateFeeBudget(MAX_USEFUL_BUDGET_USTX).ok).toBe(true);
  });

  it('rejects missing, below-minimum, and above-useful budgets', () => {
    expect(validateFeeBudget(null)).toEqual({ ok: false, reason: 'missing' });
    expect(validateFeeBudget(undefined)).toEqual({ ok: false, reason: 'missing' });
    expect(validateFeeBudget(0n)).toEqual({ ok: false, reason: 'missing' });
    expect(validateFeeBudget(MIN_FEE_BUDGET_USTX - 1n)).toEqual({
      ok: false,
      reason: 'below-minimum'
    });
    expect(validateFeeBudget(MAX_USEFUL_BUDGET_USTX + 1n)).toEqual({
      ok: false,
      reason: 'above-useful-maximum'
    });
  });
});

describe('getSponsoredBuyEligibility', () => {
  const listing = { soldAt: null, budgetRemaining: 100_000n };
  const base = {
    market: { sponsored: true },
    listing,
    estimatedFeeUstx: 20_000n,
    relayerAvailable: true
  };

  it('eligible on a live sponsored listing with budget and relayer', () => {
    expect(getSponsoredBuyEligibility(base)).toEqual({ ok: true });
  });

  // The 2026-08-06 incident. /v2/fees/transfer briefly returned ~322 instead of
  // its usual 1, so estimateBuyFee produced ~193,000 uSTX against a 50,000 uSTX
  // escrow. Eligibility failed, main.js fell through silently, and the buyer paid
  // 0.193 STX for a purchase that had been free 39 minutes earlier.
  it('survives a transient fee-estimate spike on a normally-funded listing', () => {
    expect(
      getSponsoredBuyEligibility({
        ...base,
        listing: { soldAt: null, budgetRemaining: MIN_FEE_BUDGET_USTX },
        estimatedFeeUstx: 193_339n
      })
    ).toEqual({ ok: true });
  });

  it('still refuses when the escrow cannot cover even the floor', () => {
    expect(
      getSponsoredBuyEligibility({
        ...base,
        listing: { soldAt: null, budgetRemaining: 1_000n },
        estimatedFeeUstx: 3_000n
      })
    ).toEqual({ ok: false, reason: 'budget-exhausted' });
  });

  it('reports each failure reason', () => {
    expect(
      getSponsoredBuyEligibility({ ...base, market: { sponsored: false } })
    ).toEqual({ ok: false, reason: 'not-sponsored-market' });
    expect(
      getSponsoredBuyEligibility({
        ...base,
        listing: { ...listing, soldAt: 10n }
      })
    ).toEqual({ ok: false, reason: 'listing-sold' });
    expect(getSponsoredBuyEligibility({ ...base, listing: null })).toEqual({
      ok: false,
      reason: 'listing-sold'
    });
    expect(
      getSponsoredBuyEligibility({
        ...base,
        listing: { ...listing, budgetRemaining: 1n }
      })
    ).toEqual({ ok: false, reason: 'budget-exhausted' });
    expect(
      getSponsoredBuyEligibility({ ...base, relayerAvailable: false })
    ).toEqual({ ok: false, reason: 'relayer-unavailable' });
  });
});

describe('getSellerBudgetSummary', () => {
  const listing = {
    feeBudget: 100_000n,
    budgetRemaining: 60_000n,
    claimed: 40_000n,
    soldAt: 1_000n
  };

  it('reports deposited/claimed/remaining and locks self-refund inside the window', () => {
    const summary = getSellerBudgetSummary(
      listing,
      1_000n + REFUND_DELAY_BLOCKS - 1n
    );
    expect(summary).toEqual({
      depositedUstx: 100_000n,
      claimedUstx: 40_000n,
      remainingUstx: 60_000n,
      selfRefundable: false
    });
  });

  it('unlocks self-refund after the delay; never for unsold listings', () => {
    expect(
      getSellerBudgetSummary(listing, 1_000n + REFUND_DELAY_BLOCKS)
        .selfRefundable
    ).toBe(true);
    expect(
      getSellerBudgetSummary({ ...listing, soldAt: null }, 10_000_000n)
        .selfRefundable
    ).toBe(false);
  });
});

describe('sponsorFeeToCharge', () => {
  it('pays the floor when the network is cheap', () => {
    expect(sponsorFeeToCharge(1_000n, MIN_FEE_BUDGET_USTX)).toBe(SPONSOR_FEE_FLOOR_USTX);
    expect(sponsorFeeToCharge(3_000n, MIN_FEE_BUDGET_USTX)).toBe(3_000n);
  });

  it('pays the estimate between the floor and the cap', () => {
    expect(sponsorFeeToCharge(7_500n, MIN_FEE_BUDGET_USTX)).toBe(7_500n);
  });

  // The whole point: a bad reading must not become a bill.
  it('never pays more than the cap, however wild the estimate', () => {
    expect(sponsorFeeToCharge(193_339n, MIN_FEE_BUDGET_USTX)).toBe(SPONSOR_FEE_CAP_USTX);
    expect(sponsorFeeToCharge(50_000_000n, MIN_FEE_BUDGET_USTX)).toBe(SPONSOR_FEE_CAP_USTX);
  });

  // The relayer reclaims its fee from the escrow, so paying above it is an
  // unrecoverable loss for us.
  it('never pays more than the seller escrowed', () => {
    expect(sponsorFeeToCharge(9_000n, 4_000n)).toBe(4_000n);
    expect(sponsorFeeToCharge(193_339n, 4_000n)).toBe(4_000n);
  });

  it('is bounded by the cap for every plausible estimate', () => {
    for (const est of [0n, 1n, 2_999n, 3_000n, 9_999n, 10_001n, 193_339n, 2_000_000n]) {
      const fee = sponsorFeeToCharge(est, MIN_FEE_BUDGET_USTX);
      expect(fee).toBeLessThanOrEqual(SPONSOR_FEE_CAP_USTX);
      expect(fee).toBeGreaterThanOrEqual(SPONSOR_FEE_FLOOR_USTX);
    }
  });
});
