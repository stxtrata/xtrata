import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

/**
 * Clicking a song in "Your Station" must play THAT song.
 *
 * playToken sets `forcedNext`, which pickNext honours. But tuneToNextTrack chose its
 * track in priority order, and the PRELOAD QUEUE was consulted before pickNext — and
 * the queue is almost always full, because preloadNextTrack runs in the background
 * after every tune. So the cued track played instead, and the song the listener asked
 * for only came round on the following change. From the outside: "it jumps to a
 * different song".
 *
 * These are source assertions because the ordering IS the bug: it cannot be observed
 * without a real audio element and network, and the thing worth protecting is which
 * branch wins, not what a stubbed player does.
 */

const radio = readFileSync(new URL('../radio.js', import.meta.url), 'utf8');

describe('an explicit song request beats the preload queue', () => {
  it('skips the cued track when a specific song was asked for', () => {
    expect(radio).toContain('} else if (preloadQueue.length && !forcedNext) {');
  });

  it('still uses the queue for ordinary track changes', () => {
    // The whole point of preloading is an instant start; the guard must not disable it
    // for the normal case.
    expect(radio).toContain('track = preloadQueue.shift();');
  });

  it('keeps forcedNext ahead of every other choice inside pickNext', () => {
    const fn = radio.slice(radio.indexOf('const pickNext = ()'), radio.indexOf('const pickNext = ()') + 400);
    // The forced branch must come before the sequential/shuffle logic, and consume itself.
    expect(fn).toMatch(/if \(forcedNext\) \{[^}]*choice = forcedNext; forcedNext = null;/);
  });

  it('drops the stale queue when the listener jumps', () => {
    // Anything cued was chosen to follow the PREVIOUS song. Leaving it would make
    // "what plays next" a leftover from a sequence the listener has just left.
    const fn = radio.slice(radio.indexOf('playToken: (id) =>'), radio.indexOf('playToken: (id) =>') + 500);
    expect(fn).toContain('forcedNext = String(id)');
    expect(fn).toContain('preloadQueue.length = 0');
  });

  it('works whether the radio is already on or off', () => {
    const fn = radio.slice(radio.indexOf('playToken: (id) =>'), radio.indexOf('playToken: (id) =>') + 500);
    // off -> switchOn() tunes; on -> pause and retune. Both reach pickNext with the
    // forced id set, now that the queue cannot pre-empt it.
    expect(fn).toContain('if (!on) { switchOn(); } else { player.pause(); void tuneToNextTrack(); }');
  });
});
