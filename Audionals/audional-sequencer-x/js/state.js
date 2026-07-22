// state.js — central store with pub/sub. Single source of truth for the project.

export const NUM_CHANNELS = 16;      // default channel count
export const MAX_CHANNELS = 64;
export const NUM_INSTRUMENTS = 4;
export const NUM_STEPS = 64;
export const MAX_SEQUENCES = 64;

export const CHANNEL_COLORS = [
  '#ff4d4d', '#ff9f43', '#feca57', '#a3e635', '#2edb84', '#22d3ee',
  '#54a0ff', '#818cf8', '#c084fc', '#f472b6', '#fb7185', '#f97316',
  '#10b981', '#06b6d4', '#8b5cf6', '#e879f9'
];

export function makeChannel(i) {
  return {
    name: `Channel ${i + 1}`,
    color: CHANNEL_COLORS[i % CHANNEL_COLORS.length],
    source: null,          // { type: 'ordinal'|'xtrata'|'url'|'file', value: string }
    sampleName: '',
    volume: 0.9,
    pitch: 1,              // playbackRate
    reverse: false,
    mute: false,
    solo: false,
    trimStart: 0,          // 0..1 fraction of buffer
    trimEnd: 1,
    fx: { filter: 'off', cutoff: 8000, drive: 0, delay: 0, reverb: 0 },
    inserts: []            // insert plugin slots: [{ type, enabled, params }]
  };
}

export function makeSequence(numChannels = NUM_CHANNELS) {
  // steps[ch][step] = 0 (off) | 1 (on) | 2 (accent) | object { v:1|2, rev?, trimStart?, trimEnd?, pitch? }
// Object steps carry per-step overrides of the channel's playback settings.
  // notes[i] = array of { step, dur (steps), pitch (midi), vel (0..1, >1 = accent) }
  return {
    steps: Array.from({ length: numChannels }, () => new Array(NUM_STEPS).fill(0)),
    notes: Array.from({ length: NUM_INSTRUMENTS }, () => [])
  };
}

export function makeInstrument(i) {
  return {
    name: `Synth ${i + 1}`,
    synthId: 'jims10',
    params: null,           // null = use synth defaults; object = overrides
    volume: 0.8,
    mute: false,
    solo: false
  };
}

export function makeProject() {
  return {
    projectName: 'Untitled',
    artistName: '',
    bpm: 120,
    swing: 0,              // 0..60 (% of step delay applied to off-beats)
    masterVolume: 0.9,
    continuous: true,
    choke: false,          // new trigger cuts the previous one on the same channel
    fadeMs: 15,            // crossfade length used when choking (ms)
    currentSequence: 0,
    channels: Array.from({ length: NUM_CHANNELS }, (_, i) => makeChannel(i)),
    instruments: Array.from({ length: NUM_INSTRUMENTS }, (_, i) => makeInstrument(i)),
    sequences: [makeSequence()]
  };
}

class Store {
  constructor() {
    this.project = makeProject();
    this.settings = {
      ordinalsGateway: 'https://ordinals.com/content/',
      xtrataGateway: 'https://xtrata.io/api/content/{id}',
      autosave: true
    };
    this._subs = {};
  }

  on(event, fn) {
    (this._subs[event] ||= []).push(fn);
    return () => { this._subs[event] = this._subs[event].filter(f => f !== fn); };
  }

  emit(event, payload) {
    (this._subs[event] || []).forEach(fn => fn(payload));
    if (event !== 'dirty') this.emit('dirty');
  }

  // --- convenience accessors ---
  get seq() { return this.project.sequences[this.project.currentSequence]; }
  get numChannels() { return this.project.channels.length; }
  channel(i) { return this.project.channels[i]; }

  addChannel() {
    if (this.numChannels >= MAX_CHANNELS) return false;
    this.project.channels.push(makeChannel(this.numChannels));
    this.project.sequences.forEach(seq => seq.steps.push(new Array(NUM_STEPS).fill(0)));
    this.emit('channels');
    return true;
  }

