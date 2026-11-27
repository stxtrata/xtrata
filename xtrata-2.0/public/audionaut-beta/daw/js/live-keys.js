// live-keys.js — the ONE shared path for playing a synth live: on-screen keyboards (every face
// and the classic panel), computer keys and Web MIDI all start and stop notes through here.
//
//  - noteOn(src, inst, pitch, vel) / noteOff(src): `src` names the thing holding the note
//    ("kb3:<pointerId>", "key:a", "midi:<port>:0:60"), so a key-up releases exactly the note its
//    key-down started, even after an octave shift. Re-pressing a src first releases its old note.
//  - attachKeyboard(el, …): Pointer Events for mouse, pen and multi-touch, with pointer capture,
//    glissando (every key passed over plays, up and down), and release on pointerup / cancel /
//    lost capture / window blur / tab switch.
//  - one octave setting shared by the computer keys and every on-screen keyboard.
// Key lights are not drawn here: engine.startNote / releaseNote emit "synth-note" events, so
// lights follow real note state whatever the input (sequencer playback included).

import { engine } from "./engine.js";
import { store } from "./state.js";
import { createArpeggiator, normalizeArp } from "./arpeggiator.js";
import { normalizeVoicing } from "./voicing.js";
import { beatToSeconds } from "./timeline.js";

