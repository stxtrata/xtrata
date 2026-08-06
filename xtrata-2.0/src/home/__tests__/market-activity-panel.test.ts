/**
 * The marketplace-wide activity panel.
 *
 * Guards the three claims the panel makes that could quietly become false:
 * that it loads lazily, that it derives sponsorship rather than assuming it,
 * and that it admits when the history it is showing is partial.
 */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const mainSource = readFileSync(new URL('../main.js', import.meta.url), 'utf8');
const indexHtml = readFileSync(new URL('../../../index.html', import.meta.url), 'utf8');
const css = readFileSync(new URL('../styles/home.css', import.meta.url), 'utf8');

const panelSection = (() => {
  const start = mainSource.indexOf('/* --- marketplace-wide activity ---');
  const end = mainSource.indexOf('const hydrateMarketThumbnails');
  expect(start, 'activity panel section marker moved').toBeGreaterThan(-1);
  expect(end).toBeGreaterThan(start);
  return mainSource.slice(start, end);
})();

describe('markup', () => {
  it('is a disclosure, collapsed by default', () => {
    // Not `open`: walking three markets' history is several requests against a
    // rate-limited API, and a reader who never opens it should never pay.
    expect(indexHtml).toMatch(/<details class="market-activity" id="marketActivity">/);
    expect(indexHtml).not.toMatch(/id="marketActivity"[^>]*\bopen\b/);
  });

  it('has the rows, filters, status and truncation note', () => {
    for (const id of [
      'marketActivityRows',
      'marketActivityFilters',
      'marketActivityStatus',
      'marketActivityNote',
      'marketActivityCount'
    ]) {
      expect(indexHtml, id).toContain(`id="${id}"`);
    }
  });

  it('sits inside the market panel, before the footnote', () => {
    const listings = indexHtml.indexOf('id="marketListings"');
    const activity = indexHtml.indexOf('id="marketActivity"');
    const footnote = indexHtml.indexOf('id="marketFootnote"');
    expect(activity).toBeGreaterThan(listings);
    expect(activity).toBeLessThan(footnote);
  });
});

describe('loading', () => {
  it('loads on first open rather than on page load', () => {
    expect(mainSource).toMatch(/marketDom\.activity\?\.addEventListener\('toggle'/);
    expect(panelSection).toContain('marketActivityState.loading');
  });

  it('forces a fresh read the first time, so a pre-flag cache cannot mislead', () => {
    // A snapshot cached before `complete` existed reads as unknown, which
    // correctly shows the truncation note -- but the note would then blame
    // missing history for what is really a stale cache.
    expect(panelSection).toMatch(/force: force \|\| !marketActivityState\.loaded/);
  });

  it('does not refetch on every reopen', () => {
    expect(panelSection).toMatch(/if \(marketActivityState\.loaded && !force\) return;/);
  });
});

describe('what it will not fake', () => {
  it('shows the sponsored badge only on a sale', () => {
    // A listing or a cancel is neither sponsored nor self-paid, so the badge
    // there would be meaningless rather than merely absent.
    expect(panelSection).toMatch(/if \(row\.type === 'buy'\) \{[\s\S]*?Sponsored[\s\S]*?Self-paid/);
  });

  it('takes sponsorship from the row, not from the market being sponsor-capable', () => {
    // Every listing here is on a sponsored market, so the market says nothing.
    expect(panelSection).toContain('row.sponsored');
    expect(panelSection).not.toMatch(/settlement\.kind === 'fungible-token' \? 'Sponsored'/);
  });

  it('renders the truncation note whenever the snapshot is not complete', () => {
    expect(panelSection).toMatch(/if \(snapshot\.complete\) \{[\s\S]*?note\.hidden = true;/);
    expect(panelSection).toContain('could not be read all the way back');
  });

  it('marks the count as partial with a + when incomplete', () => {
    expect(panelSection).toMatch(/snapshot\.complete \? '' : '\+'/);
  });

  it('formats prices through the shared helper, not a local copy', () => {
    // Two opinions about what a number means is how one page contradicts
    // itself; the listing cards use the same function.
    expect(panelSection).toContain('formatMarketPrice(row.price, row.settlement)');
    expect(panelSection).not.toMatch(/\/ 1e6|10 \*\* 6/);
  });

  it('distinguishes an empty marketplace from an empty filter', () => {
    expect(panelSection).toContain('No activity found on any market yet.');
    expect(panelSection).toContain('Nothing of that kind in the activity read so far.');
  });
});

describe('style', () => {
  it('scrolls inside itself rather than growing the page', () => {
    const block = css.slice(
      css.indexOf('.market-activity__rows {'),
      css.indexOf('.market-activity__row {')
    );
    expect(block).toContain('overflow-y: auto');
    expect(block).toMatch(/max-height:/);
  });

  it('collapses the grid on a narrow screen', () => {
    expect(css).toMatch(/@media \(max-width: 640px\) \{[\s\S]*?\.market-activity__row/);
  });
});
