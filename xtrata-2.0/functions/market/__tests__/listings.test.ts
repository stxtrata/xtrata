import { afterEach, describe, expect, it, vi } from 'vitest';
import { Cl, cvToHex } from '@stacks/transactions';
import { onRequestGet } from '../listings';

describe('GET /market/listings Hiro transport', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('sanitizes and rotates configured Hiro keys before serving the aggregate feed', async () => {
    const seenKeys: Array<string | null> = [];
    vi.stubGlobal('caches', {
      default: {
        match: vi.fn().mockResolvedValue(undefined),
        put: vi.fn().mockResolvedValue(undefined)
      }
    });
    vi.stubGlobal('fetch', vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const key = new Headers(init?.headers).get('x-api-key');
      seenKeys.push(key);
      expect(key).not.toMatch(/[\s,]/);
      if (key === 'rate-limited') {
        return Response.json({ error: 'rate limited' }, { status: 429 });
      }
      const url = String(input);
      if (url.endsWith('/get-last-listing-id')) {
        return Response.json({ okay: true, result: cvToHex(Cl.ok(Cl.uint(0))) });
      }
      if (url.endsWith('/get-listing')) {
        return Response.json({ okay: true, result: cvToHex(Cl.none()) });
      }
      throw new Error(`unexpected URL ${url}`);
    }));

    const waitUntil = vi.fn();
    const response = await onRequestGet({
      request: new Request('https://x/market/listings'),
      env: { HIRO_API_KEYS: 'rate-limited,\nworking-key' },
      waitUntil
    } as never);

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ listings: [], degraded: false });
    expect(seenKeys).toContain('rate-limited');
    expect(seenKeys).toContain('working-key');
    expect(waitUntil).toHaveBeenCalledTimes(1);
  });
});
