#!/usr/bin/env node
// One-way contract: projects made by the unchanged original AudioNaut open in beta.
// The pinned-clip test uses an explicitly synthetic, locally served WAV fixture.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { serve, browser } from "./serve.mjs";
import * as originalPersistence from "../../audionaut/daw/js/persistence.js";
import { store as originalStore, makeProject as originalProject } from "../../audionaut/daw/js/state.js";
import { SYNTH_BANK as originalSynths, synthDefaults } from "../../audionaut/daw/js/synths.js";
import * as oldBetaPersistence from "../../audionaut-beta/daw/js/persistence.js";
import * as betaPersistence from "../daw/js/persistence.js";
import { store as betaStore } from "../daw/js/state.js";

const originalRoot = fileURLToPath(new URL("../../audionaut/", import.meta.url));
const indexPath = path.join(originalRoot, "daw/data/starters/index.json");
const songs = JSON.parse(fs.readFileSync(indexPath, "utf8")).songs;
assert.equal(songs.length, 20, "cover every shipped original starter");
const originals = songs.map((song) => ({ ...song, raw: fs.readFileSync(path.join(originalRoot, "daw/data", song.file), "utf8") }));
const sourcePaths = [indexPath, ...songs.map((song) => path.join(originalRoot, "daw/data", song.file)),
  ...["daw.html", "daw/js/persistence.js", "daw/js/state.js", "daw/js/engine.js", "daw/js/loader.js", "daw/js/clip-actions.js"].map((name) => path.join(originalRoot, name))];
