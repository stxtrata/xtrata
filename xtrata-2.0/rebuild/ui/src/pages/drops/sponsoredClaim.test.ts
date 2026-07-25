import { describe, expect, it, vi } from 'vitest';
import { DropsTxBuilder, XtrataClientError, type DropsTxDescriptor } from '@xtrata/collections-client';
import { RelayerClient, RelayerError, type JobState, type RelayerErrorCode } from './relayer';
import {
  runSponsoredClaim,
  type SponsoredSignRequest,
  type SponsoredStage
} from './sponsoredClaim';

const DEPLOYER = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const CLAIMER = 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7';

const claimTx = (): DropsTxDescriptor =>
  new DropsTxBuilder({
    dropsContractId: `${DEPLOYER}.xtrata-drops-v3`,
    collectionContractId: `${DEPLOYER}.my-collection`,
    nftContractId: `${DEPLOYER}.xtrata-v3-2-3`,
    network: 'mainnet',
    sender: CLAIMER
  }).claim(4);

/**
 * A relayer whose job walks a scripted sequence of states, one per status
 * poll. Nothing here touches the network; the point is the orchestration.
 */
const fakeRelayer = (script: {
  quote?: { feeUstx: bigint } | RelayerError;
  submit?: { state: JobState } | RelayerError;
  states?: JobState[];
  statusError?: RelayerError;
}) => {
  const calls = { quote: 0, submit: 0, status: 0 };
  let cursor = 0;
  const relayer = {
    async quote() {
      calls.quote += 1;
      if (script.quote instanceof RelayerError) throw script.quote;
      return { feeUstx: script.quote?.feeUstx ?? 15_000n, budgetRemaining: 1_000_000n };
    },
    async submit() {
      calls.submit += 1;
      if (script.submit instanceof RelayerError) throw script.submit;
      return {
        jobId: 'job-1',
        state: script.submit?.state ?? ('RECEIVED' as JobState),
        sponsorTxid: null,
        existing: false
      };
    },
    async status() {
      calls.status += 1;
      if (script.statusError) throw script.statusError;
      const states = script.states ?? [];
      const state = states[Math.min(cursor, states.length - 1)] ?? 'SPONSORED';
      cursor += 1;
      return {
        jobId: 'job-1',
        state,
        dropId: 4,
        claimer: CLAIMER,
        sponsorTxid: '0xfeed',
        claimFeeTxid: null,
        refundTxid: null,
        error: state === 'FAILED' ? 'dropped by the node' : null
      };
    }
  } as unknown as RelayerClient;
  return { relayer, calls };
};

/** Deterministic clock: every sleep advances time by exactly its duration. */
const fakeClock = () => {
  let time = 0;
  return {
    now: () => time,
    sleep: async (ms: number) => {
      time += ms;
    }
  };
};

const signer = (txHex = '0x' + '11'.repeat(40)) =>
  vi.fn(async (_request: SponsoredSignRequest) => ({ txHex }));

const baseParams = (relayer: RelayerClient, sign: ReturnType<typeof signer>) => {
  const clock = fakeClock();
  return {
    relayer,
    tx: claimTx(),
    dropId: 4,
    nonce: 7,
    stxAddress: CLAIMER,
    sign,
    pollIntervalMs: 1_000,
    timeoutMs: 10_000,
    sleep: clock.sleep,
    now: clock.now
  };
};

describe('sponsored claim — happy path', () => {
  it('quotes, signs, submits and settles', async () => {
    const { relayer, calls } = fakeRelayer({ states: ['SPONSORED', 'CONFIRMED'] });
    const sign = signer();
    const stages: SponsoredStage[] = [];

    const result = await runSponsoredClaim({
      ...baseParams(relayer, sign),
      onStage: (stage) => stages.push(stage)
    });

    expect(result).toMatchObject({ kind: 'sponsored', jobId: 'job-1', state: 'CONFIRMED' });
    expect(result.kind === 'sponsored' && result.feeUstx).toBe(15_000n);
    expect(calls).toMatchObject({ quote: 1, submit: 1 });
    expect(stages).toEqual(['quoting', 'signing', 'submitting', 'polling', 'settled']);
  });

  it('signs a fee-0 transaction bound to the claimer and its nonce, and never broadcasts it itself', async () => {
    const { relayer } = fakeRelayer({ submit: { state: 'CONFIRMED' } });
    const sign = signer();

    await runSponsoredClaim(baseParams(relayer, sign));

    expect(sign).toHaveBeenCalledTimes(1);
    const request = sign.mock.calls[0]![0];
    expect(request.nonce).toBe(7);
    expect(request.stxAddress).toBe(CLAIMER);
    expect(request.tx.functionName).toBe('claim');
    expect(request.tx.postConditionMode).toBe('deny');
  });

  it('accepts a job that is already settled at submit time without polling', async () => {
    const { relayer, calls } = fakeRelayer({ submit: { state: 'SETTLED' } });
    const result = await runSponsoredClaim(baseParams(relayer, signer()));
    expect(result.kind).toBe('sponsored');
    expect(calls.status).toBe(0);
  });

  it('can skip the quote entirely', async () => {
    const { relayer, calls } = fakeRelayer({ submit: { state: 'CONFIRMED' } });
    const result = await runSponsoredClaim({ ...baseParams(relayer, signer()), skipQuote: true });
    expect(calls.quote).toBe(0);
    expect(result.kind === 'sponsored' && result.feeUstx).toBeNull();
  });

  it.each(['CONFIRMED', 'FEE_CLAIMING', 'FEE_CLAIMED', 'REFUNDING', 'SETTLED'] as JobState[])(
    'treats %s as a successful claim',
    async (state) => {
      const { relayer } = fakeRelayer({ submit: { state } });
      expect((await runSponsoredClaim(baseParams(relayer, signer()))).kind).toBe('sponsored');
    }
  );
});

