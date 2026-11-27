#!/usr/bin/env node
// Mono, legato and glide (daw/js/voicing.js): pitch slides on every kind of voice,
// held-key behaviour, sequenced notes, and that poly projects are untouched.
// Run from xtrata-2.0: node public/audionaut-beta-pro/tools/pro-voicing-test.mjs
import { serve, browser } from './serve.mjs';
import assert from 'node:assert/strict';
const edition = process.env.AUDIONAUT_EDITION || 'audionaut-beta-pro';
const { srv, url } = await serve();
const b = await browser();
try {
  const page = await b.newPage();
  await page.goto(`${url}/${edition}/`);
  const result = await page.evaluate(async (edition) => {
    const base = `/${edition}/daw/js/`;
    const [{ SYNTH_BANK, synthDefaults }, { createVoice }, { Engine }, { makeProject }, { normalizeVoicing }, { createSamplerVoice }] = await Promise.all(
      ['synths.js', 'synths/voice-lifecycle.js', 'engine.js', 'state.js', 'voicing.js', 'sampler-voice.js'].map(f => import(base + f)));
    const failures = [], notes = {};
    const check = (condition, label) => { if (!condition) failures.push(label); };
    const hz = pitch => 440 * 2 ** ((pitch - 69) / 12);
    // Energy at one frequency over a window (Goertzel).
    const energy = (buffer, f, from, to) => {
      const a = buffer.getChannelData(0), sr = buffer.sampleRate, w = 2 * Math.PI * f / sr, c = 2 * Math.cos(w);
      let s1 = 0, s2 = 0; const i0 = Math.floor(from * sr), i1 = Math.min(a.length, Math.floor(to * sr));
      for (let i = i0; i < i1; i++) { const x = a[i] * (.5 - .5 * Math.cos(2 * Math.PI * (i - i0) / (i1 - i0))), s = x + c * s1 - s2; s2 = s1; s1 = s; }
      return Math.sqrt(Math.max(0, s1 * s1 + s2 * s2 - c * s1 * s2)) / Math.max(1, i1 - i0);
    };
    // Strongest pitch in a window, searched in 10-cent steps between two MIDI notes.
    const loudest = (buffer, low, high, from, to) => { let best = low, top = -1; for (let p = low; p <= high + 1e-6; p += .1) { const e = energy(buffer, hz(p), from, to); if (e > top) { top = e; best = p; } } return best; };

    check(normalizeVoicing().mode === 'poly' && normalizeVoicing({ mode: 'x', glide: 9 }).glide === 2 && normalizeVoicing({ mode: 'legato', glide: -1 }).glide === 0, 'voicing settings are normalised');

    // 1. A fixed offset moves every source of each synth by the same interval.
    for (const id of ['subzero', 'jims10', 'mavrekt', 'element', 'lostwave']) {
      const render = async (offset) => {
        const ctx = new OfflineAudioContext(1, 44100, 44100);
        const voice = createVoice(ctx, ctx.destination, SYNTH_BANK[id], id, { pitch: 60, vel: .8, time: 0, dur: .8, bpm: 120 }, synthDefaults(id), () => {}, { seed: 1 });
        if (offset) voice.setGlide(offset, 0, 0);
        return ctx.startRendering();
      };
      const plain = await render(0), moved = await render(7);
      // The moved render must gain the new fundamental and lose the old one (no source left behind).
      const gained = energy(moved, hz(67), .2, .7) / Math.max(1e-9, energy(plain, hz(67), .2, .7)), lost = energy(plain, hz(60), .2, .7) / Math.max(1e-9, energy(moved, hz(60), .2, .7));
      notes[id] = { gained: +gained.toFixed(1), lost: +lost.toFixed(1) };
      // 'lost' is the strict half: a source left behind would keep energy at the old pitch. A sub-oscillator's
      // third harmonic already sits near the new pitch, so 'gained' only has to rise.
      check(gained > 1.5 && lost > 8, `${id}: a 7-semitone offset moves every source (gained ${gained.toFixed(1)}x, lost ${lost.toFixed(1)}x)`);
    }
    // 2. A slide starts at the old pitch and lands on the new one, and survives a voice rebuild.
    {
      const ctx = new OfflineAudioContext(1, 44100 * 1.2, 44100);
      const voice = createVoice(ctx, ctx.destination, SYNTH_BANK.jims10, 'jims10', { pitch: 60, vel: .8, time: 0, dur: 1.1, bpm: 120 }, synthDefaults('jims10'), () => {}, { seed: 1 });
      voice.setGlide(0, 0, .6, -12);
      const out = await ctx.startRendering();
      const start = loudest(out, 46, 62, 0, .08), middle = loudest(out, 46, 62, .26, .34), end = loudest(out, 46, 62, .8, 1.05);
      notes.slide = { start: +start.toFixed(1), middle: +middle.toFixed(1), end: +end.toFixed(1) };
      check(start < 50.5 && Math.abs(middle - 54) <= 1.2 && Math.abs(end - 60) <= .2, 'a slide runs from the old pitch to the new one in a straight line');
    }
    // 3. Sample voices share one detune between bend and glide.
    {
      const ctx = new OfflineAudioContext(1, 44100, 44100), buffer = ctx.createBuffer(1, 44100, 44100), d = buffer.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.sin(2 * Math.PI * 440 * i / 44100);
      const voice = createSamplerVoice(ctx, ctx.destination, { zones: [{ sourceTrackId: 'x', rootMidi: 69 }], attack: .001, release: .05 }, { pitch: 69, vel: 1, time: 0, dur: .9, held: false }, () => buffer, () => {});
      voice.setGlide(5, 0, 0); voice.setBend(2, 0);
      const out = await ctx.startRendering(), p = loudest(out, 66, 80, .2, .7); notes.sampler = +p.toFixed(1);
      check(Math.abs(p - 76) <= .25, `sampler glide and bend add up (${p.toFixed(1)})`);
    }

    const project = makeProject();
    const store = { project, get numChannels() { return project.channels.length; }, channel: i => project.channels[i], instrument: i => project.instruments[i], selectSequence: i => { project.currentSequence = i; }, on() {} };
    project.instruments[0].synthId = 'jims10';
    project.instruments[0].params = { ...synthDefaults('jims10'), release: .6 };
    const sequenced = async (voicing, list) => {
      if (voicing) project.instruments[0].voicing = voicing; else delete project.instruments[0].voicing;
      const ctx = new OfflineAudioContext(2, 44100 * 2, 44100), engine = new Engine({ store, contextFactory: () => ctx, offline: true });
      engine.ensureContext();
      for (const [pitch, time, dur] of list) engine.triggerNote(0, pitch, .8, time, dur);
      return ctx.startRendering();
    };
    // 4. Sequenced notes. Poly is bit-identical with and without the feature present.
    {
      const run = [[48, 0, .5], [55, .5, .8]]; // a fifth apart, so no sub-oscillator lands on the other note
      const poly = await sequenced(null, run), polyExplicit = await sequenced({ mode: 'poly', glide: .4 }, run);
      let same = true; const x = poly.getChannelData(0), y = polyExplicit.getChannelData(0);
      for (let i = 0; i < x.length; i++) if (x[i] !== y[i]) { same = false; break; }
      check(same, 'poly ignores the glide setting and renders identically');
      const mono = await sequenced({ mode: 'mono', glide: 0 }, run);
      const tailPoly = energy(poly, hz(48), .62, .9), tailMono = energy(mono, hz(48), .62, .9);
      notes.tail = { poly: tailPoly, mono: tailMono };
      check(tailMono < tailPoly * .1, 'mono cuts the previous note when the next one starts');
      const glide = await sequenced({ mode: 'mono', glide: .4 }, run);
      const early = loudest(glide, 46, 57, .5, .58), late = loudest(glide, 46, 57, 1.0, 1.25);
      notes.sequencedGlide = { early: +early.toFixed(1), late: +late.toFixed(1) };
      check(early < 50 && Math.abs(late - 55) <= .2, 'mono slides from the previous sequenced note');
      const apart = await sequenced({ mode: 'legato', glide: .4 }, run), over = await sequenced({ mode: 'legato', glide: .4 }, [[48, 0, .7], [55, .5, .8]]);
      const a = loudest(apart, 46, 57, .5, .58), o = loudest(over, 46, 57, .5, .58);
      notes.legatoSequenced = { separate: +a.toFixed(1), overlapping: +o.toFixed(1) };
      check(a > 54 && o < 50, 'legato slides only into a note that overlaps the one before');
    }
    // 5. Held keys.
    {
      const ctx = new AudioContext(); await ctx.resume();
      const engine = new Engine({ store, contextFactory: () => ctx });
      const sounding = () => [...engine._synthVoices.values()].filter(n => !n.stopping && !n.ended);
      const lights = new Map(), listener = e => lights.set(e.detail.pitch, e.detail.on);
      document.addEventListener('synth-note', listener);
      project.instruments[0].voicing = { mode: 'mono', glide: .05 };
      const a = engine.startNote(0, 48), c = engine.startNote(0, 60);
      check(sounding().length === 1 && sounding()[0].pitch === 60, 'mono: a second key replaces the first');
      engine.releaseNote(c);
      check(sounding().length === 1 && sounding()[0].pitch === 48 && engine.liveCount() === 1, 'mono: releasing the newest key returns to the key still held');
      engine.releaseNote(a);
      check(engine.liveCount() === 0 && engine._monoIds.size === 0, 'mono: releasing the last key lets the note go');
      engine.releaseAll(null, { immediate: true });

      project.instruments[0].voicing = { mode: 'legato', glide: .05 };
      const first = engine.startNote(0, 48), carrier = engine._synthVoices.get(first);
      const second = engine.startNote(0, 55), third = engine.startNote(0, 60);
      check(sounding().length === 1 && sounding()[0] === carrier && engine._mono.get(0).sounding === 60, 'legato: overlapping keys keep one voice and move its pitch');
      check(lights.get(55) === true && lights.get(60) === true, 'legato: each held key is lit');
      engine.releaseNote(third);
      check(engine._mono.get(0).sounding === 55 && lights.get(60) === false && !carrier.voice.released, 'legato: releasing the top key slides back without ending the note');
      engine.releaseNote(first);
      check(!carrier.voice.released && lights.get(48) === false, 'legato: releasing an older key changes nothing audible');
      engine.releaseNote(second);
      check(carrier.voice.released && engine._monoIds.size === 0 && lights.get(55) === false, 'legato: the note ends when the last key comes up');
      engine.releaseAll(null, { immediate: true });
      const again = engine.startNote(0, 62);
      check(engine._synthVoices.get(again)?.pitch === 62 && sounding().length === 1, 'legato: a key pressed after everything was released starts a new note');
      const held = engine.startNote(0, 65);
      engine.panic();
      check(engine._monoIds.size === 0 && engine.liveCount() === 0 && lights.get(65) === false, 'panic clears held mono notes and their lights');
      engine.releaseNote(held); engine.releaseNote(again);
      delete project.instruments[0].voicing;
      const p1 = engine.startNote(0, 48), p2 = engine.startNote(0, 60);
      check(sounding().length === 2, 'poly: both keys sound');
      engine.releaseNote(p1); engine.releaseNote(p2); engine.panic();
      document.removeEventListener('synth-note', listener);
      await ctx.close();
    }
    return { failures, notes };
  }, edition);
  console.log(JSON.stringify(result, null, 1));
  assert.deepEqual(result.failures, []);
} finally { await b.close(); srv.close(); }
