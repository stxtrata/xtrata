import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { summarise } from '../giveaway-hero.js';
import { HOMEPAGE_STRIP_SLIDES } from '../homepage-content.js';

const indexHtml = readFileSync(new URL('../../../index.html', import.meta.url), 'utf8');
const start = indexHtml.indexOf('id="giveawayHero"');
const hero = indexHtml.slice(start, indexHtml.indexOf('</section>', start));

describe('homepage hero: the free album giveaway', () => {
  it('replaces the passkey-wallet hero and still reads well before any data arrives', () => {
    expect(start).toBeGreaterThan(0);
    expect(indexHtml).not.toContain('id="heroMusic"');
    expect(hero).toContain('Free.');
    expect(hero).toContain('href="/giveaway"');
    expect(hero).toContain('data-home-action="hero:giveaway"');
    for (const key of ['kicker', 'total', 'lead', 'cta', 'status', 'discs']) expect(hero).toContain(`data-give="${key}"`);
    expect(hero).not.toMatch(/<(audio|video)\b/);
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
