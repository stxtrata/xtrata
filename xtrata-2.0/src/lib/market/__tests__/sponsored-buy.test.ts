/**
 * Stage 1 of docs/plans/SPONSORED-MARKET-BUY-PLAN.md.
 *
 * Two jobs here. First, cover runSponsoredBuy's own outcomes at the logic level,
 * mirroring the nine render cases in SponsoredBuySection.test.tsx. Second, and
 * more important, assert that the React hook and the vanilla page reach the same
 * decision from the same input — that is the whole point of extracting this
 * module, and the property that stops the market page advertising a capability
 * it does not have.
 */
import { describe, expect, it, vi } from 'vitest';
import {
  SponsorClientError,
  type SponsorClient,
  type SponsorJob
} from '../sponsor-client';
import {
  isWalletCancellation,
  runSponsoredBuy,
  sponsoredBuyFailureFromSignError,
  sponsoredBuyFailureFromSubmitError,
  sponsoredBuyIneligibilityMessage,
  sponsoredBuyPhaseFromJob,
  sponsoredBuyProgressLabel,
  sponsoredBuyTimeoutFailure,
  type SponsoredBuyPhase
} from '../sponsored-buy';

const job = (
  state: SponsorJob['state'],
  txids: SponsorJob['txids'] = {},
  error?: string
): SponsorJob => ({ id: 'sp-1', state, txids, ...(error ? { error } : {}) });

const makeClient = (overrides: Partial<SponsorClient> = {}): SponsorClient =>
  ({
    quote: vi.fn(),
    submit: vi.fn().mockResolvedValue(job('SPONSORED', { buy: 'tx-buy' })),
    status: vi.fn().mockResolvedValue(job('SETTLED', { buy: 'tx-buy', refund: 'tx-refund' })),
    available: vi.fn().mockResolvedValue(true),
    ...overrides
  }) as unknown as SponsorClient;

/** No real timers: every wait resolves immediately. */
const noWait = () => Promise.resolve();

const run = (overrides: Parameters<typeof runSponsoredBuy>[0] extends infer P
  ? Partial<P>
  : never = {}) => {
  const phases: SponsoredBuyPhase[] = [];
  const result = runSponsoredBuy({
    client: makeClient(),
    contractId: 'SP0.market',
    listingId: 7n,
    signSponsoredBuy: vi.fn().mockResolvedValue({ txHex: '00ff' }),
    wait: noWait,
    retryDelaysMs: [],
    onPhase: (phase) => phases.push(phase),
    ...overrides
  });
  return { result, phases };
};

