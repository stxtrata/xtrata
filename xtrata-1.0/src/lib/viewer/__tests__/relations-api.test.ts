import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchLineage } from '../relations-api';

const jsonResponse = (body: unknown, ok = true) =>
  ({ ok, json: async () => body }) as unknown as Response;

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('fetchLineage', () => {
  it('parses ids and depth-tagged nodes into bigints', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        jsonResponse({
          parents: [1, '2'],
          children: [10],
          ancestors: [{ id: 1, depth: 1 }, { id: '5', depth: 2 }],
          descendants: [{ id: 10, depth: 1 }],
          siblings: ['11', 12],
          mintedCount: 100,
          syncedCount: '100',
          complete: true
        })
      )
    );
    const result = await fetchLineage({ contractId: 'SP.x', id: 3n });
    expect(result).not.toBeNull();
    expect(result!.parents).toEqual([1n, 2n]);
    expect(result!.children).toEqual([10n]);
    expect(result!.ancestors).toEqual([
      { id: 1n, depth: 1 },
      { id: 5n, depth: 2 }
    ]);
    expect(result!.siblings).toEqual([11n, 12n]);
    expect(result!.mintedCount).toBe(100n);
    expect(result!.complete).toBe(true);
  });

  it('returns null on a non-ok response', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => jsonResponse({}, false)));
    expect(await fetchLineage({ contractId: 'SP.x', id: 3n })).toBeNull();
  });

  it('returns null when the endpoint reports an error body', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => jsonResponse({ error: 'nope' })));
    expect(await fetchLineage({ contractId: 'SP.x', id: 3n })).toBeNull();
  });

  it('returns null when fetch throws', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => {
      throw new Error('network down');
    }));
    expect(await fetchLineage({ contractId: 'SP.x', id: 3n })).toBeNull();
  });
});
