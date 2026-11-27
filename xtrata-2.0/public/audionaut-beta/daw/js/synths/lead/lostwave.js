// LOSTWAVE — four-oscillator hybrid lead poly (a nod to Lost Element, Marek's prog alias).
// Every oscillator switches mode: classic saw/square, HYPER (up to 9 spread saws), FM, hard
// SYNC (band-limited sync cycle), AM (ring) or noise. Two filters run in series or parallel,
// and a PUNCH stage adds an onset kick plus soft clipping for the drop.
import { nativeNote, range } from '../performance-voice.js';
import { select, cached, spread, bodyStage, cutoffEnvelope, driveCurve, noiseBuffer } from '../marek-kit.js';

export const LOSTWAVE_MODES = ['off', 'saw', 'square', 'hyper', 'fm', 'sync', 'am', 'noise'];
const FM_RATIOS = ['0.5', '1', '1.5', '2', '3', '4', '7'];
const oscParams = (i, mode, oct, level) => [
  select(`o${i}Mode`, `Osc ${i} mode`, LOSTWAVE_MODES, mode),
  range(`o${i}Oct`, `Osc ${i} octave`, -2, 2, 1, oct),
  range(`o${i}Level`, `Osc ${i} level`, 0, 1, 0.01, level)
];
const params = [
  ...oscParams(1, 'hyper', 0, 0.8),
  ...oscParams(2, 'saw', -1, 0.4),
  ...oscParams(3, 'sync', 0, 0.22),
  ...oscParams(4, 'off', 1, 0.3),
  range('hyperVoices', 'Hyper voices', 1, 9, 1, 7),
  range('hyperDetune', 'Hyper detune (cents)', 0, 60, 0.5, 22),
  range('width', 'Stereo width', 0, 1, 0.01, 0.8),
  select('fmRatio', 'FM / AM ratio', FM_RATIOS, '2'),
  range('fmDepth', 'FM depth', 0, 1, 0.01, 0.35),
  range('syncRatio', 'Sync ratio', 1, 6, 0.05, 2.6),
  range('cutoff', 'Filter 1 cutoff (Hz)', 60, 18000, 1, 6800),
  range('reso', 'Filter 1 resonance', 0.3, 14, 0.1, 1.4),
  range('fEnv', 'Filter envelope (oct)', 0, 6, 0.05, 1.4),
  range('fDecay', 'Filter decay', 0.01, 2.5, 0.01, 0.4),
  select('f2Type', 'Filter 2 type', ['lp', 'hp', 'bp', 'notch'], 'hp'),
  range('f2Cutoff', 'Filter 2 cutoff (Hz)', 20, 18000, 1, 140),
  select('route', 'Filter routing', ['serial', 'parallel'], 'serial'),
  range('punch', 'Punch', 0, 1, 0.01, 0.35),
  range('decay', 'Decay', 0.01, 3, 0.01, 0.5),
  range('sustain', 'Sustain', 0, 1, 0.01, 0.85),
  range('attack', 'Attack', 0.002, 1.5, 0.001, 0.003),
  range('release', 'Release', 0.02, 2.5, 0.01, 0.3),
  range('level', 'Level', 0, 1, 0.01, 0.75)
];

// Hard-sync cycle: a slave saw reset by the master every period, as harmonics.
function syncWave(ctx, ratio) {
  const r = Math.round(ratio * 20) / 20;
  return cached(ctx, `lostwave-sync:${r}`, () => {
    const n = 512, h = 64, real = new Float32Array(h), imag = new Float32Array(h);
    const y = new Float32Array(n);
    for (let i = 0; i < n; i++) { const q = (i / n) * r; y[i] = 2 * (q - Math.floor(q)) - 1; }
    let mean = 0; for (const v of y) mean += v / n;
    for (let k = 1; k < h; k++) {
      let re = 0, im = 0;
      for (let i = 0; i < n; i++) { const w = (2 * Math.PI * k * i) / n; re += (y[i] - mean) * Math.cos(w); im += (y[i] - mean) * Math.sin(w); }
      real[k] = (2 * re) / n; imag[k] = (2 * im) / n;
    }
    return ctx.createPeriodicWave(real, imag);
  });
}

