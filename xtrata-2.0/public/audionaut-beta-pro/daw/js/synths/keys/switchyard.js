// A common clock moves a phrase between two pitched rails. Raised-cosine
// windows keep the note-to-note hocket smooth at every playback speed.
import { nativeNote, range, envelope, panel } from '../performance-voice.js';
import { motionTable, motionSource } from '../motion-tables.js';
const params = [
  range('speed', 'Pulses per second', 1, 16, 0.1, 6),
  range('exchange', 'Hocket depth', 0, 1, 0.01, 0.86),
  range('interval', 'Second rail (semitones)', -12, 19, 1, 7),
  range('voicing', 'Second rail level', 0, 1, 0.01, 0.63),
  ...envelope(0.012, 0.22)
];
const route = [1, -1, 1, 1, -1, 1, -1, -1];
function movement(phase) {
  const position = phase * route.length,
    i = Math.floor(position);
  const fade = Math.min(1, (position - i) * 5);
  const mix = 0.5 - 0.5 * Math.cos(Math.PI * fade);
  return route[(i + 7) % 8] * (1 - mix) + route[i] * mix;
}
function voice(ctx, dest, note, patch) {
  const { time, frequency, velocity, amp, bind, play, osc } = nativeNote(
    ctx,
    dest,
    note,
    patch,
    params,
    0.66
  );
  const bus = ctx.createGain();
  bind('exchange', bus.gain, (v) => 0.48 * v);
  const table = motionTable(ctx, 'switchyard/route', movement);
  const clock = motionSource(ctx, table, bus);
  bind('speed', clock.playbackRate, (v) => (v * table.duration) / 8);
  play(clock);
  const invert = ctx.createGain();
  invert.gain.value = -1;
  bus.connect(invert);
  for (const upper of [false, true]) {
    const oscillator = osc(upper ? 'sine' : 'triangle', frequency);
    const window = ctx.createGain();
    window.gain.setValueAtTime(0.5, time);
    oscillator.connect(window);
    if (upper) {
      bind('interval', oscillator.detune, (v) =>
        Math.min(100 * v, 1200 * Math.log2((ctx.sampleRate * 0.46) / frequency))
      );
      const gain = ctx.createGain();
      bind('voicing', gain.gain, (v) => v * (0.7 + 0.3 * velocity));
      invert.connect(window.gain);
      window.connect(gain).connect(amp);
    } else {
      bus.connect(window.gain);
      window.connect(amp);
    }
    play(oscillator);
  }
}
export const SWITCHYARD_SYNTHS = {
  switchyard: {
    name: 'Switchyard',
    tagline: 'One held key trades an eight-pulse phrase between two pitches',
    color: '#efce64',
    params,
    voice,
    ui: panel(
      'Switchyard',
      'TWO-RAIL HOCKET KEYS',
      '#efce64',
      [
        ['speed', 'Pulse Hz', 'hz'],
        ['exchange', 'Exchange', 'pct']
      ],
      [
        ['interval', 'Interval (st)', 'int'],
        ['voicing', 'Second rail', 'pct']
      ]
    ),
    presets: [
      { name: 'Passing loop', params: {} },
      {
        name: 'Slow exchange',
        params: { speed: 1.6, exchange: 1, interval: 12, voicing: 0.9, attack: 0.23, release: 0.82 }
      },
      {
        name: 'Semaphore bass',
        params: { speed: 8, exchange: 0.97, interval: -12, voicing: 0.72, release: 0.07 }
      },
      {
        name: 'Blue relay',
        params: {
          speed: 4.3,
          exchange: 0.65,
          interval: 3,
          voicing: 0.88,
          attack: 0.055,
          release: 0.37
        }
      },
      {
        name: 'Octave chatter',
        params: { speed: 15.4, exchange: 1, interval: 12, voicing: 0.96, release: 0.08 }
      },
      {
        name: 'Fifth drone',
        params: {
          speed: 2.4,
          exchange: 0.16,
          interval: 7,
          voicing: 0.78,
          attack: 0.67,
          release: 1.7
        }
      },
      {
        name: 'Ghost siding',
        params: { speed: 7.5, exchange: 0.94, interval: 19, voicing: 0.25, release: 0.54 }
      },
      {
        name: 'Minor descent',
        params: {
          speed: 3.7,
          exchange: 0.78,
          interval: -5,
          voicing: 0.94,
          attack: 0.11,
          release: 0.66
        }
      }
    ],
    lines: [
      { name: 'Hold the junction', dsl: '0:C3:16:102 16:Ab2:12:82 28:Eb3:4:94 32:Bb2:24:108' },
      { name: 'Offbeat switches', dsl: '0:F3:6:110 7:F3:4:77 13:Ab3:7:90 22:Bb3:10:99' },
      { name: 'Crossed dispatches', dsl: '0:D3:20:96 5:A3:15:74 24:C3:20:88 31:G3:13:70' },
      { name: 'Reset the phrase', dsl: '0:G2:1:75 3:G2:2:84 7:G2:4:94 13:G2:8:104 24:G2:20:117' }
    ]
  }
};
