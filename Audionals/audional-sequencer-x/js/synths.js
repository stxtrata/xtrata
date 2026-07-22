// synths.js — the synth bank: polyphonic Web Audio instruments with parameter
// schemas (used to render each synth's unique UI) and per-synth melodic preset lines.
// Successor to the original iframe-based jiMS10 / Synth-Modules approach — everything
// runs in-process, sample-accurately scheduled by the engine.

export function midiToFreq(m) { return 440 * Math.pow(2, (m - 69) / 12); }

const NOTE_IDX = { C: 0, 'C#': 1, Db: 1, D: 2, 'D#': 3, Eb: 3, E: 4, F: 5, 'F#': 6, Gb: 6, G: 7, 'G#': 8, Ab: 8, A: 9, 'A#': 10, Bb: 10, B: 11 };
export function noteToMidi(name) {
  const m = name.match(/^([A-G][#b]?)(-?\d)$/);
  if (!m) throw new Error(`Bad note ${name}`);
  return NOTE_IDX[m[1]] + (parseInt(m[2], 10) + 1) * 12;
}

// Parse a melody line DSL: "step:note:durSteps[:vel]" tokens, e.g. "0:C2:2 4:Eb2:2:127".
export function parseLine(dsl) {
  return dsl.trim().split(/\s+/).map(tok => {
    const [step, note, dur, vel] = tok.split(':');
    return { step: +step, pitch: noteToMidi(note), dur: +(dur || 1), vel: vel ? +vel / 127 : 1 };
  });
}

function adsrGain(ctx, t, vel, a, d, s, r, dur) {
  const g = ctx.createGain();
  const peak = Math.max(0.001, vel);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + Math.max(0.002, a));
  const sus = Math.max(0.0001, peak * s);
  g.gain.exponentialRampToValueAtTime(sus, t + a + d);
  const end = t + Math.max(dur, a + d);
  g.gain.setValueAtTime(sus, end);
  g.gain.exponentialRampToValueAtTime(0.0001, end + Math.max(0.01, r));
  return { g, stopAt: end + r + 0.05 };
}

// Each synth: { name, tagline, color, params: [...schema], lines: [...presets],
//              voice(ctx, dest, {pitch, vel, time, dur}, P) }
// Param schema: { key, label, type: 'range'|'select', min, max, step, def, options? }

export const SYNTH_BANK = {

  jims10: {
    name: 'jiMS10', tagline: 'Korg-style mono lead — homage to the first on-chain synth', color: '#2edb84',
    params: [
      { key: 'wave', label: 'Waveform', type: 'select', def: 'sawtooth', options: ['sawtooth', 'square', 'triangle'] },
      { key: 'cutoff', label: 'Filter Cutoff', type: 'range', min: 100, max: 10000, step: 10, def: 2200 },
      { key: 'reso', label: 'Resonance', type: 'range', min: 0, max: 20, step: 0.1, def: 6 },
      { key: 'sub', label: 'Sub Osc', type: 'range', min: 0, max: 1, step: 0.01, def: 0.4 },
      { key: 'attack', label: 'Attack', type: 'range', min: 0, max: 0.5, step: 0.005, def: 0.005 },
      { key: 'release', label: 'Release', type: 'range', min: 0.01, max: 1.5, step: 0.01, def: 0.15 }
    ],
    voice(ctx, dest, { pitch, vel, time, dur }, P) {
      const o = ctx.createOscillator(); o.type = P.wave; o.frequency.value = midiToFreq(pitch);
      const so = ctx.createOscillator(); so.type = 'square'; so.frequency.value = midiToFreq(pitch - 12);
      const sg = ctx.createGain(); sg.gain.value = P.sub;
      const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = P.cutoff; f.Q.value = P.reso;
      const { g, stopAt } = adsrGain(ctx, time, vel * 0.5, P.attack, 0.08, 0.7, P.release, dur);
      o.connect(f); so.connect(sg).connect(f); f.connect(g).connect(dest);
      o.start(time); so.start(time); o.stop(stopAt); so.stop(stopAt);
    },
    lines: [
      { name: 'One Small Bassline (Em)', dsl: '0:E1:2 4:E1:2 6:G1:1 8:E1:2 12:D2:2 14:B1:2 16:E1:2 20:E1:2 22:G1:1 24:A1:2 28:G1:2 30:D1:2' },
      { name: 'Fifths Lead', dsl: '0:E3:4 4:B3:4 8:G3:4 12:D3:4 16:E3:4 20:B3:2 22:A3:2 24:G3:4 28:F#3:4' },
      { name: 'Octave Pump (Am)', dsl: '0:A1:1 2:A2:1 4:A1:1 6:A2:1 8:A1:1 10:A2:1 12:G1:1 14:G2:1' },
      { name: 'Bitcoin Step Riff (Gm)', dsl: '0:G2:2 3:A#2:1 4:G2:2 8:D3:2 11:C3:1 12:A#2:2 16:G2:2 19:A#2:1 20:C3:2 24:D3:4 28:F3:2 30:D3:2' }
    ]
  },

  acidals: {
    name: 'Acidals 303', tagline: 'Resonant acid bass with filter envelope + accent/slide feel', color: '#feca57',
    params: [
      { key: 'wave', label: 'Waveform', type: 'select', def: 'sawtooth', options: ['sawtooth', 'square'] },
      { key: 'cutoff', label: 'Cutoff', type: 'range', min: 80, max: 4000, step: 10, def: 500 },
      { key: 'reso', label: 'Resonance', type: 'range', min: 0, max: 30, step: 0.1, def: 18 },
      { key: 'envMod', label: 'Env Mod', type: 'range', min: 0, max: 4000, step: 10, def: 1800 },
      { key: 'decay', label: 'Decay', type: 'range', min: 0.05, max: 1, step: 0.01, def: 0.25 }
    ],
    voice(ctx, dest, { pitch, vel, time, dur }, P) {
      const o = ctx.createOscillator(); o.type = P.wave; o.frequency.value = midiToFreq(pitch);
      const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.Q.value = P.reso;
      const accent = vel > 1 ? 1.6 : 1;
      f.frequency.setValueAtTime(P.cutoff + P.envMod * accent, time);
      f.frequency.exponentialRampToValueAtTime(Math.max(60, P.cutoff), time + P.decay);
      const { g, stopAt } = adsrGain(ctx, time, Math.min(1, vel) * 0.45 * accent, 0.003, P.decay, 0.25, 0.08, dur);
      o.connect(f).connect(g).connect(dest);
      o.start(time); o.stop(stopAt);
    },
    lines: [
      { name: 'Classic Acid (Am)', dsl: '0:A1:1 2:A1:1 4:A2:1:127 6:A1:1 8:C2:1 10:A1:1 12:G2:1:127 14:E2:1 16:A1:1 18:A1:1 20:A2:1 22:C3:1:127 24:A1:1 26:G1:1 28:E2:1 30:A1:1' },
      { name: 'Squelch March (Em)', dsl: '0:E1:1 4:E1:1 8:E2:1:127 12:E1:1 16:G1:1 20:E1:1 24:B1:1:127 28:D2:1' },
      { name: 'Rolling 16ths (Cm)', dsl: '0:C2:1 1:C2:1 2:C2:1 3:C3:1:127 4:C2:1 5:C2:1 6:Eb2:1 7:C2:1 8:G2:1:127 9:C2:1 10:C2:1 11:Bb1:1 12:C2:1 13:Eb2:1 14:G1:1 15:C2:1' },
      { name: 'Detroit Stab', dsl: '0:F2:1:127 6:F2:1 8:Ab2:1 14:F2:1 16:C3:1:127 22:Bb2:1 24:Ab2:1 30:F2:1' }
    ]
  },

  fmonad: {
    name: 'FMonad', tagline: '2-operator FM — bells, keys and metallic plucks', color: '#22d3ee',
    params: [
      { key: 'ratio', label: 'Mod Ratio', type: 'range', min: 0.5, max: 8, step: 0.5, def: 2 },
      { key: 'index', label: 'FM Index', type: 'range', min: 0, max: 1000, step: 5, def: 300 },
      { key: 'modDecay', label: 'Mod Decay', type: 'range', min: 0.02, max: 2, step: 0.01, def: 0.4 },
      { key: 'attack', label: 'Attack', type: 'range', min: 0, max: 0.3, step: 0.005, def: 0.002 },
      { key: 'release', label: 'Release', type: 'range', min: 0.05, max: 3, step: 0.01, def: 0.8 }
    ],
    voice(ctx, dest, { pitch, vel, time, dur }, P) {
      const freq = midiToFreq(pitch);
      const car = ctx.createOscillator(); car.frequency.value = freq;
      const mod = ctx.createOscillator(); mod.frequency.value = freq * P.ratio;
      const mg = ctx.createGain();
      mg.gain.setValueAtTime(P.index * Math.min(1, vel), time);
      mg.gain.exponentialRampToValueAtTime(0.01, time + P.modDecay);
      mod.connect(mg).connect(car.frequency);
      const { g, stopAt } = adsrGain(ctx, time, Math.min(1, vel) * 0.4, P.attack, 0.1, 0.5, P.release, dur);
      car.connect(g).connect(dest);
      car.start(time); mod.start(time); car.stop(stopAt); mod.stop(stopAt);
    },
    lines: [
      { name: 'Bell Arp (Cmaj7)', dsl: '0:C4:2 2:E4:2 4:G4:2 6:B4:2 8:C5:2 10:B4:2 12:G4:2 14:E4:2 16:C4:2 18:E4:2 20:G4:2 22:B4:2 24:E5:4 28:B4:4' },
      { name: 'EP Chords (Fm)', dsl: '0:F3:6 0:Ab3:6 0:C4:6 8:Eb3:6 8:G3:6 8:Bb3:6 16:Db3:6 16:F3:6 16:Ab3:6 24:C3:6 24:E3:6 24:G3:6' },
      { name: 'Metal Pluck (Dm)', dsl: '0:D3:1 3:F3:1 6:A3:1 8:D4:2 12:C4:1 14:A3:1 16:D3:1 19:F3:1 22:A3:1 24:E4:2 28:D4:4' },
      { name: 'Gamelan Loop', dsl: '0:C4:1 2:D4:1 4:Eb4:1 6:G4:1 8:C5:1 10:G4:1 12:Eb4:1 14:D4:1' }
    ]
  },

  stacker: {
    name: 'Stacker', tagline: 'Detuned supersaw stack — pads, trance and rave chords', color: '#c084fc',
    params: [
      { key: 'voices', label: 'Voices', type: 'range', min: 1, max: 7, step: 1, def: 5 },
      { key: 'detune', label: 'Detune (cents)', type: 'range', min: 0, max: 40, step: 1, def: 14 },
      { key: 'cutoff', label: 'Cutoff', type: 'range', min: 200, max: 12000, step: 10, def: 4500 },
      { key: 'attack', label: 'Attack', type: 'range', min: 0, max: 2, step: 0.01, def: 0.05 },
      { key: 'release', label: 'Release', type: 'range', min: 0.05, max: 4, step: 0.01, def: 0.6 }
    ],
    voice(ctx, dest, { pitch, vel, time, dur }, P) {
      const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = P.cutoff;
      const { g, stopAt } = adsrGain(ctx, time, Math.min(1, vel) * (0.35 / Math.sqrt(P.voices)), P.attack, 0.2, 0.8, P.release, dur);
      f.connect(g).connect(dest);
      for (let v = 0; v < P.voices; v++) {
        const o = ctx.createOscillator(); o.type = 'sawtooth';
        o.frequency.value = midiToFreq(pitch);
        o.detune.value = (v - (P.voices - 1) / 2) * P.detune;
        o.connect(f);
        o.start(time); o.stop(stopAt);
      }
    },
    lines: [
      { name: 'Rave Stab (Am)', dsl: '0:A3:2 0:C4:2 0:E4:2 6:A3:2 6:C4:2 6:E4:2 12:G3:2 12:B3:2 12:D4:2 16:A3:2 16:C4:2 16:E4:2 22:F3:2 22:A3:2 22:C4:2 28:G3:2 28:B3:2 28:D4:2' },
      { name: 'Trance Pad (Fmaj)', dsl: '0:F3:16 0:A3:16 0:C4:16 16:D3:16 16:F3:16 16:A3:16 32:Bb2:16 32:D3:16 32:F3:16 48:C3:16 48:E3:16 48:G3:16' },
      { name: 'Hoover Riff', dsl: '0:E2:2 4:E2:2 8:G2:1 10:A2:1 12:E2:2 16:D2:2 20:E2:2 24:B2:2 28:A2:2' },
      { name: 'Anthem Arp (Am)', dsl: '0:A2:1 2:E3:1 4:A3:1 6:C4:1 8:E4:1 10:C4:1 12:A3:1 14:E3:1 16:F2:1 18:C3:1 20:F3:1 22:A3:1 24:C4:1 26:A3:1 28:F3:1 30:C3:1' }
    ]
  },

  chip8: {
    name: 'Chip-8', tagline: 'PWM chiptune voice with vibrato — 8-bit leads and loops', color: '#fb7185',
    params: [
      { key: 'width', label: 'Pulse Width', type: 'range', min: 0.05, max: 0.5, step: 0.01, def: 0.25 },
      { key: 'vibRate', label: 'Vibrato Rate', type: 'range', min: 0, max: 12, step: 0.1, def: 5 },
      { key: 'vibDepth', label: 'Vibrato Depth', type: 'range', min: 0, max: 50, step: 1, def: 12 },
      { key: 'decay', label: 'Decay', type: 'range', min: 0.02, max: 1, step: 0.01, def: 0.3 }
    ],
    voice(ctx, dest, { pitch, vel, time, dur }, P) {
      // PWM approximation: two saws phase-offset via delay-inverted trick is heavy;
      // use a square + slight detuned second square for hollow chip character.
      const o1 = ctx.createOscillator(); o1.type = 'square'; o1.frequency.value = midiToFreq(pitch);
      const o2 = ctx.createOscillator(); o2.type = 'square';
      o2.frequency.value = midiToFreq(pitch) * (1 + P.width * 0.02);
      const lfo = ctx.createOscillator(); lfo.frequency.value = P.vibRate;
      const lg = ctx.createGain(); lg.gain.value = P.vibDepth;
      lfo.connect(lg); lg.connect(o1.detune); lg.connect(o2.detune);
      const { g, stopAt } = adsrGain(ctx, time, Math.min(1, vel) * 0.22, 0.002, P.decay, 0.4, 0.08, dur);
      o1.connect(g); o2.connect(g); g.connect(dest);
      [o1, o2, lfo].forEach(o => { o.start(time); o.stop(stopAt); });
    },
    lines: [
      { name: '8-bit Hero (C)', dsl: '0:C4:1 2:E4:1 4:G4:2 8:E4:1 10:G4:1 12:C5:2 16:B4:1 18:G4:1 20:E4:2 24:F4:1 26:D4:1 28:C4:4' },
      { name: 'Chase Loop (Am)', dsl: '0:A3:1 1:A3:1 2:E4:1 4:A3:1 6:G4:1 8:A3:1 9:A3:1 10:E4:1 12:D4:1 14:C4:1' },
      { name: 'Boss Battle (Dm)', dsl: '0:D3:1 2:D3:1 4:F3:1 6:D3:1 8:Ab3:2 12:G3:1 14:F3:1 16:D3:1 18:D3:1 20:F3:1 22:G3:1 24:A3:2 28:C4:2 30:D4:2' },
      { name: 'Item Get!', dsl: '0:G4:1 1:C5:1 2:E5:1 3:G5:3' }
    ]
  },

  subzero: {
    name: 'SubZero', tagline: 'Pure sub bass with drive — 808-style low end for any groove', color: '#54a0ff',
    params: [
      { key: 'wave', label: 'Waveform', type: 'select', def: 'sine', options: ['sine', 'triangle'] },
      { key: 'drive', label: 'Drive', type: 'range', min: 0, max: 1, step: 0.01, def: 0.25 },
      { key: 'glideUp', label: 'Pitch Snap', type: 'range', min: 0, max: 0.15, step: 0.005, def: 0.04 },
      { key: 'release', label: 'Release', type: 'range', min: 0.05, max: 2, step: 0.01, def: 0.4 }
    ],
    voice(ctx, dest, { pitch, vel, time, dur }, P) {
      const o = ctx.createOscillator(); o.type = P.wave;
      const freq = midiToFreq(pitch);
      o.frequency.setValueAtTime(freq * 1.6, time);
      o.frequency.exponentialRampToValueAtTime(freq, time + Math.max(0.005, P.glideUp));
      let node = o;
      if (P.drive > 0) {
        const ws = ctx.createWaveShaper();
        const curve = new Float32Array(257);
        const k = 1 + P.drive * 8;
        for (let i = 0; i < 257; i++) { const x = i / 128 - 1; curve[i] = Math.tanh(x * k) / Math.tanh(k); }
        ws.curve = curve;
        o.connect(ws); node = ws;
      }
      const { g, stopAt } = adsrGain(ctx, time, Math.min(1, vel) * 0.7, 0.004, 0.1, 0.9, P.release, dur);
      node.connect(g).connect(dest);
      o.start(time); o.stop(stopAt);
    },
    lines: [
      { name: 'Trap Slide (E)', dsl: '0:E1:4 8:E1:2 12:G1:2 16:E1:4 24:D1:2 28:B0:4' },
      { name: 'Garage Bounce (Gm)', dsl: '0:G1:2 6:G1:1 8:Bb1:2 14:F1:1 16:G1:2 22:D1:1 24:F1:2 30:G1:1' },
      { name: 'Dub Pressure (F#)', dsl: '0:F#1:6 8:F#1:2 12:A1:2 16:F#1:6 24:E1:4 28:C#1:4' },
      { name: 'Half-Time Roller', dsl: '0:C1:4 10:C1:1 12:Eb1:2 16:C1:4 26:G1:1 28:Bb1:2' }
    ]
  }
};

export const DEFAULT_SYNTH = 'jims10';

export function synthDefaults(synthId) {
  const out = {};
  (SYNTH_BANK[synthId]?.params || []).forEach(p => { out[p.key] = p.def; });
  return out;
}
