/**
 * Market thumbnails, and the two ways they showed the wrong picture.
 *
 * Twenty-four distinct pixel-art plates were listed and every single card
 * rendered the same three concentric circles. Two separate defects stacked:
 *
 *   1. The on-chain SVG branch was UNREACHABLE. It read
 *      `kind === 'image' && mime.includes('svg')`, but `getMediaKind` returns
 *      'svg' for image/svg+xml and 'image' only for raster types — the two are
 *      disjoint, so the condition could never be true. The page made ONE
 *      get-chunk call across twenty-five listings.
 *
 *   2. Everything therefore fell through to the `summary.svgDataUri` fallback,
 *      which on an Xtrata core is the SVG-STATIC constant: the same device for
 *      every token that exists. `get-svg-data-uri` is an existence probe, not
 *      artwork.
 *
 * The second is the more interesting failure. A missing preview is an absence
 * and reads as one. A constant rendered as art is a confident wrong answer, and
 * nothing on the page says it is wrong.
 */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

import { getMediaKind } from '../../lib/viewer/content';

const mainSource = readFileSync(new URL('../main.js', import.meta.url), 'utf8');

/** The market half of main.js, so other renderers are out of scope. */
const marketSection = (() => {
  const start = mainSource.indexOf('const MARKET_LISTINGS_PER_CONTRACT');
  const end = mainSource.indexOf('const DROPS_DISPLAY_LIMIT');
  expect(start, 'market section start marker moved').toBeGreaterThan(-1);
  expect(end, 'drops section start marker moved').toBeGreaterThan(start);
  return mainSource.slice(start, end);
})();

/**
 * Market section with comments stripped.
 *
 * The negative assertions must test what the code DOES, not the comments
 * explaining why it changed -- those legitimately quote the removed condition.
 * market-sponsored-claims.test.ts hit the same trap for the same reason.
 */
const marketCode = marketSection
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/^\s*\/\/.*$/gm, '');

describe('the premise: svg and image are disjoint kinds', () => {
  it('image/svg+xml is "svg", never "image"', () => {
    // This is the whole reason the old condition was dead code. If this ever
    // changes, the market branch below has to change with it.
    expect(getMediaKind('image/svg+xml')).toBe('svg');
    expect(getMediaKind('image/png')).toBe('image');
    expect(getMediaKind('image/webp')).toBe('image');
  });

  it('survives a mime with parameters or odd casing', () => {
    expect(getMediaKind('IMAGE/SVG+XML')).toBe('svg');
    expect(getMediaKind('image/svg+xml; charset=utf-8')).toBe('svg');
  });
});

describe('the market resolves on-chain SVG content', () => {
  it('branches on kind === "svg" and actually fetches the bytes', () => {
    expect(marketSection).toMatch(/if \(kind === 'svg' && fetchable\) \{/);
    const branch = marketSection.slice(
      marketSection.indexOf("if (kind === 'svg' && fetchable) {"),
      marketSection.indexOf("} else if (kind === 'image' && fetchable) {")
    );
    expect(branch).toContain('marketFetchContent');
    expect(branch).toContain("type: 'image/svg+xml'");
  });

  it('never reintroduces the impossible condition', () => {
    // The negative control for defect 1. `kind === 'image'` can never coexist
    // with a mime containing "svg", so this pairing is always dead code.
    expect(marketCode).not.toMatch(/kind === 'image'[^\n]*mime\.includes\('svg'\)/);
    expect(marketCode).not.toContain("mime.includes('svg')");
  });

  it('still handles raster images on their own branch', () => {
    expect(marketSection).toMatch(/\} else if \(kind === 'image' && fetchable\) \{/);
  });

  it('routes script-driven SVG to a real document rather than an <img>', () => {
    const branch = marketSection.slice(
      marketSection.indexOf("if (kind === 'svg' && fetchable) {"),
      marketSection.indexOf("} else if (kind === 'image' && fetchable) {")
    );
    expect(branch).toMatch(/<script\[\\s>\]/);
    expect(branch).toContain("kind: 'html-live'");
  });
});

describe('the core placeholder is not passed off as artwork', () => {
  it('the svgDataUri fallback is gated on the placeholder check', () => {
    expect(marketSection).toMatch(
      /if \(!media && summary\?\.svgDataUri && !isPlaceholderSvgDataUri\(summary\.svgDataUri\)\)/
    );
  });

  it('the detector exists and looks at the decoded svg', () => {
    expect(marketSection).toContain('const isPlaceholderSvgDataUri =');
    const fn = marketSection.slice(
      marketSection.indexOf('const isPlaceholderSvgDataUri ='),
      marketSection.indexOf('const MARKET_MEDIA_MAX_BYTES')
    );
    expect(fn).toContain('atob(');
    // Three independent marks, so a coincidental 50x50 viewBox is not enough.
    expect(fn).toContain("viewBox='0 0 50 50'");
    expect(fn).toContain("cx='25' cy='25' r='20'");
    expect(fn).toContain('#6366f1');
  });

  it('the detector matches the real SVG-STATIC and nothing else', async () => {
    // Rebuild the function from source rather than exporting it, so the test
    // pins the shipped implementation and not a copy that could drift.
    const fn = marketSection.slice(
      marketSection.indexOf('const isPlaceholderSvgDataUri ='),
      marketSection.indexOf('const MARKET_MEDIA_MAX_BYTES')
    );
    const arrow = fn.slice(fn.indexOf('=') + 1).trim().replace(/;\s*$/, '');
    // eslint-disable-next-line no-new-func
    const isPlaceholder = new Function(`return (${arrow})`)();

    // The exact constant from xtrata-v3.2.3.clar.
    const svgStatic =
      "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 50 50'>" +
      "<circle cx='25' cy='25' r='20' fill='none' stroke='#6366f1' stroke-width='4'/>" +
      "<circle cx='25' cy='25' r='12' fill='none' stroke='#ec4899' stroke-width='4'/>" +
      "<circle cx='25' cy='25' r='5' fill='#f97316'/></svg>";
    const asDataUri = `data:image/svg+xml;base64,${Buffer.from(svgStatic, 'utf8').toString('base64')}`;
    expect(isPlaceholder(asDataUri)).toBe(true);

    // A real plate must NOT be mistaken for it.
    const plate =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="512" height="512" ' +
      'shape-rendering="crispEdges"><rect x="0" y="0" width="16" height="16" fill="#101418"/></svg>';
    const plateUri = `data:image/svg+xml;base64,${Buffer.from(plate, 'utf8').toString('base64')}`;
    expect(isPlaceholder(plateUri)).toBe(false);
  });

  it('tolerates a malformed data uri instead of throwing', () => {
    const fn = marketSection.slice(
      marketSection.indexOf('const isPlaceholderSvgDataUri ='),
      marketSection.indexOf('const MARKET_MEDIA_MAX_BYTES')
    );
    // A bad base64 payload must return false, not blow up the whole hydration
    // pass and leave every card stuck on "Loading…".
    expect(fn).toMatch(/try \{[\s\S]*atob\(base64\)[\s\S]*\} catch \{[\s\S]*return false;/);
  });
});
