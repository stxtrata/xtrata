// state.js — central store with pub/sub. Single source of truth for the project.
//
// Project model (v3, see region-model.js): a pool of samples, channels that are mixer strips with
// a default sample, and per-sequence regions. The old per-channel sample fields (source, trim,
// pitch, …) still read and write as a view of the channel's default sample, and the step grid is a
// lens over the regions, so editors written for "one sample per channel, 64 steps" keep working.

export const NUM_CHANNELS = 16; // default channel count
export const MAX_CHANNELS = 64;
export const NUM_INSTRUMENTS = 4;
export const NUM_STEPS = 64;
export const MAX_SEQUENCES = 64;

export const CHANNEL_COLORS = [
  "#ff4d4d",
  "#ff9f43",
  "#feca57",
  "#a3e635",
  "#2edb84",
  "#22d3ee",
  "#54a0ff",
  "#818cf8",
  "#c084fc",
  "#f472b6",
  "#fb7185",
  "#f97316",
  "#10b981",
  "#06b6d4",
  "#8b5cf6",
  "#e879f9",
];

import {
  SAMPLE_FIELDS,
  addSample as poolAddSample,
  bindChannel,
  cellRegions,
  cellValue,
  clampPos,
  collectUnusedSamples,
  ensureDefaultSample,
  invalidatePool,
  newId,
  REGION_OVERRIDES,
  rowToRegions,
  sampleById as poolSampleById,
  sortRegions,
  stepValueToRegionProps,
  toRegionModel,
} from "./region-model.js";

// A channel is a mixer strip: name, colour, level, mute/solo and plugin chains (see plugins.js;
// signal order fader → inserts → fx, each a list of { id, type, enabled, params }).
// `defaultSample` is the pool entry a click on an empty lane or grid cell adds.
export function makeChannel(i) {
  return {
    name: `Channel ${i + 1}`,
    color: CHANNEL_COLORS[i % CHANNEL_COLORS.length],
    volume: 0.9,
    mute: false,
    solo: false,
    inserts: [],
    fx: [],
    defaultSample: null,
  };
}

// The pre-region (v2) shapes. Only the importers of old formats build these (legacy Audional
// presets and songs); store.loadProject migrates them into the pool-and-regions model.
export function makeLegacyChannel(i) {
  return {
    name: `Channel ${i + 1}`,
    color: CHANNEL_COLORS[i % CHANNEL_COLORS.length],
    source: null, // { type: 'ordinal'|'xtrata'|'url'|'file', value: string }
    sampleName: "",
    volume: 0.9,
    pitch: 1, // playbackRate
    reverse: false,
    mute: false,
    solo: false,
    trimStart: 0, // 0..1 fraction of buffer
    trimEnd: 1,
    inserts: [],
    fx: [],
  };
}
// A project in the pre-region shape: channels that own their sample, sequences with step rows.
// Importers of old formats start from this; store.loadProject migrates it.
export function makeLegacyProject() {
  const p = makeProject();
  delete p.samples;
  delete p.nextId;
  p.channels = Array.from({ length: NUM_CHANNELS }, (_, i) => makeLegacyChannel(i));
  p.sequences = [makeLegacySequence()];
  return p;
}
export function makeLegacySequence(numChannels = NUM_CHANNELS) {
  // steps[ch][step] = 0 (off) | 1 (on) | 2 (accent) | object { v:1|2, rev?, trimStart?, trimEnd?, pitch?, off? }
  return {
    steps: Array.from({ length: numChannels }, () => new Array(NUM_STEPS).fill(0)),
    notes: Array.from({ length: NUM_INSTRUMENTS }, () => []),
  };
}

export function makeSequence(numChannels = NUM_CHANNELS) {
  // regions[ch] = [{ id, sample, pos (16ths, fractional), v (1|2), …overrides }] sorted by pos.
  // Overrides (rev, trimStart, trimEnd, pitch, xfade, gateSteps, …) fall back to the sample's.
  // notes[i] = array of { step, dur (steps), pitch (midi), vel (0..1, >1 = accent) }
  return {
    regions: Array.from({ length: numChannels }, () => []),
    notes: Array.from({ length: NUM_INSTRUMENTS }, () => []),
  };
}

// A fresh project gives each synth channel its own character voice (see synths.js).
const DEFAULT_SYNTHS = [
  ["jims10", "jiMS10"],
  ["fm4", "Coinbase"],
  ["vox", "Gm"],
  ["pluck", "Taproot"],
];

