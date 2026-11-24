import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { FAIR_PLAY_HREF, FAIR_PLAY_START, FAIR_PLAY_COPY, fairPlayLive, msUntilFairPlay, previewFairPlay, validateFairPlay } from '../fair-play-tile.js';

const read = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8');

describe('Fair Play banner timing', () => {
  const start = Date.parse(FAIR_PLAY_START);
  it('opens at exactly 18:00 UK on 19 Nov 2026', () => {
    expect(FAIR_PLAY_START).toBe('2026-11-19T18:00:00Z');
    expect(fairPlayLive(start - 1)).toBe(false);
    expect(fairPlayLive(start)).toBe(true);
    expect(fairPlayLive(start + 86400000 * 30)).toBe(true);
    expect(fairPlayLive(Number.NaN)).toBe(false);
  });
  it('says how long until it appears, and nothing once it has', () => {
    expect(msUntilFairPlay(start - 5000)).toBe(5250);
    expect(msUntilFairPlay(start)).toBeNull();
    expect(msUntilFairPlay(start - 1e12)).toBeLessThanOrEqual(2147483000);
  });
  it('previews with ?fairplay=1 only', () => {
    expect(previewFairPlay('?fairplay=1')).toBe(true);
    expect(previewFairPlay('?fairplay=0')).toBe(false);
    expect(previewFairPlay('')).toBe(false);
    expect(validateFairPlay()).toEqual([]);
    expect(FAIR_PLAY_HREF).toBe('/players');
  });
  it('pitches free, pre-paid plays in plain words', () => {
    expect(FAIR_PLAY_COPY.headline).toEqual(['Free music.', 'Every play pre-paid.']);
    expect(FAIR_PLAY_COPY.strong).toBe('You pay nothing.');
    const all = JSON.stringify(FAIR_PLAY_COPY);
    expect(all).not.toMatch(/crypto|blockchain|on-chain|\u2014/i);
  });
});

describe('Fair Play banner wiring', () => {
  it('is mounted hidden in the page and redrawn by the homepage at the start time', () => {
    expect(read('../../../index.html')).toMatch(/id="homeFairPlay"[^>]*hidden/);
    const home = read('../homepage.js');
    ['renderFairPlay', 'fairPlayLive(now)', 'msUntilFairPlay(now)', 'fairPlayTimer', "'homeFairPlay'"].forEach((s) => expect(home).toContain(s));
    expect(read('../../../public/players.html')).toContain('Pick a disc.');
  });
  it('has one layout for desktop and one stacked for phones', () => {
    const css = read('../styles/home.css');
    expect(css).toContain('.home-fair[hidden]');
    expect(css).toMatch(/@media \(max-width: 760px\) \{\s*\.home-fair__inner/);
  });
});
