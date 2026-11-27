// voice-budget.js — how many notes and sound sources may play at once, and
// which note gives way when a new one would go over.
//
// A "note" is one key press. A "source" is one oscillator or sample player
// inside it: a simple synth uses 2 or 3 per note, a wide unison patch 30 or
// more, so counting notes alone says little about the real load on a phone.
//
// The source budget applies to live playback only. Export and offline renders
// keep the original note limits and victim order, so a saved project renders
// exactly as it did before this file existed.

export const VOICE_BUDGETS = {
  desktop: { notes: 64, perInstrument: 16, sources: 480 },
  phone: { notes: 32, perInstrument: 10, sources: 160 },
};

// Touch-first devices (phones and tablets) get the smaller budget.
export function deviceTier(env = globalThis) {
  try {
    if (env.matchMedia?.("(hover: none) and (pointer: coarse)").matches) return "phone";
  } catch { /* no media queries: treat as desktop */ }
  return "desktop";
}

export function voiceBudget(env = globalThis) {
  return { ...VOICE_BUDGETS[deviceTier(env)] };
}

// Sources a finished voice actually built. Used as the estimate for the next
// note on the same instrument.
export function voiceCost(voice) {
  let count = 0;
  try { count = voice?.sources?.length || 0; } catch { count = 0; }
  return Math.max(1, count);
}

const oldest = (list) => list.reduce((a, b) => (b.time < a.time || (b.time === a.time && b.id < a.id) ? b : a), list[0]);

// Pick the note to cut. `voices` are the notes sounding now; `i` is the
// instrument the new note belongs to; `own` restricts the choice to that
// instrument (used when only its own limit is exceeded).
// Order: a note already released and fading, then the oldest held note that
// is not the instrument's lowest (the bass note anchors a chord), then the
// oldest of anything.
export function pickVictim(voices, i, { own = false } = {}) {
  const mine = voices.filter((n) => n.i === i);
  const released = (list) => list.filter((n) => n.voice?.released);
  let pool = released(mine);
  if (pool.length) return oldest(pool);
  if (!own) { pool = released(voices); if (pool.length) return oldest(pool); }
  if (mine.length > 1) {
    const low = Math.min(...mine.map((n) => n.pitch));
    const upper = mine.filter((n) => n.pitch !== low);
    if (upper.length) return oldest(upper);
  }
  if (mine.length) return oldest(mine);
  return own || !voices.length ? null : oldest(voices);
}
