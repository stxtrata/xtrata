import { test } from "node:test";
import assert from "node:assert/strict";
import { L1_BEAT_PRESETS, L1_SAMPLES } from "../js/l1-beats.js";
import { OB1, expandPattern } from "../js/beats.js";
import { SAMPLE_LIBRARY } from "../js/library.js";
import { prepareL1Beat, loadL1Beat } from "../js/l1-beat-loader.js";
import { store, makeProject, stepVal } from "../js/state.js";
import { engine } from "../js/engine.js";
const audioBuffer = {
  duration: 5,
  sampleRate: 1000,
  length: 5000,
  numberOfChannels: 1,
};
const decode = async () => ({ audioBuffer, sampleName: "fixture" });

test("L1 collection has 96 distinct editable beats, uses all catalogued OB1s and only curated audio inscriptions", () => {
  const known = new Set(
    SAMPLE_LIBRARY.filter((g) => !g.category.includes("historic"))
      .flatMap((g) => g.items)
      .filter((s) => s.type !== "synth")
      .map((s) => s.id),
  );
  assert.equal(L1_BEAT_PRESETS.length, 96);
  assert.equal(new Set(L1_BEAT_PRESETS.map((p) => p.id)).size, 96);
  const used = new Set();
  const patterns = new Set();
  for (const preset of L1_BEAT_PRESETS) {
    assert.equal(preset.bars, 4);
    assert(preset.bpm >= 60 && preset.bpm <= 200);
    patterns.add(preset.channels.map((c) => c.pattern).join("|"));
    for (const channel of preset.channels) {
      assert.equal(channel.source.type, "ordinal");
      assert(known.has(channel.source.value));
      used.add(channel.source.value);
      assert.match(channel.pattern, /^[.xX]{64}$/);
      assert(expandPattern(channel.pattern).some(Boolean));
    }
  }
  assert.equal(used.size, 24);
  for (const id of Object.values(OB1)) assert(used.has(id));
  assert.equal(patterns.size, 96);
});
test("short loops fill exact musical spans after tempo matching and bass notes remain editable", async () => {
  for (const preset of L1_BEAT_PRESETS) {
    const prepared = await prepareL1Beat(preset, { decode });
    for (const channel of prepared) {
      assert(
        channel.trimStart >= 0 &&
          channel.trimEnd <= 1 &&
          channel.trimEnd > channel.trimStart,
      );
      if (channel.def.kind === "loop")
        assert(
          Math.abs(
            (channel.trimEnd * 5) / channel.def.pitch -
              (channel.def.loopBeats * 60) / preset.bpm,
          ) < 1e-10,
        );
      if (channel.def.notes)
        assert(
          channel.steps.some(
            (step) =>
              stepVal(step) &&
              typeof step === "object" &&
              Number.isFinite(step.pitch),
          ),
        );
    }
  }
});
test("L1 loading shares repeated sources and limits simultaneous decodes to two", async () => {
  let active = 0,
    maximum = 0,
    count = 0;
  const preset = {
    ...L1_BEAT_PRESETS[0],
    channels: [...L1_BEAT_PRESETS[0].channels, L1_BEAT_PRESETS[0].channels[0]],
  };
  await prepareL1Beat(preset, {
    decode: async () => {
      count++;
      maximum = Math.max(maximum, ++active);
      await new Promise((r) => setTimeout(r, 2));
      active--;
      return { audioBuffer };
    },
  });
  assert.equal(count, 6);
  assert.equal(maximum, 2);
});
test("failed L1 download preserves the complete session and never substitutes a generated sample", async () => {
  store.project = makeProject();
  store.project.channels[0].source = { type: "synth", value: "kick-808" };
  store.seq.steps[0][0] = 2;
  const before = JSON.stringify(store.project);
  await assert.rejects(
    loadL1Beat(L1_BEAT_PRESETS[0], {
      decode: async () => {
        throw Error("Gateway unavailable");
      },
    }),
    /Gateway unavailable/,
  );
  assert.equal(JSON.stringify(store.project), before);
});
test("cancellation and session edits during loading cannot overwrite a session", async () => {
  store.project = makeProject();
  const before = JSON.stringify(store.project),
    controller = new AbortController();
  await assert.rejects(
    loadL1Beat(L1_BEAT_PRESETS[0], {
      signal: controller.signal,
      decode: async () => {
        controller.abort();
        return { audioBuffer };
      },
    }),
    { name: "AbortError" },
  );
  assert.equal(JSON.stringify(store.project), before);
  let changed = false;
  await assert.rejects(
    loadL1Beat(L1_BEAT_PRESETS[0], {
      decode: async () => {
        if (!changed) {
          store.project.projectName = "User edit";
          changed = true;
        }
        return { audioBuffer };
      },
    }),
    /session changed/,
  );
  assert.equal(store.project.projectName, "User edit");
  assert.equal(store.project.channels[0].source, null);
});
test("successful L1 load replaces the current kit, mutes other tracks and preserves their editable data", async () => {
  store.project = makeProject();
  store.seq.steps[9][3] = 2;
  store.project.lastPresetChannels = 12;
  store.seq.notes[0] = [{ step: 0, pitch: 60, dur: 1 }];
  store.channel(0).solo = true;
  for (const method of [
    "stop",
    "stopPreview",
    "ensureChannelChains",
    "rebuildInserts",
    "syncDelayToBpm",
  ])
    engine[method] = () => {};
  const preset = L1_BEAT_PRESETS.find((p) =>
    p.channels.some((c) => c.kind === "loop"),
  );
  await loadL1Beat(preset, { decode });
  assert.equal(store.project.bpm, preset.bpm);
  assert.equal(store.project.lastBeat.collection, "l1");
  assert.equal(store.project.continuous, false);
  for (let i = 0; i < preset.channels.length; i++) {
    assert.equal(store.channel(i).source.type, "ordinal");
    assert.equal(store.channel(i).mute, false);
    assert.equal(store.channel(i).solo, false);
  }
  assert.equal(store.channel(9).mute, true);
  assert.equal(store.seq.steps[9][3], 2);
  assert(store.project.instruments.every((i) => i.mute));
  assert.equal(store.seq.notes[0][0].pitch, 60);
});