  removeChannel() {
    if (this.numChannels <= 1) return false;
    this.project.channels.pop();
    this.project.sequences.forEach(seq => seq.steps.pop());
    this.emit('channels');
    return true;
  }
  instrument(i) { return this.project.instruments[i]; }

  setInstrumentProp(i, prop, value) {
    this.instrument(i)[prop] = value;
    this.emit('instrument', { i, prop, value });
  }

  addNote(i, note) {
    this.seq.notes[i].push(note);
    this.emit('notes', i);
  }

  removeNote(i, idx) {
    this.seq.notes[i].splice(idx, 1);
    this.emit('notes', i);
  }

  clearNotes(i) {
    this.seq.notes[i] = [];
    this.emit('notes', i);
  }

  setNotes(i, notes) {
    this.seq.notes[i] = notes;
    this.emit('notes', i);
  }

  // --- actions ---
  setStep(ch, step, val) {
    this.seq.steps[ch][step] = val;
    this.emit('step', { ch, step, val });
  }

  cycleStep(ch, step, accent = false) {
    const cur = stepVal(this.seq.steps[ch][step]);
    const next = accent ? (cur === 2 ? 0 : 2) : (cur ? 0 : 1);
    this.setStep(ch, step, next);
  }

  // Merge per-step property overrides; creates/upgrades the step to object form.
  setStepProps(ch, step, props) {
    const cur = this.seq.steps[ch][step];
    const base = typeof cur === 'object' && cur ? cur : { v: cur || 1 };
    this.seq.steps[ch][step] = { ...base, ...props };
    this.emit('step', { ch, step, val: this.seq.steps[ch][step] });
  }

  toggleStepReverse(ch, step) {
    const cur = this.seq.steps[ch][step];
    if (!stepVal(cur)) return;
    const obj = typeof cur === 'object' ? cur : { v: cur };
    obj.rev = !obj.rev;
    this.seq.steps[ch][step] = obj;
    this.emit('step', { ch, step, val: obj });
  }

  setChannelProp(ch, prop, value) {
    this.channel(ch)[prop] = value;
    this.emit('channel', { ch, prop, value });
  }

  setProjectProp(prop, value) {
    this.project[prop] = value;
    this.emit('project', { prop, value });
  }

  selectSequence(i) {
    while (this.project.sequences.length <= i && this.project.sequences.length < MAX_SEQUENCES) {
      this.project.sequences.push(makeSequence(this.numChannels));
    }
    i = Math.max(0, Math.min(i, this.project.sequences.length - 1));
    this.project.currentSequence = i;
    this.emit('sequence', i);
  }

  clearSequence() {
    this.project.sequences[this.project.currentSequence] = makeSequence(this.numChannels);
    this.emit('sequence', this.project.currentSequence);
  }

  clearChannelPattern(ch) {
    this.seq.steps[ch].fill(0);
    this.emit('sequence', this.project.currentSequence);
  }

  // Auto-pattern cycle (from the original patternSelectionButtons.js):
  // 1 = all steps, 2 = every 2nd, 3 = every 4th, 4 = every 8th, 5 = every 16th, 0 = clear.
  applyAutoPattern(ch, mode) {
    const row = this.seq.steps[ch];
    const div = { 1: 1, 2: 2, 3: 4, 4: 8, 5: 16 }[mode];
    for (let i = 0; i < NUM_STEPS; i++) row[i] = div && i % div === 0 ? 1 : 0;
    this.emit('sequence', this.project.currentSequence);
  }

  shiftChannelPattern(ch, dir) {
    const row = this.seq.steps[ch];
    if (dir > 0) row.unshift(row.pop()); else row.push(row.shift());
    this.emit('sequence', this.project.currentSequence);
  }

  loadProject(project) {
    this.project = project;
    this.emit('load');
  }
}

// Helpers for mixed int/object step values.
export const stepVal = s => (s && typeof s === 'object') ? (s.v || 1) : (s || 0);
export const stepObj = s => (s && typeof s === 'object') ? s : null;

export const store = new Store();
