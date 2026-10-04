import { describe, expect, it, vi } from 'vitest';
import {
  buildAssetHashIndex,
  resolveMintedAssetsFast,
  runWithConcurrency
} from '../minted-assets';

const h = (c: string) => c.repeat(64);
const assets = [
  { asset_id: 'a1', expected_hash: h('a') },
  { asset_id: 'a2', expected_hash: `0x${h('B')}` },
  { asset_id: 'a3', expected_hash: h('c') }
];
const base = (over: Partial<Parameters<typeof resolveMintedAssetsFast>[0]> = {}) => ({
  mintedCount: 2,
  assets,
  canonicalHashHexByAssetId: {},
  readTokenIds: async () => ['3082', '3086'] as Array<string | null>,
  readTokenHash: async (id: string) => (id === '3082' ? h('b') : h('a')),
  ...over
});

describe('resolveMintedAssetsFast', () => {
  it('maps minted tokens to files by final hash, without touching unminted files', async () => {
    const readTokenHash = vi.fn(base().readTokenHash);
    const result = await resolveMintedAssetsFast(base({ readTokenHash }));
    expect(result).toEqual({ status: 'ok', mintedTokenIds: { a2: '3082', a1: '3086' } });
    expect(readTokenHash).toHaveBeenCalledTimes(2);
  });

  it('is an immediate ok when nothing is minted', async () => {
    const readTokenIds = vi.fn();
    expect(await resolveMintedAssetsFast(base({ mintedCount: 0, readTokenIds }))).toEqual({ status: 'ok', mintedTokenIds: {} });
    expect(readTokenIds).not.toHaveBeenCalled();
  });

  it('prefers the verified canonical hash over the staged one', async () => {
    const index = buildAssetHashIndex(assets, { a1: h('d') });
    expect(index.get(h('d'))).toBe('a1');
    expect(index.get(h('a'))).toBe('a1');
    expect(index.get(h('b'))).toBe('a2');
  });

  it('falls back (never "not minted") when the minted list or a hash cannot be read', async () => {
    expect((await resolveMintedAssetsFast(base({ readTokenIds: async () => { throw new Error('429'); } }))).status).toBe('fallback');
    expect((await resolveMintedAssetsFast(base({ readTokenIds: async () => ['3082', null] }))).status).toBe('fallback');
    expect((await resolveMintedAssetsFast(base({ readTokenIds: async () => ['3082'] }))).status).toBe('fallback');
    expect((await resolveMintedAssetsFast(base({ readTokenHash: async () => { throw new Error('boom'); } }))).status).toBe('fallback');
    expect((await resolveMintedAssetsFast(base({ mintedCount: Number.NaN }))).status).toBe('fallback');
  });

  it('falls back with the partial match when a minted token has an unknown hash', async () => {
    const result = await resolveMintedAssetsFast(base({ readTokenHash: async (id) => (id === '3082' ? h('b') : h('f')) }));
    expect(result).toEqual({ status: 'fallback', reason: expect.any(String), mintedTokenIds: { a2: '3082' } });
  });

  it('falls back when two tokens claim the same file', async () => {
    expect((await resolveMintedAssetsFast(base({ readTokenHash: async () => h('a') }))).status).toBe('fallback');
  });
});

describe('runWithConcurrency', () => {
  it('never exceeds the limit and runs everything', async () => {
    let active = 0;
    let peak = 0;
    const seen: number[] = [];
    await runWithConcurrency([1, 2, 3, 4, 5, 6, 7], 3, async (n) => {
      active += 1;
      peak = Math.max(peak, active);
      await new Promise((r) => setTimeout(r, 2));
      seen.push(n);
      active -= 1;
    });
    expect(peak).toBeLessThanOrEqual(3);
    expect(seen.sort()).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it('rejects when a worker fails', async () => {
    await expect(runWithConcurrency([1, 2], 2, async (n) => { if (n === 2) throw new Error('bad'); })).rejects.toThrow('bad');
  });
});
