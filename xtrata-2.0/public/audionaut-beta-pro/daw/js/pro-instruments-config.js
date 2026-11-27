// Portable sample-instrument configuration. Audio remains in the shared asset
// graph; source entries refer to decoded tracks or a loader-resolved Xtrata source.
export const PRO_INSTRUMENT_IDS = Object.freeze(['drumrack', 'granulator', 'concertpiano', 'valorem']);
export const PAD_NAMES = Object.freeze(['Kick', 'Rim', 'Snare', 'Clap', 'Low tom', 'Mid tom', 'Closed hat', 'Shaker', 'Pedal hat', 'Cowbell', 'Open hat', 'High tom', 'Crash', 'Click', 'Ride', 'Percussion']);
export const isProInstrument = id => PRO_INSTRUMENT_IDS.includes(id);
const number = (value, fallback, min, max, label, integer = false) => {
  const n = value == null ? fallback : value;
  if (!Number.isFinite(n) || n < min || n > max || integer && !Number.isInteger(n)) throw new Error(`${label} must be ${integer ? 'an integer ' : ''}between ${min} and ${max}.`);
  return n;
};
const identifier = (value, label) => {
  if (typeof value !== 'string' || !value.length || value.length > 160) throw new Error(`${label} needs a valid identifier.`);
  return value;
};
export function defaultInstrumentConfig(kind) {
  if (!isProInstrument(kind)) throw new Error('Unknown sample instrument.');
  const config = { version: 1, kind, starter: 'procedural-v1', sources: [] };
  if (kind === 'drumrack') config.pads = PAD_NAMES.map((name, i) => ({ note: 36 + i, name, sourceId: null, gain: 1, pan: 0, tune: 0, chokeGroup: [6, 8, 10].includes(i) ? 'hats' : '', mode: 'oneShot' }));
  if (kind === 'concertpiano' || kind === 'valorem') config.zones = [];
  if (kind === 'granulator') Object.assign(config, { sourceId: null, rootMidi: 60 });
  return config;
}
export function normalizeInstrumentConfig(kind, raw) {
  const defaults = defaultInstrumentConfig(kind);
  if (raw == null) return defaults;
  if (typeof raw !== 'object' || Array.isArray(raw) || raw.version != null && raw.version !== 1 || raw.kind != null && raw.kind !== kind) throw new Error('This sample-instrument configuration has an unsupported kind or version.');
  const config = { ...defaults, ...structuredClone(raw), version: 1, kind };
  if (!Array.isArray(config.sources) || config.sources.length > 128) throw new Error('Use at most 128 instrument sample sources.');
  const sourceIds = new Set();
  config.sources = config.sources.map(source => {
    if (!source || typeof source !== 'object') throw new Error('Invalid instrument sample source.');
    const id = identifier(source.id, 'Sample source');
    if (sourceIds.has(id)) throw new Error('Sample source identifiers must be unique.');
    sourceIds.add(id);
    if (!source.sourceTrackId && !source.source) throw new Error('Each custom sample needs a track or Xtrata source.');
    if (source.sourceTrackId) identifier(source.sourceTrackId, 'Sample track');
    if (source.source && (typeof source.source !== 'object' || Array.isArray(source.source))) throw new Error('The sample source descriptor must be an object.');
    return { ...source, id };
  });
  const reference = (id, label) => { if (id != null && !sourceIds.has(id)) throw new Error(`${label} references a missing sample. Relink its source.`); return id ?? null; };
  if (config.packId != null) identifier(config.packId, 'Sample pack');
  if (kind === 'drumrack') {
    if (!Array.isArray(config.pads) || config.pads.length !== 16) throw new Error('A drum rack contains exactly 16 pads.');
    const notes = new Set();
    config.pads = config.pads.map((pad, i) => {
      const note = number(pad.note, 36 + i, 0, 127, 'Pad MIDI note', true);
      if (notes.has(note)) throw new Error('Drum pads must have distinct MIDI notes.');
      notes.add(note);
      const chokeGroup = String(pad.chokeGroup ?? '');
      if (chokeGroup.length > 32) throw new Error('A choke-group name can contain at most 32 characters.');
      if (pad.mode != null && !['oneShot', 'gate'].includes(pad.mode)) throw new Error('Choose one-shot or gate pad playback.');
      return { ...pad, note, name: String(pad.name || PAD_NAMES[i]).slice(0, 80), sourceId: reference(pad.sourceId, 'Drum pad'), gain: number(pad.gain, 1, 0, 2, 'Pad gain'), pan: number(pad.pan, 0, -1, 1, 'Pad pan'), tune: number(pad.tune, 0, -24, 24, 'Pad tuning'), chokeGroup, mode: pad.mode || 'oneShot' };
    });
  }
  if (kind === 'granulator') {
    config.sourceId = reference(config.sourceId, 'Granulator');
    config.rootMidi = number(config.rootMidi, 60, 0, 127, 'Source root note', true);
  }
  if (kind === 'concertpiano' || kind === 'valorem') {
    if (!Array.isArray(config.zones) || config.zones.length > 128) throw new Error('Use at most 128 piano sample zones.');
    const ids = new Set();
    config.zones = config.zones.map((zone, i) => {
      const id = identifier(zone.id || `zone-${i}`, 'Piano zone');
      if (ids.has(id)) throw new Error('Piano zone identifiers must be unique.');
      ids.add(id);
      const z = { ...zone, id, sourceId: reference(zone.sourceId, 'Piano zone'), rootMidi: number(zone.rootMidi, 60, 0, 127, 'Zone root note', true), lowMidi: number(zone.lowMidi, 0, 0, 127, 'Zone lowest note', true), highMidi: number(zone.highMidi, 127, 0, 127, 'Zone highest note', true), lowVelocity: number(zone.lowVelocity, 1, 1, 127, 'Zone lowest velocity', true), highVelocity: number(zone.highVelocity, 127, 1, 127, 'Zone highest velocity', true), gain: number(zone.gain, 1, 0, 2, 'Zone gain') };
      if (!z.sourceId) throw new Error('A piano zone needs a custom sample source.');
      if (z.lowMidi > z.highMidi || z.lowVelocity > z.highVelocity) throw new Error('Piano zone ranges must run from low to high.');
      if (zone.loopStartSeconds != null || zone.loopEndSeconds != null) {
        z.loopStartSeconds = number(zone.loopStartSeconds, 0, 0, 3600, 'Loop start');
        z.loopEndSeconds = number(zone.loopEndSeconds, 0, 0, 3600, 'Loop end');
        if (z.loopEndSeconds <= z.loopStartSeconds) throw new Error('Sample loop end must be after its start.');
      }
      return z;
    });
  }
  return config;
}
export function resolveInstrumentBuffer(config, sourceId, bufferForSource) {
  const source = config.sources.find(entry => entry.id === sourceId);
  if (!source) throw new Error('This instrument references a missing sample. Relink the sample source.');
  const buffer = bufferForSource?.(source);
  if (!buffer?.getChannelData || !buffer.length) throw new Error('This instrument sample is not loaded. Load or relink the sample before playing.');
  return buffer;
}
export function selectPianoZone(config, pitch, velocity) {
  const midiVelocity = Math.max(1, Math.min(127, Math.round(velocity * 127)));
  return config.zones.filter(z => pitch >= z.lowMidi && pitch <= z.highMidi && midiVelocity >= z.lowVelocity && midiVelocity <= z.highVelocity)
    .sort((a, b) => Math.abs(pitch - a.rootMidi) - Math.abs(pitch - b.rootMidi) || (a.highVelocity - a.lowVelocity) - (b.highVelocity - b.lowVelocity) || a.id.localeCompare(b.id))[0] || null;
}
