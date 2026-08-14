// The pieces are DRAWN, and these hold the reasons down.
//
// The board used Unicode chess characters, which has two consequences no amount
// of styling fixes. U+2654-2659 are OUTLINE glyphs meant for white, so white
// pieces had a transparent middle and could never be solid. And they come from
// a different set than the filled U+265A-265F used for black - a different FONT
// entirely on some systems - so the two sides disagreed about size, and within
// a set a pawn filled more of its box than a bishop and read as larger.
//
// Anyone tempted to "simplify" this back to characters will fail these.

import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { GLYPH, KEY_BY_TYPE, SCALE, SCALE_CSS } from '../../packages/ui/pieces.js';

const HTML = readFileSync('dist/xchess.html', 'utf8');

describe('the piece set', () => {
  it('has a glyph and a size for every piece type the engine can produce', () => {
    // 1-6 is pawn through king. A gap here is a piece that vanishes from the
    // board, which no test of the engine would ever catch.
    for (const type of [1, 2, 3, 4, 5, 6]) {
      const key = KEY_BY_TYPE[type];
      expect(key, `type ${type} has no key`).toBeTruthy();
      expect(GLYPH[key], `${key} has no glyph`).toBeTruthy();
      expect(SCALE[key], `${key} has no scale`).toBeGreaterThan(0);
    }
    expect(Object.keys(GLYPH)).toHaveLength(6);
  });

  it('uses the FILLED glyphs for both colours', () => {
    // The fix for solid white. Every one of these is U+265A-265F; not one is
    // from the outline block, whatever the block is nominally called.
    for (const [key, glyph] of Object.entries(GLYPH)) {
      const code = glyph.codePointAt(0) ?? 0;
      expect(code, `${key} is not from the filled block`).toBeGreaterThanOrEqual(0x265a);
      expect(code).toBeLessThanOrEqual(0x265f);
    }
  });

  it('sizes the pieces like a chess set, not like a font', () => {
    // The complaint this exists for: at one font-size a pawn reads LARGER than
    // a bishop, because a pawn fills its em box and a bishop has headroom.
    expect(SCALE.p, 'a pawn must be the smallest piece').toBeLessThan(SCALE.b);
    expect(SCALE.p).toBeLessThan(SCALE.n);
    expect(SCALE.p).toBeLessThan(SCALE.r);
    expect(SCALE.k, 'the king must be the tallest').toBeGreaterThan(SCALE.q);
    expect(SCALE.q).toBeGreaterThan(SCALE.b);
    for (const value of Object.values(SCALE)) {
      // Ratios of the square's own size, so they hold at any board size.
      expect(value).toBeGreaterThan(0.5);
      expect(value).toBeLessThan(1.3);
    }
  });

  it('generates the sizing CSS, so it cannot drift from the table', () => {
    for (const [key, value] of Object.entries(SCALE)) {
      expect(SCALE_CSS).toContain(`.pc--${key} { font-size: ${value}em; }`);
    }
  });
});

describe('the built artefact', () => {
  it('carries every piece', () => {
    // The bundler emits non-ASCII as escapes, so a filled glyph is in the file
    // as \u265F rather than as itself. Looking for the character alone finds
    // nothing and reads as a missing piece, which is a good deal more alarming
    // than it is true.
    for (const [key, glyph] of Object.entries(GLYPH)) {
      const escaped = `\\u${(glyph.codePointAt(0) ?? 0).toString(16).toUpperCase()}`;
      expect(
        HTML.includes(glyph) || HTML.includes(escaped),
        `${key} is missing from the artefact`
      ).toBe(true);
    }
  });

  it('carries the sizing, so a pawn cannot out-measure a bishop in the build', () => {
    // The CSS is generated from SCALE at runtime, so the rule text is not in
    // the bytes - the NUMBERS are, and they are what decides the sizes.
    for (const [key, value] of Object.entries(SCALE)) {
      expect(HTML, `the scale for ${key} did not survive the build`).toContain(
        String(value).replace(/^0/, '')
      );
    }
    expect(HTML).toContain('font-size: ${');
  });

  it('does NOT use the outline Unicode pieces for white', () => {
    // The specific mistake. U+2654-2659 have a transparent interior, so white
    // rendered hollow however it was coloured.
    for (const outline of ['♔', '♕', '♖', '♗', '♘', '♙']) {
      expect(HTML, `white outline glyph ${escape(outline)} is back`).not.toContain(outline);
    }
  });

  it('fills white solid', () => {
    // #fff and #ffffff are the same white, and the minifier picks. The colour
    // is the assertion; how briefly it is written is not.
    expect(HTML).toMatch(/\.pc--white\s*\{[^}]*color:\s*#(fff|ffffff)\b/i);
  });
});
