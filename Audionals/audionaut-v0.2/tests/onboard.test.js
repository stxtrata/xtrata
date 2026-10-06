import { test } from "node:test";
import assert from "node:assert/strict";
import {
  ONBOARD_SOUNDS,
  SOUND_BY_KEY,
  assetKey,
  noteRate,
} from "../js/onboard-catalog.js";
import { ONBOARD_MANIFEST as manifest } from "../js/onboard-manifest.js";
import {
  onboardVariant,
  validateSoundMetadata,
  sustainDuration,
} from "../js/onboard-library.js";
import {
  validateL2Manifest,
  migrateOnboardToL2,
} from "../js/l2-sound-manifest.js";
import { TONAL_BEAT_PRESETS } from "../js/tonal-beats.js";
import { EXPANDED_COMBINED_BEAT_PRESETS } from "../js/combined-beats.js";
import { prepareBeatPreset } from "../js/l1-beat-loader.js";
import { encodeWav } from "../js/audio-utils.js";
import { store, makeProject } from "../js/state.js";
import { importProject, exportProject } from "../js/persistence.js";
const buffer = {
  duration: 4,
  length: 400,
  sampleRate: 100,
  numberOfChannels: 1,
  getChannelData: () =>
    Float32Array.from(
      { length: 400 },
      (_, n) => Math.sin((n * Math.PI) / 5) * 0.5,
    ),
};
test("144 named versioned patches have the planned family counts and 184 canonical assets", () => {
  assert.equal(ONBOARD_SOUNDS.length, 144);
  assert.equal(new Set(ONBOARD_SOUNDS.map((s) => s.key)).size, 144);
  const counts = {
    kit: 24,
    bass: 16,
    plucks: 16,
    keys: 16,
    bells: 12,
    leads: 12,
    pads: 12,
    chords: 12,
    percussion: 24,
  };
  for (const [family, count] of Object.entries(counts))
    assert.equal(
      ONBOARD_SOUNDS.filter((s) => s.family === family).length,
      count,
    );
  assert.equal(Object.keys(manifest.assets).length, 184);
  assert.equal(
    new Set(Object.values(manifest.assets).map((m) => m.audioSha256)).size,
    184,
    "Each recording has distinct audio bytes",
  );
  for (const s of ONBOARD_SOUNDS)
    for (const root of s.roots.length ? s.roots : [null])
      for (const v of s.velocities) {
        const m = manifest.assets[assetKey(s, root, v)];
        assert(m);
        assert.equal(m.rootMidi, root);
        assert.equal(m.sampleRate, 44100);
        assert.match(m.audioSha256, /^[a-f0-9]{64}$/);
        assert.equal(m.generator, s.recipe.engine);
        assert(m.peak <= 0.708);
      }
});
test("variant and metadata validation refuse missing roots, altered hashes and mismatched durations", () => {
  const s = ONBOARD_SOUNDS.find((s) => s.family === "keys"),
    source = { type: "synth", value: s.key };
  const v = onboardVariant(source),
    m = manifest.assets[v.id];
  assert.equal(v.root, 60);
  assert.equal(
    onboardVariant({ ...source, rootMidi: 48, velocityLayer: 0.55 }).root,
    48,
  );
  assert.throws(() => onboardVariant({ ...source, rootMidi: 61 }));
  assert.throws(() =>
    onboardVariant({ ...source, audioSha256: "0".repeat(64) }),
  );
  assert.throws(() =>
    validateSoundMetadata({ ...m, audioSha256: "0".repeat(64) }),
  );
  assert.throws(() => validateSoundMetadata(m, m.duration + 1));
  assert.equal(validateSoundMetadata(m, m.duration).soundId, s.soundId);
  assert.equal(noteRate(72, 60), 2);
  assert.equal(noteRate(48, 60), 0.5);
});
test("sustain gating agrees with WAV length and falls back to one-shot for reverse or excluded loops", async () => {
  const c = {
    soundMetadata: { loop: { start: 1, end: 2 } },
    gateSteps: 16,
    trimStart: 0,
    trimEnd: 1,
    reverse: false,
  };
  assert.equal(sustainDuration(c, null, buffer, 120), 2.08);
  assert.equal(sustainDuration(c, { gateSteps: 8 }, buffer, 120), 1.08);
  assert.equal(sustainDuration(c, { rev: true }, buffer, 120), null);
  assert.equal(sustainDuration(c, { trimEnd: 0.2 }, buffer, 120), null);
  const bytes = new DataView(
    await encodeWav(buffer, {
      pitch: 2,
      loop: c.soundMetadata.loop,
      sustainSeconds: 2.08,
    }).arrayBuffer(),
  );
  assert.equal(bytes.getUint32(40, true), 416);
  assert.equal(bytes.getInt16(44, true), 0);
});
test("save/reopen retains root identity, gates and per-step sample notes", () => {
  store.project = makeProject();
  const m = Object.values(manifest.assets).find((m) => m.category === "pads");
  Object.assign(store.channel(0), {
    source: {
      type: "synth",
      value: m.key,
      rootMidi: m.rootMidi,
      velocityLayer: 1,
    },
    soundMetadata: m,
    gateSteps: 32,
    sampleMidi: 48,
  });
  store.seq.steps[0][0] = { v: 1, pitch: 2, sampleMidi: 60, gateSteps: 16 };
  importProject(exportProject());
  assert.equal(store.channel(0).soundMetadata.audioSha256, m.audioSha256);
  assert.equal(store.channel(0).gateSteps, 32);
  assert.equal(store.seq.steps[0][0].sampleMidi, 60);
  assert.equal(store.seq.steps[0][0].gateSteps, 16);
});
test("tonal and expanded combined presets prepare all new roles with canonical onboard sources", async () => {
  assert.equal(TONAL_BEAT_PRESETS.length, 32);
  assert.equal(EXPANDED_COMBINED_BEAT_PRESETS.length, 128);
  assert.equal(
    new Set(EXPANDED_COMBINED_BEAT_PRESETS.map((p) => p.id)).size,
    128,
  );
  for (const p of TONAL_BEAT_PRESETS) {
    const prepared = await prepareBeatPreset(p, {
      decode: async (source) => ({
        audioBuffer: buffer,
        soundMetadata: manifest.assets[onboardVariant(source).id],
      }),
    });
    assert.equal(prepared.length, 8);
    assert(prepared.some((c) => c.result.soundMetadata.loop));
    assert(prepared.some((c) => c.steps.some((s) => s?.sampleMidi != null)));
    for (const c of p.channels) assert(SOUND_BY_KEY[c.source.value]);
  }
  for (const p of EXPANDED_COMBINED_BEAT_PRESETS.slice(96)) {
    assert.equal(p.collection, "combined");
    assert(p.channels.some((c) => c.source.type === "ordinal"));
    assert(p.channels.some((c) => SOUND_BY_KEY[c.source.value]));
  }
});
test("L2 mapping accepts only real source fields and matching audio hashes; failed verification preserves the session", async () => {
  const m = Object.values(manifest.assets)[0],
    valid = {
      format: "audionaut-l2-sounds/1",
      assets: [
        {
          assetId: m.assetId,
          audioSha256: m.audioSha256,
          network: "mainnet",
          contractId: "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3",
          tokenId: "1120",
        },
      ],
    };
  assert.equal(validateL2Manifest(valid)[0].value, "1120");
  assert.throws(() =>
    validateL2Manifest({
      ...valid,
      assets: [{ ...valid.assets[0], audioSha256: "0".repeat(64) }],
    }),
  );
  assert.throws(() =>
    validateL2Manifest({
      ...valid,
      assets: [valid.assets[0], valid.assets[0]],
    }),
  );
  store.project = makeProject();
  const before = exportProject();
  await assert.rejects(
    migrateOnboardToL2(valid, {
      decode: async () => {
        throw Error("hash mismatch");
      },
    }),
    /hash mismatch/,
  );
  assert.equal(exportProject(), before);
});

