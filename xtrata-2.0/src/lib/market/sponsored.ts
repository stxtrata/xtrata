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

/**
 * Lowest fee the relayer will ever put on a sponsored buy. Mirrors the
 * `Math.max(3000, …)` floor in `estimateBuyFee` (functions/sponsor/[[path]].ts).
 */
export const SPONSOR_FEE_FLOOR_USTX = 3_000n;

/**
 * Ceiling on what the relayer will pay for one sponsored buy (0.01 STX).
 *
 * The relayer's estimate is `max(3000, hiroTransferRate * 600)`, a deliberate
 * over-estimate. In practice the rate reads 1 and the real fee is the 3000
 * floor. But `/v2/fees/transfer` is noisy: on 2026-08-06 it returned ~322 for a
 * few minutes, producing a ~193,000 uSTX "estimate" — 64x the usual — while the
 * network was fine either side of it.
 *
 * Before this cap existed, that reading was compared directly against the
 * seller's 50,000 uSTX escrow, failed, and dropped the buyer into a self-paid
 * purchase with no warning. A transient bad number from one endpoint therefore
 * disabled sponsorship marketplace-wide and charged buyers for it.
 *
 * Capping decouples "what we pay" from "what the estimator claims". A spike can
 * no longer switch sponsorship off; at worst the transaction takes longer to
 * confirm, and a fee bump (up to the escrowed budget) is the answer to that,
 * not refusing to sponsor at all.
 */
export const SPONSOR_FEE_CAP_USTX = 10_000n;

/**
 * What the relayer should actually pay: the estimate, floored, capped, and
 * never more than the seller escrowed (so the relayer can always reclaim it).
 */
export const sponsorFeeToCharge = (
  estimateUstx: bigint,
  budgetRemainingUstx: bigint
): bigint => {
  const floored =
    estimateUstx < SPONSOR_FEE_FLOOR_USTX ? SPONSOR_FEE_FLOOR_USTX : estimateUstx;
  const capped = floored > SPONSOR_FEE_CAP_USTX ? SPONSOR_FEE_CAP_USTX : floored;
  return capped > budgetRemainingUstx ? budgetRemainingUstx : capped;
};

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
  // Compare the budget against what we would ACTUALLY pay, not against the raw
  // estimate. The estimate is a deliberate over-estimate from a noisy endpoint;
  // gating on it let one bad reading disable sponsorship for every listing at
  // once and silently bill the buyer. See SPONSOR_FEE_CAP_USTX.
  if (
    params.listing.budgetRemaining <
    sponsorFeeToCharge(params.estimatedFeeUstx, params.listing.budgetRemaining)
  ) {
    return { ok: false, reason: 'budget-exhausted' };
  }
  // Unreachable via the clamp above unless the escrow is under the floor, which
  // is the one case we genuinely cannot sponsor.
  if (params.listing.budgetRemaining < SPONSOR_FEE_FLOOR_USTX) {
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