function oscillator(ctx, P, i, f, time, into, osc, play) {
  const mode = P[`o${i}Mode`], level = P[`o${i}Level`];
  if (mode === 'off' || level <= 0) return;
  const hz = Math.min(ctx.sampleRate * 0.45, f * 2 ** Math.round(P[`o${i}Oct`]));
  const out = ctx.createGain();
  out.gain.setValueAtTime(level, time);
  out.connect(into);
  if (mode === 'saw' || mode === 'square') {
    const o = osc(mode === 'saw' ? 'sawtooth' : 'square', hz);
    o.connect(out); play(o); return;
  }
  if (mode === 'hyper') {
    const n = Math.max(1, Math.round(P.hyperVoices)), norm = 1 / Math.sqrt(n);
    for (const s of spread(n)) {
      const o = osc('sawtooth', hz), pan = ctx.createStereoPanner(), g = ctx.createGain();
      // Outer voices detune further than inner ones, like a classic hyper saw.
      o.detune.setValueAtTime(Math.sign(s) * Math.abs(s) ** 1.4 * P.hyperDetune, time);
      pan.pan.setValueAtTime(s * P.width, time);
      g.gain.setValueAtTime(norm * (1 - 0.25 * Math.abs(s)), time);
      o.connect(g).connect(pan).connect(out); play(o);
    }
    return;
  }
  if (mode === 'sync') {
    const o = osc('sine', hz);
    o.setPeriodicWave(syncWave(ctx, P.syncRatio));
    o.connect(out); play(o); return;
  }
  if (mode === 'noise') {
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer(ctx); src.loop = true;
    const g = ctx.createGain(); g.gain.setValueAtTime(0.45, time);
    src.connect(g).connect(out); play(src); return;
  }
  const ratio = Number(P.fmRatio) || 2;
  const carrier = osc('sine', hz), mod = osc('sine', Math.min(ctx.sampleRate * 0.45, hz * ratio));
  if (mode === 'fm') {
    // Frequency deviation scales with the modulator, so the timbre tracks the keyboard.
    const dev = ctx.createGain(), index = P.fmDepth * 6 * hz * ratio;
    dev.gain.setValueAtTime(index * (1 + P.fEnv / 3), time);
    dev.gain.setTargetAtTime(index, time + 0.001, Math.max(0.004, P.fDecay) / 3);
    mod.connect(dev).connect(carrier.frequency);
    carrier.connect(out);
  } else {
    const ring = ctx.createGain(), depth = ctx.createGain();
    ring.gain.setValueAtTime(1 - P.fmDepth * 0.5, time);
    depth.gain.setValueAtTime(P.fmDepth * 0.5 + 0.25, time);
    mod.connect(depth).connect(ring.gain);
    carrier.connect(ring).connect(out);
  }
  play(carrier); play(mod);
}

