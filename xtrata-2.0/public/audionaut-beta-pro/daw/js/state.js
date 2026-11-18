// state.js — central store with pub/sub. Single source of truth for the project.

import { newProjectId, retainAssets } from "./assets.js";
import { normalizeProjectModel, newId, trackAddress, patternClips, MODEL_LIMITS } from "./project-model.js";

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

export function makeChannel(i) {
  return {
    id: newId('sample'), kind: 'sample', pan: 0, inputTrimDb: 0, output: 'master', auxSends: [], armed: false, monitor: true,
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
    // Plugin chains (see plugins.js), signal order fader → inserts → fx.
    // Each is a list of { id, type, enabled, params }.
    inserts: [],
    fx: [],
    // Delay / reverb sends, tapped after the last plugin: { delay?, reverb? } of { amount, enabled }
    sends: {},
  };
}

export function makeSequence(numChannels = NUM_CHANNELS,numInstruments=NUM_INSTRUMENTS) {
  // steps[ch][step] = 0 (off) | 1 (on) | 2 (accent) | object { v:1|2, rev?, trimStart?, trimEnd?, pitch? }
  // Object steps carry per-step overrides of the channel's playback settings.
  // notes[i] = array of { step, dur (steps), pitch (midi), vel (0..1, >1 = accent) }
  return {
    id: newId('pattern'),
    steps: Array.from({ length: numChannels }, () =>
      new Array(NUM_STEPS).fill(0),
    ),
    notes: Array.from({ length: numInstruments }, () => []),
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
    id: newId('instrument'), kind: 'instrument', pan: 0, inputTrimDb: 0, output: 'master', auxSends: [], armed: false, monitor: true,
    name,
    synthId,
    params: null, // null = use synth defaults; object = overrides
    volume: 0.8,
    mute: false,
    solo: false,
    inserts: [], // same plugin chains as sample channels
    fx: [],
    sends: {},
  };
}

