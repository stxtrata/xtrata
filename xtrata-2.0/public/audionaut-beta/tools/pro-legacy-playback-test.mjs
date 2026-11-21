import assert from 'node:assert/strict';
import { serve, browser, page } from './serve.mjs';
import { checkLegacyTrimPreview } from './pro-legacy-preview-checks.mjs';

// Independent reference below transcribes the published editor and pinned
// 194e4be standalone source.start/gain rules; it imports NO bridge math.
const { srv, url } = await serve(),
  b = await browser(),
  logs = [];
try {
  const p = await page(b, url, { logs });
  await p.goto(`${url}/audionaut-beta/daw.html`);
  const evaluation = p.evaluate(async () => {
    const base = '/audionaut-beta/daw/js/';
    const { Engine } = await import(base + 'engine.js'),
      { makeProject, makeSequence } = await import(base + 'state.js');
    const { compilePlaybackPlan } = await import(base + 'playback-plan.js');
    const { normalizeLegacyPlayback } = await import(base + 'legacy-bridge/playback.js');
    const { offlineRenderSupport } = await import(base + 'audio-render-support.js');
    const { renderMix } = await import(base + 'render-mix.js');
    const { inspectPcmWav, decodePcmPlanes } = await import(base + 'pcm-wav.js');
    const assertions = [];
    function ok(test, label, detail) {
      if (!test) throw Error(label + ': ' + JSON.stringify(detail));
      assertions.push(label);
    }
    const specs = [
      { rate: 0.5, rev: false, gain: 3 },
      { rate: 0.5, rev: true, gain: 2 },
      { rate: 1, rev: false, gain: 1 },
      { rate: 2, rev: true, gain: 3 },
      { rate: 9.03, rev: false, gain: 2 },
      { rate: 100, rev: true, gain: 1 }
    ];
    const make = (id) => {
      const q = makeProject();
      q.channels.length = specs.length;
      q.instruments = [];
      q.bpm = 420;
      q.masterVolume = 1;
      q.sequences = [makeSequence(specs.length, 0)];
      q.currentSequence = 0;
      q.legacyPlayback = { version: 1, id };
      q.timeline.loop.enabled = false;
      q.songEndStep = 24;
      specs.forEach((s, i) => {
        Object.assign(q.channels[i], {
          volume: s.gain,
          pitch: s.rate,
          reverse: s.rev,
          trimStart: 0.125,
          trimEnd: 0.625
        });
        q.sequences[0].steps[i][i * 4] = 1;
      });
      return q;
    };
    const pcm = (ctx) => {
      const buffer = ctx.createBuffer(2, Math.round(ctx.sampleRate * 0.2), ctx.sampleRate);
      for (let ch = 0; ch < 2; ch++)
        for (let i = 0; i < buffer.length; i++) {
          const t = i / buffer.length,
            region = Math.floor(t * 8);
          buffer.getChannelData(ch)[i] =
            0.03 * (region - 3.5) +
            0.012 * Math.sin((2 * Math.PI * (191 + ch * 83) * i) / ctx.sampleRate) +
            (ch ? 0.009 : 0);
        }
      return buffer;
    };
    const reverse = (ctx, buffer) => {
      const x = ctx.createBuffer(buffer.numberOfChannels, buffer.length, buffer.sampleRate);
      for (let c = 0; c < x.numberOfChannels; c++)
        x.getChannelData(c).set(buffer.getChannelData(c).slice().reverse());
      return x;
    };
    const reference = (
      ctx,
      dest,
      buffer,
      id,
      { lead = 0.02, chase = 0, specifications = specs } = {}
    ) => {
      for (let i = 0; i < specifications.length; i++) {
        const s = specifications[i],
          source = ctx.createBufferSource(),
          gain = ctx.createGain();
        source.buffer = s.rev ? reverse(ctx, buffer) : buffer;
        if (id === 'audionals-standalone-v1') source.playbackRate.value = s.rate;
        else source.playbackRate.setValueAtTime(s.rate, ctx.currentTime);
        // Independent source offset and source duration. At <1 standalone rate,
        // source.start may run beyond trimEnd until it reaches the buffer end.
        const start = (s.rev ? 1 - 0.625 : 0.125) * buffer.duration,
          content =
            ((0.625 - 0.125) * buffer.duration) / (id === 'audionals-standalone-v1' ? s.rate : 1),
          elapsed = chase * s.rate;
        const remaining = Math.min(content, buffer.duration - start) - elapsed;
        if (remaining <= 0) continue;
        gain.gain.setValueAtTime(id === 'audionals-standalone-v1' ? 0 : s.gain, ctx.currentTime);
        if (id === 'audionals-standalone-v1')
          gain.gain.linearRampToValueAtTime(s.gain, ctx.currentTime + 0.01);
        source.connect(gain).connect(dest);
        source.start(lead + (i * 60) / 420, start + elapsed, remaining);
      }
    };
    const view = (q) => ({
      project: q,
      get numChannels() {
        return q.channels.length;
      },
      channel: (i) => q.channels[i],
      instrument: (i) => q.instruments[i],
      on: () => () => {},
      selectSequence: (i) => (q.currentSequence = i)
    });
    for (const bad of [
      { version: 2, id: 'audionals-editor-v1' },
      { version: 1, id: 'unknown' },
      { version: 1, id: 'audionals-editor-v1', source: { type: 'url', value: 'hidden' } }
    ]) {
      let rejected = false;
      try {
        normalizeLegacyPlayback(bad);
      } catch {
        rejected = true;
      }
      ok(rejected, 'reject unknown or opaque profile');
    }
    const native = makeProject();
    native.sequences = [makeSequence(), makeSequence(), makeSequence()];
    native.sequences[0].steps[0][0] = 1;
    native.sequences[2].steps[0][0] = 1;
    ok(compilePlaybackPlan(native).endBeat === 16, 'native empty sequence boundary unchanged');
    native.legacyPlayback = { version: 1, id: 'audionals-editor-v1' };
    ok(compilePlaybackPlan(native).endBeat === 48, 'legacy preserves silent middle sequence');
    native.songEndStep = 132;
    ok(compilePlaybackPlan(native).endBeat === 33, 'legacy explicit ending excludes later events');
    const measurements = [];
    if (offlineRenderSupport().supported) {
      for (const rate of [44100, 48000, 96000])
        for (const id of ['audionals-editor-v1', 'audionals-standalone-v1']) {
          const q = make(id),
            ctx = new OfflineAudioContext(2, rate * 2, rate),
            engine = new Engine({ store: view(q), contextFactory: () => ctx, offline: true }),
            buffer = pcm(ctx);
          engine.ensureContext();
          q.channels.forEach((_, i) => engine.setBuffer(i, buffer));
          engine.syncMixer();
          const plan = compilePlaybackPlan(q, { buffers: engine.buffers });
          for (const event of plan.events)
            engine.scheduleEvent({ ...event, time: event.time + 0.02 });
          const actual = await ctx.startRendering();
          engine.dispose();
          const refCtx = new OfflineAudioContext(2, rate * 2, rate);
          reference(refCtx, refCtx.destination, buffer, id);
          const expected = await refCtx.startRendering();
          let peak = 0,
            rms = 0,
            peakFrame = 0,
            actualAt = 0,
            expectedAt = 0,
            firstDiff = -1,
            differentFrames = 0;
          for (let c = 0; c < 2; c++)
            for (let n = 0; n < actual.length; n++) {
              const d = actual.getChannelData(c)[n] - expected.getChannelData(c)[n];
              if (Math.abs(d) > 1e-6) {
                if (firstDiff < 0) firstDiff = n;
                differentFrames++;
              }
              if (Math.abs(d) > peak) {
                peak = Math.abs(d);
                peakFrame = n;
                actualAt = actual.getChannelData(c)[n];
                expectedAt = expected.getChannelData(c)[n];
              }
              rms += d * d;
            }
          rms = Math.sqrt(rms / (2 * actual.length));
          ok(peak < 1e-6 && rms < 1e-7, `${id} independent PCM ${rate}`, {
            peak,
            rms,
            peakFrame,
            actualAt,
            expectedAt,
            firstDiff,
            differentFrames,
            around: [...actual.getChannelData(0).slice(9700, 9705)],
            expectedAround: [...expected.getChannelData(0).slice(9700, 9705)],
            plan: plan.events
              .filter((e) => e.type === 'sample')
              .map((e) => ({ time: e.time, duration: e.duration }))
          });
          measurements.push({ id, rate, peak, rms });
          // Resume inside a slow reversed note must subtract consumed source time
          // once, rather than divide an already-shortened trim by rate again.
          const chaseProject = make(id);
          chaseProject.channels.length = 1;
          Object.assign(chaseProject.channels[0], { pitch: 0.5, reverse: true, volume: 2 });
          chaseProject.sequences = [makeSequence(1, 0)];
          chaseProject.sequences[0].steps[0][0] = 1;
          const chase = 0.06,
            range = { start: (chase * 420) / 60, end: (0.5 * 420) / 60 },
            chaseCtx = new OfflineAudioContext(2, rate, rate),
            chaseEngine = new Engine({
              store: view(chaseProject),
              contextFactory: () => chaseCtx,
              offline: true
            });
          chaseEngine.ensureContext();
          chaseEngine.setBuffer(0, buffer);
          const chased = compilePlaybackPlan(chaseProject, { range, buffers: [buffer] });
          for (const event of chased.events)
            chaseEngine.scheduleEvent({ ...event, time: event.time + 0.02 });
          const ca = await chaseCtx.startRendering();
          chaseEngine.dispose();
          const cr = new OfflineAudioContext(2, rate, rate);
          reference(cr, cr.destination, buffer, id, {
            chase,
            specifications: [{ rate: 0.5, rev: true, gain: 2 }]
          });
          const ce = await cr.startRendering();
          let chaseError = 0;
          for (let c = 0; c < 2; c++)
            for (let n = 0; n < ca.length; n++)
              chaseError = Math.max(
                chaseError,
                Math.abs(ca.getChannelData(c)[n] - ce.getChannelData(c)[n])
              );
          ok(chaseError < 1e-6, `${id} reverse range chase ${rate}`, chaseError);
          // Real public export path must retain the standalone long tail at .5x.
          if (id === 'audionals-standalone-v1') {
            chaseProject.songEndStep = 1;
            chaseProject.channels[0].analysis = { duration: buffer.duration };
            const blob = await renderMix(chaseProject, [buffer], {
              sampleRate: rate,
              tail: 'auto',
              bitDepth: 'float32'
            });
            const header = inspectPcmWav(await blob.arrayBuffer());
            ok(
              Math.abs(header.frames / rate - 0.25) < 2 / rate,
              'standalone exported auto-tail uses source endpoint ' + rate,
              { seconds: header.frames / rate }
            );
          }
        }
      // Native projects (including songOrigin landmarks) keep their established
      // pitch cap, source duration and 5ms edge envelopes without a profile.
      for (const landmark of [false, true])
        for (const rate of [44100, 48000, 96000]) {
          const q = make('audionals-editor-v1');
          delete q.legacyPlayback;
          if (landmark) q.songOrigin = { id: 'native-landmark-control' };
          q.channels.length = 1;
          q.sequences = [makeSequence(1, 0)];
          q.channels[0].volume = 1;
          q.channels[0].pitch = 9.03;
          q.sequences[0].steps[0][0] = 1;
          const ctx = new OfflineAudioContext(2, rate / 2, rate),
            buffer = pcm(ctx),
            engine = new Engine({ store: view(q), contextFactory: () => ctx, offline: true });
          engine.ensureContext();
          engine.setBuffer(0, buffer);
          engine.trigger(0, 0.02);
          const a = await ctx.startRendering();
          engine.dispose();
          const ref = new OfflineAudioContext(2, rate / 2, rate),
            src = ref.createBufferSource(),
            gain = ref.createGain(),
            pitch = landmark ? 9.03 : 4,
            duration = 0.1 / pitch,
            edge = Math.min(0.005, duration / 3);
          src.buffer = buffer;
          src.playbackRate.value = pitch;
          gain.gain.setValueAtTime(0, 0.02);
          gain.gain.linearRampToValueAtTime(1, 0.02 + edge);
          gain.gain.setValueAtTime(1, 0.02 + duration - edge);
          gain.gain.linearRampToValueAtTime(0, 0.02 + duration);
          src.connect(gain).connect(ref.destination);
          src.start(0.02, 0.025, 0.1);
          const e = await ref.startRendering();
          let error = 0;
          for (let c = 0; c < 2; c++)
            for (let n = 0; n < a.length; n++)
              error = Math.max(error, Math.abs(a.getChannelData(c)[n] - e.getChannelData(c)[n]));
          ok(
            error < 1e-6,
            `native ${landmark ? 'landmark' : 'project'} audio unchanged ${rate}`,
            error
          );
        }
      const overlap = make('audionals-editor-v1');
      overlap.channels.length = 1;
      overlap.channels[0].volume = 0.01;
      const overlapCtx = new OfflineAudioContext(2, 24000, 48000),
        overlapBuffer = pcm(overlapCtx),
        overlapEngine = new Engine({
          store: view(overlap),
          contextFactory: () => overlapCtx,
          offline: true
        });
      overlapEngine.ensureContext();
      overlapEngine.setBuffer(0, overlapBuffer);
      for (let i = 0; i < 33; i++) overlapEngine.trigger(0, 0.02);
      ok(
        [...overlapEngine._voices.get(0)].filter((v) => v.endTime > 0.02).length === 33,
        'historical overlapping triggers are not silently stolen at32'
      );
      const overlapAudio = await overlapCtx.startRendering();
      overlapEngine.dispose();
      const overlapRef = new OfflineAudioContext(2, 24000, 48000);
      reference(overlapRef, overlapRef.destination, overlapBuffer, 'audionals-editor-v1', {
        specifications: [{ rate: 0.5, rev: false, gain: 0.33 }]
      });
      const overlapExpected = await overlapRef.startRendering();
      let overlapError = 0;
      for (let c = 0; c < 2; c++)
        for (let n = 0; n < overlapAudio.length; n++)
          overlapError = Math.max(
            overlapError,
            Math.abs(overlapAudio.getChannelData(c)[n] - overlapExpected.getChannelData(c)[n])
          );
      ok(overlapError < 1e-6, 'historical33-voice sum matches independent audio', overlapError);
      const { store } = await import(base + 'state.js'),
        { engine: liveEngine } = await import(base + 'engine.js'),
        { freezeTrack, unfreezeTrack } = await import(base + 'pro-freeze.js');
      const frozenProject = make('audionals-standalone-v1');
      frozenProject.channels.length = 1;
      frozenProject.sequences = [makeSequence(1, 0)];
      frozenProject.sequences[0].steps[0][0] = 1;
      frozenProject.songEndStep = 1;
      Object.assign(frozenProject.channels[0], { pitch: 0.5, reverse: true, volume: 0.75 });
      store.loadProject(frozenProject);
      const liveContext = liveEngine.ensureContext(),
        freezeRate = liveContext.sampleRate,
        freezeBuffer = pcm(liveContext);
      liveEngine.setBuffer(0, freezeBuffer);
      liveEngine.syncMixer();
      const printed = async () => {
        const blob = await renderMix(store.project, liveEngine.buffers, {
            sampleRate: freezeRate,
            tail: 'auto',
            bitDepth: 'float32'
          }),
          bytes = await blob.arrayBuffer(),
          head = inspectPcmWav(bytes);
        return { frames: head.frames, planes: decodePcmPlanes(bytes, head) };
      };
      const before = await printed(),
        trackId = store.channel(0).id;
      await freezeTrack(trackId);
      const after = await printed();
      let freezeError = 0;
      for (let c = 0; c < 2; c++)
        for (let n = 0; n < Math.min(before.frames, after.frames); n++)
          freezeError = Math.max(freezeError, Math.abs(before.planes[c][n] - after.planes[c][n]));
      ok(
        before.frames === after.frames && freezeError < 1e-6,
        'freeze prints legacy profile exactly once',
        { freezeError, frames: [before.frames, after.frames] }
      );
      ok(
        store.project.legacyPlayback?.id === 'audionals-standalone-v1',
        'freeze retains historical profile'
      );
      unfreezeTrack(trackId);
      liveEngine.stop();
    }
    const { store: uiStore } = await import(base + 'state.js');
    uiStore.loadProject(make('audionals-editor-v1'));
    ok(
      document.querySelector('#synth-front')?.dataset.built === '0',
      'sample-only legacy project loads without an instrument face'
    );
    const added = uiStore.addInstrument('jims10');
    const { openSynthPanel } = await import(base + 'synth-panel.js');
    openSynthPanel(0);
    ok(
      !!added && document.querySelector('#synth-front')?.dataset.built === '1',
      'instrument can be added after sample-only import'
    );
    uiStore.loadProject(make('audionals-editor-v1'));
    ok(
      document.querySelector('#synth-front')?.dataset.built === '0',
      'loading sample-only project releases previous instrument face'
    );
    // Live comparison uses two inputs in one worklet quantum, so callback/clock
    // jitter cannot hide a difference. It also proves actual nonzero reference
    // energy; a silent graph cannot pass the cancellation assertion.
    const unlock = document.createElement('button');
    unlock.id = 'legacy-audio-unlock';
    unlock.textContent = 'Run live reference';
    document.body.append(unlock);
    for (const rate of [44100, 48000, 96000])
      for (const id of ['audionals-editor-v1', 'audionals-standalone-v1']) {
        const ctx = new AudioContext({ sampleRate: rate }),
          q = make(id),
          engine = new Engine({ store: view(q), contextFactory: () => ctx }),
          buffer = pcm(ctx);
        engine.ensureContext();
        q.channels.forEach((_, i) => engine.setBuffer(i, buffer));
        engine.syncMixer();
        ok(ctx.sampleRate === rate, 'live context rate ' + rate, ctx.sampleRate);
        await ctx.audioWorklet.addModule(
          '/audionaut-beta/tools/pro-legacy-reference-worklet.js'
        );
        const compare = new AudioWorkletNode(ctx, 'legacy-compare', {
          numberOfInputs: 2,
          numberOfOutputs: 1,
          outputChannelCount: [2]
        });
        compare.connect(ctx.destination);
        engine.masterGain.disconnect();
        engine.masterGain.connect(compare, 0, 0);
        const ref = ctx.createGain();
        ref.connect(compare, 0, 1);
        await new Promise((resolve, reject) => {
          unlock.dataset.waiting = 'yes';
          unlock.onclick = () => {
            unlock.dataset.waiting = 'no';
            ctx.resume().then(resolve, reject);
          };
        });
        const lead = ctx.currentTime + 0.15,
          plan = compilePlaybackPlan(q, { buffers: engine.buffers });
        for (const event of plan.events)
          engine.scheduleEvent({ ...event, time: event.time + lead });
        reference(ctx, ref, buffer, id, { lead });
        await new Promise((resolve) => setTimeout(resolve, 1200));
        const measurement = await new Promise((resolve) => {
          compare.port.onmessage = (e) => resolve(e.data);
          compare.port.postMessage('read');
        });
        ok(
          measurement.energy > 0.01 && measurement.peak < 1e-6,
          `${id} live independent PCM ${rate}`,
          measurement
        );
        measurements.push({ live: true, id, rate, ...measurement });
        if (rate === 96000 && id === 'audionals-standalone-v1') {
          q.songEndStep = 2;
          await engine.play({ fromBeat: 0 });
          ok(
            engine._loopRange === null && engine._plan.endBeat === 0.5,
            'historical transport onepass explicit end'
          );
          await new Promise((resolve) => setTimeout(resolve, 450));
          ok(
            !engine.isPlaying && engine.currentBeat === 0.5,
            'historical transport finishes without restarting'
          );
        }
        engine.dispose();
        compare.disconnect();
        compare.port.close();
        await ctx.close();
      }
    return { assertions: assertions.length, support: offlineRenderSupport(), measurements };
  });
  evaluation.catch(() => {});
  for (let i = 0; i < 6; i++) {
    const waiting = await Promise.race([
      evaluation.then(() => false),
      p
        .locator('#legacy-audio-unlock[data-waiting=yes]')
        .waitFor({ state: 'visible', timeout: 30000 })
        .then(() => true)
    ]);
    if (!waiting) break;
    await p.locator('#legacy-audio-unlock').click();
  }
  const result = await evaluation;
  result.previewAssertions = await checkLegacyTrimPreview(p);
  result.assertions += result.previewAssertions;
  assert.equal(logs.filter((x) => x.startsWith('pageerror:')).length, 0, logs.join('\n'));
  console.log(JSON.stringify(result, null, 2));
  console.log(`PASS ${result.assertions} historical playback assertions`);
} finally {
  await b.close();
  await new Promise((r) => srv.close(r));
}
