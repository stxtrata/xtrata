// One address, listed once, however many things want to know about it.
//
// A name and a picture are both found by walking what a wallet holds, and each
// resolver asked for that list on its own account. Harmless while the only
// caller was a Profile panel looking up one person on demand; fifty avoidable
// requests the moment a list wants a name AND a face for every row.

import { describe, expect, it } from 'vitest';
import { Holdings } from '../../packages/chain/holdings.js';
import { PlayerNames } from '../../packages/chain/players.js';
import { PlayerPictures } from '../../packages/chain/pictures.js';
import type { Endpoint } from '../../packages/chain/endpoint.js';

const ALICE = 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7';

/** An endpoint that counts what was asked of it. */
function counting(options: { fail?: boolean } = {}): Endpoint & { calls: string[] } {
  const calls: string[] = [];
  return {
    calls,
    async request(path: string) {
      calls.push(path);
      if (options.fail) return { ok: false, status: 429, json: async () => ({}) } as Response;
      return {
        ok: true,
        status: 200,
        json: async () => ({
          results: [
            { value: { hex: '0x01' + (3021).toString(16).padStart(32, '0') } },
            { value: { hex: '0x01' + (3020).toString(16).padStart(32, '0') } }
          ]
        })
      } as Response;
    }
  } as unknown as Endpoint & { calls: string[] };
}

/** A reader that finds nothing, so only the LISTING is under test. */
const emptyReader = {
  async meta() {
    return null;
  },
  async text() {
    return null;
  },
  async creator() {
    return null;
  }
} as never;

describe('listing what an address holds', () => {
  it('reads the ids, newest first', async () => {
    const endpoint = counting();
    expect(await new Holdings({ endpoint }).list(ALICE)).toEqual([3021, 3020]);
  });

  it('asks once however many callers want it', async () => {
    const endpoint = counting();
    const holdings = new Holdings({ endpoint });
    await Promise.all([holdings.list(ALICE), holdings.list(ALICE), holdings.list(ALICE)]);
    expect(endpoint.calls.length, 'concurrent callers share one request').toBe(1);

    await holdings.list(ALICE);
    expect(endpoint.calls.length, 'and a later one is served from the cache').toBe(1);
  });

  it('serves the name and the picture resolver from one request', async () => {
    // The whole point. Two resolvers, one wallet, one call.
    const endpoint = counting();
    const holdings = new Holdings({ endpoint });
    const names = new PlayerNames({ endpoint, reader: emptyReader, holdings });
    const pictures = new PlayerPictures({ endpoint, reader: emptyReader, holdings });

    await names.resolve(ALICE);
    await pictures.resolve(ALICE);
    expect(endpoint.calls.length).toBe(1);
  });

  it('serves the picker from that same request too', async () => {
    // It listed for itself as well, which made three requests for one wallet
    // within about a second of each other.
    const endpoint = counting();
    const holdings = new Holdings({ endpoint });
    const pictures = new PlayerPictures({ endpoint, reader: emptyReader, holdings });

    await pictures.resolve(ALICE);
    await pictures.holdings(ALICE);
    expect(endpoint.calls.length).toBe(1);
  });

  it('throws rather than reporting an empty wallet', async () => {
    // The distinction both resolvers' caches depend on. A lookup that returns
    // "nothing found" when it means "could not ask" gets remembered as an
    // absence, and one rate limit makes somebody anonymous and faceless for
    // the rest of the session.
    const holdings = new Holdings({ endpoint: counting({ fail: true }) });
    await expect(holdings.list(ALICE)).rejects.toThrow(/429/);
    expect(holdings.peek(ALICE), 'and nothing is remembered from it').toBe(undefined);
  });

  it('lists again after the wallet is told to forget', async () => {
    // The moment after inscribing, where what the address holds has just
    // changed and is precisely what somebody paid to change.
    const endpoint = counting();
    const holdings = new Holdings({ endpoint });
    await holdings.list(ALICE);
    holdings.forget(ALICE);
    await holdings.list(ALICE);
    expect(endpoint.calls.length).toBe(2);
  });

  it('still works for a caller that wires no shared index', async () => {
    // Both resolvers fall back to their own, so nothing existing had to change.
    const endpoint = counting();
    const names = new PlayerNames({ endpoint, reader: emptyReader });
    expect(await names.resolve(ALICE)).toBe(null);
    expect(endpoint.calls.length).toBe(1);
  });
});
