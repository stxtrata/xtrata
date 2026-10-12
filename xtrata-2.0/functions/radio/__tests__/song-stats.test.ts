import { describe, expect, it, vi } from 'vitest';
import { onRequest, songStats } from '../song-stats';

const db = (plays: unknown, fail = false) => ({
  prepare: vi.fn(() => ({ bind: vi.fn(() => ({ all: async () => { if (fail) throw Error('no table'); return { results: [{ plays }] }; } })) }))
});
const deps = (total: string | Error) => ({
  chainConfig: vi.fn(async () => ({ enabled: true as const, contract: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.likes', network: 'mainnet' as const, batchLimit: 25 as const, platformFee: 0 as const })),
  chainStates: vi.fn(async (_c: string, ids: number[]) => { if (total instanceof Error) throw total; return [{ id: ids[0], liked: false, total }]; })
});

describe('one song’s on-chain counters', () => {
  it('reads the likes total from the chain and counts paid plays for the radio core', async () => {
    const env = { DB: db(7) } as any;
    expect(await songStats(env, 2972, deps('12'))).toEqual({ id: 2972, likes: 12, plays: 7 });
    expect(env.DB.prepare.mock.calls[0][0]).toMatch(/FROM music_paid_plays WHERE core=\? AND song_id=\?/);
  });

  it('reports a failed read as unknown, never as zero', async () => {
    expect(await songStats({ DB: db(0, true) } as any, 5, deps(new Error('429')))).toEqual({ id: 5, likes: null, plays: null });
    expect(await songStats({ DB: db(0) } as any, 5, deps('0'))).toEqual({ id: 5, likes: 0, plays: 0 });
  });

  it('rejects anything but a plain song number', async () => {
    for (const id of ['', 'abc', '0', '1e3', '-4', '123456789']) {
      const r = await onRequest({ request: new Request('https://radio.test/radio/song-stats?id=' + id), env: {} });
      expect(r.status).toBe(400);
    }
    expect((await onRequest({ request: new Request('https://radio.test/radio/song-stats?id=1', { method: 'POST' }), env: {} })).status).toBe(405);
  });
});