export function makeProject() {
  return normalizeProjectModel({
    projectId: newProjectId(),
    projectName: "Untitled",
    artistName: "",
    bpm: 120,
    swing: 0, // 0..60 (% of step delay applied to off-beats)
    masterVolume: 0.9,
    mixerVersion: 2,
    continuous: true,
    choke: false, // new trigger cuts the previous one on the same channel
    fadeMs: 15, // crossfade length used when choking (ms)
    currentSequence: 0,
    channels: Array.from({ length: NUM_CHANNELS }, (_, i) => makeChannel(i)),
    instruments: Array.from({ length: NUM_INSTRUMENTS }, (_, i) =>
      makeInstrument(i),
    ),
    sequences: [makeSequence()],
  });
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
    this.generation = 0;
  }

  on(event, fn) {
    (this._subs[event] ||= []).push(fn);
    return () => {
      this._subs[event] = this._subs[event].filter((f) => f !== fn);
    };
  }

  emit(event, payload, { dirty = true, historyPaths } = {}) {
    if (dirty && event !== 'dirty') this.generation++;
    if(dirty&&(event==='load'||event==='channels'||event==='channel'&&(!payload?.prop||['source','sample','clipSnapshot','audio'].includes(payload.prop))||event==='project'&&!payload?.prop))retainAssets('current-project',this.project);
    (this._subs[event] || []).forEach((fn) => fn(payload));
    if (event !== "dirty" && dirty) {
      historyPaths ||= event === 'channel' ? [['channels', payload.ch, payload.prop]]
        : event === 'instrument' ? [['instruments', payload.i, payload.prop]]
        : event === 'notes' ? [['sequences', this.project.currentSequence, 'notes', payload]]
        : event === 'step' ? [['sequences', this.project.currentSequence, 'steps', payload.ch, payload.step]]
        : event === 'project'&&payload?.prop ? [[payload.prop]] : undefined;
      this.emit("dirty", { event, payload, historyPaths, generation: this.generation }, {dirty:false});
    }
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
    this.project.channels.push(makeChannel(this.numChannels));
    this.project.sequences.forEach((seq) =>
      seq.steps.push(new Array(NUM_STEPS).fill(0)),
    );
    this.emit("channels");
    return true;
  }

  removeChannel() {
    if (this.numChannels <= 1) return false;
    const removed=this.project.channels.at(-1);
    const owners=[...this.project.channels,...this.project.instruments];
    if(this.project.timeline.clips.some(c=>c.sourceTrackId===removed.id&&c.trackId!==removed.id)||owners.some(t=>t.freezeState?.trackId===removed.id||t.sampler?.zones?.some(z=>z.sourceTrackId===removed.id)||t.sampleInstrument?.sources?.some(z=>z.sourceTrackId===removed.id)||t.takes?.some(take=>take.sourceTrackId===removed.id)))throw new Error('This sample is used by a clip, sampler, take or frozen track. Remove those references before deleting it.');
    if([...owners,...this.project.buses,this.project.master].some(t=>[...t.inserts||[],...t.fx||[]].some(slot=>slot.irSource?.sourceTrackId===removed.id)))throw new Error('This sample is used as an impulse response. Remove that reference first.');
    if(removed.freezeState)throw new Error('Unfreeze this track before deleting it.');
    this.project.channels.pop();
    this.project.sequences.forEach((seq) => seq.steps.pop());
    this.project.timeline.clips=this.project.timeline.clips.filter(c=>c.trackId!==removed.id);
    this._removeTrackReferences(removed.id);
    this.emit("channels");
    return true;
  }
  instrument(i) {
    return this.project.instruments[i];
  }

  track(id) { return trackAddress(this.project, id)?.track || this.project.buses.find(t => t.id === id) || (id === 'master' ? this.project.master : null); }
  setTrackProp(id, prop, value) {
    const address = trackAddress(this.project, id);
    if (address) return address.kind === 'sample' ? this.setChannelProp(address.index, prop, value) : this.setInstrumentProp(address.index, prop, value);
    const track = this.track(id); if (!track) return false;
    track[prop] = value; this.emit('project', {prop:id === 'master' ? 'master' : 'buses'}); return true;
  }
  addInstrument(synthId = 'jims10') {
    if (this.project.instruments.length >= MODEL_LIMITS.instruments) return null;
    const track = makeInstrument(this.project.instruments.length); track.synthId = synthId;
    this.project.instruments.push(track); this.project.sequences.forEach(s => s.notes.push([]));
    this.emit('instruments'); return track;
  }
  removeInstrument(idOrIndex = this.project.instruments.length - 1) {
    const i = typeof idOrIndex === 'number' ? idOrIndex : this.project.instruments.findIndex(t => t.id === idOrIndex);
    if (i < 0 || this.project.instruments.length <= 1) return false;
    if(this.project.instruments[i].freezeState)throw new Error('Unfreeze this track before deleting it.');
    const [track] = this.project.instruments.splice(i,1); this.project.sequences.forEach(s=>s.notes.splice(i,1));
    this.project.timeline.clips = this.project.timeline.clips.filter(c=>c.trackId!==track.id);
    this._removeTrackReferences(track.id);
    this.emit('instruments'); return true;
  }
  _removeTrackReferences(id){this.project.timeline.automation=this.project.timeline.automation.filter(l=>l.target.trackId!==id);for(const owner of [...this.project.channels,...this.project.instruments,...this.project.buses,this.project.master])for(const slot of [...owner.inserts||[],...owner.fx||[]])if(slot.sidechainTrackId===id)delete slot.sidechainTrackId;}
  setTimeline(patch) {
    const next={...this.project.timeline,...structuredClone(patch)};
    if(!(Number.isFinite(next.lengthBeats)&&next.lengthBeats>0&&next.lengthBeats<=16384))throw new Error('Song length must be between 0 and 16384 beats.');
    for(const key of ['loop','punch'])if(next[key]&&(!Number.isFinite(next[key].start)||!Number.isFinite(next[key].end)||next[key].start<0||next[key].end<=next[key].start))throw new Error(`${key==='loop'?'Loop':'Punch'} end must be after its start.`);
    for(const p of next.tempo||[])if(!Number.isFinite(p.beat)||p.beat<0||!Number.isFinite(p.bpm)||p.bpm<20||p.bpm>420)throw new Error('Tempo points need a positive beat and BPM from 20 to 420.');
    for(const m of next.meter||[])if(!Number.isFinite(m.beat)||m.beat<0||!Number.isInteger(m.numerator)||m.numerator<1||m.numerator>32||![1,2,4,8,16,32].includes(m.denominator))throw new Error('Choose a valid musical meter.');
    if(patch.tempo&&!next.enabled&&next.tempo.length)this.project.bpm=[...next.tempo].sort((a,b)=>a.beat-b.beat)[0].bpm;
    Object.assign(this.project.timeline,next);this.emit('project',{prop:'timeline'});
  }
  enableTimeline() {
    if(!this.project.timeline.enabled&&this.project.timeline.tempo.length===1)this.project.timeline.tempo=[{beat:0,bpm:this.project.bpm}];
    if (!this.project.timeline.clips.length) this.project.timeline.clips = patternClips(this.project);
    this.setTimeline({enabled:true,lengthBeats:Math.max(this.project.timeline.lengthBeats,this.project.sequences.length*16)});
  }
  addClip(clip) {
    if (this.project.timeline.clips.length >= MODEL_LIMITS.clips) throw new Error('Clip limit reached.');
    const entry={id:newId('clip'),offset:0,gain:1,...structuredClone(clip)};
    validateClip(this.project,entry);
    this.project.timeline.clips.push(entry); this.project.timeline.lengthBeats=Math.max(this.project.timeline.lengthBeats,entry.start+entry.duration);
    this.emit('project',{prop:'timeline'}); return entry;
  }
  updateClip(id, patch) {
    const clip=this.project.timeline.clips.find(c=>c.id===id); if(!clip)return false;
    const next={...clip,...structuredClone(patch)};validateClip(this.project,next);
    Object.assign(clip,next);this.project.timeline.lengthBeats=Math.max(this.project.timeline.lengthBeats,clip.start+clip.duration);this.emit('project',{prop:'timeline'}); return clip;
  }
  removeClip(id) { this.project.timeline.clips=this.project.timeline.clips.filter(c=>c.id!==id);for(const owner of [...this.project.channels,...this.project.instruments]){for(const take of owner.takes||[])if(take.clipIds)take.clipIds=take.clipIds.filter(value=>value!==id);if(owner.freezeState?.clipId===id){owner.mute=owner.freezeState.wasMuted;owner.freezeState=null;}}this.emit('project',{prop:'timeline'},{historyPaths:[['timeline'],['channels'],['instruments']]}); }
  setAutomationLane(lane) {
    const entry={id:newId('automation'),enabled:true,...structuredClone(lane)};
    if(!entry.target||!this.track(entry.target.trackId)||!['volume','pan','bend','synthParam','effectParam'].includes(entry.target.kind))throw new Error('Choose an existing automation target.');
    if(!Array.isArray(entry.points)||entry.points.some(p=>!Number.isFinite(p.beat)||p.beat<0||!Number.isFinite(p.value)||!['linear','step',undefined].includes(p.curve)))throw new Error('Automation points need finite values and nonnegative beats.');
    const limits={volume:[0,4],pan:[-1,1],bend:[-48,48]}[entry.target.kind];if(limits&&entry.points.some(p=>p.value<limits[0]||p.value>limits[1]))throw new Error('Automation point is outside the target range.');
    const lanes=this.project.timeline.automation,index=lanes.findIndex(l=>l.id===entry.id);
    entry.points.sort((a,b)=>a.beat-b.beat);entry.points=entry.points.filter((p,i)=>i===entry.points.length-1||p.beat!==entry.points[i+1].beat);if(index<0)lanes.push(entry);else lanes[index]=entry;
    this.emit('project',{prop:'timeline'}); return entry;
  }
  recordAutomationPoint(target,point){
    if(!this.track(target.trackId)||!Number.isFinite(point.beat)||point.beat<0||!Number.isFinite(point.value))throw new Error('Invalid automation point.');
    const key=JSON.stringify(target),lanes=this.project.timeline.automation;let index=lanes.findIndex(l=>JSON.stringify(l.target)===key);
    if(index<0){const lane=this.setAutomationLane({target,points:[point]});return lane;}
    const lane=lanes[index],points=lane.points;let lo=0,hi=points.length;while(lo<hi){const mid=(lo+hi)>>>1;if(points[mid].beat<point.beat)lo=mid+1;else hi=mid;}
    const near=lo>0&&Math.abs(points[lo-1].beat-point.beat)<1/96?lo-1:lo<points.length&&Math.abs(points[lo].beat-point.beat)<1/96?lo:-1;
    if(near>=0)points[near]={...point};else {if(points.length>=100000)throw new Error('This automation lane reached its point limit. Simplify the curve before recording more.');points.splice(lo,0,{...point});}
    this.emit('project',{prop:'timeline',automationPoint:true},{historyPaths:[['timeline','automation',index,'points']]});return lane;
  }
  quantizeNotes(i, gridBeats = this.project.recording.quantize, strength = this.project.recording.strength, selectedIds = null) {
    const stepGrid=gridBeats*4;
    for(const n of this.seq.notes[i]) {
      if(selectedIds && !selectedIds.includes(n.id))continue;
      n.rawStep ??= n.step; n.rawDur ??= n.dur;
      const end=n.rawStep+n.rawDur;
      n.step=stepGrid>0?n.rawStep+(Math.round(n.rawStep/stepGrid)*stepGrid-n.rawStep)*strength:n.rawStep;
      const quantizedEnd=stepGrid>0?end+(Math.round(end/stepGrid)*stepGrid-end)*strength:end;
      n.dur=stepGrid>0?Math.max(1/960,quantizedEnd-n.step):n.rawDur;
    }
    this.emit('notes',i);
  }
  selectTake(trackId,takeId){
    const address=trackAddress(this.project,trackId),track=address?.track,take=track?.takes?.find(t=>t.id===takeId);if(!take)return false;
    track.activeTakeId=takeId;
    if(this.project.timeline.enabled){for(const c of this.project.timeline.clips)if(c.trackId===trackId&&c.takeId)c.muted=c.takeId!==takeId;}
    else if(address.kind==='instrument'){for(const seq of this.project.sequences)seq.notes[address.index]=[];for(const entry of take.notes||[])if(this.project.sequences[entry.sequenceIndex])this.project.sequences[entry.sequenceIndex].notes[address.index].push(structuredClone(entry.note));}
    this.emit('project',{prop:'timeline'},{historyPaths:[['timeline'],['sequences'],['instruments']]});return true;
  }

  setInstrumentProp(i, prop, value) {
    this.instrument(i)[prop] = value;
    this.emit("instrument", { i, prop, value });
  }

  addNote(i, note) {
    note.id ||= newId('note'); note.rawStep ??= note.step; note.rawDur ??= note.dur; note.expression ||= [];
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
    this.seq.notes[i] = notes.map(n=>({id:newId('note'),rawStep:n.step,rawDur:n.dur,expression:[],...n}));
    this.emit("notes", i);
  }

  // --- actions ---
  setStep(ch, step, val) {
    this.seq.steps[ch][step] = val;
    this.emit("step", { ch, step, val });
  }

  cycleStep(ch, step, accent = false) {
    const cur = stepVal(this.seq.steps[ch][step]);
    const next = accent ? (cur === 2 ? 0 : 2) : cur ? 0 : 1;
    this.setStep(ch, step, next);
  }

  // Merge per-step property overrides; creates/upgrades the step to object form.
  setStepProps(ch, step, props) {
    const cur = this.seq.steps[ch][step];
    const base = typeof cur === "object" && cur ? cur : { v: cur || 1 };
    this.seq.steps[ch][step] = { ...base, ...props };
    const value = this.seq.steps[ch][step],
      duration = this.channel(ch).analysis?.duration;
    if (value.wordSelection && Number.isFinite(duration))
      value.wordSelection = {
        ...value.wordSelection,
        start: (value.trimStart ?? this.channel(ch).trimStart) * duration,
        end: (value.trimEnd ?? this.channel(ch).trimEnd) * duration,
      };
    this.emit("step", { ch, step, val: this.seq.steps[ch][step] });
  }

  toggleStepReverse(ch, step) {
    const cur = this.seq.steps[ch][step];
    if (!stepVal(cur)) return;
    const obj = typeof cur === "object" ? cur : { v: cur };
    obj.rev = !obj.rev;
    this.seq.steps[ch][step] = obj;
    this.emit("step", { ch, step, val: obj });
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
    if(prop === 'bpm' && !this.project.timeline.enabled) this.project.timeline.tempo=[{beat:0,bpm:value}];
    this.emit("project", { prop, value });
  }

  selectSequence(i) {
    const previousLength = this.project.sequences.length;
    while (
      this.project.sequences.length <= i &&
      this.project.sequences.length < MAX_SEQUENCES
    ) {
      this.project.sequences.push(makeSequence(this.numChannels,this.project.instruments.length));
    }
    i = Math.max(0, Math.min(i, this.project.sequences.length - 1));
    this.project.currentSequence = i;
    // Existing-sequence selection is view/transport state; creating one is an edit.
    this.emit("sequence", i, { dirty: this.project.sequences.length !== previousLength });
  }

  clearSequence() {
    this.project.sequences[this.project.currentSequence] = makeSequence(
      this.numChannels,this.project.instruments.length,
    );
    this.emit("sequence", this.project.currentSequence);
  }

  clearChannelPattern(ch) {
    this.seq.steps[ch].fill(0);
    this.emit("sequence", this.project.currentSequence);
  }

  // Auto-pattern cycle (from the original patternSelectionButtons.js):
  // 1 = all steps, 2 = every 2nd, 3 = every 4th, 4 = every 8th, 5 = every 16th, 0 = clear.
  applyAutoPattern(ch, mode) {
    const row = this.seq.steps[ch];
    const div = { 1: 1, 2: 2, 3: 4, 4: 8, 5: 16 }[mode];
    for (let i = 0; i < NUM_STEPS; i++) row[i] = div && i % div === 0 ? 1 : 0;
    this.emit("sequence", this.project.currentSequence);
  }

  shiftChannelPattern(ch, dir) {
    const row = this.seq.steps[ch];
    if (dir > 0) row.unshift(row.pop());
    else row.push(row.shift());
    this.emit("sequence", this.project.currentSequence);
  }

  // `restore` marks an undo/redo step: listeners may keep decoded audio alive
  // when the channel sources did not change (see main.js).
  loadProject(project, { restore = false } = {}) {
    const previous = this.project;
    this.project = normalizeProjectModel(project);
    this.emit("load", { restore, previous });
  }
}

