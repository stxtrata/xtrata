// A falling striker excites two short, pitched wooden contacts. Successive
// rebounds lose energy and arrive closer together, all on the audio clock.
import { nativeNote, range, envelope, panel } from '../performance-voice.js';
const params = [
  range('spacing', 'First rebound (s)', 0.025, 0.32, 0.005, 0.12),
  range('bounce', 'Restitution', 0.15, 0.87, 0.01, 0.68),
  range('shell', 'Contact resonance', 0, 1, 0.01, 0.52),
  range('knock', 'Contact hardness', 0, 1, 0.01, 0.55),
  ...envelope(0.002, 0.19)
];
function voice(ctx, dest, note, patch) {
  const { P, time, end, velocity, frequency, osc, play, amp, bind } = nativeNote(
    ctx,
    dest,
    note,
    patch,
    params,
    0.9
  );
  // One continuous pair of oscillators is excited by multiple short envelopes.
  // The pitch of the second contact reflects a much shorter, harder surface.
  const ring = ctx.createGain(),
    upper = ctx.createGain();
  bind('knock', upper.gain, (v) => v * (0.24 + 0.26 * velocity));
  const low = osc('triangle'),
    high = osc('sine', Math.min(ctx.sampleRate * 0.43, frequency * 2.71));
  low.connect(ring);
  high.connect(upper).connect(ring);
  ring.connect(amp);
  ring.gain.setValueAtTime(0, time);
  let age = 0,
    spacing = P.spacing,
    strength = 1,
    last = time;
  for (let contact = 0; contact < 6; contact++) {
    const at = time + age;
    if (at >= end || strength < 0.001 || spacing < 0.004) break;
    const decay = Math.min(spacing - 0.003, 0.016 + P.shell * 0.12);
    ring.gain.setValueAtTime(0, at);
    ring.gain.linearRampToValueAtTime(strength, at + 0.0015);
    ring.gain.setTargetAtTime(0, at + 0.0015, decay / 6);
    last = at + 0.002 + decay;
    age += spacing;
    spacing *= 0.56 + 0.38 * P.bounce;
    strength *= P.bounce;
  }
  play(low, time, Math.min(end, last));
  play(high, time, Math.min(end, last));
}
export const CLATTERSTEP_SYNTHS = {
  clatterstep: {
    name: 'Clatterstep',
    tagline: 'Pitched wooden contacts with accelerating rebounds',
    color: '#e89e88',
    params,
    voice,
    live: { naturalDecay: true },
    ui: panel(
      'Clatterstep',
      'REBOUND PERCUSSION',
      '#e89e88',
      [
        ['spacing', 'First gap', 'ms'],
        ['bounce', 'Rebound', 'pct']
      ],
      [
        ['shell', 'Resonance', 'pct'],
        ['knock', 'Hardness', 'pct']
      ]
    ),
    presets: [
      { name: 'Six on the sill', params: {} },
      {
        name: 'Deadstick',
        params: { spacing: 0.035, bounce: 0.16, shell: 0.12, knock: 0.26, release: 0.05 }
      },
      {
        name: 'Stairwell',
        params: { spacing: 0.315, bounce: 0.85, shell: 0.85, knock: 0.84, release: 0.8 }
      },
      {
        name: 'Domino run',
        params: { spacing: 0.18, bounce: 0.77, shell: 0.08, knock: 0.72, release: 0.45 }
      },
      {
        name: 'Bamboo pair',
        params: { spacing: 0.11, bounce: 0.38, shell: 0.92, knock: 0.13, release: 0.24 }
      },
      {
        name: 'Zipped teeth',
        params: { spacing: 0.03, bounce: 0.85, shell: 0.19, knock: 0.98, release: 0.09 }
      },
      {
        name: 'Brush pickup',
        params: {
          spacing: 0.22,
          bounce: 0.73,
          shell: 0.63,
          knock: 0.43,
          attack: 0.11,
          release: 0.36
        }
      },
      {
        name: 'Heel block',
        params: { spacing: 0.055, bounce: 0.31, shell: 0.66, knock: 0.04, release: 0.13 }
      }
    ],
    lines: [
      {
        name: 'Heel and toe',
        dsl: '0:D3:4:114 6:A3:2:64 8:C4:3:99 13:G3:2:81 16:D3:6:118 26:A3:3:72'
      },
      { name: 'Falling dice', dsl: '0:B4:10:94 12:F4:8:102 22:D4:10:112 34:G3:12:90' },
      {
        name: 'Cross sticks',
        dsl: '0:C3:6:108 3:G4:5:72 8:Eb3:6:94 11:Bb4:5:68 16:F3:8:111 19:C5:6:84'
      },
      { name: 'Mute then roll', dsl: '0:E3:1:100 4:E3:1:72 7:B3:1:85 10:E4:10:112 24:B3:8:88' }
    ]
  }
};
