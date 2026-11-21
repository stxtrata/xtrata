#!/usr/bin/env node
// tools/trigger-record.mjs — records exactly what the DAW engine would play, so a change to the
// project model (Plan B: sample pool + regions) can be proven not to change a single note.
//
//   node tools/trigger-record.mjs record BASELINE.json.gz   # run on the code you trust
//   node tools/trigger-record.mjs compare BASELINE.json.gz  # run on the change; exit 1 on any difference
//   node tools/trigger-record.mjs merge OUT.json.gz A.json.gz B.json.gz …   # join chunked recordings
// A full run is ~1,600 cases and takes several minutes; use --only=beat/analogAuto: etc. to run chunks
// in parallel processes, then merge. Always record and compare with the same --bars.
//   flags: --only=text     only cases whose id contains text
//          --list          print the case ids and exit
//          --bars=N        steps to drive = 16 x N (default 8: two passes of a 64-step sequence)
//
// What a "trigger list" is. Every case is loaded the way the app loads it (beat presets through
// loadBeatPreset, projects through importProject, legacy songs through convertLegacy /
// songToProject), then the engine's own scheduler is driven step by step on a fixed clock:
// engine._scheduleStep(step, time) + engine._advance(), no timers. The recorder wraps the Web
// Audio factory methods, so it sees the final voices whatever the data model looks like: for
// each AudioBufferSourceNode its start time, source offset, duration, playback rate, loop
// points, the content fingerprint of its buffer, the channel bus it is connected to, and every
// automation call made on its gain (fades, velocity, choke cuts) and on the node itself (stop).
// Synth notes are not recorded (they do not depend on the sample model).
//
// Audio is deterministic: beat presets decode through a stub that returns seeded noise per
// source, ordinal/URL sources are served by a stub WAV (page.route), pack and onboard sounds
// decode from the local files. No network is used.
import { serve, browser, page as mkPage } from "./serve.mjs";
import fs from "node:fs";
import zlib from "node:zlib";
import crypto from "node:crypto";

const args = process.argv.slice(2);
const mode = args[0];
const file = args[1];
const flags = Object.fromEntries(args.filter((a) => a.startsWith("--")).map((a) => { const [k, v] = a.slice(2).split("="); return [k, v ?? true]; }));
if (mode === "merge") {
  const merged = {};
  for (const f of args.slice(2)) Object.assign(merged, JSON.parse(zlib.gunzipSync(fs.readFileSync(f))));
  fs.writeFileSync(file, zlib.gzipSync(JSON.stringify(merged)));
  console.log(`merged ${args.length - 2} files, ${Object.keys(merged).length} cases -> ${file}`);
  process.exit(0);
}
if (!["record", "compare"].includes(mode) && !flags.list) {
  console.error("usage: trigger-record.mjs record|compare FILE.json.gz [--only=text] [--bars=N] | --list");
  process.exit(2);
}

// ---- stub WAV for ordinal / URL sources: 8 kHz mono 16-bit, seeded decaying noise, 1–3.5 s
function stubWav(url) {
  const h = crypto.createHash("sha256").update(url).digest();
  const seconds = 1 + (h[0] / 255) * 2.5;
  const rate = 8000,
    n = Math.round(seconds * rate);
  const buf = Buffer.alloc(44 + n * 2);
  buf.write("RIFF", 0); buf.writeUInt32LE(36 + n * 2, 4); buf.write("WAVEfmt ", 8);
  buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(rate, 24); buf.writeUInt32LE(rate * 2, 28); buf.writeUInt16LE(2, 32); buf.writeUInt16LE(16, 34);
  buf.write("data", 36); buf.writeUInt32LE(n * 2, 40);
  let s = h.readUInt32LE(4) || 1;
  for (let i = 0; i < n; i++) {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    const v = ((s / 4294967296) * 2 - 1) * Math.exp((-3 * i) / n);
    buf.writeInt16LE(Math.round(v * 20000), 44 + i * 2);
  }
  return buf;
}

