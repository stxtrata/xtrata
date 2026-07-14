import { describe, expect, it, vi } from 'vitest';
import {
  DROPS_CONTRACT,
  SPONSOR_ADDRESS,
  WALLET_CANARIES,
  assertReleaseSmokePassed,
  runReadOnlyReleaseSmoke
} from '../premerge-live-smoke.mjs';

const sponsorResult = '0x070516dd1e257e78870aaae3630c80a241fff1cdde836e';

const canaryBody = (canary: (typeof WALLET_CANARIES)[number]) => ({
  tx_status: 'success',
  canonical: true,
  sponsored: true,
  nonce: 0,
  sender_address: canary.claimer,
  sponsor_address: SPONSOR_ADDRESS,
  contract_call: { contract_id: DROPS_CONTRACT, function_name: 'claim' },
  events: [{
    event_type: 'non_fungible_token_asset',
    asset: {
      asset_event_type: 'transfer',
      recipient: canary.claimer,
      value: { repr: canary.token }
    }
  }]
});

const passingFetch = () => {
  const calls: Array<{ url: string; method: string }> = [];
  const fetchImpl = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    const method = init?.method ?? 'GET';
    calls.push({ url, method });
    if (url.endsWith('/drops')) return new Response('<div id="dropsListings"></div>');
    if (url.endsWith('/market')) return new Response('<div id="marketListings"></div>');
    if (url.endsWith('/market/listings')) return Response.json({ listings: [], degraded: false });
    if (url.endsWith('/sponsor/quote') && method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: { 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS' }
      });
    }
    if (url.includes('/v2/contracts/interface/')) {
      return Response.json({
        functions: ['claim', 'claim-fee', 'create-drop', 'get-listing', 'get-sponsor', 'settle-refund']
          .map((name) => ({ name }))
      });
    }
    if (url.endsWith('/get-sponsor') && method === 'POST') {
      return Response.json({ okay: true, result: sponsorResult });
    }
    if (url.endsWith(`/${SPONSOR_ADDRESS}/stx`)) return Response.json({ balance: '40975001' });
    const canary = WALLET_CANARIES.find((entry) => url.endsWith(`0x${entry.txid}`));
    if (canary) return Response.json(canaryBody(canary));
    throw new Error(`unexpected request ${method} ${url}`);
  });
  return { fetchImpl, calls };
};

describe('read-only premerge smoke', () => {
  it('validates the deployed routes, contract, reserve, and both wallet canaries without broadcasting', async () => {
    const { fetchImpl, calls } = passingFetch();
    const results = await runReadOnlyReleaseSmoke({
      fetchImpl: fetchImpl as typeof fetch,
      baseUrl: 'https://staging.example',
      hiroUrl: 'https://hiro.example'
    });

    expect(results).toHaveLength(9);
    expect(results.every((result) => result.ok)).toBe(true);
    expect(() => assertReleaseSmokePassed(results)).not.toThrow();
    expect(calls.some((call) => call.url.includes('/v2/transactions'))).toBe(false);
    expect(calls.find((call) => call.url.endsWith('/sponsor/quote'))?.method).toBe('OPTIONS');
  });

  it('fails closed when a canonical wallet canary no longer proves nonce-0 sponsorship', async () => {
    const { fetchImpl } = passingFetch();
    const wrappedFetch = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const response = await fetchImpl(input, init);
      if (String(input).endsWith(`0x${WALLET_CANARIES[1].txid}`)) {
        const body = await response.json();
        return Response.json({ ...body, nonce: 1 });
      }
      return response;
    });
    const results = await runReadOnlyReleaseSmoke({
      fetchImpl: wrappedFetch as typeof fetch,
      baseUrl: 'https://staging.example',
      hiroUrl: 'https://hiro.example'
    });

    expect(results.find((result) => result.name.startsWith('Xverse'))).toMatchObject({ ok: false });
    expect(() => assertReleaseSmokePassed(results)).toThrow(/1 release smoke check failed/);
  });
});
