// MAVREKT — two-layer virtual-analogue trance poly (a nod to Marek's trance alias).
// Part A and Part B each stack up to 7 / 5 detuned oscillators through their own low-pass,
// then share a drive, a decay/sustain body, a tempo-locked 16-step trance gate and the host
// envelope. Native nodes only, so it stays light enough for big chords.
import { nativeNote, range } from '../performance-voice.js';
import { select, shapeOsc, spread, bodyStage, cutoffEnvelope, driveCurve, gateBuffer, GATE_PATTERNS, GATE_RATES } from '../marek-kit.js';

const WAVES = ['saw', 'square', 'triangle', 'pulse'];
const params = [
  select('aWave', 'A wave', WAVES, 'saw'),
  range('aOct', 'A octave', -2, 2, 1, 0),
  range('aVoices', 'A unison voices', 1, 7, 1, 5),
  range('aDetune', 'A detune (cents)', 0, 60, 0.5, 18),
  select('bWave', 'B wave', WAVES, 'saw'),
  range('bOct', 'B octave', -2, 2, 1, -1),
  range('bVoices', 'B unison voices', 1, 5, 1, 3),
  range('bDetune', 'B detune (cents)', 0, 60, 0.5, 9),
  range('balance', 'A / B balance', 0, 1, 0.01, 0.35),
  range('width', 'Stereo width', 0, 1, 0.01, 0.7),
  range('cutoff', 'Cutoff (Hz)', 60, 18000, 1, 5200),
  range('reso', 'Resonance', 0.3, 14, 0.1, 1.6),
  range('fEnv', 'Filter envelope (oct)', 0, 6, 0.05, 1.8),
  range('fDecay', 'Filter decay', 0.01, 2.5, 0.01, 0.35),
  range('drive', 'Drive', 0, 1, 0.01, 0.12),
  range('decay', 'Decay', 0.01, 3, 0.01, 0.6),
  range('sustain', 'Sustain', 0, 1, 0.01, 0.82),
  range('gateDepth', 'Trance gate depth', 0, 1, 0.01, 0),
  select('gateRate', 'Gate rate', Object.keys(GATE_RATES), '1/16'),
  select('gatePattern', 'Gate pattern', Object.keys(GATE_PATTERNS), 'anthem'),
  range('attack', 'Attack', 0.002, 1.5, 0.001, 0.004),
  range('release', 'Release', 0.02, 2.5, 0.01, 0.35),
  range('level', 'Level', 0, 1, 0.01, 0.75)
];

function part(ctx, play, osc, frequency, time, wave, oct, voices, detune, width, into) {
  const n = Math.max(1, Math.round(voices)), base = frequency * 2 ** Math.round(oct);
  const norm = 1 / Math.sqrt(n);
  for (const s of spread(n)) {
    const o = shapeOsc(ctx, osc('sawtooth', Math.min(ctx.sampleRate * 0.45, base)), wave);
    o.detune.setValueAtTime(s * detune, time);
    const pan = ctx.createStereoPanner(), g = ctx.createGain();
    pan.pan.setValueAtTime(s * width, time);
    g.gain.setValueAtTime(norm, time);
    o.connect(g).connect(pan).connect(into);
    play(o);
  }
}

function voice(ctx, dest, note, patch) {
  const { P, time, gate, frequency, amp, play, osc, bind } = nativeNote(ctx, dest, note, patch, params, 0.42);
  const mix = ctx.createGain();
  const filters = ['a', 'b'].map((key) => {
    const f = ctx.createBiquadFilter(), g = ctx.createGain();
    f.type = 'lowpass';
    f.Q.setValueAtTime(P.reso, time);
    cutoffEnvelope(ctx, f.frequency, time, P.cutoff * (key === 'b' ? 0.85 : 1), P.fEnv, P.fDecay);
    bind('balance', g.gain, (v) => (key === 'a' ? Math.cos(v * Math.PI / 2) : Math.sin(v * Math.PI / 2)) * 1.2);
    f.connect(g).connect(mix);
    return f;
  });
  part(ctx, play, osc, frequency, time, P.aWave, P.aOct, P.aVoices, P.aDetune, P.width, filters[0]);
  part(ctx, play, osc, frequency, time, P.bWave, P.bOct, P.bVoices, P.bDetune, P.width * 0.8, filters[1]);
  let tail = mix;
  const curve = driveCurve(ctx, P.drive);
  if (curve) {
    const shaper = ctx.createWaveShaper(), trim = ctx.createGain();
    shaper.curve = curve;
    shaper.oversample = '2x';
    trim.gain.setValueAtTime(1 / (1 + P.drive * 0.9), time);
    tail.connect(shaper).connect(trim);
    tail = trim;
  }
  const body = bodyStage(ctx, time, P.attack, P.decay, P.sustain, gate);
  tail.connect(body);
  tail = body;
  if (P.gateDepth > 0) {
    const g = ctx.createGain(), depth = ctx.createGain(), src = ctx.createBufferSource();
    bind('gateDepth', g.gain, (v) => 1 - v);
    bind('gateDepth', depth.gain, (v) => v);
    src.buffer = gateBuffer(ctx, note.bpm, P.gateRate, P.gatePattern);
    src.loop = true;
    src.connect(depth).connect(g.gain);
    tail.connect(g);
    tail = g;
    play(src);
  }
  tail.connect(amp);
}

const sel = (key, label, options) => ({ type: 'radio', key, label, options: options.map((v) => [v, v.toUpperCase()]) });
const knob = (key, label, fmt, extra = {}) => ({ type: 'knob', key, label, fmt, ...extra });

