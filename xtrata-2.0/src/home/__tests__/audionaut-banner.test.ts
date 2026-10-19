import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { twinEclipseFrames } from '../audionaut-banner.js';

const indexHtml = readFileSync(new URL('../../../index.html', import.meta.url), 'utf8');
const bannerAt = indexHtml.indexOf('id="audionautBanner"');
const banner = indexHtml.slice(indexHtml.lastIndexOf('<a ', bannerAt), indexHtml.indexOf('</a>', bannerAt));

describe('homepage Audionaut banner', () => {
  it('links to The Audionaut and is wired for the home page only', () => {
    expect(banner).toContain('href="/audionaut"');
    expect(banner).toContain('home-only');
    expect(banner).toContain('id="audionautWordmark"');
  });

  it('uses animation 35 (Twin Eclipses): alternate letters open from opposite sides', () => {
    const even = twinEclipseFrames(0);
    const odd = twinEclipseFrames(1);
    expect(even[0].clipPath).toBe('circle(0% at 0% 50%)');
    expect(odd[0].clipPath).toBe('circle(0% at 100% 50%)');
    expect(even[1]).toMatchObject({ opacity: 1, clipPath: 'circle(180% at 0% 50%)' });
  });
});
