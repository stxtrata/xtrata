import { describe, expect, it } from 'vitest';
import {
  SponsorClientError,
  createSponsorClient,
  mapRelayerError
} from '../sponsor.js';

const jsonResponse = (status: number, body: unknown): Response =>
  ({
    ok: status >= 200 && status < 300,
    status,
    headers: { get: () => undefined },
    json: async () => body
  }) as unknown as Response;

describe('mapRelayerError', () => {
  it('maps relayer validation family codes to VALIDATION', () => {
    for (const code of ['BAD_TX', 'NOT_SPONSORED', 'NONZERO_FEE', 'VALIDATION']) {
      expect(mapRelayerError(code, 'x').code).toBe('VALIDATION');
    }
  });

  it('passes through known codes and defaults unknown ones', () => {
    expect(mapRelayerError('AT_CAPACITY', 'x').code).toBe('AT_CAPACITY');
    expect(mapRelayerError('SOMETHING_ELSE', 'x').code).toBe('UNKNOWN');
    expect(mapRelayerError(undefined, 'x').code).toBe('UNKNOWN');
  });

  it('only blocks self-paid fallback for terminal listing states', () => {
    expect(new SponsorClientError('LISTING_SOLD', 'x').fallbackToSelfPaid).toBe(false);
    expect(new SponsorClientError('DUPLICATE', 'x').fallbackToSelfPaid).toBe(false);
    expect(new SponsorClientError('LISTING_BUSY', 'x').fallbackToSelfPaid).toBe(false);
    expect(new SponsorClientError('AT_CAPACITY', 'x').fallbackToSelfPaid).toBe(true);
    expect(new SponsorClientError('RELAYER_UNAVAILABLE', 'x').fallbackToSelfPaid).toBe(true);
  });
});

describe('createSponsorClient', () => {
  it('parses quotes into bigints', async () => {
    const client = createSponsorClient('https://relayer.example/', (async () =>
      jsonResponse(200, {
        estimatedFeeUstx: '1500',
        budgetUstx: '30000',
        minBudgetUstx: '20000',
        expiresAt: 1234
      })) as typeof fetch);
    const quote = await client.quote();
    expect(quote.estimatedFeeUstx).toBe(1500n);
    expect(quote.budgetUstx).toBe(30000n);
    expect(quote.minBudgetUstx).toBe(20000n);
    expect(quote.expiresAt).toBe(1234);
  });

  it('serialises submit payloads with string listing ids', async () => {
    let captured: { url?: string; body?: string } = {};
    const client = createSponsorClient('https://relayer.example', (async (
      url: string | URL | Request,
      init?: RequestInit
    ) => {
      captured = { url: String(url), body: String(init?.body ?? '') };
      return jsonResponse(200, { id: 'job-1', state: 'RECEIVED', txids: {} });
    }) as typeof fetch);
    const job = await client.submit({
      txHex: '00aa',
      contractId: 'SP000.market',
      listingId: 42n
    });
    expect(job.id).toBe('job-1');
    expect(captured.url).toBe('https://relayer.example/sponsor/submit');
    expect(JSON.parse(captured.body ?? '{}').listingId).toBe('42');
  });

  it('surfaces relayer errors with diagnostics and existing jobs', async () => {
    const client = createSponsorClient('https://relayer.example', (async () =>
      jsonResponse(409, {
        code: 'DUPLICATE',
        message: 'already submitted',
        id: 'job-9',
        state: 'SPONSORED',
        requestId: 'req-7'
      })) as typeof fetch);
    const error = await client
      .submit({ txHex: '00', contractId: 'SP000.market', listingId: 1n })
      .then(() => null)
      .catch((e: unknown) => e as SponsorClientError);
    expect(error?.code).toBe('DUPLICATE');
    expect(error?.existingJob?.id).toBe('job-9');
    expect(error?.httpStatus).toBe(409);
    expect(error?.fallbackToSelfPaid).toBe(false);
  });

  it('reports unavailable relayers via available()', async () => {
    const client = createSponsorClient('https://relayer.example', (async () => {
      throw new Error('network down');
    }) as typeof fetch);
    await expect(client.available()).resolves.toBe(false);
  });
});
