import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { gzipSync } from "node:zlib";
import {
  songToProject,
  expandSteps,
  sampleReference,
  LANDMARKS,
} from "../js/song-format.js";
import {
  fetchSong,
  auditionSong,
  stopSongAudition,
} from "../js/song-player.js";
import { engine } from "../js/engine.js";
import { store, makeProject, makeSequence } from "../js/state.js";
import { importProject, exportProject } from "../js/persistence.js";
const fixture = (name) =>
  JSON.parse(
    fs.readFileSync(new URL(`./fixtures/${name}.json`, import.meta.url)),
  );
const songId =
  "a449a3401142ce6118e13106dcaf61b7d17fb3cfadf26a5079154f9cca1862b7i0";
test("OG mute timeline matches totalStepCount, with one-based triggers", () => {
  const raw = fixture("og-cheese"),
    p = songToProject(raw, { endStep: 1030 });
  assert.equal(p.channels.length, 8);
  assert.equal(p.sequences.length, 17);
  assert.equal(p.bpm, 105);
  assert.equal(p.channels[0].source.type, "ordinal");
  assert.equal(p.songEndStep, 1030);
  raw.audxData.channels.forEach((c, ch) => {
    let muted = c.mute;
    for (let st = 0; st < 1030; st++) {
      if (c.toggleMuteSteps.includes(st)) muted = !muted;
      assert.equal(
        !!p.sequences[Math.floor(st / 64)].steps[ch][st % 64],
        !muted && c.triggers.includes((st % 64) + 1),
        `channel ${ch}, total step ${st}`,
      );
    }
  });
  assert.equal(p.sequences[0].steps[0][0], 0);
  assert.equal(p.sequences[2].steps[0][0], 1); // unmute at total counter 128 before trigger
});
test("TRUTH preserves compressed ranges, zero-based steps, pitch above four, trims and reversals", () => {
  const raw = fixture("truth"),
    p = songToProject(raw);
  assert.equal(p.channels.length, 16);
  assert.equal(p.sequences.length, 44);
  assert.equal(p.bpm, 120);
  assert.equal(p.channels[4].pitch, 5.96);
  assert.equal(p.channels[3].trimStart, raw["7"][3]["9"] / 100);
  assert.equal(p.channels[3].trimEnd, raw["7"][3]["10"] / 100);
  assert.equal(p.sequences[0].steps[0][42], 1);
  assert.equal(p.sequences[0].steps[0][41], 0);
  assert.deepEqual(p.sequences[1].steps[0][52], { v: 1, rev: true });
  const before = store.project;
  importProject(p);
  const saved = JSON.parse(exportProject());
  assert.equal(saved.channels[4].pitch, 5.96);
  assert(saved.playEmptySequences);
  assert.deepEqual(saved.sequences[1].steps[0][52], { v: 1, rev: true });
  store.project = before;
});
test("static artwork song preserves its 14 sequences and compressed range at 37–38", () => {
  const raw = fixture("on-day-one"),
    p = songToProject(raw);
  assert.equal(p.bpm, 100);
  assert.equal(p.sequences.length, 14);
  assert.equal(p.sequences[0].steps[3][37], 1);
  assert.equal(p.sequences[0].steps[3][38], 1);
  assert.equal(p.channels[5].pitch, 0.47);
  assert.equal(p.channels[5].trimStart, 0.885433);
});
test("invalid song ranges, unsupported sample references and oversized arrangements fail without loading a session", () => {
  assert.throws(() => expandSteps([{ r: [0, 100000] }]));
  assert.throws(() => expandSteps(["65r"]));
  assert.throws(() => sampleReference("javascript:alert(1)"));
  const raw = fixture("truth");
  raw["14"].s0.Z = { 15: [1] };
  assert.throws(() => songToProject(raw));
  const p = store.project;
  assert.throws(() => songToProject({ audxData: { channels: [] } }));
  assert.equal(store.project, p);
});
test("on-chain gzip reader uses the mapped instruction ID and leaves current project intact", async () => {
  const initial = globalThis.fetch,
    project = store.project;
  try {
    globalThis.fetch = async (url) => {
      assert(String(url).endsWith(LANDMARKS[songId].data));
      return new Response(gzipSync(JSON.stringify(fixture("truth"))));
    };
    const p = await fetchSong(songId);
    assert.equal(p.projectName, "TRUTH");
    assert.equal(p.songOrigin.inscription, songId);
    assert.equal(store.project, project);
  } finally {
    globalThis.fetch = initial;
  }
});
test("expanded gzip size is bounded and malformed content rejected", async () => {
  const initial = globalThis.fetch;
  try {
    globalThis.fetch = async () =>
      new Response(gzipSync(" ".repeat(4 * 1024 * 1024 + 1)));
    await assert.rejects(fetchSong(songId), /exceed/);
    globalThis.fetch = async () => new Response("not a song");
    await assert.rejects(fetchSong(songId));
  } finally {
    globalThis.fetch = initial;
  }
});
test("stopping while song samples load prevents late playback and preserves the session", async () => {
  const fetch = globalThis.fetch,
    context = engine.ensureContext,
    project = store.project;
  let release,
    started = 0,
    calls = 0;
  const bytes = Uint8Array.from([82, 73, 70, 70]).buffer;
  engine.ensureContext = () => ({
    resume: async () => {},
    decodeAudioData: async () => ({
      duration: 1,
      length: 1,
      numberOfChannels: 1,
      sampleRate: 1,
    }),
    createBufferSource: () => {
      started++;
      throw Error("late playback");
    },
  });
  try {
    globalThis.fetch = async () => {
      calls++;
      if (calls === 1)
        return new Response(JSON.stringify(fixture("og-cheese")));
      return new Promise(
        (resolve) => (release = () => resolve(new Response(bytes))),
      );
    };
    const id = Object.keys(LANDMARKS).find(
        (id) => LANDMARKS[id].endStep === 1030,
      ),
      pending = auditionSong(id);
    while (!release) await new Promise((resolve) => setTimeout(resolve, 1));
    stopSongAudition();
    release();
    await pending;
    assert.equal(started, 0);
    assert.equal(store.project, project);
  } finally {
    stopSongAudition();
    globalThis.fetch = fetch;
    engine.ensureContext = context;
  }
});
test("imported songs traverse empty rest sequences while normal patterns keep existing behaviour", () => {
  const before = store.project;
  store.project = makeProject();
  store.project.sequences = [makeSequence(), makeSequence(), makeSequence()];
  store.project.playEmptySequences = true;
  engine.currentStep = 63;
  engine.playingSequence = 0;
  engine.nextStepTime = 0;
  engine._advance();
  assert.equal(engine.playingSequence, 1);
  store.project.playEmptySequences = false;
  engine.currentStep = 63;
  engine.playingSequence = 0;
  engine._advance();
  assert.equal(engine.playingSequence, 0);
  store.project = before;
});
