import { afterEach, describe, expect, it, vi } from 'vitest';
import { attachAudibleListen, listenThreshold, LISTEN_SECONDS } from '../audible-listen';

let clock = 0;
const make = (duration = 180) => Object.assign(new EventTarget(), {
  currentTime: 0, duration, playbackRate: 1, readyState: 4, paused: false, ended: false, seeking: false, muted: false, volume: 1, loop: false
});
type P = ReturnType<typeof make>;
/** Plays forward in quarter-second timeupdates, like a real audio element. */
function play(p: P, seconds: number) {
  for (let i = 0; i < seconds * 4; i++) { clock += 250; p.currentTime += 0.25; p.dispatchEvent(new Event('timeupdate')); }
}
function setup(duration?: number) {
  const p = make(duration), notify = vi.fn(), l = attachAudibleListen(p, notify, () => clock);
  return { p, notify, l };
}
const start = (p: P, l: { select(id: number): void }, song: number) => { l.select(song); p.currentTime = 0; p.dispatchEvent(new Event('playing')); };
afterEach(() => vi.useRealTimers());

describe('a play is 30 seconds of audible listening', () => {
  it('pays nothing for a skip and notifies exactly once at 30 seconds', () => {
    const { p, notify, l } = setup();
    start(p, l, 315);
    play(p, 29);
    expect(notify).not.toHaveBeenCalled();
    play(p, 2);
    expect(notify).toHaveBeenCalledTimes(1);
    expect(notify.mock.calls[0][0]).toMatchObject({ song: 315, seconds: 30 });
    expect(notify.mock.calls[0][0].id).toMatch(/^[0-9a-f]{32}$/);
    play(p, 120);
    expect(notify).toHaveBeenCalledTimes(1);
    l.dispose();
  });

  it('a song skipped at 10 seconds stays free and the next song starts its own count', () => {
    const { p, notify, l } = setup();
    start(p, l, 1); play(p, 10);
    start(p, l, 2); play(p, 25);
    expect(notify).not.toHaveBeenCalled();
    play(p, 5);
    expect(notify).toHaveBeenCalledTimes(1);
    expect(notify.mock.calls[0][0].song).toBe(2);
    l.dispose();
  });

  it('paused, muted and silent time does not count, and listening resumes the count', () => {
    const { p, notify, l } = setup();
    start(p, l, 7); play(p, 20);
    p.paused = true; p.dispatchEvent(new Event('pause'));
    clock += 600_000; // ten minutes paused
    p.paused = false; p.dispatchEvent(new Event('playing'));
    p.muted = true; p.dispatchEvent(new Event('volumechange'));
    play(p, 20);
    p.muted = false; p.volume = 0; p.dispatchEvent(new Event('volumechange'));
    play(p, 20);
    expect(notify).not.toHaveBeenCalled();
    p.volume = 0.5; p.dispatchEvent(new Event('volumechange'));
    play(p, 10);
    expect(notify).toHaveBeenCalledTimes(1);
    l.dispose();
  });

  it('seeking ahead does not count as listening', () => {
    const { p, notify, l } = setup();
    start(p, l, 7); play(p, 5);
    p.seeking = true; p.dispatchEvent(new Event('seeking'));
    p.currentTime = 150;
    p.seeking = false; p.dispatchEvent(new Event('seeked'));
    play(p, 20);
    expect(notify).not.toHaveBeenCalled();
    play(p, 5);
    expect(notify).toHaveBeenCalledTimes(1);
    l.dispose();
  });

  it('a jump in position without real time passing is not credited', () => {
    const { p, notify, l } = setup();
    start(p, l, 7);
    clock += 250; p.currentTime = 60; p.dispatchEvent(new Event('timeupdate'));
    expect(notify).not.toHaveBeenCalled();
    l.dispose();
  });

  it('buffering time does not count', () => {
    const { p, notify, l } = setup();
    start(p, l, 7); play(p, 25);
    p.readyState = 2; p.dispatchEvent(new Event('waiting'));
    clock += 60_000;
    p.readyState = 4; p.dispatchEvent(new Event('playing'));
    expect(notify).not.toHaveBeenCalled();
    play(p, 5);
    expect(notify).toHaveBeenCalledTimes(1);
    l.dispose();
  });

  it('short songs count at half their length; unknown lengths need the full 30 seconds', () => {
    expect(listenThreshold(180)).toBe(LISTEN_SECONDS);
    expect(listenThreshold(40)).toBe(20);
    expect(listenThreshold(Number.NaN)).toBe(30);
    expect(listenThreshold(Infinity)).toBe(30);
    const { p, notify, l } = setup(40);
    start(p, l, 9); play(p, 19);
    expect(notify).not.toHaveBeenCalled();
    play(p, 1.5);
    expect(notify).toHaveBeenCalledTimes(1);
    l.dispose();
  });

  it('a looping song counts again on each full pass, and nothing fires without a selected song', () => {
    const { p, notify, l } = setup(40);
    p.loop = true;
    start(p, l, 9); play(p, 39.5);
    expect(notify).toHaveBeenCalledTimes(1);
    clock += 250; p.currentTime = 0.1; p.dispatchEvent(new Event('timeupdate'));
    play(p, 21);
    expect(notify).toHaveBeenCalledTimes(2);
    l.select(-1); p.dispatchEvent(new Event('playing')); play(p, 60);
    expect(notify).toHaveBeenCalledTimes(2);
    l.dispose();
  });

  it('stops listening after dispose', () => {
    const { p, notify, l } = setup();
    start(p, l, 1); l.dispose(); play(p, 60);
    expect(notify).not.toHaveBeenCalled();
  });
});
