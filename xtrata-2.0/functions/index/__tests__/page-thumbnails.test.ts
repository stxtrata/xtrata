import { describe, expect, it, vi } from 'vitest';
import { onRequest } from '../page';

const CONTRACT = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3';

const indexRow = (token_id: number) => ({
  contract: CONTRACT,
  token_id,
  owner: 'SP1OWNER',
  creator: 'SP1CREATOR',
  final_hash: null,
  mime: 'text/html',
  total_size: 4_000_000,
  total_chunks: 300,
  sealed: 1,
  token_uri: null,
  migration_source: null
});

const makeEnv = (thumbRows: unknown[] | 'missing-table') => ({
  DB: {
    prepare: vi.fn((query: string) => {
      const all = vi.fn(async () => {
        if (query.includes('FROM inscription_thumbnails')) {
          if (thumbRows === 'missing-table') throw new Error('no such table: inscription_thumbnails');
          return { results: thumbRows };
        }
        if (query.includes('FROM inscription_index_state')) return { results: [] };
        return { results: [indexRow(1), indexRow(2), indexRow(3)] };
      });
      return { all, bind: vi.fn(() => ({ all })) };
    })
  }
});

const get = async (env: unknown) => {
  const response = await onRequest({
    request: new Request(
      `https://xtrata.xyz/index/page?primary=${encodeURIComponent(CONTRACT)}&ids=1,2,3&fresh=1`
    ),
    env: env as never
  });
  return (await response.json()) as {
    tokens: Array<{ id: number; thumb: string | null; title: string | null; artist: string | null }>;
  };
};

describe('/index/page thumbnail fields', () => {
  it('adds the thumbnail version, title and artist for each token', async () => {
    const body = await get(
      makeEnv([
        { contract_id: CONTRACT, token_id: 1, status: 'ready', etag: '9f2c1ab4d0e57718', title: 'Night Drive', artist: 'Kay' },
        { contract_id: CONTRACT, token_id: 2, status: 'none', etag: null, title: 'No Cover', artist: '' }
      ])
    );
    const byId = new Map(body.tokens.map((t) => [t.id, t]));
    expect(byId.get(1)).toMatchObject({ thumb: '9f2c1ab4d0e57718', title: 'Night Drive', artist: 'Kay' });
    // Inspected but no cover: no picture, but the tile can still show its title.
    expect(byId.get(2)).toMatchObject({ thumb: null, title: 'No Cover', artist: null });
    expect(byId.get(3)).toMatchObject({ thumb: null, title: null, artist: null });
  });

  it('still returns every token when migration 021 has not been applied', async () => {
    const body = await get(makeEnv('missing-table'));
    expect(body.tokens.map((t) => t.id)).toEqual([1, 2, 3]);
    expect(body.tokens.every((t) => t.thumb === null)).toBe(true);
  });
});
