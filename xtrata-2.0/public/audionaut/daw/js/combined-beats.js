// Built-in foundations + genuine Bitcoin percussion. Stable built-in keys can
// later point to L2 audio without changing the musical patterns or L1 provenance.
import { TONAL_BEAT_PRESETS } from "./tonal-beats.js";
import { LEGACY_BEAT_PRESETS as BEAT_PRESETS } from "./legacy-beats.js";
import { embeddedArrangement } from "./embedded-beat-arranger.js";
import { ONBOARD_SOUNDS } from "./onboard-catalog.js";
import { L1_BEAT_PRESETS, L1_SAMPLES } from "./l1-beats.js";

export const BUILT_IN_BEAT_SOURCES = Object.fromEntries(
  ONBOARD_SOUNDS.map((s) => [
    s.key,
    { type: "synth", value: s.key, label: s.label },
  ]),
);
const repeat = (positions) =>
  Array.from({ length: 64 }, (_, step) =>
    positions.includes(step % 16) ? "x" : ".",
  ).join("");
const fallbackGenres = {
  Latin: "Samba",
  Garage: "UK Garage",
  Minimal: "Microhouse",
  Experimental: "Experimental",
  Ambient: "Ambient",
};
const suitableL1 = (base) =>
  L1_BEAT_PRESETS.find(
    (p) => p.genre === (fallbackGenres[base.genre] || base.genre),
  ) || L1_BEAT_PRESETS.find((p) => p.genre === "Experimental");
const variants = ["OB1 Pocket", "Percussion Weave", "Loop & Hits"];

export const COMBINED_BEAT_PRESETS = BEAT_PRESETS.flatMap((base, index) =>
  variants.map((variant, v) => {
    const l1 = suitableL1(base);
    const arrangement = embeddedArrangement(base, index, v, { mixed: true });
    const channels = arrangement.channels;
    const layer = (sound, events, volume, extra = {}) => ({
      ...sound,
      name: `L1 ${sound.source.label}`,
      pattern: events,
      volume,
      pitch: 1,
      fx: {},
      ...extra,
    });
    if (v === 0) {
      channels.push(
        layer(l1.channels[1], repeat([4, 12]), 0.24, { fx: { reverb: 0.1 } }),
      );
      channels.push(layer(l1.channels[4], l1.channels[4].pattern, 0.22));
      channels.push(layer(L1_SAMPLES.hatClosed, repeat([3, 7, 11, 15]), 0.16));
    } else if (v === 1) {
      channels.push(layer(L1_SAMPLES.hatClosed, l1.channels[2].pattern, 0.18));
      channels.push(
        layer(l1.channels[4], l1.channels[4].pattern, 0.28, {
          fx: { delay: 0.15 },
        }),
      );
      const colour = [L1_SAMPLES.scratch, L1_SAMPLES.glock, L1_SAMPLES.crash][
        index % 3
      ];
      channels.push(
        layer(colour, l1.channels[5].pattern, 0.23, {
          trimSeconds: [0, index % 3 === 0 ? 0.3 : index % 3 === 1 ? 0.6 : 0.8],
          fx: { delay: 0.18, reverb: 0.12 },
          reverse: index % 3 === 0 && index % 2 === 1,
        }),
      );
    } else {
      const loop = index % 2 ? L1_SAMPLES.stepDrums : L1_SAMPLES.eightBit;
      channels.push(
        layer(loop, repeat(loop.loopBeats === 2 ? [0, 8] : [0]), 0.16, {
          pitch: base.bpm / loop.sourceBpm,
          fx: { filter: "hp", cutoff: 600 },
        }),
      );
      channels.push(
        layer(
          L1_SAMPLES.snareHard,
          Array.from({ length: 64 }, (_, i) =>
            [39, 55, 58, 60, 62, 63].includes(i) ? "x" : ".",
          ).join(""),
          0.26,
        ),
      );
      channels.push(
        layer(
          L1_SAMPLES.crash,
          Array.from({ length: 64 }, (_, i) =>
            [0, 32].includes(i) ? "x" : ".",
          ).join(""),
          0.18,
          { trimSeconds: [0, 0.8] },
        ),
      );
    }
    return {
      id: `combined-${index}-${v}`,
      name: `${base.name} · ${variant}`,
      genre: base.genre,
      bpm: base.bpm,
      swing: base.swing || 0,
      bars: 4,
      collection: "combined",
      baseBeat: base.name,
      channels,
      soundFamilies: arrangement.soundFamilies,
      scale: arrangement.scale,
      mode: arrangement.mode,
      tonic: arrangement.tonic,
      description: `${v === 0 ? "Tight OB1 backbeat and offbeat ticks" : v === 1 ? "Syncopated Bitcoin percussion and colour accents" : "Tempo-matched L1 drum loop, snare fills and crash accents"} with an eight-part embedded ensemble: bass, melody, percussion and ${arrangement.mode} textures.`,
    };
  }),
);

// The 32 tonal ensembles are woven with L1 percussion alongside the 96 core combinations.
export const EXPANDED_COMBINED_BEAT_PRESETS = [
  ...COMBINED_BEAT_PRESETS,
  ...TONAL_BEAT_PRESETS.map((p, i) => ({
    ...p,
    id: `combined-tonal-${i + 1}`,
    collection: "combined",
    name: `${p.name} · L1 weave`,
    description:
      "Embedded melodic ensemble with genuine OB1 percussion. Local tonal audio is packaged for future L2 publication.",
    channels: [
      ...p.channels,
      {
        ...L1_SAMPLES.hatClosed,
        name: "L1 OB1 ticks",
        pattern: repeat([3, 7, 11, 15]),
        volume: 0.14,
      },
      {
        ...L1_SAMPLES.clap808,
        name: "L1 OB1 clap",
        pattern: repeat([4, 12]),
        volume: 0.17,
      },
    ],
  })),
];
