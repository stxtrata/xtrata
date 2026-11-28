#!/usr/bin/env node
// Second-round additions to the Marek synths: MAVREKT sine/noise shapes and per-part
// filter types, LOSTWAVE unison on every oscillator, PWM mode and filter 1 type, and
// ELEMENT's tempo-locked position LFO. Also renders every preset.
// Run from xtrata-2.0: node public/audionaut-beta-pro/tools/pro-synth-expansion-test.mjs
import { serve, browser } from './serve.mjs';
import assert from 'node:assert/strict';
const edition = process.env.AUDIONAUT_EDITION || 'audionaut-beta-pro';
const { srv, url } = await serve();
const b = await browser();
try {
  const page = await b.newPage();
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto(`${url}/${edition}/`);
  const result = await page.evaluate(async (edition) => {
    const base = `/${edition}/daw/js/`;
    const [{ SYNTH_BANK, synthDefaults }, { createVoice }] = await Promise.all(['synths.js', 'synths/voice-lifecycle.js'].map(f => import(base + f)));
    const failures = [], report = {};
    const check = (condition, label) => { if (!condition) failures.push(label); };
    const hz = pitch => 440 * 2 ** ((pitch - 69) / 12);
    const energy = (data, f, from, to, sr = 44100) => { const w = 2 * Math.PI * f / sr, c = 2 * Math.cos(w); let s1 = 0, s2 = 0; const i0 = Math.floor(from * sr), i1 = Math.min(data.length, Math.floor(to * sr)); for (let i = i0; i < i1; i++) { const x = data[i] * (.5 - .5 * Math.cos(2 * Math.PI * (i - i0) / (i1 - i0))), s = x + c * s1 - s2; s2 = s1; s1 = s; } return Math.sqrt(Math.max(0, s1 * s1 + s2 * s2 - c * s1 * s2)) / Math.max(1, i1 - i0); };
    const rms = (data, from, to, sr = 44100) => { let sum = 0, n = 0; for (let i = Math.floor(from * sr); i < Math.min(data.length, to * sr); i++) { sum += data[i] * data[i]; n++; } return Math.sqrt(sum / Math.max(1, n)); };
    const bright = (data, from, to, sr = 44100) => { let d = 0, s = 0; for (let i = Math.floor(from * sr) + 1; i < Math.min(data.length, to * sr); i++) { d += (data[i] - data[i - 1]) ** 2; s += data[i] * data[i]; } return Math.sqrt(d / Math.max(1e-12, s)); };
    const render = async (id, params = {}, { pitch = 60, seconds = 1.5, dur = 1.2, beat, bpm = 120 } = {}) => {
      const ctx = new OfflineAudioContext(2, Math.ceil(44100 * seconds), 44100);
      const voice = createVoice(ctx, ctx.destination, SYNTH_BANK[id], id, { pitch, vel: .8, time: 0, dur, bpm, beat }, { ...synthDefaults(id), ...params }, () => {}, { seed: 5 });
      const sources = voice.sources.length, out = await ctx.startRendering(), l = out.getChannelData(0), r = out.getChannelData(1), mono = new Float32Array(l.length);
      let peak = 0, finite = true;
      for (let i = 0; i < l.length; i++) { mono[i] = (l[i] + r[i]) / 2; peak = Math.max(peak, Math.abs(l[i]), Math.abs(r[i])); if (!Number.isFinite(l[i])) finite = false; }
      return { mono, l, r, peak, finite, sources };
    };

    // Every preset of the three synths plays: finite, audible, not clipping, within the source budget.
    for (const id of ['mavrekt', 'lostwave', 'element']) {
      let heaviest = 0;
      for (const preset of SYNTH_BANK[id].presets) for (const pitch of [36, 60, 84]) {
        const out = await render(id, preset.params, { pitch, seconds: 1.2, dur: .8 });
        heaviest = Math.max(heaviest, out.sources);
        check(out.finite && rms(out.mono, .02, .8) > 1e-4 && out.peak < 1.2, `${id} "${preset.name}" at ${pitch}: finite, audible, peak ${out.peak.toFixed(2)}`);
      }
      report[id] = { presets: SYNTH_BANK[id].presets.length, heaviestSources: heaviest };
      check(heaviest <= 40, `${id}: heaviest preset stays within 40 sources a note (${heaviest})`);
    }

    // MAVREKT
    {
      const one = { aVoices: 1, aDetune: 0, bVoices: 1, bDetune: 0, bOct: 0, balance: 0, cutoff: 18000, fEnv: 0, drive: 0, reso: .7 };
      const sine = await render('mavrekt', { ...one, aWave: 'sine' }), saw = await render('mavrekt', { ...one, aWave: 'saw' });
      const purity = x => energy(x.mono, hz(72), .2, 1) / energy(x.mono, hz(60), .2, 1);
      report.mavrektSine = { sineSecondHarmonic: purity(sine), sawSecondHarmonic: purity(saw) };
      check(purity(sine) < .01 && purity(saw) > .2, 'MAVREKT sine shape has no overtones');
      const noise = await render('mavrekt', { ...one, aWave: 'noise' });
      check(rms(noise.mono, .2, 1) > 1e-3 && energy(noise.mono, hz(60), .2, 1) < energy(saw.mono, hz(60), .2, 1) * .05, 'MAVREKT noise shape is unpitched');
      const lp = await render('mavrekt', { ...one, cutoff: 2000 }), hp = await render('mavrekt', { ...one, cutoff: 2000, aFilter: 'hp' });
      check(energy(hp.mono, hz(60), .2, 1) < energy(lp.mono, hz(60), .2, 1) * .1 && bright(hp.mono, .2, 1) > bright(lp.mono, .2, 1) * 2, 'MAVREKT high-pass part removes the body and keeps the top');
    }
    // LOSTWAVE
    {
      const solo = { o1Mode: 'saw', o1Level: .8, o2Mode: 'off', o3Mode: 'off', o4Mode: 'off', cutoff: 18000, fEnv: 0, punch: 0, f2Cutoff: 20 };
      const long = { seconds: 4, dur: 3.8 }, single = await render('lostwave', solo, long), five = await render('lostwave', { ...solo, o1Uni: 5, uniDetune: 20 }, long); // long enough to average the beating
      check(five.sources === single.sources + 4, `LOSTWAVE unison adds one source per voice (${single.sources} -> ${five.sources})`);
      const side = x => rms(x.l.map((v, i) => v - x.r[i]), .2, 1);
      check(side(single) < 1e-5 && side(five) > 1e-3, 'LOSTWAVE unison spreads across the stereo field');
      check(Math.abs(20 * Math.log10(Math.hypot(rms(five.l, .2, 3.7), rms(five.r, .2, 3.7)) / Math.hypot(rms(single.l, .2, 3.7), rms(single.r, .2, 3.7)))) < 2, 'LOSTWAVE unison keeps a similar level');
      const pwm = await render('lostwave', { ...solo, o1Mode: 'pwm' }, { seconds: 3, dur: 2.8 });
      const second = t => energy(pwm.mono, hz(72), t, t + .15) / energy(pwm.mono, hz(60), t, t + .15), values = [.2, .6, 1, 1.4, 1.8, 2.2].map(second);
      report.pwmSecondHarmonic = values.map(v => +v.toFixed(2));
      check(Math.max(...values) > Math.min(...values) * 1.5 && rms(pwm.mono, .2, 2.5) > 1e-3, 'LOSTWAVE PWM mode sounds and its width moves');
      const lp = await render('lostwave', { ...solo, cutoff: 2000 }), hp = await render('lostwave', { ...solo, cutoff: 2000, f1Type: 'hp' });
      check(energy(hp.mono, hz(60), .2, 1) < energy(lp.mono, hz(60), .2, 1) * .1, 'LOSTWAVE filter 1 can be a high-pass');
    }
    // ELEMENT position LFO
    {
      const still = { table: 'analog', posStart: .5, posEnd: .5, voices: 1, sub: 0, cutoff: 18000, fEnv: 0, decay: 3, sustain: 1 };
      const off = await render('element', still, { seconds: 2.2, dur: 2 }), on = await render('element', { ...still, lfoDepth: 1, lfoRate: '1/4', lfoShape: 'sine' }, { seconds: 2.2, dur: 2 });
      // 120 bpm, 1/4 rate: one cycle every half second. Quarter-cycle points are the extremes.
      const at = (x, t) => bright(x.mono, t - .04, t + .04);
      const swing = x => [.125, .375, .625, .875, 1.125, 1.375].map(t => at(x, t));
      const a = swing(off), c = swing(on), ratio = v => Math.max(...v) / Math.min(...v);
      report.elementLfo = { stillRatio: +ratio(a).toFixed(2), movingRatio: +ratio(c).toFixed(2), sources: { off: off.sources, on: on.sources } };
      check(ratio(a) < 1.15 && ratio(c) > 1.5, `ELEMENT position LFO moves the tone (${ratio(c).toFixed(2)}x against ${ratio(a).toFixed(2)}x)`);
      check(Math.abs(c[0] / c[2] - 1) < .15 && Math.abs(c[1] / c[3] - 1) < .15, 'ELEMENT position LFO repeats in time with the tempo');
      const shifted = await render('element', { ...still, lfoDepth: 1, lfoRate: '1/4', lfoShape: 'sine' }, { seconds: 2.2, dur: 2, beat: .5 });
      const s = swing(shifted);
      check(Math.abs(s[0] / c[1] - 1) < .15 && Math.abs(s[1] / c[0] - 1) < .15, 'ELEMENT position LFO starts from the song position');
      check(Math.abs(20 * Math.log10(rms(on.mono, .1, 1.9) / rms(off.mono, .1, 1.9))) < 6, 'ELEMENT keeps a similar level with the LFO on');
    }
    return { failures, report };
  }, edition);
  console.log(JSON.stringify(result, null, 1));
  assert.deepEqual(result.failures, []);
  assert.deepEqual(errors, []);
} finally { await b.close(); srv.close(); }