const fingerprints = () => Object.fromEntries(sourcePaths.map((file) => [file, createHash("sha256").update(fs.readFileSync(file)).digest("hex")]));
const beforeFiles = fingerprints();
function originalView(project) {
  const result = structuredClone(project);
  for(const key of ['projectId','schemaVersion','renderSeed','buses','master','mixerVersion','timeline','recording','automationMode'])delete result[key];
  result.format='audionaut-workstation/2';
  for(const owner of [...result.channels,...result.instruments])for(const key of ['id','kind','pan','inputTrimDb','output','auxSends','armed','monitor','midiInput','takes','arp'])delete owner[key];
  for(const sequence of result.sequences){delete sequence.id;for(const notes of sequence.notes)for(const note of notes)for(const key of ['id','rawStep','rawDur','expression'])delete note[key];}
  return result;
}
for (const song of originals) {
  const input = JSON.parse(song.raw), before = JSON.stringify(input);
  originalPersistence.importProject(input);
  const expected = originalView(JSON.parse(originalPersistence.exportProject({ compact: true })));
  betaPersistence.importProject(input);
  const actual = originalView(JSON.parse(betaPersistence.exportProject({ compact: true })));
  assert.deepEqual(actual, expected, `${song.id}: original normalization semantics preserved`);
  assert.equal(JSON.stringify(input), before, `${song.id}: import does not mutate the original input`);
  assert.ok(betaStore.project.instruments.every((instrument) => instrument.arp?.enabled === false));
}
for (const [synthId, synth] of Object.entries(originalSynths)) {
  originalStore.loadProject(originalProject());
  const patch = synthDefaults(synthId);
  originalStore.setInstrumentProp(0, "synthId", synthId);
  originalStore.setInstrumentProp(0, "name", `Original ${synth.name}`);
  originalStore.setInstrumentProp(0, "params", patch);
  originalStore.addNote(0, { step: 0, dur: 4, pitch: 60, vel: 0.75 });
  betaPersistence.importProject(originalPersistence.exportProject());
  assert.equal(betaStore.instrument(0).synthId, synthId);
  assert.deepEqual(betaStore.instrument(0).params, patch);
  assert.deepEqual(originalView(JSON.parse(betaPersistence.exportProject())).sequences[0].notes[0], originalStore.seq.notes[0]);
}
const legacy = {
  projectName: "Classic Audional song", artistName: "Legacy fixture", projectBPM: 123,
  channelURLs: ["https://example.invalid/legacy.wav"], channelVolume: [0.72], channelPlaybackSpeed: [0.75],
  trimSettings: [{ start: 12, end: 88 }], projectChannelNames: ["Legacy sample"],
  projectSequences: { Sequence1: { ch0: { steps: [1, 5, { index: 9, reverse: true }] } }, Sequence2: { ch0: { steps: [3, 7] } } },
};
for (const input of ["audional-sequencer-x/1", "audional-sequencer-l1xl2/1"].map((format) => ({ ...JSON.parse(originals[0].raw), format }))) {
  originalPersistence.importProject(input);
  const expected = originalView(JSON.parse(originalPersistence.exportProject({ compact: true })));
  betaPersistence.importProject(input);
  assert.deepEqual(originalView(JSON.parse(betaPersistence.exportProject({ compact: true }))), expected, "legacy original import semantics preserved");
}
// Raw pre-AudioNaut files now use the documented editor bridge. Preserve actual
// saved sequence numbers and reverse flags, which the old generic importer lost.
betaPersistence.importProject(legacy);
assert.equal(betaStore.project.channels.length,1);
assert.equal(betaStore.project.sequences.length,3);
assert.ok(betaStore.project.sequences[0].steps[0].every(value=>value===0));
assert.deepEqual(betaStore.project.sequences[1].steps[0][8],{v:1,rev:true});
assert.equal(betaStore.project.sequences[2].steps[0][2],1);
for(const[key,value]of Object.entries({volume:.72,pitch:.75,trimStart:.12,trimEnd:.88}))assert.equal(betaStore.channel(0)[key],value);
assert.equal(betaStore.project.legacyPlayback.id,'audionals-editor-v1');
// The beta's extra arpeggiator and velocity data also remain intact.
for(const song of originals){oldBetaPersistence.importProject(song.raw);const file=oldBetaPersistence.exportProject();betaPersistence.importProject(file);assert.deepEqual(originalView(JSON.parse(betaPersistence.exportProject({compact:true}))),originalView(JSON.parse(oldBetaPersistence.exportProject({compact:true}))),song.id+': beta import preserved');assert.equal(betaStore.project.mixerVersion,1);assert.equal(betaStore.project.timeline.enabled,false);}
console.log(`PASS original formats: all ${songs.length} starter songs, ${Object.keys(originalSynths).length} synth patches and three legacy formats`);

