// Turning a .btc name into the address that gets hashed into a game's rules.
//
// This is the most consequential lookup in the project. Whatever it returns is
// hashed, committed on chain, and enforced forever by every board that referees
// the game. A wrong answer does not fail loudly — it silently assigns a side to
// somebody who does not hold the name, and locks out the person who does.
//
// It got a wrong answer once. The `/v1/names/<name>` endpoint answers from the
// legacy BNS v1 index, and for jim.btc it still reports the address that held
// the name before it moved to BNS-V2. The registry is the only source that can
// be trusted here.

import { describe, expect, it, vi } from 'vitest';
import { NameResolver } from '../src/bns.js';

const REGISTRY = 'SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF';

function resolverWith(handler) {
  const calls = [];
  const resolver = new NameResolver({
    apiUrl: 'https://api.example',
    network: 'mainnet',
    fetch: async (url, init) => {
      calls.push(String(url));
      return handler(String(url), init);
    }
  });
  return { resolver, calls };
}

const ok = (result) => ({
  ok: true,
  json: async () => ({ okay: true, result })
});

describe('where the answer comes from', () => {
  it('asks the BNS-V2 registry, never the legacy names endpoint', async () => {
    const { resolver, calls } = resolverWith((url) => {
      if (url.includes('get-id-from-bns')) return ok('0x0a010000000000000000000000000000dcea');
      if (url.includes('get-owner')) {
        return ok('0x070a051641c139d4394e910afadb7ff2b32ee14b273eb518');
      }
      return { ok: false };
    });

    const address = await resolver.lookupName('jim.btc');
    expect(address).toBe('SP10W2EEM757922QTVDZZ5CSEW55JEFNN30J69TM7');

    // The specific thing that went wrong.
    expect(calls.some((url) => url.includes('/v1/names/'))).toBe(false);
    expect(calls.every((url) => url.includes(REGISTRY))).toBe(true);
  });

  it('splits the name at the first dot, so sub.name.btc keeps its namespace', async () => {
    const bodies = [];
    const { resolver } = resolverWith((url, init) => {
      bodies.push(JSON.parse(init.body));
      if (url.includes('get-id-from-bns')) return ok('0x09'); // none
      return { ok: false };
    });

    await resolver.lookupName('sub.name.btc');
    const [label, namespace] = bodies[0].arguments;
    // "sub" and "name.btc": whatever the registry makes of it, we do not
    // silently reinterpret what somebody typed.
    expect(label).toBe(`0x02${(3).toString(16).padStart(8, '0')}${Buffer.from('sub').toString('hex')}`);
    expect(namespace).toBe(
      `0x02${(8).toString(16).padStart(8, '0')}${Buffer.from('name.btc').toString('hex')}`
    );
  });
});

describe('every way it declines to answer', () => {
  // Each of these has to be null rather than a guess. A name that cannot be
  // resolved stops a game being opened, which is the correct outcome: "we could
  // not tell" and "it does not exist" mean the same thing at that moment.
  it('a name the registry does not have', async () => {
    const { resolver } = resolverWith((url) =>
      url.includes('get-id-from-bns') ? ok('0x09') : { ok: false }
    );
    expect(await resolver.lookupName('definitely-not-real.btc')).toBe(null);
  });

  it('a name whose id resolves but has no owner', async () => {
    const { resolver } = resolverWith((url) => {
      if (url.includes('get-id-from-bns')) return ok('0x0a010000000000000000000000000000dcea');
      return ok('0x070a09'); // (ok none)
    });
    expect(await resolver.lookupName('orphan.btc')).toBe(null);
  });

  it('a node that will not answer', async () => {
    const { resolver } = resolverWith(() => ({ ok: false }));
    expect(await resolver.lookupName('jim.btc')).toBe(null);
  });

  it('a node that throws', async () => {
    const { resolver } = resolverWith(() => { throw new Error('offline'); });
    expect(await resolver.lookupName('jim.btc')).toBe(null);
  });

  it('something that is not a name at all', async () => {
    const { resolver, calls } = resolverWith(() => ({ ok: false }));
    for (const value of ['', '   ', 'nodot', '.btc', 'trailing.', null, undefined]) {
      expect(await resolver.lookupName(value)).toBe(null);
    }
    // And it did not waste a request working that out.
    expect(calls).toHaveLength(0);
  });
});
