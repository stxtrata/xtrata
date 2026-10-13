import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { HOMEPAGE_STRIP_SLIDES } from '../homepage-content.js';

const indexHtml = readFileSync(new URL('../../../index.html', import.meta.url), 'utf8');
const css = readFileSync(new URL('../styles/home.css', import.meta.url), 'utf8');
const hero = indexHtml.slice(indexHtml.indexOf('id="heroMusic"'), indexHtml.indexOf('</section>', indexHtml.indexOf('id="heroMusic"')));

describe('homepage radio hero: on-chain music on any phone', () => {
  it('leads with the gift link and keeps a way in for people who already have a Stacks wallet', () => {
    expect(hero).toContain('Send a link. <em>Face ID does the rest.</em>');
    expect(hero).toContain('href="https://radio.xtrata.xyz/radio#give"');
    expect(hero).toContain('href="https://radio.xtrata.xyz/radio"');
    expect(hero).toContain('href="/music/heroes"');
    expect(hero).toMatch(/Connect Xverse or Leather/);
  });

  it('says what each play pays without overclaiming: the song holder, not "the artist"', () => {
    expect(hero).toContain('pays its holder');
    expect(hero).not.toMatch(/pay the artist/i);
  });

  it('draws the phone as decoration only, and stills it for reduced motion', () => {
    expect(hero).toMatch(/class="hero-phone__device" aria-hidden="true"/);
    for (const screen of ['hp-s1', 'hp-s2', 'hp-s3', 'hp-s4']) expect(hero).toContain(screen);
    const reduced = css.slice(css.indexOf('@media (prefers-reduced-motion: reduce) {\n      /* No slideshow'));
    expect(reduced).toMatch(/\.hp-screen, \.hp-tap, \.hp-eq i[^{]*\{ animation: none; \}/);
    expect(reduced).toMatch(/\.hp-s4[^{]*\{ opacity: 1; \}/);
  });

  it('uses no media files: the hero is markup and CSS only', () => {
    expect(hero).not.toMatch(/<(video|img|source)\b/);
  });

  it('the strip points at the same gift flow', () => {
    const slide = HOMEPAGE_STRIP_SLIDES.find((s) => s.id === 'music-app');
    expect(slide).toMatchObject({ title: 'New: send on-chain music to any phone.', href: 'https://radio.xtrata.xyz/radio#give' });
  });
});