const { srv, url } = await serve();
const b = await browser();
const logs = [];
const p = await mkPage(b, url, { logs });
await p.unroute("**/*");
await p.route("**/*", (r) => {
  const u = r.request().url();
  if (u.startsWith(url)) return r.continue();
  if (/ordinals\.com\/content\/|\/runtime\/content|example\.test\//.test(u))
    return r.fulfill({ status: 200, contentType: "audio/wav", body: stubWav(u) });
  return r.abort();
});
await p.addInitScript(() => { try { localStorage.clear(); } catch {} });
await p.goto(`${url}/audionaut/daw.html`);
await p.waitForFunction(() => document.querySelectorAll(".channel.instrument").length >= 4);

// ---------------------------------------------------------------- everything below runs in the page
const results = await p.evaluate(async ({ bars, only, listOnly }) => {
  const J = "/audionaut/daw/js/";
  const [{ store, makeProject }, { engine }, persist, loader, { loadBeatPreset }, { songToProject }] = await Promise.all([
    import(J + "state.js"), import(J + "engine.js"), import(J + "persistence.js"), import(J + "loader.js"),
    import(J + "l1-beat-loader.js"), import(J + "song-format.js"),
  ]);
  const imp = (f, n) => import(J + f).then((m) => m[n]);
  const collections = {
    original: await imp("beats.js", "BEAT_PRESETS"),
    originalX: await imp("original-beats.js", "ORIGINAL_BEAT_PRESETS"),
    l1: await imp("l1-beats.js", "L1_BEAT_PRESETS"),
    tonal: await imp("tonal-beats.js", "TONAL_BEAT_PRESETS"),
    studio: await imp("percussion-kits.js", "DRUM_BEATS_STUDIO"),
    studioL1: await imp("percussion-kits.js", "DRUM_BEATS_L1"),
    combined: await imp("combined-beats.js", "EXPANDED_COMBINED_BEAT_PRESETS"),
  };
  const { analogBeats } = await import(J + "analog-kits.js");
  collections.analogAuto = analogBeats("auto");
  collections.analogRusty = analogBeats("rusty");

  // ---- deterministic stub decode for beat presets
  const fnv = (s) => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
  const stubDecode = async (source) => {
    const ctx = engine.ensureContext();
    const rate = 8000, n = rate * 12;
    const buf = ctx.createBuffer(1, n, rate), d = buf.getChannelData(0);
    let s = fnv(source.type + ":" + source.value) || 1;
    for (let i = 0; i < n; i++) { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; d[i] = ((s / 4294967296) * 2 - 1) * Math.exp((-2 * i) / n); }
    return { audioBuffer: buf, sampleName: source.label || source.value };
  };

  // ---- recorder
  const bufKey = (buf) => {
    if (!buf) return null;
    const d = buf.getChannelData(0);
    let h = 2166136261;
    for (let i = 0; i < 24; i++) { const v = Math.round(d[Math.floor((i / 24) * (d.length - 1))] * 1e5); h ^= v & 0xffffffff; h = Math.imul(h, 16777619); }
    return `${buf.length}/${buf.sampleRate}/${buf.numberOfChannels}/${(h >>> 0).toString(16)}`;
  };
  const r6 = (x) => (typeof x === "number" && Number.isFinite(x) ? Math.round(x * 1e6) / 1e6 : x);
  const GAIN_METHODS = ["setValueAtTime", "linearRampToValueAtTime", "exponentialRampToValueAtTime", "cancelScheduledValues", "cancelAndHoldAtTime", "setTargetAtTime"];
  function install(ctx) {
    const rec = { voices: [], undo: [] };
    const origSrc = ctx.createBufferSource, origGain = ctx.createGain;
    ctx.createGain = function () {
      const g = origGain.call(this);
      g.__log = [];
      for (const m of GAIN_METHODS) {
        const f = g.gain[m].bind(g.gain);
        g.gain[m] = (...a) => { g.__log.push([m, ...a.map(r6)]); return f(...a); };
      }
      const proto = Object.getPrototypeOf(g.gain), desc = Object.getOwnPropertyDescriptor(proto, "value");
      Object.defineProperty(g.gain, "value", { get() { return desc.get.call(g.gain); }, set(v) { g.__log.push(["value", r6(v)]); desc.set.call(g.gain, v); } });
      const c0 = g.connect.bind(g);
      g.connect = (dest, ...x) => { g.__to = dest; return c0(dest, ...x); };
      return g;
    };
    ctx.createBufferSource = function () {
      const s = origSrc.call(this);
      const v = { src: s, stops: [] };
      const start = s.start.bind(s), stop = s.stop.bind(s), connect = s.connect.bind(s);
      s.connect = (dest, ...x) => { v.gain = dest; return connect(dest, ...x); };
      s.start = (when, off, dur) => {
        v.start = [when, off, dur];
        v.rate = s.playbackRate.value; v.loop = [s.loop, s.loopStart, s.loopEnd]; v.buf = bufKey(s.buffer);
        v.order = rec.voices.length; rec.voices.push(v);
        return start(when, off, dur);
      };
      s.stop = (when) => { v.stops.push(r6(when)); return stop(when); };
      return s;
    };
    rec.restore = () => { ctx.createBufferSource = origSrc; ctx.createGain = origGain; };
    return rec;
  }
  const serialise = (rec) =>
    rec.voices.map((v) => ({
      t: r6(v.start[0]), off: r6(v.start[1]), dur: r6(v.start[2]), rate: r6(v.rate),
      loop: v.loop.map(r6), buf: v.buf,
      ch: v.gain?.__to ? engine.channelGains.indexOf(v.gain.__to) : -2,
      gain: v.gain?.__log || [], stops: v.stops,
    }));

  // ---- driver
  function drive(steps) {
    const ctx = engine.ensureContext();
    engine.pause?.();
    engine.onStep = null;
    const noteOrig = engine.triggerNote;
    engine.triggerNote = () => {};
    engine._lastVoice = {};
    engine._voices = new Map();
    store.selectSequence(0);
    engine.playingSequence = 0;
    engine.currentStep = 0;
    engine.nextStepTime = 1000;
    const rec = install(ctx);
    try {
      for (let i = 0; i < steps; i++) {
        engine._scheduleStep(engine.currentStep, engine.nextStepTime);
        engine._advance();
      }
    } finally {
      rec.restore();
      engine.triggerNote = noteOrig;
    }
    const out = serialise(rec);
    engine.pause?.();
    engine._lastVoice = {};
    return out;
  }

  // ---- seeded random for the native fixtures
  const rng = (seed) => () => { seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const PACK_SOUNDS = [
    "analogkit/analogkit-kicks-rusty-24in-rusty-24in-medium@hit@1",
    "analogkit/analogkit-snares-standard-14in-rusty-14in-center-hard@hit@1",
    "analogkit/analogkit-hi-hats-closed-rusty-closed-medium@hit@1",
    "analogkit/analogkit-hi-hats-open-rusty-open-brush@hit@1",
    "worldperc/worldperc-tambourines-tambourine-hand-3@hit@1",
  ];
  const ONBOARD = ["onboard:v2:kick-808", "onboard:v2:snare-tight", "onboard:v2:pads-warm-horizon"];
  function nativeProject(seed, { channels, sequences, choke, bpm, swing, sustain, extra }) {
    const R = rng(seed), pick = (a) => a[Math.floor(R() * a.length)];
    const chans = Array.from({ length: channels }, (_, i) => {
      const onboard = sustain && i % 3 === 0;
      const source = onboard
        ? { type: "synth", value: ONBOARD[2], label: "Warm Horizon" }
        : { type: "pack", value: pick(PACK_SOUNDS), label: `Pack ${i}` };
      const ts = R() < 0.4 ? +(R() * 0.2).toFixed(3) : 0, te = R() < 0.4 ? +(1 - R() * 0.3).toFixed(3) : 1;
      return {
        name: `Ch ${i + 1}`, source, sampleName: source.label,
        volume: +(0.4 + R() * 0.6).toFixed(2), pitch: pick([0.5, 0.75, 1, 1, 1.5, 2]), reverse: R() < 0.15,
        mute: extra === "mute" && i % 4 === 1, solo: false, trimStart: onboard ? 0 : ts, trimEnd: onboard ? 1 : Math.max(te, ts + 0.1),
        gateSteps: onboard ? 1 + Math.floor(R() * 8) : 0, inserts: [], fx: [],
      };
    });
    if (extra === "solo") chans[2].solo = true;
    const seqs = Array.from({ length: sequences }, () => ({
      steps: chans.map((c, ci) => Array.from({ length: 64 }, () => {
        if (R() > 0.28) return 0;
        const v = R() < 0.2 ? 2 : 1;
        if (R() > 0.3) return v;
        const o = { v };
        if (R() < 0.6) o.off = +(R() * 0.95).toFixed(3);
        if (R() < 0.3) o.rev = R() < 0.5;
        if (R() < 0.3) { o.trimStart = +(R() * 0.3).toFixed(3); o.trimEnd = +(0.5 + R() * 0.5).toFixed(3); }
        if (R() < 0.3) o.pitch = pick([0.5, 1, 1.25, 2]);
        if (R() < 0.3) o.xfade = pick([5, 20, 60]);
        if (R() < 0.2) o.gateSteps = 1 + Math.floor(R() * 4);
        return o;
      })),
      notes: [[], [], [], []],
    }));
    return { format: "audionaut-workstation/2", projectName: "fx", bpm, swing, masterVolume: 0.9, continuous: true, choke, fadeMs: 15, channels: chans, instruments: [], sequences: seqs, currentSequence: 0 };
  }
  const hex = (n, s) => { let h = ""; for (let i = 0; i < 64; i++) h += "0123456789abcdef"[(s * 31 + i * 7 + n * 13) % 16]; return h; };
  const legacyFixture = () => ({
    projectName: "Old one", projectBPM: 118,
    channelURLs: Array.from({ length: 4 }, (_, i) => `https://ordinals.com/content/${hex(i, 3)}i0`),
    channelVolume: [1, 0.8, 0.6, 1], channelPlaybackSpeed: [1, 1, 1.5, 0.75],
    trimSettings: [{ start: 0, end: 100 }, { start: 10, end: 80 }, { start: 0, end: 50 }, { start: 5, end: 100 }],
    projectChannelNames: ["A", "B", "C", "D"],
    projectSequences: {
      Sequence1: { ch0: { steps: [1, 5, 9, 13] }, ch1: { steps: [5, 13, { index: 8, reverse: true }] }, ch2: { steps: [1, 2, 3, 4, 33] }, ch3: { steps: [16] } },
      Sequence2: { ch0: { steps: [1, 9] }, ch2: { steps: [3, 7, 11, 15] } },
    },
  });
  const songFixture = () => ({
    projectName: "Song", artistName: "Test", projectBPM: 100,
    channelURLs: Array.from({ length: 3 }, (_, i) => `/content/${hex(i, 9)}i0`),
    channelVolume: [1, 0.9, 1], channelPlaybackSpeed: [1, 1, 2],
    trimSettings: [{ start: 0, end: 100 }, { startSliderValue: 5, endSliderValue: 90 }, { start: 0, end: 100 }],
    projectSequences: { sequence1: { A: { steps: [0, 4, 8, 12, { r: [16, 19] }] }, B: { steps: ["2r", 6, 10] }, C: { steps: [0, 8] } }, sequence2: { A: { steps: [0, 2, 4] }, C: { steps: [1, 3] } } },
  });
  const ogFixture = () => ({
    filename: "og.audx", descriptive: { title: "OG", creator: "x" },
    audxData: { bpm: 110, channels: [
      { url: `/content/${hex(1, 5)}i0`, triggers: [1, 5, 9, 13], toggleMuteSteps: [], mute: false },
      { url: `/content/${hex(2, 5)}i0`, triggers: [3, 7], toggleMuteSteps: [20, 40], mute: false },
    ] },
  });

  // ---- cases
  const cases = [];
  const beatCase = (name, preset, choke) => cases.push({ id: `beat/${name}${choke ? "/choke" : ""}`, run: async () => {
    store.loadProject(makeProject());
    store.project.choke = choke;
    await loadBeatPreset(preset, { decode: stubDecode });
    store.project.choke = choke;
    return drive(bars * 16);
  } });
  for (const [col, list] of Object.entries(collections)) {
    const seen = new Set();
    list.forEach((preset, i) => {
      const id = `${col}:${preset.id || preset.name}`;
      if (seen.has(id)) return;
      seen.add(id);
      beatCase(id, preset, false);
      if (i % 5 === 0) beatCase(id, preset, true);
    });
  }
  const nativeCase = (name, project) => cases.push({ id: `native/${name}`, run: async () => {
    persist.importProject(JSON.parse(JSON.stringify(project)));
    const failures = await loader.reloadAllSamples();
    if (failures.length) throw new Error("samples failed: " + failures);
    return drive(bars * 16 * Math.max(1, Math.min(project.sequences.length, 3)));
  } });
  nativeCase("basic-choke", nativeProject(11, { channels: 8, sequences: 3, choke: true, bpm: 126, swing: 20 }));
  nativeCase("basic-nochoke", nativeProject(12, { channels: 8, sequences: 2, choke: false, bpm: 140, swing: 0 }));
  nativeCase("sustain", nativeProject(13, { channels: 6, sequences: 2, choke: false, bpm: 100, swing: 8, sustain: true }));
  nativeCase("sustain-choke", nativeProject(14, { channels: 6, sequences: 1, choke: true, bpm: 100, swing: 33, sustain: true }));
  nativeCase("wide-20ch", nativeProject(15, { channels: 20, sequences: 2, choke: true, bpm: 128, swing: 12 }));
  nativeCase("muted", nativeProject(16, { channels: 8, sequences: 1, choke: false, bpm: 120, swing: 0, extra: "mute" }));
  nativeCase("soloed", nativeProject(17, { channels: 8, sequences: 1, choke: false, bpm: 120, swing: 0, extra: "solo" }));
  nativeCase("empty-seq", { ...nativeProject(18, { channels: 4, sequences: 1, choke: false, bpm: 120, swing: 0 }), sequences: [] });
  cases.push({ id: "native/starter-session", run: async () => {
    const text = await (await fetch(J + "../data/starter-session.json")).text();
    persist.importProject(text);
    const failures = await loader.reloadAllSamples();
    if (failures.length) throw new Error("samples failed: " + failures);
    return drive(64 * 3 * 2);
  } });
  const songCase = (name, build) => cases.push({ id: `legacy/${name}`, run: async () => {
    store.loadProject(build());
    const failures = await loader.reloadAllSamples();
    if (failures.length) throw new Error("samples failed: " + failures);
    return drive(64 * 4);
  } });
  cases.push({ id: "legacy/audional-preset", run: async () => {
    persist.importProject(legacyFixture());
    const failures = await loader.reloadAllSamples();
    if (failures.length) throw new Error("samples failed: " + failures);
    return drive(64 * 4);
  } });
  songCase("song-b64x", () => songToProject(songFixture(), { inscription: "x" }));
  songCase("song-og", () => songToProject(ogFixture(), { endStep: 130 }));

  if (listOnly) return cases.map((c) => c.id);
  const out = {};
  for (const c of cases) {
    if (only && !c.id.includes(only)) continue;
    try { out[c.id] = { voices: await c.run() }; } catch (e) { out[c.id] = { error: String(e.message || e) }; }
  }
  return out;
}, { bars: +(flags.bars || 8), only: flags.only || "", listOnly: !!flags.list });

await b.close();
srv.close();

if (flags.list) { console.log(results.join("\n")); process.exit(0); }

const sha = (x) => crypto.createHash("sha256").update(JSON.stringify(x)).digest("hex").slice(0, 16);
for (const r of Object.values(results)) r.hash = sha(r.voices ?? r.error);
const failed = Object.entries(results).filter(([, r]) => r.error);
const empty = Object.entries(results).filter(([, r]) => r.voices && r.voices.length === 0);
const total = Object.values(results).reduce((n, r) => n + (r.voices?.length || 0), 0);
console.log(`${Object.keys(results).length} cases, ${total} voices, ${failed.length} load errors, ${empty.length} silent`);
for (const [id, r] of failed.slice(0, 8)) console.log(`  load error ${id}: ${r.error}`);
if (logs.length) console.log("page log:", [...new Set(logs)].slice(0, 6));

if (mode === "record") {
  fs.writeFileSync(file, zlib.gzipSync(JSON.stringify(results)));
  console.log(`recorded to ${file} (${(fs.statSync(file).size / 1e6).toFixed(1)} MB)`);
  process.exit(0);
}

const base = JSON.parse(zlib.gunzipSync(fs.readFileSync(file)));
let diffs = 0, checked = 0;
for (const [id, r] of Object.entries(results)) {
  const was = base[id];
  if (!was) { console.log(`NEW  ${id}`); continue; }
  checked++;
  if (was.hash === r.hash) continue;
  diffs++;
  if (diffs <= 12) {
    const a = was.voices || [], c = r.voices || [];
    let i = 0;
    while (i < Math.max(a.length, c.length) && JSON.stringify(a[i]) === JSON.stringify(c[i])) i++;
    console.log(`DIFF ${id}: ${a.length} → ${c.length} voices${was.error || r.error ? ` (error ${was.error || ""} → ${r.error || ""})` : ""}; first difference at voice ${i}`);
    console.log("   was", JSON.stringify(a[i]));
    console.log("   now", JSON.stringify(c[i]));
  }
}
const missing = Object.keys(base).filter((id) => !(id in results) && (!flags.only || id.includes(flags.only)));
for (const id of missing.slice(0, 5)) console.log(`MISSING ${id}`);
console.log(diffs || missing.length ? `FAIL: ${diffs} cases differ, ${missing.length} missing, of ${checked}` : `PASS: ${checked} cases identical`);
process.exit(diffs || missing.length ? 1 : 0);
