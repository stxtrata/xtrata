import { cvToHex, noneCV, responseOkCV, uintCV } from '@stacks/transactions';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { readMarket, type RegistryEntry } from '../../market/listings';

const originalFetch = global.fetch;

const clarityResponse = (result: string) =>
  new Response(JSON.stringify({ okay: true, result }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });

const entry: RegistryEntry = {
  label: 'Test market',
  address: 'SP000000000000000000002Q6VF78',
  contractName: 'test-market',
  network: 'mainnet'
};

describe('market listings aggregation', () => {
  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it('retries a transient listing read and accepts a valid optional-none slot', async () => {
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce(clarityResponse(cvToHex(responseOkCV(uintCV(0)))))
      .mockResolvedValueOnce(new Response('upstream unavailable', { status: 503 }))
      .mockResolvedValueOnce(clarityResponse(cvToHex(responseOkCV(noneCV())))) as typeof fetch;

    await expect(readMarket({}, entry, entry.address)).resolves.toEqual([]);
    expect(global.fetch).toHaveBeenCalledTimes(3);
  });

  it('rejects a market after repeated listing read failures instead of omitting it', async () => {
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce(clarityResponse(cvToHex(responseOkCV(uintCV(0)))))
      .mockResolvedValueOnce(new Response('rate limited', { status: 429 }))
      .mockResolvedValueOnce(new Response('rate limited', { status: 429 })) as typeof fetch;

    await expect(readMarket({}, entry, entry.address)).rejects.toThrow('get-listing 429');
    expect(global.fetch).toHaveBeenCalledTimes(3);
  });
});