describe('sponsored claim — relayer refusal', () => {
  it.each([
    'RELAYER_DISABLED',
    'LOW_FLOAT',
    'CAPACITY',
    'RATE_LIMITED',
    'BUDGET_EXHAUSTED',
    'DROP_SHUTDOWN',
    'UNREACHABLE'
  ] as RelayerErrorCode[])('falls back to a self-paid claim on %s', async (code) => {
    const { relayer } = fakeRelayer({ submit: new RelayerError(code, { status: 503 }) });

    const result = await runSponsoredClaim(baseParams(relayer, signer()));

    expect(result.kind).toBe('fallback');
    expect(result.kind === 'fallback' && result.error.code).toBe(code);
  });

  it.each(['DROP_NOT_ACTIVE', 'WINDOW_CLOSED', 'SOLD_OUT', 'WALLET_LIMIT', 'WRONG_ELIGIBILITY'] as RelayerErrorCode[])(
    'throws on %s, because paying your own fee would fail identically',
    async (code) => {
      const { relayer } = fakeRelayer({ submit: new RelayerError(code, { status: 400 }) });
      await expect(runSponsoredClaim(baseParams(relayer, signer()))).rejects.toBeInstanceOf(RelayerError);
    }
  );

  it('falls back before asking for a signature when the quote already refuses', async () => {
    const { relayer } = fakeRelayer({ quote: new RelayerError('RELAYER_DISABLED') });
    const sign = signer();

    const result = await runSponsoredClaim(baseParams(relayer, sign));

    expect(result.kind).toBe('fallback');
    expect(sign).not.toHaveBeenCalled();
  });

  it('reports a job that failed on chain as failed, not as a fallback', async () => {
    const { relayer } = fakeRelayer({ submit: { state: 'FAILED' }, states: ['FAILED'] });
    const result = await runSponsoredClaim(baseParams(relayer, signer()));
    expect(result).toMatchObject({ kind: 'failed', error: 'dropped by the node' });
  });
});

describe('sponsored claim — the wallet', () => {
  it('propagates a wallet cancellation instead of dressing it up as a relayer problem', async () => {
    const { relayer } = fakeRelayer({});
    const sign = vi.fn(async () => {
      throw new XtrataClientError('wallet-rejected', 'user cancelled');
    });
    await expect(runSponsoredClaim(baseParams(relayer, sign as never))).rejects.toThrow('user cancelled');
  });

  it('refuses an empty signature rather than posting nothing to the relayer', async () => {
    const { relayer, calls } = fakeRelayer({});
    await expect(runSponsoredClaim(baseParams(relayer, signer('')))).rejects.toThrow(/no signed transaction/);
    expect(calls.submit).toBe(0);
  });
});

describe('sponsored claim — polling', () => {
  it('gives up as pending (never as failed) when the job does not settle in time', async () => {
    // Always in flight: the deadline is the only thing that ends this.
    const { relayer, calls } = fakeRelayer({ states: ['SPONSORED'] });

    const result = await runSponsoredClaim({
      ...baseParams(relayer, signer()),
      pollIntervalMs: 1_000,
      timeoutMs: 5_000
    });

    expect(result).toMatchObject({ kind: 'pending', jobId: 'job-1', state: 'SPONSORED' });
    // 5s budget at 1s per poll.
    expect(calls.status).toBe(5);
  });

  it('rides out a transient status failure instead of declaring a verdict', async () => {
    const relayer = {
      quote: async () => ({ feeUstx: 1n, budgetRemaining: 1n }),
      submit: async () => ({ jobId: 'job-1', state: 'RECEIVED' as JobState, sponsorTxid: null, existing: false }),
      status: vi
        .fn()
        .mockRejectedValueOnce(new RelayerError('UNREACHABLE'))
        .mockResolvedValueOnce({
          jobId: 'job-1',
          state: 'CONFIRMED' as JobState,
          dropId: 4,
          claimer: CLAIMER,
          sponsorTxid: '0xfeed',
          claimFeeTxid: null,
          refundTxid: null,
          error: null
        })
    } as unknown as RelayerClient;

    const result = await runSponsoredClaim(baseParams(relayer, signer()));

    expect(result.kind).toBe('sponsored');
  });

  it('keeps the sponsor txid it learns while polling', async () => {
    const { relayer } = fakeRelayer({ states: ['SPONSORED', 'CONFIRMED'] });
    const result = await runSponsoredClaim(baseParams(relayer, signer()));
    expect(result.kind === 'sponsored' && result.sponsorTxid).toBe('0xfeed');
  });
});