const F2 = { lp: 'lowpass', hp: 'highpass', bp: 'bandpass', notch: 'notch' };
function voice(ctx, dest, note, patch) {
  const { P, time, gate, frequency, amp, play, osc } = nativeNote(ctx, dest, note, patch, params, 0.36);
  const mix = ctx.createGain(), sum = ctx.createGain();
  const f1 = ctx.createBiquadFilter(), f2 = ctx.createBiquadFilter();
  f1.type = 'lowpass'; f1.Q.setValueAtTime(P.reso, time);
  cutoffEnvelope(ctx, f1.frequency, time, P.cutoff, P.fEnv, P.fDecay);
  f2.type = F2[P.f2Type] || 'highpass';
  f2.frequency.setValueAtTime(Math.min(ctx.sampleRate * 0.45, P.f2Cutoff), time);
  f2.Q.setValueAtTime(P.f2Type === 'lp' || P.f2Type === 'hp' ? 0.71 : 1.2, time);
  if (P.route === 'parallel') {
    const a = ctx.createGain(), b = ctx.createGain();
    a.gain.setValueAtTime(0.72, time); b.gain.setValueAtTime(0.72, time);
    mix.connect(f1).connect(a).connect(sum);
    mix.connect(f2).connect(b).connect(sum);
  } else mix.connect(f1).connect(f2).connect(sum);
  for (let i = 1; i <= 4; i++) oscillator(ctx, P, i, frequency, time, mix, osc, play);
  // PUNCH: an onset gain kick and gentle soft clip, scaled back so loudness stays even.
  const kick = ctx.createGain();
  kick.gain.setValueAtTime(1 + P.punch * 1.6, time);
  kick.gain.setTargetAtTime(1, time + 0.004, 0.012 + P.punch * 0.02);
  let tail = sum.connect(kick);
  const curve = driveCurve(ctx, P.punch * 0.55);
  if (curve) {
    const shaper = ctx.createWaveShaper(), trim = ctx.createGain();
    shaper.curve = curve; shaper.oversample = '2x';
    trim.gain.setValueAtTime(1 / (1 + P.punch * 0.5), time);
    tail.connect(shaper).connect(trim); tail = trim;
  }
  const body = bodyStage(ctx, time, P.attack, P.decay, P.sustain, gate);
  tail.connect(body).connect(amp);
}

const radio = (key, label, options) => ({ type: 'radio', key, label, options: options.map((v) => [v, v.toUpperCase()]) });
const knob = (key, label, fmt, extra = {}) => ({ type: 'knob', key, label, fmt, ...extra });
const oscSection = (i) => ({ title: `OSC ${i}`, items: [radio(`o${i}Mode`, 'Mode', LOSTWAVE_MODES), { type: 'row', items: [knob(`o${i}Oct`, 'OCT', 'int'), knob(`o${i}Level`, 'LEVEL', 'pct')] }] });