function validateClip(project,clip){
  if(clip.tailSeconds!=null&&(!Number.isFinite(clip.tailSeconds)||clip.tailSeconds<0||clip.tailSeconds>120))throw new Error('Audio clip tails must be between 0 and 120 seconds.');
  const address=trackAddress(project,clip.trackId);
  if(!address||!Number.isFinite(clip.start)||clip.start<0||!Number.isFinite(clip.duration)||clip.duration<=0||clip.start+clip.duration>16384)throw new Error('A clip needs a track and a positive range within the song limit.');
  if(!['audio','midi','pattern'].includes(clip.type)||clip.type==='audio'&&address.kind!=='sample'||clip.type==='midi'&&address.kind!=='instrument')throw new Error('Audio clips belong on sample tracks; MIDI clips belong on instrument tracks.');
  if(clip.type==='pattern'&&!project.sequences.some(s=>s.id===clip.sequenceId))throw new Error('The clip pattern no longer exists.');
  if(clip.sourceTrackId&&trackAddress(project,clip.sourceTrackId)?.kind!=='sample'&&clip.type==='audio')throw new Error('Choose a sample source for this audio clip.');
  for(const key of ['offset','sourceOffsetSeconds','fadeIn','fadeOut','gain'])if(clip[key]!=null&&(!Number.isFinite(clip[key])||clip[key]<0))throw new Error('Clip offsets, fades and gain cannot be negative.');
  if(clip.playbackRate!=null&&(!Number.isFinite(clip.playbackRate)||clip.playbackRate<.1||clip.playbackRate>4))throw new Error('Playback rate must be between 0.1 and 4.');
}

// Helpers for mixed int/object step values.
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