export function makeInstrument(i) {
  const [synthId, name] = DEFAULT_SYNTHS[i] || DEFAULT_SYNTHS[0];
  return {
    name,
    synthId,
    params: null, // null = use synth defaults; object = overrides
    volume: 0.8,
    mute: false,
    solo: false,
    inserts: [], // same plugin chains as sample channels
    fx: [],
  };
}

export function makeProject() {
  const project = {
    projectName: "Untitled",
    artistName: "",
    bpm: 120,
    swing: 0, // 0..60 (% of step delay applied to off-beats)
    masterVolume: 0.9,
    continuous: true,
    choke: false, // new trigger cuts the previous one on the same channel
    fadeMs: 15, // crossfade length used when choking (ms)
    currentSequence: 0,
    channels: Array.from({ length: NUM_CHANNELS }, (_, i) => makeChannel(i)),
    instruments: Array.from({ length: NUM_INSTRUMENTS }, (_, i) =>
      makeInstrument(i),
    ),
    samples: [], // the sample pool (see region-model.js)
    nextId: 0,
    sequences: [makeSequence()],
  };
  return toRegionModel(project); // binds the channels' view of their default sample
}

class Store {
  constructor() {
    this.project = makeProject();
    this.settings = {
      ordinalsGateway: "https://ordinals.com/content/",
      xtrataGateway:
        "/runtime/content?network=mainnet&contractId=SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3&fallbackContractId=SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v2-1-0&tokenId={id}",
      autosave: true,
    };
    this._subs = {};
    this.regionRev = 0; // bumped on every region change; the engine's step index follows it
  }

  on(event, fn) {
    (this._subs[event] ||= []).push(fn);
    return () => {
      this._subs[event] = this._subs[event].filter((f) => f !== fn);
    };
  }

  emit(event, payload) {
    (this._subs[event] || []).forEach((fn) => fn(payload));
    if (event !== "dirty") this.emit("dirty");
  }

  // --- convenience accessors ---
  get seq() {
    return this.project.sequences[this.project.currentSequence];
  }
  get numChannels() {
    return this.project.channels.length;
  }
  channel(i) {
    return this.project.channels[i];
  }

  addChannel() {
    if (this.numChannels >= MAX_CHANNELS) return false;
    this.project.channels.push(
      bindChannel(this.project, makeChannel(this.numChannels)),
    );
    this.project.sequences.forEach((seq) => seq.regions.push([]));
    this.regionRev++;
    this.emit("channels");
    return true;
  }

  removeChannel() {
    if (this.numChannels <= 1) return false;
    this.project.channels.pop();
    this.project.sequences.forEach((seq) => seq.regions.pop());
    collectUnusedSamples(this.project);
    this.regionRev++;
    this.emit("channels");
    return true;
  }
  instrument(i) {
    return this.project.instruments[i];
  }

  setInstrumentProp(i, prop, value) {
    this.instrument(i)[prop] = value;
    this.emit("instrument", { i, prop, value });
  }

  addNote(i, note) {
    this.seq.notes[i].push(note);
    this.emit("notes", i);
  }

  removeNote(i, idx) {
    this.seq.notes[i].splice(idx, 1);
    this.emit("notes", i);
  }

  clearNotes(i) {
    this.seq.notes[i] = [];
    this.emit("notes", i);
  }

  setNotes(i, notes) {
    this.seq.notes[i] = notes;
    this.emit("notes", i);
  }

  // --- samples (the pool) ---
  sampleById(id) {
    return poolSampleById(this.project, id);
  }
  // The channel's default sample, or null while the channel has none yet.
  sampleOf(ch) {
    return poolSampleById(this.project, this.channel(ch)?.defaultSample);
  }
  addSample(props = {}) {
    const sample = poolAddSample(this.project, props);
    this.emit("samples", { id: sample.id });
    return sample.id;
  }
  setSampleProp(id, prop, value) {
    const sample = this.sampleById(id);
    if (!sample) return;
    sample[prop] = value;
    this.emit("samples", { id, prop, value });
  }
  setChannelDefaultSample(ch, id) {
    this.channel(ch).defaultSample = id;
    this.emit("channel", { ch, prop: "defaultSample", value: id });
  }

