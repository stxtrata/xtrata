#!/usr/bin/env node
// Actual Web Audio tests: baseline voices, >30-second open gates, release, stop,
// overlapping visuals, source ownership, scheduler stalls and audio-clock recording.
import { serve, browser } from './serve.mjs';
import assert from 'node:assert/strict';
const { srv, url } = await serve();
const b = await browser();
try {
  const page = await b.newPage();
  await page.goto(`${url}/audionaut/`);
  const result = await page.evaluate(async () => {
    const [{ SYNTH_BANK, synthDefaults }, { createVoice }, { Engine }, { makeProject, NUM_STEPS }] = await Promise.all([
      import('/audionaut/daw/js/synths.js'), import('/audionaut/daw/js/synths/voice-lifecycle.js'),
      import('/audionaut/daw/js/engine.js'), import('/audionaut/daw/js/state.js'),
    ]);
    const failures = [], baseline = [], sustained = [];
    const check = (condition, label) => { if (!condition) failures.push(label); };
    const rms = (buffer, from, to) => {
      const a = buffer.getChannelData(0); let sum = 0, n = 0;
      for (let i = Math.floor(from * buffer.sampleRate); i < Math.min(a.length, to * buffer.sampleRate); i++) { sum += a[i] * a[i]; n++; }
      return Math.sqrt(sum / Math.max(1, n));
    };
    for (const [id, synth] of Object.entries(SYNTH_BANK)) {
      try {
        const ctx = new OfflineAudioContext(2, 44100 * 3, 44100);
        let done = false;
        createVoice(ctx, ctx.destination, synth, id, { pitch: id === 'kit' ? 36 : 60, vel: 0.7, time: 0, dur: 0.4 }, synthDefaults(id), () => { done = true; });
        const buffer = await ctx.startRendering();
        const level = rms(buffer, 0, 1);
        baseline.push({ id, rms: level, done });
        check(Number.isFinite(level) && level > 0.00001, `${id}: finite baseline audio`);
      } catch (e) { failures.push(`${id}: baseline ${e.stack}`); }
    }
    for (const [id, synth] of Object.entries(SYNTH_BANK)) {
      if (synth.live?.oneShot || synth.live?.naturalDecay) continue;
      try {
        const ctx = new OfflineAudioContext(2, 44100 * 33, 44100);
        let done = false;
        const voice = createVoice(ctx, ctx.destination, synth, id,
          { pitch: 60, vel: 0.7, time: 0, dur: Infinity, held: true }, synthDefaults(id), () => { done = true; });
        voice.release(31.5, 0.2);
        const buffer = await ctx.startRendering();
        const held = rms(buffer, 30.5, 31), silent = rms(buffer, 32, 32.5);
        sustained.push({ id, held, silent, done });
        check(Number.isFinite(held) && held > 0.00001, `${id}: holds beyond old gate`);
        check(silent < 0.00001 && done, `${id}: release cleans all sources`);
      } catch (e) { failures.push(`${id}: sustained ${e.stack}`); }
    }
    const project = makeProject();
    const store = { project, get numChannels() { return project.channels.length; }, channel: i => project.channels[i], instrument: i => project.instruments[i], selectSequence: i => { project.currentSequence = i; }, on() {} };
    {
      const ctx = new OfflineAudioContext(2, 44100 * 2, 44100);
      const engine = new Engine({ store, contextFactory: () => ctx, offline: true });
      engine.triggerNote(0, 60, 0.8, 1, 0.4);
      engine.startNote(1, 64, 0.8, { time: 1.2 });
      const sample = ctx.createBuffer(1, 44100, 44100);
      sample.getChannelData(0).fill(0.5);
      engine.setBuffer(0, sample); engine.audition(0, 0, 1);
      engine.stop();
      const buffer = await ctx.startRendering();
      check(rms(buffer, 0, 2) === 0, 'Stop cancels future live/transport voices and trim audition');
      check(engine._synthVoices.size === 0 && engine.liveCount() === 0, 'stopped voice ledger empties');
    }
    {
      const ctx = new OfflineAudioContext(2, 44100 * 9, 44100);
      const engine = new Engine({ store, contextFactory: () => ctx, offline: true });
      for (let i = 0; i < 80; i++) engine.triggerNote(0, 60, 0.7, 0.01 + i * 0.1, 0.05);
      check(engine._synthVoices.size === 80, 'offline scheduling does not steal future voices');
      const buffer = await ctx.startRendering();
      check(rms(buffer, 0.05, 0.1) > 0.001 && rms(buffer, 7.95, 8) > 0.001, 'first and last notes survive a long offline schedule');
      check(engine._synthVoices.size === 0, 'offline render releases its voice ledger');
    }
    {
      const engine = new Engine({ store, offline: true });
      engine.ctx = { currentTime: 100 };
      engine.isPlaying = true; engine.nextStepTime = 0;
      const scheduled = [];
      engine._scheduleStep = (step, time) => scheduled.push({ step, time });
      engine._tick();
      check(scheduled.length <= 2 && scheduled.every(n => n.time >= 99.995), 'late scheduler drops stale triggers');
      check(engine.getTransportPosition(99.5).elapsedSteps === 796, 'recording position uses audio clock after stall');
      engine._timeline = [
        { time: 1, end: 1.1, sequenceIndex: 0, step: NUM_STEPS - 1, elapsedSteps: 63 },
        { time: 1.1, end: 1.3, sequenceIndex: 1, step: 0, elapsedSteps: 64 },
      ];
      const spans = engine.getTransportSegments(1.05, 1.2);
      check(spans.length === 2 && spans[0].sequenceIndex === 0 && spans[1].sequenceIndex === 1, 'recording splits sequence boundary');
      check(Math.abs(spans[1].endStep - 0.5) < 1e-8, 'recording follows changed step duration');
    }
    {
      const ctx = new OfflineAudioContext(1, 44100, 44100);
      const synth = { voice(c, d) { const o = c.createOscillator(); o.frequency.value = 440; o.connect(d); o.start(); o.stop(Infinity); } };
      const voice = createVoice(ctx, ctx.destination, synth, 'test', { time: 0, held: true, dur: Infinity }, {});
      voice.setBend(12, 0); voice.release(0.7, 0.1);
      const buffer = await ctx.startRendering(), a = buffer.getChannelData(0);
      let crossings = 0;
      for (let i = 11026; i < 22050; i++) if (a[i - 1] <= 0 && a[i] > 0) crossings++;
      check(Math.abs(crossings * 4 - 880) <= 4, 'per-voice bend shifts pitch by an octave');
    }
    {
      const ctx = new AudioContext(); await ctx.resume();
      const engine = new Engine({ store, contextFactory: () => ctx });
      const visuals = [];
      const listener = e => visuals.push(e.detail);
      document.addEventListener('synth-note', listener);
      const a = engine.startNote(0, 60), c = engine.startNote(0, 60);
      engine.releaseNote(a);
      check(visuals.filter(e => e.on).length === 1 && visuals.filter(e => !e.on).length === 0, 'same-pitch visual remains on until every owner releases');
      engine.releaseNote(c);
      check(visuals.filter(e => !e.on).length === 1, 'last owner switches visual off once');
      engine.maxInstrumentVoices = 4;
      for (let pitch = 50; pitch < 60; pitch++) engine.startNote(0, pitch);
      check([...engine._synthVoices.values()].filter(n => !n.stopping).length <= 4, 'instrument polyphony is bounded');
      const oldReturn = engine.reverbNode;
      engine.panic();
      await new Promise(resolve => setTimeout(resolve, 100));
      check(engine._synthVoices.size === 0 && engine._visualCounts.size === 0, 'panic/stop clears voice and visual ownership');
      check(engine.reverbNode !== oldReturn, 'panic replaces effects containing old tails');
      const last = store.numChannels - 1;
      engine.setBuffer(last, ctx.createBuffer(1, 441, 44100));
      project.channels.pop(); engine.ensureChannelChains();
      check(!engine.chains.has(`c${last}`) && engine.buffers.length === last, 'removed channel releases chain and cached audio');
      document.removeEventListener('synth-note', listener);
      await ctx.close();
    }
    return { failures, baseline, sustained };
  });
  console.log(JSON.stringify(result, null, 2));
  assert.deepEqual(result.failures, []);
} finally { await b.close(); await new Promise(resolve => srv.close(resolve)); }
