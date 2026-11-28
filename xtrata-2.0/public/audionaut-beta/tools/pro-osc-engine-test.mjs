#!/usr/bin/env node
// EXPERIMENT: the unison worklet (daw/js/synths/unison-worklet.js) against MAVREKT's
// native oscillator stacks. Checks it stays off by default, plays in tune at the same
// level, follows bend/glide, ends cleanly, and prints a cost and aliasing comparison.
// Run from xtrata-2.0: node public/audionaut-beta/tools/pro-osc-engine-test.mjs
import { serve, browser } from './serve.mjs';
import assert from 'node:assert/strict';
const edition = process.env.AUDIONAUT_EDITION || 'audionaut-beta';
const { srv, url } = await serve();
const b = await browser();
try {
  const page = await b.newPage();
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto(`${url}/${edition}/`);
  const result = await page.evaluate(async (edition) => {
    const base = `/${edition}/daw/js/`;
    const [{ SYNTH_BANK, synthDefaults }, { createVoice }, U] = await Promise.all(['synths.js', 'synths/voice-lifecycle.js', 'synths/unison-worklet.js'].map(f => import(base + f)));
    const failures = [], report = {};
    const check = (condition, label) => { if (!condition) failures.push(label); };
    const hz = pitch => 440 * 2 ** ((pitch - 69) / 12);
    const energy = (data, sr, f, from, to) => { const w = 2 * Math.PI * f / sr, c = 2 * Math.cos(w); let s1 = 0, s2 = 0; const i0 = Math.floor(from * sr), i1 = Math.min(data.length, Math.floor(to * sr)); for (let i = i0; i < i1; i++) { const x = data[i] * (.5 - .5 * Math.cos(2 * Math.PI * (i - i0) / (i1 - i0))), s = x + c * s1 - s2; s2 = s1; s1 = s; } return Math.sqrt(Math.max(0, s1 * s1 + s2 * s2 - c * s1 * s2)) / Math.max(1, i1 - i0); };
    const rms = (data, sr, from, to) => { let sum = 0, n = 0; for (let i = Math.floor(from * sr); i < Math.min(data.length, to * sr); i++) { sum += data[i] * data[i]; n++; } return Math.sqrt(sum / Math.max(1, n)); };
    const db = x => 20 * Math.log10(Math.max(1e-12, x));
    const anthem = { ...synthDefaults('mavrekt'), aVoices: 7, aDetune: 26, bVoices: 5, bDetune: 14, bOct: 0, balance: .45, width: .9, cutoff: 18000, fEnv: 0, drive: 0, gateDepth: 0, release: .1 };
    const render = async (worklet, { pitches = [60], seconds = 1, params = anthem, after } = {}) => {
      U.setOscEngine(worklet);
      const ctx = new OfflineAudioContext(2, Math.ceil(44100 * seconds), 44100);
      if (worklet) await U.prepareOscEngine(ctx);
      let ended = 0;
      const started = performance.now();
      const voices = pitches.map((pitch, k) => createVoice(ctx, ctx.destination, SYNTH_BANK.mavrekt, 'mavrekt', { pitch, vel: .8, time: 0, dur: seconds - .2, bpm: 120 }, params, () => { ended++; }, { seed: 11 + k }));
      after?.(voices);
      const built = performance.now() - started;
      const sources = voices.reduce((sum, v) => sum + v.sources.length, 0), nodes = voices.reduce((sum, v) => sum + v.nodes.size, 0);
      const t0 = performance.now(), out = await ctx.startRendering(), ms = performance.now() - t0;
      const l = out.getChannelData(0), r = out.getChannelData(1), mono = new Float32Array(l.length);
      for (let i = 0; i < l.length; i++) mono[i] = (l[i] + r[i]) / 2;
      return { l, r, mono, ms, built, sources, nodes, ended: () => ended, sr: 44100 };
    };

    check(!U.oscEngineEnabled(), 'the experimental engine is off unless asked for');
    // Four seconds, so the level is averaged over whole beat cycles of the detuned stack: native
    // oscillators all start in phase and swell and dip together, the worklet's start spread out.
    const native = await render(false, { seconds: 4 }), worklet = await render(true, { seconds: 4 });
    check(worklet.sources === 2 && native.sources === 12, `worklet replaces 12 oscillators with 2 gate sources (${native.sources} -> ${worklet.sources})`);
    report.nodesPerNote = { native: native.nodes, worklet: worklet.nodes };
    // Same pitch, similar level and stereo spread.
    const level = { native: db(rms(native.mono, 44100, .2, 3.7)), worklet: db(rms(worklet.mono, 44100, .2, 3.7)) };
    const side = x => db(rms(x.l.map((v, i) => v - x.r[i]), 44100, .2, 3.7)) - db(rms(x.mono, 44100, .2, 3.7));
    const peak = x => { let top = 0; for (let i = 0; i < 4410; i++) top = Math.max(top, Math.abs(x.l[i]), Math.abs(x.r[i])); return db(top); };
    report.attackPeakDb = { native: +peak(native).toFixed(1), worklet: +peak(worklet).toFixed(1) };
    report.levelDb = { native: +level.native.toFixed(1), worklet: +level.worklet.toFixed(1) };
    report.stereoSideDb = { native: +side(native).toFixed(1), worklet: +side(worklet).toFixed(1) };
    check(Math.abs(level.native - level.worklet) < 1.5, `level within 1.5 dB of native (${(level.worklet - level.native).toFixed(1)} dB)`);
    const fund = x => db(energy(x.mono, 44100, hz(60), .2, .7)), off = x => db(energy(x.mono, 44100, hz(60.5), .2, .7) + energy(x.mono, 44100, hz(59.5), .2, .7));
    check(fund(worklet) > off(worklet) + 6, 'worklet stack is centred on the note');
    // Each wave shape sounds.
    for (const wave of ['saw', 'square', 'triangle', 'pulse']) {
      const p = { ...anthem, aWave: wave, bWave: wave }, a = await render(false, { params: p, seconds: 4 }), c = await render(true, { params: p, seconds: 4 });
      const d = db(rms(c.mono, 44100, .2, 3.7)) - db(rms(a.mono, 44100, .2, 3.7));
      report[`level_${wave}`] = +d.toFixed(1);
      check(Math.abs(d) < 1.5, `${wave}: worklet level within 1.5 dB of native (${d.toFixed(1)})`);
    }
    // Pitch control reaches the worklet (bend, glide and the modulation kit share this path).
    {
      const single = { ...anthem, aVoices: 1, bVoices: 1, aDetune: 0, bDetune: 0 };
      const moved = await render(true, { params: single, after: voices => voices[0].setGlide(7, 0, 0) });
      const up = db(energy(moved.mono, 44100, hz(67), .2, .7)), stay = db(energy(moved.mono, 44100, hz(60), .2, .7));
      check(up > stay + 20, 'a pitch offset moves the worklet stack');
    }
    // The voice ends when its gate source stops.
    { const short = await render(true, { seconds: .6 }); await new Promise(r => setTimeout(r, 50)); check(short.ended() === 1 && rms(short.mono, 44100, .56, .6) < 1e-4, 'the worklet voice ends and goes silent after release'); }
    // Aliasing on a very high note: energy between the harmonics, relative to the fundamental.
    {
      const one = { ...anthem, aVoices: 1, bVoices: 1, aDetune: 0, bDetune: 0, bOct: 0 };
      report.aliasingDb = {};
      for (const [name, pitch] of [['C5', 72], ['C6', 84], ['C7', 96]]) {
        const f = hz(pitch);
        // Harmonics above half the sample rate fold back to 44100 - k*f. Take the loudest audible one.
        const between = x => { let worst = -200; for (let k = Math.ceil(22050 / f); k <= 60; k++) { const folded = Math.abs(44100 - k * f); if (folded > 30 && folded < 19000) worst = Math.max(worst, db(energy(x.mono, 44100, folded, .2, .7))); } return worst - db(energy(x.mono, 44100, f, .2, .7)); };
        const a = await render(false, { pitches: [pitch], params: one }), c = await render(true, { pitches: [pitch], params: one });
        report.aliasingDb[name] = { native: +between(a).toFixed(1), worklet: +between(c).toFixed(1) };
        check(between(c) < -30, `worklet aliasing on ${name} stays 30 dB under the fundamental (${between(c).toFixed(1)} dB)`);
      }
    }
    // Cost: an eight-note chord of the heaviest preset, ten seconds, best of three.
    {
      const chord = [48, 52, 55, 59, 60, 64, 67, 71], time = async worklet => { let best = Infinity; for (let k = 0; k < 3; k++) best = Math.min(best, (await render(worklet, { pitches: chord, seconds: 10 })).ms); return best; };
      const a = await time(false), c = await time(true);
      report.renderMsFor10s = { native: Math.round(a), worklet: Math.round(c), ratio: +(c / a).toFixed(2) };
      // Main-thread time to build the chord: this is what can stall the page when keys go down.
      const build = async worklet => { const runs = []; for (let k = 0; k < 9; k++) runs.push((await render(worklet, { pitches: chord, seconds: .3 })).built); return runs.sort((x, y) => x - y)[4]; };
      const ba = await build(false), bc = await build(true);
      report.buildMsFor8Notes = { native: +ba.toFixed(1), worklet: +bc.toFixed(1), ratio: +(bc / ba).toFixed(2) };
    }
    U.setOscEngine(false);
    return { failures, report };
  }, edition);
  console.log(JSON.stringify(result, null, 1));
  assert.deepEqual(result.failures, []);
  assert.deepEqual(errors, []);
} finally { await b.close(); srv.close(); }
