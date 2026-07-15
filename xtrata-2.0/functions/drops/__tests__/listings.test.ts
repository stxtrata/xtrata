import { afterEach, describe, expect, it, vi } from 'vitest';
import { Cl, cvToHex } from '@stacks/transactions';
import { onRequestGet } from '../listings';

describe('GET /drops/listings', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('reads drops concurrently, filters claimed rows, and edge-caches live rows', async () => {
    let activeReads = 0;
    let maxActiveReads = 0;
    const cachePut = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('caches', {
      default: { match: vi.fn().mockResolvedValue(undefined), put: cachePut }
    });
    vi.stubGlobal('fetch', vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.endsWith('/get-last-drop-id')) {
        return Response.json({ okay: true, result: cvToHex(Cl.ok(Cl.uint(2))) });
      }
      if (url.endsWith('/get-drop')) {
        activeReads += 1;
        maxActiveReads = Math.max(maxActiveReads, activeReads);
        await Promise.resolve();
        const response = Response.json({
          okay: true,
          result: cvToHex(Cl.ok(Cl.some(Cl.tuple({
            creator: Cl.principal('SP10W2EEM757922QTVDZZ5CSEW55JEFNN30J69TM7'),
            'nft-contract': Cl.contractPrincipal(
              'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X',
              'xtrata-v3-2-3'
            ),
            'token-id': Cl.uint(activeReads),
            'group-id': Cl.uint(1),
            'fee-budget': Cl.uint(60000),
            'budget-remaining': Cl.uint(60000),
            claimer: Cl.none(),
            'claimed-at': activeReads === 1 ? Cl.some(Cl.uint(100)) : Cl.none()
          }))))
        });
        activeReads -= 1;
        return response;
      }
      throw new Error(`unexpected URL ${url}`);
    }));

    const waitUntil = vi.fn();
    const response = await onRequestGet({
      request: new Request('https://x/drops/listings'),
      env: {},
      waitUntil
    } as never);

    expect(response.status).toBe(200);
    const payload = await response.json() as { drops: Array<{ claimedAt: null }> };
    expect(payload.drops).toHaveLength(2);
    expect(payload.drops.every((drop) => drop.claimedAt === null)).toBe(true);
    expect(maxActiveReads).toBeGreaterThan(1);
    expect(waitUntil).toHaveBeenCalledTimes(1);
    expect(cachePut).toHaveBeenCalledTimes(1);
  });

  it('bypasses edge storage for a fresh post-claim read', async () => {
    const cacheMatch = vi.fn();
    const cachePut = vi.fn();
    vi.stubGlobal('caches', { default: { match: cacheMatch, put: cachePut } });
    vi.stubGlobal('fetch', vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.endsWith('/get-last-drop-id')) {
        return Response.json({ okay: true, result: cvToHex(Cl.ok(Cl.uint(0))) });
      }
      return Response.json({ okay: true, result: cvToHex(Cl.none()) });
    }));

    const response = await onRequestGet({
      request: new Request('https://x/drops/listings?fresh=1'),
      env: {},
      waitUntil: vi.fn()
    } as never);

    expect(response.headers.get('cache-control')).toBe('no-store');
    expect(cacheMatch).not.toHaveBeenCalled();
    expect(cachePut).not.toHaveBeenCalled();
  });
});
