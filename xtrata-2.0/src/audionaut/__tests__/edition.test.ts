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
