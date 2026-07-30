/**
 * Shared decision logic for a sponsored (zero-STX) marketplace purchase.
 *
 * This module exists because the same purchase has to run on two surfaces: the
 * vanilla market page in `src/home/main.js` and the React `MarketScreen` under
 * `/admin`. They had no code in common, which is how the public page ended up
 * advertising "no STX needed" on a button that always called `showContractCall`
 * and made the buyer pay their own fee. Every *decision* a sponsored buy makes
 * now lives here and both surfaces import it, so the copy and the capability
 * cannot drift apart again.
 *
 * Nothing here touches the DOM, React, or the network directly. The wallet
 * signer, the sponsor client and the clock are all injected, so the whole flow
 * is exercisable offline.
 *
 * Scope note: this module owns the decisions. The two surfaces still own their
 * own progress loops — React polls from an effect, `runSponsoredBuy` awaits a
 * loop — because those are shaped by their host. The classifiers below are the
 * part that must agree, and `__tests__/sponsored-buy.test.ts` asserts it does.
 *
 * See docs/plans/SPONSORED-MARKET-BUY-PLAN.md.
 */
import {
  SponsorClientError,
  type SponsorClient,
  type SponsorJob,
  type SponsorJobState
} from './sponsor-client';
import {
  SPONSOR_JOB_MAX_ATTEMPTS,
  SPONSOR_JOB_POLL_INTERVAL_MS,
  pollSponsorJob,
  submitSponsorClaimWithRetry
} from '../drops/sponsored-claim';
import type { SponsoredBuyEligibility } from './sponsored';

export type SponsoredBuyPhase =
  | { phase: 'idle' }
  | { phase: 'signing' }
  | { phase: 'submitting' }
  | { phase: 'sponsoring'; jobId: string; jobState: SponsorJobState; buyTxId?: string }
  | { phase: 'settled'; jobId: string; buyTxId?: string; refundTxId?: string }
  | {
      phase: 'failed';
      message: string;
      /** buyer can still complete the purchase paying their own fee */
      fallbackToSelfPaid: boolean;
    };

/** Opens the wallet. Resolves null when the user rejects. */
export type SignSponsoredBuy = () => Promise<{ txHex: string } | null>;

export type SponsoredBuyFailure = {
  message: string;
  fallbackToSelfPaid: boolean;
};

/**
 * A rejected wallet prompt is not a failure, it is a decision. The React path
 * signals it by resolving null; the vanilla path's wallet adapter throws a
 * WALLET_CANCELLED-coded error instead. Both mean "return quietly to idle".
 */
export const isWalletCancellation = (error: unknown): boolean =>
  Boolean(error) &&
  typeof error === 'object' &&
  (error as { code?: unknown }).code === 'WALLET_CANCELLED';

/**
 * A wallet or signing failure says nothing about the relayer, so the buyer can
 * always still complete the purchase paying their own fee.
 */
export const sponsoredBuyFailureFromSignError = (error: unknown): SponsoredBuyFailure => ({
  message: error instanceof Error ? error.message : 'wallet error',
  fallbackToSelfPaid: true
});

/**
 * The relayer's own taxonomy decides this one: LISTING_SOLD and the BNS/campaign
 * refusals mean no purchase is possible by any route, everything else is a
 * sponsorship problem the buyer can route around by paying their own fee.
 */
export const sponsoredBuyFailureFromSubmitError = (error: unknown): SponsoredBuyFailure =>
  error instanceof SponsorClientError
    ? { message: error.message, fallbackToSelfPaid: error.fallbackToSelfPaid }
    : {
        message: error instanceof Error ? error.message : 'sponsor error',
        fallbackToSelfPaid: true
      };

export type SponsoringPhase = Extract<SponsoredBuyPhase, { phase: 'sponsoring' }>;

/**
 * Next phase for a relayer status reading, or null when nothing changed.
 *
 * `buyTxId` falls back to the one already held: the relayer reports the buy
 * txid as soon as it broadcasts, and a later reading that omits it must not
 * erase the buyer's only reference to their own transaction.
 */
export const sponsoredBuyPhaseFromJob = (
  job: SponsorJob,
  current: Pick<SponsoringPhase, 'jobId' | 'jobState' | 'buyTxId'>
): SponsoredBuyPhase | null => {
  if (job.state === 'SETTLED') {
    return {
      phase: 'settled',
      jobId: current.jobId,
      buyTxId: job.txids.buy ?? current.buyTxId,
      refundTxId: job.txids.refund
    };
  }
  if (job.state === 'ABANDONED') {
    return {
      phase: 'failed',
      message: job.error ?? 'sponsorship abandoned',
      // The relayer gave up before paying, so the listing is still on sale.
      fallbackToSelfPaid: true
    };
  }
  if (job.state !== current.jobState) {
    return {
      phase: 'sponsoring',
      jobId: current.jobId,
      jobState: job.state,
      buyTxId: job.txids.buy ?? current.buyTxId
    };
  }
  return null;
};

/**
 * A poll that runs out of attempts is the one case where offering "pay your own
 * fee instead" can cost the buyer money for nothing: if the buy was already
 * broadcast, the purchase may still confirm, and a second attempt burns a miner
 * fee on a transaction the market contract will reject. So the fallback is only
 * offered while the relayer demonstrably has not broadcast anything.
 */
export const sponsoredBuyTimeoutFailure = (job: SponsorJob): SponsoredBuyFailure => {
  const broadcast = Boolean(job.txids.buy) || job.state !== 'RECEIVED';
  return broadcast
    ? {
        message:
          'The sponsor is taking longer than expected. Your purchase may still complete — check the listing before paying a second fee.',
        fallbackToSelfPaid: false
      }
    : {
        message: 'Sponsored checkout timed out before the purchase was broadcast.',
        fallbackToSelfPaid: true
      };
};

