// Run with PLAYWRIGHT_MODULE and CHROMIUM_PATH if Playwright/Chromium are not installed locally.
import assert from "node:assert/strict";
import { browser, page, serve } from "./serve.mjs";
import { ARP_DEFAULTS, arpOrder, normalizeArp } from "../daw/js/arpeggiator.js";
import { quantizeRecordedSpan } from "../daw/js/performance-recorder.js";

assert.deepEqual(normalizeArp(null), ARP_DEFAULTS);
assert.deepEqual(arpOrder([{ pitch: 60 }, { pitch: 64 }], normalizeArp({ mode: "down", octaves: 2 })).map(n => n.pitch), [76, 72, 64, 60]);
assert.deepEqual(quantizeRecordedSpan([{ sequenceIndex: 0, startStep: 63, endStep: 64 }, { sequenceIndex: 1, startStep: 0, endStep: 2 }], 60, 0.8), [
  { sequenceIndex: 0, note: { step: 63, dur: 1, rawStep:63,rawDur:1,pitch: 60, vel: 0.8,expression:[] } },
  { sequenceIndex: 1, note: { step: 0, dur: 2, rawStep:0,rawDur:2,pitch: 60, vel: 0.8,expression:[] } },
]);
const { srv, url } = await serve();
const b = await browser();
const errors = [];
try {
  const p = await page(b, url, { logs: errors });
  await p.addInitScript(() => {
    window.testPorts = [{ id: "test-a", name: "A", state: "connected" }, { id: "test-b", name: "B", state: "connected" }];
    window.testMidi = { inputs: new Map(window.testPorts.map(p => [p.id, p])) };
    Object.defineProperty(navigator, "requestMIDIAccess", { configurable: true, value: () => Promise.resolve(window.testMidi) });
  });
  await p.goto(`${url}/audionaut-beta/daw.html`);
  await p.waitForFunction(() => document.querySelectorAll(".channel.instrument").length === 4, null, { timeout: 10000 }).catch(async e => {
    console.error(await p.locator("body").innerText()); throw e;
  });
  await p.waitForTimeout(500);
  const result = await p.evaluate(async () => {
    const { engine } = await import("/audionaut-beta/daw/js/engine.js");
    const { store, makeProject } = await import("/audionaut-beta/daw/js/state.js");
    const midi = await import("/audionaut-beta/daw/js/midi-input.js");
    const live = await import("/audionaut-beta/daw/js/live-keys.js");
    const dock = await import("/audionaut-beta/daw/js/synth-panel.js");
    const roll = await import("/audionaut-beta/daw/js/pianoroll.js");
    const { changeSynth } = await import("/audionaut-beta/daw/js/synth-selection.js");
    const { Kit } = await import("/audionaut-beta/daw/js/synth-faces/index.js");
    await Kit.load('fm4');
    store.loadProject(makeProject());
    engine.ensureContext();
    changeSynth(0, "fm4"); dock.openSynthPanel(0);
    const firstTap = Kit.audio.analyser(), firstGain = engine.instrumentGains[0], context = engine.ctx;
    engine.panic();
    const afterPanicTap = Kit.audio.analyser();
    const oscillator = engine.ctx.createOscillator(); oscillator.connect(engine.instrumentGains[0]); oscillator.start();
    await new Promise(r => setTimeout(r, 100));
    const signal = new Float32Array(afterPanicTap.fftSize); afterPanicTap.getFloatTimeDomainData(signal);
    const rms = Math.sqrt(signal.reduce((sum, sample) => sum + sample * sample, 0) / signal.length);
    oscillator.stop(); oscillator.disconnect();
    engine.resetProjectAudio();
    const analyserChecks = { contextReused: context === engine.ctx, gainReplaced: firstGain !== engine.instrumentGains[0],
      panicTapReplaced: firstTap !== afterPanicTap, loadTapReplaced: afterPanicTap !== Kit.audio.analyser(), audible: rms > 0.01 };
    await midi.ensureMidi({ force: true });
    const calls = []; let nextId = 0;
    engine.startNote = (...args) => { calls.push({ kind: "start", args }); return ++nextId; };
    engine.releaseNote = (...args) => calls.push({ kind: "release", args });
    engine.setNotePitchBend = (...args) => calls.push({ kind: "bend", args });
    const send = (data, port = 0) => window.testPorts[port].onmidimessage?.({ data });
    const starts = () => calls.filter(c => c.kind === "start");
    const releases = () => calls.filter(c => c.kind === "release");
    const result = { analyser: analyserChecks };
    dock.openSynthPanel(0); roll.openRoll(1); roll.closeRoll();
    calls.length = 0; send([0x90, 60, 100]); send([0x80, 60, 0]);
    result.sharedTarget = { selected: midi.getMidiTarget(), played: starts()[0].args[0], releases: releases().length };
    document.dispatchEvent(new CustomEvent("open-inst-fx", { detail: 1 }));
    calls.length = 0; send([0x90, 61, 100]); send([0x80, 61, 0]);
    result.effectsAudition = starts().length;
    document.querySelector("#modal-chain").classList.add("hidden");
    calls.length = 0; send([0x90, 60, 100], 0); send([0x90, 60, 100], 1);
    result.independentPorts = { starts: starts().length, earlyReleases: releases().length };
    send([0x80, 60, 0], 0); result.independentPorts.afterFirstUp = live.heldCount(); send([0x80, 60, 0], 1);
    calls.length = 0; send([0xb0, 64, 127]); send([0x90, 62, 100]); send([0x80, 62, 0]);
    result.sustain = { beforePedalUp: releases().length }; send([0xb0, 64, 0]); result.sustain.afterPedalUp = releases().length;
    calls.length = 0; send([0x90, 64, 100]); send([0xe0, 127, 127]); result.bend = calls.find(c => c.kind === "bend")?.args[1]; send([0x80, 64, 0]);
    send([0x90, 65, 100]); window.testPorts[0].state = "disconnected"; window.testMidi.onstatechange(); result.hotplugReleased = live.heldCount();
    window.testPorts[0].state = "connected"; window.testMidi.onstatechange();
    send([0x90, 65, 100]); await midi.setMidiEnabled(false); result.offReleased = live.heldCount();
    let resolve; Object.defineProperty(navigator, "requestMIDIAccess", { configurable: true, value: () => new Promise(r => resolve = r) });
    const pending = midi.ensureMidi({ force: true }); await midi.setMidiEnabled(false); resolve(window.testMidi); await pending; result.raceStayedOff = !midi.isMidiOn();
    const panels = [];
    for (const id of ["acidals", "fmonad", "stacker", "chip8", "subzero"]) {
      changeSynth(0, id); dock.openSynthPanel(0);
      panels.push({ id, built: document.querySelector("#synth-front").dataset.built, controls: document.querySelectorAll("#synth-front [role=slider], #synth-front [role=radio]").length });
    }
    result.panels = panels;
    changeSynth(1, "fm4"); roll.openRoll(1);
    const replacement = makeProject(); replacement.instruments[1].synthId = "vox";
    store.loadProject(replacement, { restore: true });
    result.restoredRoll = { picker: document.querySelector("#roll-synth-select").value, controls: [...document.querySelectorAll("#roll-synth-panel [data-param]")].map(n => n.dataset.param) };
    const getPosition = engine.getTransportPosition, getSegments = engine.getTransportSegments;
    store.selectSequence(1); store.selectSequence(0); store.setNotes(1, []);
    engine.isPlaying = true; engine.currentStep = 43;
    engine.getTransportPosition = () => ({ playing: true, sequenceIndex: 0, step: 5.1, elapsedSteps: 5.1 });
    engine.getTransportSegments = () => [{ sequenceIndex: 0, startStep: 5.1, endStep: 7.1 }];
    document.querySelector("#roll-rec").click();
    live.noteOn("test:record", 1, 60, 0.8); live.noteOff("test:record");
    result.recordedAtAudioClock = { ...store.project.sequences[0].notes[1][0] };
    document.activeElement?.blur();
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "a", ctrlKey: true, bubbles: true }));
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
    result.nudge = { step: store.project.sequences[0].notes[1][0].step, sequence: store.project.currentSequence };
    engine.getTransportSegments = () => [{ sequenceIndex: 0, startStep: 63, endStep: 64 }, { sequenceIndex: 1, startStep: 0, endStep: 2 }];
    live.noteOn("test:wrap", 1, 64, 0.7); live.noteOff("test:wrap");
    result.wrapRecording = [store.project.sequences[0].notes[1].at(-1), store.project.sequences[1].notes[1].at(-1)];
    const beforeCancelled = store.project.sequences[0].notes[1].length;
    document.dispatchEvent(new CustomEvent("live-note", { detail: { src: "test:future", inst: 1, pitch: 67, vel: 0.8, on: true, time: engine.ctx.currentTime + 0.1, duration: 0.1 } }));
    document.dispatchEvent(new CustomEvent("live-note", { detail: { src: "test:future", on: false, time: engine.ctx.currentTime } }));
    result.cancelledPulseNotRecorded = store.project.sequences[0].notes[1].length === beforeCancelled;
    live.noteOn("test:reload", 1, 69, 0.8); store.loadProject(makeProject());
    result.loadCancelsRecording = store.project.sequences.every(s => s.notes.every(n => !n.length));
    document.querySelector("#roll-rec").click();
    engine.isPlaying = false; engine.getTransportPosition = getPosition; engine.getTransportSegments = getSegments;
    roll.closeRoll(); midi.setMidiTarget(0); calls.length = 0;
    live.setArpSettings(0, { enabled: true, rate: 8, mode: "up", octaves: 2 });
    live.noteOn("test:arp:1", 0, 60, 0.8); live.noteOn("test:arp:2", 0, 64, 0.8);
    await new Promise(r => setTimeout(r, 280));
    result.arp = { starts: starts().length, pitches: starts().map(c => c.args[1]), finite: starts().every(c => c.args[3].duration > 0) };
    live.allOff(); const count = starts().length; await new Promise(r => setTimeout(r, 150)); result.arp.stopped = starts().length === count;
    live.noteOn("test:swap", 0, 60, 0.8); changeSynth(0, store.instrument(0).synthId === "jims10" ? "fm4" : "jims10");
    const afterSwap = starts().length; await new Promise(r => setTimeout(r, 150));
    result.synthSwapCleanup = live.heldCount() === 0 && starts().length === afterSwap;
    live.setArpSettings(0, { enabled: false });
    return result;
  });
  assert.deepEqual(result.sharedTarget, { selected: 1, played: 1, releases: 1 });
  assert.deepEqual(result.analyser, { contextReused: true, gainReplaced: true, panicTapReplaced: true, loadTapReplaced: true, audible: true });
  assert.equal(result.effectsAudition, 1);
  assert.deepEqual(result.independentPorts, { starts: 2, earlyReleases: 0, afterFirstUp: 1 });
  assert.deepEqual(result.sustain, { beforePedalUp: 0, afterPedalUp: 1 });
  assert.equal(result.bend, 2);
  assert.equal(result.hotplugReleased, 0); assert.equal(result.offReleased, 0); assert.equal(result.raceStayedOff, true);
  assert.ok(result.panels.every(p => p.built === "1" && p.controls > 0));
  assert.equal(result.restoredRoll.picker, "vox"); assert.ok(!result.restoredRoll.controls.includes("algo"));
  const coreNote=({step,dur,pitch,vel})=>({step,dur,pitch,vel});
  assert.deepEqual(coreNote(result.recordedAtAudioClock), { step: 5, dur: 2, pitch: 60, vel: 0.8 });
  assert.equal(result.recordedAtAudioClock.rawStep,5.1);assert.ok(Math.abs(result.recordedAtAudioClock.rawDur-2)<1e-9);assert.ok(result.recordedAtAudioClock.id);
  assert.deepEqual(result.nudge, { step: 6, sequence: 0 });
  assert.deepEqual(result.wrapRecording.map(coreNote), [{ step: 63, dur: 1, pitch: 64, vel: 0.7 }, { step: 0, dur: 2, pitch: 64, vel: 0.7 }]);
  assert.equal(result.wrapRecording[0].tieId,result.wrapRecording[1].tieId);
  assert.equal(result.cancelledPulseNotRecorded, true); assert.equal(result.loadCancelsRecording, true);
  assert.ok(result.arp.starts >= 3 && result.arp.finite && result.arp.stopped);
  assert.ok(result.arp.pitches.includes(72) || result.arp.pitches.includes(76));
  assert.equal(result.synthSwapCleanup, true);
  assert.deepEqual(errors.filter(e => e.startsWith("pageerror")), []);
  console.log("PASS performance routing, ports, sustain, bend, lifecycle, restore, generic panels, arp and loop recording");
} catch (error) { console.error(errors); throw error; }
finally { await b.close(); srv.close(); }
