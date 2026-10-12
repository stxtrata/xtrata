import { describe, expect, it } from 'vitest';
import { createLikeTracker, LIKE_COOL_MS, LIKE_SENT_MS, LIKE_START_MS } from '../like-tracker';

function setup() {
  let time = 1_000;
  const chain = new Set<string>();
  const renders: number[] = [];
  const t = createLikeTracker({ isLiked: (id) => chain.has(id), now: () => time, changed: (ms) => renders.push(ms) });
  return { t, chain, renders, tick: (ms: number) => { time += ms; } };
}

describe('radio heart like tracker', () => {
  it('shows a like as pending (orange) and locked from the tap until the chain confirms, then 3 s more', () => {
    const { t, chain, renders, tick } = setup();
    expect(t.locked(7)).toBe(false);
    t.started(7, true);
    expect([t.shown(7), t.pending(7), t.locked(7)]).toEqual([true, true, true]);
    t.sent(7, true);
    tick(20_000);
    expect([t.shown(7), t.pending(7), t.locked(7)]).toEqual([true, true, true]); // chain not there yet
    chain.add('7');
    expect([t.shown(7), t.pending(7), t.locked(7)]).toEqual([true, false, true]); // confirmed: red, still locked
    expect(renders).toEqual([LIKE_COOL_MS + 50]);
    tick(LIKE_COOL_MS);
    expect([t.shown(7), t.pending(7), t.locked(7)]).toEqual([true, false, false]); // free again
  });

  it('follows what was actually sent, which may differ from the guess at tap time', () => {
    const { t, chain } = setup();
    t.started(3, true); // the radio thought it was not liked
    t.sent(3, false); // the wallet read the chain: it was liked by this wallet, so it unlikes
    chain.add('3');
    expect([t.shown(3), t.pending(3)]).toEqual([false, true]);
    chain.delete('3');
    expect([t.shown(3), t.pending(3), t.locked(3)]).toEqual([false, false, true]);
  });

  it('clears straight away when the like fails, and never stays stuck', () => {
    const { t, tick } = setup();
    t.started(1, true);
    expect(t.failed(1)).toBe(true);
    expect(t.locked(1)).toBe(false);
    t.started(2, true);
    tick(LIKE_START_MS);
    expect(t.locked(2)).toBe(false); // never handed on: expires
    t.sent(2, true);
    tick(LIKE_SENT_MS);
    expect(t.locked(2)).toBe(false); // never confirmed: expires, back to the chain's state
  });

  it('a starting like does not cool down early just because the chain already agrees', () => {
    const { t, chain } = setup();
    chain.add('5');
    t.started(5, true);
    expect(t.pending(5)).toBe(true);
  });
});