export const TYPED_VEL = 0.8;
const held = new Map(); // physical source -> { id, inst, pitch, vel, bend }
const outputs = new Map(); // voice id -> input identity, including scheduled arp pulses
let octave = 3;
let seq = 0;
let pulse = 0;
const emit = (detail) => document.dispatchEvent(new CustomEvent("live-note", { detail }));
export const getArpSettings = (i) => normalizeArp(store.instrument(i)?.arp);
function startOutput(src, n, options = {}) {
  const time = options.time ?? engine.ensureContext().currentTime;
  const id = n.monitor === false ? `silent:${++pulse}` : engine.startNote(n.inst, n.pitch, n.vel, { ...options, source: src, bend: n.bend || 0 });
  if (id) {
    outputs.set(id, { src, ...n });
    emit({ src, inst: n.inst, pitch: n.pitch, vel: n.vel, bend:n.bend||0, on: true, time, duration: options.duration });
  }
  return id;
}
function releaseOutput(id, time = engine.ctx?.currentTime || 0) {
  const n = outputs.get(id);
  if (!n) return;
  outputs.delete(id);
  engine.releaseNote(id, time);
  emit({ ...n, on: false, time });
}
function beatInterval(time,beats){
  const project=store.project,pos=engine.getMusicalPosition(time);if(!pos.playing)return beats*60/project.bpm;
  const loop=engine._loopRange,beat=pos.beat;
  if(!loop||beat+beats<=loop.end)return beatToSeconds(project,beat+beats)-beatToSeconds(project,beat);
  const first=Math.max(0,loop.end-beat),remaining=beats-first,length=loop.end-loop.start,cycles=Math.floor(remaining/length),rest=remaining-cycles*length;
  return beatToSeconds(project,loop.end)-beatToSeconds(project,beat)+cycles*(beatToSeconds(project,loop.end)-beatToSeconds(project,loop.start))+beatToSeconds(project,loop.start+rest)-beatToSeconds(project,loop.start);
}
const arp = createArpeggiator({
  now: () => engine.ensureContext().currentTime,
  bpm: () => store.project.bpm,
  intervalAt:(time,rate)=>beatInterval(time,1/rate),
  grid:(time,rate)=>{const pos=engine.getMusicalPosition(time);if(!pos.playing)return null;const beat=pos.beat,nextBeat=(Math.floor(beat*rate+1e-8)+1)/rate;return {next:time+beatInterval(time,nextBeat-beat),key:JSON.stringify([store.project.bpm,store.project.timeline.enabled,store.project.timeline.tempo])};},
  settings: getArpSettings,
  notes: (inst) => [...held.values()].filter(n => n.inst === inst),
  play: (inst, n, time, duration) => startOutput(`arp:${inst}:${++pulse}`, { ...n, inst }, { time, duration }),
  stop: releaseOutput,
  position: (time) => engine.getTransportPosition?.(time),
});
export const getVoicing = (i) => normalizeVoicing(store.instrument(i)?.voicing);
export function setVoicing(i, patch) {
  if (!store.instrument(i)) return;
  const previous = getVoicing(i), next = normalizeVoicing({ ...previous, ...patch });
  if (next.mode !== previous.mode) {
    // Changing mode with keys down would leave notes owned by the old mode.
    for (const [src, n] of held) if (n.inst === i) { if (n.id) releaseOutput(n.id); held.delete(src); }
    engine.releaseAll(i);
  }
  store.setInstrumentProp(i, "voicing", next);
  return next;
}
export function setArpSettings(i, patch) {
  if (!store.instrument(i)) return;
  const previous = getArpSettings(i), next = normalizeArp({ ...previous, ...patch });
  store.setInstrumentProp(i, "arp", next);
  return next;
}
function refreshArp(i) {
  arp.cancel(i);
  const enabled = getArpSettings(i).enabled;
  for (const [src, n] of held) if (n.inst === i) {
    if (n.id) releaseOutput(n.id);
    n.id = enabled ? 0 : startOutput(src, n);
  }
  arp.update(i);
  document.dispatchEvent(new CustomEvent("arp-settings", { detail: { i, settings: getArpSettings(i) } }));
}
store.on("instrument", ({ i, prop }) => {
  if (prop === "arp") refreshArp(i);
  if (prop === "voicing") document.dispatchEvent(new CustomEvent("voicing-settings", { detail: { i, settings: getVoicing(i) } }));
  if (prop === "synthId") {
    const sources = [];
    for (const [src, n] of held) if (n.inst === i) { sources.push(src); held.delete(src); }
    arp.cancel(i);
    for (const [id, n] of outputs) if (n.inst === i) releaseOutput(id);
    document.dispatchEvent(new CustomEvent("performance-reset", { detail: { sources } }));
  }
});
export function noteOn(src, inst, pitch, vel = TYPED_VEL, options = {}) {
  noteOff(src);
  if (!Number.isInteger(pitch) || pitch < 0 || pitch > 127 || !Number.isFinite(vel) || !store.instrument(inst)) return 0;
  vel = Math.max(0, Math.min(1, vel));
  engine.ensureContext();
  const n = { inst, pitch, vel, bend: options.bend || 0, origin: src, id: 0, monitor:store.instrument(inst).monitor };
  held.set(src, n);
  if (getArpSettings(inst).enabled) arp.update(inst);
  else n.id = startOutput(src, n, {time:options.time});
  return n.id || 1;
}
export function noteOff(src, options = {}) {
  const n = held.get(src);
  if (!n) return;
  held.delete(src);
  if (n.id) releaseOutput(n.id,options.time);
  for (const [id, output] of outputs) if (output.origin === src) releaseOutput(id,options.time);
  arp.update(n.inst);
}
export function bendNotes(prefix, semitones, time = engine.ctx?.currentTime || 0) {
  for (const [src, n] of held) if (src.startsWith(prefix)) n.bend = semitones;
  for (const [id, n] of outputs) if (n.src.startsWith(prefix) || (n.origin && n.origin.startsWith(prefix))) engine.setNotePitchBend?.(id, semitones);
  document.dispatchEvent(new CustomEvent('live-expression',{detail:{prefix,type:'bend',value:semitones,time}}));
}
export function allOff(prefix = "") {
  for (const src of [...held.keys()]) if (src.startsWith(prefix)) noteOff(src);
  if (!prefix) arp.clear();
  document.dispatchEvent(new CustomEvent("performance-reset", { detail: { prefix } }));
}
export function panic() {
  allOff();
  for (const id of [...outputs.keys()]) releaseOutput(id);
  engine.panic?.();
}
export const heldCount = () => held.size;
document.addEventListener("synth-voice-ended", ({ detail }) => {
  const n = outputs.get(detail.id);
  if (n) { outputs.delete(detail.id); emit({ ...n, on: false, time: engine.ctx?.currentTime || 0 }); }
  arp.ended(detail.id);
});
store.on("instruments", () => allOff());
store.on("load", () => {
  allOff();
  for (const id of [...outputs.keys()]) releaseOutput(id);
  engine.releaseAll();
});
export const getOctave = () => octave;
export function setOctave(o) {
  const n = Math.min(6, Math.max(0, o | 0));
  if (n === octave) return octave;
  octave = n;
  document.dispatchEvent(new CustomEvent("live-octave", { detail: octave }));
  return octave;
}
// semitone offset applied to on-screen keyboards (0 at the default octave)
export const keyOffset = () => 12 * (octave - 3);

let wired = false;
function wireGlobal() {
  if (wired || typeof window === "undefined") return;
  wired = true;
  window.addEventListener("blur", () => allOff());
  document.addEventListener("transport-stop", () => allOff());
  window.addEventListener("pagehide", () => allOff());
  document.addEventListener("visibilitychange", () => document.hidden && allOff());
}
wireGlobal();

