import { defaultInstrumentConfig, resolveInstrumentBuffer, selectPianoZone } from '../../pro-instruments-config.js';
import { sourceSample, ownSampleVoice, frequency, clamp } from '../../pro-instruments-runtime.js';

// These are original modeled strings, not a sampled concert grand. Sparse roots
// and three velocity layers use the same multisample player as imported packs.
export function pianoStarterSample(ctx, rootMidi, layer) {
  const f = frequency(rootMidi), seconds = clamp(5.2 * (110 / f) ** .18, 2.5, 7);
  return sourceSample(ctx, `audionaut-original-piano-v1:${rootMidi}:${layer}`, seconds, (data, sr, random) => {
    const count = Math.min(18, Math.floor(sr * .45 / f)), partials = [];
    for (let h = 1; h <= count; h++) {
      const hz = f * h * Math.sqrt(1 + .00012 * h * h), angle = 2 * Math.PI * hz / sr;
      const amplitude = Math.exp(-h / (3 + layer * 3)) / h ** 1.05;
      partials.push({ sin: 0, cos: 1, ds: Math.sin(angle), dc: Math.cos(angle), amplitude, decay: Math.exp(-1 / (sr * seconds * .23 / (1 + h * .16))) });
    }
    let low = 0;
    for (let i = 0; i < data.length; i++) {
      const t = i / sr; let sum = 0;
      for (const p of partials) { sum += p.sin * p.amplitude; const next = p.sin * p.dc + p.cos * p.ds; p.cos = p.cos * p.dc - p.sin * p.ds; p.sin = next; p.amplitude *= p.decay; }
      const noise = random() * 2 - 1; low += .12 * (noise - low);
      const hammer = (noise - low) * Math.exp(-t * 220) * (.015 + layer * .018);
      data[i] = Math.tanh(sum * .58 + hammer) * Math.min(1, i / 24) * .72;
    }
    // Silent loop permits a held key to remain owned after its natural decay.
    data.fill(0, Math.max(0, data.length - Math.ceil(.025 * sr)));
  });
}
export function createConcertPianoVoice(ctx, destination, instrument, config, note, params, onEnded, options = {}) {
  const velocity = clamp(note.vel, 0, 1), custom = config.zones.length > 0;
  let zone, buffer, rootMidi, gain = 1, loop;
  if (custom) {
    zone = selectPianoZone(config, note.pitch, velocity);
    if (!zone) throw new Error('No piano sample zone covers this note and velocity. Add a matching key/velocity zone.');
    buffer = resolveInstrumentBuffer(config, zone.sourceId, options.bufferForSource); rootMidi = zone.rootMidi; gain = zone.gain;
    if (zone.loopEndSeconds != null) loop = { start: zone.loopStartSeconds, end: zone.loopEndSeconds };
  } else {
    rootMidi = clamp(Math.round(note.pitch / 3) * 3, 21, 108);
    buffer = pianoStarterSample(ctx, rootMidi, Math.min(2, Math.floor(velocity * 3)));
    loop = { start: buffer.duration - .012, end: buffer.duration - .001 };
  }
  const played = { ...note, vel: velocity ** (params.velocityCurve ?? 1.25) };
  const voice = ownSampleVoice(ctx, destination, buffer, played, {
    rate: 2 ** ((note.pitch - rootMidi) / 12), attack: params.attack ?? .002, release: params.release ?? .22,
    level: (params.level ?? .9) * gain, zoneGain: gain,
    cutoff: 600 + (params.brightness ?? .65) * 17000,
    pan: clamp((note.pitch - 60) / 48 * (params.spread ?? .25), -.8, .8), loop,
  }, onEnded);
  voice.zone = zone || { rootMidi, layer: Math.min(2, Math.floor(velocity * 3)), starter: 'procedural-v1' };
  return voice;
}
export const CONCERTPIANO_SYNTHS = {
  concertpiano: {
    name: 'Concert Piano', tagline: 'Multisample piano · original modeled starter, ready for your sampled piano pack', color: '#d7c5a3', category: 'keys',
    live: { naturalDecay: true, release: params => params.release }, sampleInstrument: true,
    params: [
      { key: 'brightness', label: 'Brightness', type: 'range', min: 0, max: 1, step: .01, def: .65 },
      { key: 'velocityCurve', label: 'Velocity curve', type: 'range', min: .5, max: 2, step: .05, def: 1.25 },
      { key: 'spread', label: 'Keyboard width', type: 'range', min: 0, max: .8, step: .01, def: .25 },
      { key: 'attack', label: 'Attack', type: 'range', min: .001, max: .2, step: .001, def: .002 },
      { key: 'release', label: 'Damper release', type: 'range', min: .02, max: 3, step: .01, def: .22 },
      { key: 'level', label: 'Level', type: 'range', min: 0, max: 1.5, step: .01, def: .9 },
    ],
    lines: [{ name: 'Open voicing', dsl: '0:C3:12:89 0:G3:12:76 0:E4:12:91 8:G4:8:70' }],
    voice(ctx, destination, note, params) { return createConcertPianoVoice(ctx, destination, { id: 'starter' }, defaultInstrumentConfig('concertpiano'), note, params); },
    starterDescription: 'Original procedural, velocity-layered piano-like strings. This starter is modeled, not a recording of a concert grand. Import your own multisample pack for recorded piano realism.',
  },
};
