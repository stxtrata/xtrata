import { afterEach, describe, expect, it, vi } from 'vitest';
import { cvToHex, uintCV } from '@stacks/transactions';
import { readMapUint } from '../hiro';

const HELPER = 'SP2P8BYKPPREPTW7N4CZ4ZHP1VTHKCJGXECRAKA4C.btc-monkeys-fakfun-x';

const answer = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' }
  });

const stubFetch = (response: Response | Error) => {
  const fetchMock = vi.fn(async () => {
    if (response instanceof Error) throw response;
    return response.clone();
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
};

const read = (key: bigint | number = 5123) =>
  readMapUint({ contractId: HELPER, mapName: 'BoundTwins', key, network: 'mainnet' });

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('readMapUint', () => {
  it('POSTs the hex-encoded uint key to the map_entry endpoint', async () => {
    const fetchMock = stubFetch(answer({ data: '0x09' }));
    await read(5123);
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toMatch(
      /\/v2\/map_entry\/SP2P8BYKPPREPTW7N4CZ4ZHP1VTHKCJGXECRAKA4C\/btc-monkeys-fakfun-x\/BoundTwins\?proof=0$/
    );
    expect(init.method).toBe('POST');
    expect(JSON.parse(String(init.body))).toBe(cvToHex(uintCV(5123)));
  });

  it('decodes (some uN) to the value - live reply for Xtrata #5123 is Monkey #1296', async () => {
    stubFetch(answer({ data: '0x0a0100000000000000000000000000000510' }));
    expect(await read(5123)).toEqual({ ok: true, value: 1296n });
  });

  it('reports "none" as an answer, distinct from a failure', async () => {
    stubFetch(answer({ data: '0x09' }));
    expect(await read(3117)).toEqual({ ok: true, value: null });
  });

  it('reports a failed request as not-ok, never as "none"', async () => {
    stubFetch(answer({ error: 'rate limited' }, 429));
    expect(await read()).toEqual({ ok: false, value: null });
    stubFetch(new Error('network down'));
    expect(await read()).toEqual({ ok: false, value: null });
  });

  it('reports an unexpected reply shape as not-ok', async () => {
    stubFetch(answer({ nope: true }));
    expect(await read()).toEqual({ ok: false, value: null });
    // A map whose values are not uints is not something this reader can answer.
    stubFetch(answer({ data: '0x0a03' }));
    expect(await read()).toEqual({ ok: false, value: null });
  });
});
