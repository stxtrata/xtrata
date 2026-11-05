import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { summarise } from '../giveaway-hero.js';
import { HOMEPAGE_STRIP_SLIDES } from '../homepage-content.js';

const indexHtml = readFileSync(new URL('../../../index.html', import.meta.url), 'utf8');

describe('homepage hero: the free album giveaway', () => {
  it('has no big hero any more, only the thin top bar, and the bar still works on its own', () => {
    expect(indexHtml).not.toContain('id="heroMusic"');
    expect(indexHtml).not.toContain('id="giveawayHero"');
    expect(indexHtml).toContain('id="giveBar"');
  });

  it('turns the endpoint payload into counts, and only trusts a well-formed claim code', () => {
    const live = summarise({ state: 'live', code: 'A'.repeat(22), held: 1, claimed: 4, left: 95, nextAt: 5, now: 1 });
    expect(live).toMatchObject({ state: 'live', gone: 5, total: 100, code: 'A'.repeat(22) });
    expect(summarise({ state: 'live', code: 'bad', held: 0, claimed: 0, left: 10 }).state).toBe('waiting');
    expect(summarise(null).state).toBe('error');
    expect(summarise({ state: 'done', held: 0, claimed: 100, left: 0 }).total).toBe(100);
  });

  it('is also advertised in the thin top bar and the rotating strip, both leading to /giveaway', () => {
    expect(indexHtml).toMatch(/id="giveBar"[^>]*href="\/giveaway"|href="\/giveaway"[^>]*id="giveBar"/);
    expect(indexHtml).toContain('data-givebar="text"');
    expect(indexHtml.indexOf('id="giveBar"')).toBeLessThan(indexHtml.indexOf('id="musicBanner"'));
    expect(HOMEPAGE_STRIP_SLIDES.find((s) => s.id === 'giveaway')).toMatchObject({ href: '/giveaway' });
  });
});
