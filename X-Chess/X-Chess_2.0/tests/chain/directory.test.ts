// Finding tournaments without being told where to look.

import { beforeEach, describe, expect, it } from 'vitest';
import { ManifestDirectory } from '../../packages/chain/directory.js';
import { parseTournament } from '../../packages/protocol/tournament.js';
import type { Tournament } from '../../packages/protocol/tournament.js';
import type { Endpoint } from '../../packages/chain/endpoint.js';
import type { XtrataReader } from '../../packages/chain/xtrata.js';

const DIRECTOR = 'SP4ERAJ8SN0J7V3DWZNKBWM7HGWCFV9A3HH62S2S';

/**
 * The tournament configuration of the generic directory.
 *
 * Written out here rather than imported because it is the thing under test: a
 * directory is a wallet plus what to look for, and the profiles one differs
 * only in those two arguments.
 */
type Args = { endpoint: Endpoint; reader: XtrataReader; address: string; maxCandidates?: number };
const asTournaments = (o: Args): ManifestDirectory<Tournament> =>
  new ManifestDirectory<Tournament>({
    endpoint: o.endpoint,
    reader: o.reader,
    address: o.address,
    maxCandidates: o.maxCandidates,
    kind: 'tournament',
    parse: (text) => {
      const parsed = parseTournament(text);
      return parsed.ok ? parsed.tournament! : null;
    }
  });
const STRANGER = 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7';

const manifest = (name: string): string =>
  `X-CHESS-TOURNAMENT/1\n${JSON.stringify({
    name,
    format: 'round-robin',
    contract: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xchess-core-v1-canary',
    engine: 2991,
    entrants: [
      { name: 'Ann', address: 'SP2Z5RE2TDDAE9VGSNQB4DKG5KKZPVP720Z0MV4BB' },
      { name: 'Bo', address: 'SP290YBDWN08X61HRZ3GAEA0YES001DJ6YX51HYKN' }
    ],
    games: [{ id: 1, white: 'Ann', black: 'Bo', round: 1 }]
  })}\n`;

/** Holdings as the API returns them: a serialised uint per row. */
function holding(ids: number[], options: { fail?: boolean } = {}): Endpoint & { calls: number } {
  const box = {
    calls: 0,
    async request() {
      box.calls++;
      if (options.fail) return { ok: false, status: 429, json: async () => ({}) } as Response;
      return {
        ok: true,
        status: 200,
        json: async () => ({
          results: ids.map((id) => ({ value: { hex: `0x01${id.toString(16).padStart(32, '0')}` } }))
        })
      } as Response;
    }
  };
  return box as unknown as Endpoint & { calls: number };
}

function reading(
  texts: Record<number, string | null>,
  creators: Record<number, string> = {}
): XtrataReader & { reads: number[] } {
  const reads: number[] = [];
  return {
    reads,
    async text(id: number) {
      reads.push(id);
      return texts[id] ?? null;
    },
    async creator(id: number) {
      return creators[id] ?? DIRECTOR;
    }
  } as unknown as XtrataReader & { reads: number[] };
}

function fakeStorage(): Storage {
  const map = new Map<string, string>();
  return {
    get length() {
      return map.size;
    },
    clear: () => map.clear(),
    getItem: (k: string) => map.get(k) ?? null,
    key: (i: number) => [...map.keys()][i] ?? null,
    removeItem: (k: string) => void map.delete(k),
    setItem: (k: string, v: string) => void map.set(k, v)
  } as Storage;
}

beforeEach(() => {
  (globalThis as unknown as Record<string, unknown>).localStorage = fakeStorage();
});

describe('finding tournaments in an organiser’s wallet', () => {
  it('lists them newest first without being given a number', async () => {
    const index = asTournaments({
      endpoint: holding([2993, 3001]),
      reader: reading({ 2993: manifest('One'), 3001: manifest('Two') }),
      address: DIRECTOR
    });
    const found = await index.list();
    expect(found.map((f: { id: number }) => f.id)).toEqual([3001, 2993]);
    expect(found.map((f: { manifest: Tournament }) => f.manifest.name)).toEqual(['Two', 'One']);
  });

  it('ignores the organiser’s other inscriptions', async () => {
    // Most of what a director holds is not a tournament: character sheets, an
    // engine, an identity. They must not become empty rows.
    const index = asTournaments({
      endpoint: holding([2991, 2993, 2995]),
      reader: reading({ 2991: 'function rankMoves(){}', 2993: manifest('One'), 2995: 'name: Plumb' }),
      address: DIRECTOR
    });
    expect((await index.list()).map((f: { id: number }) => f.id)).toEqual([2993]);
  });

  it('marks a manifest somebody else minted as unofficial', async () => {
    // ANYBODY MAY SEND AN NFT TO ANY ADDRESS. So a document in the director's
    // wallet is a claim, and only the mint says who made it.
    const index = asTournaments({
      endpoint: holding([3001, 3002]),
      reader: reading(
        { 3001: manifest('Mine'), 3002: manifest('Planted') },
        { 3001: DIRECTOR, 3002: STRANGER }
      ),
      address: DIRECTOR
    });
    const found = await index.list();
    expect(found.find((f: { id: number }) => f.id === 3001)!.official).toBe(true);
    expect(found.find((f: { id: number }) => f.id === 3002)!.official).toBe(false);
    // Still listed. Being planted is not the same as being invalid — the
    // pairings are checked against the chain either way.
    expect(found).toHaveLength(2);
  });

  it('reads each inscription once, ever', async () => {
    // An inscription is immutable, so a second read can only return what the
    // first did. Without the cache this is a read per candidate per visit.
    const endpoint = holding([2993, 2995]);
    const reader = reading({ 2993: manifest('One'), 2995: 'not a manifest' });
    const opts = { endpoint, reader, address: DIRECTOR };

    await asTournaments(opts).list();
    // Newest first, which is the order candidates come back in.
    expect(reader.reads).toEqual([2995, 2993]);

    await asTournaments(opts).list();
    expect(reader.reads, 'nothing re-read on the second visit').toEqual([2995, 2993]);
    expect(endpoint.calls, 'but holdings is asked again, being the part that changes').toBe(2);
  });

  it('throws when it cannot ask, rather than reporting none', async () => {
    // An empty tab that looks authoritative is worse than an error. Same
    // lesson as the rate-limited balance read that became a balance of zero.
    const index = asTournaments({
      endpoint: holding([], { fail: true }),
      reader: reading({}),
      address: DIRECTOR
    });
    await expect(index.list()).rejects.toThrow(/429/);
  });
});
