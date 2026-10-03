import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import crypto from "node:crypto";
import {
  parseClipLibrary,
  migrateCatalogueV01,
  resolveClipRegion,
  editClip,
  toDraftManifest,
  copy,
  canonicalJSON,
  sha256Text,
  validateClipSnapshot,
} from "../js/clip-contract.js";
import {
  getClipLibrary,
  effectiveLibrary,
  refreshClipLibrary,
  saveClipEdits,
  createPersonalClip,
  exportClipLibrary,
  exportClipBackup,
  importClipBackup,
  searchClips,
  recordClipMeasurement,
  clearedClipExport,
} from "../js/clip-library.js";
import { fetchAndDecode, reloadAllSamples } from "../js/loader.js";
import {
  loadClip,
  prepareClip,
  previewClip,
  stopClipPreview,
} from "../js/clip-actions.js";
import {
  catalogueCacheStats,
  clearCatalogueCache,
  fetchCatalogueAudio,
} from "../js/catalogue-retrieval.js";
import { store, makeProject, makeSequence } from "../js/state.js";
import { engine } from "../js/engine.js";
import { exportProject, importProject } from "../js/persistence.js";
const read = (n) =>
  JSON.parse(
    fs.readFileSync(
      new URL("../reference/catalogue-lab-v0.2/" + n, import.meta.url),
    ),
  );
const catalogue = read("catalogue.json"),
  manifest = read("first_22_draft_manifest.json"),
  lib = parseClipLibrary(catalogue);
const source = lib.sources.find((s) => s.id === manifest.sources[0].id),
  clip = lib.clips.find((c) => c.sourceId === source.id);
const data = new Uint8Array([1, 2, 3, 4]),
  digest = crypto.createHash("sha256").update(data).digest("hex");
