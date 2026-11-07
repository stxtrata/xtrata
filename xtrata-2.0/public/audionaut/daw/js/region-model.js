// region-model.js — Plan B: the sample pool and regions.
//
// Before: a channel owned one sample (source, trim, pitch, …) and every sequence stored a 64-step
// row per channel, so a channel could only ever play that one sample on a 16th grid.
//
// Now:
//   project.samples            the pool: { id, source, sampleName, soundMetadata, clipSnapshot,
//                              wordSelection, sampleMidi, gateSteps, trimStart, trimEnd, pitch,
//                              reverse, … }. What a channel used to hold, minus the mixer settings.
//   channel.defaultSample      pool id a click on an empty lane / grid cell adds. The channel's
//                              mixer settings (name, colour, volume, mute, solo, plugin chains)
//                              stay on the channel, as on a Logic track.
//   sequence.regions[ch]       array sorted by pos: { id, sample, pos, v, …overrides }.
//                              pos is in 16ths (fractional); 0 <= pos < 64. It replaces both the
//                              step index and the old fractional `off`. Overrides (rev, trimStart,
//                              trimEnd, pitch, xfade, gateSteps, sampleMidi, wordSelection) are
//                              optional and fall back to the sample's defaults, exactly as a step's
//                              overrides fell back to its channel.
//
// This file is pure data logic with no imports from the app, so it can be tested on its own.
// `toRegionModel` is the one migration boundary: it turns any v2 project (channels that own
// samples, sequences with steps) into the v3 shape. `bindChannel` keeps the familiar
// channel.trimStart / .source / .pitch … properties working as a view of the default sample, so
// the editors that edit "the channel's sample" keep working while regions can point elsewhere.

export const SAMPLE_FIELDS = [
  "source",
  "sampleName",
  "soundMetadata",
  "clipSnapshot",
  "wordSelection",
  "sampleMidi",
  "gateSteps",
  "unresolvedSource",
  "analysis",
  "trimStart",
  "trimEnd",
  "pitch",
  "reverse",
];
const FIELD_DEFAULTS = {
  source: null,
  sampleName: "",
  soundMetadata: null,
  clipSnapshot: null,
  wordSelection: null,
  sampleMidi: null,
  gateSteps: 0,
  unresolvedSource: null,
  analysis: undefined,
  trimStart: 0,
  trimEnd: 1,
  pitch: 1,
  reverse: false,
};
export const sampleDefault = (field) => FIELD_DEFAULTS[field];
// Per-region overrides, same names the old per-step objects used.
export const REGION_OVERRIDES = [
  "rev",
  "trimStart",
  "trimEnd",
  "pitch",
  "xfade",
  "gateSteps",
  "sampleMidi",
  "wordSelection",
];
export const NUM_STEPS_PER_SEQUENCE = 64;
const MAX_OFF = 0.999;

export function blankSample(id) {
  const s = { id };
  for (const f of SAMPLE_FIELDS) if (FIELD_DEFAULTS[f] !== undefined) s[f] = FIELD_DEFAULTS[f];
  return s;
}

// ---- ids. One counter per project keeps ids unique across undo snapshots and saved files.
export function newId(project, prefix) {
  const n = (project.nextId = (project.nextId || 0) + 1);
  return `${prefix}${n.toString(36)}`;
}

// ---- pool lookup (cached per pool array; store mutators call invalidatePool)
const poolIndex = new WeakMap();
export function invalidatePool(project) {
  if (project?.samples) poolIndex.delete(project.samples);
}
export function sampleById(project, id) {
  if (!id || !project?.samples) return null;
  let map = poolIndex.get(project.samples);
  if (!map || map.size !== project.samples.length) {
    map = new Map(project.samples.map((s) => [s.id, s]));
    poolIndex.set(project.samples, map);
  }
  return map.get(id) || null;
}
export function addSample(project, props = {}) {
  const sample = { ...blankSample(newId(project, "s")), ...props };
  if (props.id) sample.id = props.id;
  project.samples.push(sample);
  invalidatePool(project);
  return sample;
}
// The channel's default sample, created empty on first need.
export function ensureDefaultSample(project, channel) {
  let sample = sampleById(project, channel.defaultSample);
  if (!sample) {
    sample = addSample(project);
    channel.defaultSample = sample.id;
  }
  return sample;
}
export function isBlankSample(s) {
  if (!s) return true;
  for (const f of SAMPLE_FIELDS) {
    if (f === "analysis") {
      if (s.analysis) return false;
    } else if (JSON.stringify(s[f] ?? FIELD_DEFAULTS[f]) !== JSON.stringify(FIELD_DEFAULTS[f])) return false;
  }
  return true;
}
// Pool entries nothing refers to any more (no channel default, no region in any sequence).
export function collectUnusedSamples(project) {
  const used = new Set();
  for (const c of project.channels) if (c.defaultSample) used.add(c.defaultSample);
  for (const seq of project.sequences)
    for (const row of seq.regions || []) for (const r of row) used.add(r.sample);
  const before = project.samples.length;
  project.samples = project.samples.filter((s) => used.has(s.id));
  if (project.samples.length !== before) invalidatePool(project);
  return before - project.samples.length;
}

