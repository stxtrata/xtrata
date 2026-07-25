import { XtrataClientError, type DropsTxDescriptor } from '@xtrata/collections-client';
import {
  IN_FLIGHT_STATES,
  RelayerError,
  SETTLED_STATES,
  type JobState,
  type RelayerClient
} from './relayer';

/**
 * The sponsored (mode 3) claim flow, as an orchestration function with every
 * side effect injected — wallet signing, relayer, clock — so the three
 * outcomes that matter can all be tested: it works, the relayer refuses and
 * the claimer falls back to paying, or the job never settles in time.
 *
 * Flow (05-SPONSORSHIP + relayer README):
 *
 *   quote → wallet signs a fee-0 sponsored-auth transaction (origin = claimer,
 *   NOT broadcast) → POST /submit → poll /status until the job leaves the
 *   in-flight states.
 *
 * The fallback rule is the important part. A relayer refusal is only allowed
 * to become "claim it yourself" when the refusal is about the SPONSORSHIP
 * (disabled, rate limited, out of float, budget exhausted, broadcast trouble).
 * When the refusal is about the DROP (not active, window closed, sold out,
 * wallet limit, wrong eligibility) a self-paid claim would hit the identical
 * contract assertion and waste the claimer's fee, so it is refused here too.
 */

export interface SponsoredSignRequest {
  tx: DropsTxDescriptor;
  nonce: number;
  stxAddress: string;
}

export interface SponsoredSigner {
  /** Returns the signed, NOT broadcast, sponsored transaction hex. */
  (request: SponsoredSignRequest): Promise<{ txHex: string }>;
}

export type SponsoredStage =
  | 'quoting'
  | 'signing'
  | 'submitting'
  | 'polling'
  | 'settled'
  | 'failed'
  | 'fallback';

export type SponsoredClaimOutcome =
  /** The relayer sponsored it and the chain accepted the claim. */
  | { kind: 'sponsored'; jobId: string; state: JobState; sponsorTxid: string | null; feeUstx: bigint | null }
  /** Broadcast, but not settled inside the polling window. Not a failure. */
  | { kind: 'pending'; jobId: string; state: JobState; sponsorTxid: string | null }
  /** The sponsored transaction itself failed on chain. */
  | { kind: 'failed'; jobId: string; state: JobState; error: string | null }
  /** Sponsorship unavailable; a self-paid claim is still legal. */
  | { kind: 'fallback'; error: RelayerError };

export interface SponsoredClaimParams {
  relayer: RelayerClient;
  /** Descriptor from `DropsTxBuilder.claim` / `.claimSigned` / `.reserveClaim`. */
  tx: DropsTxDescriptor;
  dropId: number;
  /** Origin nonce for the claimer's account. */
  nonce: number;
  stxAddress: string;
  sign: SponsoredSigner;
  /** Skip the informational quote (it is not required to submit). */
  skipQuote?: boolean;
  pollIntervalMs?: number;
  timeoutMs?: number;
  sleep?: (ms: number) => Promise<void>;
  now?: () => number;
  onStage?: (stage: SponsoredStage) => void;
}

const defaultSleep = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

export const runSponsoredClaim = async (
  params: SponsoredClaimParams
): Promise<SponsoredClaimOutcome> => {
  const pollIntervalMs = params.pollIntervalMs ?? 3_000;
  const timeoutMs = params.timeoutMs ?? 5 * 60_000;
  const sleep = params.sleep ?? defaultSleep;
  const now = params.now ?? (() => Date.now());
  const stage = params.onStage ?? (() => undefined);

  const fallbackOrThrow = (error: unknown): SponsoredClaimOutcome => {
    if (error instanceof RelayerError && error.selfPaidFallback) {
      stage('fallback');
      return { kind: 'fallback', error };
    }
    throw error;
  };

  let feeUstx: bigint | null = null;
  if (params.skipQuote !== true) {
    stage('quoting');
    try {
      feeUstx = (await params.relayer.quote(params.dropId)).feeUstx;
    } catch (error) {
      return fallbackOrThrow(error);
    }
  }

  // Wallet errors (including cancellation) are the claimer's business, never
  // the relayer's — they propagate untouched to the page's error handling.
  stage('signing');
  const { txHex } = await params.sign({
    tx: params.tx,
    nonce: params.nonce,
    stxAddress: params.stxAddress
  });
  if (typeof txHex !== 'string' || txHex.length === 0) {
    throw new XtrataClientError('wallet-rejected', 'the wallet returned no signed transaction');
  }

  stage('submitting');
  let jobId: string;
  let state: JobState;
  let sponsorTxid: string | null;
  try {
    const submitted = await params.relayer.submit({
      txHex,
      dropId: params.dropId,
      contractId: `${params.tx.contractAddress}.${params.tx.contractName}`,
      functionName: params.tx.functionName
    });
    jobId = submitted.jobId;
    state = submitted.state;
    sponsorTxid = submitted.sponsorTxid;
  } catch (error) {
    return fallbackOrThrow(error);
  }

  stage('polling');
  const deadline = now() + timeoutMs;
  for (;;) {
    if (SETTLED_STATES.has(state)) {
      stage('settled');
      return { kind: 'sponsored', jobId, state, sponsorTxid, feeUstx };
    }
    if (state === 'FAILED') {
      stage('failed');
      const detail = await params.relayer.status(jobId).catch(() => null);
      return { kind: 'failed', jobId, state, error: detail?.error ?? null };
    }
    if (!IN_FLIGHT_STATES.has(state)) {
      // Unknown-but-decoded state: treat as still in flight rather than
      // inventing a verdict about someone's claim.
      stage('polling');
    }
    if (now() >= deadline) {
      return { kind: 'pending', jobId, state, sponsorTxid };
    }
    await sleep(pollIntervalMs);
    // A transport blip mid-poll is not a verdict either: keep the last state
    // and let the deadline decide.
    const status = await params.relayer.status(jobId).catch((error) => {
      if (error instanceof RelayerError) return null;
      throw error;
    });
    if (status) {
      state = status.state;
      sponsorTxid = status.sponsorTxid ?? sponsorTxid;
    }
  }
};
