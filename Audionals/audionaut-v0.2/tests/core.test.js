import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import {
  prepareWordIndex,
  searchWordIndex,
  wordSelectionToRegion,
} from "../js/word-index.js";
import { audioAnalysis, encodeWav, reportCsv } from "../js/audio-utils.js";
import {
  ordinalId,
  resolveSource,
  extractAudio,
  loadSample,
  assignDecodedSample,
  reloadAllSamples,
} from "../js/loader.js";
import { store, makeProject } from "../js/state.js";
import { engine } from "../js/engine.js";
import { exportProject, importProject } from "../js/persistence.js";
import { importSelection } from "../js/source-actions.js";
import { searchCatalogue } from "../js/source-browser.js";
const id = "a".repeat(64) + "i0";
const buffer = {
  duration: 200,
  sampleRate: 10,
  numberOfChannels: 1,
  length: 2000,
  getChannelData: () => new Float32Array(2000).fill(0.5),
};
const context = { decodeAudioData: async () => buffer };
engine.ensureContext = () => context;
engine.silenceChannel = () => {};
const initialFetch = globalThis.fetch;
const payload = JSON.parse(
  fs.readFileSync(new URL("../data/word-index.json", import.meta.url)),
);
const index = prepareWordIndex(payload);
const catalogue = JSON.parse(
  fs.readFileSync(new URL("../data/l1-catalogue.json", import.meta.url)),
);
test("complete recovered datasets remain accessible", () => {
  assert.equal(index.length, 638);
  assert.equal(
    index.reduce((n, s) => n + s.words.length, 0),
    16125,
  );
  assert.equal(catalogue.entries.filter((x) => x.catalogued).length, 1621);
  assert.equal(new Set(catalogue.entries.map((x) => x.id)).size, 1682);
});
test("word search ignores case/punctuation and respects contiguous phrases and pages", () => {
  const source = prepareWordIndex({
    version: 1,
    sources: [
      {
        ordinalId: id,
        words: [
          ["Bitcoin,", 1, 2],
          ["is", 2, 3],
          ["forever!", 3, 4],
          ["Bitcoin", 5, 6],
        ],
      },
    ],
  });
  assert.equal(searchWordIndex(source, "BITCOIN", { limit: 1 }).total, 2);
  assert.equal(
    searchWordIndex(source, "bitcoin", { offset: 1 }).matches[0].start,
    5,
  );
  assert.equal(searchWordIndex(source, "bitcoin is forever").matches[0].end, 4);
  assert.equal(searchWordIndex(source, "bitcoin forever").total, 0);
});
test("catalogue filters IDs, named samples and transcript coverage", () => {
  assert.equal(searchCatalogue(catalogue.entries, "", "words").length, 638);
  assert(searchCatalogue(catalogue.entries, "808").length > 0);
  assert.equal(
    searchCatalogue(catalogue.entries, catalogue.entries[0].id).length,
    1,
  );
});
test("precise short word near the end of a long source is not expanded", () => {
  const region = wordSelectionToRegion(
    { ordinalId: id, start: 199.8, end: 199.9 },
    200,
  );
  assert(Math.abs(region.start * 200 - 199.8) < 1e-9);
  assert(Math.abs(region.end * 200 - 199.9) < 1e-9);
  assert.throws(() =>
    wordSelectionToRegion({ ordinalId: id, start: 200, end: 200.0005 }, 200),
  );
});
test("WAV encodes selection and rate into correct PCM duration", async () => {
  const result = await encodeWav(buffer, {
      start: 0,
      end: 1,
      pitch: 2,
    }).arrayBuffer(),
    v = new DataView(result);
  assert.equal(result.byteLength, 54);
  assert.equal(v.getUint32(24, true), 10);
  assert.equal(v.getUint32(40, true), 10);
  assert.equal(v.getInt16(44, true), 16383);
  assert.throws(() => encodeWav(buffer, { start: 200, end: 201 }));
});
test("analysis reports actual peak/RMS/DC and silence", () => {
  const a = audioAnalysis(buffer);
  assert.equal(a.peak, 0.5);
  assert.equal(a.rms, 0.5);
  assert.equal(a.dcOffset, 0.5);
  assert.equal(a.silencePercent, 0);
  assert.equal(reportCsv([['a"b', "line\nnext"]]), '"a""b","line\nnext"');
});
test("source URLs validate IDs and respect both gateway templates", () => {
  assert.equal(ordinalId("https://ordinals.com/content/" + id + "#t=1,2"), id);
  assert.throws(() => ordinalId("../escape"));
  assert(
    resolveSource({ type: "xtrata", value: "1120" }).includes("contractId="),
  );
  assert(
    resolveSource({ type: "xtrata", value: "1120" }).endsWith("tokenId=1120"),
  );
  assert.throws(() => resolveSource({ type: "url", value: "javascript:bad" }));
});
test("loader extracts raw audio and both Audional JSON fields", async () => {
  assert.equal(
    (await extractAudio(new Response(new Uint8Array([1, 2, 3])))).arrayBuffer
      .byteLength,
    3,
  );
  for (const field of ["audioData", "audioData_base64"]) {
    const r = await extractAudio(
      new Response(JSON.stringify({ [field]: "AQID", filename: "Voice" }), {
        headers: { "content-type": "application/json" },
      }),
    );
    assert.equal(r.sampleName, "Voice");
    assert.deepEqual([...new Uint8Array(r.arrayBuffer)], [1, 2, 3]);
  }
  await assert.rejects(() =>
    extractAudio(
      new Response("{}", { headers: { "content-type": "application/json" } }),
    ),
  );
});
test("word import persists precise channel and per-step selections across export/import", async () => {
  globalThis.fetch = async () => new Response(new Uint8Array([1, 2, 3]));
  store.project = makeProject();
  const selection = { ordinalId: id, text: "test", start: 199.8, end: 199.9 };
  await importSelection(0, { type: "ordinal", value: id }, selection);
  assert.equal(store.channel(0).trimStart, 199.8 / 200);
  assert.equal(store.seq.steps[0][0], 1);
  await importSelection(
    0,
    { type: "ordinal", value: id },
    { ...selection, text: "second", start: 0.5, end: 0.6 },
    { step: 4 },
  );
  store.seq.steps[0][4].rev = false;
  const saved = exportProject();
  assert.equal(JSON.parse(saved).format, "audionaut-workstation/2");
  importProject(saved);
  assert.equal(store.channel(0).wordSelection.text, "test");
  assert.equal(store.seq.steps[0][4].wordSelection.text, "second");
  assert.equal(store.seq.steps[0][4].rev, false);
  globalThis.fetch = initialFetch;
});
test("failed/cancelled imports leave project and channel unchanged", async () => {
  const before = exportProject(),
    controller = new AbortController();
  controller.abort();
  await assert.rejects(() =>
    importSelection(
      0,
      { type: "ordinal", value: id },
      { ordinalId: id, text: "bad", start: 0, end: 1 },
      { signal: controller.signal },
    ),
  );
  await assert.rejects(() =>
    importSelection(
      0,
      { type: "ordinal", value: id },
      { ordinalId: id, text: "bad", start: 199, end: 999 },
    ),
  );
  assert.equal(exportProject(), before);
});
test("source replacement clears stale per-step trims across sequences", () => {
  store.seq.steps[0][2] = {
    v: 2,
    trimStart: 0.5,
    trimEnd: 0.6,
    wordSelection: { text: "stale" },
  };
  assignDecodedSample(
    0,
    { type: "ordinal", value: id },
    { audioBuffer: buffer, sampleName: "New" },
  );
  assert.equal(store.seq.steps[0][2], 2);
  assert.equal(store.channel(0).wordSelection, null);
});
test("an async load cannot replace a newly opened project", async () => {
  let release;
  globalThis.fetch = () =>
    new Promise((resolve) => {
      release = resolve;
    });
  const loading = loadSample(0, {
    type: "url",
    value: "https://example.test/pending.wav",
  });
  store.project = makeProject();
  release(new Response(new Uint8Array([1, 2, 3])));
  await assert.rejects(() => loading, { name: "AbortError" });
  assert.equal(store.channel(0).source, null);
  globalThis.fetch = initialFetch;
});
test("X-native and legacy B64x projects import", () => {
  const old = makeProject();
  old.format = "audional-sequencer-x/1";
  old.sequences[0].steps[0][2] = 2;
  importProject(old);
  assert.equal(store.seq.steps[0][2], 2);
  importProject({
    projectBPM: 100,
    channelURLs: ["https://ordinals.com/content/" + id],
    projectSequences: { Sequence0: { ch0: { steps: [1, 5] } } },
  });
  assert.equal(store.project.bpm, 100);
  assert.equal(store.seq.steps[0][4], 1);
});
test("malformed projects are rejected without replacing the project", () => {
  const before = store.project;
  assert.throws(() => importProject({ unrelated: true }));
  assert.equal(store.project, before);
  const bad = makeProject();
  bad.format = "audional-sequencer-l1xl2/1";
  bad.bpm = Infinity;
  bad.channels[0].pitch = -10;
  bad.channels[0].trimStart = 2;
  bad.channels[0].trimEnd = -1;
  importProject(bad);
  assert.equal(store.project.bpm, 120);
  assert.equal(store.channel(0).pitch, 0.1);
  assert(store.channel(0).trimEnd > store.channel(0).trimStart);
});
test("embedded local files can be saved and restored without a picker", async () => {
  store.project = makeProject();
  const file = {
    name: "local.wav",
    size: 3,
    arrayBuffer: async () => new Uint8Array([1, 2, 3]).buffer,
  };
  await loadSample(0, { type: "file", file });
  const saved = exportProject();
  assert(JSON.parse(saved).channels[0].source.value.startsWith("data:audio/"));
  importProject(saved);
  await loadSample(0, store.channel(0).source, { preserve: true });
  assert.equal(engine.buffers[0].duration, 200);
});
test("pitched sampler schedules source duration exactly once", () => {
  store.project = makeProject();
  store.channel(0).pitch = 2;
  engine.buffers[0] = buffer;
  let scheduled;
  const gain = {
    gain: { value: 1, setValueAtTime() {}, linearRampToValueAtTime() {} },
    connect() {
      return this;
    },
    disconnect() {},
  };
  const source = {
    playbackRate: { value: 1 },
    connect() {
      return gain;
    },
    start(...args) {
      scheduled = args;
    },
    disconnect() {},
  };
  engine.ctx = {
    currentTime: 1,
    createBufferSource: () => source,
    createGain: () => gain,
  };
  engine.channelGains[0] = {};
  engine.trigger(0, 5);
  assert.deepEqual(scheduled, [5, 0, 200]);
  assert.equal(source.playbackRate.value, 2);
});
test("a slow sample load cannot overwrite a newer phrase import", async () => {
  store.project = makeProject();
  let release;
  globalThis.fetch = () =>
    new Promise((resolve) => {
      release = resolve;
    });
  const older = loadSample(0, {
    type: "url",
    value: "https://example.test/slow-voice.wav",
  });
  await importSelection(
    0,
    { type: "ordinal", value: id },
    { ordinalId: id, text: "Latest", start: 1, end: 2 },
  );
  release(new Response(new Uint8Array([1, 2, 3])));
  await assert.rejects(() => older, { name: "AbortError" });
  assert.equal(store.channel(0).wordSelection.text, "Latest");
  globalThis.fetch = initialFetch;
});
test("failed restoration of an old project cannot clear a new project buffer", async () => {
  store.project = makeProject();
  store.channel(0).source = {
    type: "url",
    value: "https://example.test/missing-old.wav",
  };
  let reject;
  globalThis.fetch = () =>
    new Promise((_, fail) => {
      reject = fail;
    });
  const older = reloadAllSamples();
  store.project = makeProject();
  engine.setBuffer(0, buffer);
  reject(new Error("Unavailable"));
  await older;
  assert.equal(engine.buffers[0], buffer);
  globalThis.fetch = initialFetch;
});
