// live-keys.js — the ONE shared path for playing a synth live: on-screen keyboards (every face
// and the classic panel), computer keys and Web MIDI all start and stop notes through here.
//
//  - noteOn(src, inst, pitch, vel) / noteOff(src): `src` names the thing holding the note
//    ("kb3:<pointerId>", "key:a", "midi:0:60"), so a key-up always releases exactly the note its
//    key-down started, even after an octave shift. Re-pressing a src first releases its old note.
//  - attachKeyboard(el, …): Pointer Events for mouse, pen and multi-touch, with pointer capture,
//    glissando (every key passed over plays, up and down), and release on pointerup / cancel /
//    lost capture / window blur / tab switch.
//  - one octave setting shared by the computer keys and every on-screen keyboard.
// Key lights are not drawn here: engine.startNote / releaseNote emit "synth-note" events, so
// lights follow real note state whatever the input (sequencer playback included).

import { engine } from "./engine.js";

export const TYPED_VEL = 0.8; // computer-keyboard velocity (pointer velocity comes from key height)
const held = new Map(); // src -> engine live-note id
let octave = 3; // C3 = MIDI 48 at the bottom of the computer-key row
let seq = 0;

export function noteOn(src, inst, pitch, vel = TYPED_VEL) {
  noteOff(src);
  if (!(pitch >= 0 && pitch <= 127)) return 0;
  const id = engine.startNote(inst, pitch, vel);
  if (id) held.set(src, id);
  return id;
}
export function noteOff(src) {
  const id = held.get(src);
  if (id == null) return;
  held.delete(src);
  engine.releaseNote(id);
}
export function allOff(prefix = "") {
  for (const k of [...held.keys()]) if (k.startsWith(prefix)) noteOff(k);
}
export const heldCount = () => held.size;

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
  window.addEventListener("pagehide", () => allOff());
  document.addEventListener("visibilitychange", () => document.hidden && allOff());
}
wireGlobal();

// Attach glissando pointer play to a keyboard container.
//   keyAt(node) -> { midi, el } | null   which key a hit-tested node belongs to
//   inst()      -> instrument slot to play
//   velAt(e, el) optional; default: lower on the key = louder (0.45 … 1.0)
export function attachKeyboard(el, { keyAt, inst, velAt }) {
  const tag = `kb${++seq}`;
  const ptrs = new Map(); // pointerId -> midi currently held by that pointer (or null when off the keys)
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
    return n && el.contains(n) ? keyAt(n) : null;
  };
  const press = (e, k) => {
    ptrs.set(e.pointerId, k.midi);
    noteOn(`${tag}:${e.pointerId}`, inst(), k.midi, vel(e, k.el));
  };
  const end = (e) => {
    if (!ptrs.has(e.pointerId)) return;
    ptrs.delete(e.pointerId);
    noteOff(`${tag}:${e.pointerId}`);
  };
  const onDown = (e) => {
    if (e.button > 0) return;
    const k = hit(e) || keyAt(e.target);
    if (!k) return;
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
    if (e.pointerType === "mouse" && e.buttons === 0) return end(e); // missed the up (e.g. outside a frame)
    const k = hit(e);
    const cur = ptrs.get(e.pointerId);
    const m = k ? k.midi : null;
    if (m === cur) return;
    noteOff(`${tag}:${e.pointerId}`);
    if (k) press(e, k);
    else ptrs.set(e.pointerId, null); // left the keys: silent until it comes back
  };
  el.addEventListener("pointerdown", onDown);
  el.addEventListener("pointermove", onMove);
  el.addEventListener("pointerup", end);
  el.addEventListener("pointercancel", end);
  el.addEventListener("lostpointercapture", end);
  el.addEventListener("contextmenu", (e) => e.preventDefault());
  el.style.touchAction = "none";
  return {
    tag,
    release() {
      allOff(`${tag}:`);
      ptrs.clear();
    },
  };
}
