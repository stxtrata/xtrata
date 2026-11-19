// Two perforated rotors. The air aperture determines the pulse spectrum.
// Interleaving a second two-port rotor adds a separately controlled octave.
import { nativeNote, range, envelope, panel } from '../performance-voice.js';
import { canonicalContext } from '../resources.js';

const params = [
  range('aperture', 'Port width', 0.06, 0.48, 0.01, 0.22),
  range('register', 'Upper rotor', 0, 1, 0.01, 0.32),
  range('inertia', 'Run-up time', 0.01, 1.2, 0.01, 0.17),
  range('drag', 'Starting drop (semitones)', 0, 24, 0.1, 8),
  ...envelope(0.012, 0.14)
];
const wheels = new WeakMap();
function portWave(ctx, aperture) {
  const owner = canonicalContext(ctx);
  if (!wheels.has(owner)) wheels.set(owner, new Map());
  const bank = wheels.get(owner);
  const width = Math.round(aperture * 100);
  if (!bank.has(width)) {
    const cosine = new Float32Array(97),
      sine = new Float32Array(97);
    for (let k = 1; k < cosine.length; k++)
      cosine[k] = (2 * Math.sin((Math.PI * k * width) / 100)) / (Math.PI * k);
    bank.set(width, ctx.createPeriodicWave(cosine, sine));
  }
  return bank.get(width);
}
function voice(ctx, dest, note, patch) {
  const { P, time, frequency, velocity, osc, amp, play, bind } = nativeNote(
    ctx,
    dest,
    note,
    patch,
    params,
    0.85
  );
  const upper = ctx.createGain();
  bind('register', upper.gain, (v) => 0.52 * v);
  upper.connect(amp);
  for (const ratio of [1, 2]) {
    const rotor = osc('sine', Math.min(ctx.sampleRate * 0.46, frequency * ratio));
    rotor.setPeriodicWave(portWave(ctx, P.aperture));
    rotor.detune.setValueAtTime(-100 * P.drag, time);
    rotor.detune.linearRampToValueAtTime(0, time + P.inertia / (0.65 + 0.55 * velocity));
    rotor.connect(ratio === 1 ? amp : upper);
    play(rotor);
  }
}
export const PORTWHEEL_SYNTHS = {
  portwheel: {
    name: 'Portwheel',
    tagline: 'Twin air rotors with a velocity-driven run-up',
    color: '#ffb971',
    params,
    voice,
    ui: panel(
      'Portwheel',
      'PNEUMATIC ROTOR LEAD',
      '#ffb971',
      [
        ['aperture', 'Port width', 'pct'],
        ['register', 'Upper rotor', 'pct']
      ],
      [
        ['inertia', 'Run-up', 'ms'],
        ['drag', 'Drop (st)', 'num1']
      ]
    ),
    presets: [
      { name: 'Yard call', params: {} },
      {
        name: 'Pocket whistle',
        params: { aperture: 0.47, register: 0.06, inertia: 0.02, drag: 1, release: 0.06 }
      },
      {
        name: 'Shift change',
        params: { aperture: 0.1, register: 0.8, inertia: 0.8, drag: 19, release: 0.48 }
      },
      {
        name: 'Stalled motor',
        params: { aperture: 0.38, register: 0.18, inertia: 1.19, drag: 24, attack: 0.08 }
      },
      {
        name: 'Teleprinter',
        params: { aperture: 0.07, register: 0.16, inertia: 0.01, drag: 0, release: 0.03 }
      },
      {
        name: 'Twin stack',
        params: { aperture: 0.3, register: 1, inertia: 0.09, drag: 3, release: 0.32 }
      },
      {
        name: 'Fog across the pier',
        params: {
          aperture: 0.43,
          register: 0.54,
          attack: 0.44,
          release: 1.4,
          inertia: 0.6,
          drag: 6
        }
      },
      {
        name: 'Scooped brass',
        params: {
          aperture: 0.16,
          register: 0.65,
          attack: 0.045,
          inertia: 0.33,
          drag: 12,
          release: 0.09
        }
      }
    ],
    lines: [
      { name: 'Call and answer', dsl: '0:C3:6:110 8:G3:3:76 12:Bb3:3:88 16:C4:8:118 28:G3:3:82' },
      { name: 'Motor catch', dsl: '0:D2:1:56 3:D2:2:84 6:D2:3:116 12:A2:10:100 24:D3:7:108' },
      { name: 'Harbour duet', dsl: '0:F3:12:79 4:C4:8:92 16:Eb3:12:76 20:Bb3:8:101 32:F3:16:94' },
      {
        name: 'Breakbeat signal',
        dsl: '0:G3:2:120 3:D4:1:71 6:F4:3:96 11:G4:1:77 14:D4:5:105 22:G3:2:92'
      }
    ]
  }
};
