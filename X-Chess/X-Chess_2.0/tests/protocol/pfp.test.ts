// A wallet pointing at a picture, and everything that must not count as one.

import { describe, expect, it } from 'vitest';
import {
  attestedPfp,
  buildPfp,
  MAX_PICTURE_BYTES,
  parsePfp,
  PFP_HEADER,
  pictureProblem
} from '../../packages/protocol/pfp.js';
import type { InscriptionMeta } from '../../packages/protocol/pfp.js';
import { parsePlayer } from '../../packages/protocol/player.js';

const ALICE = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const BOB = 'SP4ERAJ8SN0J7V3DWZNKBWM7HGWCFV9A3HH62S2S';

const meta = (over: Partial<InscriptionMeta> = {}): InscriptionMeta => ({
  creator: ALICE,
  owner: ALICE,
  mime: 'image/webp',
  size: 4096,
  chunks: 1,
  sealed: true,
  ...over
});

describe('the picture manifest', () => {
  it('reads a whole one', () => {
    const parsed = parsePfp(buildPfp(ALICE, 3002));
    expect(parsed.ok).toBe(true);
    expect(parsed.pfp).toEqual({ address: ALICE, image: 3002 });
  });

  it('refuses a picture that is not a whole positive number', () => {
    // An inscription cannot be edited, so `image: 3002.5` would be a permanent
    // document pointing at nothing.
    for (const bad of ['3002.5', '-1', '0', 'three']) {
      expect(parsePfp(`${PFP_HEADER}\naddress: ${ALICE}\nimage: ${bad}\n`).ok, bad).toBe(false);
    }
  });

  it('names a field it does not know rather than ignoring it', () => {
    const parsed = parsePfp(`${PFP_HEADER}\naddress: ${ALICE}\nimage: 1\nsize: big\n`);
    expect(parsed.ok).toBe(false);
    expect(parsed.problems.map((p) => p.says).join(' ')).toContain('"size" is not a field');
  });

  it('counts only when the address inscribed it', () => {
    const { pfp } = parsePfp(buildPfp(ALICE, 3002));
    expect(attestedPfp(pfp, ALICE)).toBe(true);
    // Somebody else writing your name down is not you saying it.
    expect(attestedPfp(pfp, BOB)).toBe(false);
    expect(attestedPfp(pfp, null)).toBe(false);
  });
});

describe('leaving X-CHESS-PLAYER/1 alone', () => {
  it('is why this is a separate document at all', () => {
    // THE WHOLE REASON THE FORMAT EXISTS. `parsePlayer` refuses a manifest
    // containing any field it does not know, so a player manifest carrying
    // `image:` parses as null on 2988, 3008, 3009 and 3014 — and those readers
    // would not lose the picture, they would lose the NAME, permanently.
    const withImage = `X-CHESS-PLAYER/1\naddress: ${ALICE}\nname: Plumb\nimage: 3002\n`;
    const broken = parsePlayer(withImage);
    expect(broken.ok, 'an old board would refuse this outright').toBe(false);
    expect(broken.player).toBeNull();

    // And the picture living in its own document leaves the name untouched.
    const clean = parsePlayer(`X-CHESS-PLAYER/1\naddress: ${ALICE}\nname: Plumb\n`);
    expect(clean.ok).toBe(true);
    expect(clean.player?.name).toBe('Plumb');
  });
});

describe('what may be shown as a picture', () => {
  it('accepts the four raster types', () => {
    for (const mime of ['image/png', 'image/jpeg', 'image/webp', 'image/gif']) {
      expect(pictureProblem(meta({ mime }), ALICE), mime).toBeNull();
    }
  });

  it('refuses SVG, which is the one image type that carries script', () => {
    expect(pictureProblem(meta({ mime: 'image/svg+xml' }), ALICE)).toContain('not a picture');
  });

  it('refuses anything that is not an image', () => {
    for (const mime of ['text/html', 'text/javascript', 'application/octet-stream']) {
      expect(pictureProblem(meta({ mime }), ALICE), mime).toContain('not a picture');
    }
  });

  it('refuses one the wallet does not hold', () => {
    // Holding rather than creating, and this is the check that differs from a
    // name: a picture you bought is the normal case.
    expect(pictureProblem(meta({ owner: BOB }), ALICE)).toContain('held by somebody else');
    // Made by somebody else and now held here is fine, which is the point.
    expect(pictureProblem(meta({ creator: BOB, owner: ALICE }), ALICE)).toBeNull();
  });

  it('refuses one still being written', () => {
    expect(pictureProblem(meta({ sealed: false }), ALICE)).toContain('not sealed');
  });

  it('refuses one over the size limit', () => {
    expect(pictureProblem(meta({ size: MAX_PICTURE_BYTES + 1 }), ALICE)).toContain('limit');
    expect(pictureProblem(meta({ size: MAX_PICTURE_BYTES }), ALICE)).toBeNull();
  });

  it('says it cannot tell rather than guessing when the read failed', () => {
    // A failed meta read must never read as "fine". It is the same distinction
    // PlayerNames draws between a rate limit and an absence.
    expect(pictureProblem(null, ALICE)).toContain('could not be read');
  });

  it('is case-insensitive about the address, as the chain is not', () => {
    expect(pictureProblem(meta({ owner: ALICE.toLowerCase() }), ALICE)).toBeNull();
  });
});
