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

  it('requests a claimant-bound campaign attestation', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse({
      contractId: 'SP0.drops',
      listingId: '7',
      campaignId: '0',
      bnsName: 'alice.btc',
      bnsKey: '11'.repeat(32),
      expiresAt: '1000',
      signature: '22'.repeat(65),
      rules: { onePerWallet: true, requireBnsName: true, onePerBnsName: true }
    }));
    const client = createSponsorClient('https://relayer.example', fetchImpl);
    const attestation = await client.attestCampaign({
      contractId: 'SP0.drops',
      listingId: 7n,
      claimer: 'SP123',
      bnsName: 'alice.btc'
    });
    const [url, init] = fetchImpl.mock.calls[0];
    expect(url).toBe('https://relayer.example/sponsor/attest-campaign');
    expect(JSON.parse((init as RequestInit).body as string)).toEqual({
      contractId: 'SP0.drops',
      listingId: '7',
      claimer: 'SP123',
      bnsName: 'alice.btc'
    });
    expect(attestation.signature).toHaveLength(130);
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

  it('preserves a server-side balance lookup outage as RELAYER_UNAVAILABLE', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      jsonResponse(
        {
          code: 'RELAYER_UNAVAILABLE',
          message: 'sponsor balance lookup unavailable; retry shortly',
          requestId: 'req-balance',
          stage: 'SPONSOR_BALANCE'
        },
        503
      )
    );
    const client = createSponsorClient('https://relayer.example', fetchImpl);
    await expect(
      client.submit({ txHex: '00', contractId: 'SP0.m', listingId: 1n })
    ).rejects.toMatchObject({
      code: 'RELAYER_UNAVAILABLE',
      relayerCode: 'RELAYER_UNAVAILABLE',
      requestId: 'req-balance',
      stage: 'SPONSOR_BALANCE'
    });
  });

  it('preserves structured relayer failure metadata for embedded diagnostics', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      Response.json(
        {
          code: 'RELAYER_INTERNAL',
          message: 'sponsor relayer failed during LISTING_READ',
          requestId: 'req-123',
          stage: 'LISTING_READ'
        },
        { status: 500, headers: { 'cf-ray': 'trace-456' } }
      )
    );
    const client = createSponsorClient('https://relayer.example', fetchImpl);
    await expect(
      client.submit({ txHex: '00', contractId: 'SP0.m', listingId: 1n })
    ).rejects.toMatchObject({
      code: 'RELAYER_INTERNAL',
      relayerCode: 'RELAYER_INTERNAL',
      httpStatus: 500,
      requestId: 'req-123',
      stage: 'LISTING_READ',
      traceId: 'trace-456'
    });
  });

  it('describes a non-JSON gateway failure without exposing its response body', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      new Response('<html>private upstream detail</html>', {
        status: 500,
        headers: { 'content-type': 'text/html', 'cf-ray': 'trace-789' }
      })
    );
    const client = createSponsorClient('https://relayer.example', fetchImpl);
    let error: SponsorClientError | undefined;
    try {
      await client.quote();
    } catch (caught) {
      error = caught as SponsorClientError;
    }
    expect(error).toMatchObject({
      code: 'UNKNOWN',
      httpStatus: 500,
      traceId: 'trace-789',
      message: expect.stringContaining('non-JSON HTTP 500')
    });
    expect(error?.message).not.toContain('private upstream detail');
  });

  it('preserves an active job returned by a same-listing reservation conflict', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      jsonResponse(
        {
          code: 'LISTING_BUSY',
          message: 'claim already in progress',
          id: 'sp-existing',
          state: 'SPONSORED',
          txids: { buy: 'abc' }
        },
        409
      )
    );
    const client = createSponsorClient('https://relayer.example', fetchImpl);

    await expect(
      client.submit({ txHex: '00', contractId: 'SP0.m', listingId: 1n })
    ).rejects.toMatchObject({
      code: 'LISTING_BUSY',
      fallbackToSelfPaid: false,
      existingJob: {
        id: 'sp-existing',
        state: 'SPONSORED',
        txids: { buy: 'abc' }
      }
    });
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
    for (const code of ['VALIDATION', 'NOT_SPONSORED', 'NONZERO_FEE', 'NO_POST_CONDITIONS', 'BAD_TX']) {
      expect(mapRelayerError(code, 'x').code).toBe('VALIDATION');
    }
  });

  it('passes through operational codes and defaults to UNKNOWN', () => {
    expect(mapRelayerError('RATE_LIMITED', 'x').code).toBe('RATE_LIMITED');
    expect(mapRelayerError('DUPLICATE', 'x').code).toBe('DUPLICATE');
    expect(mapRelayerError('BNS_NOT_OWNED', 'x').code).toBe('BNS_NOT_OWNED');
    expect(mapRelayerError('SOMETHING_ELSE', 'x').code).toBe('UNKNOWN');
    expect(mapRelayerError(undefined, 'x').code).toBe('UNKNOWN');
  });

  it('DUPLICATE, LISTING_BUSY and LISTING_SOLD do not offer self-paid fallback', () => {
    expect(new SponsorClientError('DUPLICATE', 'x').fallbackToSelfPaid).toBe(false);
    expect(new SponsorClientError('LISTING_BUSY', 'x').fallbackToSelfPaid).toBe(false);
    expect(new SponsorClientError('LISTING_SOLD', 'x').fallbackToSelfPaid).toBe(false);
    expect(new SponsorClientError('ATTESTOR_DISABLED', 'x').fallbackToSelfPaid).toBe(false);
    expect(new SponsorClientError('AT_CAPACITY', 'x').fallbackToSelfPaid).toBe(true);
  });
});
