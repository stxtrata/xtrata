import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { __testing, proxyHiroRequest } from '../hiro-proxy';

// Sealed chunks (`get-chunk` → `(some buff)`) are kept in the edge cache; `none`
// and every other call-read are not.
const CORE = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X/xtrata-v3-2-3';

const edge = () => {
  const store = new Map<string, Response>();
  return {
    store,
    cache: {
      async match(request: Request) {
        const hit = store.get(request.url);
        return hit ? hit.clone() : undefined;
      },
      async put(request: Request, response: Response) {
        store.set(request.url, response.clone());
      }
    }
  };
};

const call = (fn: string, args: string[]) =>
  proxyHiroRequest({
    request: new Request(`https://xtrata.xyz/hiro/mainnet/v2/contracts/call-read/${CORE}/${fn}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', origin: 'null' },
      body: JSON.stringify({ sender: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X', arguments: args })
    }),
    env: {},
    network: 'mainnet',
    path: `v2/contracts/call-read/${CORE}/${fn}`.split('/')
  });

describe('hiro proxy: immutable chunk cache', () => {
  let fetchMock: ReturnType<typeof vi.fn>;
  let e: ReturnType<typeof edge>;

  beforeEach(() => {
    __testing.resetHiroProxyRuntimeState();
    e = edge();
    (globalThis as any).caches = { default: e.cache };
    fetchMock = vi.fn(async (_url: string, init?: RequestInit) => {
      const body = JSON.parse(String(new TextDecoder().decode(init?.body as ArrayBuffer)));
      const past = body.arguments[1] === '0x0100000000000000000000000000000099';
      return new Response(JSON.stringify({ okay: true, result: past ? '0x09' : '0x0a0200000003616263' }), {
        status: 200,
        headers: { 'content-type': 'application/json' }
      });
    });
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    delete (globalThis as any).caches;
  });

  it('serves a repeated get-chunk from the edge cache, with CORS for opaque frames', async () => {
    const args = ['0x01000000000000000000000000000c0b', '0x0100000000000000000000000000000001'];
    const first = await call('get-chunk', args);
    expect(first.status).toBe(200);
    expect(await first.json()).toEqual({ okay: true, result: '0x0a0200000003616263' });
    const second = await call('get-chunk', args);
    expect(second.headers.get('x-xtrata-proxy-cache')).toBe('edge-hit');
    expect(second.headers.get('access-control-allow-origin')).toBe('*');
    expect(await second.json()).toEqual({ okay: true, result: '0x0a0200000003616263' });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const other = await call('get-chunk', [args[0], '0x0100000000000000000000000000000002']);
    expect(other.headers.get('x-xtrata-proxy-cache')).not.toBe('edge-hit');
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('never stores none (past the last chunk or not sealed yet)', async () => {
    const args = ['0x01000000000000000000000000000c0b', '0x0100000000000000000000000000000099'];
    await call('get-chunk', args);
    await call('get-chunk', args);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(e.store.size).toBe(0);
  });

  it('leaves other call-reads to their existing policy', async () => {
    await call('get-top10', ['0x0d00000003616263', '0x0100000000000000000000000000000000']);
    await call('get-top10', ['0x0d00000003616263', '0x0100000000000000000000000000000000']);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(e.store.size).toBe(0);
  });

  it('still answers when no edge cache exists (local dev)', async () => {
    delete (globalThis as any).caches;
    const res = await call('get-chunk', ['0x01000000000000000000000000000c0b', '0x0100000000000000000000000000000001']);
    expect(res.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
