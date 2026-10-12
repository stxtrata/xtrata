import { afterEach, expect, it, vi } from 'vitest';
import { bytesToHex } from '@noble/hashes/utils';
import { serializeCV, responseOkCV, someCV, uintCV, tupleCV, bufferCV, standardPrincipalCV } from '@stacks/transactions';
import { royaltyChainFetch } from '../audionaut-royalty-chain';
import { catalogue, CORE, readRoyaltySnapshot, fetchPaymentTransaction } from '../audionaut-royalties';
import { __testing } from '../hiro-proxy';

afterEach(() => { vi.unstubAllGlobals(); __testing.resetHiroProxyRuntimeState(); });
const env = { HIRO_API_KEY_1: 'test-throttled', HIRO_API_KEY_2: 'test-healthy' };
const hash = '0x' + 'b'.repeat(64), address = CORE.split('.')[0];
it('recovers the actual mint, receiving-owner and receipt reads after the first key is throttled', async () => {
  const keys: string[] = [], tips: string[] = [];
  vi.stubGlobal('fetch', vi.fn(async (input, init) => {
    const url = new URL(String(input)), headers = new Headers(init.headers);
    keys.push(headers.get('x-api-key')!);
    if (keys.at(-1) === 'test-throttled') return new Response('busy', { status: 429 });
    if (url.pathname === '/v2/info') return Response.json({ stacks_tip_height: 126 });
    if (url.pathname.includes('/block/by_height/')) return Response.json({ height: 120, canonical: true, index_block_hash: hash });
    if (url.pathname.includes('/tx/')) return Response.json({ tx_id: 'test-receipt' });
    tips.push(url.searchParams.get('tip')!);
    const body = JSON.parse(new TextDecoder().decode(init.body));
    expect(body.sender).toMatch(/^SP/); expect(body.arguments).toBeInstanceOf(Array);
    const name = url.pathname.split('/').at(-1);
    const value = name === 'get-minted-index-count' ? responseOkCV(uintCV(1))
      : name === 'get-minted-id' ? someCV(tupleCV({ 'token-id': uintCV(3100) }))
      : name === 'get-token-mint-context' ? someCV(tupleCV({ 'minted-at': uintCV(100) }))
      : name === 'get-owner' ? responseOkCV(someCV(standardPrincipalCV(address)))
      : someCV(bufferCV(new TextEncoder().encode(`<script src="/i/3060?contractId=${CORE}" data-edition="1" data-seed="${catalogue.editions[0].seed}"></script>`)));
    return Response.json({ okay: true, result: '0x' + bytesToHex(serializeCV(value)) });
  }));
  const live = await readRoyaltySnapshot(env);
  expect(live.minted).toHaveLength(1); expect(live.artists.every(a => a.address === address && !a.error)).toBe(true);
  expect(tips.every(tip => tip === hash.slice(2))).toBe(true);
  expect(await fetchPaymentTransaction(env, 'a'.repeat(64))).toEqual({ tx_id: 'test-receipt' });
  expect(keys.filter(key => key === 'test-throttled')).toHaveLength(1);
  expect(keys.slice(1).every(key => key === 'test-healthy')).toBe(true);
});
it('bounds a fully throttled request to the available keys', async () => {
  const fetcher = vi.fn(async () => new Response('busy', { status: 429 })); vi.stubGlobal('fetch', fetcher);
  expect((await royaltyChainFetch(env)('https://api.mainnet.hiro.so/v2/info')).status).toBe(429);
  expect(fetcher).toHaveBeenCalledTimes(2);
});
it('preserves the deadline across failover and stops when aborted', async () => {
  const controller = new AbortController();
  const fetcher = vi.fn(async (_url, init) => {
    expect(init.signal).toBeInstanceOf(AbortSignal); controller.abort(); throw Error('aborted');
  }); vi.stubGlobal('fetch', fetcher);
  expect((await royaltyChainFetch(env)('https://api.mainnet.hiro.so/v2/info', { signal: controller.signal })).status).toBe(502);
  expect(fetcher).toHaveBeenCalledTimes(1);
});
it('uses the first-party service without forwarding caller credentials when no keys are bound', async () => {
  const fetcher = vi.fn(async (request: Request) => {
    expect(request.url).toBe('https://xtrata.xyz/hiro/mainnet/v2/contracts/call-read/example?tip=abc');
    expect(request.method).toBe('POST'); expect(await request.text()).toBe('{"arguments":[]}');
    expect(request.headers.has('x-api-key')).toBe(false); expect(request.headers.has('x-hiro-api-key')).toBe(false);
    return Response.json({ okay: true });
  }); vi.stubGlobal('fetch', fetcher);
  await royaltyChainFetch({})('https://api.hiro.so/v2/contracts/call-read/example?tip=abc', {
    method: 'POST', headers: { 'x-api-key': 'caller', 'x-hiro-api-key': 'caller' }, body: '{"arguments":[]}' });
  await expect(royaltyChainFetch({})('https://example.com/v2/info')).rejects.toThrow('Unexpected');
  expect(fetcher).toHaveBeenCalledTimes(1);
});

it('binds real transaction block_hash to the canonical index hash before verifying a receipt', async () => {
  const physical = '0x' + 'c'.repeat(64), fetcher = vi.fn(async (input: any) => String(input).includes('/tx/')
    ? Response.json({ tx_id: '0x' + 'a'.repeat(64), tx_status: 'success', canonical: true, block_height: 120, block_hash: physical })
    : Response.json({ canonical: true, height: 120, hash: physical, index_block_hash: hash }));
  expect((await fetchPaymentTransaction({}, 'a'.repeat(64), fetcher)).index_block_hash).toBe(hash);
  fetcher.mockImplementation(async (input: any) => String(input).includes('/tx/')
    ? Response.json({ tx_status: 'success', canonical: true, block_height: 120, block_hash: physical })
    : Response.json({ canonical: true, height: 120, hash: '0x' + 'd'.repeat(64), index_block_hash: hash }));
  await expect(fetchPaymentTransaction({}, 'a'.repeat(64), fetcher)).rejects.toThrow('changed');
});
