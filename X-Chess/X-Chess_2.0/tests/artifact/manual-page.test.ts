// The manual page, checked against the runtime rather than against a file.
//
// The first inscribed copy had 23 dead contents links and every heading anchor
// broken, and it looked perfect locally. The Xtrata runtime injects
// `<base href="null">` into everything it serves, so a bare `#section` resolves
// against that and navigates to /i/null — "Invalid tokenId parameter".
//
// An inscription cannot be repaired, so these assert the two properties that
// made it fail, both of which are invisible when the file is opened directly.

import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../..', import.meta.url));
const page = readFileSync(resolve(ROOT, 'docs/manual/xchess-manual.html'), 'utf8');

describe('the manual page under the runtime', () => {
  it('moves itself rather than trusting the address bar', () => {
    // With a base of "null" every in-page href is a navigation off the page.
    // The handler is what makes a contents list work at all.
    expect(page, 'no click handler: every #link would leave the page').toMatch(
      /addEventListener\('click'/
    );
    expect(page).toMatch(/scrollIntoView/);
    expect(page).toMatch(/preventDefault/);
  });

  it('never asks for smooth scrolling', () => {
    // Measured: a smooth scrollIntoView moved this page 0 pixels in an
    // environment that refuses the animation, while an instant one moved it
    // 2,235. Refusing to animate becomes refusing to move, so a reader who asks
    // for reduced motion gets a contents list that silently does nothing.
    expect(page, 'a smooth scroll can be dropped entirely').not.toMatch(/behavior\s*:\s*['"]smooth/);
    expect(page, 'the CSS would make even a plain scrollIntoView smooth').not.toMatch(
      /scroll-behavior\s*:\s*smooth/
    );
  });

  it('reaches nothing outside its own bytes except inscriptions', () => {
    // An inscription outlives hosts. Anything it fetches is a thing that can
    // stop existing while the page cannot be changed.
    const external = [...page.matchAll(/\b(?:src|href)\s*=\s*["'](https?:\/\/[^"']+)/gi)]
      .map((m) => m[1])
      .filter((url) => !url.startsWith('https://xtrata.xyz/i/'));
    expect(external, `loads from ${external[0] ?? ''}`).toHaveLength(0);
  });

  it('links to inscriptions absolutely, because a base of null breaks relative', () => {
    expect(page).toMatch(/href="https:\/\/xtrata\.xyz\/i\/\d+"/);
    expect(page, 'a relative /i/ link resolves against base and dies').not.toMatch(/href="\/i\//);
  });

  it('still fits one upload', () => {
    const bytes = Buffer.byteLength(page, 'utf8');
    expect(Math.ceil(bytes / 16_384)).toBeLessThanOrEqual(32);
  });
});