test("combined collection gives each original beat three distinct arrangements with real L1 and valid built-in sources", async () => {
  const { COMBINED_BEAT_PRESETS } = await import("../js/combined-beats.js");
  const { LEGACY_BEAT_PRESETS: BEAT_PRESETS } = await import(
    "../js/legacy-beats.js"
  );
  const { SOUND_BY_KEY } = await import("../js/onboard-catalog.js");
  const { prepareBeatPreset } = await import("../js/l1-beat-loader.js");
  assert.equal(COMBINED_BEAT_PRESETS.length, 96);
  assert.equal(new Set(COMBINED_BEAT_PRESETS.map((p) => p.id)).size, 96);
  const used = new Set();
  for (const base of BEAT_PRESETS) {
    const presets = COMBINED_BEAT_PRESETS.filter(
      (p) => p.baseBeat === base.name,
    );
    assert.equal(presets.length, 3);
    assert.equal(
      new Set(presets.map((p) => p.channels.map((c) => c.pattern).join("|")))
        .size,
      3,
    );
  }
  for (const preset of COMBINED_BEAT_PRESETS) {
    assert(preset.channels.some((c) => c.source.type === "ordinal"));
    assert(preset.channels.some((c) => c.source.type === "synth"));
    for (const c of preset.channels) {
      assert.match(c.pattern, /^[.xX]{64}$/);
      if (c.source.type === "synth") {
        assert(SOUND_BY_KEY[c.source.value]);
        used.add(c.source.value);
      } else assert.match(c.source.value, /^[a-f0-9]{64}i\d+$/);
    }
    const prepared = await prepareBeatPreset(preset, { decode });
    for (const c of prepared)
      if (c.def.kind === "loop")
        assert(
          Math.abs(
            ((c.trimEnd - c.trimStart) * 5) / c.def.pitch -
              (c.def.loopBeats * 60) / preset.bpm,
          ) < 1e-10,
        );
  }
  assert.equal(used.size, 144);
  await assert.rejects(
    prepareL1Beat(COMBINED_BEAT_PRESETS[0], { decode }),
    /Choose an L1/,
  );
  await assert.rejects(
    prepareBeatPreset(
      {
        ...COMBINED_BEAT_PRESETS[0],
        channels: COMBINED_BEAT_PRESETS[0].channels.filter(
          (c) => c.source.type === "synth",
        ),
      },
      { decode },
    ),
    /both L1/,
  );
});

test("combined loading preserves a session on failed L1 audio and saves both source types after success", async () => {
  const { COMBINED_BEAT_PRESETS } = await import("../js/combined-beats.js");
  const { loadBeatPreset } = await import("../js/l1-beat-loader.js");
  const { exportProject, importProject } = await import("../js/persistence.js");
  store.project = makeProject();
  store.seq.steps[13][5] = 2;
  const before = JSON.stringify(store.project);
  await assert.rejects(
    loadBeatPreset(COMBINED_BEAT_PRESETS[0], {
      decode: async (source) => {
        if (source.type === "ordinal")
          throw Error("Bitcoin source unavailable");
        return { audioBuffer };
      },
    }),
    /Bitcoin source unavailable/,
  );
  assert.equal(JSON.stringify(store.project), before);
  for (const method of [
    "stop",
    "stopPreview",
    "ensureChannelChains",
    "rebuildInserts",
    "syncDelayToBpm",
  ])
    engine[method] = () => {};
  await loadBeatPreset(COMBINED_BEAT_PRESETS[2], { decode });
  assert.equal(store.project.lastBeat.collection, "combined");
  assert.equal(store.channel(13).mute, true);
  assert.equal(store.seq.steps[13][5], 2);
  const saved = exportProject();
  importProject(saved);
  assert(store.project.channels.some((c) => c.source?.type === "ordinal"));
  assert(store.project.channels.some((c) => c.source?.type === "synth"));
  assert.equal(store.seq.steps[13][5], 2);
});

