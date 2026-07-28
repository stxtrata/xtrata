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

describe('the dial sweep is for power, not for skipping', () => {
  it('only sweeps on the first tune after switching on', () => {
    expect(radio).toContain("const tuningSeconds = firstTune ? playTuning(1, 'on') : 0;");
    // switchOff resets firstTune, so EVERY power-on sweeps — not just the first of
    // the session.
    const off = radio.slice(radio.indexOf('const switchOff = ()'), radio.indexOf('const switchOff = ()') + 400);
    expect(off).toContain('firstTune = true;');
    expect(off).toContain("playTuning(-1, 'off')");
  });

  it('adds no delay between songs either', () => {
    // The song is deliberately held back until the sweep finishes, so a zero-length
    // sweep must also mean a zero-length wait — otherwise skipping stays sluggish
    // while merely being silent.
    expect(radio).toContain('if (elapsed < tuningSeconds) {');
    expect(radio).not.toContain("playTuning(1, 'between')");
  });
});

describe('a deliberate click is never overridden by the player itself', () => {
  it('ignores media errors raised while a tune is mid-swap', () => {
    // Assigning player.src ABORTS whatever the element was loading, and the browser
    // reports that as an `error`. The handler answered by starting ANOTHER tune with
    // no requested id — and that one took a higher tuneToken, so it WON. A click
    // therefore landed on a song nobody chose, intermittently, depending on whether
    // the previous track was still loading. That is the "chaotic" part.
    expect(radio).toContain('if (on && !tuneInFlight) {');
    expect((radio.match(/if \(on && !tuneInFlight\) \{/g) || []).length).toBe(2);   // error AND ended
  });

  it('only the current tune may lower the in-flight flag', () => {
    // A superseded tune returning early must not clear the flag out from under the
    // newer one that is still swapping src.
    expect(radio).toContain('const endTune = () => { if (token === tuneToken) tuneInFlight = false; };');
    expect(radio).not.toMatch(/^\s*tuneInFlight = false;\s*$/m);   // no unguarded clears
  });

  it('says so rather than substituting when the requested song will not play', () => {
    // forcedNext is consumed by the first pickNext, so a failed resolve used to fall
    // through to attempt 2 unforced — quietly playing a song the listener never chose.
    expect(radio).toContain('const requestedId = forcedNext;');
    expect(radio).toContain('THAT ONE HAS NO PLAYABLE AUDIO');
  });
});

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
