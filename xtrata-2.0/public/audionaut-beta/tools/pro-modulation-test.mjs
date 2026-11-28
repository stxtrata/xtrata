#!/usr/bin/env node
// Modulation kit (daw/js/modulation.js): two LFOs and four slots on every instrument.
// Checks vibrato, tremolo, pan, filter cutoff, bar lock, velocity routing, VALORIUM,
// the editor, and that a project with no modulation renders identically.
// Run from xtrata-2.0: node public/audionaut-beta/tools/pro-modulation-test.mjs
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
    const [{ SYNTH_BANK, synthDefaults }, { probeModTargets }, { Engine }, { makeProject }, M, { createProInstrumentVoice }] = await Promise.all(
      ['synths.js', 'synths/voice-lifecycle.js', 'engine.js', 'state.js', 'modulation.js', 'pro-instruments.js'].map(f => import(base + f)));
    const failures = [], notes = {};
    const check = (condition, label) => { if (!condition) failures.push(label); };
    const hz = pitch => 440 * 2 ** ((pitch - 69) / 12);
    const energy = (data, sr, f, from, to) => {
      const w = 2 * Math.PI * f / sr, c = 2 * Math.cos(w); let s1 = 0, s2 = 0; const i0 = Math.floor(from * sr), i1 = Math.min(data.length, Math.floor(to * sr));
      for (let i = i0; i < i1; i++) { const x = data[i] * (.5 - .5 * Math.cos(2 * Math.PI * (i - i0) / (i1 - i0))), s = x + c * s1 - s2; s2 = s1; s1 = s; }
      return Math.sqrt(Math.max(0, s1 * s1 + s2 * s2 - c * s1 * s2)) / Math.max(1, i1 - i0);
    };
    const loudest = (data, sr, low, high, from, to) => { let best = low, top = -1; for (let p = low; p <= high + 1e-6; p += .1) { const e = energy(data, sr, hz(p), from, to); if (e > top) { top = e; best = p; } } return best; };
    const rms = (data, sr, from, to) => { let sum = 0, n = 0; for (let i = Math.floor(from * sr); i < Math.min(data.length, to * sr); i++) { sum += data[i] * data[i]; n++; } return Math.sqrt(sum / Math.max(1, n)); };
    // Share of the signal's movement that is fast: higher means brighter.
    const bright = (data, sr, from, to) => { let d = 0, s = 0; for (let i = Math.floor(from * sr) + 1; i < Math.min(data.length, to * sr); i++) { d += (data[i] - data[i - 1]) ** 2; s += data[i] * data[i]; } return Math.sqrt(d / Math.max(1e-12, s)); };
    const lfo = (patch) => ({ shape: 'sine', sync: false, hz: 4, div: '1/4', lock: 'note', ...patch });
    const mod = (lfos, slots) => M.normalizeMod({ lfos, slots });

    const n = M.normalizeMod({ lfos: [{ shape: 'nope', hz: 999 }], slots: [{ source: 'x', target: 'cutoff', amount: 7 }] });
    check(n.lfos.length === 2 && n.slots.length === 4 && n.lfos[0].shape === 'sine' && n.lfos[0].hz === 30 && n.slots[0].amount === 1 && n.slots[0].source === 'lfo1', 'settings are normalised');
    check(!M.modActive(M.normalizeMod()) && !M.modActive(mod([], [{ target: '@pitch', amount: 0 }])) && M.modActive(mod([], [{ target: '@pitch', amount: .1 }])), 'a slot is active only with a target and an amount');
    check(M.lfoHz(lfo({ sync: true, div: '1/8' }), 120) === 4 && M.lfoHz(lfo({ sync: true, div: '1 bar' }), 120) === .5 && M.lfoPhase(lfo({ sync: true, div: '1/4', lock: 'bar' }), 2.5) === 2.5 && M.lfoPhase(lfo({ sync: true, lock: 'note' }), 2.5) === 0, 'tempo rates and bar lock are computed from the song position');

    const project = makeProject();
    const store = { project, get numChannels() { return project.channels.length; }, channel: i => project.channels[i], instrument: i => project.instruments[i], selectSequence: i => { project.currentSequence = i; }, on() {} };
    project.bpm = 120;
    const render = async (synthId, modulation, { seconds = 1, pitch = 60, vel = .8, dur = .9, beat, params = {} } = {}) => {
      const instrument = project.instruments[0];
      instrument.synthId = synthId; instrument.params = { ...synthDefaults(synthId), ...params };
      if (modulation) instrument.mod = modulation; else delete instrument.mod;
      const ctx = new OfflineAudioContext(2, Math.ceil(44100 * seconds), 44100), engine = new Engine({ store, contextFactory: () => ctx, offline: true });
      engine.ensureContext();
      engine._startVoice(0, pitch, vel, { time: 0, duration: dur, source: 'transport', held: false, seed: 7, beat });
      const out = await ctx.startRendering(), l = out.getChannelData(0), r = out.getChannelData(1), mono = new Float32Array(l.length);
      for (let i = 0; i < l.length; i++) mono[i] = (l[i] + r[i]) / 2;
      return { l, r, mono, sr: 44100 };
    };
    // Chrome renders these synths with last-bit differences from run to run (about -105 dB), so
    // "identical" means within that noise, far below anything modulation would do.
    const same = (a, c) => { for (let i = 0; i < a.length; i++) if (Math.abs(a[i] - c[i]) > 2e-5) return false; return true; };

    // 1. No modulation, or slots with nothing to do, leave the render untouched.
    for (const id of ['jims10', 'mavrekt', 'element', 'lostwave']) {
      const plain = await render(id, null), idle = await render(id, mod([lfo({ shape: 'square' })], [{ source: 'lfo1', target: '', amount: .8 }, { source: 'lfo2', target: 'cutoff', amount: 0 }]));
      check(same(plain.l, idle.l) && same(plain.r, idle.r), `${id}: inactive modulation renders identically`);
    }
    // 2. Vibrato: a 2.5 Hz sine at half amount swings ±6 semitones.
    {
      const out = await render('subzero', mod([lfo({ hz: 2.5 })], [{ source: 'lfo1', target: '@pitch', amount: .5 }]));
      const up = loudest(out.mono, out.sr, 50, 70, .08, .12), down = loudest(out.mono, out.sr, 50, 70, .28, .32);
      notes.vibrato = { up: +up.toFixed(1), down: +down.toFixed(1) };
      check(Math.abs(up - 66) <= .6 && Math.abs(down - 54) <= .6, 'pitch target swings a full amount of 12 semitones each way');
    }
    // 3. Tremolo dips and never boosts; pan moves the sound side to side.
    {
      const plain = await render('subzero', null, { params: { release: .05 } }), trem = await render('subzero', mod([lfo({ shape: 'square', hz: 4 })], [{ source: 'lfo1', target: '@level', amount: 1 }]), { params: { release: .05 } });
      const high = rms(trem.mono, trem.sr, .29, .35), low = rms(trem.mono, trem.sr, .16, .22), reference = rms(plain.mono, plain.sr, .29, .35);
      notes.tremolo = { high, low, reference };
      check(low < high * .05 && Math.abs(high / reference - 1) < .05, 'tremolo dips to silence at full amount and peaks at the normal level');
      const pan = await render('subzero', mod([lfo({ shape: 'square', hz: 4 })], [{ source: 'lfo1', target: '@pan', amount: 1 }]));
      const first = rms(pan.r, pan.sr, .04, .1) / Math.max(1e-9, rms(pan.l, pan.sr, .04, .1)), second = rms(pan.r, pan.sr, .16, .22) / Math.max(1e-9, rms(pan.l, pan.sr, .16, .22));
      notes.pan = { first, second };
      check(first > 10 && second < .1, 'pan target swings hard right then hard left');
    }
    // 4. Filter cutoff on the Marek synths moves in octaves.
    for (const id of ['mavrekt', 'element', 'lostwave']) {
      const params = { cutoff: 1200, fEnv: 0, reso: 1, ...(id === 'element' ? { posStart: .9, posEnd: .9 } : {}) }; // ELEMENT: hold a bright frame
      const plain = await render(id, null, { params }), swept = await render(id, mod([lfo({ shape: 'square', hz: 2 })], [{ source: 'lfo1', target: 'cutoff', amount: .5 }]), { params });
      const still = bright(plain.mono, plain.sr, .1, .22) / bright(plain.mono, plain.sr, .35, .47), moved = bright(swept.mono, swept.sr, .1, .22) / bright(swept.mono, swept.sr, .35, .47);
      notes[id] = { still: +still.toFixed(2), moved: +moved.toFixed(2) };
      check(moved > 2 && still < 1.5, `${id}: an LFO on cutoff opens and closes the filter (${moved.toFixed(2)}x against ${still.toFixed(2)}x)`);
      check(probeModTargets(SYNTH_BANK[id], id, synthDefaults(id)).includes('cutoff'), `${id}: cutoff is offered as a target`);
    }
    // 5. Bar lock: the same note started half a beat in begins half-way through the cycle.
    {
      const slots = [{ source: 'lfo1', target: '@level', amount: 1 }], params = { release: .05 };
      const free = await render('subzero', mod([lfo({ shape: 'square', sync: true, div: '1/4', lock: 'note' })], slots), { beat: 2.5, params });
      const locked = await render('subzero', mod([lfo({ shape: 'square', sync: true, div: '1/4', lock: 'bar' })], slots), { beat: 2.5, params });
      const a = rms(free.mono, free.sr, .08, .2), c = rms(locked.mono, locked.sr, .08, .2), d = rms(locked.mono, locked.sr, .3, .45);
      notes.barLock = { restart: a, locked: c, lockedLater: d };
      check(a > c * 10 && d > c * 10, 'a bar-locked LFO follows the song position, a restarting one follows the note');
    }
    // 6. Velocity as a source.
    {
      const slots = [{ source: 'velocity', target: '@pitch', amount: .5 }];
      const hard = await render('subzero', mod([], slots), { vel: 1 }), soft = await render('subzero', mod([], slots), { vel: .5 });
      const h = loudest(hard.mono, hard.sr, 58, 68, .2, .6), s = loudest(soft.mono, soft.sr, 58, 68, .2, .6);
      notes.velocity = { hard: +h.toFixed(1), soft: +s.toFixed(1) };
      check(Math.abs(h - 66) <= .3 && Math.abs(s - 63) <= .3, 'velocity scales how far a slot moves its target');
    }
    // 7. VALORIUM (sample instrument path).
    {
      const patch = synthDefaults('valorium'), play = async (modulation) => {
        const ctx = new OfflineAudioContext(2, 44100, 44100);
        createProInstrumentVoice(ctx, ctx.destination, { synthId: 'valorium', params: patch, sampleInstrument: null }, { pitch: 60, vel: .8, time: 0, dur: .9, held: false, bpm: 120 }, patch, null, { mod: modulation, bufferForSource: () => null });
        const out = await ctx.startRendering(); return out.getChannelData(0);
      };
      const plain = await play(null), trem = await play(mod([lfo({ shape: 'square', hz: 4 })], [{ source: 'lfo1', target: '@level', amount: 1 }]));
      const high = rms(trem, 44100, .29, .35), low = rms(trem, 44100, .16, .22);
      notes.valorium = { high, low, plain: rms(plain, 44100, .29, .35) };
      check(low < high * .05 && high > 0, 'VALORIUM takes the modulation kit');
    }
    // 8. Live voices clean up their LFOs.
    {
      const ctx = new AudioContext(); await ctx.resume();
      const engine = new Engine({ store, contextFactory: () => ctx });
      project.instruments[0].synthId = 'mavrekt'; project.instruments[0].params = synthDefaults('mavrekt');
      project.instruments[0].mod = mod([lfo({ sync: true, div: '1/8', lock: 'bar' })], [{ source: 'lfo1', target: 'cutoff', amount: .4 }, { source: 'lfo2', target: '@pan', amount: .5 }]);
      const id = engine.startNote(0, 60), record = engine._synthVoices.get(id);
      check(!!record && !engine.lastVoiceError, 'a modulated live note starts');
      engine.panic();
      const started = performance.now();
      while (engine._synthVoices.size && performance.now() - started < 2000) await new Promise(r => setTimeout(r, 10));
      check(engine._synthVoices.size === 0, 'a modulated live note ends cleanly after panic');
      await ctx.close();
    }
    return { failures, notes };
  }, edition);
  console.log(JSON.stringify(result, null, 1));
  assert.deepEqual(result.failures, []);

  // The editor in the real page.
  await page.goto(`${url}/${edition}/daw.html`);
  await page.waitForSelector('#mod-open', { state: 'attached' });
  await page.waitForTimeout(1200);
  const ui = await page.evaluate(async () => {
    const { store } = await import('./daw/js/state.js');
    const { modTargetsFor } = await import('./daw/js/mod-panel.js');
    const button = document.getElementById('mod-open'), dialog = document.getElementById('mod-dialog');
    button.click();
    const selects = () => [...dialog.querySelectorAll('.mod-slot select')];
    const before = { open: dialog.open, lfoRows: dialog.querySelectorAll('.mod-lfo').length, slotRows: dialog.querySelectorAll('.mod-slot').length, stored: store.instrument(0).mod ?? null };
    const target = selects()[1], options = [...target.options].map(o => o.value);
    target.value = '@pitch'; target.dispatchEvent(new Event('change', { bubbles: true }));
    const after = { stored: store.instrument(0).mod?.slots?.[0], label: button.textContent, targets: modTargetsFor(0).map(t => t[0]) };
    button.click();
    return { before, after, options, closed: !dialog.open };
  });
  console.log(JSON.stringify(ui));
  assert.equal(ui.before.open, true); assert.equal(ui.before.lfoRows, 2); assert.equal(ui.before.slotRows, 4); assert.equal(ui.before.stored, null);
  assert.ok(ui.options.includes('@pitch') && ui.options.includes('@level') && ui.options.includes('@pan'));
  assert.deepEqual(ui.after.stored, { source: 'lfo1', target: '@pitch', amount: 0.25 });
  assert.ok(ui.after.label.includes('●')); assert.equal(ui.closed, true);
  assert.deepEqual(errors, []);
} finally { await b.close(); srv.close(); }
