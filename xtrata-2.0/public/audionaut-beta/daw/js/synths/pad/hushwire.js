// Baseband noise multiplied by a tuned sine translates its spectrum around
// the played note. Air changes sideband level; bandwidth changes their spread.
import { nativeNote, range, envelope, panel } from '../performance-voice.js';
import { canonicalContext, seededRandom } from '../resources.js';
const params = [
  range('air', 'Sideband air', 0, 1, 0.01, 0.58),
  range('width', 'Noise width (Hz)', 3, 180, 0.5, 28),
  range('core', 'Clear carrier', 0, 1, 0.01, 0.52),
  range('edge', 'Octave air', 0, 1, 0.01, 0.34),
  ...envelope(0.16, 0.62)
];
const beds = new WeakMap();
function noiseBed(ctx) {
  const owner = canonicalContext(ctx);
  if (!beds.has(owner)) {
    // A periodic, zero-DC noise band with fixed random phase and a tapered
    // upper edge. Playback speed sets bandwidth without a resonant filter's
    // startup transient or sample-rate-dependent make-up gain.
    const b = ctx.createBuffer(1, 2048, ctx.sampleRate);
    const data = b.getChannelData(0),
      random = seededRandom(18281);
    for (let k = 1; k <= 96; k++) {
      const phase = random() * 2 * Math.PI;
      const weight = Math.cos(((k / 97) * Math.PI) / 2);
      for (let i = 0; i < data.length; i++) {
        data[i] += weight * Math.sin((2 * Math.PI * k * i) / data.length + phase);
      }
    }
    const peak = data.reduce((m, v) => Math.max(m, Math.abs(v)), 0);
    for (let i = 0; i < data.length; i++) data[i] /= peak;
    beds.set(owner, b);
  }
  return beds.get(owner);
}
function voice(ctx, dest, note, patch) {
  const { P, time, frequency, velocity, osc, play, amp, bind } = nativeNote(
    ctx,
    dest,
    note,
    patch,
    params,
    0.58
  );
  const noise = ctx.createBufferSource();
  noise.buffer = noiseBed(ctx);
  noise.loop = true;
  const air = ctx.createGain();
  bind(
    'width',
    noise.playbackRate,
    (w) => (Math.min(w, frequency * 0.72) * noise.buffer.duration) / 96
  );
  bind('air', air.gain, (v) => v * (0.85 + 0.3 * velocity));
  noise.connect(air);
  for (const ratio of [1, 2]) {
    const carrier = osc('sine', Math.min(frequency * ratio, ctx.sampleRate * 0.48));
    const product = ctx.createGain();
    product.gain.setValueAtTime(0, time);
    air.connect(product.gain);
    carrier.connect(product);
    if (ratio === 1) {
      const dry = ctx.createGain();
      bind('core', dry.gain, (v) => 0.82 * v);
      carrier.connect(dry).connect(amp);
      product.connect(amp);
    } else {
      const octave = ctx.createGain();
      bind(
        'edge',
        octave.gain,
        (v) => 0.5 * v * Math.max(0, Math.min(1, (ctx.sampleRate * 0.48 - frequency * 2) / 600))
      );
      product.connect(octave).connect(amp);
    }
    play(carrier);
  }
  play(noise, time, undefined, (ctx.random?.() ?? 0.25) * noise.buffer.duration);
}
export const HUSHWIRE_SYNTHS = {
  hushwire: {
    name: 'Hushwire',
    tagline: 'Noise sidebands breathe around a stable pitch',
    color: '#9dd7ce',
    params,
    voice,
    ui: panel(
      'Hushwire',
      'TUNED SIDEBAND AIR',
      '#9dd7ce',
      [
        ['air', 'Air', 'pct'],
        ['width', 'Width', 'hz']
      ],
      [
        ['core', 'Carrier', 'pct'],
        ['edge', 'Octave air', 'pct']
      ]
    ),
    presets: [
      { name: 'Felt current', params: {} },
      {
        name: 'Bare filament',
        params: { air: 0.12, width: 6, core: 0.91, edge: 0.08, attack: 0.04, release: 0.2 }
      },
      {
        name: 'Steam chord',
        params: { air: 0.92, width: 100, core: 0.16, edge: 0.78, attack: 0.47, release: 1.35 }
      },
      {
        name: 'Moth wings',
        params: { width: 4, air: 0.9, core: 0.29, edge: 0.15, attack: 0.08, release: 0.34 }
      },
      {
        name: 'Needle spray',
        params: { width: 170, air: 0.8, core: 0.42, edge: 0.95, attack: 0.003, release: 0.05 }
      },
      {
        name: 'Night antenna',
        params: { width: 12, air: 0.45, core: 0.72, edge: 0.85, attack: 0.75, release: 1.95 }
      },
      {
        name: 'Chalk bass',
        params: { width: 37, air: 0.42, core: 0.84, edge: 0.04, attack: 0.008, release: 0.11 }
      },
      {
        name: 'Vanishing edge',
        params: { width: 56, air: 1, core: 0, edge: 0.66, attack: 1.1, release: 2.3 }
      }
    ],
    lines: [
      {
        name: 'Held open fifths',
        dsl: '0:D3:14:80 0:A3:14:68 16:F3:14:88 16:C4:14:72 32:G3:20:84 32:D4:20:74'
      },
      { name: 'Air between keys', dsl: '0:A4:3:49 6:C5:4:71 12:E5:5:93 20:D5:8:106 32:A4:16:66' },
      { name: 'Bass and vapour', dsl: '0:E2:12:112 4:B4:8:57 16:G2:12:100 22:D5:6:65 32:A2:16:98' },
      { name: 'Drifting seconds', dsl: '0:C4:20:73 8:D4:16:67 24:G3:18:86 32:A3:16:75' }
    ]
  }
};
