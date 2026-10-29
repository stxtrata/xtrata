import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { __testing, proxyHiroRequest } from '../hiro-proxy';

// Hiro's gateway refuses POST bodies containing page markup (HTTP 403 {"message":"Forbidden"}),
// which every HTML inscription transaction has. STACKS_BROADCAST_BASE_MAINNET sends broadcasts,
// and only broadcasts, to a second provider.

const TXID = 'b'.repeat(64);
const post = (path: string, env: Record<string, string | undefined>, network = 'mainnet') =>
  proxyHiroRequest({
    request: new Request(`https://xtrata.xyz/hiro/${network}/${path}`, {
      method: 'POST',
      headers: { 'content-type': 'application/octet-stream', origin: 'https://xtrata.xyz' },
      body: new Uint8Array([1, 2, 3])
    }),
    env,
    network,
    path: path.split('/')
  });

describe('hiro proxy: secondary broadcast provider', () => {
  let fetchMock: ReturnType<typeof vi.fn>;
  beforeEach(() => {
    __testing.resetHiroProxyRuntimeState();
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
  });
  afterEach(() => vi.unstubAllGlobals());

  it('without the setting, a broadcast goes to Hiro as before', async () => {
    fetchMock.mockResolvedValue(new Response(`"${TXID}"`, { status: 200 }));
    const res = await post('v2/transactions', { HIRO_API_KEY: 'k' });
    expect(res.status).toBe(200);
    expect(String(fetchMock.mock.calls[0][0])).toBe('https://api.mainnet.hiro.so/v2/transactions');
  });

  it('with the setting, a broadcast goes to the second provider and never to Hiro', async () => {
    fetchMock.mockResolvedValue(new Response(`"${TXID}"`, { status: 200 }));
    const res = await post('v2/transactions', { HIRO_API_KEY: 'k', STACKS_BROADCAST_BASE_MAINNET: 'https://node.example/key123/' });
    expect(res.status).toBe(200);
    expect(await res.text()).toBe(`"${TXID}"`);
    expect(res.headers.get('x-xtrata-broadcast-via')).toBe('secondary');
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(String(fetchMock.mock.calls[0][0])).toBe('https://node.example/key123/v2/transactions');
    // the Hiro key is never sent to the other provider
    const sent = new Headers(fetchMock.mock.calls[0][1].headers);
    expect(sent.get('x-hiro-api-key')).toBeNull();
    expect(sent.get('x-api-key')).toBeNull();
  });

  it("passes the provider's own rejection through (a 400 is an answer, not a reason to ask Hiro)", async () => {
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ error: 'transaction rejected', reason: 'FeeTooLow' }), { status: 400 }));
    const res = await post('v2/transactions', { STACKS_BROADCAST_BASE_MAINNET: 'https://node.example' });
    expect(res.status).toBe(400);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('falls back to Hiro when the second provider is down', async () => {
    fetchMock
      .mockResolvedValueOnce(new Response('bad gateway', { status: 502 }))
      .mockResolvedValueOnce(new Response(`"${TXID}"`, { status: 200 }));
    const res = await post('v2/transactions', { HIRO_API_KEY: 'k', STACKS_BROADCAST_BASE_MAINNET: 'https://node.example' });
    expect(res.status).toBe(200);
    expect(String(fetchMock.mock.calls[1][0])).toBe('https://api.mainnet.hiro.so/v2/transactions');
  });

  it('falls back to Hiro when the second provider cannot be reached', async () => {
    fetchMock.mockRejectedValueOnce(new Error('network')).mockResolvedValueOnce(new Response(`"${TXID}"`, { status: 200 }));
    const res = await post('v2/transactions', { STACKS_BROADCAST_BASE_MAINNET: 'https://node.example' });
    expect(res.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('only broadcasts move: reads and other POSTs still go to Hiro', async () => {
    fetchMock.mockImplementation(async () => new Response('{"okay":true,"result":"0x00"}', { status: 200 }));
    await post('v2/contracts/call-read/SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X/xtrata-v3-2-3/get-owner', { STACKS_BROADCAST_BASE_MAINNET: 'https://node.example' });
    await post('v2/fees/transaction', { STACKS_BROADCAST_BASE_MAINNET: 'https://node.example' });
    for (const call of fetchMock.mock.calls) expect(String(call[0])).toContain('api.mainnet.hiro.so');
  });

  it('testnet broadcasts are untouched', async () => {
    fetchMock.mockResolvedValue(new Response(`"${TXID}"`, { status: 200 }));
    await post('v2/transactions', { STACKS_BROADCAST_BASE_MAINNET: 'https://node.example' }, 'testnet');
    expect(String(fetchMock.mock.calls[0][0])).toContain('api.testnet.hiro.so');
  });
});