test("loading a beat while playing preserves the scheduler, playhead and pending beat time", async () => {
  const { loadBeatPreset } = await import("../js/l1-beat-loader.js");
  const { BEAT_PRESETS } = await import("../js/beats.js");
  store.project = makeProject();
  engine.isPlaying = true;
  engine.currentStep = 23;
  engine.playingSequence = 0;
  engine.nextStepTime = 12.345;
  const timer = Symbol("running scheduler");
  engine.timer = timer;
  let stops = 0;
  engine.stop = () => {
    stops++;
    engine.isPlaying = false;
    engine.currentStep = 0;
  };
  try {
    await loadBeatPreset(BEAT_PRESETS[0], { decode });
    assert.equal(stops, 0);
    assert.equal(engine.isPlaying, true);
    assert.equal(engine.currentStep, 23);
    assert.equal(engine.nextStepTime, 12.345);
    assert.equal(engine.timer, timer);
    assert.equal(store.project.lastBeat.collection, "original");
    assert.equal(store.project.bpm, BEAT_PRESETS[0].bpm);
  } finally {
    engine.isPlaying = false;
  }
});
test("automatic sequence advancement during kit loading is allowed without losing the running clock", async () => {
  const { loadBeatPreset } = await import("../js/l1-beat-loader.js");
  const { makeSequence } = await import("../js/state.js");
  store.project = makeProject();
  store.project.sequences.push(makeSequence());
  engine.isPlaying = true;
  engine.playingSequence = 0;
  engine.currentStep = 4;
  let advanced = false;
  try {
    await loadBeatPreset(L1_BEAT_PRESETS[0], {
      decode: async () => {
        if (!advanced) {
          advanced = true;
          engine.playingSequence = 1;
          store.selectSequence(1);
        }
        return { audioBuffer };
      },
    });
    assert.equal(store.project.currentSequence, 1);
    assert(store.seq.steps[0].some(Boolean));
    assert(store.project.sequences[0].steps[0].every((s) => !s));
    assert.equal(engine.isPlaying, true);
    assert.equal(engine.currentStep, 4);
  } finally {
    engine.isPlaying = false;
  }
});
test("stopping during a pending load is respected and a manual sequence change still cancels assignment", async () => {
  const { loadBeatPreset } = await import("../js/l1-beat-loader.js");
  const { makeSequence } = await import("../js/state.js");
  store.project = makeProject();
  engine.isPlaying = true;
  let stops = 0;
  engine.stop = () => {
    stops++;
    engine.isPlaying = false;
  };
  await loadBeatPreset(L1_BEAT_PRESETS[0], {
    decode: async () => {
      engine.isPlaying = false;
      return { audioBuffer };
    },
  });
  assert.equal(engine.isPlaying, false);
  assert.equal(stops, 1);
  store.project = makeProject();
  store.project.sequences.push(makeSequence());
  engine.isPlaying = true;
  engine.playingSequence = 0;
  try {
    await assert.rejects(
      loadBeatPreset(L1_BEAT_PRESETS[0], {
        decode: async () => {
          store.selectSequence(1);
          return { audioBuffer };
        },
      }),
      /session changed/,
    );
    assert.equal(store.channel(0).source, null);
  } finally {
    engine.isPlaying = false;
  }
});

test("muting an instrument silences its existing output and unmuting restores its level", () => {
  store.project = makeProject();
  const oldGains = engine.instrumentGains,
    oldContext = engine.ctx,
    values = [];
  engine.instrumentGains = [
    { gain: { setTargetAtTime: (value) => values.push(value) } },
  ];
  engine.ctx = { currentTime: 0 };
  try {
    store.instrument(0).mute = true;
    engine.setInstrumentVolume(0, 0.8);
    store.instrument(0).mute = false;
    engine.setInstrumentVolume(0, 0.8);
    assert.deepEqual(values, [0, 0.8]);
  } finally {
    engine.instrumentGains = oldGains;
    engine.ctx = oldContext;
  }
});
