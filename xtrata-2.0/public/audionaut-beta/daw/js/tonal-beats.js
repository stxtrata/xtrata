// Musical demonstrations of the embedded bank; no external audio needed.
import { ONBOARD_SOUNDS } from "./onboard-catalog.js";
import { LEGACY_BEAT_PRESETS as BEAT_PRESETS } from "./legacy-beats.js";
const families = Object.fromEntries(
  [
    "bass",
    "plucks",
    "keys",
    "bells",
    "leads",
    "pads",
    "chords",
    "percussion",
  ].map((f) => [f, ONBOARD_SOUNDS.filter((s) => s.family === f)]),
);
const pattern = (hits, accent = []) =>
  Array.from({ length: 64 }, (_, i) =>
    accent.includes(i % 16) ? "X" : hits.includes(i % 16) ? "x" : ".",
  ).join("");
const source = (s) => ({ type: "synth", value: s.key, label: s.label });
const track = (s, hits, extra = {}) => ({
  source: source(s),
  name: s.label,
  kind: "hit",
  pattern: pattern(hits),
  volume: 0.34,
  ...extra,
});
export const TONAL_BEAT_PRESETS = BEAT_PRESETS.map((base, i) => {
  const chord = families.chords[i % 12],
    minor = chord.recipe.voicing.includes(3),
    notes = minor ? [0, 3, 7, 10, 7, 3, 12, 7] : [0, 4, 7, 11, 7, 4, 12, 7];
  const slow = ["Ambient", "Experimental"].includes(base.genre),
    drums = families.percussion;
  return {
    id: `onboard-tonal-${i + 1}`,
    collection: "tonal",
    name: `${base.name} · ${["Glass", "Warm", "Night", "Electric"][i % 4]} ensemble`,
    genre: base.genre,
    bpm: base.bpm,
    swing: base.swing || 0,
    bars: 4,
    description:
      "Embedded studio percussion, rooted bass, melodic samples and a gated sustain pad. Chord stabs contain baked voicings.",
    channels: [
      track(drums[i % 4], slow ? [0, 8] : [0, 4, 8, 12], { volume: 0.58 }),
      track(drums[4 + (i % 4)], [4, 12], { volume: 0.4 }),
      track(drums[11 + (i % 3)], [2, 6, 10, 14], { volume: 0.23 }),
      track(families.bass[i % 16], [0, 3, 6, 8, 11, 14], {
        notes: [0, 0, 7, 0, minor ? 3 : 4, 7],
        volume: 0.43,
      }),
      track(families.plucks[i % 16], [1, 5, 7, 9, 13, 15], {
        notes,
        volume: 0.26,
        fx: { delay: 0.12 },
      }),
      track(
        (i % 3 === 0 ? families.bells : families.keys)[
          i % (i % 3 === 0 ? 12 : 16)
        ],
        [2, 6, 10, 14],
        { notes: [0, minor ? 3 : 4, 7, 12], volume: 0.23 },
      ),
      track(families.pads[i % 12], [0], {
        pattern: Array.from({ length: 64 }, (_, n) =>
          n === 0 || n === 32 ? "x" : ".",
        ).join(""),
        gateSteps: 32,
        volume: 0.17,
      }),
      track(i % 4 === 3 ? families.leads[i % 12] : chord, [0, 8], {
        notes: i % 4 === 3 ? notes : [0, 0, minor ? 3 : 4, 7],
        volume: 0.2,
        fx: { reverb: 0.12 },
      }),
    ],
  };
});
