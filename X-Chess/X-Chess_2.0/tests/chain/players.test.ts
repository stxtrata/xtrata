// Finding the manifest an address wrote about itself.
//
// The lookup is a workaround for a one-way index: Xtrata knows who made an
// inscription and cannot list what an address made, so holdings — which ARE
// indexed by principal — find the candidates and the creator check decides.
//
// HOLDING FINDS IT; CREATING PROVES IT. Keeping those apart is the security of
// the whole idea, and most of these tests are about that seam.

import { describe, expect, it } from 'vitest';
import { PLAYER_HEADER } from '../../packages/protocol/player.js';
import { PlayerNames } from '../../packages/chain/players.js';
import type { Endpoint } from '../../packages/chain/endpoint.js';
import type { XtrataReader } from '../../packages/chain/xtrata.js';

const ME = 'SP4ERAJ8SN0J7V3DWZNKBWM7HGWCFV9A3HH62S2S';
const OTHER = 'SP15T1W26JTNS26VG17HM468KW7TQD3124KTYA9EJ';
const manifestFor = (address: string, name: string): string =>
  `${PLAYER_HEADER}\naddress: ${address}\nname: ${name}`;

/** A uint Clarity value as the holdings API returns it. */
const held = (id: number) => ({ value: { hex: `0x01${id.toString(16).padStart(32, '0')}` } });

function fake(options: {
  holdings?: number[];
  texts?: Record<number, string | null>;
  creators?: Record<number, string | null>;
  holdingsFail?: boolean;
}): { names: PlayerNames; reads: number[] } {
  const reads: number[] = [];
  const endpoint = {
    async request(): Promise<Response> {
      if (options.holdingsFail) return new Response('no', { status: 500 }) as unknown as Response;
      return new Response(
        JSON.stringify({ results: (options.holdings ?? []).map(held) }),
        { status: 200 }
      ) as unknown as Response;
    }
  } as unknown as Endpoint;
  const reader = {
    async text(id: number) { reads.push(id); return options.texts?.[id] ?? null; },
    async creator(id: number) { return options.creators?.[id] ?? null; }
  } as unknown as XtrataReader;
  return { names: new PlayerNames({ endpoint, reader }), reads };
}

describe('finding a name an address gave itself', () => {
  it('reads the manifest it holds and returns the name', async () => {
    const { names } = fake({
      holdings: [3001],
      texts: { 3001: manifestFor(ME, 'Jim') },
      creators: { 3001: ME }
    });
    expect(await names.resolve(ME)).toBe('Jim');
  });

  it('REFUSES a manifest somebody else inscribed, even though this address holds it', async () => {
    // The seam. An inscription is an NFT and can be transferred, so holding one
    // proves nothing — the creator is what no transfer changes. A name cannot
    // be bought, sold or gifted.
    const { names } = fake({
      holdings: [3001],
      texts: { 3001: manifestFor(ME, 'Jim') },
      creators: { 3001: OTHER }
    });
    expect(await names.resolve(ME)).toBeNull();
  });

  it('ignores a manifest about somebody else that this address happens to hold', async () => {
    const { names } = fake({
      holdings: [3001],
      texts: { 3001: manifestFor(OTHER, 'Someone') },
      creators: { 3001: ME }
    });
    expect(await names.resolve(ME)).toBeNull();
  });

  it('takes the newest, because holdings come back newest first', async () => {
    // Latest wins, the same rule tournament revisions use.
    const { names } = fake({
      holdings: [3005, 3001],
      texts: { 3005: manifestFor(ME, 'Newer'), 3001: manifestFor(ME, 'Older') },
      creators: { 3005: ME, 3001: ME }
    });
    expect(await names.resolve(ME)).toBe('Newer');
  });

  it('skips inscriptions that are not player manifests', async () => {
    // Most of what an address holds is something else — a tournament manifest,
    // an engine, a character sheet.
    const { names } = fake({
      holdings: [2993, 3001],
      texts: { 2993: 'X-CHESS-TOURNAMENT/1\n{}', 3001: manifestFor(ME, 'Jim') },
      creators: { 2993: ME, 3001: ME }
    });
    expect(await names.resolve(ME)).toBe('Jim');
  });

  it('stops once it finds one, rather than reading everything held', async () => {
    const { names, reads } = fake({
      holdings: [3005, 3004, 3003],
      texts: { 3005: manifestFor(ME, 'Jim'), 3004: manifestFor(ME, 'No'), 3003: manifestFor(ME, 'No') },
      creators: { 3005: ME, 3004: ME, 3003: ME }
    });
    await names.resolve(ME);
    expect(reads).toEqual([3005]);
  });
});

describe('what it remembers, and what it refuses to remember', () => {
  it('asks once for an address that has no name', async () => {
    // "Asked, and there is none" is a real answer worth keeping.
    const { names, reads } = fake({ holdings: [3001], texts: { 3001: null } });
    await names.resolve(ME);
    await names.resolve(ME);
    expect(reads.length).toBe(1);
    expect(names.peek(ME)).toBeNull();
  });

  it('does NOT remember a failed lookup as "no name"', async () => {
    // A rate limit must not turn into "this address is anonymous" for the rest
    // of the session. Undefined means not asked; null means asked and none.
    const { names } = fake({ holdingsFail: true });
    expect(await names.resolve(ME)).toBeNull();
    expect(names.peek(ME), 'a failure was cached as an answer').toBeUndefined();
  });

  it('says nothing is known before it is asked', () => {
    const { names } = fake({});
    expect(names.peek(ME)).toBeUndefined();
  });
});
