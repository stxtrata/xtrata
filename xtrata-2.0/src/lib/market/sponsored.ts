/**
 * Sponsored-marketplace helpers: fee-budget validation for the list flow and
 * sponsored-buy eligibility for the buy flow. Companion to
 * xtrata-market-sponsored-{sbtc,usdcx}-v1.0 and sponsor-client.ts.
 */
import type { MarketRegistryEntry } from './registry';
import type { MarketListing } from './types';

/** Mirrors MIN-FEE-BUDGET in the sponsored market contracts (0.05 STX). */
export const MIN_FEE_BUDGET_USTX = 50_000n;
/** Mirrors the default claim-cap (2 STX) — budgets above this are wasted. */
export const MAX_USEFUL_BUDGET_USTX = 2_000_000n;
/** Mirrors REFUND-DELAY in the contracts (blocks). */
export const REFUND_DELAY_BLOCKS = 144n;

export const isSponsoredMarket = (
  entry: Pick<MarketRegistryEntry, 'sponsored'> | null | undefined
): boolean => entry?.sponsored === true;

export type SponsoredListing = MarketListing & {
  feeBudget: bigint;
  budgetRemaining: bigint;
  claimed: bigint;
  buyer: string | null;
  soldAt: bigint | null;
};

export type BudgetValidationResult =
  | { ok: true; budgetUstx: bigint }
  | {
      ok: false;
      reason: 'missing' | 'below-minimum' | 'above-useful-maximum';
    };

/** Validate the sponsorship deposit chosen at list time. */
export const validateFeeBudget = (
  budgetUstx: bigint | null | undefined
): BudgetValidationResult => {
  if (budgetUstx === null || budgetUstx === undefined || budgetUstx <= 0n) {
    return { ok: false, reason: 'missing' };
  }
  if (budgetUstx < MIN_FEE_BUDGET_USTX) {
    return { ok: false, reason: 'below-minimum' };
  }
  if (budgetUstx > MAX_USEFUL_BUDGET_USTX) {
    return { ok: false, reason: 'above-useful-maximum' };
  }
  return { ok: true, budgetUstx };
};

export type SponsoredBuyEligibility =
  | { ok: true }
  | {
      ok: false;
      reason:
        | 'not-sponsored-market'
        | 'listing-sold'
        | 'budget-exhausted'
        | 'relayer-unavailable';
    };

/** Can this listing be bought with zero STX right now? */
export const getSponsoredBuyEligibility = (params: {
  market: Pick<MarketRegistryEntry, 'sponsored'> | null;
  listing: Pick<SponsoredListing, 'soldAt' | 'budgetRemaining'> | null;
  estimatedFeeUstx: bigint;
  relayerAvailable: boolean;
}): SponsoredBuyEligibility => {
  if (!isSponsoredMarket(params.market)) {
    return { ok: false, reason: 'not-sponsored-market' };
  }
  if (!params.listing || params.listing.soldAt !== null) {
    return { ok: false, reason: 'listing-sold' };
  }
  if (params.listing.budgetRemaining < params.estimatedFeeUstx) {
    return { ok: false, reason: 'budget-exhausted' };
  }
  if (!params.relayerAvailable) {
    return { ok: false, reason: 'relayer-unavailable' };
  }
  return { ok: true };
};

export type SellerBudgetSummary = {
  depositedUstx: bigint;
  claimedUstx: bigint;
  remainingUstx: bigint;
  /** seller may call settle-refund themselves (sold + delay elapsed) */
  selfRefundable: boolean;
};

export const getSellerBudgetSummary = (
  listing: Pick<
    SponsoredListing,
    'feeBudget' | 'budgetRemaining' | 'claimed' | 'soldAt'
  >,
  currentBlockHeight: bigint
): SellerBudgetSummary => ({
  depositedUstx: listing.feeBudget,
  claimedUstx: listing.claimed,
  remainingUstx: listing.budgetRemaining,
  selfRefundable:
    listing.soldAt !== null &&
    currentBlockHeight >= listing.soldAt + REFUND_DELAY_BLOCKS
});
