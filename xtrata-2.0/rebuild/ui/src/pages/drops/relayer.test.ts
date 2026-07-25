import { describe, expect, it } from 'vitest';
import {
  canFallBackToSelfPaid,
  RelayerClient,
  RelayerError,
  SELF_PAID_FALLBACK_CODES,
  type RelayerErrorCode
} from './relayer';

const jsonResponse = (status: number, body: unknown): Response =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

const clientWith = (
  handler: (url: string, init?: RequestInit) => Promise<Response>
): { client: RelayerClient; calls: { url: string; body?: unknown }[] } => {
  const calls: { url: string; body?: unknown }[] = [];
  const client = new RelayerClient({
    baseUrl: 'https://xtrata.example/',
    fetchImpl: (async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      calls.push({
        url,
        ...(typeof init?.body === 'string' ? { body: JSON.parse(init.body) } : {})
      });
      return handler(url, init);
    }) as typeof fetch
  });
  return { client, calls };
};

describe('route construction', () => {
  it('mounts everything under /sponsor/v3 and trims a trailing slash', async () => {
    const { client, calls } = clientWith(async () =>
      jsonResponse(200, { ok: true, feeUstx: '12000', budgetRemaining: '500000' })
    );
    await client.quote(4);
    expect(calls[0]!.url).toBe('https://xtrata.example/sponsor/v3/quote');
    expect(calls[0]!.body).toEqual({ dropId: 4 });
  });
});

describe('quote', () => {
  it('parses decimal-string µSTX into bigints', async () => {
    const { client } = clientWith(async () =>
      jsonResponse(200, { ok: true, feeUstx: '18000', budgetRemaining: '1250000' })
    );
    const quote = await client.quote(1);
    expect(quote.feeUstx).toBe(18_000n);
    expect(quote.budgetRemaining).toBe(1_250_000n);
  });

  it('rejects a non-numeric amount rather than silently producing NaN', async () => {
    const { client } = clientWith(async () =>
      jsonResponse(200, { ok: true, feeUstx: 'lots', budgetRemaining: '0' })
    );
    await expect(client.quote(1)).rejects.toMatchObject({ code: 'INTERNAL' });
  });
});

describe('submit', () => {
  it('returns the job on a 201', async () => {
    const { client, calls } = clientWith(async () =>
      jsonResponse(201, { ok: true, jobId: 'job-1', state: 'SPONSORED', sponsorTxid: '0xabc', existing: false })
    );
    const result = await client.submit({ txHex: '00ff', dropId: 4, functionName: 'claim' });
    expect(result).toEqual({ jobId: 'job-1', state: 'SPONSORED', sponsorTxid: '0xabc', existing: false });
    expect(calls[0]!.body).toMatchObject({ txHex: '00ff', dropId: 4, functionName: 'claim' });
  });

  it('surfaces an idempotent resubmit as existing:true rather than a new job', async () => {
    const { client } = clientWith(async () =>
      jsonResponse(200, { ok: true, jobId: 'job-1', state: 'SPONSORED', existing: true })
    );
    const result = await client.submit({ txHex: '00ff' });
    expect(result.existing).toBe(true);
    expect(result.sponsorTxid).toBeNull();
  });
});

describe('error mapping', () => {
  it.each([
    [400, 'BAD_TX'],
    [400, 'WRONG_POST_CONDITIONS'],
    [404, 'DROP_NOT_FOUND'],
    [429, 'RATE_LIMITED'],
    [503, 'LOW_FLOAT'],
    [502, 'BROADCAST_REJECTED'],
    [500, 'INTERNAL']
  ] as [number, RelayerErrorCode][])('maps %i %s onto a RelayerError', async (status, code) => {
    const { client } = clientWith(async () => jsonResponse(status, { ok: false, code }));
    const error = await client.submit({ txHex: '00' }).catch((caught: unknown) => caught);
    expect(error).toBeInstanceOf(RelayerError);
    expect((error as RelayerError).code).toBe(code);
    expect((error as RelayerError).status).toBe(status);
    expect((error as RelayerError).userMessage).not.toBe('');
  });

  it('never trusts an unknown code', async () => {
    const { client } = clientWith(async () => jsonResponse(400, { ok: false, code: 'WAT' }));
    const error = await client.quote(1).catch((caught: unknown) => caught as RelayerError);
    expect((error as RelayerError).code).toBe('INTERNAL');
  });

  it('classifies a transport failure as UNREACHABLE, which is fallback-eligible', async () => {
    const { client } = clientWith(async () => {
      throw new TypeError('network down');
    });
    const error = await client.quote(1).catch((caught: unknown) => caught as RelayerError);
    expect((error as RelayerError).code).toBe('UNREACHABLE');
    expect((error as RelayerError).selfPaidFallback).toBe(true);
  });

  it('treats ok:false on a 200 as a failure', async () => {
    const { client } = clientWith(async () => jsonResponse(200, { ok: false, code: 'DROP_SHUTDOWN' }));
    await expect(client.quote(1)).rejects.toMatchObject({ code: 'DROP_SHUTDOWN' });
  });
});

