import assert from 'node:assert/strict';
import { serve, browser, page } from './serve.mjs';

const { srv, url } = await serve(), b = await browser(), logs = [], results = [];
const rates = [44100, 48000, 96000];
// Native PCM tests retain a tight float32 graph tolerance. Cross-rate rendering
// resamples the printed track instead of its original source before gain/pan.
// Chromium/WebKit peak at 8.0e-5 and RMS 2.35e-7; Firefox's SRC gives peak
// 1.97e-4, RMS 4.21e-6, relative RMS 2.18e-4. A dry source-only Firefox control
// retains the residual (peak 7.91e-5/RMS 3.61e-6), confirming conversion rather
// than a master/reverb routing error. Require ALL converted bounds: -70.5 dBFS
// peak, -104.4 dBFS RMS, -70.5 dB relative RMS, exact frames and zero sample shift.
// Gain/one-sample-delay controls ensure these bounds still detect musical changes.
const nativeLimits = { peak: 1e-6, rms: 1e-7, relativeRms: 1e-5 };
const convertedLimits = { peak: 3e-4, rms: 6e-6, relativeRms: 3e-4 };
const within = (error, limits) => ['peak', 'rms', 'relativeRms'].every(key => error[key] <= limits[key]);
try {
  for (const nativeRate of rates) {
    const p = await page(b, url, { logs });
    // Exercise the engine's actual device-rate freeze path independently of the
    // host's preferred output device. Offline exports have explicit rates below.
    await p.addInitScript(rate => {
      const Native = window.AudioContext || window.webkitAudioContext;
      window.AudioContext = class extends Native {
        constructor(options = {}) { super({ ...options, sampleRate: rate }); }
      };
      if (window.webkitAudioContext) window.webkitAudioContext = window.AudioContext;
    }, nativeRate);
    await p.goto(`${url}/audionaut-beta-pro/daw.html`);
    await p.waitForFunction(() => document.querySelectorAll('.channel.instrument').length >= 4);
    const result = await p.evaluate(async rates => {
      const base = '/audionaut-beta-pro/daw/js/';
      const { store, makeProject } = await import(base + 'state.js');
      const { engine } = await import(base + 'engine.js');
      const { renderMix } = await import(base + 'render-mix.js');
      const { freezeTrack, unfreezeTrack } = await import(base + 'pro-freeze.js');
      const { compilePlaybackPlan } = await import(base + 'playback-plan.js');
      const { pluginDefaults } = await import(base + 'plugins.js');
      const { validateRouting } = await import(base + 'mixer-runtime.js');
      const { inspectPcmWav, decodePcmPlanes } = await import(base + 'pcm-wav.js');
      store.loadProject(makeProject());
      store.setProjectProp('bpm', 420);
      store.setProjectProp('renderSeed', 'freeze-fidelity-v3');
      store.setProjectProp('masterVolume', .7);
      engine.ensureContext();
      const buffer = engine.ctx.createBuffer(1, Math.round(engine.ctx.sampleRate * .3), engine.ctx.sampleRate);
      for (let i = 0; i < buffer.length; i++) buffer.getChannelData(0)[i] = .25 * Math.sin(i * 2 * Math.PI * 220 / buffer.sampleRate);
      engine.setBuffer(0, buffer);
      store.setStep(0, 0, 1);
      store.setStep(0, 63, 1); // A second note's audio extends past the musical end.
      store.setChannelProp(0, 'volume', .4);
      store.setChannelProp(0, 'solo', true);
      store.setChannelProp(0, 'pan', -.4);
      store.setChannelProp(0, 'sends', { reverb: { enabled: true, amount: .15 } });
      store.setProjectProp('master', {
        inserts: [{ id: 'master-clip', type: 'clipper', enabled: true, params: { ...pluginDefaults('clipper') } }],
        fx: [], pan: 0, mono: false,
      });
      store.setAutomationLane({ target: { trackId: store.channel(0).id, kind: 'pan' }, points: [
        { beat: 0, value: -.4, curve: 'linear' }, { beat: 2, value: .4, curve: 'step' },
      ] });
      store.setAutomationLane({ target: { trackId: 'master', kind: 'volume' }, points: [
        { beat: 0, value: .7, curve: 'linear' }, { beat: 2, value: .5, curve: 'step' },
      ] });
      const render = async sampleRate => {
        const blob = await renderMix(store.project, engine.buffers, { tail: 'auto', bitDepth: 'float32', sampleRate });
        const bytes = await blob.arrayBuffer(), header = inspectPcmWav(bytes);
        // Browser decodeAudioData resamples to the device rate. Compare encoded
        // PCM directly, preserving each export's sample rate and exact frame count.
        return { planes: decodePcmPlanes(bytes, header), frames: header.frames, sampleRate: header.sampleRate };
      };
      const renderRates = async () => {
        const buffers = [];
        for (const sampleRate of rates) buffers.push(await render(sampleRate));
        return buffers;
      };
      const compare = (a, b) => {
        let peak = 0, sum = 0, energy = 0; const shiftError = [0, 0, 0];
        const length = Math.min(a.frames, b.frames);
        for (let ch = 0; ch < a.planes.length; ch++) for (let i = 0; i < length; i++) {
          const delta = Math.abs(a.planes[ch][i] - b.planes[ch][i]);
          peak = Math.max(peak, delta); sum += delta * delta; energy += a.planes[ch][i] ** 2;
          if (i > 0 && i < length - 1) for (let shift = -1; shift <= 1; shift++) shiftError[shift + 1] += (a.planes[ch][i] - b.planes[ch][i + shift]) ** 2;
        }
        return { bestShift: shiftError.indexOf(Math.min(...shiftError)) - 1, peak, rms: Math.sqrt(sum / (length * a.planes.length)), relativeRms: Math.sqrt(sum / Math.max(energy, 1e-30)), frames: [a.frames, b.frames], rates: [a.sampleRate, b.sampleRate] };
      };
      const timelineBefore = { enabled: store.project.timeline.enabled, lengthBeats: store.project.timeline.lengthBeats };
      const before = await renderRates(), id = store.channel(0).id;
      const frozen = await freezeTrack(id);
      const frozenBuffer = engine.buffers[store.project.channels.indexOf(frozen)];
      const frozenTail = store.project.timeline.clips.find(c => c.id === store.track(id).freezeState.clipId).tailSeconds;
      const after = await renderRates();
      unfreezeTrack(id);
      const restored = await renderRates();
      if (!store.channel(0).solo || store.project.channels.some(t => t.name.endsWith('(archived)') && t.solo)) throw Error('Unfreeze must restore original solo and clear archived freeze solo');
      const reference = before[rates.indexOf(engine.ctx.sampleRate)];
      const gainControl = { ...reference, planes: reference.planes.map(data => data.map(value => value * 1.001)) };
      const delayControl = { ...reference, planes: reference.planes.map(data => { const shifted = new Float32Array(data.length); shifted.set(data.subarray(0, -1), 1); return shifted; }) };
      const masterSends = Object.keys(engine.chains.get('master').sendFx);
      const masterFeedbackRejected = [true, false].every(enabled => { const candidate = structuredClone(store.project); candidate.master.fx.push({id:'invalid-feedback',type:'reverbSend',enabled,params:{}}); try { validateRouting(candidate); return false; } catch(error) { return error.message.includes('Master effects cannot send back'); } });
      const out = {
        masterSends, masterFeedbackRejected,
        controls: { gain: compare(reference, gainControl), oneSampleDelay: compare(reference, delayControl) },
        nativeRate: engine.ctx.sampleRate, frozenRate: frozenBuffer.sampleRate, frozenTail,
        exports: rates.map((exportRate, i) => ({ exportRate, freeze: compare(before[i], after[i]), unfreeze: compare(before[i], restored[i]) })),
        tempo: store.project.timeline.tempo[0].bpm,
        timeline: { before: timelineBefore, after: { enabled: store.project.timeline.enabled, lengthBeats: store.project.timeline.lengthBeats } },
      };
      store.loadProject(makeProject());
      const trackId = store.instrument(0).id;
      store.setTimeline({ enabled: true, clips: [], lengthBeats: 4 });
      const left = store.addClip({ id: 'left', trackId, type: 'midi', start: 0, duration: 1, offset: 0, notes: [{ id: 'held-note', step: 0, dur: 8, pitch: 60, vel: .8, expression: [{ offset: .5, type: 'bend', value: 2 }] }] });
      store.addClip({ ...structuredClone(left), id: 'right', start: 1, duration: 1, offset: 1 });
      const notes = compilePlaybackPlan(store.project).events.filter(e => e.type === 'note');
      out.split = { count: notes.length, duration: notes[0].duration, bend: notes[0].expression.some(p => p.value === 2) };
      let invalid = false;
      try { store.setTimeline({ loop: { enabled: true, start: 4, end: 2 } }); } catch { invalid = true; }
      out.invalidLoop = invalid;
      store.setAutomationLane({ target: { trackId, kind: 'pan' }, points: [{ beat: 0, value: 0, curve: 'step' }, { beat: 4, value: 1, curve: 'linear' }] });
      out.stepAutomation = compilePlaybackPlan(store.project).events.filter(e => e.type === 'automation').every(e => e.curve === 'step');
      return out;
    }, rates);
    results.push(result);
    console.log(JSON.stringify(result));
    await p.close();
  }
  for (const result of results) {
    assert.equal(result.nativeRate, result.frozenRate);
    assert.deepEqual(result.masterSends, [], 'Master must not feed shared returns, even through zero-gain sends');
    assert.equal(result.masterFeedbackRejected, true);
    for (const row of result.exports) {
      assert.deepEqual(row.freeze.rates, [row.exportRate, row.exportRate]);
      assert.equal(row.freeze.frames[0], row.freeze.frames[1]);
      assert.equal(row.freeze.bestShift, 0, JSON.stringify(row));
      assert.equal(row.unfreeze.bestShift, 0, JSON.stringify(row));
      assert.equal(row.unfreeze.frames[0], row.unfreeze.frames[1]);
      const limits = row.exportRate === result.nativeRate ? nativeLimits : convertedLimits;
      assert.ok(within(row.freeze, limits), JSON.stringify({ nativeRate: result.nativeRate, limits, ...row }));
      assert.ok(within(row.unfreeze, nativeLimits), JSON.stringify(row));
    }
    assert.ok(!within(result.controls.gain, convertedLimits), 'Tolerance must detect a 0.1% gain change');
    assert.equal(result.controls.oneSampleDelay.bestShift, 1);
    assert.ok(!within(result.controls.oneSampleDelay, convertedLimits), 'Tolerance must detect a one-sample timing change');
    assert.equal(result.tempo, 420);
    assert.ok(result.frozenTail > .2);
    assert.deepEqual(result.timeline.before, result.timeline.after);
    assert.deepEqual(result.split, { count: 1, duration: 1, bend: true });
    assert.equal(result.invalidLoop, true);
    assert.equal(result.stepAutomation, true);
  }
  assert.deepEqual(logs.filter(l => l.startsWith('pageerror')), []);
  console.log('PASS native/cross-rate freeze fidelity, exact frame counts, unfreeze restoration, MIDI split and automation boundaries');
} finally { await b.close(); await new Promise(r => srv.close(r)); }
