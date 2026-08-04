// Name resolution is cosmetic, so the thing to defend is that it can never
// break or slow the board: it must not throw, must not re-ask forever, and must
// leave the position alone whatever the API does.

import { describe, expect, it, vi } from 'vitest';
import { NameResolver, StaticNames, looksLikePrincipal } from '../src/bns.js';
import { displaySender } from '../src/board-ui.js';

const ALICE = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const BOB = 'SP15T1W26JTNS26VG17HM468KW7TQD3124KTYA9EJ';

function stubFetch(map) {
  return vi.fn(async (url) => {
    const principal = decodeURIComponent(String(url).split('/').pop());
    if (!(principal in map)) return { ok: false, status: 404 };
    return { ok: true, json: async () => ({ names: map[principal] }) };
  });
}

describe('looksLikePrincipal', () => {
  it('accepts real principals', () => {
    expect(looksLikePrincipal(ALICE)).toBe(true);
    expect(looksLikePrincipal(BOB)).toBe(true);
  });

  it('rejects simulation senders and junk', () => {
    for (const value of ['YOU', 'GRIEFER', 'SIM-WHITE', '', null, undefined, 42, 'SP']) {
      expect(looksLikePrincipal(value)).toBe(false);
    }
  });
});

describe('NameResolver', () => {
  it('resolves a name and caches it', async () => {
    const fetch = stubFetch({ [ALICE]: ['alice.btc'] });
    const resolver = new NameResolver({ apiUrl: 'https://api', fetch });

    expect(await resolver.resolve([ALICE])).toBe(true);
    expect(resolver.get(ALICE)).toBe('alice.btc');

    // Asking again does not hit the API.
    expect(await resolver.resolve([ALICE])).toBe(false);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('caches an absent name so it does not re-ask on every poll', async () => {
    const fetch = stubFetch({ [ALICE]: [] });
    const resolver = new NameResolver({ apiUrl: 'https://api', fetch });

    await resolver.resolve([ALICE]);
    await resolver.resolve([ALICE]);
    await resolver.resolve([ALICE]);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(resolver.known(ALICE)).toBe(true);
    expect(resolver.get(ALICE)).toBe(null);
  });

  it('never asks about simulation senders', async () => {
    const fetch = stubFetch({});
    const resolver = new NameResolver({ apiUrl: 'https://api', fetch });

    expect(await resolver.resolve(['YOU', 'GRIEFER', 'SIM-WHITE', 'BOT-WHITE'])).toBe(false);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('survives the API failing', async () => {
    const resolver = new NameResolver({
      apiUrl: 'https://api',
      fetch: vi.fn(async () => {
        throw new Error('network down');
      })
    });

    await expect(resolver.resolve([ALICE, BOB])).resolves.toBe(false);
    expect(resolver.get(ALICE)).toBe(null);
  });

  it('survives a malformed response', async () => {
    const resolver = new NameResolver({
      apiUrl: 'https://api',
      fetch: vi.fn(async () => ({ ok: true, json: async () => ({ names: 'not an array' }) }))
    });

    await expect(resolver.resolve([ALICE])).resolves.toBe(false);
    expect(resolver.get(ALICE)).toBe(null);
  });

  it('deduplicates a log where one address played many moves', async () => {
    const fetch = stubFetch({ [ALICE]: ['alice.btc'] });
    const resolver = new NameResolver({ apiUrl: 'https://api', fetch });

    await resolver.resolve(Array.from({ length: 40 }, () => ALICE));
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('resolves a mixed batch', async () => {
    const fetch = stubFetch({ [ALICE]: ['alice.btc'], [BOB]: [] });
    const resolver = new NameResolver({ apiUrl: 'https://api', fetch });

    await resolver.resolve([ALICE, BOB, 'GRIEFER']);
    expect(resolver.get(ALICE)).toBe('alice.btc');
    expect(resolver.get(BOB)).toBe(null);
    expect(resolver.known('GRIEFER')).toBe(false);
  });
});

describe('StaticNames', () => {
  // A sealed game carries its names, because it can never look one up again.
  it('serves names from an embedded object', () => {
    const names = new StaticNames({ [ALICE]: 'alice.btc' });
    expect(names.get(ALICE)).toBe('alice.btc');
    expect(names.known(ALICE)).toBe(true);
    expect(names.get(BOB)).toBe(undefined);
  });

  it('accepts a Map as well', () => {
    expect(new StaticNames(new Map([[BOB, 'bob.btc']])).get(BOB)).toBe('bob.btc');
  });

  it('copes with nothing embedded', () => {
    expect(new StaticNames().get(ALICE)).toBe(undefined);
    expect(new StaticNames(undefined).known(ALICE)).toBe(false);
  });

  it('drives displaySender the same way a resolver does', () => {
    const names = new StaticNames({ [ALICE]: 'alice.btc' });
    expect(displaySender(ALICE, names).label).toBe('alice.btc');
    expect(displaySender(BOB, names).named).toBe(false);
  });
});

describe('displaySender', () => {
  it('prefers a name, and keeps the principal in the tooltip', async () => {
    const resolver = new NameResolver({
      apiUrl: 'https://api',
      fetch: stubFetch({ [ALICE]: ['alice.btc'] })
    });
    await resolver.resolve([ALICE]);

    expect(displaySender(ALICE, resolver)).toEqual({
      label: 'alice.btc',
      title: `alice.btc · ${ALICE}`,
      named: true
    });
  });

  it('shortens the principal when there is no name', () => {
    const shown = displaySender(ALICE, null);
    expect(shown.named).toBe(false);
    expect(shown.label).toBe('SP3JN…743X');
    expect(shown.title).toBe(ALICE);
  });

  it('leaves short simulation senders alone', () => {
    expect(displaySender('GRIEFER', null).label).toBe('GRIEFER');
  });

  it('handles a missing sender', () => {
    expect(displaySender(null, null)).toEqual({ label: '', title: '', named: false });
  });
});