describe('the self-paid fallback taxonomy', () => {
  it('allows a fallback only when the sponsorship, not the drop, is the problem', () => {
    for (const code of [
      'RELAYER_DISABLED',
      'LOW_FLOAT',
      'CAPACITY',
      'RATE_LIMITED',
      'DROP_SHUTDOWN',
      'BUDGET_EXHAUSTED',
      'UNREACHABLE'
    ] as RelayerErrorCode[]) {
      expect(canFallBackToSelfPaid(code)).toBe(true);
    }
  });

  it('refuses a fallback when the contract would reject the same claim', () => {
    for (const code of [
      'DROP_NOT_ACTIVE',
      'WINDOW_CLOSED',
      'SOLD_OUT',
      'WALLET_LIMIT',
      'WRONG_ELIGIBILITY',
      'DROP_NOT_FOUND',
      'CONTRACT_PAUSED',
      'DUPLICATE_CLAIM',
      'BAD_TX'
    ] as RelayerErrorCode[]) {
      expect(canFallBackToSelfPaid(code)).toBe(false);
    }
  });

  it('projects onto the shared client taxonomy by fallback eligibility', () => {
    expect(new RelayerError('LOW_FLOAT').toClientError().code).toBe('broadcast-failed');
    expect(new RelayerError('LOW_FLOAT').toClientError().retryable).toBe(true);
    expect(new RelayerError('SOLD_OUT').toClientError().code).toBe('chain-rejected');
    expect(new RelayerError('SOLD_OUT').toClientError().retryable).toBe(false);
  });

  it('keeps the fallback set and the flag in agreement', () => {
    for (const code of SELF_PAID_FALLBACK_CODES) {
      expect(new RelayerError(code).selfPaidFallback).toBe(true);
    }
  });
});

describe('status and attest', () => {
  it('normalizes a status row', async () => {
    const { client, calls } = clientWith(async () =>
      jsonResponse(200, {
        ok: true,
        jobId: 'job-9',
        state: 'CONFIRMED',
        dropId: 4,
        claimer: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7',
        sponsorTxid: '0xdead',
        claimFeeTxid: null,
        refundTxid: null,
        error: null
      })
    );
    const status = await client.status('job-9');
    expect(calls[0]!.url).toBe('https://xtrata.example/sponsor/v3/status/job-9');
    expect(status.state).toBe('CONFIRMED');
    expect(status.claimFeeTxid).toBeNull();
  });

  it('rejects an unknown job state instead of inventing one', async () => {
    const { client } = clientWith(async () => jsonResponse(200, { ok: true, jobId: 'j', state: 'VIBING' }));
    await expect(client.status('j')).rejects.toMatchObject({ code: 'INTERNAL' });
  });

  it('returns an attestation with its expiry height', async () => {
    const { client } = clientWith(async () =>
      jsonResponse(200, { ok: true, dropId: 4, claimer: 'SP…', expiresAt: 12_345, signature: `0x${'ab'.repeat(65)}` })
    );
    const attestation = await client.attest({ dropId: 4, claimer: 'SP…' });
    expect(attestation.expiresAt).toBe(12_345);
    expect(attestation.signature).toHaveLength(132);
  });

  it('surfaces a missing attestor key as its own 503 code', async () => {
    const { client } = clientWith(async () =>
      jsonResponse(503, { ok: false, code: 'ATTESTOR_NOT_CONFIGURED' })
    );
    const error = await client.attest({ dropId: 4, claimer: 'SP…' }).catch((caught: unknown) => caught);
    expect((error as RelayerError).code).toBe('ATTESTOR_NOT_CONFIGURED');
    // Not fallback-eligible: nobody can claim a signed drop without one.
    expect((error as RelayerError).selfPaidFallback).toBe(false);
  });

  it('reads health, including the per-drop shutdown list', async () => {
    const { client } = clientWith(async () =>
      jsonResponse(200, {
        ok: true,
        sponsorAddress: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7',
        floatUstx: '9000000',
        unsettled: 3,
        disabled: false,
        shutdownDrops: [7, 9]
      })
    );
    const health = await client.health();
    expect(health.floatUstx).toBe(9_000_000n);
    expect(health.shutdownDrops).toEqual([7, 9]);
  });
});
