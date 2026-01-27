import { describe, expect, it } from 'vitest';
import {
  buildInscriptionCacheKey,
  buildInscriptionTempCacheKey,
  buildInscriptionPreviewCacheKey,
  clearInscriptionCache
} from '../cache';

describe('viewer cache', () => {
  it('builds cache keys with contract id and token id', () => {
    const key = buildInscriptionCacheKey('ST123.fake-contract', 42n);
    expect(key).toBe('inscription-data:ST123.fake-contract:42');
  });

  it('differentiates ids and contracts', () => {
    const first = buildInscriptionCacheKey('ST123.fake-contract', 1n);
    const second = buildInscriptionCacheKey('ST123.fake-contract', 2n);
    const third = buildInscriptionCacheKey('ST456.other-contract', 1n);
    expect(first).not.toBe(second);
    expect(first).not.toBe(third);
  });

  it('builds preview cache keys with contract id and token id', () => {
    const key = buildInscriptionPreviewCacheKey('ST123.fake-contract', 42n);
    expect(key).toBe('inscription-preview:ST123.fake-contract:42');
  });

  it('builds temp cache keys with contract id and token id', () => {
    const key = buildInscriptionTempCacheKey('ST123.fake-contract', 42n);
    expect(key).toBe('inscription-temp:ST123.fake-contract:42');
  });

  it('reports unavailable when indexedDB is missing', async () => {
    const result = await clearInscriptionCache();
    expect(result.cleared).toBe(false);
    expect(result.reason).toBe('unavailable');
  });
});
