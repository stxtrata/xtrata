import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { summarise } from '../giveaway-hero.js';
import { HOMEPAGE_STRIP_SLIDES, HOMEPAGE_WALL_ROTATION } from '../homepage-content.js';

const indexHtml = readFileSync(new URL('../../../index.html', import.meta.url), 'utf8');

describe('homepage hero: the free album giveaway', () => {
  it('has no hero card and no top bar any more', () => {
    expect(indexHtml).not.toContain('id="heroMusic"');
    expect(indexHtml).not.toContain('id="giveawayHero"');
    expect(indexHtml).not.toContain('id="giveBar"');
  });

  it('turns the endpoint payload into counts, and only trusts a well-formed claim code', () => {
    const live = summarise({ state: 'live', code: 'A'.repeat(22), held: 1, claimed: 4, left: 95, nextAt: 5, now: 1 });
    expect(live).toMatchObject({ state: 'live', gone: 5, total: 100, code: 'A'.repeat(22) });
    expect(summarise({ state: 'live', code: 'bad', held: 0, claimed: 0, left: 10 }).state).toBe('waiting');
    expect(summarise(null).state).toBe('error');
    expect(summarise({ state: 'done', held: 0, claimed: 100, left: 0 }).total).toBe(100);
  });

  it('is no longer advertised in the rotating strip or on the wall', () => {
    expect(HOMEPAGE_STRIP_SLIDES.find((s) => s.id === 'giveaway')).toBeUndefined();
    expect(HOMEPAGE_WALL_ROTATION.pool.some((entry: { tile: { id: string } }) => entry.tile.id === 'giveaway')).toBe(false);
  });
});
