#!/usr/bin/env node
// Actual Web Audio tests: baseline voices, >30-second open gates, release, stop,
// overlapping visuals, source ownership, scheduler stalls and audio-clock recording.
import { serve, browser } from './serve.mjs';
import assert from 'node:assert/strict';
const { srv, url } = await serve();
const b = await browser();
try {
  const page = await b.newPage();
  await page.goto(`${url}/audionaut-beta/`);
  const result = await page.evaluate(async () => {
    const [{ SYNTH_BANK, synthDefaults }, { createVoice }, { Engine }, { makeProject, NUM_STEPS }] = await Promise.all([
      import('/audionaut-beta/daw/js/synths.js'), import('/audionaut-beta/daw/js/synths/voice-lifecycle.js'),
      import('/audionaut-beta/daw/js/engine.js'), import('/audionaut-beta/daw/js/state.js'),
    ]);
    const failures = [], baseline = [], sustained = []; let panicCleanup;
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
        createVoice(ctx, ctx.destination, synth, id, { pitch: ['kit','drumrack'].includes(id) ? 36 : 60, vel: 0.7, time: 0, dur: 0.4 }, synthDefaults(id), () => { done = true; });
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
      // Live source budget: counts oscillators, not just notes (voice-budget.js).
      const { pickVictim, deviceTier, voiceBudget } = await import('/audionaut-beta/daw/js/voice-budget.js');
      const touch = { matchMedia: q => ({ matches: q.includes('coarse') }) }, mouse = { matchMedia: () => ({ matches: false }) };
      check(deviceTier(touch) === 'phone' && deviceTier(mouse) === 'desktop' && deviceTier({}) === 'desktop', 'touch devices get the phone budget');
      check(voiceBudget(touch).sources < voiceBudget(mouse).sources && voiceBudget(touch).notes < voiceBudget(mouse).notes, 'phone budget is smaller than desktop');
      const fake = (id, i, pitch, released = false) => ({ id, i, pitch, time: id, voice: { released } });
      check(pickVictim([fake(1,0,60), fake(2,1,50,true), fake(3,0,64)], 0).id === 2, 'a fading note on any instrument goes before a held one');
      check(pickVictim([fake(1,0,60), fake(2,1,50,true), fake(3,0,64)], 0, { own: true }).id === 3, 'an instrument over its own limit only cuts its own notes');
      check(pickVictim([fake(1,1,60), fake(2,1,64)], 0, { own: true }) === null, 'no victim when the instrument has nothing sounding');
      const ctx = new AudioContext(); await ctx.resume();
      const engine = new Engine({ store, contextFactory: () => ctx });
      const rec = id => engine._synthVoices.get(id);
      const low = rec(engine.startNote(0, 48)), cost = low.cost;
      check(cost >= 1 && engine.voiceStats.sources === cost, 'a note reports the sources it built');
      engine.voiceBudget = { notes: 64, perInstrument: 16, sources: cost * 3 };
      const mid = rec(engine.startNote(0, 60)), high = rec(engine.startNote(0, 64));
      check(engine.voiceStats.stolen === 0 && !low.stopping && !mid.stopping && !high.stopping, 'notes inside the source budget all sound');
      engine.releaseNote(mid.id);
      const fourth = rec(engine.startNote(0, 67));
      check(mid.stopping && !low.stopping && !high.stopping && engine.voiceStats.stolen === 1, 'over budget, the fading note is cut first');
      const fifth = rec(engine.startNote(0, 71));
      check(high.stopping && !low.stopping && !fourth.stopping && !fifth.stopping, 'then the oldest held note that is not the bass note');
      check(engine.voiceStats.sources <= cost * 3 && engine.voiceStats.peakSources <= cost * 3, 'sources in use never exceed the budget');
      engine.panic();
      await ctx.close();
      const offline = new Engine({ store, offline: true, contextFactory: () => new OfflineAudioContext(2, 4410, 44100) });
      offline.voiceBudget = { notes: 1, perInstrument: 1, sources: 1 };
      offline.startNote(0, 48); offline.startNote(0, 60); offline.startNote(0, 64);
      check([...offline._synthVoices.values()].filter(n => !n.stopping).length === 3 && offline.voiceStats.stolen === 0, 'export ignores the live source budget');
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
      const panicAt=ctx.currentTime,started=performance.now();
      check(engine._visualCounts.size===0&&engine.liveCount()===0,'panic immediately clears live and visual ownership');
      check([...engine._synthVoices.values()].every(n=>n.stopping&&n.voice.sources.every(source=>source.ended||Number.isFinite(source.stopAt)&&source.stopAt<=panicAt+.025)),'panic schedules every owned source to stop on the audio clock');
      // Native ended events follow audio processing, not wall-clock timers.
      // A fresh device or busy browser may not advance 50 ms of audio in 100 ms.
      while((ctx.currentTime<panicAt+.05||engine._synthVoices.size)&&performance.now()-started<2000)await new Promise(resolve=>setTimeout(resolve,10));
      panicCleanup={audioSeconds:ctx.currentTime-panicAt,wallMs:performance.now()-started,remainingVoices:engine._synthVoices.size,state:ctx.state};
      check(ctx.currentTime>=panicAt+.05,'panic cleanup check processes at least 50 ms of audio');
      check(engine._synthVoices.size === 0 && engine._visualCounts.size === 0, 'panic/stop clears voice and visual ownership');
      check(engine.reverbNode !== oldReturn, 'panic replaces effects containing old tails');
      const last = store.numChannels - 1;
      engine.setBuffer(last, ctx.createBuffer(1, 441, 44100));
      project.channels.pop(); engine.ensureChannelChains();
      check(!engine.chains.has(`c${last}`) && engine.buffers.length === last, 'removed channel releases chain and cached audio');
      document.removeEventListener('synth-note', listener);
      await ctx.close();
    }
    return { failures, baseline, sustained, panicCleanup };
  });
  console.log(JSON.stringify(result, null, 2));
  assert.deepEqual(result.failures, []);
} finally { await b.close(); await new Promise(resolve => srv.close(resolve)); }
