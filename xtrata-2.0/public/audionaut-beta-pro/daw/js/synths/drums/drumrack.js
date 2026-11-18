import { PAD_NAMES, defaultInstrumentConfig, resolveInstrumentBuffer } from '../../pro-instruments-config.js';
import { sourceSample, ownSampleVoice, clamp } from '../../pro-instruments-runtime.js';
import { canonicalContext } from '../resources.js';

const lengths = [.7, .14, .45, .3, .8, .6, .12, .2, .2, .4, 1.1, .45, 1.8, .08, 1.5, .55];
export const drumStarterDuration = index => lengths[index] || 0;
export function drumStarterSample(ctx, index) {
  return sourceSample(ctx, `audionaut-original-drums-v1:${index}`, lengths[index], (data, sr, random) => {
    let phase = 0, lowNoise = 0;
    const tom = [4, 5, 11, 15].includes(index), metal = [6, 7, 8, 10, 12, 14].includes(index);
    const decay = lengths[index] / (metal ? 7 : 8), base = ({ 0: 48, 4: 92, 5: 135, 11: 190, 15: 260 })[index] || 180;
    for (let i = 0; i < data.length; i++) {
      const t = i / sr, noise = random() * 2 - 1; lowNoise += .14 * (noise - lowNoise);
      let value;
      if (index === 0 || tom) {
        phase += 2 * Math.PI * (base + (index === 0 ? 125 : base * .6) * Math.exp(-t * 65)) / sr;
        value = Math.sin(phase) * Math.exp(-t / decay) * .77 + noise * Math.exp(-t * 220) * .14;
      } else if (index === 2) value = noise * Math.exp(-t / .065) * .43 + (Math.sin(t * 2 * Math.PI * 180) + .4 * Math.sin(t * 2 * Math.PI * 330)) * Math.exp(-t / .05) * .28;
      else if (index === 3) {
        const burst = [0, .012, .025].reduce((sum, at) => sum + (t >= at ? Math.exp(-(t - at) * 160) : 0), 0);
        value = (noise - lowNoise) * (burst * .28 + Math.exp(-t / .05) * .1);
      } else if (metal) {
        const metallic = Math.sin(t * 2 * Math.PI * 3511) * Math.sin(t * 2 * Math.PI * 5417) + .4 * Math.sin(t * 2 * Math.PI * 7123);
        value = ((noise - lowNoise) * .42 + metallic * .12) * Math.exp(-t / decay);
      } else if (index === 9) value = (Math.sin(t * 2 * Math.PI * 540) + .7 * Math.sin(t * 2 * Math.PI * 815)) * Math.exp(-t / .07) * .28;
      else value = (Math.sin(t * 2 * Math.PI * (index === 13 ? 1700 : 1350)) * .6 + noise * .3) * Math.exp(-t / .018);
      data[i] = clamp(value, -.95, .95) * Math.min(1, i / 12);
    }
  });
}
const chokeVoices = new WeakMap();
export function createDrumRackVoice(ctx, destination, instrument, config, note, params, onEnded, options = {}) {
  const padIndex = config.pads.findIndex(pad => pad.note === note.pitch);
  if (padIndex < 0) {
    const voice = { ended: true, released: true, ready: Promise.resolve(true), tailSeconds: 0, latencySeconds: 0, release() {}, stop() {}, setBend() {}, setParameters() { return true; } };
    queueMicrotask(() => onEnded?.()); return voice;
  }
  const pad = config.pads[padIndex], buffer = pad.sourceId ? resolveInstrumentBuffer(config, pad.sourceId, options.bufferForSource) : drumStarterSample(ctx, padIndex);
  const root = canonicalContext(ctx), groups = chokeVoices.get(root) || new Map(); chokeVoices.set(root, groups);
  const key = pad.chokeGroup ? `${instrument.id || 'standalone'}:${pad.chokeGroup}` : null;
  const siblings = key ? groups.get(key) || new Set() : null;
  if (key) groups.set(key, siblings);
  for (const previous of siblings || []) if (!previous.voice.ended && previous.time <= note.time && previous.voice.endTime > note.time) previous.voice.choke(note.time);
  let record;
  const voice = ownSampleVoice(ctx, destination, buffer, note, {
    oneShot: pad.mode !== 'gate', rate: 2 ** ((pad.tune + (params.tune || 0)) / 12),
    attack: .001, release: params.release || .1, level: (params.level ?? .8) * pad.gain, zoneGain: pad.gain,
    cutoff: 600 + (params.brightness ?? .8) * 17000, pan: pad.pan,
  }, () => { if (record) { siblings?.delete(record); if (siblings && !siblings.size) groups.delete(key); } onEnded?.(); });
  record = { voice, time: note.time }; siblings?.add(record);
  voice.pad = { index: padIndex, note: pad.note, name: pad.name, chokeGroup: pad.chokeGroup };
  return voice;
}
export const DRUMRACK_SYNTHS = {
  drumrack: {
    name: 'Drum Rack', tagline: '16 sample pads · velocity and choke groups · original modeled starter kit', color: '#ff9961', category: 'drums',
    live: { oneShot: true, gate: .15 }, sampleInstrument: true,
    params: [
      { key: 'brightness', label: 'Brightness', type: 'range', min: 0, max: 1, step: .01, def: .8 },
      { key: 'tune', label: 'Rack tune', type: 'range', min: -12, max: 12, step: 1, def: 0 },
      { key: 'release', label: 'Gate release', type: 'range', min: .01, max: 2, step: .01, def: .1 },
      { key: 'level', label: 'Level', type: 'range', min: 0, max: 1.5, step: .01, def: .8 },
    ],
    lines: [{ name: 'Starter groove', dsl: '0:C2:1:114 4:D2:1:95 8:C2:1:102 12:D2:1:114 0:F#2:0.5:83 2:F#2:0.5:51 4:F#2:0.5:83 6:F#2:0.5:51 8:F#2:0.5:83 10:F#2:0.5:51 12:F#2:0.5:83 14:F#2:0.5:51' }],
    voice(ctx, destination, note, params) { return createDrumRackVoice(ctx, destination, { id: 'starter' }, defaultInstrumentConfig('drumrack'), note, params); },
    starterDescription: 'Original procedural percussion, generated locally from oscillation and seeded noise. Replace pads with your own local or Xtrata samples.',
    padNames: PAD_NAMES,
  },
};