test("successful verified L2 migration preserves regions, layers, gates and pitched steps", async () => {
  const m = Object.values(manifest.assets).find((m) => m.category === "pads"),
    mapping = {
      format: "audionaut-l2-sounds/1",
      assets: [
        {
          assetId: m.assetId,
          audioSha256: m.audioSha256,
          network: "mainnet",
          contractId: "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3",
          tokenId: "12345",
        },
      ],
    };
  store.project = makeProject();
  Object.assign(store.channel(0), {
    source: {
      type: "synth",
      value: m.key,
      rootMidi: m.rootMidi,
      velocityLayer: 1,
    },
    soundMetadata: m,
    trimStart: 0.1,
    trimEnd: 0.9,
    pitch: 0.5,
    gateSteps: 16,
    sampleName: "My pad",
  });
  store.seq.steps[0][5] = { v: 2, pitch: 2, sampleMidi: 60, gateSteps: 32 };
  const steps = JSON.stringify(store.seq.steps);
  const count = await migrateOnboardToL2(mapping, {
    decode: async () => ({ audioBuffer: buffer, soundMetadata: m }),
  });
  assert.equal(count, 1);
  assert.equal(store.channel(0).source.type, "xtrata");
  assert.equal(store.channel(0).source.verifiedAudio, true);
  assert.equal(
    store.channel(0).source.contractId,
    mapping.assets[0].contractId,
  );
  assert.equal(store.channel(0).pitch, 0.5);
  assert.equal(store.channel(0).gateSteps, 16);
  assert.equal(store.channel(0).trimStart, 0.1);
  assert.equal(JSON.stringify(store.seq.steps), steps);
});
