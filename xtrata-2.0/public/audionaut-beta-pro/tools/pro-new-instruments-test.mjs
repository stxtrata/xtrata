import assert from 'node:assert/strict';
import { serve, browser, page } from './serve.mjs';
const { srv, url } = await serve(), b = await browser(), logs = [];
try {
  const p = await page(b, url, { logs });
  await p.exposeFunction('instrumentProgress', label => console.log('Instruments:', label));
  await p.route(url + '/instrument-probe', route => route.fulfill({ contentType: 'text/html', body: '<!doctype html><button>Start audio</button>' }));
  await p.goto(url + '/instrument-probe'); await p.click('button');
  const result = await p.evaluate(async () => {
    const base = '/audionaut-beta-pro/daw/js/';
    const { SYNTH_BANK, synthDefaults } = await import(base + 'synths.js');
    const { createProInstrumentVoice, defaultInstrumentConfig, normalizeInstrumentConfig, selectPianoZone, starterCacheStats, proInstrumentTailSeconds } = await import(base + 'pro-instruments.js');
    const { createVoice } = await import(base + 'synths/voice-lifecycle.js');
    const { makeProject, makeSequence } = await import(base + 'state.js');
    const { normalizeProjectModel } = await import(base + 'project-model.js');
    const { renderMix } = await import(base + 'render-mix.js');
    const { decodePcmPlanes, inspectPcmWav } = await import(base + 'pcm-wav.js');
    const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
    const energy = (buffer, from = 0, to = buffer.duration) => {
      let sum = 0, peak = 0, count = 0, finite = true;
      for (let ch = 0; ch < buffer.numberOfChannels; ch++) { const data = buffer.getChannelData(ch); for (let i = Math.floor(from * buffer.sampleRate); i < Math.min(data.length, Math.ceil(to * buffer.sampleRate)); i++) { finite &&= Number.isFinite(data[i]); sum += data[i] ** 2; peak = Math.max(peak, Math.abs(data[i])); count++; } }
      return { rms: Math.sqrt(sum / Math.max(1, count)), peak, finite };
    };
    const compare = (a, b) => { let peak = 0; for (let ch = 0; ch < a.numberOfChannels; ch++) for (let i = 0; i < a.length; i++) peak = Math.max(peak, Math.abs(a.getChannelData(ch)[i] - b.getChannelData(ch)[i])); return peak; };
    async function render(id, { sr = 48000, pitch = id === 'drumrack' ? 36 : 60, velocity = .8, config, params = {}, source, seed = 1234, change } = {}) {
      const ctx = new OfflineAudioContext(2, sr * 2, sr), instrument = { id: 'instrument-under-test', synthId: id, sampleInstrument: config };
      const voice = createProInstrumentVoice(ctx, ctx.destination, instrument, { pitch, vel: velocity, time: .05, dur: .6, held: false }, { ...synthDefaults(id), ...params }, null, { offline: true, seed, bufferForSource: source });
      change?.(voice); const buffer = await ctx.startRendering();
      // Firefox delivers source ended events in later tasks than the render
      // promise. Require actual cleanup, allowing only a bounded event drain.
      for (let attempt = 0; attempt < 20 && !voice.ended; attempt++) await wait(5);
      return { buffer, voice, cache: starterCacheStats(ctx) };
    }
    const out = { starters: [], generic: [], pads: [], live: [] };
    for (const id of ['drumrack', 'granulator', 'concertpiano']) {
      if (!SYNTH_BANK[id]) throw Error('Instrument not registered: ' + id);
      for (const sr of [44100, 48000, 96000]) {
        const played = await render(id, { sr }); out.starters.push({ id, sr, ...energy(played.buffer), tail: energy(played.buffer, 1.6).rms, ended: played.voice.ended, cacheBytes: played.cache.bytes });
      }
      const a = await render(id), same = await render(id); out[id + 'Repeat'] = compare(a.buffer, same.buffer);
      const ctx = new OfflineAudioContext(2, 48000 * 2, 48000); createVoice(ctx, ctx.destination, SYNTH_BANK[id], id, { pitch: id === 'drumrack' ? 36 : 60, vel: .8, time: .05, dur: .6 }, synthDefaults(id), null, { seed: 1234 }); out.generic.push({ id, ...energy(await ctx.startRendering()) });
      await window.instrumentProgress(id + ' rate/seed/managed voice checks');
    }
    for (let i = 0; i < 16; i++) { const played = await render('drumrack', { pitch: 36 + i }); out.pads.push({ index: played.voice.pad.index, ...energy(played.buffer) }); }
    const soft = await render('drumrack', { velocity: .2 }), loud = await render('drumrack', { velocity: .8 }); out.velocityRatio = energy(loud.buffer).rms / energy(soft.buffer).rms;
    // Samples supplied by the loader are the actual source, including silence.
    const sourceContext = new OfflineAudioContext(1, 1, 48000), silence = sourceContext.createBuffer(1, 96000, 48000), splitSource = sourceContext.createBuffer(1, 96000, 48000);
    for (let i = 48000; i < splitSource.length; i++) splitSource.getChannelData(0)[i] = .3 * Math.sin(i * 2 * Math.PI * 220 / 48000);
    const customDrum = defaultInstrumentConfig('drumrack'); customDrum.sources = [{ id: 'imported', sourceTrackId: 'sample-track' }]; customDrum.pads[0].sourceId = 'imported';
    out.silentDrum = energy((await render('drumrack', { config: customDrum, source: () => silence })).buffer).peak;
    out.tails = {
      crash: proInstrumentTailSeconds({ synthId: 'drumrack' }, { pitch: 48, duration: .05 }),
      longCustom: proInstrumentTailSeconds({ synthId: 'drumrack', sampleInstrument: customDrum }, { pitch: 36, duration: .05 }, { bufferForSource: () => ({ duration: 8 }) }),
      pitchedChase: proInstrumentTailSeconds({ synthId: 'drumrack', sampleInstrument: customDrum, params: { tune: 12 } }, { pitch: 36, duration: .05, chaseOffsetSeconds: 1 }, { bufferForSource: () => ({ duration: 8 }) }),
    };
    const grainConfig = defaultInstrumentConfig('granulator'); grainConfig.sources = [{ id: 'recording', sourceTrackId: 'sample-track' }]; grainConfig.sourceId = 'recording';
    const quiet = await render('granulator', { config: grainConfig, source: () => splitSource, params: { position: .05, spray: 0, scan: 0, detune: 0 } });
    const audio = await render('granulator', { config: grainConfig, source: () => splitSource, params: { position: .75, spray: 0, scan: 0, detune: 0 } });
    out.grainSource = { quiet: energy(quiet.buffer).peak, audible: energy(audio.buffer).rms };
    const otherSeed = await render('granulator', { seed: 44 }); out.grainSeedDifference = compare((await render('granulator')).buffer, otherSeed.buffer);
    const moved = await render('granulator', { config: grainConfig, source: () => splitSource, params: { position: .05, spray: 0, scan: 0, detune: 0 }, change: voice => voice.setParameters({ position: .75 }, .3) });
    out.grainChange = { before: energy(moved.buffer, .06, .25).peak, after: energy(moved.buffer, .4, .6).rms };
    // Explicit hat choke is scoped to one rack, not other instrument tracks.
    async function choke(otherRack) { const ctx = new OfflineAudioContext(2, 48000, 48000), config = defaultInstrumentConfig('drumrack'); let open;
      open = createProInstrumentVoice(ctx, ctx.destination, { id: 'rack-a', synthId: 'drumrack', sampleInstrument: config }, { pitch: 46, vel: .8, time: .05, dur: .1, held: false }, synthDefaults('drumrack'), null, { offline: true });
      createProInstrumentVoice(ctx, ctx.destination, { id: otherRack ? 'rack-b' : 'rack-a', synthId: 'drumrack', sampleInstrument: config }, { pitch: 42, vel: .8, time: .2, dur: .1, held: false }, synthDefaults('drumrack'), null, { offline: true });
      const endTime = open.endTime, buffer = await ctx.startRendering(); return { endTime, tail: energy(buffer, .5, .7).rms }; }
    out.choke = await choke(false); out.separateRack = await choke(true);
    const pianoConfig = defaultInstrumentConfig('concertpiano'); pianoConfig.sources = [{ id: 'soft', sourceTrackId: 'soft-track' }, { id: 'hard', sourceTrackId: 'hard-track' }]; pianoConfig.zones = [{ id: 'soft-zone', sourceId: 'soft', rootMidi: 60, lowMidi: 0, highMidi: 127, lowVelocity: 1, highVelocity: 63 }, { id: 'hard-zone', sourceId: 'hard', rootMidi: 60, lowMidi: 0, highMidi: 127, lowVelocity: 64, highVelocity: 127 }];
    const normalized = normalizeInstrumentConfig('concertpiano', pianoConfig); out.zones = [.2, .8].map(v => selectPianoZone(normalized, 72, v).id);
    const selected = await render('concertpiano', { config: pianoConfig, pitch: 72, source: entry => entry.id === 'soft' ? silence : splitSource }); out.pianoCustom = { zone: selected.voice.zone.id, rate: selected.voice.sources[0].playbackRate.value, audible: energy(selected.buffer).rms };
    out.missingRejected = false; try { await render('concertpiano', { config: pianoConfig, source: () => null }); } catch (error) { out.missingRejected = /not loaded|missing/.test(error.message); }
    out.malformedRejected = false; try { normalizeInstrumentConfig('concertpiano', { ...pianoConfig, zones: [{ ...pianoConfig.zones[0], lowVelocity: 0 }] }); } catch { out.malformedRejected = true; }
    out.budgetRejected = false; try { const ctx = new OfflineAudioContext(2, 48000, 48000); createProInstrumentVoice(ctx, ctx.destination, { synthId: 'granulator' }, { pitch: 60, vel: .8, time: 0, dur: 500, held: false }, { ...synthDefaults('granulator'), density: 60 }, null, { offline: true }); } catch (error) { out.budgetRejected = /8192 grains/.test(error.message); }
    await window.instrumentProgress('pads / custom sources / zones / bounds');
    // Use the real project planner, Engine factory, shared source resolver and WAV
    // export, including a final short gate whose sample lasts beyond song end.
    out.exports = [];
    for (const id of ['drumrack', 'granulator', 'concertpiano']) {
      const project = makeProject(); project.channels.length = 1; project.instruments.length = 1; project.sequences = [makeSequence(1)]; project.bpm = 120;
      project.instruments[0].synthId = id; project.instruments[0].params = synthDefaults(id);
      project.sequences[0].notes[0] = [{ id: 'export-note', step: id === 'drumrack' ? 15 : 0, dur: id === 'drumrack' ? .4 : 4, pitch: id === 'drumrack' ? 48 : 60, vel: .8 }];
      project.songEndStep = 16; normalizeProjectModel(project);
      const blob = await renderMix(project, [], { tail: 'auto', bitDepth: 'float32' }), bytes = await blob.arrayBuffer(), metadata = inspectPcmWav(bytes), planes = decodePcmPlanes(bytes);
      const buffer = { numberOfChannels: 2, duration: metadata.frames / metadata.sampleRate, sampleRate: metadata.sampleRate, getChannelData: i => planes[i] };
      out.exports.push({ id, seconds: buffer.duration, rms: energy(buffer).rms, late: energy(buffer, 2.05, 2.3).rms });
      await window.instrumentProgress(id + ' Engine export');
    }
    const project = makeProject(); project.channels.length = 1; project.instruments.length = 1; project.sequences = [makeSequence(1)]; project.bpm = 120; project.songEndStep = 16;
    const longSample = sourceContext.createBuffer(1, 48000 * 4, 48000);
    for (let i = 0; i < longSample.length; i++) longSample.getChannelData(0)[i] = .15 * Math.sin(i * 2 * Math.PI * 220 / 48000);
    const rack = structuredClone(customDrum); rack.sources[0].sourceTrackId = project.channels[0].id;
    project.instruments[0].synthId = 'drumrack'; project.instruments[0].sampleInstrument = rack; project.instruments[0].params = synthDefaults('drumrack');
    project.sequences[0].notes[0] = [{ id: 'late-custom', step: 15, dur: .4, pitch: 36, vel: .8 }]; normalizeProjectModel(project);
    const exported = await renderMix(project, [longSample], { tail: 'auto', bitDepth: 'float32' }), encoded = await exported.arrayBuffer(), header = inspectPcmWav(encoded), decoded = decodePcmPlanes(encoded);
    const longBuffer = { numberOfChannels: 2, duration: header.frames / header.sampleRate, sampleRate: header.sampleRate, getChannelData: i => decoded[i] };
    out.customExport = { seconds: longBuffer.duration, late: energy(longBuffer, 4.5, 5).rms };
    await window.instrumentProgress('custom source tail export');
    const live = new AudioContext(); await live.resume();
    for (const id of ['drumrack', 'granulator', 'concertpiano']) {
      const analyser = live.createAnalyser(); analyser.fftSize = 2048; analyser.connect(live.destination);
      const voice = createProInstrumentVoice(live, analyser, { id: 'live-' + id, synthId: id }, { pitch: id === 'drumrack' ? 36 : 60, vel: .8, time: live.currentTime + .01, dur: .5, held: true }, synthDefaults(id), null, { offline: false, seed: 1234 });
      const values = new Float32Array(analyser.fftSize); let audible = false;
      if (id === 'granulator') await wait(550); // Beyond the initial lookahead window.
      for (let attempt = 0; attempt < 24 && !audible; attempt++) { await wait(25); analyser.getFloatTimeDomainData(values); audible = values.some(v => Math.abs(v) > .001); }
      voice.release(); if (id === 'drumrack') { await wait(30); out.drumKeyUpKeepsTail = !voice.ended; voice.stop(); }
      await wait(450); out.live.push({ id, audible, ended: voice.ended, sources: voice.sources?.length ?? 0 }); analyser.disconnect();
      await window.instrumentProgress(id + ' live sound and release');
    }
    await live.close(); return out;
  });
  console.log(JSON.stringify({ result, logs }));
  for (const voice of result.starters) { assert.equal(voice.finite, true); assert.ok(voice.rms > 1e-4, JSON.stringify(voice)); assert.ok(voice.peak < 2); assert.ok(voice.tail < 1e-6); assert.equal(voice.ended, true); assert.ok(voice.cacheBytes <= 32 * 1024 * 1024); }
  for (const voice of result.generic) { assert.ok(voice.rms > 1e-4); assert.equal(voice.finite, true); }
  for (const [i, pad] of result.pads.entries()) { assert.equal(pad.index, i); assert.ok(pad.rms > 1e-4); }
  for (const id of ['drumrack', 'granulator', 'concertpiano']) assert.ok(result[id + 'Repeat'] <= 1e-6, id + ' repeatability');
  assert.ok(result.velocityRatio > 3.9 && result.velocityRatio < 4.1); assert.equal(result.silentDrum, 0);
  assert.equal(result.grainSource.quiet, 0); assert.ok(result.grainSource.audible > .001); assert.ok(result.grainSeedDifference > .001); assert.equal(result.grainChange.before, 0); assert.ok(result.grainChange.after > .001);
  assert.ok(result.choke.endTime <= .205); assert.ok(result.choke.tail < 1e-7); assert.ok(result.separateRack.endTime > 1); assert.ok(result.separateRack.tail > 1e-5);
  assert.deepEqual(result.zones, ['soft-zone', 'hard-zone']); assert.equal(result.pianoCustom.zone, 'hard-zone'); assert.equal(result.pianoCustom.rate, 2); assert.ok(result.pianoCustom.audible > .001);
  assert.equal(result.missingRejected, true); assert.equal(result.malformedRejected, true); assert.equal(result.budgetRejected, true); assert.equal(result.drumKeyUpKeepsTail, true);
  assert.ok(Math.abs(result.tails.crash - 1.75) < 1e-9); assert.ok(Math.abs(result.tails.longCustom - 7.95) < 1e-9); assert.ok(Math.abs(result.tails.pitchedChase - 2.95) < 1e-9);
  for (const item of result.exports) { assert.ok(item.rms > .001, JSON.stringify(item)); if (item.id === 'drumrack') { assert.ok(Math.abs(item.seconds - 3.675) <= 1 / 48000); assert.ok(item.late > 1e-4); } }
  assert.ok(Math.abs(result.customExport.seconds - 5.875) <= 1 / 48000); assert.ok(result.customExport.late > .001);
  for (const voice of result.live) { assert.equal(voice.audible, true, voice.id); assert.equal(voice.ended, true, voice.id); }
  assert.deepEqual(logs, []); console.log('PASS three sample instruments: live/offline audio, 16 pads, choke isolation, deterministic input-buffer grains, multisample velocity/root mapping, source failures and cleanup');
} finally { await b.close(); await new Promise(resolve => srv.close(resolve)); }
