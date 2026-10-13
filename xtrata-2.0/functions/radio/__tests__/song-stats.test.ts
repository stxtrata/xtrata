import { describe, expect, it, vi } from 'vitest';
import { onRequest, songStats } from '../song-stats';

describe('one song’s on-chain counters', () => {
  it('come from the shared song counts, brought up to date first', async () => {
    const counts = vi.fn(async () => ({ likes: new Map([[3567, 12]]), likesStatus: 'ready' as const, paidPlays: new Map([[3567, 41]]), paidPlaysStatus: 'ready' as const }));
    expect(await songStats({} as any, 3567, counts)).toEqual({ id: 3567, likes: 12, plays: 41 });
    expect(counts).toHaveBeenCalledWith({}, [3567], { wait: true });
  });

  it('reports a failed read as unknown, never as zero', async () => {
    const failed = vi.fn(async () => ({ likes: new Map(), likesStatus: 'unavailable' as const, paidPlays: null, paidPlaysStatus: 'unavailable' as const }));
    expect(await songStats({} as any, 5, failed)).toEqual({ id: 5, likes: null, plays: null });
    const none = vi.fn(async () => ({ likes: new Map([[5, 0]]), likesStatus: 'ready' as const, paidPlays: new Map(), paidPlaysStatus: 'ready' as const }));
    expect(await songStats({} as any, 5, none)).toEqual({ id: 5, likes: 0, plays: 0 });
  });

  it('rejects anything but a plain song number', async () => {
    for (const id of ['', 'abc', '0', '1e3', '-4', '123456789']) {
      const r = await onRequest({ request: new Request('https://radio.test/radio/song-stats?id=' + id), env: {} });
      expect(r.status).toBe(400);
    }
    expect((await onRequest({ request: new Request('https://radio.test/radio/song-stats?id=1', { method: 'POST' }), env: {} })).status).toBe(405);
  });
});