export const LOSTWAVE_SYNTHS = {
  lostwave: {
    name: 'LOSTWAVE',
    tagline: 'Hybrid lead poly · four multi-mode oscillators, hyper saw, dual filters, punch',
    color: '#ffb547',
    params,
    voice,
    ui: {
      theme: { accent: '#ffb547', lcd: '#ffe7bf', lcdBg: '#1b1206', edge: '#5e4119', bg: '#231708' },
      logo: ['', 'LOSTWAVE'],
      sub: 'HYBRID LEAD POLY',
      cc: { 74: 'cutoff', 71: 'hyperDetune', 73: 'attack', 72: 'release', 7: 'level', 1: 'fmDepth' },
      sections: [
        oscSection(1), oscSection(2), oscSection(3), oscSection(4),
        { title: 'HYPER · FM · SYNC', items: [{ type: 'xy', x: { key: 'cutoff', label: 'CUTOFF', fmt: 'hz' }, y: { key: 'hyperDetune', label: 'DENSITY', fmt: 'cents' } }, { type: 'row', items: [knob('hyperVoices', 'VOICES', 'int'), knob('width', 'WIDTH', 'pct')] }, radio('fmRatio', 'Ratio', FM_RATIOS), { type: 'row', items: [knob('fmDepth', 'FM/AM', 'pct'), knob('syncRatio', 'SYNC', 'num2')] }] },
        { title: 'FILTERS', items: [{ type: 'row', items: [knob('reso', 'RESO', 'num1'), knob('fEnv', 'ENV', 'num1'), knob('fDecay', 'F.DECAY', 'ms')] }, radio('f2Type', 'Filter 2', ['lp', 'hp', 'bp', 'notch']), knob('f2Cutoff', 'F2 CUT', 'hz', { curve: 'log' }), radio('route', 'Routing', ['serial', 'parallel'])] },
        { title: 'PUNCH & AMP', items: [knob('punch', 'PUNCH', 'pct', { big: true }), { type: 'row', items: [
          { type: 'fader', key: 'attack', label: 'A', fmt: 'ms' },
          { type: 'fader', key: 'decay', label: 'D', fmt: 'ms' },
          { type: 'fader', key: 'sustain', label: 'S', fmt: 'pct' },
          { type: 'fader', key: 'release', label: 'R', fmt: 'ms' },
          { type: 'fader', key: 'level', label: 'LEVEL', fmt: 'pct', rand: false }
        ] }] }
      ],
      adsr: { a: 'attack', d: 'decay', s: 'sustain', r: 'release' }
    },
    presets: [
      { name: 'Init Festival', params: {} },
      { name: 'Festival Lead', params: { hyperVoices: 9, hyperDetune: 30, o2Mode: 'square', o2Oct: 0, o2Level: 0.3, o3Level: 0.3, cutoff: 9000, punch: 0.55, release: 0.45 } },
      { name: 'Hyper Chord', params: { hyperVoices: 9, hyperDetune: 26, o2Mode: 'hyper', o2Oct: 1, o2Level: 0.35, o3Mode: 'off', cutoff: 4800, fEnv: 0.8, attack: 0.01, release: 0.8, width: 1 } },
      { name: 'FM Pluck', params: { o1Mode: 'fm', o1Level: 0.9, o2Mode: 'off', o3Mode: 'off', fmRatio: '3', fmDepth: 0.4, fEnv: 3, fDecay: 0.18, decay: 0.3, sustain: 0, release: 0.3, punch: 0.6 } },
      { name: 'Sync Screamer', params: { o1Mode: 'sync', o1Level: 0.8, syncRatio: 4.2, o2Mode: 'saw', o2Oct: 0, o3Mode: 'off', cutoff: 5200, reso: 3, punch: 0.7, attack: 0.008 } },
      { name: 'Prog House Stab', params: { hyperVoices: 5, hyperDetune: 18, o2Mode: 'square', o2Oct: 1, o2Level: 0.3, o3Mode: 'off', cutoff: 2400, reso: 2.5, fEnv: 2.4, fDecay: 0.22, decay: 0.32, sustain: 0.2, release: 0.35, punch: 0.5 } },
      { name: 'Detuned Bell', params: { o1Mode: 'am', o1Level: 0.6, fmRatio: '3', fmDepth: 0.6, o2Mode: 'fm', o2Oct: 1, o2Level: 0.35, o3Mode: 'off', f2Type: 'lp', f2Cutoff: 9000, decay: 1.4, sustain: 0.1, release: 1.2, punch: 0.15 } },
      { name: 'Wide Bass', params: { o1Oct: -1, hyperVoices: 5, hyperDetune: 12, width: 0.5, o2Mode: 'square', o2Oct: -2, o2Level: 0.6, o3Mode: 'off', o4Mode: 'noise', o4Level: 0.05, cutoff: 1400, fEnv: 1.8, fDecay: 0.2, f2Cutoff: 30, punch: 0.6, release: 0.15 } }
    ],
    lines: [
      { name: 'Prog house hook', dsl: '0:F#4:2:116 3:E4:1:96 4:F#4:2:112 7:A4:1:96 8:B4:4:118 12:A4:2:100 14:F#4:2:104 16:E4:4:112 20:C#4:2:96 22:E4:2:104 24:F#4:8:116' },
      { name: 'Chord stabs', dsl: '0:F#3:2:118 0:A3:2:110 0:C#4:2:110 6:F#3:2:104 6:A3:2:100 6:C#4:2:100 12:D3:2:118 12:F#3:2:110 12:A3:2:110 18:E3:2:104 18:G#3:2:100 18:B3:2:100' },
      { name: 'Big room riff', dsl: '0:C4:1:120 2:C4:1:100 3:G4:1:110 4:C4:1:120 6:C4:1:100 7:A#4:1:110 8:C5:2:124 12:G4:2:110 14:D#4:2:104' },
      { name: 'Drop bass', dsl: '0:F#1:4:120 6:F#1:2:110 8:A1:4:116 14:E1:2:110 16:D1:8:120 24:E1:8:116' }
    ]
  }
};
