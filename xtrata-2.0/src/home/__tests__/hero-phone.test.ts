import { describe, expect, it } from 'vitest';
import { HOMEPAGE_STRIP_SLIDES } from '../homepage-content.js';

// The hero itself is now the album giveaway (see giveaway-hero.test.ts). The strip still carries the passkey-wallet slide.
describe('homepage strip: passkey wallet slide', () => {
  it('sells the passkey wallet', () => {
    const slide = HOMEPAGE_STRIP_SLIDES.find((s) => s.id === 'music-app');
    expect(slide).toMatchObject({ title: 'New: make a Stacks wallet with Face ID.', href: 'https://radio.xtrata.xyz/radio' });
  });
});