// Attach glissando pointer play to a keyboard container.
//   keyAt(node) -> { midi, el } | null   which key a hit-tested node belongs to
//   inst()      -> instrument slot to play
//   velAt(e, el) optional; default: lower on the key = louder (0.45 … 1.0)
export function attachKeyboard(el, { keyAt, inst, velAt, hitTest, prefix = "kb" }) {
  const tag = `${prefix}${++seq}`;
  const ptrs = new Map(), latched = new Map();
  let sustain = false, pressSerial = 0;
  const rootNode = el.getRootNode();
  const hitRoot = rootNode && rootNode.elementFromPoint ? rootNode : document;
  const vel =
    velAt ||
    ((e, k) => {
      const r = k.getBoundingClientRect();
      const f = r.height ? (e.clientY - r.top) / r.height : 0.6;
      return 0.45 + 0.55 * Math.min(1, Math.max(0, f));
    });
  const hit = (e) => {
    const n = hitRoot.elementFromPoint(e.clientX, e.clientY);
    if (hitTest) return n && el.contains(n) ? hitTest(e) : null;
    return n && el.contains(n) ? keyAt(n) : null;
  };
  const press = (e, k) => {
    const src = tag + ':' + e.pointerId + ':' + ++pressSerial;
    const slot = inst(), note = slot + ':' + k.midi;
    if (latched.has(note)) { noteOff(latched.get(note)); latched.delete(note); }
    ptrs.set(e.pointerId, { midi:k.midi, src, note });
    noteOn(src, slot, k.midi, vel(e, k.el));
  };
  const lift = (pointer, pedal) => {
    if (!pointer?.src) return;
    if (pedal && sustain) {
      if (latched.has(pointer.note)) noteOff(latched.get(pointer.note));
      latched.set(pointer.note, pointer.src);
    }
    else noteOff(pointer.src);
  };
  const end = (e) => {
    lift(ptrs.get(e.pointerId), e.type === 'pointerup');
    ptrs.delete(e.pointerId);
  };
  const onDown = (e) => {
    if (e.button > 0) return;
    const k = hit(e) || keyAt(e.target);
    if (!k || !Number.isInteger(k.midi) || k.midi < 0 || k.midi > 127) return;
    e.preventDefault();
    try {
      el.setPointerCapture(e.pointerId);
    } catch {
      /* synthetic pointer */
    }
    press(e, k);
  };
  const onMove = (e) => {
    if (!ptrs.has(e.pointerId)) return;
    if (ptrs.get(e.pointerId)?.locked) return;
    if (e.pointerType === "mouse" && e.buttons === 0) return end(e); // missed the up (e.g. outside a frame)
    const k = hit(e);
    const cur = ptrs.get(e.pointerId);
    const m = k ? k.midi : null;
    if (m === (cur?.midi ?? null)) return;
    lift(cur, true);
    if (k) press(e, k);
    else ptrs.set(e.pointerId, null); // left the keys: silent until it comes back
  };
  const context = e => e.preventDefault();
  const reset = ({detail}={}) => {
    const sources=detail?.sources;
    const matches = src => sources ? sources.includes(src) : !detail?.prefix || src?.startsWith(detail.prefix);
    for (const [id, pointer] of ptrs) if (matches(pointer?.src)) ptrs.delete(id);
    for (const [note,src] of latched) if (matches(src)) latched.delete(note);
  };
  const events={pointerdown:onDown,pointermove:onMove,pointerup:end,pointercancel:end,lostpointercapture:end,contextmenu:context,dblclick:context};
  for(const [name,fn] of Object.entries(events))el.addEventListener(name,fn);
  // Notes use pointer events. Suppress Safari's tap-to-zoom default only on the playing surface.
  const touchEnd = e => { if (e.cancelable) e.preventDefault(); };
  el.addEventListener('touchend', touchEnd, {passive:false});
  document.addEventListener('performance-reset',reset);
  const previousTouch=el.style.touchAction;el.style.touchAction='none';
  const release=()=>{allOff(`${tag}:`);ptrs.clear();latched.clear();};
  return {tag,release,
    keepPointers() { for (const [id,p] of ptrs) { if (p) p.locked = true; else ptrs.set(id, {locked:true}); } },
    setSustain(on) {
      sustain = on;
      if (!on) { for (const src of latched.values()) noteOff(src); latched.clear(); }
    },
    dispose(){release();el.removeEventListener('touchend',touchEnd);for(const [name,fn] of Object.entries(events))el.removeEventListener(name,fn);document.removeEventListener('performance-reset',reset);el.style.touchAction=previousTouch;}};
}