describe('runSponsoredBuy', () => {
  it('walks sign → submit → sponsoring → settled', async () => {
    const { result, phases } = run();
    const final = await result;
    expect(final).toEqual({
      phase: 'settled',
      jobId: 'sp-1',
      buyTxId: 'tx-buy',
      refundTxId: 'tx-refund'
    });
    expect(phases.map((p) => p.phase)).toEqual([
      'signing',
      'submitting',
      'sponsoring',
      'settled'
    ]);
  });

  it('returns to idle when the wallet resolves null', async () => {
    const { result } = run({ signSponsoredBuy: vi.fn().mockResolvedValue(null) });
    expect(await result).toEqual({ phase: 'idle' });
  });

  it('returns to idle when the wallet throws WALLET_CANCELLED', async () => {
    const cancelled = Object.assign(new Error('Wallet request cancelled.'), {
      code: 'WALLET_CANCELLED'
    });
    const { result } = run({ signSponsoredBuy: vi.fn().mockRejectedValue(cancelled) });
    expect(await result).toEqual({ phase: 'idle' });
  });

  it('a non-cancellation wallet error fails with a self-paid fallback', async () => {
    const { result } = run({
      signSponsoredBuy: vi.fn().mockRejectedValue(new Error('wallet locked'))
    });
    expect(await result).toEqual({
      phase: 'failed',
      message: 'wallet locked',
      fallbackToSelfPaid: true
    });
  });

  it('relayer refusal offers the fallback; a sold listing does not', async () => {
    const lowBalance = await run({
      client: makeClient({
        submit: vi.fn().mockRejectedValue(new SponsorClientError('LOW_BALANCE', 'reserve low'))
      })
    }).result;
    expect(lowBalance).toEqual({
      phase: 'failed',
      message: 'reserve low',
      fallbackToSelfPaid: true
    });

    const sold = await run({
      client: makeClient({
        submit: vi.fn().mockRejectedValue(new SponsorClientError('LISTING_SOLD', 'already sold'))
      })
    }).result;
    expect(sold).toEqual({
      phase: 'failed',
      message: 'already sold',
      fallbackToSelfPaid: false
    });
  });

  it('ABANDONED surfaces the relayer reason with a fallback', async () => {
    const { result } = run({
      client: makeClient({
        status: vi.fn().mockResolvedValue(job('ABANDONED', {}, 'buy tx timed out'))
      })
    });
    expect(await result).toEqual({
      phase: 'failed',
      message: 'buy tx timed out',
      fallbackToSelfPaid: true
    });
  });

  it('resumes a duplicate submit that had already settled', async () => {
    const status = vi.fn();
    const { result, phases } = run({
      client: makeClient({
        submit: vi.fn().mockResolvedValue(job('SETTLED', { buy: 'tx-buy' })),
        status
      })
    });
    expect(await result).toMatchObject({ phase: 'settled', buyTxId: 'tx-buy' });
    // It must not sit in "sponsoring" waiting for a job that is already done.
    expect(phases.map((p) => p.phase)).not.toContain('sponsoring');
    expect(status).not.toHaveBeenCalled();
  });

  it('keeps the buy txid when a later status reading omits it', async () => {
    const { result } = run({
      client: makeClient({
        submit: vi.fn().mockResolvedValue(job('SPONSORED', { buy: 'tx-buy' })),
        status: vi.fn().mockResolvedValue(job('SETTLED', {}))
      })
    });
    expect(await result).toMatchObject({ phase: 'settled', buyTxId: 'tx-buy' });
  });

  it('a poll timeout after broadcast refuses the fallback', async () => {
    const { result } = run({
      maxPollAttempts: 2,
      client: makeClient({
        status: vi.fn().mockResolvedValue(job('SPONSORED', { buy: 'tx-buy' }))
      })
    });
    const final = await result;
    expect(final).toMatchObject({ phase: 'failed', fallbackToSelfPaid: false });
    expect((final as { message: string }).message).toMatch(/may still complete/i);
  });

  it('a poll timeout before broadcast still offers the fallback', async () => {
    const { result } = run({
      maxPollAttempts: 2,
      client: makeClient({
        submit: vi.fn().mockResolvedValue(job('RECEIVED')),
        status: vi.fn().mockResolvedValue(job('RECEIVED'))
      })
    });
    expect(await result).toMatchObject({ phase: 'failed', fallbackToSelfPaid: true });
  });

  it('never rejects when the relayer status endpoint throws', async () => {
    const { result } = run({
      maxPollAttempts: 2,
      client: makeClient({
        status: vi.fn().mockRejectedValue(new Error('network down'))
      })
    });
    await expect(result).resolves.toMatchObject({ phase: 'failed' });
  });

  it('reports every intermediate relayer state exactly once', async () => {
    const states: SponsorJob['state'][] = ['CONFIRMED', 'CLAIMED', 'CLAIMED', 'SETTLED'];
    let index = 0;
    const { result, phases } = run({
      client: makeClient({
        submit: vi.fn().mockResolvedValue(job('RECEIVED')),
        status: vi.fn().mockImplementation(() => Promise.resolve(job(states[index++] ?? 'SETTLED')))
      })
    });
    await result;
    const sponsoring = phases.filter(
      (p): p is Extract<SponsoredBuyPhase, { phase: 'sponsoring' }> => p.phase === 'sponsoring'
    );
    // RECEIVED on submit, then one entry per genuine change. The repeated
    // CLAIMED must not produce a second entry.
    expect(sponsoring.map((p) => p.jobState)).toEqual(['RECEIVED', 'CONFIRMED', 'CLAIMED']);
  });
});

