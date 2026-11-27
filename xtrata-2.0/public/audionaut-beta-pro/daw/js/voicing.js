// voicing.js — how an instrument answers overlapping notes.
//
//   poly    every note gets its own voice (the default; nothing is stored)
//   mono    one note at a time. Each note restarts the sound and the pitch
//           slides from the previous note over the glide time. Releasing a key
//           while another is still held returns to that key.
//   legato  one note at a time. A note played while another is held does not
//           restart the sound: the pitch slides to it and the envelopes carry
//           on. Notes that do not overlap start normally, with no slide.
//
// The setting lives on the instrument as `voicing: { mode, glide }`. Projects
// saved before this existed have no `voicing` and stay poly.
export const VOICING_MODES = ["poly", "mono", "legato"];
export const MAX_GLIDE = 2;

export function normalizeVoicing(value) {
  const mode = VOICING_MODES.includes(value?.mode) ? value.mode : "poly";
  const glide = Math.max(0, Math.min(MAX_GLIDE, Number(value?.glide) || 0));
  return { mode, glide };
}

const clamp = (v) => Math.max(-96, Math.min(96, Number(v) || 0));

// Schedule a pitch slide on an AudioParam measured in cents. `from` restarts
// the slide at a given offset; without it the slide continues from wherever
// the param is.
export function scheduleGlide(param, ctx, baseCents, semitones, at, seconds, from = null) {
  const t = Math.max(ctx.currentTime, at), target = baseCents + clamp(semitones) * 100;
  if (param.cancelAndHoldAtTime) param.cancelAndHoldAtTime(t); else param.cancelScheduledValues(t);
  if (from != null) param.setValueAtTime(baseCents + clamp(from) * 100, t);
  else if (!param.cancelAndHoldAtTime) param.setValueAtTime(param.value, t);
  if (seconds > 0.001) param.linearRampToValueAtTime(target, t + seconds);
  else param.setValueAtTime(target, t);
}

// Bend and glide share one detune param on the sample-based voices.
export function detuneControl(ctx, params) {
  let bend = 0, glide = 0;
  return {
    setBend(semitones, at = ctx.currentTime) { bend = Math.max(-48, Math.min(48, Number(semitones) || 0)); for (const p of params()) p.setValueAtTime((bend + glide) * 100, at); },
    setGlide(semitones, at = ctx.currentTime, seconds = 0, from = null) { glide = clamp(semitones); for (const p of params()) scheduleGlide(p, ctx, bend * 100, glide, at, seconds, from); },
  };
}
