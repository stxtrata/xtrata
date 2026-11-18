// Balanced sound allocation and musical four-bar variations of the historic grooves.
import { ONBOARD_SOUNDS } from "./onboard-catalog.js";
import { ONBOARD_MANIFEST } from "./onboard-manifest.js";
import { assetKey } from "./onboard-catalog.js";
import { OB1, expandPattern } from "./legacy-beats.js";
const family = (f) => ONBOARD_SOUNDS.filter((s) => s.family === f);
const kit = (keys) =>
  keys.map((key) => ONBOARD_SOUNDS.find((s) => s.key === `onboard:v2:${key}`));
const percussion = family("percussion");
export const EMBEDDED_BEAT_PALETTES = {
  kick: [
    ...kit(["kick-808", "kick-punch", "kick-hard", "kick-sub"]),
    ...percussion.slice(0, 4),
  ],
  backbeat: [
    ...kit(["snare-tight", "snare-fat", "snare-rock", "clap-909", "rimshot"]),
    ...percussion.slice(4, 11),
  ],
  top: [
    ...kit(["hat-closed", "hat-tight", "hat-open", "ride", "shaker"]),
    ...percussion.slice(11, 14),
    ...percussion.slice(18, 21),
  ],
  colour: [
    ...kit(["tom-lo", "tom-mid", "tom-hi", "cowbell-808", "zap", "crash"]),
    ...percussion.slice(14, 18),
    ...percussion.slice(21, 24),
  ],
  bass: [
    ...family("bass"),
    ...kit(["bass-808-e", "bass-808-g", "bass-808-a", "bass-808-dist"]),
  ],
  melody: Array.from({ length: 16 }, (_, i) =>
    ["plucks", "keys", "bells", "leads"]
      .map((f) => family(f)[i])
      .filter(Boolean),
  ).flat(),
  texture: Array.from({ length: 12 }, (_, i) => [
    family("pads")[i],
    family("chords")[i],
  ]).flat(),
};
// Give the four layered, multi-root keys six uses each so every recorded asset
// appears. Borrow duplicate fourth uses of early plucks/bells, retaining >=3
// appearances of every patch and all their roots/layers.
const melodySchedule = Array.from(
  { length: 192 },
  (_, i) =>
    EMBEDDED_BEAT_PALETTES.melody[i % EMBEDDED_BEAT_PALETTES.melody.length],
);
const donors = [
  ...family("plucks").slice(0, 4),
  ...family("bells").slice(0, 4),
];
const layeredKeys = family("keys").slice(0, 4);
for (let i = 0; i < donors.length; i++)
  melodySchedule[melodySchedule.lastIndexOf(donors[i])] =
    layeredKeys[Math.floor(i / 2)];
const melodyUses = new Map();
const melodyChoices = melodySchedule.map((sound) => {
  const occurrence = melodyUses.get(sound.key) || 0;
  melodyUses.set(sound.key, occurrence + 1);
  return { sound, occurrence };
});
export const ORIGINAL_VARIANTS = [
  "Studio Pocket",
  "Melodic Motion",
  "Texture & Fills",
];
const flatten = (steps) =>
  steps.map((n) => (n === 2 ? "X" : n ? "x" : ".")).join("");
const repeat = (positions) =>
  Array.from({ length: 64 }, (_, n) => (positions.includes(n % 16) ? 1 : 0));