  // --- regions ---
  // Every region mutation goes through here so the engine's per-step index rebuilds on the next
  // tick, listeners hear one "regions" event, and the step grid (a lens over the regions) keeps
  // getting the per-cell "step" events it always had.
  _regionsChanged(ch, seqIndex, steps = [], quiet = false) {
    this.regionRev++;
    if (quiet) return; // the caller announces the change itself (e.g. one "sequence" event)
    this.emit("regions", { ch, seq: seqIndex });
    if (seqIndex === this.project.currentSequence)
      for (const step of new Set(steps)) {
        if (step < 0 || step >= NUM_STEPS) continue;
        this.emit("step", { ch, step, val: this.stepAt(ch, step) });
      }
  }
  regions(ch, seq = this.seq) {
    return seq.regions[ch] || (seq.regions[ch] = []);
  }
  findRegion(id, seq = this.seq) {
    for (let ch = 0; ch < seq.regions.length; ch++) {
      const region = seq.regions[ch].find((r) => r.id === id);
      if (region) return { ch, region };
    }
    return null;
  }
  // Adds a region of `props.sample` (default: the channel's default sample) at props.pos.
  addRegion(ch, props = {}, seqIndex = this.project.currentSequence) {
    const seq = this.project.sequences[seqIndex];
    const sample = props.sample ?? ensureDefaultSample(this.project, this.channel(ch)).id;
    const region = { v: 1, ...props, id: newId(this.project, "r"), sample };
    region.pos = clampPos(+region.pos || 0);
    const row = this.regions(ch, seq);
    row.push(region);
    sortRegions(row);
    this._regionsChanged(ch, seqIndex, [Math.floor(region.pos)]);
    return region;
  }
  // props: any region field; a null or undefined value removes that override.
  setRegionProps(ch, id, props) {
    const seqIndex = this.project.currentSequence;
    const row = this.regions(ch);
    const region = row.find((r) => r.id === id);
    if (!region) return null;
    const touched = [Math.floor(region.pos)];
    for (const [k, v] of Object.entries(props)) {
      if (k === "id" || k === "sample" || k === "pos") region[k] = k === "pos" ? clampPos(+v || 0) : v;
      else if (v == null) delete region[k];
      else region[k] = v;
    }
    if (props.pos != null) sortRegions(row);
    this._syncWordSelection(ch, region);
    touched.push(Math.floor(region.pos));
    this._regionsChanged(ch, seqIndex, touched);
    return region;
  }
  removeRegion(ch, id) {
    const seqIndex = this.project.currentSequence;
    const row = this.regions(ch);
    const at = row.findIndex((r) => r.id === id);
    if (at < 0) return false;
    const [gone] = row.splice(at, 1);
    this._regionsChanged(ch, seqIndex, [Math.floor(gone.pos)]);
    return true;
  }
  // Moves a region in time (pos) and/or to another channel (toCh).
  moveRegion(ch, id, { pos, toCh = ch } = {}) {
    const seqIndex = this.project.currentSequence;
    const from = this.regions(ch);
    const at = from.findIndex((r) => r.id === id);
    if (at < 0 || toCh < 0 || toCh >= this.numChannels) return false;
    const [region] = from.splice(at, 1);
    const touched = [Math.floor(region.pos)];
    if (pos != null) region.pos = clampPos(+pos || 0);
    const to = this.regions(toCh);
    to.push(region);
    sortRegions(to);
    touched.push(Math.floor(region.pos));
    this._regionsChanged(ch, seqIndex, touched);
    if (toCh !== ch) this._regionsChanged(toCh, seqIndex, touched);
    return true;
  }
  // Sets the position of several regions at once (a group drag or nudge). moves: [{ ch, id, pos }].
  // quiet = change the data and let the engine follow, but announce nothing: a drag calls this
  // on every mouse move and calls announceRegions once when it settles.
  placeRegions(moves, { quiet = false } = {}) {
    const touched = new Map();
    for (const m of moves) {
      const region = this.regions(m.ch).find((r) => r.id === m.id);
      if (!region) continue;
      const steps = touched.get(m.ch) || touched.set(m.ch, []).get(m.ch);
      steps.push(Math.floor(region.pos));
      region.pos = clampPos(+m.pos || 0);
      steps.push(Math.floor(region.pos));
    }
    for (const ch of touched.keys()) sortRegions(this.regions(ch));
    this.regionRev++;
    if (!quiet) for (const [ch, steps] of touched) this._regionsChanged(ch, this.project.currentSequence, steps);
    return touched;
  }
  // Tells listeners (step grid, history, autosave) that regions of `ch` changed at `steps`.
  announceRegions(ch, steps = []) {
    this._regionsChanged(ch, this.project.currentSequence, steps);
  }
  clearChannelRegions(ch, seqIndex = this.project.currentSequence, { quiet = false } = {}) {
    const seq = this.project.sequences[seqIndex];
    const old = this.regions(ch, seq).map((r) => Math.floor(r.pos));
    seq.regions[ch] = [];
    this._regionsChanged(ch, seqIndex, old, quiet);
  }
  // Writes a legacy 64-step row (0 | 1 | 2 | { v, …overrides, off }) as regions of `sampleId`
  // (default: the channel's default sample), replacing the channel's regions in that sequence.
  // The beat generators still emit step rows, so every beat goes through here.
  writePattern(ch, row, { seqIndex = this.project.currentSequence, sampleId, quiet = false } = {}) {
    const seq = this.project.sequences[seqIndex];
    const id = sampleId ?? ensureDefaultSample(this.project, this.channel(ch)).id;
    const old = this.regions(ch, seq).map((r) => Math.floor(r.pos));
    seq.regions[ch] = sortRegions(rowToRegions(this.project, row, id));
    this._regionsChanged(ch, seqIndex, [...old, ...seq.regions[ch].map((r) => Math.floor(r.pos))], quiet);
  }

