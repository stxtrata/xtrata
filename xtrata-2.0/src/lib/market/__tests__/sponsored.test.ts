import { describe, expect, it } from 'vitest';
import {
  MIN_FEE_BUDGET_USTX,
  MAX_USEFUL_BUDGET_USTX,
  REFUND_DELAY_BLOCKS,
  isSponsoredMarket,
  validateFeeBudget,
  getSponsoredBuyEligibility,
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