export const MAVREKT_SYNTHS = {
  mavrekt: {
    name: 'MAVREKT',
    tagline: 'Two-layer trance poly · supersaw parts, warm filters, tempo-locked trance gate',
    color: '#ff5fa2',
    params,
    voice,
    ui: {
      theme: { accent: '#ff5fa2', lcd: '#ffd1e6', lcdBg: '#1c0b16', edge: '#5a2846', bg: '#241020' },
      logo: ['', 'MAVREKT'],
      sub: 'TWO-LAYER TRANCE POLY',
      cc: { 74: 'cutoff', 71: 'reso', 73: 'attack', 72: 'release', 7: 'level', 1: 'gateDepth' },
      sections: [
        { title: 'PART A', items: [sel('aWave', 'Wave', WAVES), { type: 'row', items: [knob('aOct', 'OCT', 'int'), knob('aVoices', 'VOICES', 'int'), knob('aDetune', 'DETUNE', 'cents')] }] },
        { title: 'PART B', items: [sel('bWave', 'Wave', WAVES), { type: 'row', items: [knob('bOct', 'OCT', 'int'), knob('bVoices', 'VOICES', 'int'), knob('bDetune', 'DETUNE', 'cents')] }] },
        { title: 'LAYER', items: [{ type: 'xy', x: { key: 'balance', label: 'A ⇄ B', fmt: 'pct' }, y: { key: 'width', label: 'WIDTH', fmt: 'pct' } }] },
        { title: 'FILTER', items: [{ type: 'row', items: [knob('cutoff', 'CUTOFF', 'hz', { curve: 'log', big: true }), knob('reso', 'RESO', 'num1', { big: true })] }, { type: 'row', items: [knob('fEnv', 'ENV', 'num1'), knob('fDecay', 'F.DECAY', 'ms'), knob('drive', 'DRIVE', 'pct')] }] },
        { title: 'TRANCE GATE', items: [knob('gateDepth', 'DEPTH', 'pct', { big: true }), sel('gateRate', 'Rate', Object.keys(GATE_RATES)), { type: 'radio', key: 'gatePattern', label: 'Pattern', options: Object.keys(GATE_PATTERNS).map((v) => [v, v.toUpperCase()]) }] },
        { title: 'AMP', items: [{ type: 'row', items: [
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
      { name: 'Init Uplifter', params: {} },
      { name: 'Anthem Supersaw', params: { aVoices: 7, aDetune: 26, bVoices: 5, bDetune: 14, bOct: 0, balance: 0.45, width: 0.9, cutoff: 7800, fEnv: 0.8, release: 0.7 } },
      { name: 'Trance Pluck', params: { aVoices: 3, aDetune: 12, bWave: 'square', bVoices: 1, bOct: 1, balance: 0.25, cutoff: 900, reso: 3.2, fEnv: 3.4, fDecay: 0.18, decay: 0.22, sustain: 0, release: 0.25 } },
      { name: 'Gated Pad', params: { attack: 0.18, decay: 1.2, sustain: 0.9, release: 1.1, cutoff: 3400, fEnv: 0.4, gateDepth: 0.9, gateRate: '1/16', gatePattern: 'anthem', width: 1 } },
      { name: 'Offbeat Bass', params: { aOct: -1, aVoices: 2, aDetune: 6, bWave: 'square', bOct: -2, bVoices: 1, balance: 0.5, cutoff: 420, reso: 2.6, fEnv: 2.6, fDecay: 0.12, decay: 0.16, sustain: 0.15, release: 0.08, width: 0.15, drive: 0.35 } },
      { name: 'Hoover Lead', params: { aWave: 'pulse', aVoices: 5, aDetune: 40, bWave: 'saw', bOct: -1, bDetune: 30, balance: 0.55, cutoff: 2600, reso: 1.2, fEnv: 1.2, drive: 0.6, attack: 0.03 } },
      { name: 'Classic Arp Saw', params: { aVoices: 2, aDetune: 8, bVoices: 1, bOct: 1, balance: 0.2, cutoff: 1500, reso: 4.5, fEnv: 2.8, fDecay: 0.25, decay: 0.3, sustain: 0.25, release: 0.18, width: 0.5 } },
      { name: 'Big Room Stab', params: { aVoices: 7, aDetune: 22, bWave: 'square', bOct: 0, bVoices: 5, bDetune: 18, balance: 0.5, cutoff: 3000, fEnv: 2.2, fDecay: 0.2, drive: 0.45, decay: 0.35, sustain: 0.3, release: 0.4, width: 1 } }
    ],
    lines: [
      { name: '138 offbeat bass', dsl: '2:A1:2:110 6:A1:2:100 10:A1:2:110 14:A1:2:100 18:F1:2:110 22:F1:2:100 26:G1:2:110 30:G1:2:100' },
      { name: 'Pluck arp (Am)', dsl: '0:A4:1:110 1:E5:1:80 2:C5:1:96 3:E5:1:76 4:A4:1:108 5:E5:1:80 6:C5:1:96 7:B4:1:84 8:F4:1:110 9:C5:1:80 10:A4:1:96 11:C5:1:76 12:G4:1:108 13:D5:1:80 14:B4:1:96 15:D5:1:76' },
      { name: 'Anthem chords', dsl: '0:A3:16:104 0:C4:16:100 0:E4:16:100 16:F3:16:104 16:A3:16:100 16:C4:16:100 32:C4:16:104 32:E4:16:100 32:G4:16:100 48:G3:16:104 48:B3:16:100 48:D4:16:100' },
      { name: 'Hook lead', dsl: '0:E5:3:112 3:D5:3:96 6:C5:2:100 8:D5:4:108 12:A4:4:92 16:E5:3:112 19:D5:3:96 22:C5:2:100 24:G5:8:116' }
    ]
  }
};