describe('sponsored-buy classifiers', () => {
  it('recognises only a WALLET_CANCELLED code as a cancellation', () => {
    expect(isWalletCancellation({ code: 'WALLET_CANCELLED' })).toBe(true);
    expect(isWalletCancellation(new Error('nope'))).toBe(false);
    expect(isWalletCancellation(null)).toBe(false);
    expect(isWalletCancellation('WALLET_CANCELLED')).toBe(false);
  });

  it('maps every relayer refusal to the client error taxonomy', () => {
    const noFallback = [
      'LISTING_SOLD',
      'DUPLICATE',
      'LISTING_BUSY',
      'BNS_REQUIRED',
      'BNS_NOT_OWNED',
      'CAMPAIGN_INACTIVE',
      'ATTESTATION_EXPIRED',
      'ATTESTOR_DISABLED',
      'ATTESTOR_KEY_MISMATCH'
    ] as const;
    for (const code of noFallback) {
      expect(
        sponsoredBuyFailureFromSubmitError(new SponsorClientError(code, code)).fallbackToSelfPaid
      ).toBe(false);
    }
    for (const code of ['LOW_BALANCE', 'AT_CAPACITY', 'RATE_LIMITED', 'VALIDATION'] as const) {
      expect(
        sponsoredBuyFailureFromSubmitError(new SponsorClientError(code, code)).fallbackToSelfPaid
      ).toBe(true);
    }
  });

  it('falls back on unknown throwables rather than stranding the buyer', () => {
    expect(sponsoredBuyFailureFromSubmitError('boom')).toEqual({
      message: 'sponsor error',
      fallbackToSelfPaid: true
    });
    expect(sponsoredBuyFailureFromSignError({})).toEqual({
      message: 'wallet error',
      fallbackToSelfPaid: true
    });
  });

  it('labels each phase and job state', () => {
    expect(sponsoredBuyProgressLabel({ phase: 'signing' })).toMatch(/wallet/i);
    expect(sponsoredBuyProgressLabel({ phase: 'submitting' })).toMatch(/sponsor/i);
    expect(
      sponsoredBuyProgressLabel({ phase: 'sponsoring', jobId: 'a', jobState: 'SPONSORED' })
    ).toMatch(/confirming/i);
    expect(
      sponsoredBuyProgressLabel({ phase: 'sponsoring', jobId: 'a', jobState: 'REFUNDING' })
    ).toMatch(/settling/i);
  });

  it('explains every ineligibility reason except a plain standard market', () => {
    expect(sponsoredBuyIneligibilityMessage({ ok: false, reason: 'listing-sold' })).toMatch(
      /already been sold/i
    );
    expect(sponsoredBuyIneligibilityMessage({ ok: false, reason: 'budget-exhausted' })).toMatch(
      /used up/i
    );
    expect(sponsoredBuyIneligibilityMessage({ ok: false, reason: 'relayer-unavailable' })).toMatch(
      /temporarily unavailable/i
    );
    // A standard listing is not a degraded sponsored one and says nothing.
    expect(
      sponsoredBuyIneligibilityMessage({ ok: false, reason: 'not-sponsored-market' })
    ).toBeNull();
  });

  it('only withholds the timeout fallback once something was broadcast', () => {
    expect(sponsoredBuyTimeoutFailure(job('RECEIVED')).fallbackToSelfPaid).toBe(true);
    expect(sponsoredBuyTimeoutFailure(job('RECEIVED', { buy: 'tx' })).fallbackToSelfPaid).toBe(
      false
    );
    expect(sponsoredBuyTimeoutFailure(job('SPONSORED')).fallbackToSelfPaid).toBe(false);
  });
});

/**
 * Anti-drift. The React hook and the vanilla page must not merely "look similar":
 * given the same input they must produce the same phase. These assertions run
 * the shared classifiers the way each surface calls them.
 */
describe('decision parity between the React and vanilla surfaces', () => {
  it('agrees on the phase for every relayer job state', () => {
    const current = { jobId: 'sp-1', jobState: 'RECEIVED' as const, buyTxId: undefined };
    const cases: Array<[SponsorJob, string | null]> = [
      [job('RECEIVED'), null],
      [job('SPONSORED'), 'sponsoring'],
      [job('CONFIRMED'), 'sponsoring'],
      [job('CLAIMING'), 'sponsoring'],
      [job('CLAIMED'), 'sponsoring'],
      [job('REFUNDING'), 'sponsoring'],
      [job('SETTLED'), 'settled'],
      [job('ABANDONED'), 'failed']
    ];
    for (const [input, expected] of cases) {
      expect(sponsoredBuyPhaseFromJob(input, current)?.phase ?? null).toBe(expected);
    }
  });

  it('the vanilla run and the hook classify the same submit error identically', async () => {
    const error = new SponsorClientError('LISTING_SOLD', 'already sold');
    // The vanilla surface, through the full orchestrator.
    const vanilla = await run({
      client: makeClient({ submit: vi.fn().mockRejectedValue(error) })
    }).result;
    // The hook calls the same classifier directly in its submit catch block.
    const hook = { phase: 'failed', ...sponsoredBuyFailureFromSubmitError(error) };
    expect(vanilla).toEqual(hook);
  });

  it('the vanilla run and the hook classify the same wallet error identically', async () => {
    const error = new Error('wallet locked');
    const vanilla = await run({
      signSponsoredBuy: vi.fn().mockRejectedValue(error)
    }).result;
    const hook = { phase: 'failed', ...sponsoredBuyFailureFromSignError(error) };
    expect(vanilla).toEqual(hook);
  });
});
