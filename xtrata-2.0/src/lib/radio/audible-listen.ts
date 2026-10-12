import { credit } from './play-rules';

/**
 * A song counts as a listen (and, with pay-per-play on, gets paid) after this
 * much actual audible playback. Songs shorter than a minute qualify at half
 * their length, the same rule the radio's play counter uses.
 */
export const LISTEN_SECONDS = 30;

export function listenThreshold(duration: number) {
  return Number.isFinite(duration) && duration > 0 ? Math.max(2, Math.min(LISTEN_SECONDS, duration / 2)) : LISTEN_SECONDS;
}

type Player = EventTarget & {
  currentTime: number; duration: number; playbackRate: number; readyState: number;
  paused: boolean; ended: boolean; seeking: boolean; muted: boolean; volume: number; loop: boolean;
};

/**
 * Notifies once per selected song after it has been heard for the listen threshold.
 * Only continuous, audible forward progress counts: paused, muted, silent, buffering
 * and seeked-over time does not. Notifications only; it never affects playback.
 */
export function attachAudibleListen(player: Player, notify: (d: { song: number; id: string; seconds: number }) => void, clock = () => performance.now()) {
  let song: number | null = null;
  let heard = 0, fired = false, active = false, previous = 0, at = 0;
  const audible = () => !player.paused && !player.ended && !player.seeking && !player.muted && player.volume > 0 && player.readyState >= 3;
  const baseline = () => { previous = player.currentTime; at = clock(); };
  const restart = () => { heard = 0; fired = false; };
  function sample() {
    const now = clock(), position = player.currentTime;
    if (song !== null && !fired) {
      heard += credit(previous, position, (now - at) / 1000, player.playbackRate, active);
      if (heard >= listenThreshold(player.duration)) {
        fired = true;
        try { notify({ song, id: crypto.randomUUID().replaceAll('-', ''), seconds: Math.round(heard) }); } catch { /* listener error */ }
      }
    }
    previous = position; at = now;
  }
  const handlers: Record<string, () => void> = {
    playing: () => { baseline(); active = audible(); },
    timeupdate: () => {
      // Native looping may not emit ended: a wrap back to the start is a new listen.
      if (player.loop && !player.seeking && previous > player.duration - 2 && player.currentTime < 2) { restart(); baseline(); }
      sample(); active = audible();
    },
    pause: () => { sample(); active = false; },
    waiting: () => { sample(); active = false; },
    stalled: () => { sample(); active = false; },
    seeking: () => { active = false; baseline(); },
    seeked: () => { baseline(); active = audible(); },
    volumechange: () => { sample(); baseline(); active = audible(); },
    ratechange: () => { sample(); baseline(); active = audible(); },
    ended: () => { sample(); active = false; },
    emptied: () => { active = false; baseline(); },
    error: () => { active = false; }
  };
  for (const [event, handler] of Object.entries(handlers)) player.addEventListener(event, handler);
  const timer = setInterval(sample, 1000);
  return {
    select(id: number) { song = Number.isSafeInteger(id) && id >= 0 ? id : null; restart(); active = false; baseline(); },
    dispose() { clearInterval(timer); for (const [event, handler] of Object.entries(handlers)) player.removeEventListener(event, handler); }
  };
}
