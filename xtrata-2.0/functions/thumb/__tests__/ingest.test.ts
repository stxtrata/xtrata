import { describe, expect, it, vi } from 'vitest';
import { onRequestPost } from '../[contract]/[tokenId]';

const CONTRACT = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3';
const webp = (extra = 8) => {
  const b = new Uint8Array(16 + extra);
  b.set([0x52, 0x49, 0x46, 0x46], 0);
  b.set([0x57, 0x45, 0x42, 0x50], 8);
  return b;
};

const makeEnv = (opts: { indexed?: { mime: string } | null; existing?: string | null; put?: () => Promise<void> } = {}) => {
  const runs: unknown[][] = [];
  const db = {
    prepare: (sql: string) => ({
      bind: (...args: unknown[]) => ({
        all: async () => {
          if (sql.includes('FROM inscription_index')) {
            return { results: opts.indexed === null || opts.indexed === undefined ? [] : [opts.indexed] };
          }
          return { results: opts.existing ? [{ status: opts.existing }] : [] };
        },
        run: async () => {
          runs.push(args);
          return {};
        }
      })
    })
  };
  const put = vi.fn(opts.put ?? (async () => undefined));
  return { env: { DB: db, THUMBNAILS: { put } }, put, runs };
};

const post = (env: unknown, body: Uint8Array, query = '', contract = CONTRACT, tokenId = '5') =>
  onRequestPost({
    request: new Request(`https://xtrata.xyz/thumb/${contract}/${tokenId}${query}`, { method: 'POST', body }),
    env: env as never,
    params: { contract, tokenId }
  });

describe('POST /thumb/<contract>/<tokenId>', () => {
  it('stores a small WebP for an indexed song player', async () => {
    const { env, put, runs } = makeEnv({ indexed: { mime: 'text/html' } });
    const res = await post(env, webp(), '?title=Hello%20there&artist=Me&w=256&h=256');
    expect(res.status).toBe(201);
    expect(put).toHaveBeenCalledWith(`thumbs/${CONTRACT}/5.webp`, expect.anything(), {
      httpMetadata: { contentType: 'image/webp' }
    });
    expect(runs).toHaveLength(1);
    expect(runs[0]).toEqual(
      expect.arrayContaining([CONTRACT, 5, 'Hello there', 'Me', 256])
    );
  });

  it('answers 409 so the wizard retries while the token is not indexed yet', async () => {
    const { env, put } = makeEnv({ indexed: null });
    expect((await post(env, webp())).status).toBe(409);
    expect(put).not.toHaveBeenCalled();
  });

  it('refuses tokens that are not HTML song players', async () => {
    const { env, put } = makeEnv({ indexed: { mime: 'image/png' } });
    expect((await post(env, webp())).status).toBe(422);
    expect(put).not.toHaveBeenCalled();
  });

  it('never replaces a ready thumbnail', async () => {
    const { env, put, runs } = makeEnv({ indexed: { mime: 'text/html' }, existing: 'ready' });
    const res = await post(env, webp());
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ status: 'exists' });
    expect(put).not.toHaveBeenCalled();
    expect(runs).toHaveLength(0);
  });

  it('rejects non-WebP and oversized bodies before touching anything', async () => {
    const { env, put } = makeEnv({ indexed: { mime: 'text/html' } });
    expect((await post(env, new Uint8Array(40))).status).toBe(415);
    expect((await post(env, new Uint8Array(41 * 1024))).status).toBe(413);
    expect(put).not.toHaveBeenCalled();
  });

  it('rejects bad ids and a missing bucket', async () => {
    const { env } = makeEnv({ indexed: { mime: 'text/html' } });
    expect((await post(env, webp(), '', '../x', '5')).status).toBe(400);
    expect((await post({ DB: (env as never as { DB: unknown }).DB }, webp())).status).toBe(503);
  });

  it('answers 503 when storage fails and writes no row', async () => {
    const { env, runs } = makeEnv({
      indexed: { mime: 'text/html' },
      put: async () => {
        throw new Error('r2 down');
      }
    });
    expect((await post(env, webp())).status).toBe(503);
    expect(runs).toHaveLength(0);
  });
});