const { srv, url } = await serve();
let b;
const syntheticId = "a".repeat(64) + "i0";
try {
  b = await browser();
  const context = await b.newContext();
  const errors = [];
  let fixtureWav;
  await context.route("**/*", (route) => route.request().url().startsWith(url) ? route.continue() : route.abort());
  await context.route(`${url}/__compat-ordinal/${syntheticId}`, (route) => fixtureWav
    ? route.fulfill({ contentType: "audio/wav", body: fixtureWav })
    : route.fulfill({ status: 503, body: "fixture not ready" }));
  const seed = { format: "audionaut-workstation/2", projectName: "Compatibility setup", channels: [{}], sequences: [{ steps: [Array(64).fill(0)], notes: [[], [], [], []] }] };
  await context.addInitScript((seed) => {
    // Disposable browser context. No user projects or wallets are accessed.
    localStorage.setItem("audionaut.v0.2.project", JSON.stringify(seed));
    localStorage.setItem("audionaut.beta-pro.v0.2.project", JSON.stringify(seed));
    navigator.requestMIDIAccess = async () => ({ inputs: new Map(), onstatechange: null });
  }, seed);
  const original = await context.newPage();
  original.on("pageerror", (error) => errors.push(`original: ${error.message}`));
  await original.goto(url + "/audionaut/daw.html");
  await original.waitForFunction(() => document.querySelector("#project-name").value === "Compatibility setup");
  const setup = await original.evaluate(async () => {
    const { store, makeProject } = await import("/audionaut/daw/js/state.js");
    const { engine } = await import("/audionaut/daw/js/engine.js");
    const { encodeWav } = await import("/audionaut/daw/js/audio-utils.js");
    const { loadSample } = await import("/audionaut/daw/js/loader.js");
    const { makeSlot, returnDefaults } = await import("/audionaut/daw/js/plugins.js");
    const { synthDefaults } = await import("/audionaut/daw/js/synths.js");
    store.loadProject(makeProject());
    Object.assign(store.project, { projectName: "Original export → beta", artistName: "Compatibility fixture", bpm: 137, swing: 23, masterVolume: 0.63, continuous: false, choke: true, fadeMs: 21, playEmptySequences: true, songEndStep: 128 });
    const ctx = engine.ensureContext(), buffer = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const samples = buffer.getChannelData(0);
    for (let i = 0; i < samples.length; i++) samples[i] = 0.22 * Math.sin(2 * Math.PI * 220 * i / ctx.sampleRate);
    const wav = encodeWav(buffer);
    const bytes = new Uint8Array(await wav.arrayBuffer());
    let binary = ""; for (let i = 0; i < bytes.length; i += 32768) binary += String.fromCharCode(...bytes.subarray(i, i + 32768));
    await loadSample(0, { type: "file", file: new File([wav], "original-local.wav", { type: "audio/wav" }) });
    Object.assign(store.channel(0), { name: "Original local sample", volume: 0.71, pitch: 1.25, reverse: true, trimStart: 0.1, trimEnd: 0.8, sampleMidi: 57, gateSteps: 0,
      inserts: [makeSlot("eq3")], fx: [makeSlot("drive", { amount: 0.17 })], sends: { delay: { amount: 0.12, enabled: true }, reverb: { amount: 0.08, enabled: false } } });
    for (let i = 0; i < 4; i++) {
      const inst = store.instrument(i);
      inst.name = `Original patch ${i + 1}`;
      inst.params = { ...synthDefaults(inst.synthId), compatibilityMarker: i };
      inst.volume = 0.55 + i * 0.05;
      inst.inserts = [makeSlot("eq3")];
      inst.fx = [makeSlot("filter")];
      inst.sends = { delay: { amount: 0.07 + i * 0.01, enabled: true } };
      store.addNote(i, { step: 0, dur: 3 + i, pitch: 48 + i * 7, vel: 0.65 + i * 0.05 });
      store.addNote(i, { step: 8 + i, dur: 2, pitch: 60 + i, vel: 0.8 });
    }
    store.setStep(0, 0, { v: 2, rev: false, trimStart: 0.2, trimEnd: 0.7, pitch: 0.75, xfade: 17, off: 0.125, gateSteps: 0, sampleMidi: 57 });
    store.selectSequence(1);
    store.setStep(0, 0, 1); store.setStep(0, 4, 2);
    for (let i = 0; i < 4; i++) store.addNote(i, { step: 0, dur: 4, pitch: 55 + i * 4, vel: 0.7 });
    store.project.returns = returnDefaults(); store.project.returns.delay.feedback = 0.22; store.project.returns.reverb.decay = 1.3;
    store.emit("sequence", 1);
    return { wav: btoa(binary), sampleRate: ctx.sampleRate };
  });
  fixtureWav = Buffer.from(setup.wav, "base64");
  const exported = await original.evaluate(async ({ syntheticId, url }) => {
    const { store } = await import("/audionaut/daw/js/state.js");
    const P = await import("/audionaut/daw/js/persistence.js");
    const { parseClipLibrary } = await import("/audionaut/daw/js/clip-contract.js");
    const { loadClip } = await import("/audionaut/daw/js/clip-actions.js");
    const catalogue = parseClipLibrary(await (await fetch("/audionaut/daw/data/samples-loops-catalogue.json")).json());
    const originalSource = catalogue.sources[0], originalClip = catalogue.clips.find((clip) => clip.sourceId === originalSource.id);
    const source = { ...structuredClone(originalSource), id: `btc:ord:${syntheticId}`, inscriptionId: syntheticId, title: "Synthetic compatibility WAV", reportedDuration: 1 };
    const clip = { ...structuredClone(originalClip), id: `${source.id}:clip:compat`, sourceId: source.id, title: "Original pinned fixture", region: { startSeconds: 0.1, endSeconds: 0.7, startFrame: null, endFrame: null, frameRate: null, endExclusive: true } };
    store.settings.ordinalsGateway = url + "/__compat-ordinal/";
    await loadClip(1, source, clip, { mode: "one-shot", rate: 0.9, reverse: false });
    store.channel(1).volume = 0.55;
    store.channel(1).name = "Original pinned clip";
    store.emit("channel", { ch: 1 });
    return P.exportProject({ compact: true });
  }, { syntheticId, url });
  const exportedProject = JSON.parse(exported);
  assert.ok(exportedProject.channels[0].source.value.startsWith("data:audio/"));
  assert.ok(exportedProject.channels[1].clipSnapshot?.snapshotHash);
  betaPersistence.importProject(exported);
  const retainedProject = betaStore.project, tampered = JSON.parse(exported);
  tampered.channels[1].clipSnapshot.snapshotHash = "0".repeat(64);
  assert.throws(() => betaPersistence.importProject(tampered), /snapshot hash/i);
  assert.equal(betaStore.project, retainedProject, "bad pinned clips cannot replace the current project");

  const beta = await context.newPage();
  beta.on("pageerror", (error) => errors.push(`beta: ${error.message}`));
  await beta.goto(url + "/audionaut-beta-pro/daw.html");
  await beta.waitForFunction(() => document.querySelector("#project-name").value === "Compatibility setup");
  const imported = await beta.evaluate(async ({ exported, url }) => {
    const { store } = await import("/audionaut-beta-pro/daw/js/state.js");
    const { engine } = await import("/audionaut-beta-pro/daw/js/engine.js");
    const P = await import("/audionaut-beta-pro/daw/js/persistence.js");
    store.settings.ordinalsGateway = url + "/__compat-ordinal/";
    P.importProject(exported);
    // Capture the normalized file state before asynchronous decoded metadata is refreshed.
    return { portable: JSON.parse(P.exportProject({ compact: true })), interned: !!store.channel(0).source.localAssetId };
  }, { exported, url });
  originalPersistence.importProject(exported);
  const reopenedOriginal = JSON.parse(originalPersistence.exportProject({ compact: true }));
  assert.deepEqual(originalView(imported.portable), originalView(reopenedOriginal), "beta preserves the original DAW's file reopening semantics");
  for (const key of ["projectName", "artistName", "bpm", "swing", "masterVolume", "continuous", "choke", "fadeMs", "playEmptySequences", "songEndStep", "currentSequence", "sequences", "returns"])
    assert.deepEqual(originalView(imported.portable)[key], originalView(exportedProject)[key], `original exported ${key} preserved`);
  assert.deepEqual(originalView(imported.portable).instruments, originalView(exportedProject).instruments, "original synth patches and effect chains preserved");
  for (const key of ["source", "pitch", "reverse", "trimStart", "trimEnd", "volume", "inserts", "fx", "sends", "sampleMidi", "gateSteps"])
    assert.deepEqual(imported.portable.channels[0][key], exportedProject.channels[0][key], `original sample ${key} preserved`);
  assert.deepEqual(imported.portable.channels[1].clipSnapshot, exportedProject.channels[1].clipSnapshot, "pinned snapshot preserved byte-for-byte");
  assert.equal(imported.interned, true, "beta stores local audio outside undo while preserving portable bytes");
  await beta.waitForFunction(async () => { const { engine } = await import("/audionaut-beta-pro/daw/js/engine.js"); return engine.buffers[0]?.duration === 1 && engine.buffers[1]?.duration === 1; });
  const playback = await beta.evaluate(async () => {
    const { engine } = await import("/audionaut-beta-pro/daw/js/engine.js");
    const { store } = await import("/audionaut-beta-pro/daw/js/state.js");
    const analysed = engine.ctx.createAnalyser(); analysed.fftSize = 2048; engine.masterGain.connect(analysed);
    const data = new Float32Array(2048); let peakRms = 0;
    await engine.play();
    for (let i = 0; i < 20; i++) { await new Promise((resolve) => setTimeout(resolve, 20)); analysed.getFloatTimeDomainData(data); peakRms = Math.max(peakRms, Math.sqrt(data.reduce((sum, value) => sum + value * value, 0) / data.length)); }
    const step = engine.currentStep; engine.stop(); engine.masterGain.disconnect(analysed); analysed.disconnect();
    const expected = engine.buffers[0].getChannelData(0);
    return { peakRms, step, sampleRate: engine.buffers[0].sampleRate, samplePeak: Math.max(...expected.subarray(0, 8192)), pinnedHash: store.channel(1).clipSnapshot.snapshotHash, unresolved: store.channel(1).unresolvedSource };
  });
  assert.ok(playback.peakRms > 0.0001 && playback.step > 1, "imported original project produces audible scheduled playback");
  assert.ok(playback.samplePeak > 0.2 && playback.samplePeak < 0.23, "embedded WAV decodes its original waveform");
  assert.equal(playback.pinnedHash, exportedProject.channels[1].clipSnapshot.snapshotHash);
  assert.equal(playback.unresolved, null);
  console.log("PASS original DAW → beta file:", JSON.stringify({ peakRms: playback.peakRms, sampleRate: playback.sampleRate, pinnedSnapshotPreserved: true }));

  // Open all unmodified original starter files in the actual beta and decode their audio.
  // The musical-structure comparison above is against the original importer, not a hand-built expectation.
  const opened = [];
  for (const song of originals) {
    await beta.evaluate(async (raw) => {
      const P = await import("/audionaut-beta-pro/daw/js/persistence.js");
      P.importProject(raw);
    }, song.raw);
    await beta.waitForFunction(async () => {
      const [{ store }, { engine }] = await Promise.all([import("/audionaut-beta-pro/daw/js/state.js"), import("/audionaut-beta-pro/daw/js/engine.js")]);
      return store.project.channels.every((channel, i) => !channel.source || engine.buffers[i]);
    }, undefined, { timeout: 30000 });
    const loaded = await beta.evaluate(async () => {
      const [{ store }, { engine }] = await Promise.all([import("/audionaut-beta-pro/daw/js/state.js"), import("/audionaut-beta-pro/daw/js/engine.js")]);
      const a = engine.ctx.createAnalyser(); a.fftSize = 1024; engine.masterGain.connect(a);
      const data = new Float32Array(1024); let peak = 0;
      await engine.play();
      for (let i = 0; i < 12; i++) { await new Promise((resolve) => setTimeout(resolve, 20)); a.getFloatTimeDomainData(data); peak = Math.max(peak, ...data.map(Math.abs)); }
      engine.stop(); engine.masterGain.disconnect(a); a.disconnect();
      return { projectName: store.project.projectName, sources: store.project.channels.filter((channel) => channel.source).length, peak };
    });
    assert.ok(loaded.peak > 0.0001, `${song.id}: loaded original starter produces audio`);
    opened.push({ id: song.id, sources: loaded.sources });
  }
  assert.equal(opened.length, 20);
  assert.deepEqual(errors, [], "both original and beta run without uncaught errors");
  console.log("PASS actual beta starter playback:", JSON.stringify(opened));
} finally {
  await b?.close(); await new Promise((resolve) => srv.close(resolve));
  assert.deepEqual(fingerprints(), beforeFiles, "original source and song files remain unchanged");
}
