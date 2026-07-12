import { describe, expect, it, vi } from 'vitest';
import {
  createSponsorClient,
  mapRelayerError,
  SponsorClientError
} from '../sponsor-client';

const jsonResponse = (body: unknown, status = 200) =>
  ({
    ok: status >= 200 && status < 300,
    status,
    json: async () => body
  }) as Response;

describe('createSponsorClient', () => {
  it('quote() parses bigint fields and strips trailing slashes from the base URL', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      jsonResponse({
        estimatedFeeUstx: '20000',
        budgetUstx: '60000',
        minBudgetUstx: '50000',
        expiresAt: 123
      })
    );
    const client = createSponsorClient('https://relayer.example//', fetchImpl);
    const quote = await client.quote();
    expect(fetchImpl).toHaveBeenCalledWith(
      'https://relayer.example/sponsor/quote',
      expect.objectContaining({ method: 'POST' })
    );
    expect(quote.estimatedFeeUstx).toBe(20_000n);
    expect(quote.budgetUstx).toBe(60_000n);
    expect(quote.minBudgetUstx).toBe(50_000n);
    expect(quote.expiresAt).toBe(123);
  });

  it('submit() serializes the listing id and returns the job', async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValue(jsonResponse({ id: 'sp-1', state: 'SPONSORED', txids: { buy: 'abc' } }));
    const client = createSponsorClient('https://relayer.example', fetchImpl);
    const job = await client.submit({
      txHex: '00ff',
      contractId: 'SP0.market',
      listingId: 7n
    });
    const [, init] = fetchImpl.mock.calls[0];
    expect(JSON.parse((init as RequestInit).body as string)).toEqual({
      txHex: '00ff',
      contractId: 'SP0.market',
      listingId: '7'
    });
    expect(job.state).toBe('SPONSORED');
  });

  it('network failure maps to RELAYER_UNAVAILABLE with self-paid fallback', async () => {
    const fetchImpl = vi.fn().mockRejectedValue(new TypeError('fetch failed'));
    const client = createSponsorClient('https://relayer.example', fetchImpl);
    await expect(client.quote()).rejects.toMatchObject({
      code: 'RELAYER_UNAVAILABLE',
      fallbackToSelfPaid: true
    });
    expect(await client.available()).toBe(false);
  });

  it('relayer error bodies map to typed errors', async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValue(jsonResponse({ code: 'LOW_BALANCE', message: 'reserve' }, 503));
    const client = createSponsorClient('https://relayer.example', fetchImpl);
    await expect(
      client.submit({ txHex: '00', contractId: 'SP0.m', listingId: 1n })
    ).rejects.toMatchObject({ code: 'LOW_BALANCE', fallbackToSelfPaid: true });
  });

  it('status() fetches by job id', async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValue(jsonResponse({ id: 'sp-1', state: 'SETTLED', txids: {} }));
    const client = createSponsorClient('https://relayer.example', fetchImpl);
    const job = await client.status('sp-1');
    expect(fetchImpl).toHaveBeenCalledWith(
      'https://relayer.example/sponsor/status/sp-1',
      undefined
    );
    expect(job.state).toBe('SETTLED');
  });
});

describe('mapRelayerError', () => {
  it('collapses relayer validation codes into VALIDATION', () => {
    for (const code of ['NOT_SPONSORED', 'NONZERO_FEE', 'NO_POST_CONDITIONS', 'BAD_TX']) {
      expect(mapRelayerError(code, 'x').code).toBe('VALIDATION');
    }
  });

  it('passes through operational codes and defaults to UNKNOWN', () => {
    expect(mapRelayerError('RATE_LIMITED', 'x').code).toBe('RATE_LIMITED');
    expect(mapRelayerError('DUPLICATE', 'x').code).toBe('DUPLICATE');
    expect(mapRelayerError('SOMETHING_ELSE', 'x').code).toBe('UNKNOWN');
    expect(mapRelayerError(undefined, 'x').code).toBe('UNKNOWN');
  });

  it('DUPLICATE and LISTING_SOLD do not offer self-paid fallback', () => {
    expect(new SponsorClientError('DUPLICATE', 'x').fallbackToSelfPaid).toBe(false);
    expect(new SponsorClientError('LISTING_SOLD', 'x').fallbackToSelfPaid).toBe(false);
    expect(new SponsorClientError('AT_CAPACITY', 'x').fallbackToSelfPaid).toBe(true);
  });
});
