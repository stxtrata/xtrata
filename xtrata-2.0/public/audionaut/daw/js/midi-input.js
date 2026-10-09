// midi-input.js — one shared Web MIDI connection for the whole DAW.
//
// It owns the MIDIAccess and every input's onmidimessage (a port only has ONE handler
// slot, so the roll and the synth panel used to knock each other out). Other modules
// subscribe with addMidiListener(). MIDI is ON by default: it connects at load when the
// browser already granted access, otherwise on the first click / key press / synth
// selection (browsers only show the permission prompt after a gesture). Controllers
// plugged in later are picked up automatically. With neither the roll nor the synth
// panel open, notes play the most recently selected instrument.
import { noteOn, noteOff } from "./live-keys.js";

const PREF_KEY = "audionaut.midi";
const listeners = new Set();
let access = null;
let pending = null;
let target = 0;
const status = { on: false, names: [], error: "" };

const pref = () => {
  try {
    return localStorage.getItem(PREF_KEY) !== "off";
  } catch {
    return true;
  }
};
const savePref = (on) => {
  try {
    localStorage.setItem(PREF_KEY, on ? "on" : "off");
  } catch {
    /* private mode */
  }
};
const emit = () =>
  document.dispatchEvent(new CustomEvent("midi-status", { detail: { ...status } }));

export const addMidiListener = (fn) => listeners.add(fn);
export const isMidiOn = () => status.on;
export const midiStatus = () => ({ ...status });
export const getMidiTarget = () => target;
export function setMidiTarget(i) {
  target = i | 0;
}

const hidden = (id) => document.getElementById(id)?.classList.contains("hidden") !== false;

function onMessage(msg) {
  for (const fn of listeners) {
    try {
      fn(msg);
    } catch (e) {
      console.error(e);
    }
  }
  liveFallback(msg);
}

// Neither editor is open: play the selected instrument straight from the keyboard.
function liveFallback({ data }) {
  if (!hidden("modal-roll") || !hidden("modal-synth")) return;
  const [s, pitch, vel = 0] = data;
  const type = s & 0xf0;
  // same held-note path as the on-screen and computer keys (live-keys.js)
  if (type === 0x90 && vel > 0) noteOn(`midi:${s & 15}:${pitch}`, target, pitch, vel / 127);
  else if (type === 0x80 || (type === 0x90 && vel === 0)) noteOff(`midi:${s & 15}:${pitch}`);
}

function connect() {
  const names = [];
  for (const input of access.inputs.values()) {
    input.onmidimessage = onMessage;
    names.push(input.name);
  }
  status.on = true;
  status.names = names;
  status.error = "";
  emit();
}

function disconnect() {
  if (access) {
    for (const input of access.inputs.values()) input.onmidimessage = null;
    access.onstatechange = null;
  }
  access = null;
  status.on = false;
  status.names = [];
  emit();
}

// Connect (once). `force` also overrides a previous "turn MIDI off".
export async function ensureMidi({ force = false } = {}) {
  if (access) return true;
  if (!force && !pref()) return false;
  if (pending) return pending;
  if (force) savePref(true);
  pending = (async () => {
    try {
      if (!navigator.requestMIDIAccess)
        throw new Error("MIDI input isn't available in this browser.");
      access = await navigator.requestMIDIAccess({ sysex: false });
      access.onstatechange = connect;
      connect();
      return true;
    } catch (e) {
      access = null;
      status.on = false;
      status.error = e.message || "MIDI access was blocked.";
      emit();
      return false;
    } finally {
      pending = null;
    }
  })();
  return pending;
}

export function setMidiEnabled(on) {
  if (on) return ensureMidi({ force: true });
  savePref(false);
  disconnect();
  return Promise.resolve(false);
}

export async function initMidi() {
  // Already allowed on this site → connect straight away, no gesture needed.
  try {
    const p = await navigator.permissions?.query({ name: "midi" });
    if (p?.state === "granted") ensureMidi();
  } catch {
    /* permissions API / "midi" not supported */
  }
  // Otherwise connect on the first interaction (that is when the prompt is allowed).
  const first = () => ensureMidi();
  window.addEventListener("pointerdown", first, { once: true, capture: true });
  window.addEventListener("keydown", first, { once: true, capture: true });
  // Selecting any instrument row makes it the live-play target and connects MIDI.
  document.addEventListener(
    "pointerdown",
    (e) => {
      const row = e.target.closest?.(".channel.instrument");
      if (row) {
        setMidiTarget(+row.dataset.inst || 0);
        ensureMidi();
      }
    },
    true,
  );
}