const buffer = {
  duration: 2,
  sampleRate: 48000,
  length: 96000,
  numberOfChannels: 2,
  getChannelData: () => new Float32Array(96000).fill(0.1),
};
engine.ensureContext = () => ({
  decodeAudioData: async () => buffer,
  resume: async () => {},
});
engine.silenceChannel = () => {};
const storage = new Map();
globalThis.localStorage = {
  getItem: (k) => storage.get(k) || null,
  setItem: (k, v) => storage.set(k, v),
  removeItem: (k) => storage.delete(k),
};
const initialFetch = globalThis.fetch;
test("both supplied v0.2 formats retain 195/22 identities, draft metadata, notes, rights and independent clips", () => {
  assert.equal(lib.sources.length, 195);
  assert.equal(lib.clips.length, 195);
  const m = parseClipLibrary(manifest);
  assert.equal(m.clips.length, 22);
  assert.equal(
    lib.sources.filter(
      (s) => s.reportedDuration != null && s.reportedDuration < 20,
    ).length,
    79,
  );
  assert.equal(m.clips[0].loop.tempoVerified, false);
  assert.equal(m.clips[0].loop.bpm, null);
  assert.equal(m.clips[0].region.endSeconds, null);
  assert.equal(m.clips[0].rights.status, "unknown");
  const d = copy(catalogue);
  d.assets[0].clips.push({
    ...copy(d.assets[0].clips[0]),
    clip_id: d.assets[0].record_id + ":clip:002",
  });
  d.assets[0].review.title = "Wrong active mirror";
  const l = parseClipLibrary(d);
  assert.notEqual(l.clips[0].title, "Wrong active mirror");
  l.clips[0].region.startSeconds = 1;
  assert.equal(l.clips[1].region.startSeconds, 0);
  const round = parseClipLibrary(toDraftManifest(l));
  assert.deepEqual(round.sources[0].note, l.sources[0].note);
  assert.deepEqual(round.sources[0].raw, l.sources[0].raw);
});
test("v0.1 migration is explicit and creates exactly one independent clip per original region", () => {
  const old = copy(catalogue);
  old.schema_version = "0.1.0";
  for (const s of old.assets) {
    delete s.clips;
    delete s.active_clip_id;
  }
  assert.throws(() => parseClipLibrary(old), /explicit/);
  const n = parseClipLibrary(old, { migrateV01: true });
  assert.equal(n.clips.length, 195);
  assert.equal(n.clips[0].id, n.sources[0].id + ":clip:001");
  assert.equal(old.schema_version, "0.1.0");
  assert.equal(migrateCatalogueV01(old).migration.from, "0.1.0");
});
test("invalid versions, duplicate identities, missing sources, hashes and finite bounds are rejected with record errors", () => {
  for (const mutate of [
    (d) => (d.version = "9.0.0"),
    (d) => d.sources.push(copy(d.sources[0])),
    (d) => (d.clips[0].source_id = "missing"),
    (d) => (d.sources[0].audio_payload_sha256 = "bad"),
    (d) => (d.clips[0].region.end_seconds = -1),
    (d) => (d.clips[0].region.start_seconds = Infinity),
    (d) => (d.clips[0].region.start_frame = 10),
    (d) => (d.clips[0].region.end_is_exclusive = false),
  ]) {
    const d = copy(manifest);
    mutate(d);
    assert.throws(() => parseClipLibrary(d));
  }
});
test("seconds and exclusive frames map from 44.1 kHz to 48 kHz without interpreting null as zero", () => {
  const c = copy(clip);
  c.region = {
    startSeconds: null,
    endSeconds: null,
    startFrame: 44100,
    endFrame: 66150,
    frameRate: 44100,
    endExclusive: true,
  };
  const p = resolveClipRegion(c, buffer);
  assert.equal(p.start, 1);
  assert.equal(p.end, 1.5);
  assert.equal(p.frameBasis.endFrame, 72000);
  assert.equal(p.frameBasisChanged, true);
  c.region = { startSeconds: 0, endSeconds: null };
  const full = resolveClipRegion(c, buffer);
  assert.equal(full.end, 2);
  assert.equal(full.endChoice, "project-local-decoded-end");
  assert.equal(resolveClipRegion(c, { ...buffer, numberOfChannels: 1 }).end, 2);
  assert.throws(() =>
    resolveClipRegion(
      { ...c, region: { startSeconds: 0, endSeconds: 3 } },
      buffer,
    ),
  );
  assert.throws(() =>
    resolveClipRegion(
      { ...c, loop: { startSeconds: 1, endSeconds: 3 } },
      buffer,
      { mode: "loop" },
    ),
  );
  assert.throws(() =>
    resolveClipRegion(c, buffer, { mode: "loop", reverse: true }),
  );
  assert.equal(resolveClipRegion(clip, buffer).mode, "one-shot");
});
test("timing and tuning edits invalidate only their relevant approvals; decode never grants reviews", () => {
  const c = copy(clip);
  c.loop.tempoVerified = c.loop.seamVerified = c.tuning.verified = true;
  c.review.auditioned = true;
  const edited = editClip(c, { region: { ...c.region, endSeconds: 1 } });
  assert.equal(edited.loop.tempoVerified, false);
  assert.equal(edited.loop.seamVerified, false);
  assert.equal(edited.tuning.verified, true);
  assert.equal(edited.review.auditioned, true);
  assert.equal(
    editClip(c, { tuning: { ...c.tuning, key: "C" } }).tuning.verified,
    false,
  );
  assert.equal(c.loop.tempoVerified, true);
});
test("canonical snapshot SHA-256 agrees with standard hashing independent of property order", () => {
  const a = { z: "words ☀", a: [1, null, { b: true, a: false }] },
    b = { a: a.a, z: a.z };
  assert.equal(canonicalJSON(a), canonicalJSON(b));
  assert.equal(
    sha256Text(canonicalJSON(a)),
    crypto.createHash("sha256").update(canonicalJSON(a)).digest("hex"),
  );
});
test("library refresh retains overlays, source notes, personal clips and atomicity on bad input", async () => {
  globalThis.fetch = async () => new Response(JSON.stringify(catalogue));
  await getClipLibrary();
  saveClipEdits(clip.id, {
    title: "Personal title",
    notes: "Keep my annotation",
  });
  createPersonalClip(clip.id, {
    region: { ...clip.region, startSeconds: 0.5, endSeconds: 1 },
  });
  refreshClipLibrary(manifest);
  assert.equal(
    effectiveLibrary().clips.find((c) => c.id === clip.id).title,
    "Personal title",
  );
  assert.equal(effectiveLibrary().sources.length, 195);
  assert.equal(effectiveLibrary().clips.length, 196);
  const before = JSON.stringify(exportClipBackup());
  assert.throws(() => refreshClipLibrary({ schema: "bad" }));
  assert.equal(JSON.stringify(exportClipBackup()), before);
  const exported = parseClipLibrary(exportClipLibrary());
  assert.equal(
    exported.clips.find((c) => c.id === clip.id).notes,
    "Keep my annotation",
  );
  assert.deepEqual(
    importClipBackup(exportClipBackup()).sources,
    effectiveLibrary().sources,
  );
  assert.equal(
    searchClips(effectiveLibrary(), {
      duration: "source-short",
      batch: "all",
    }).filter((c) => !c.id.includes("local-")).length,
    79,
  );
  assert(
    searchClips(effectiveLibrary(), { query: source.inscriptionId }).length > 0,
  );
  assert.equal(clearedClipExport().status, "not-ready");
  globalThis.fetch = initialFetch;
});
test("real loader shares pending requests, preserves distinct identities and bounds memory; warm audio works offline", async () => {
  clearCatalogueCache();
  let fetches = 0,
    active = 0,
    max = 0;
  globalThis.fetch = async () => {
    fetches++;
    active++;
    max = Math.max(max, active);
    await new Promise((r) => setTimeout(r, 8));
    active--;
    return new Response(data, { headers: { "content-type": "audio/wav" } });
  };
  const a = { type: "ordinal", value: source.inscriptionId };
  const b = { ...a, value: lib.sources[0].inscriptionId };
  const [x, y] = await Promise.all([
    fetchAndDecode(a, { catalogue: true }),
    fetchAndDecode(a, { catalogue: true }),
  ]);
  assert.equal(fetches, 1);
  assert.equal(x.audioBuffer, y.audioBuffer);
  assert.equal(x.sourceHash, digest);
  await Promise.all(
    lib.sources
      .slice(0, 5)
      .map((s) =>
        fetchAndDecode(
          { type: "ordinal", value: s.inscriptionId },
          { catalogue: true },
        ),
      ),
  );
  assert(max <= 2);
  assert(fetches >= 5);
  globalThis.fetch = async () => {
    throw Error("offline");
  };
  await fetchAndDecode(a, { catalogue: true });
  await assert.rejects(
    fetchAndDecode(
      { type: "ordinal", value: lib.sources[20].inscriptionId },
      { catalogue: true },
    ),
    /gateway unreachable/i,
  );
  const stats = catalogueCacheStats();
  assert(
    stats.payloadBytes <= stats.payloadLimit &&
      stats.decodedBytes <= stats.decodedLimit,
  );
  await assert.rejects(
    fetchAndDecode({ ...a, audioSha256: "a".repeat(64) }, { catalogue: true }),
    /mismatch/,
  );
  globalThis.fetch = initialFetch;
});
test("selected clips load into the intended channel and save/reopen immutable source, bounds and playback settings without a catalogue", async () => {
  globalThis.fetch = async () =>
    new Response(data, { headers: { "content-type": "audio/wav" } });
  store.project = makeProject();
  const c = editClip(clip, {
    region: { startSeconds: 0.25, endSeconds: 1.25 },
  });
  await loadClip(2, source, c, { rate: 1.25, reverse: true });
  const s = copy(store.channel(2).clipSnapshot);
  assert.equal(store.channel(0).source, null);
  assert.equal(store.channel(2).pitch, 1.25);
  assert.equal(store.channel(2).reverse, true);
  assert.equal(store.seq.steps[2][0], 1);
  assert.equal(s.clip.loop.tempoVerified, false);
  await loadClip(
    3,
    source,
    editClip(clip, { region: { startSeconds: 1, endSeconds: 1.75 } }),
    { mode: "loop", gateSteps: 12 },
  );
  assert.equal(store.channel(3).clipSnapshot.playback.loop.start, 1);
  assert.equal(store.channel(2).trimStart, 0.125);
  const saved = exportProject();
  refreshClipLibrary(manifest);
  importProject(saved);
  await reloadAllSamples();
  assert.deepEqual(store.channel(2).clipSnapshot, s);
  assert.equal(store.channel(3).gateSteps, 12);
  assert.equal(store.channel(2).name, "short drum loop");
  const edited = JSON.parse(saved);
  edited.channels[2].clipSnapshot.playback.end = 0.5;
  assert.throws(() => importProject(edited), /snapshot hash mismatch/);
  assert.equal(store.channel(2).clipSnapshot.snapshotHash, s.snapshotHash);
  clearCatalogueCache();
  globalThis.fetch = async () => {
    throw Error("offline");
  };
  const failures = await reloadAllSamples();
  assert.deepEqual(failures, [3, 4]);
  assert.deepEqual(store.channel(2).clipSnapshot, s);
  assert(store.channel(2).unresolvedSource);
  assert.equal(engine.buffers[2], null);
  globalThis.fetch = initialFetch;
});
test("preview is isolated, conservative, stops reliably and never edits a production", async () => {
  globalThis.fetch = async () => new Response(data);
  const before = exportProject();
  let stopped = 0,
    played;
  const stop = engine.stopPreview,
    play = engine.playBuffer;
  engine.stopPreview = () => stopped++;
  engine.playBuffer = (...args) => {
    played = args;
  };
  await previewClip(source, clip);
  assert.equal(played[4].level, 0.35);
  assert.equal(exportProject(), before);
  stopClipPreview();
  assert(stopped >= 2);
  engine.stopPreview = stop;
  engine.playBuffer = play;
  globalThis.fetch = initialFetch;
});
test("cancellation, timeout and failed replacement preserve the previous sound; latest destination wins", async () => {
  clearCatalogueCache();
  store.project = makeProject();
  store.channel(0).source = { type: "synth", value: "kick-808" };
  const before = exportProject(),
    ctrl = new AbortController();
  globalThis.fetch = (url, { signal }) =>
    new Promise((resolve, reject) => {
      signal.addEventListener(
        "abort",
        () => reject(new DOMException("aborted", "AbortError")),
        { once: true },
      );
    });
  const loading = loadClip(0, source, clip, { signal: ctrl.signal });
  ctrl.abort();
  await assert.rejects(loading, { name: "AbortError" });
  assert.equal(exportProject(), before);
  await assert.rejects(
    fetchCatalogueAudio(
      { type: "ordinal", value: lib.sources[12].inscriptionId },
      { timeoutMs: 10 },
    ),
    /timed out/,
  );
  assert.equal(exportProject(), before);
  globalThis.fetch = async () => new Response(data);
  await assert.rejects(
    loadClip(0, source, {
      ...clip,
      region: { startSeconds: 0, endSeconds: 99 },
    }),
    /bounds/,
  );
  assert.equal(exportProject(), before);
  globalThis.fetch = initialFetch;
});
test("new decoded frame basis invalidates timing review while keeping curator revision and rights intact", () => {
  const d = copy(manifest);
  d.sources[0].decoded_audio.sample_rate = 44100;
  d.clips[0].loop.seam_verified = d.clips[0].loop.tempo_verified = true;
  refreshClipLibrary(d);
  recordClipMeasurement(source.id, {
    audioBuffer: buffer,
    sourceHash: digest,
    payloadHash: digest,
  });
  const c = effectiveLibrary().clips.find((c) => c.id === clip.id);
  assert.equal(c.loop.tempoVerified, false);
  assert.equal(c.rights.status, "unknown");
  assert.equal(
    exportClipBackup().base.clips.find((c) => c.id === clip.id).loop
      .tempoVerified,
    true,
  );
});
test("one shared subscriber can cancel without cancelling another; immediate restart survives an aborted job", async () => {
  clearCatalogueCache();
  let calls = 0;
  globalThis.fetch = (url, { signal }) =>
    new Promise((resolve, reject) => {
      calls++;
      const timer = setTimeout(() => resolve(new Response(data)), 20);
      signal.addEventListener(
        "abort",
        () => {
          clearTimeout(timer);
          reject(new DOMException("aborted", "AbortError"));
        },
        { once: true },
      );
    });
  const s = { type: "ordinal", value: source.inscriptionId },
    ctrl = new AbortController();
  const one = fetchCatalogueAudio(s, { signal: ctrl.signal }),
    two = fetchCatalogueAudio(s);
  ctrl.abort();
  await assert.rejects(one, { name: "AbortError" });
  await two;
  assert.equal(calls, 1);
  clearCatalogueCache();
  const other = new AbortController(),
    old = fetchCatalogueAudio(s, { signal: other.signal });
  other.abort();
  const newer = fetchCatalogueAudio(s);
  await assert.rejects(old, { name: "AbortError" });
  await newer;
  assert.equal(calls, 3);
  globalThis.fetch = initialFetch;
});
test("oversized decoded buffers are not retained, and response-size limits fail before decoding", async () => {
  clearCatalogueCache();
  let decodes = 0;
  const ensure = engine.ensureContext;
  engine.ensureContext = () => ({
    decodeAudioData: async () => {
      decodes++;
      return { ...buffer, length: 20000000 };
    },
  });
  globalThis.fetch = async () => new Response(data);
  const s = { type: "ordinal", value: lib.sources[70].inscriptionId };
  await fetchCatalogueAudio(s);
  await fetchCatalogueAudio(s);
  assert.equal(decodes, 2);
  assert.equal(catalogueCacheStats().decodedBytes, 0);
  clearCatalogueCache();
  globalThis.fetch = async () =>
    new Response(data, {
      headers: { "content-length": String(51 * 1024 * 1024) },
    });
  await assert.rejects(fetchCatalogueAudio(s), /50 MB/);
  engine.ensureContext = ensure;
  globalThis.fetch = initialFetch;
});
test("later native trim, reverse and rate edits survive reopening; invalid saved regions do not silently clamp", async () => {
  clearCatalogueCache();
  globalThis.fetch = async () => new Response(data);
  store.project = makeProject();
  await loadClip(0, source, clip);
  store.channel(0).trimStart = 0.25;
  store.channel(0).trimEnd = 0.75;
  store.channel(0).pitch = 2;
  store.channel(0).reverse = true;
  const saved = exportProject();
  importProject(saved);
  await reloadAllSamples();
  assert.equal(store.channel(0).trimStart, 0.25);
  assert.equal(store.channel(0).trimEnd, 0.75);
  assert.equal(store.channel(0).pitch, 2);
  assert.equal(store.channel(0).reverse, true);
  const bad = JSON.parse(saved);
  bad.channels[0].trimStart = 2;
  assert.throws(() => importProject(bad), /Invalid saved clip/);
  assert.equal(store.channel(0).trimStart, 0.25);
  globalThis.fetch = initialFetch;
});
test("two racing regions of one inscription share retrieval and only the latest selection replaces the destination", async () => {
  clearCatalogueCache();
  store.project = makeProject();
  let calls = 0;
  globalThis.fetch = async () => {
    calls++;
    await new Promise((r) => setTimeout(r, 15));
    return new Response(data);
  };
  const first = loadClip(
    0,
    source,
    editClip(clip, { region: { startSeconds: 0.1, endSeconds: 0.5 } }),
  );
  const newer = loadClip(
    0,
    source,
    editClip(clip, { region: { startSeconds: 1, endSeconds: 1.5 } }),
  );
  await assert.rejects(first, { name: "AbortError" });
  await newer;
  assert.equal(calls, 1);
  assert.equal(store.channel(0).clipSnapshot.playback.start, 1);
  assert.equal(store.channel(0).clipSnapshot.playback.end, 1.5);
  globalThis.fetch = initialFetch;
});
test("the existing preview stop route cancels a pending catalogue audition so it cannot start late", async () => {
  clearCatalogueCache();
  let plays = 0;
  const play = engine.playBuffer;
  engine.playBuffer = () => plays++;
  globalThis.fetch = (url, { signal }) =>
    new Promise((resolve, reject) => {
      signal.addEventListener(
        "abort",
        () => reject(new DOMException("aborted", "AbortError")),
        { once: true },
      );
    });
  const pending = previewClip(source, clip);
  engine.stopPreview();
  await assert.rejects(pending, { name: "AbortError" });
  assert.equal(plays, 0);
  engine.playBuffer = play;
  globalThis.fetch = initialFetch;
});
test("automatic sequence advancement during loading preserves the chosen channel and running transport", async () => {
  clearCatalogueCache();
  store.project = makeProject();
  store.project.sequences.push(makeSequence());
  engine.isPlaying = true;
  globalThis.fetch = async () => {
    await new Promise((r) => setTimeout(r, 10));
    return new Response(data);
  };
  const pending = loadClip(0, source, clip);
  store.project.currentSequence = 1;
  await pending;
  assert.equal(
    store.channel(0).clipSnapshot.source.inscriptionId,
    source.inscriptionId,
  );
  assert.equal(store.project.sequences[0].steps[0][0], 1);
  assert.equal(engine.isPlaying, true);
  engine.isPlaying = false;
  globalThis.fetch = initialFetch;
});