const equivalence = new Map(Object.entries(OB1).map(([key, id]) => [id, key]));
function role(channel) {
  const label =
    `${channel.source.label} ${channel.source.value} ${equivalence.get(channel.source.value) || ""}`.toLowerCase();
  if (/bass|rumble|wub|drop/.test(label)) return "bass";
  if (/kick|surdo/.test(label)) return "kick";
  if (/snare|clap|rim|caixa/.test(label)) return "backbeat";
  if (/hat|ride|shaker|ganza|texture/.test(label)) return "top";
  return "colour";
}
function groove(base, kind, fallback) {
  const channel = base.channels.find((c) => role(c) === kind);
  return channel ? expandPattern(channel.pattern) : repeat(fallback);
}
function source(sound, occurrence) {
  const roots = sound.roots.length ? sound.roots : [null],
    root = roots[occurrence % roots.length],
    velocity = sound.velocities[occurrence % sound.velocities.length],
    m = ONBOARD_MANIFEST.assets[assetKey(sound, root, velocity)];
  return {
    type: "synth",
    value: sound.key,
    label: sound.label,
    rootMidi: root,
    velocityLayer: velocity,
    version: sound.version,
    audioSha256: m.audioSha256,
  };
}
function track(sound, steps, volume, occurrence, extra = {}) {
  return {
    source: source(sound, occurrence),
    name: sound.label,
    kind: "hit",
    pattern: flatten(steps),
    volume,
    ...extra,
  };
}
function pick(role, q) {
  const list = EMBEDDED_BEAT_PALETTES[role];
  return {
    sound: list[q % list.length],
    occurrence: Math.floor(q / list.length),
  };
}
const melodicEvents = (family, index, v, sparse) => {
  let hits =
    family === "leads"
      ? [0, 6, 10]
      : family === "bells"
        ? [3, 11]
        : family === "keys"
          ? [2, 6, 10, 14]
          : [1, 5, 9, 13];
  if (v === 1) hits = family === "keys" ? [0, 3, 8, 11] : [1, 3, 6, 9, 11, 14];
  if (v === 2) hits = family === "leads" ? [0, 10] : [2, 7, 14];
  const out = repeat(hits);
  if (sparse) for (let n = 0; n < 64; n++) if (n % 16 >= 8) out[n] = 0;
  // Four-bar phrasing: gaps, pickups and a unique position/accents for each base.
  out[16 + hits[0]] = 0;
  out[48 + (index % 16)] = 2;
  out[32 + ((index * 5 + v * 3) % 16)] = 1;
  return out;
};
export function embeddedArrangement(base, index, v, { mixed = false } = {}) {
  const q = index * 3 + v,
    sparse = base.genre === "Ambient",
    tonic = q % 6;
  const kick = groove(base, "kick", sparse ? [0, 8] : [0, 4, 8, 12]);
  const back = groove(base, "backbeat", [4, 12]);
  const top = groove(base, "top", [2, 6, 10, 14]);
  if (v === 1) {
    kick[54] = 1;
    kick[62] = 1;
    back[59] = 1;
    back[63] = 1;
    for (let n = 1; n < 64; n += 8) top[n] = 1;
  }
  if (v === 2) {
    kick[60] = 0;
    kick[61] = 1;
    back[57] = 1;
    back[62] = 1;
    for (let n = 48; n < 64; n++) top[n] = n % 3 ? 1 : 0;
  }
  const texture = pick("texture", q),
    chord =
      texture.sound.family === "chords"
        ? texture.sound
        : family("chords")[(index + v) % 12];
  const voicing = chord.recipe.voicing;
  const degrees = voicing.includes(3)
    ? voicing.includes(6)
      ? [0, 3, 6, 9, 12]
      : [0, 3, 5, 7, 10, 12]
    : voicing.includes(4)
      ? [0, 2, 4, 7, 9, 12]
      : [0, 2, 5, 7, 10, 12];
  const fifth = voicing.includes(6) ? 6 : 7;
  const bass = pick("bass", q),
    bsrc = source(bass.sound, bass.occurrence),
    bassRoot = bass.sound.family === "kit" ? 36 : bsrc.rootMidi;
  const bassNotes = [
    tonic + bassRoot - bsrc.rootMidi,
    tonic + bassRoot - bsrc.rootMidi,
    tonic + bassRoot - bsrc.rootMidi + fifth,
    tonic + bassRoot - bsrc.rootMidi + degrees[1],
  ];
  const bassSteps =
    v === 0
      ? kick.map((n, i) => (n && (i % 4 === 0 || i % 16 === 7) ? n : 0))
      : repeat(v === 1 ? [0, 3, 6, 8, 11, 14] : [0, 7, 10, 15]);
  if (!bassSteps.some(Boolean)) bassSteps[0] = 1;
  const color = pick("colour", q),
    colorSteps = repeat(v === 0 ? [7, 15] : v === 1 ? [3, 7, 10, 15] : [6, 14]);
  if (color.sound.tags.includes("sustain"))
    throw new Error("Percussion colour must be a hit.");
  if (/impact|spark|fill|crash|zap/i.test(color.sound.label)) {
    colorSteps.fill(0);
    colorSteps[0] = 1;
    colorSteps[32] = 1;
    colorSteps[63] = 2;
  } else {
    colorSteps[48 + (index % 16)] = 2;
    colorSteps[62] = 1;
  }
  const channels = [
    ...["kick", "backbeat", "top"].map((role, i) => {
      const choice = pick(role, q);
      return track(
        choice.sound,
        [kick, back, top][i],
        [0.48, 0.3, 0.14][i] * (mixed ? 0.9 : 1),
        choice.occurrence,
      );
    }),
    track(color.sound, colorSteps, 0.13, color.occurrence, {
      ...(color.sound.rootMidi != null && {
        notes: [tonic, tonic + fifth, tonic, tonic + degrees[1]],
      }),
      fx: v === 2 ? { delay: 0.08 } : {},
    }),
    track(bass.sound, bassSteps, 0.3, bass.occurrence, {
      source: bsrc,
      notes: bassNotes,
      xfade: 12,
    }),
  ];
  for (let lane = 0; lane < 2; lane++) {
    const melodic = melodyChoices[q * 2 + lane],
      s = melodic.sound;
    const notes =
      v === 0
        ? [tonic, tonic + degrees[2], tonic + fifth, tonic + degrees[1]]
        : v === 1
          ? degrees.map((n) => n + tonic)
          : [tonic + fifth, tonic + degrees[1], tonic, tonic + 12];
    channels.push(
      track(
        s,
        melodicEvents(s.family, index + lane * 7, v, sparse),
        lane ? 0.12 : 0.16,
        melodic.occurrence,
        {
          notes,
          fx:
            v === 2
              ? { delay: 0.13 }
              : s.family === "keys"
                ? { reverb: 0.06 }
                : {},
          xfade: s.family === "leads" ? 15 : 0,
        },
      ),
    );
  }
  const texSteps = new Array(64).fill(0),
    isPad = texture.sound.family === "pads";
  if (isPad) {
    for (const step of v === 0 ? [0, 32] : v === 1 ? [0, 16, 32, 48] : [0])
      texSteps[step] = 1;
  } else
    for (let n = 0; n < 64; n++)
      if ((v === 0 ? [2, 10] : v === 1 ? [0, 6, 12] : [7]).includes(n % 16))
        texSteps[n] = 1;
  channels.push(
    track(texture.sound, texSteps, isPad ? 0.1 : 0.14, texture.occurrence, {
      notes: [tonic],
      ...(isPad && { gateSteps: v === 0 ? 28 : v === 1 ? 14 : 60 }),
      fx: !isPad && v === 2 ? { delay: 0.08 } : {},
    }),
  );
  return {
    channels,
    tonic,
    scale: degrees,
    mode: voicing.includes(3)
      ? "minor"
      : voicing.includes(4)
        ? "major"
        : "suspended",
    soundFamilies: [
      ...new Set(
        channels.map(
          (c) => ONBOARD_SOUNDS.find((s) => s.key === c.source.value).family,
        ),
      ),
    ],
  };
}