  // --- the step grid: a lens over the regions ---
  // 0 | 1 | 2 | { v, …overrides, off? }: what a grid cell shows. A cell holding several regions is
  // on when any is, accented when any is accented, and carries the first region's overrides.
  stepAt(ch, step, seq = this.seq) {
    return cellValue(seq.regions[ch] || [], step);
  }
  cellRegions(ch, step, seq = this.seq) {
    return cellRegions(seq.regions[ch] || [], step);
  }

  // `seq` defaults to the current sequence; importers pass the one they were started on.
  setStep(ch, step, val, seq = this.seq) {
    const seqIndex = this.project.sequences.indexOf(seq);
    const row = this.regions(ch, seq);
    const here = cellRegions(row, step);
    const sample = here[0]?.sample;
    for (const r of here) row.splice(row.indexOf(r), 1);
    if (stepVal(val)) {
      const region = {
        id: newId(this.project, "r"),
        sample: sample ?? ensureDefaultSample(this.project, this.channel(ch)).id,
        ...stepValueToRegionProps(val, step),
      };
      row.push(region);
      sortRegions(row);
    }
    this._regionsChanged(ch, seqIndex, [step]);
  }

  cycleStep(ch, step, accent = false) {
    const cur = stepVal(this.stepAt(ch, step));
    const next = accent ? (cur === 2 ? 0 : 2) : cur ? 0 : 1;
    this.setStep(ch, step, next);
  }

  // Merge per-step property overrides; creates the step (v 1) if the cell is empty.
  // props: v, off (fraction of a step), and any region override; null/undefined clears one.
  setStepProps(ch, step, props) {
    const seqIndex = this.project.currentSequence;
    const row = this.regions(ch);
    let region = cellRegions(row, step)[0];
    if (!region) {
      region = {
        id: newId(this.project, "r"),
        sample: ensureDefaultSample(this.project, this.channel(ch)).id,
        v: 1,
        pos: step,
      };
      row.push(region);
    }
    for (const [k, v] of Object.entries(props)) {
      if (k === "off") region.pos = step + Math.min(Math.max(+v || 0, 0), 0.999);
      else if (k === "v") region.v = v || 1;
      else if (v == null) delete region[k];
      else region[k] = v;
    }
    sortRegions(row);
    this._syncWordSelection(ch, region);
    this._regionsChanged(ch, seqIndex, [step]);
  }
  // A word selection mirrors the trim it was cut with; keep its seconds in step with the trim.
  _syncWordSelection(ch, region) {
    const sample = poolSampleById(this.project, region.sample) || this.channel(ch);
    const duration = sample.analysis?.duration;
    if (region.wordSelection && Number.isFinite(duration))
      region.wordSelection = {
        ...region.wordSelection,
        start: (region.trimStart ?? sample.trimStart) * duration,
        end: (region.trimEnd ?? sample.trimEnd) * duration,
      };
  }

  toggleStepReverse(ch, step) {
    const region = cellRegions(this.regions(ch), step)[0];
    if (!region) return;
    this.setRegionProps(ch, region.id, { rev: !region.rev });
  }

  setChannelProp(ch, prop, value) {
    this.channel(ch)[prop] = value;
    const c = this.channel(ch);
    if (
      c.wordSelection &&
      ["trimStart", "trimEnd"].includes(prop) &&
      Number.isFinite(c.analysis?.duration)
    )
      c.wordSelection = {
        ...c.wordSelection,
        start: c.trimStart * c.analysis.duration,
        end: c.trimEnd * c.analysis.duration,
      };
    this.emit("channel", { ch, prop, value });
  }

