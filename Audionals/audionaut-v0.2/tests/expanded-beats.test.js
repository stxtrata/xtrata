import { test } from "node:test";
import assert from "node:assert/strict";
import {
  BEAT_PRESETS,
  LEGACY_BEAT_PRESETS,
  expandPattern,
} from "../js/beats.js";
import {
  COMBINED_BEAT_PRESETS,
  EXPANDED_COMBINED_BEAT_PRESETS,
} from "../js/combined-beats.js";
import {
  ONBOARD_SOUNDS,
  SOUND_BY_KEY,
  assetKey,
} from "../js/onboard-catalog.js";
import { ONBOARD_MANIFEST as manifest } from "../js/onboard-manifest.js";
import { prepareBeatPreset } from "../js/l1-beat-loader.js";
const buffer = {
  duration: 5,
  length: 220500,
  sampleRate: 44100,
  numberOfChannels: 1,
};
const decode = async (source) => ({
  audioBuffer: buffer,
  soundMetadata:
    source.type === "synth"
      ? manifest.assets[
          assetKey(
            SOUND_BY_KEY[source.value],
            source.rootMidi ?? SOUND_BY_KEY[source.value].rootMidi,
            source.velocityLayer ?? 1,
          )
        ]
      : null,
});
const coverage = (presets) => {
  const sounds = Object.fromEntries(ONBOARD_SOUNDS.map((s) => [s.key, 0]));
  for (const p of presets)
    for (const c of p.channels)
      if (c.source.type === "synth") sounds[c.source.value]++;
  return sounds;
};
test("96 Original presets have distinct four-bar rhythms, preserve all base styles and cover the complete 144-sound bank", () => {
  assert.equal(BEAT_PRESETS.length, 96);
  assert.equal(LEGACY_BEAT_PRESETS.length, 32);
  assert.equal(new Set(BEAT_PRESETS.map((p) => p.id)).size, 96);
  assert.equal(
    new Set(BEAT_PRESETS.map((p) => p.channels.map((c) => c.pattern).join("|")))
      .size,
    96,
  );
  for (const base of LEGACY_BEAT_PRESETS) {
    const variations = BEAT_PRESETS.filter((p) => p.baseBeat === base.name);
    assert.equal(variations.length, 3);
    assert(
      variations.every(
        (p) => p.bpm === base.bpm && p.genre === base.genre && p.bars === 4,
      ),
    );
  }
  assert(Object.values(coverage(BEAT_PRESETS)).every((count) => count >= 3));
  const assets = new Set(
    BEAT_PRESETS.flatMap((p) =>
      p.channels.map((c) =>
        assetKey(
          SOUND_BY_KEY[c.source.value],
          c.source.rootMidi,
          c.source.velocityLayer,
        ),
      ),
    ),
  );
  assert.equal(assets.size, 184, "Every root/layer recording appears");
  for (const p of BEAT_PRESETS) {
    assert.equal(p.collection, "original");
    assert.equal(p.channels.length, 8);
    assert(
      p.channels.every(
        (c) => c.source.type === "synth" && SOUND_BY_KEY[c.source.value],
      ),
    );
    assert(p.channels.some((c) => c.notes));
    for (const c of p.channels) {
      assert.match(c.pattern, /^[.xX]{64}$/);
      assert(expandPattern(c.pattern).some(Boolean));
    }
  }
});
test("core Combined IDs and L1 layers survive while all 144 embedded sounds are distributed across its 96 enhanced presets", () => {
  assert.equal(COMBINED_BEAT_PRESETS.length, 96);
  assert.equal(EXPANDED_COMBINED_BEAT_PRESETS.length, 128);
  assert(Object.values(coverage(COMBINED_BEAT_PRESETS)).every((n) => n >= 3));
  const assets = new Set(
    COMBINED_BEAT_PRESETS.flatMap((p) =>
      p.channels
        .filter((c) => c.source.type === "synth")
        .map((c) =>
          assetKey(
            SOUND_BY_KEY[c.source.value],
            c.source.rootMidi,
            c.source.velocityLayer,
          ),
        ),
    ),
  );
  assert.equal(assets.size, 184);
  for (let index = 0; index < 32; index++)
    for (let v = 0; v < 3; v++) {
      const p = COMBINED_BEAT_PRESETS[index * 3 + v];
      assert.equal(p.id, `combined-${index}-${v}`);
      assert.equal(p.baseBeat, LEGACY_BEAT_PRESETS[index].name);
      assert.equal(
        p.channels.filter((c) => c.source.type === "ordinal").length,
        3,
      );
      assert.equal(
        p.channels.filter((c) => c.source.type === "synth").length,
        8,
      );
    }
  for (const family of [
    "bass",
    "plucks",
    "keys",
    "bells",
    "leads",
    "pads",
    "chords",
  ]) {
    const counts = ONBOARD_SOUNDS.filter((s) => s.family === family).map(
      (s) => coverage(COMBINED_BEAT_PRESETS)[s.key],
    );
    assert(
      Math.max(...counts) - Math.min(...counts) <= (family === "keys" ? 3 : 1),
      `${family}: uneven patch distribution`,
    );
  }
});
test("all 192 upgraded kits prepare editable MIDI-relative steps, actual roots/layers and sustain/crossfade bounds", async () => {
  for (const preset of [...BEAT_PRESETS, ...COMBINED_BEAT_PRESETS]) {
    const rows = await prepareBeatPreset(preset, { decode });
    for (const row of rows)
      for (const step of row.steps)
        if (step && typeof step === "object") {
          if (step.pitch != null) {
            assert(step.pitch >= 0.1 && step.pitch <= 4);
            if (row.result.soundMetadata)
              assert(
                Math.abs(
                  step.pitch -
                    2 **
                      ((step.sampleMidi - row.result.soundMetadata.rootMidi) /
                        12),
                ) < 1e-10,
              );
          }
          if (step.sampleMidi != null && row.def.source.type === "synth") {
            const pitchClass =
              (((step.sampleMidi - preset.tonic) % 12) + 12) % 12;
            assert(
              preset.scale?.some((n) => n % 12 === pitchClass) ||
                row.def.kind === "loop",
              `${preset.name}: out-of-palette note ${step.sampleMidi}`,
            );
          }
          if (step.gateSteps)
            assert(row.result.soundMetadata.loop && step.gateSteps <= 64);
          if (step.xfade) assert(step.xfade >= 0 && step.xfade <= 2000);
        }
  }
});
test("roots and soft/full layers of a repeated patch are decoded separately while identical variants share a request", async () => {
  const sound = ONBOARD_SOUNDS.find(
      (s) => s.family === "keys" && s.roots.length === 3,
    ),
    base = { type: "synth", value: sound.key, label: sound.label };
  let calls = 0;
  const preset = {
    ...BEAT_PRESETS[0],
    channels: [
      {
        source: { ...base, rootMidi: 48, velocityLayer: 0.55 },
        pattern: "x...............",
      },
      {
        source: { ...base, rootMidi: 60, velocityLayer: 1 },
        pattern: "....x...........",
      },
      {
        source: { ...base, rootMidi: 48, velocityLayer: 0.55 },
        pattern: "........x.......",
      },
    ],
  };
  const rows = await prepareBeatPreset(preset, {
    decode: async (source) => {
      calls++;
      return decode(source);
    },
  });
  assert.equal(calls, 2);
  assert.equal(rows[0].result.soundMetadata.rootMidi, 48);
  assert.equal(rows[1].result.soundMetadata.rootMidi, 60);
  assert.equal(rows[0].result.soundMetadata.velocityLayer, 0.55);
  assert.strictEqual(rows[0].result, rows[2].result);
});

test("saved sessions retain the upgraded beat ID and its kit size", async () => {
  const { store, makeProject } = await import("../js/state.js"),
    { exportProject, importProject } = await import("../js/persistence.js");
  for (const preset of [BEAT_PRESETS[95], COMBINED_BEAT_PRESETS[95]]) {
    store.project = makeProject();
    store.project.lastBeat = {
      id: preset.id,
      name: preset.name,
      collection: preset.collection,
    };
    store.project.lastPresetChannels = preset.channels.length;
    importProject(exportProject());
    assert.equal(store.project.lastBeat.id, preset.id);
    assert.equal(store.project.lastPresetChannels, preset.channels.length);
  }
});
