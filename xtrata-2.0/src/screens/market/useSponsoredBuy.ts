import { startJourney, event } from '../../lib/telemetry/client';
import { classify } from '../../lib/telemetry/classify';
/**
 * State machine for an STX-free (sponsored) marketplace purchase.
 * Wallet signing and the relayer client are injected so the hook is fully
 * render-testable offline.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  SponsorClientError,
  type SponsorClient,
  type SponsorJobState
} from '../../lib/market/sponsor-client';

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

export type SignSponsoredBuy = () => Promise<{ txHex: string } | null>;

const TERMINAL: SponsorJobState[] = ['SETTLED', 'ABANDONED'];

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

  const fail = (message: string, fallbackToSelfPaid: boolean) =>
    setState({ phase: 'failed', message, fallbackToSelfPaid });

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
      event({
        journey,
        step: 'sign',
        outcome: 'error',
        errorCode: classify(error, 'market_buy'),
        error
      });
      if (live()) fail(error instanceof Error ? error.message : 'wallet error', true);
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
      if (error instanceof SponsorClientError) {
        fail(error.message, error.fallbackToSelfPaid);
      } else {
        fail(error instanceof Error ? error.message : 'sponsor error', true);
      }
    }
  }, [client, contractId, listingId, signSponsoredBuy]);

  // poll the relayer while sponsoring
  useEffect(() => {
    if (state.phase !== 'sponsoring') {
      return;
    }
    const { jobId } = state;
    let cancelled = false;
    const tick = async () => {
      try {
        const job = await client.status(jobId);
        if (cancelled) return;
        if (job.state === 'SETTLED') {
          event({
            flow: 'market_buy',
            journeyId: journeyRef.current?.id,
            step: 'settle',
            outcome: 'success'
          });
          setState({
            phase: 'settled',
            jobId,
            buyTxId: job.txids.buy,
            refundTxId: job.txids.refund
          });
        } else if (job.state === 'ABANDONED') {
          event({
            flow: 'market_buy',
            journeyId: journeyRef.current?.id,
            step: 'settle',
            outcome: 'error',
            errorCode: 'SPONSOR_REJECTED',
            error: job.error ?? 'sponsorship abandoned'
          });
          fail(job.error ?? 'sponsorship abandoned', true);
        } else if (job.state !== state.jobState) {
          setState({ ...state, jobState: job.state, buyTxId: job.txids.buy });
        }
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

  const isTerminalJobState = (s: SponsorJobState) => TERMINAL.includes(s);

  return { state, start, reset, busy, isTerminalJobState };
};
