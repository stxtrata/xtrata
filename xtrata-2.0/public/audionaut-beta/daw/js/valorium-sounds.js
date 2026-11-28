// valorium-sounds.js — recorded instruments for VALORIUM, built from the CC0 sample
// packs the Audionaut already ships (pack-catalogue.js, media/packs/*.audpack).
//
// Only public-domain material is offered here: packs in the "core" tier and, within
// them, only sounds marked CC0-1.0. The sources are the Versilian Community Sample
// Library, VS Chamber Orchestra Community Edition and Karoryfer Samples, among others;
// every sound keeps its credit. No attribution or fee is required for any of them.
//
// A recorded instrument is every pitched sound that shares a name once the note is
// removed ("Strings — Violin Section Sustain G3" -> "Violin Section Sustain"), played
// from the nearest recorded note. Sustained articulations get a crossfaded loop so a
// held key keeps sounding.
import { PACKS, PACK_CREDITS, PACK_LICENCES, loadPackAudio } from './pack-library.js';

const NOTE = /\s+[A-G](#|b)?-?\d(\s.*)?$/;
const SUSTAINED = /sustain|vibrato|tremolo|arco|organ|accordion|bagpipe|harmonica|bowed|wine glasses|sax (loud|soft)|ocarina$/i;
const SHORT = /staccato|spiccato|pizzicato|short|ghost|muted|fall|buzz/i;
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const noteName = (m) => `${['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'][m % 12]}${Math.floor(m / 12) - 1}`;

function build() {
  const out = [];
  for (const pack of PACKS) {
    if (pack.tier !== 'core') continue;
    const groups = new Map();
    for (const [assetId, label, rootMidi, folder, duration, credit, , licence] of pack.sounds) {
      if (rootMidi == null || PACK_LICENCES[licence] !== 'CC0-1.0') continue;
      const name = label.replace(/^.*? — /, '').replace(NOTE, '');
      if (!groups.has(name)) groups.set(name, { folder, credit: PACK_CREDITS[credit], zones: [] });
      groups.get(name).zones.push({ assetId, rootMidi, duration });
    }
    for (const [name, g] of groups) {
      if (g.zones.length < 3) continue;
      g.zones.sort((a, b) => a.rootMidi - b.rootMidi);
      const longest = Math.max(...g.zones.map((z) => z.duration));
      out.push({
        key: `${pack.id}/${slug(name)}`, name, pack: pack.id, category: pack.title, folder: g.folder, credit: g.credit, licence: 'CC0-1.0',
        zones: g.zones, low: g.zones[0].rootMidi, high: g.zones[g.zones.length - 1].rootMidi,
        range: `${noteName(g.zones[0].rootMidi)}–${noteName(g.zones[g.zones.length - 1].rootMidi)}`,
        sustained: SUSTAINED.test(name) && !SHORT.test(name) && longest >= 1.2,
      });
    }
  }
  return out.sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
}
export const RECORDED_SOUNDS = build();
export const RECORDED_BY_KEY = new Map(RECORDED_SOUNDS.map((s) => [s.key, s]));
export const RECORDED_CATEGORIES = [...new Set(RECORDED_SOUNDS.map((s) => s.category))];
export const RECORDED_LAYERS = ['a', 'b', 'c', 'd'];

// Crossfaded sustain loop over the steady part of the recording, written into the buffer.
function sustainLoop(buffer) {
  const sr = buffer.sampleRate, data = buffer.getChannelData(0), d = buffer.duration;
  const start = Math.floor(Math.max(0.3, d * 0.4) * sr), end = Math.floor((d - 0.25) * sr), fade = Math.min(Math.floor(0.15 * sr), start - 1);
  if (end - start < sr * 0.3 || fade < 64) return null;
  for (let j = 0; j < fade; j++) {
    const x = j / fade;
    data[end - fade + j] = data[end - fade + j] * Math.cos((x * Math.PI) / 2) + data[start - fade + j] * Math.sin((x * Math.PI) / 2);
  }
  return { start: start / sr, end: end / sr };
}

// The pitch a recording actually sounds at, as a MIDI note (may be fractional), or null when
// it has no clear pitch. Normalised autocorrelation; the first strong peak is the period.
export function detectMidi(buffer) {
  const sr = buffer.sampleRate, data = buffer.getChannelData(0), n = Math.min(8192, data.length);
  if (n < 2048) return null;
  const from = Math.max(0, Math.min(data.length - n, Math.floor(sr * 0.12))), minLag = Math.max(2, Math.floor(sr / 4200)), maxLag = Math.min(Math.floor(sr / 27), n >> 1), span = n - maxLag;
  const nsdf = new Float32Array(maxLag + 1);
  for (let lag = minLag; lag <= maxLag; lag++) {
    let ac = 0, m = 0;
    for (let i = 0; i < span; i++) { const a = data[from + i], b = data[from + i + lag]; ac += a * b; m += a * a + b * b; }
    nsdf[lag] = m > 0 ? (2 * ac) / m : 0;
  }
  let lag = minLag;
  while (lag <= maxLag && nsdf[lag] > 0) lag++; // leave the lobe around zero lag
  let top = 0; for (let k = lag; k <= maxLag; k++) top = Math.max(top, nsdf[k]);
  if (top < 0.5) return null;
  for (let k = Math.max(lag, minLag + 1); k < maxLag; k++) {
    if (nsdf[k] >= 0.9 * top && nsdf[k] >= nsdf[k - 1] && nsdf[k] >= nsdf[k + 1]) {
      const a = nsdf[k - 1], b = nsdf[k], c = nsdf[k + 1], shift = a - 2 * b + c ? (0.5 * (a - c)) / (a - 2 * b + c) : 0;
      return 69 + 12 * Math.log2(sr / (k + shift) / 440);
    }
  }
  return null;
}
// Source libraries disagree on whether middle C is "C3" or "C4", so a catalogue root can be an
// octave away from where a recording sounds. The shipped catalogue has been corrected with
// tools/pack-root-audit.mjs; this check stays as a guard for packs added or regenerated later.
// It trusts the catalogue's note name and takes only the octave from the recording.
export function trueRoot(catalogueRoot, buffer) {
  const heard = detectMidi(buffer);
  if (heard == null) return catalogueRoot;
  const octaves = Math.round((heard - catalogueRoot) / 12);
  return Math.abs(heard - (catalogueRoot + 12 * octaves)) <= 0.7 && Math.abs(octaves) <= 2 ? catalogueRoot + 12 * octaves : catalogueRoot;
}

const MAX_LOADED = 32; // about 60 MiB of decoded audio at most
const loaded = new Map(), loading = new Map();
const shim = { createBuffer: (channels, length, sampleRate) => new AudioBuffer({ numberOfChannels: channels, length, sampleRate }) };

// The decoded instrument if it is in memory, else null. Never waits.
export function recordedReady(key) {
  const entry = loaded.get(key);
  if (entry) { loaded.delete(key); loaded.set(key, entry); } // keep recently used sounds
  return entry || null;
}
// Loads and decodes one instrument. Joins a load already running.
export function loadRecordedSound(key, context, options = {}) {
  const ready = recordedReady(key);
  if (ready) return Promise.resolve(ready);
  if (loading.has(key)) return loading.get(key);
  const sound = RECORDED_BY_KEY.get(key);
  if (!sound) return Promise.reject(new Error('This recorded sound is not in the installed sample packs.'));
  const job = (async () => {
    const zones = [];
    for (const zone of sound.zones) {
      const { audioBuffer } = await loadPackAudio({ type: 'pack', value: `${sound.pack}/${zone.assetId}` }, context || shim, options);
      zones.push({ rootMidi: trueRoot(zone.rootMidi, audioBuffer), catalogueRoot: zone.rootMidi, buffer: audioBuffer, loop: sound.sustained ? sustainLoop(audioBuffer) : null });
    }
    // One octave decision for the whole instrument: a library names all its notes the same way,
    // and a single odd reading (a bell, a very high note) should not move one zone on its own.
    const votes = new Map();
    for (const z of zones) { const shift = z.rootMidi - z.catalogueRoot; votes.set(shift, (votes.get(shift) || 0) + 1); }
    const octave = [...votes].sort((x, y) => y[1] - x[1] || Math.abs(x[0]) - Math.abs(y[0]))[0][0];
    for (const z of zones) z.rootMidi = z.catalogueRoot + octave;
    zones.sort((x, y) => x.rootMidi - y.rootMidi);
    const entry = { key, sound, zones, octave, low: zones[0].rootMidi, high: zones[zones.length - 1].rootMidi };
    loaded.set(key, entry);
    while (loaded.size > MAX_LOADED) loaded.delete(loaded.keys().next().value);
    return entry;
  })().finally(() => loading.delete(key));
  loading.set(key, job);
  return job;
}
export const recordedZone = (entry, pitch) => entry.zones.reduce((best, z) => (Math.abs(z.rootMidi - pitch) < Math.abs(best.rootMidi - pitch) ? z : best), entry.zones[0]);
export function clearRecordedCache() { loaded.clear(); }
export const recordedCacheStats = () => ({ loaded: loaded.size, loading: loading.size });

// The recorded sounds a project's VALORIUM instruments use.
export function recordedKeysOf(project) {
  const keys = new Set();
  for (const instrument of project?.instruments || []) {
    if (instrument?.synthId !== 'valorium') continue;
    for (const l of RECORDED_LAYERS) { const key = instrument.sampleInstrument?.recorded?.[l]; if (typeof key === 'string' && RECORDED_BY_KEY.has(key)) keys.add(key); }
  }
  return [...keys];
}
// Start loading whatever the project needs. Failures are kept for the caller, not thrown.
export function prefetchRecorded(project, context) {
  return Promise.all(recordedKeysOf(project).map((key) => loadRecordedSound(key, context).then(() => null, (error) => ({ key, error }))));
}
// For export: everything must be in memory before notes are scheduled.
export async function prepareRecorded(project, context, options) {
  for (const key of recordedKeysOf(project)) {
    try { await loadRecordedSound(key, context, options); }
    catch (error) { throw new Error(`VALORIUM sound "${RECORDED_BY_KEY.get(key)?.name || key}" could not be loaded: ${error.message}`); }
  }
}
