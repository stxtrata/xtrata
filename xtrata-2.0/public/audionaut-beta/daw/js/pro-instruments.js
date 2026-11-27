import { isProInstrument, normalizeInstrumentConfig, selectPianoZone } from './pro-instruments-config.js';
import { createDrumRackVoice, drumStarterDuration } from './synths/drums/drumrack.js';
import { createGranulatorVoice } from './synths/fx/granulator.js';
import { createConcertPianoVoice } from './synths/keys/concertpiano.js';
import { createValoriumVoice } from './synths/keys/valorium.js';
export { PRO_INSTRUMENT_IDS, PAD_NAMES, isProInstrument, defaultInstrumentConfig, normalizeInstrumentConfig, selectPianoZone } from './pro-instruments-config.js';
export { starterCacheStats } from './pro-instruments-runtime.js';
const factories = { drumrack: createDrumRackVoice, granulator: createGranulatorVoice, concertpiano: createConcertPianoVoice, valorium: createValoriumVoice };
// Seconds after the nominal note gate. A one-shot's end follows the sample,
// while a looped/gated instrument follows its release envelope. The resolver
// may return an AudioBuffer or duration metadata when estimating before decode.
export function proInstrumentTailSeconds(instrument, note, { bufferForSource } = {}) {
  if (!isProInstrument(instrument?.synthId)) return 0;
  const config = normalizeInstrumentConfig(instrument.synthId, instrument.sampleInstrument), P = instrument.params || {};
  const duration = Math.max(0, note.duration ?? note.dur ?? 0), offset = Math.max(0, note.chaseOffsetSeconds ?? note.offset ?? 0);
  const sampleDuration = id => {
    const source = config.sources.find(entry => entry.id === id), buffer = source && bufferForSource?.(source);
    if (!Number.isFinite(buffer?.duration) || buffer.duration <= 0) throw new Error('This instrument sample is not loaded. Load or relink the sample before estimating its playback tail.');
    return buffer.duration;
  };
  if (instrument.synthId === 'drumrack') {
    const index = config.pads.findIndex(pad => pad.note === note.pitch); if (index < 0) return 0;
    const pad = config.pads[index], rate = 2 ** ((pad.tune + (P.tune || 0)) / 12);
    const remaining = Math.max(0, (pad.sourceId ? sampleDuration(pad.sourceId) : drumStarterDuration(index)) / rate - offset - duration);
    return pad.mode === 'gate' ? Math.min(remaining, Math.max(.005, P.release ?? .1)) : remaining;
  }
  if (instrument.synthId === 'granulator') return Math.max(.01, Math.min(4, P.release ?? .25));
  // Every VALORIUM layer fades out over the release, looped or not.
  if (instrument.synthId === 'valorium') return Math.max(.005, Math.min(4, P.release ?? .45));
  const release = Math.max(.005, P.release ?? .22);
  if (!config.zones.length) return release;
  const zone = selectPianoZone(config, note.pitch, note.velocity ?? note.vel ?? 1);
  if (!zone) throw new Error('No piano sample zone covers this note and velocity. Add a matching key/velocity zone.');
  const length = sampleDuration(zone.sourceId);
  return zone.loopEndSeconds != null ? release : Math.min(release, Math.max(0, length / 2 ** ((note.pitch - zone.rootMidi) / 12) - offset - duration));
}
export function createProInstrumentVoice(ctx, destination, instrument, note, params, onEnded, options = {}) {
  if (!isProInstrument(instrument?.synthId)) throw new Error('Unknown sample instrument.');
  if (!Number.isFinite(note.pitch) || note.pitch < 0 || note.pitch > 127 || !Number.isFinite(note.vel) || !Number.isFinite(note.time)) throw new Error('Invalid sample-instrument note.');
  const config = normalizeInstrumentConfig(instrument.synthId, instrument.sampleInstrument);
  return factories[instrument.synthId](ctx, destination, instrument, config, note, params, onEnded, options);
}