export const SPONSORED_BUY_PROGRESS_LABELS: Record<string, string> = {
  signing: 'Waiting for wallet…',
  submitting: 'Sending to sponsor…',
  RECEIVED: 'Sponsoring…',
  SPONSORED: 'Broadcast — confirming…',
  CONFIRMED: 'Confirmed — settling…',
  CLAIMING: 'Settling…',
  CLAIMED: 'Settling…',
  REFUNDING: 'Settling…'
};

export const sponsoredBuyProgressLabel = (phase: SponsoredBuyPhase): string =>
  phase.phase === 'sponsoring'
    ? (SPONSORED_BUY_PROGRESS_LABELS[phase.jobState] ?? 'Sponsoring…')
    : (SPONSORED_BUY_PROGRESS_LABELS[phase.phase] ?? 'Working…');

/**
 * Why a sponsored buy is not on offer. `not-sponsored-market` returns null on
 * purpose: a standard listing is not a degraded sponsored one and must not
 * explain itself to the buyer.
 */
export const sponsoredBuyIneligibilityMessage = (
  eligibility: Exclude<SponsoredBuyEligibility, { ok: true }>
): string | null => {
  switch (eligibility.reason) {
    case 'listing-sold':
      return 'This listing has already been sold.';
    case 'budget-exhausted':
      return 'The sponsorship budget for this listing is used up.';
    case 'relayer-unavailable':
      return 'Sponsored checkout is temporarily unavailable.';
    default:
      return null;
  }
};

export type RunSponsoredBuyParams = {
  client: SponsorClient;
  contractId: string;
  listingId: bigint;
  signSponsoredBuy: SignSponsoredBuy;
  /** Called on every phase transition, including the terminal one. */
  onPhase?: (phase: SponsoredBuyPhase) => void;
  pollIntervalMs?: number;
  maxPollAttempts?: number;
  wait?: (ms: number) => Promise<void>;
  retryDelaysMs?: readonly number[];
  onSubmitRetry?: (
    error: SponsorClientError,
    attempt: number,
    maxAttempts: number,
    delayMs: number
  ) => void;
  onExistingJob?: (error: SponsorClientError, job: SponsorJob) => void;
};

/**
 * Drive one sponsored purchase from wallet prompt to a terminal phase, and
 * resolve with that phase. Never rejects: every outcome is a phase the caller
 * can render, because a thrown error at this layer would leave the buyer with
 * a spinner and no way to fall back.
 */
export const runSponsoredBuy = async (
  params: RunSponsoredBuyParams
): Promise<SponsoredBuyPhase> => {
  let last: SponsoredBuyPhase = { phase: 'idle' };
  const emit = (phase: SponsoredBuyPhase): SponsoredBuyPhase => {
    last = phase;
    params.onPhase?.(phase);
    return phase;
  };

  emit({ phase: 'signing' });
  let signed: { txHex: string } | null;
  try {
    signed = await params.signSponsoredBuy();
  } catch (error) {
    if (isWalletCancellation(error)) {
      return emit({ phase: 'idle' });
    }
    return emit({ phase: 'failed', ...sponsoredBuyFailureFromSignError(error) });
  }
  if (!signed) {
    return emit({ phase: 'idle' });
  }

  emit({ phase: 'submitting' });
  let job: SponsorJob;
  try {
    job = await submitSponsorClaimWithRetry({
      client: params.client,
      txHex: signed.txHex,
      contractId: params.contractId,
      listingId: params.listingId,
      flow: 'market_buy',
      retryDelaysMs: params.retryDelaysMs,
      wait: params.wait,
      onRetry: params.onSubmitRetry,
      onExistingJob: params.onExistingJob
    });
  } catch (error) {
    return emit({ phase: 'failed', ...sponsoredBuyFailureFromSubmitError(error) });
  }

  let current: Pick<SponsoringPhase, 'jobId' | 'jobState' | 'buyTxId'> = {
    jobId: job.id,
    jobState: job.state,
    buyTxId: job.txids.buy
  };
  // Submitting can hand back an already-terminal job: the relayer answers a
  // duplicate submit with the existing job, and that job may have settled while
  // the buyer was reloading. Comparing the job against itself yields null for
  // every in-flight state and the terminal phase for SETTLED/ABANDONED.
  const immediate = sponsoredBuyPhaseFromJob(job, current);
  if (immediate) {
    return emit(immediate);
  }
  emit({ phase: 'sponsoring', ...current });

  let latestJob = job;
  try {
    latestJob = await pollSponsorJob({
      client: params.client,
      job,
      intervalMs: params.pollIntervalMs ?? SPONSOR_JOB_POLL_INTERVAL_MS,
      maxAttempts: params.maxPollAttempts ?? SPONSOR_JOB_MAX_ATTEMPTS,
      wait: params.wait,
      onStatus: (nextJob) => {
        latestJob = nextJob;
        const next = sponsoredBuyPhaseFromJob(nextJob, current);
        if (!next) return;
        if (next.phase === 'sponsoring') {
          current = { jobId: next.jobId, jobState: next.jobState, buyTxId: next.buyTxId };
        }
        emit(next);
      }
    });
  } catch {
    // A status read failed outright. That cannot distinguish a settled purchase
    // from a stalled one, so it takes the same broadcast-aware exit as a
    // timeout rather than inventing an outcome.
  }

  // pollSponsorJob stops on a terminal job state OR on running out of attempts.
  // Still sponsoring here means the latter, or the caught read failure above.
  if (last.phase === 'sponsoring') {
    return emit({ phase: 'failed', ...sponsoredBuyTimeoutFailure(latestJob) });
  }
  return last;
};