// ---- channel view of the default sample
// Reading channel.trimStart gives the default sample's trimStart (or the stock default when the
// channel has no sample yet); writing creates the default sample on demand. The properties are
// non-enumerable, so JSON, structuredClone and Object.keys see only the mixer settings.
export function bindChannel(project, channel) {
  for (const f of SAMPLE_FIELDS) {
    if (Object.getOwnPropertyDescriptor(channel, f)?.get) continue;
    Object.defineProperty(channel, f, {
      configurable: true,
      enumerable: false,
      get() {
        const s = sampleById(project, channel.defaultSample);
        return s ? s[f] : FIELD_DEFAULTS[f];
      },
      set(value) {
        ensureDefaultSample(project, channel)[f] = value;
      },
    });
  }
  return channel;
}

// ---- regions
const byPos = (a, b) => a.pos - b.pos || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
export function sortRegions(row) {
  row.sort(byPos);
  return row;
}
const clampPos = (pos) => Math.max(0, Math.min(NUM_STEPS_PER_SEQUENCE - 1e-6, pos));
export const stepOfPos = (pos) => Math.floor(pos);
export const fractionOfPos = (pos) => pos - Math.floor(pos);

// The 0 | 1 | 2 | { v, …overrides, off? } value the step grid and the step editor speak.
export function regionToStepValue(region) {
  const frac = fractionOfPos(region.pos);
  const props = {};
  for (const k of REGION_OVERRIDES) if (region[k] != null) props[k] = region[k];
  if (frac > 0) props.off = Math.min(frac, MAX_OFF);
  if (!Object.keys(props).length) return region.v === 2 ? 2 : 1;
  return { v: region.v || 1, ...props };
}
// One step-grid value (1 | 2 | object) at integer `step` becomes region fields.
export function stepValueToRegionProps(raw, step) {
  const o = raw && typeof raw === "object" ? raw : null;
  const out = { v: (o ? o.v || 1 : raw) || 1, pos: step };
  if (o) {
    for (const k of REGION_OVERRIDES) if (o[k] != null) out[k] = o[k];
    if (Number.isFinite(o.off) && o.off > 0) out.pos = step + Math.min(o.off, MAX_OFF);
  }
  return out;
}
// Build the regions of one 64-step row.
export function rowToRegions(project, row, sampleId) {
  const out = [];
  row.forEach((raw, step) => {
    if (!raw) return;
    out.push({ id: newId(project, "r"), sample: sampleId, ...stepValueToRegionProps(raw, step) });
  });
  return out;
}
export function cellRegions(row, step) {
  return row.filter((r) => Math.floor(r.pos) === step);
}
// 0 | 1 | 2 | object for a grid cell: accent when any region there is accented, the object form
// carries the first region's overrides. (A cell with two regions is the "corner mark" case.)
export function cellValue(row, step) {
  const here = cellRegions(row, step);
  if (!here.length) return 0;
  const v = regionToStepValue(here[0]);
  if (here.some((r) => r.v === 2)) return typeof v === "object" ? { ...v, v: 2 } : 2;
  return v;
}

// ---- v2 -> v3
export const isRegionModel = (project) => Array.isArray(project?.samples);

export function toRegionModel(project) {
  if (isRegionModel(project)) {
    for (const c of project.channels) bindChannel(project, c);
    return project;
  }
  project.samples = [];
  project.nextId = project.nextId || 0;
  const rowsUse = new Map();
  project.sequences.forEach((seq) => {
    (seq.steps || []).forEach((row, ch) => {
      if (row.some((v) => v)) rowsUse.set(ch, true);
    });
  });
  project.channels.forEach((c, ch) => {
    const sample = blankSample(newId(project, "s"));
    let any = false;
    for (const f of SAMPLE_FIELDS) {
      if (!(f in c)) continue;
      const own = Object.getOwnPropertyDescriptor(c, f);
      const value = own && "value" in own ? own.value : c[f];
      if (value !== undefined) sample[f] = value;
      delete c[f];
    }
    any = !isBlankSample(sample);
    if (any || rowsUse.has(ch)) {
      project.samples.push(sample);
      c.defaultSample = sample.id;
    } else c.defaultSample = null;
  });
  invalidatePool(project);
  for (const seq of project.sequences) {
    seq.regions = project.channels.map((c, ch) => sortRegions(rowToRegions(project, seq.steps?.[ch] || [], c.defaultSample)));
    delete seq.steps;
  }
  for (const c of project.channels) bindChannel(project, c);
  return project;
}

// Grid rows back out of regions (for tools that still want the 64-step array: previews, tests).
export function regionsToRow(row) {
  const out = new Array(NUM_STEPS_PER_SEQUENCE).fill(0);
  for (const r of row) {
    const s = Math.floor(r.pos);
    if (s >= 0 && s < NUM_STEPS_PER_SEQUENCE && !out[s]) out[s] = regionToStepValue(r);
  }
  return out;
}

export { clampPos };
