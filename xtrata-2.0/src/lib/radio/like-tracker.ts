/**
 * Tracks likes and unlikes the pay-per-play listening wallet is sending, so the radio's heart can
 * show them before the chain does and refuse quick repeat taps.
 *
 *   starting  tapped and handed over; being checked and signed (up to 2 minutes, e.g. while an
 *             earlier payment confirms)
 *   sent      broadcast, waiting for the chain (up to 5 minutes)
 *   confirmed the listening wallet saw its own like confirm on-chain (a transaction lookup, which is
 *             quicker than the likes list catching up): shown as done at once, locked for 3 seconds, and
 *             the sent state keeps showing until the likes list agrees (up to 5 minutes)
 *   cooling   the confirmed state has arrived; locked for 3 more seconds
 *
 * While an entry exists the heart is locked; while it is starting or sent it is pending (orange).
 */
export const LIKE_START_MS = 120_000;
export const LIKE_SENT_MS = 300_000;
export const LIKE_COOL_MS = 3_000;

type Phase = 'starting' | 'sent' | 'confirmed' | 'cooling';
interface Entry { liked: boolean; phase: Phase; until: number; lockUntil?: number }

export function createLikeTracker(deps: { isLiked(id: string): boolean; now?: () => number; changed?: (afterMs: number) => void }) {
  const now = deps.now ?? Date.now;
  const entries = new Map<string, Entry>();

  function entry(id: string | number): Entry | undefined {
    const key = String(id);
    const e = entries.get(key);
    if (!e) return undefined;
    if (now() >= e.until) { entries.delete(key); return undefined; }
    if (e.phase === 'sent' && e.liked === deps.isLiked(key)) {
      e.phase = 'cooling';
      e.until = now() + LIKE_COOL_MS;
      deps.changed?.(LIKE_COOL_MS + 50); // re-render when the lock ends
    }
    if (e.phase === 'confirmed' && e.liked === deps.isLiked(key)) {
      // The likes list caught up: only what is left of the 3-second lock remains.
      if (now() >= (e.lockUntil ?? 0)) { entries.delete(key); return undefined; }
      e.phase = 'cooling';
      e.until = e.lockUntil!;
    }
    return e;
  }

  return {
    /** The state to show: the sent like until the chain agrees, then the chain's. */
    shown: (id: string | number) => { const e = entry(id); return e && e.phase !== 'cooling' ? e.liked : deps.isLiked(String(id)); },
    pending: (id: string | number) => { const e = entry(id); return !!e && (e.phase === 'starting' || e.phase === 'sent'); },
    locked: (id: string | number) => { const e = entry(id); return !!e && !(e.phase === 'confirmed' && now() >= (e.lockUntil ?? 0)); },
    /** The listening wallet took the tap; `liked` is the state it is heading for. */
    started(id: string | number, liked: boolean) { entries.set(String(id), { liked, phase: 'starting', until: now() + LIKE_START_MS }); },
    /** Broadcast: `liked` is what was actually sent (the wallet re-reads the song's state first). */
    sent(id: string | number, liked: boolean) { entries.set(String(id), { liked, phase: 'sent', until: now() + LIKE_SENT_MS }); },
    /** The wallet's own check saw this like confirm: not orange any more, whatever the likes list says yet. */
    confirmed(id: string | number, liked: boolean) {
      entries.set(String(id), { liked, phase: 'confirmed', until: now() + LIKE_SENT_MS, lockUntil: now() + LIKE_COOL_MS });
      deps.changed?.(LIKE_COOL_MS + 50);
    },
    /** Not sent, or rejected: back to the chain's state straight away. */
    failed: (id: string | number) => entries.delete(String(id))
  };
}
