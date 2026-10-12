/**
 * Tracks likes and unlikes the pay-per-play listening wallet is sending, so the radio's heart can
 * show them before the chain does and refuse quick repeat taps.
 *
 *   starting  tapped and handed over; being checked and signed (up to 2 minutes, e.g. while an
 *             earlier payment confirms)
 *   sent      broadcast, waiting for the chain (up to 5 minutes)
 *   cooling   the confirmed state has arrived; locked for 3 more seconds
 *
 * While an entry exists the heart is locked; while it is starting or sent it is pending (orange).
 */
export const LIKE_START_MS = 120_000;
export const LIKE_SENT_MS = 300_000;
export const LIKE_COOL_MS = 3_000;

type Phase = 'starting' | 'sent' | 'cooling';
interface Entry { liked: boolean; phase: Phase; until: number }

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
    return e;
  }

  return {
    /** The state to show: the sent like until the chain agrees, then the chain's. */
    shown: (id: string | number) => { const e = entry(id); return e && e.phase !== 'cooling' ? e.liked : deps.isLiked(String(id)); },
    pending: (id: string | number) => { const e = entry(id); return !!e && e.phase !== 'cooling'; },
    locked: (id: string | number) => !!entry(id),
    /** The listening wallet took the tap; `liked` is the state it is heading for. */
    started(id: string | number, liked: boolean) { entries.set(String(id), { liked, phase: 'starting', until: now() + LIKE_START_MS }); },
    /** Broadcast: `liked` is what was actually sent (the wallet re-reads the song's state first). */
    sent(id: string | number, liked: boolean) { entries.set(String(id), { liked, phase: 'sent', until: now() + LIKE_SENT_MS }); },
    /** Not sent, or rejected: back to the chain's state straight away. */
    failed: (id: string | number) => entries.delete(String(id))
  };
}
