// Three octave-spaced sine belts. Each wraps only at its silent seam. The
// common saw drives pitch in cents and a Hann window masks each octave reset.
import { nativeNote, range, envelope, panel } from '../performance-voice.js';
import { motionTable, motionSource } from '../motion-tables.js';
const params = [
  range('travel', 'Travel (octaves/s)', 0, 0.9, 0.01, 0.29),
  range('focus', 'Moving voices', 0, 1, 0.01, 0.82),
  range('anchor', 'Stationary fundamental', 0, 1, 0.01, 0.24),
  range('height', 'Centre (semitones)', -12, 12, 1, 0),
  { key: 'direction', label: 'Direction', type: 'select', options: ['rise', 'fall'], def: 'rise' },
  ...envelope(0.23, 0.9)
];
function voice(ctx, dest, note, patch) {
  const { time, frequency, amp, bind, play, osc } = nativeNote(ctx, dest, note, patch, params, 0.6);
  const anchor = osc('sine');
  const steady = ctx.createGain();
  bind('anchor', steady.gain, (v) => v * 0.8);
  anchor.connect(steady).connect(amp);
  play(anchor);
  const moving = ctx.createGain();
  bind('focus', moving.gain, (v) => v * 0.68);
  moving.connect(amp);
  const ramp = motionTable(ctx, 'neverend/cents', (p) => 3600 * (p - 0.5));
  const hann = motionTable(ctx, 'neverend/window', (p) => Math.sin(Math.PI * p) ** 2);
  // Keep the entire moving band below Nyquist, including the height control.
  let centre = frequency;
  while (centre * 2 ** 2.5 > ctx.sampleRate * 0.45) centre /= 2;
  for (let i = 0; i < 3; i++) {
    const carrier = osc('sine', centre),
      window = ctx.createGain();
    window.gain.setValueAtTime(0, time);
    bind('height', carrier.detune, (v) => v * 100);
    const slope = ctx.createGain();
    bind('direction', slope.gain, (v) => (v === 'fall' ? -1 : 1));
    slope.connect(carrier.detune);
    const pitch = motionSource(ctx, ramp, slope);
    const gain = motionSource(ctx, hann, window.gain);
    for (const mod of [pitch, gain]) {
      bind('travel', mod.playbackRate, (v) => (v * mod.buffer.duration) / 3);
    }
    carrier.connect(window).connect(moving);
    play(carrier);
    play(pitch, time, undefined, (ramp.duration * i) / 3);
    play(gain, time, undefined, (hann.duration * i) / 3);
  }
}
export const NEVEREND_SYNTHS = {
  neverend: {
    name: 'Neverend',
    tagline: 'Octave belts rise or fall around a fixed pitch anchor',
    color: '#afa5f1',
    params,
    voice,
    ui: panel(
      'Neverend',
      'CONTINUOUS OCTAVE GLISSANDO',
      '#afa5f1',
      [
        ['travel', 'Octaves/s', 'num2'],
        ['focus', 'Moving voices', 'pct']
      ],
      [
        ['anchor', 'Anchor', 'pct'],
        ['height', 'Centre (st)', 'int'],
        ['direction', 'Direction', ['rise', 'fall']]
      ]
    ),
    presets: [
      { name: 'Up escalator', params: {} },
      {
        name: 'Service lift',
        params: {
          direction: 'fall',
          travel: 0.46,
          focus: 0.94,
          anchor: 0.08,
          height: -7,
          attack: 0.12,
          release: 0.54
        }
      },
      {
        name: 'Falling asleep',
        params: {
          direction: 'fall',
          travel: 0.09,
          focus: 0.95,
          anchor: 0.18,
          height: 5,
          attack: 0.85,
          release: 2.3
        }
      },
      {
        name: 'Spiral stair',
        params: { travel: 0.78, focus: 0.91, anchor: 0.39, height: 7, attack: 0.04, release: 0.33 }
      },
      {
        name: 'Fixed horizon',
        params: { travel: 0.06, focus: 0.42, anchor: 0.92, height: 0, attack: 0.52, release: 1.45 }
      },
      {
        name: 'Undertow',
        params: {
          direction: 'fall',
          travel: 0.83,
          focus: 0.8,
          anchor: 0.67,
          height: -12,
          attack: 0.008,
          release: 0.22
        }
      },
      {
        name: 'No floor',
        params: { travel: 0.41, focus: 1, anchor: 0, height: 12, attack: 0.7, release: 1.8 }
      },
      {
        name: 'Parked belts',
        params: { travel: 0, focus: 0.68, anchor: 0.56, height: -5, attack: 0.09, release: 0.69 }
      }
    ],
    lines: [
      { name: 'Single ascent', dsl: '0:C3:28:86 32:G3:24:99' },
      { name: 'Bass holds the lift', dsl: '0:D2:28:100 8:A3:18:66 32:F2:24:91 40:C4:14:70' },
      { name: 'Contrary footsteps', dsl: '0:A4:10:77 12:G4:10:83 24:E4:10:91 36:C4:18:98' },
      {
        name: 'Slow suspension',
        dsl: '0:Bb2:24:86 6:F3:18:74 12:C4:12:63 32:Eb3:24:91 38:Bb3:18:70'
      }
    ]
  }
};
