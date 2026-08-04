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

describe('GET /market/listings scan performance and honesty', () => {
  afterEach(() => vi.unstubAllGlobals());

  /** Stub every market to hold `lastId + 1` listings, recording concurrency. */
  const stubMarkets = (lastId: number, failIds: number[] = []) => {
    let inFlight = 0;
    let peakInFlight = 0;
    const listingReads: number[] = [];
    vi.stubGlobal('caches', {
      default: { match: vi.fn().mockResolvedValue(undefined), put: vi.fn().mockResolvedValue(undefined) }
    });
    vi.stubGlobal('fetch', vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      if (url.endsWith('/get-last-listing-id')) {
        return Response.json({ okay: true, result: cvToHex(Cl.ok(Cl.uint(lastId))) });
      }
      if (url.endsWith('/get-listing')) {
        inFlight += 1;
        peakInFlight = Math.max(peakInFlight, inFlight);
        // Yield so overlapping requests are observable.
        await new Promise((r) => setTimeout(r, 1));
        inFlight -= 1;
        const body = JSON.parse(String(init?.body ?? '{}')) as { arguments?: string[] };
        const idHex = body.arguments?.[0] ?? '';
        const id = Number(BigInt('0x' + idHex.slice(4)));
        listingReads.push(id);
        if (failIds.includes(id)) return Response.json({ error: 'rate limited' }, { status: 429 });
        return Response.json({
          okay: true,
          result: cvToHex(
            Cl.some(
              Cl.tuple({
                seller: Cl.standardPrincipal('SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X'),
                'nft-contract': Cl.contractPrincipal('SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X', 'xtrata-v3-2-3'),
                'token-id': Cl.uint(2900 + id),
                price: Cl.uint(1000000),
                'created-at': Cl.uint(1)
              })
            )
          )
        });
      }
      throw new Error(`unexpected ${url}`);
    }));
    return { peak: () => peakInFlight, reads: () => listingReads };
  };

  const call = () =>
    onRequestGet({
      request: new Request('https://x/market/listings'),
      env: {},
      waitUntil: () => {}
    } as never);

  it('reads listing ids concurrently, not one after another', async () => {
    // Sequential reads made this endpoint scale linearly with listing count:
    // ~200ms per Hiro round trip meant a 21-listing market cost ~4.5s and set
    // the whole response time. If this drops back to 1 the page gets slow again
    // as the market fills, with nothing else failing to signal it.
    const probe = stubMarkets(20);
    const response = await call();
    expect(response.status).toBe(200);
    expect(probe.peak()).toBeGreaterThan(1);
  });

  it('marks a partially-failed scan degraded instead of caching a short list as healthy', async () => {
    // The old per-id `catch` could not tell a deleted listing from a
    // rate-limited read, so a lossy scan was cached as authoritative for 30s
    // and the page quietly showed fewer listings than exist.
    const probe = stubMarkets(10, [4, 7]);
    const response = await call();
    const payload = (await response.json()) as { degraded: boolean; listings: unknown[] };
    expect(probe.reads().length).toBeGreaterThan(0);
    expect(payload.degraded).toBe(true);
    expect(response.headers.get('Cache-Control')).toBe('no-store');
  });

  it('reports a clean full scan as healthy and lets it cache', async () => {
    stubMarkets(5);
    const response = await call();
    const payload = (await response.json()) as { degraded: boolean };
    expect(payload.degraded).toBe(false);
    expect(response.headers.get('Cache-Control')).toMatch(/s-maxage=/);
  });
});
