import { describe, expect, it } from 'vitest';
import { fetchEdition, parseEdition } from '../edition';

// The real shape of Audionaut 029 (Xtrata #3082), trimmed.
const SAMPLE =
  '<!doctype html><html lang="en"><meta charset="utf-8"><title>Audionaut 029</title><body><p id="boot">Loading Audionaut 029…</p>' +
  '<script defer src="/i/3060?contractId=SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3&amp;network=mainnet" data-edition="29" data-seed="3252916666"></script></body></html>';

const page = (body: string, ok = true) =>
  ({ ok, status: ok ? 200 : 404, text: async () => body }) as unknown as Response;

describe('parseEdition', () => {
  it('reads data-edition', () => expect(parseEdition(SAMPLE)).toBe(29));
  it('falls back to the title', () => expect(parseEdition('<title>Audionaut 084</title>')).toBe(84));
  it('accepts the first and last editions', () => {
    expect(parseEdition('<title>Audionaut 001</title>')).toBe(1);
    expect(parseEdition('<script data-edition="111"></script>')).toBe(111);
  });
  it('rejects anything outside 1 to 111, or not an Audionaut', () => {
    expect(parseEdition('<script data-edition="0"></script>')).toBeNull();
    expect(parseEdition('<script data-edition="112"></script>')).toBeNull();
    expect(parseEdition('<title>Something else 029</title>')).toBeNull();
    expect(parseEdition('')).toBeNull();
    expect(parseEdition(undefined)).toBeNull();
  });
});

describe('fetchEdition', () => {
  it('asks the same-origin content route for the token and returns its edition', async () => {
    const urls: string[] = [];
    const fetchImpl = (async (url: string) => {
      urls.push(String(url));
      return page(SAMPLE);
    }) as unknown as typeof fetch;
    expect(await fetchEdition(3082, { fetchImpl })).toBe(29);
    expect(urls[0]).toBe('/i/3082?contractId=SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3&network=mainnet');
  });
  it('caches by token id', async () => {
    let calls = 0;
    const fetchImpl = (async () => {
      calls += 1;
      return page(SAMPLE);
    }) as unknown as typeof fetch;
    expect(await fetchEdition(4001, { fetchImpl })).toBe(29);
    expect(await fetchEdition(4001, { fetchImpl })).toBe(29);
    expect(calls).toBe(1);
  });
  it('returns null on a failed or odd response, and never throws', async () => {
    expect(await fetchEdition(4002, { fetchImpl: (async () => page('nope', false)) as unknown as typeof fetch })).toBeNull();
    expect(await fetchEdition(4003, { fetchImpl: (async () => page('<p>no edition</p>')) as unknown as typeof fetch })).toBeNull();
    expect(
      await fetchEdition(4004, {
        fetchImpl: (async () => {
          throw new Error('offline');
        }) as unknown as typeof fetch
      })
    ).toBeNull();
  });
});

import { lowestHeldAudionaut } from '../edition';
import { COLLECTION_CONTRACT_ID } from '../core';

describe('lowestHeldAudionaut', () => {
  const ADDR = 'SP10W2EEM757922QTVDZZ5CSEW55JEFNN30J69TM7';
  // wallet holds Xtrata ids 10 (not an Audionaut), 3100 (#84) and 3082 (#29)
  const editions: Record<number, string> = { 3100: '<title>Audionaut 084</title>', 3082: '<title>Audionaut 029</title>' };
  const fetchImpl = (async (url: string, init?: RequestInit) => {
    const u = String(url);
    if (u.includes('/nft/holdings')) {
      const mk = (id: number) => ({ value: { repr: `u${id}` } });
      return { ok: true, json: async () => ({ total: 3, results: [mk(10), mk(3100), mk(3082)] }) } as unknown as Response;
    }
    if (u.includes('get-token-mint-context')) {
      const id = Number(BigInt('0x' + JSON.parse(String(init?.body)).arguments[0].slice(4)));
      return { ok: true, json: async () => ({ okay: true, result: id in editions ? '0x0a00' : '0x09' }) } as unknown as Response;
    }
    const m = /\/i\/(\d+)/.exec(u);
    return page(editions[Number(m?.[1])] ?? '', true);
  }) as unknown as typeof fetch;

  it('returns the lowest edition number, not the lowest token id or the first found', async () => {
    expect(COLLECTION_CONTRACT_ID).toContain('audionauts');
    expect(await lowestHeldAudionaut(ADDR, { fetchImpl })).toEqual({ tokenId: 3082, edition: 29 });
  });
  it('returns null when nothing is held or lookups fail', async () => {
    const failing = (async () => ({ ok: false, status: 500 })) as unknown as typeof fetch;
    expect(await lowestHeldAudionaut(ADDR, { fetchImpl: failing })).toBeNull();
  });
});
