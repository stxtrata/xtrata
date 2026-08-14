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

// ---------------------------------------------------------------------------
// A label that vanishes under the cursor.
//
// Reported 2026-08-13: "only the selected button loses its text while the cursor
// is hovering". `button.action:hover` sets `color: var(--gold)`, and both
// gold-BACKGROUND rules lose to it on specificity - (0,3,1) against (0,3,0) for
// a pressed filter and (0,1,1) for the primary. So hovering either painted gold
// on gold: 1:1, no text at all. "Open game" had it too; the only reason that
// went unreported is that a label you are hovering over is one you have already
// read.
//
// Same family as --gold on the light square at 1.006:1, and the same reason it
// survived: nothing measured a colour in a STATE. These do, by working out which
// rule actually wins rather than which one is written last.
// ---------------------------------------------------------------------------

/** The stylesheet with comments removed, so a comment cannot read as a selector. */
const stylesheet = (): string => html.replace(/\/\*[\s\S]*?\*\//g, ' ');

interface Rule {
  selector: string;
  body: string;
}

/** Every `selector { body }`, one entry per comma-separated selector. */
function rules(): Rule[] {
  const out: Rule[] = [];
  for (const match of stylesheet().matchAll(/([^{}@]+)\{([^{}]*)\}/g)) {
    for (const selector of match[1].split(',')) {
      const trimmed = selector.trim().replace(/\s+/g, ' ');
      if (trimmed && !trimmed.startsWith('/')) out.push({ selector: trimmed, body: match[2] });
    }
  }
  return out;
}

/**
 * How strongly a selector binds, as one comparable number.
 *
 * Sufficient for this stylesheet and not a general implementation: no rule here
 * carries an id, and every `:not()` argument is a single simple selector.
 */
function specificity(selector: string): number {
  let classes = 0;
  const rest = selector.replace(/:not\(([^)]*)\)/g, (_whole, inner: string) => {
    classes += (inner.match(/\.[\w-]+|\[[^\]]+\]|:[\w-]+/g) ?? []).length;
    return ' ';
  });
  classes += (rest.match(/\.[\w-]+|\[[^\]]+\]|:[\w-]+/g) ?? []).length;
  const elements = (rest.match(/(?:^|[\s>+~])[a-z][\w-]*/g) ?? []).length;
  return classes * 100 + elements;
}

/** `color:`, and never `border-color:` or `background-color:`. */
const textColour = (body: string): string | null =>
  /(?:^|[;{\s])color:\s*(#[0-9a-fA-F]{3,8}|var\(--[\w-]+\))/.exec(body)?.[1] ?? null;

/** The classes and attributes of a selector's last compound, quotes normalised. */
const marks = (selector: string): string[] =>
  ((selector.split(/[\s>+~]+/).pop() ?? '').match(/\.[\w-]+|\[[^\]]+\]/g) ?? []).map((mark) =>
    mark.replace(/["']/g, '"')
  );

describe('colour in a state, not only at rest', () => {
  it('measures gold on gold as the non-colour it is', () => {
    // The premise. If this stops being true the two tests below prove nothing.
    expect(ratio(token('gold'), token('gold'))).toBe(1);
  });

  it('keeps the label on every button that is painted gold', () => {
    const all = rules();
    const goldBacked = all.filter(
      (rule) => /background:\s*var\(--gold\)/.test(rule.body) && rule.selector.includes('action')
    );
    const goldText = all.filter(
      (rule) =>
        rule.selector.includes(':hover') &&
        rule.selector.includes('action') &&
        textColour(rule.body) === 'var(--gold)'
    );

    expect(goldBacked.length, 'no gold button found, so this proves nothing').toBeGreaterThan(0);
    expect(goldText.length, 'no gold-text hover rule found, so this proves nothing').toBeGreaterThan(0);

    for (const gold of goldBacked) {
      const wanted = marks(gold.selector);
      for (const painter of goldText) {
        const rescued = all.some((rule) => {
          if (!rule.selector.includes(':hover')) return false;
          const colour = textColour(rule.body);
          if (!colour || colour === 'var(--gold)') return false;
          // It must bind at least as narrowly as the gold rule it is defending,
          // and more narrowly than the rule painting over it.
          const covers = wanted.every((mark) => marks(rule.selector).includes(mark));
          return covers && specificity(rule.selector) > specificity(painter.selector);
        });

        expect(
          rescued,
          `"${painter.selector}" (${specificity(painter.selector)}) paints gold text over ` +
            `"${gold.selector}" (${specificity(gold.selector)}), and nothing more specific puts ` +
            'a readable colour back. Hovering that button shows an empty one.'
        ).toBe(true);
      }
    }
  });

  it('gives every hovered button a label that is legible against its own background', () => {
    const hovered = rules().filter(
      (rule) => rule.selector.includes(':hover') && /background:\s*#[0-9a-fA-F]{3,8}/.test(rule.body)
    );
    expect(hovered.length, 'no hovered background rule found').toBeGreaterThan(0);

    for (const rule of hovered) {
      const background = /background:\s*(#[0-9a-fA-F]{3,8})/.exec(rule.body)?.[1];
      const colour = textColour(rule.body);
      if (!background || !colour?.startsWith('#')) continue;
      expect(
        ratio(background, colour),
        `"${rule.selector}" hovers to ${colour} on ${background}`
      ).toBeGreaterThan(4.5);
    }
  });
});
