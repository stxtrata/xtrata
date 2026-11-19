// Instrument-aware display range; stored notes and incoming MIDI stay unchanged.
import { normalizeInstrumentConfig } from './pro-instruments-config.js';
import { keyName } from './keyboard-layout.js';
const ranges = new WeakMap();
export function drumKeyboard(track) {
  if (track?.synthId !== 'drumrack') return null;
  const cached = ranges.get(track);
  if (cached && cached.source === track.sampleInstrument) return cached.range;
  const pads = normalizeInstrumentConfig('drumrack', track.sampleInstrument).pads;
  const range = { from: Math.floor(Math.min(...pads.map(p => p.note)) / 12) * 12,
    to: Math.max(...pads.map(p => p.note)), pads };
  ranges.set(track, { source: track.sampleInstrument, range });
  return range;
}
export function performancePitch(track, offset, octave) {
  const range = drumKeyboard(track), pitch = (range?.from ?? (octave + 1) * 12) + offset;
  return range && !range.pads.some(p => p.note === pitch) ? null : pitch;
}
// Drum labels follow the C1 = MIDI 36 convention; include MIDI identity in tooltips.
export const instrumentKeyName = (track, pitch) => keyName(pitch - (track?.synthId === 'drumrack' ? 12 : 0));
