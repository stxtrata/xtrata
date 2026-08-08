// Name resolution is cosmetic, so the thing to defend is that it can never
// break or slow the board: it must not throw, must not re-ask forever, and must
// leave the position alone whatever the API does.

import { describe, expect, it, vi } from 'vitest';
import { NameResolver, StaticNames, looksLikePrincipal } from '../src/bns.js';
import { displaySender } from '../src/board-ui.js';

const ALICE = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const BOB = 'SP15T1W26JTNS26VG17HM468KW7TQD3124KTYA9EJ';

// A Clarity (ok (some {name, namespace})) for a primary-name reply, built the
// same way the chain builds it.
function primaryReply(name) {
  const [label, namespace] = name.split('.');
  const buff = (text) => {
    const hex = [...text].map((c) => c.charCodeAt(0).toString(16).padStart(2, '0')).join('');
    return '02' + (text.length).toString(16).padStart(8, '0') + hex;
  };
  // ok -> some -> tuple{ name, namespace }, fields in alphabetical order.
  return (
    '0x07' +
    '0a' +
    '0c00000002' +
    '046e616d65' + buff(label) +
    '096e616d657370616365' + buff(namespace)
  );
}

/**
 * @param {object} map        principal -> names[] for the legacy list endpoint
 * @param {object} primaries  principal -> primary name for the BNS-V2 registry
 */
function stubFetch(map, primaries = {}) {
  return vi.fn(async (url, options) => {
    const target = String(url);

    if (target.includes('/get-primary')) {
      const sender = JSON.parse(options.body).sender;
      const name = primaries[sender];
      return {
        ok: true,
        json: async () => ({ okay: true, result: name ? primaryReply(name) : '0x070a09' })
      };
    }

    const principal = decodeURIComponent(target.split('/').pop());
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

    // Asking again does not hit the API at all.
    const calls = fetch.mock.calls.length;
    expect(await resolver.resolve([ALICE])).toBe(false);
    expect(fetch).toHaveBeenCalledTimes(calls);
  });

  it('caches an absent name so it does not re-ask on every poll', async () => {
    const fetch = stubFetch({ [ALICE]: [] });
    const resolver = new NameResolver({ apiUrl: 'https://api', fetch });

    await resolver.resolve([ALICE]);
    const calls = fetch.mock.calls.length;
    await resolver.resolve([ALICE]);
    await resolver.resolve([ALICE]);

    expect(fetch).toHaveBeenCalledTimes(calls);
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
    // One address, asked about once, however many times it appears in the log.
    const asked = fetch.mock.calls.filter((c) => String(c[0]).includes(ALICE) || String(c[1]?.body || '').includes(ALICE));
    expect(asked.length).toBeLessThanOrEqual(2);
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

describe('primary names', () => {
  // The name-list endpoint cannot say which of a wallet's names is primary, so
  // taking the first was wrong for anyone whose primary is not first. The
  // BNS-V2 registry answers the actual question, and is asked first.
  it('prefers the registry over the first name in the list', async () => {
    const fetch = stubFetch({ [ALICE]: ['aaa.btc', 'zzz.btc'] }, { [ALICE]: 'zzz.btc' });
    const resolver = new NameResolver({ apiUrl: 'https://api', fetch });

    await resolver.resolve([ALICE]);
    expect(resolver.get(ALICE)).toBe('zzz.btc');
  });

  it('asks the registry before the list', async () => {
    const fetch = stubFetch({ [ALICE]: ['aaa.btc'] }, { [ALICE]: 'primary.btc' });
    const resolver = new NameResolver({ apiUrl: 'https://api', fetch });

    await resolver.resolve([ALICE]);
    expect(String(fetch.mock.calls[0][0])).toContain('/get-primary');
  });

  it('falls back to the list when no primary is set', async () => {
    const fetch = stubFetch({ [ALICE]: ['only.btc'] }, {});
    const resolver = new NameResolver({ apiUrl: 'https://api', fetch });

    await resolver.resolve([ALICE]);
    expect(resolver.get(ALICE)).toBe('only.btc');
  });

  it('reports no name when neither has one', async () => {
    const fetch = stubFetch({ [ALICE]: [] }, {});
    const resolver = new NameResolver({ apiUrl: 'https://api', fetch });

    await resolver.resolve([ALICE]);
    expect(resolver.get(ALICE)).toBe(null);
  });

  it('survives a registry that is unreachable', async () => {
    const fetch = vi.fn(async (url) =>
      String(url).includes('/get-primary')
        ? Promise.reject(new Error('registry down'))
        : { ok: true, json: async () => ({ names: ['fallback.btc'] }) }
    );
    const resolver = new NameResolver({ apiUrl: 'https://api', fetch });

    await resolver.resolve([ALICE]);
    expect(resolver.get(ALICE)).toBe('fallback.btc');
  });
});