  setProjectProp(prop, value) {
    this.project[prop] = value;
    this.emit("project", { prop, value });
  }

  selectSequence(i) {
    while (
      this.project.sequences.length <= i &&
      this.project.sequences.length < MAX_SEQUENCES
    ) {
      this.project.sequences.push(makeSequence(this.numChannels));
    }
    i = Math.max(0, Math.min(i, this.project.sequences.length - 1));
    this.project.currentSequence = i;
    this.emit("sequence", i);
  }

  clearSequence() {
    this.project.sequences[this.project.currentSequence] = makeSequence(
      this.numChannels,
    );
    this.regionRev++;
    this.emit("sequence", this.project.currentSequence);
  }

  // Sequence clipboard. Pasting into the same project keeps each region's sample; pasting into
  // another project (the pool ids mean something else there) plays the channel's own sample.
  copySequence() {
    return { project: this.project, data: JSON.parse(JSON.stringify(this.seq)) };
  }
  pasteSequence(clip) {
    const seq = makeSequence(this.numChannels);
    seq.notes = JSON.parse(JSON.stringify(clip.data.notes || seq.notes));
    const same = clip.project === this.project;
    (clip.data.regions || []).slice(0, this.numChannels).forEach((row, ch) => {
      seq.regions[ch] = row.map((r) => ({
        ...r,
        id: newId(this.project, "r"),
        sample:
          same && this.sampleById(r.sample)
            ? r.sample
            : ensureDefaultSample(this.project, this.channel(ch)).id,
      }));
    });
    this.project.sequences[this.project.currentSequence] = seq;
    this.regionRev++;
    this.emit("sequence", this.project.currentSequence);
  }

  clearChannelPattern(ch) {
    this.seq.regions[ch] = [];
    this.regionRev++;
    this.emit("sequence", this.project.currentSequence);
  }

  // Auto-pattern cycle (from the original patternSelectionButtons.js):
  // 1 = all steps, 2 = every 2nd, 3 = every 4th, 4 = every 8th, 5 = every 16th, 0 = clear.
  // Replaces the channel's regions with default-sample regions on that grid.
  applyAutoPattern(ch, mode) {
    const div = { 1: 1, 2: 2, 3: 4, 4: 8, 5: 16 }[mode];
    const row = new Array(NUM_STEPS).fill(0);
    for (let i = 0; i < NUM_STEPS; i++) row[i] = div && i % div === 0 ? 1 : 0;
    const sample = div ? ensureDefaultSample(this.project, this.channel(ch)).id : null;
    this.seq.regions[ch] = div ? sortRegions(rowToRegions(this.project, row, sample)) : [];
    this.regionRev++;
    this.emit("sequence", this.project.currentSequence);
  }

  // Moves every region one 16th left or right, wrapping round the sequence.
  shiftChannelPattern(ch, dir) {
    const row = this.seq.regions[ch] || [];
    for (const r of row) r.pos = (r.pos + (dir > 0 ? 1 : -1) + NUM_STEPS) % NUM_STEPS;
    sortRegions(row);
    this.regionRev++;
    this.emit("sequence", this.project.currentSequence);
  }

  // `restore` marks an undo/redo step: listeners may keep decoded audio alive
  // when the channel sources did not change (see main.js).
  loadProject(project, { restore = false } = {}) {
    const previous = this.project;
    // One boundary for every way a project arrives (files, autosave, undo snapshots, legacy
    // songs): v2 projects are migrated to the pool-and-regions model, v3 ones get their
    // channels' default-sample view attached.
    this.project = toRegionModel(project);
    invalidatePool(this.project);
    this.regionRev++;
    this.emit("load", { restore, previous });
  }
}

// Helpers for mixed int/object step values (the grid lens and the v2 importers speak these).
export const stepVal = (s) => (s && typeof s === "object" ? s.v || 1 : s || 0);
export const stepObj = (s) => (s && typeof s === "object" ? s : null);
// Same step value with its fractional offset set (0 clears it). Plain 0/1/2 steps stay
// plain when no other per-step settings are present.
export function withStepOff(raw, off) {
  const next = typeof raw === "object" && raw ? { ...raw } : { v: raw || 1 };
  if (off > 0) next.off = off;
  else delete next.off;
  return Object.keys(next).length === 1 ? next.v : next;
}
// Fractional start offset inside a step: 0 (on the grid) .. just under 1 step.
export const stepOff = (s) =>
  s && typeof s === "object" && Number.isFinite(s.off) && s.off > 0
    ? Math.min(s.off, 0.999)
    : 0;

export const store = new Store();
