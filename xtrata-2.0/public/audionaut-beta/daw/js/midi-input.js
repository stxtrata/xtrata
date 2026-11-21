import { STORAGE_KEYS } from "./storage-config.js";
// One MIDI connection and one explicitly selected performance instrument.
// Editors observe input; they never compete to own a port's note handlers.
import { noteOn, noteOff, allOff, bendNotes } from "./live-keys.js";
import { store } from "./state.js";
import { engine } from './engine.js';

const PREF_KEY = STORAGE_KEYS.midi;
const listeners = new Set();
const ports = new Map();
const pressed = new Map();
const sustain = new Map();
const bends = new Map();
let access = null, pending = null, generation = 0, target = 0;
const status = { on: false, names: [], error: "" };
const pref = () => { try { return localStorage.getItem(PREF_KEY) !== "off"; } catch { return true; } };
const savePref = (on) => { try { localStorage.setItem(PREF_KEY, on ? "on" : "off"); } catch {} };
const emit = () => document.dispatchEvent(new CustomEvent("midi-status", { detail: midiStatus() }));
export function addMidiListener(fn) { listeners.add(fn); return () => listeners.delete(fn); }
export const isMidiOn = () => status.on;
export const midiStatus = () => ({ ...status, names: [...status.names], inputs:[...ports.values()].map(p=>({id:p.id,name:p.name||'MIDI controller'})) });
export function midiEventAudioTime(msg) {
  const ctx=engine.ensureContext(),stamp=Number(msg.receivedTime ?? msg.timeStamp);
  const age=Number.isFinite(stamp)?Math.max(0,(performance.now()-stamp)/1000):0;
  return Math.max(0,ctx.currentTime-age-(store.project.recording?.latencyMs||0)/1000);
}
export const getMidiTarget = () => target;
export function setMidiTarget(i) {
  i = Number(i);
  if (!Number.isInteger(i) || !store.instrument(i)) return target;
  if (target === i) return target;
  target = i;
  document.dispatchEvent(new CustomEvent("instrument-target", { detail: { i } }));
  return target;
}
const portPrefix = (id) => `midi:${encodeURIComponent(id)}:`;
function releasePrefix(prefix) {
  allOff(prefix);
  for (const k of pressed.keys()) if (k.startsWith(prefix)) pressed.delete(k);
  for (const k of sustain.keys()) if (k.startsWith(prefix)) sustain.delete(k);
  for (const k of bends.keys()) if (k.startsWith(prefix)) bends.delete(k);
}
function onMessage(msg, portId) {
  if (!status.on) return;
  const data = msg.data || [], [s, pitch, velocity = 0] = data;
  const type = s & 0xf0, group = `${portPrefix(portId)}${s & 15}:`, src = `${group}${pitch}`;
  const time=midiEventAudioTime(msg),release=held=>{for(const source of held?.sources||[src])noteOff(source,{time});};
  if (type === 0x90 && velocity > 0) {
    const matches=t=>!!t&&(!t.midiInput?.portId||t.midiInput.portId==='*'||t.midiInput.portId===portId)&&(!t.midiInput?.channel||t.midiInput.channel==='all'||+t.midiInput.channel===(s&15)+1);
    const armed=store.project.instruments.map((t,i)=>({t,i})).filter(({t})=>t.armed&&matches(t));
    const targets=armed.length?armed.map(x=>x.i):matches(store.instrument(target))?[target]:[];
    release(pressed.get(src));const sources=targets.map(i=>`${src}@${i}`);
    pressed.set(src, { group, down: true, sources });
    targets.forEach((i,index)=>noteOn(sources[index],i,pitch,velocity/127,{bend:bends.get(group)||0,time}));
  } else if (type === 0x80 || (type === 0x90 && velocity === 0)) {
    const held = pressed.get(src);
    if (held) held.down = false;
    if (!sustain.get(group)) { pressed.delete(src); release(held); }
  } else if (type === 0xb0 && pitch === 64) {
    const on = velocity >= 64;
    sustain.set(group, on);
    if (!on) for (const [key, held] of pressed) if (held.group === group && !held.down) {
      pressed.delete(key); release(held);
    }
  } else if (type === 0xe0) {
    const value = (velocity << 7) | pitch;
    const semitones = (value - 8192) / (value < 8192 ? 8192 : 8191) * 2;
    bends.set(group, semitones);
    bendNotes(group, semitones,time);
  } else if (type === 0xb0 && (pitch === 120 || pitch === 123)) {
    releasePrefix(group);
  }
  if(type===0xb0)document.dispatchEvent(new CustomEvent('live-expression',{detail:{prefix:group,type:'cc',controller:pitch,value:velocity,time}}));
  for (const fn of listeners) {
    try { fn({ data, portId, timeStamp: msg.timeStamp, receivedTime: msg.receivedTime }); }
    catch (e) { console.error(e); }
  }
}
function connect() {
  if (!access) return;
  const live = new Map([...access.inputs.values()].filter(p => p.state !== "disconnected").map(p => [p.id, p]));
  for (const [id, port] of ports) if (!live.has(id) || live.get(id) !== port) {
    port.onmidimessage = null;
    ports.delete(id);
    releasePrefix(portPrefix(id));
  }
  for (const [id, input] of live) {
    if (!ports.has(id)) { input.onmidimessage = msg => onMessage(msg, id); ports.set(id, input); }
  }
  status.on = true;
  status.names = [...live.values()].map(p => p.name || "MIDI controller");
  status.error = "";
  emit();
}
function disconnect() {
  for (const input of ports.values()) input.onmidimessage = null;
  ports.clear();
  if (access) access.onstatechange = null;
  access = null;
  releasePrefix("midi:");
  status.on = false; status.names = []; status.error = "";
  emit();
}
export async function ensureMidi({ force = false } = {}) {
  if (force) savePref(true);
  if (!pref()) return false;
  if (access) return true;
  if (pending) return pending;
  const ticket = generation;
  const request = (async () => {
    try {
      if (!navigator.requestMIDIAccess) throw new Error("MIDI input isn't available in this browser.");
      const result = await navigator.requestMIDIAccess({ sysex: false });
      if (ticket !== generation || !pref()) return false;
      access = result;
      access.onstatechange = connect;
      connect();
      return true;
    } catch (e) {
      if (ticket === generation) { status.on = false; status.error = e.message || "MIDI access was blocked."; emit(); }
      return false;
    }
  })();
  pending = request;
  try { return await request; } finally { if (pending === request) pending = null; }
}
export function setMidiEnabled(on) {
  if (on) return ensureMidi({ force: true });
  generation++;
  pending = null;
  savePref(false);
  disconnect();
  return Promise.resolve(false);
}
let initialized = false;
export async function initMidi() {
  if (initialized) return;
  initialized = true;
  try { const p = await navigator.permissions?.query({ name: "midi" }); if (p?.state === "granted") ensureMidi(); } catch {}
  const first = () => ensureMidi();
  window.addEventListener("pointerdown", first, { once: true, capture: true });
  window.addEventListener("keydown", first, { once: true, capture: true });
}
document.addEventListener("performance-reset", ({ detail }) => {
  if (detail?.sources) {
    for (const src of detail.sources) pressed.delete(src);
    return;
  }
  const prefix = detail?.prefix || "";
  for (const key of pressed.keys()) if (key.startsWith(prefix)) pressed.delete(key);
  for (const key of sustain.keys()) if (key.startsWith(prefix)) sustain.delete(key);
  for (const key of bends.keys()) if (key.startsWith(prefix)) bends.delete(key);
});
store.on("instruments", () => { if(!store.instrument(target))setMidiTarget(Math.max(0,store.project.instruments.length-1)); });
store.on("load", () => {
  if (!store.instrument(target)) target = 0;
  document.dispatchEvent(new CustomEvent("instrument-target", { detail: { i: target } }));
});
