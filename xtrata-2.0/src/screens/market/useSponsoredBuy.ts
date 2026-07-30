import { startJourney, event } from '../../lib/telemetry/client';
import { classify } from '../../lib/telemetry/classify';
/**
 * React binding for an STX-free (sponsored) marketplace purchase.
 *
 * The decisions this flow makes — how a signing error, a relayer refusal or a
 * job state reading turn into a phase, and whether a self-paid fallback is safe
 * to offer — all live in lib/market/sponsored-buy.ts, which the vanilla market
 * page imports too. This hook owns only the React-shaped parts: state, the
 * polling effect, and cancellation on unmount or restart.
 *
 * Wallet signing and the relayer client are injected so the hook is fully
 * render-testable offline.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import type { SponsorClient } from '../../lib/market/sponsor-client';
import {
  isWalletCancellation,
  sponsoredBuyFailureFromSignError,
  sponsoredBuyFailureFromSubmitError,
  sponsoredBuyPhaseFromJob,
  type SignSponsoredBuy,
  type SponsoredBuyPhase
} from '../../lib/market/sponsored-buy';
import { isTerminalSponsorJobState } from '../../lib/drops/sponsored-claim';

export type { SponsoredBuyPhase, SignSponsoredBuy };

export const useSponsoredBuy = (params: {
  client: SponsorClient;
  contractId: string;
  listingId: bigint;
  /** opens the wallet; resolves null when the user rejects */
  signSponsoredBuy: SignSponsoredBuy;
  pollIntervalMs?: number;
}) => {
  const { client, contractId, listingId, signSponsoredBuy } = params;
  const pollIntervalMs = params.pollIntervalMs ?? 4_000;
  const [state, setState] = useState<SponsoredBuyPhase>({ phase: 'idle' });
  const runToken = useRef(0);
  const journeyRef = useRef<{ id: string } | null>(null);

  const start = useCallback(async () => {
    const token = ++runToken.current;
    const live = () => runToken.current === token;
    const journey = startJourney('market_buy', contractId + '::' + listingId.toString());
    journeyRef.current = journey;
    event({ journey, step: 'sign', outcome: 'start' });
    setState({ phase: 'signing' });
    let signed: { txHex: string } | null;
    try {
      signed = await signSponsoredBuy();
    } catch (error) {
      if (isWalletCancellation(error)) {
        event({ journey, step: 'sign', outcome: 'abandon' });
        if (live()) setState({ phase: 'idle' });
        return;
      }
      event({
        journey,
        step: 'sign',
        outcome: 'error',
        errorCode: classify(error, 'market_buy'),
        error
      });
      if (live()) {
        setState({ phase: 'failed', ...sponsoredBuyFailureFromSignError(error) });
      }
      return;
    }
    if (!live()) return;
    if (!signed) {
      event({ journey, step: 'sign', outcome: 'abandon' });
      setState({ phase: 'idle' }); // user rejected in wallet
      return;
    }
    event({ journey, step: 'sign', outcome: 'success' });
    event({ journey, step: 'submit', outcome: 'start' });
    setState({ phase: 'submitting' });
    try {
      const job = await client.submit({ txHex: signed.txHex, contractId, listingId });
      if (!live()) return;
      event({ journey, step: 'submit', outcome: 'success' });
      setState({
        phase: 'sponsoring',
        jobId: job.id,
        jobState: job.state,
        buyTxId: job.txids.buy
      });
    } catch (error) {
      if (!live()) return;
      event({
        journey,
        step: 'submit',
        outcome: 'error',
        errorCode: classify(error, 'market_buy'),
        error
      });
      setState({ phase: 'failed', ...sponsoredBuyFailureFromSubmitError(error) });
    }
  }, [client, contractId, listingId, signSponsoredBuy]);

  // poll the relayer while sponsoring
  useEffect(() => {
    if (state.phase !== 'sponsoring') {
      return;
    }
    let cancelled = false;
    const tick = async () => {
      try {
        const job = await client.status(state.jobId);
        if (cancelled) return;
        const next = sponsoredBuyPhaseFromJob(job, state);
        if (!next) return;
        if (next.phase === 'settled') {
          event({
            flow: 'market_buy',
            journeyId: journeyRef.current?.id,
            step: 'settle',
            outcome: 'success'
          });
        } else if (next.phase === 'failed') {
          event({
            flow: 'market_buy',
            journeyId: journeyRef.current?.id,
            step: 'settle',
            outcome: 'error',
            errorCode: 'SPONSOR_REJECTED',
            error: next.message
          });
        }
        setState(next);
      } catch {
        // transient poll failure: keep waiting
      }
    };
    const interval = setInterval(tick, pollIntervalMs);
    void tick();
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [client, pollIntervalMs, state]);

  const reset = useCallback(() => {
    runToken.current += 1;
    setState({ phase: 'idle' });
  }, []);

  const busy =
    state.phase === 'signing' || state.phase === 'submitting' || state.phase === 'sponsoring';

  return { state, start, reset, busy, isTerminalJobState: isTerminalSponsorJobState };
};
