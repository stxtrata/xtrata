// Finding the picture an address chose, and refusing the ones it did not.

import { describe, expect, it } from 'vitest';
import { PlayerPictures } from '../../packages/chain/pictures.js';
import { buildPfp } from '../../packages/protocol/pfp.js';
import type { InscriptionMeta } from '../../packages/protocol/pfp.js';
import type { Endpoint } from '../../packages/chain/endpoint.js';
import type { XtrataReader } from '../../packages/chain/xtrata.js';

const ALICE = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const BOB = 'SP4ERAJ8SN0J7V3DWZNKBWM7HGWCFV9A3HH62S2S';

/** Holdings, newest first, as the API returns them: a uint Clarity value. */
function holdings(ids: number[], options: { fail?: boolean } = {}): Endpoint {
  return {
    async request() {
      if (options.fail) return { ok: false, status: 429, json: async () => ({}) } as Response;
      return {
        ok: true,
        status: 200,
        json: async () => ({
          results: ids.map((id) => ({ value: { hex: `0x01${id.toString(16).padStart(32, '0')}` } }))
        })
      } as Response;
    }
  } as unknown as Endpoint;
}

const picture = (over: Partial<InscriptionMeta> = {}): InscriptionMeta => ({
  creator: ALICE, owner: ALICE, mime: 'image/webp', size: 4096, chunks: 1, sealed: true, ...over
});

/** A reader over fixed inscriptions. Counts what was asked for. */
function reader(rows: Record<number, { text?: string; creator?: string; meta?: InscriptionMeta }>) {
  const asked: string[] = [];
  return {
    asked,
    reader: {
      async text(id: number) {
        asked.push(`text:${id}`);
        return rows[id]?.text ?? null;
      },
      async creator(id: number) {
        asked.push(`creator:${id}`);
        return rows[id]?.creator ?? null;
      },
      async meta(id: number) {
        asked.push(`meta:${id}`);
        return rows[id]?.meta ?? null;
      }
    } as unknown as XtrataReader
  };
}

describe('the picture an address chose', () => {
  it('finds one the address inscribed about itself', async () => {
    const { reader: r } = reader({
      9: { text: buildPfp(ALICE, 3002), creator: ALICE },
      3002: { meta: picture() }
    });
    const found = await new PlayerPictures({ endpoint: holdings([9]), reader: r }).resolve(ALICE);
    expect(found).toEqual({ image: 3002, manifest: 9 });
  });

  it('refuses a manifest somebody else inscribed', async () => {
    // The whole security of it. A document naming you that you did not make is
    // a stranger's assertion, and holding it proves nothing — it transfers.
    const { reader: r } = reader({
      9: { text: buildPfp(ALICE, 3002), creator: BOB },
      3002: { meta: picture() }
    });
    expect(await new PlayerPictures({ endpoint: holdings([9]), reader: r }).resolve(ALICE)).toBeNull();
  });

  it('refuses a manifest that is about a different address', async () => {
    const { reader: r } = reader({ 9: { text: buildPfp(BOB, 3002), creator: BOB } });
    expect(await new PlayerPictures({ endpoint: holdings([9]), reader: r }).resolve(ALICE)).toBeNull();
  });

  it('stops showing a picture the wallet has sold', async () => {
    // Attestation is permanent and holding is not. The manifest still says what
    // it said; the picture is simply no longer theirs to show.
    const { reader: r } = reader({
      9: { text: buildPfp(ALICE, 3002), creator: ALICE },
      3002: { meta: picture({ owner: BOB }) }
    });
    expect(await new PlayerPictures({ endpoint: holdings([9]), reader: r }).resolve(ALICE)).toBeNull();
  });

  it('takes the newest manifest, since holdings come back newest first', async () => {
    const { reader: r } = reader({
      20: { text: buildPfp(ALICE, 2827), creator: ALICE },
      9: { text: buildPfp(ALICE, 3002), creator: ALICE },
      2827: { meta: picture() },
      3002: { meta: picture() }
    });
    const found = await new PlayerPictures({ endpoint: holdings([20, 9]), reader: r }).resolve(ALICE);
    expect(found?.image).toBe(2827);
  });

  it('skips a holding that is not a picture manifest at all', async () => {
    const { reader: r } = reader({
      7: { text: 'X-CHESS-PLAYER/1\naddress: x\nname: y\n', creator: ALICE },
      9: { text: buildPfp(ALICE, 3002), creator: ALICE },
      3002: { meta: picture() }
    });
    const found = await new PlayerPictures({ endpoint: holdings([7, 9]), reader: r }).resolve(ALICE);
    expect(found?.image).toBe(3002);
  });

  it('does not remember a failed lookup as an absence', async () => {
    // The PlayerNames lesson. One rate limit must not make somebody pictureless
    // for the rest of the session.
    const { reader: r } = reader({});
    const pictures = new PlayerPictures({ endpoint: holdings([], { fail: true }), reader: r });
    expect(await pictures.resolve(ALICE)).toBeNull();
    expect(pictures.known(ALICE), 'nothing may be cached').toBeUndefined();
  });

  it('asks once for an address however many rows want it', async () => {
    const { reader: r, asked } = reader({
      9: { text: buildPfp(ALICE, 3002), creator: ALICE },
      3002: { meta: picture() }
    });
    const pictures = new PlayerPictures({ endpoint: holdings([9]), reader: r });
    await Promise.all([pictures.resolve(ALICE), pictures.resolve(ALICE), pictures.resolve(ALICE)]);
    expect(asked.filter((a) => a === 'text:9').length).toBe(1);
  });
});

describe('what a wallet can choose from', () => {
  it('offers only what the canvas would agree to show', async () => {
    // The picker cannot list something the canvas then refuses, because both
    // ask `pictureProblem`.
    const { reader: r } = reader({
      1: { meta: picture() },
      2: { meta: picture({ mime: 'text/plain' }) },
      3: { meta: picture({ owner: BOB }) },
      4: { meta: picture({ mime: 'image/png' }) }
    });
    const found = await new PlayerPictures({ endpoint: holdings([1, 2, 3, 4]), reader: r }).holdings(ALICE);
    expect(found.map((f) => f.id)).toEqual([1, 4]);
    expect(found[1].mime).toBe('image/png');
  });

  it('fetches no content to build the list', async () => {
    // One meta read each and nothing else. A grid that fetched every candidate
    // would be megabytes to draw some 64-pixel squares.
    const { reader: r, asked } = reader({ 1: { meta: picture() } });
    await new PlayerPictures({ endpoint: holdings([1]), reader: r }).holdings(ALICE);
    expect(asked).toEqual(['meta:1']);
  });
});
