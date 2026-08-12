// Colour, measured, in the bytes that actually ship.
//
// Every figure the first review produced about this board's contrast was
// arithmetic on hex strings, because jsdom has no computed styles and nothing
// else looked. That arithmetic found one thing worth fixing and it was not
// subtle: --gold #d8a24a against the light square #b9a98f measures 1.006:1.
// Identical luminance. The ring showing which piece you had picked up was
// distinguishable by hue alone, and invisible to anybody who cannot make that
// separation.
//
// So the numbers live here rather than in a comment, computed from the
// declarations in dist/, and the ones that matter are asserted.
//
// This does not replace a real browser measuring resolved colours - master
// proposal 18 is that - but it catches the case that has already happened once:
// a colour changed, and nobody could tell whether it was still legible.

import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { beforeAll, describe, expect, it } from 'vitest';

const ROOT = resolve(fileURLToPath(new URL('../..', import.meta.url)));
const HTML_PATH = resolve(ROOT, 'dist/xchess.html');

let html = '';

beforeAll(() => {
  if (!existsSync(HTML_PATH)) {
    throw new Error('dist/xchess.html is missing. Run `npm run build` before this suite.');
  }
  html = readFileSync(HTML_PATH, 'utf8');
});

/** The value of a custom property, as the artefact actually ships it. */
function token(name: string): string {
  const found = html.match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{3,8})`));
  if (!found) throw new Error(`--${name} is not in the shipped stylesheet`);
  return found[1];
}

/** WCAG relative luminance. */
function luminance(hex: string): number {
  const value = hex.replace('#', '');
  const full = value.length === 3 ? [...value].map((c) => c + c).join('') : value;
  const parts = [0, 2, 4].map((at) => parseInt(full.slice(at, at + 2), 16) / 255);
  const linear = parts.map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

function ratio(a: string, b: string): number {
  const [high, low] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (high + 0.05) / (low + 0.05);
}

describe('the colours the artefact actually ships', () => {
  it('has no selector that matches nothing where motion is reduced', () => {
    // `.pc--ghost path` was in the reduced-motion block and matched NOTHING: a
    // piece is a span holding a text glyph, not an SVG. So the block was inert
    // and the pending-move trace kept pulsing for somebody who had asked their
    // device for stillness - for as long as a move sat in the mempool.
    expect(html, 'the dead reduced-motion selector is back').not.toContain('.pc--ghost path');
    const reduce = html.match(/prefers-reduced-motion:\s*reduce\)\s*\{([^}]*\}[^}]*)\}/);
    expect(reduce, 'there is no reduced-motion block at all').not.toBeNull();
    expect(reduce![1], 'the ghost is not stilled').toContain('.pc--ghost');
  });

  it('tells the two square colours apart', () => {
    // Not a WCAG text rule - squares are not text - but a board whose squares
    // are hard to separate is a board that is hard to play.
    expect(ratio(token('light'), token('dark'))).toBeGreaterThan(2.5);
  });

  it('marks the selected square with something other than hue', () => {
    // THE ONE THAT WAS BROKEN. The gold ring alone is 1.006:1 against the light
    // square, so the rule must carry a second, tonal edge. Asserting the ratio
    // would only prove gold is still gold; what matters is that the ring does
    // not rely on it.
    const gold = token('gold');
    const light = token('light');
    expect(
      ratio(gold, light),
      'gold has become legible against the light square, so this test can be simplified'
    ).toBeLessThan(1.5);

    const selected = html.match(/\.sq--selected\s*\{([^}]*)\}/);
    expect(selected, 'no .sq--selected rule ships').not.toBeNull();
    expect(
      selected![1],
      'the selected ring is gold alone, which is invisible on a light square'
    ).toMatch(/inset 0 0 0 \d+px rgba\(0, ?0, ?0/);
  });

  it('marks the last move with something other than hue too', () => {
    const last = html.match(/\.sq--last\s*\{([^}]*)\}/);
    expect(last, 'no .sq--last rule ships').not.toBeNull();
    expect(last![1], 'the last-move ring is gold alone').toMatch(/rgba\(0, ?0, ?0/);
  });

  it('keeps body text well clear of the ground it sits on', () => {
    expect(ratio(token('ink'), token('bg'))).toBeGreaterThan(7);
    // The dimmed text is the one worth watching, because it is the one somebody
    // is tempted to dim further.
    expect(ratio(token('dim'), token('bg'))).toBeGreaterThan(4.5);
  });

  it('caps the board against the viewport height, not only its column', () => {
    // width:100% with aspect-ratio:1 says nothing about height, so a phone held
    // sideways pushed the line saying whose turn it is below the fold.
    expect(html, 'the board has no height cap').toContain('78svh');
    // The overlay must be capped with it, or every pending arrow stretches off
    // its squares.
    expect(html).toMatch(/\.board,\s*\.board-wrap/);
    expect(html, 'nothing keys on viewport height').toContain('max-height: 560px');
  });

  it('gives every escape hatch a real tap target', () => {
    // These three are what stop the move lock becoming a trap, and they were
    // the smallest targets in the application because they never had the class
    // that sets a minimum height.
    for (const id of ['override-yes', 'send-anyway-yes', 'send-anyway-no']) {
      const button = html.match(new RegExp(`<button id="${id}"[^>]*>`));
      expect(button, `#${id} is not in the artefact`).not.toBeNull();
      expect(button![0], `#${id} is not a full-size tap target`).toContain('class="action');
    }
  });

  it('ships no rule pointing at an animation that does not exist', () => {
    // .live-dot referenced @keyframes breathe, which was never written, and no
    // element was ever given the class.
    const used = [...html.matchAll(/animation:\s*([a-zA-Z][\w-]*)/g)].map((m) => m[1]);
    const defined = [...html.matchAll(/@keyframes\s+([a-zA-Z][\w-]*)/g)].map((m) => m[1]);
    for (const name of used) {
      if (name === 'none') continue;
      expect(defined, `animation "${name}" is used and never defined`).toContain(name);
    }
  });
});
