import { KEYMAP, isBlackKey as isBlack } from './keyboard-layout.js';
import { drumKeyboard, performancePitch } from './instrument-keyboard.js';
// pianoroll.js — canvas piano-roll MIDI editor for instrument channels.
// Editing toolkit: marquee drag-selection, move (all directions), resize (drag right
// edge), split (double-click), velocity editing (shift+wheel / shift+↑↓), nudge with
// arrows, copy/paste, per-synth parameter panels, preset lines, keyboard playing and
// live recording.

import { store, NUM_STEPS, makeSequence } from "./state.js";
import { newId } from './project-model.js';
import { engine } from "./engine.js";
import { ensureMidi, setMidiEnabled, isMidiOn, midiStatus, setMidiTarget } from "./midi-input.js";
import { SYNTH_BANK, synthDefaults, parseLine } from "./synths.js";
import { createSynthPicker } from "./synth-picker.js";
import { changeSynth } from "./synth-selection.js";
import { attachKeyboard, noteOn, noteOff, allOff, getOctave, setOctave, TYPED_VEL } from "./live-keys.js";
import { beginTransaction, endTransaction } from "./history.js";
import { quantizeRecordedSpan } from "./performance-recorder.js";
import { bindRecordArm, bindRecordHint, makeQuantizeControls, setQuantizeTrack } from './record-controls.js';

const $ = (s) => document.querySelector(s);

const LOW = 0;
const HIGH = 127;
const ROWS = HIGH - LOW + 1;
const CELL_W = 14,
  CELL_H = 12,
  KEY_W = 44;
const RESIZE_PX = 5; // grab zone at note's right edge

let inst = 0;
let editingClipId = null;
const editingClip = () => store.project.timeline.clips.find(c=>c.id===editingClipId);
const rollLength = () => editingClip()?Math.max(1,Math.ceil(editingClip().duration*4)):NUM_STEPS;
const editOffset = () => (editingClip()?.offset||0)*4;
const gridSteps = () => store.project.recording.quantize>0?store.project.recording.quantize*4:1/16;
let noteDur = 2;
let quantizeTools, armHint;
let canvas, ctx2d;

// --- editing state ---
let selection = new Set(); // note object references
let drag = null; // { mode:'move'|'resize'|'marquee', ... }
let clipboard = null;
let lastPlayStep = -1;


const NOTE_NAMES = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];
const midiName = (m) => NOTE_NAMES[m % 12] + (Math.floor(m / 12) - 1);
const notes = () => editingClip()?.notes || store.seq.notes[inst] || [];
function setEditorNotes(value){if(editingClip()){editingClip().notes=value;commit();}else store.setNotes(inst,value);}
function addEditorNote(note){note.id=newId('note');note.rawStep??=note.step;note.rawDur??=note.dur;note.expression||=[];notes().push(note);commit();}
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

function commit() {
  editingClip()?store.emit('project',{prop:'timeline'}):store.emit("notes", inst);
}

// --------------------------------------------------------------- drawing
// keys currently sounding for the open instrument (typed, MIDI, mouse or playback)
const lit = new Map();
const heldTyped = new Map(); // typed key -> pitch, so key-up releases the right note
let litRaf = 0;
function setLit(pitch, on) {
  const c = (lit.get(pitch) || 0) + (on ? 1 : -1);
  if (c > 0) lit.set(pitch, c);
  else lit.delete(pitch);
  if (!litRaf)
    litRaf = requestAnimationFrame(() => {
      litRaf = 0;
      drawRoll();
    });
}

export function drawRoll(playStep = lastPlayStep) {
  lastPlayStep = playStep;
  if (!canvas || $("#modal-roll").classList.contains("hidden")) return;
  const W = KEY_W + rollLength() * CELL_W,
    H = ROWS * CELL_H;
  const synth = SYNTH_BANK[store.instrument(inst).synthId];
  ctx2d.clearRect(0, 0, W, H);

  for (let r = 0; r < ROWS; r++) {
    const midi = HIGH - r;
    const y = r * CELL_H;
    const on = lit.has(midi);
    ctx2d.fillStyle = on ? synth.color : isBlack(midi) ? "#1a222d" : "#d7e0ea";
    ctx2d.fillRect(0, y, KEY_W, CELL_H - 1);
    if (midi % 12 === 0) {
      ctx2d.fillStyle = isBlack(midi) ? "#7b8794" : "#26303d";
      ctx2d.font = '9px "IBM Plex Mono", monospace';
      ctx2d.fillText(midiName(midi), 4, y + 9);
    }
    ctx2d.fillStyle = isBlack(midi) ? "#0d1319" : "#121820";
    ctx2d.fillRect(KEY_W, y, rollLength() * CELL_W, CELL_H - 1);
    if (on) {
      ctx2d.globalAlpha = 0.22;
      ctx2d.fillStyle = synth.color;
      ctx2d.fillRect(KEY_W, y, rollLength() * CELL_W, CELL_H - 1);
      ctx2d.globalAlpha = 1;
    }
  }
  for (let s = 0; s <= rollLength(); s++) {
    const x = KEY_W + s * CELL_W;
    ctx2d.fillStyle =
      s % 16 === 0 ? "#39424e" : s % 4 === 0 ? "#242e3a" : "#1a222d";
    ctx2d.fillRect(x, 0, 1, H);
  }

  // notes: opacity tracks velocity, white ring = selected, white fill = accent (vel>1)
  for (const n of notes()) {
    const r = HIGH - n.pitch;
    if (r < 0 || r >= ROWS) continue;
    const x = KEY_W + (n.step-editOffset()) * CELL_W + 1,
      y = r * CELL_H + 1;
    const w = n.dur * CELL_W - 2,
      h = CELL_H - 3;
    ctx2d.globalAlpha = clamp(0.25 + 0.75 * Math.min(1, n.vel), 0.25, 1);
    ctx2d.fillStyle = n.vel > 1 ? "#ffffff" : synth.color;
    ctx2d.fillRect(x, y, w, h);
    ctx2d.globalAlpha = 1;
    // velocity tick (small bar at note base)
    ctx2d.fillStyle = "rgba(0,0,0,0.45)";
    ctx2d.fillRect(x, y + h - 2, (w * clamp(n.vel, 0, 1.27)) / 1.27, 2);
    if (selection.has(n)) {
      ctx2d.strokeStyle = "#ffffff";
      ctx2d.lineWidth = 1.5;
      ctx2d.strokeRect(x - 0.5, y - 0.5, w + 1, h + 1);
    }
  }

  // marquee rectangle
  if (drag?.mode === "marquee") {
    const { x0, y0, x1, y1 } = drag;
    ctx2d.strokeStyle = "rgba(67,255,164,0.9)";
    ctx2d.setLineDash([4, 3]);
    ctx2d.strokeRect(
      Math.min(x0, x1),
      Math.min(y0, y1),
      Math.abs(x1 - x0),
      Math.abs(y1 - y0),
    );
    ctx2d.setLineDash([]);
    ctx2d.fillStyle = "rgba(67,255,164,0.08)";
    ctx2d.fillRect(
      Math.min(x0, x1),
      Math.min(y0, y1),
      Math.abs(x1 - x0),
      Math.abs(y1 - y0),
    );
  }

  if (playStep >= 0) {
    ctx2d.fillStyle = "rgba(67,255,164,0.22)";
    ctx2d.fillRect(KEY_W + playStep * CELL_W, 0, CELL_W, H);
  }
}

// --------------------------------------------------------------- hit testing
function eventXY(e) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (e.clientX - rect.left) * (canvas.width / rect.width),
    y: (e.clientY - rect.top) * (canvas.height / rect.height),
  };
}

function gridPos(x, y) {
  return {
    step: Math.floor((x-KEY_W)/CELL_W/gridSteps())*gridSteps()+editOffset(),
    pitch: HIGH - Math.floor(y / CELL_H),
  };
}

function noteAtXY(x, y) {
  const { step, pitch } = gridPos(x, y);
  for (let i = notes().length - 1; i >= 0; i--) {
    const n = notes()[i];
    if (n.pitch === pitch && step >= n.step && step < n.step + n.dur) return n;
  }
  return null;
}

function onRightEdge(n, x) {
  const edgeX = KEY_W + (n.step + n.dur-editOffset()) * CELL_W;
  return x > edgeX - RESIZE_PX && x <= edgeX + 2;
}

// --------------------------------------------------------------- mouse editing
function onMouseDown(e) {
  if (e.button === 2) return; // handled in contextmenu
  const { x, y } = eventXY(e);
  if (x < KEY_W) return;

  const n = noteAtXY(x, y);
  if (n) {
    if (!selection.has(n)) {
      if (!e.shiftKey) selection.clear();
      selection.add(n);
    } else if (e.shiftKey) {
      selection.delete(n);
      drawRoll();
      return;
    }
    // Alt/Option + drag = duplicate the selection and move the copies
    if (e.altKey && !onRightEdge(n, x)) {
      const clones = [...selection].map((m) => ({ ...m }));
      for (const c of clones) {c.id=newId('note');notes().push(c);}
      selection = new Set(clones);
      commit();
      setRollStatus(
        `Duplicated ${clones.length} note${clones.length === 1 ? "" : "s"} — drag to place.`,
      );
    }
    const snapshot = [...selection].map((m) => ({
      ref: m,
      step: m.step,
      dur: m.dur,
      pitch: m.pitch,
    }));
    drag = onRightEdge(n, x)
      ? { mode: "resize", startX: x, snapshot, moved: false }
      : { mode: "move", startX: x, startY: y, snapshot, moved: false };
  } else {
    drag = {
      mode: "marquee",
      x0: x,
      y0: y,
      x1: x,
      y1: y,
      additive: e.shiftKey,
      moved: false,
    };
  }
  drawRoll();
}

function onMouseMove(e) {
  const { x, y } = eventXY(e);
  // cursor feedback
  if (!drag) {
    const n = noteAtXY(x, y);
    canvas.style.cursor = n
      ? onRightEdge(n, x)
        ? "ew-resize"
        : "move"
      : x < KEY_W
        ? "pointer"
        : "cell";
  }
  if (!drag) return;
  const dSteps = Math.round((x - (drag.startX ?? 0)) / CELL_W / gridSteps())*gridSteps();
  if (drag.mode === "move") {
    const dPitch = -Math.round((y - drag.startY) / CELL_H);
    if (dSteps || dPitch) drag.moved = true;
    for (const s of drag.snapshot) {
      s.ref.step = clamp(s.step + dSteps, editOffset(), editOffset()+rollLength() - s.ref.dur);
      s.ref.pitch = clamp(s.pitch + dPitch, LOW, HIGH);
    }
    drawRoll();
  } else if (drag.mode === "resize") {
    if (dSteps) drag.moved = true;
    for (const s of drag.snapshot) {
      s.ref.dur = clamp(s.dur + dSteps, gridSteps(), editOffset()+rollLength() - s.ref.step);
    }
    drawRoll();
  } else if (drag.mode === "marquee") {
    drag.x1 = x;
    drag.y1 = y;
    if (Math.abs(drag.x1 - drag.x0) + Math.abs(drag.y1 - drag.y0) > 6)
      drag.moved = true;
    drawRoll();
  }
}

function onMouseUp(e) {
  if (!drag) return;
  const d = drag;
  drag = null;
  if (d.mode === "marquee") {
    if (!d.moved) {
      // plain click on empty grid → add a note
      const { x, y } = eventXY(e);
      const { step, pitch } = gridPos(x, y);
      if (step >= editOffset() && step < editOffset()+rollLength() && pitch >= LOW && pitch <= HIGH) {
        const note = {
          step,
          dur: Math.min(noteDur, editOffset()+rollLength() - step),
          pitch,
          vel: e.shiftKey ? 1.27 : 1,
        };
        addEditorNote(note);
        selection.clear();
        selection.add(note);
        engine.triggerNote(
          inst,
          pitch,
          note.vel,
          0,
          note.dur * engine.stepDuration(),
        );
      }
    } else {
      // marquee select
      if (!d.additive) selection.clear();
      const sx = Math.min(d.x0, d.x1),
        ex = Math.max(d.x0, d.x1);
      const sy = Math.min(d.y0, d.y1),
        ey = Math.max(d.y0, d.y1);
      for (const n of notes()) {
        const nx0 = KEY_W + (n.step-editOffset()) * CELL_W,
          nx1 = nx0 + n.dur * CELL_W;
        const ny0 = (HIGH - n.pitch) * CELL_H,
          ny1 = ny0 + CELL_H;
        if (nx1 > sx && nx0 < ex && ny1 > sy && ny0 < ey) selection.add(n);
      }
      setRollStatus(
        `${selection.size} note${selection.size === 1 ? "" : "s"} selected.`,
      );
    }
  } else if (d.moved) {
    commit(); // move/resize finished
  }
  drawRoll();
}

function onDblClick(e) {
  // split note at the clicked cell boundary
  const { x, y } = eventXY(e);
  const n = noteAtXY(x, y);
  if (!n || n.dur < 2) return;
  const { step } = gridPos(x, y);
  const splitAt = clamp(step, n.step + 1, n.step + n.dur - 1);
  const tail = {
    step: splitAt,
    dur: n.step + n.dur - splitAt,
    pitch: n.pitch,
    vel: n.vel,
  };
  n.dur = splitAt - n.step;
  addEditorNote(tail);
  selection.clear();
  selection.add(n);
  selection.add(tail);
  setRollStatus("Note split.");
  drawRoll();
}

function onContextMenu(e) {
  e.preventDefault();
  const { x, y } = eventXY(e);
  const n = noteAtXY(x, y);
  if (!n) {
    selection.clear();
    drawRoll();
    return;
  }
  if (selection.has(n) && selection.size > 1) {
    deleteSelection();
  } else {
    const idx = notes().indexOf(n);
    if (idx >= 0) {notes().splice(idx,1);commit();}
    selection.delete(n);
  }
  drawRoll();
}

function onWheel(e) {
  if (!e.shiftKey) return; // plain wheel = scroll container
  e.preventDefault();
  const { x, y } = eventXY(e);
  const target = noteAtXY(x, y);
  const set =
    selection.size && (!target || selection.has(target))
      ? selection
      : target
        ? new Set([target])
        : null;
  if (!set) return;
  const delta = e.deltaY < 0 ? 0.08 : -0.08;
  for (const n of set) n.vel = clamp(+(n.vel + delta).toFixed(2), 0.1, 1.27);
  commit();
  setRollStatus(
    `Velocity ${e.deltaY < 0 ? "+" : "−"} (${[...set][0].vel.toFixed(2)})`,
  );
  drawRoll();
}

// --------------------------------------------------------------- selection ops
function deleteSelection() {
  if (!selection.size) return;
  setEditorNotes(notes().filter((n) => !selection.has(n)));
  setRollStatus(`Deleted ${selection.size} notes.`);
  selection.clear();
  drawRoll();
}

function copySelection() {
  const src = selection.size ? [...selection] : notes();
  if (!src.length) return setRollStatus("Nothing to copy.");
  clipboard = src.map((n) => ({ ...n }));
  setRollStatus(`Copied ${clipboard.length} notes.`);
}

function pasteClipboard() {
  if (!clipboard?.length) return setRollStatus("Clipboard empty.");
  const pasted = clipboard.map((n) => ({ ...n }));
  for (const n of pasted) addEditorNote(n);
  selection = new Set(pasted);
  setRollStatus(`Pasted ${pasted.length} notes — drag to position them.`);
  drawRoll();
}

function nudgeSelection(dStep, dPitch, dVel) {
  if (!selection.size) return;
  for (const n of selection) {
    if (dStep) n.step = clamp(n.step + dStep*gridSteps(), editOffset(), editOffset()+rollLength() - n.dur);
    if (dPitch) n.pitch = clamp(n.pitch + dPitch, LOW, HIGH);
    if (dVel) n.vel = clamp(+(n.vel + dVel).toFixed(2), 0.1, 1.27);
  }
  commit();
  drawRoll();
}

// --------------------------------------------------------------- synth panel
function renderSynthPanel() {
  const instr = store.instrument(inst);
  const synth = SYNTH_BANK[instr.synthId];
  const panel = $("#roll-synth-panel");
  panel.innerHTML = "";
  panel.style.setProperty("--synth-color", synth.color);
  panel.className = `synth-panel synth-${instr.synthId}`;

  const head = document.createElement("div");
  head.className = "synth-head";
  head.innerHTML = `<span class="synth-name">${synth.name}</span><span class="synth-tag">${synth.tagline}</span>`;
  if (synth) {
    const open = document.createElement("button");
    open.className = "synth-open-panel";
    open.textContent = "🎛 Open synth panel";
    open.title = "Hardware-style pots & faders";
    open.addEventListener("click", () =>
      document.dispatchEvent(new CustomEvent("open-synth-panel", { detail: inst })),
    );
    head.appendChild(open);
  }
  panel.appendChild(head);

  const params = { ...synthDefaults(instr.synthId), ...(instr.params || {}) };
  const grid = document.createElement("div");
  grid.className = "synth-params";
  synth.params.forEach((p) => {
    const wrap = document.createElement("label");
    wrap.className = "synth-param";
    const lab = document.createElement("span");
    lab.textContent = p.label;
    let input;
    if (p.type === "select") {
      input = document.createElement("select");
      p.options.forEach((o) => {
        const opt = document.createElement("option");
        opt.value = o;
        opt.textContent = o;
        input.appendChild(opt);
      });
      input.value = params[p.key];
    } else {
      input = document.createElement("input");
      input.type = "range";
      input.min = p.min;
      input.max = p.max;
      input.step = p.step;
      input.value = params[p.key];
    }
    const val = document.createElement("span");
    val.className = "synth-val";
    val.textContent = params[p.key];
    input.dataset.param = p.key;
    input.addEventListener("input", () => {
      const v = p.type === "select" ? input.value : +input.value;
      const cur = {
        ...synthDefaults(store.instrument(inst).synthId),
        ...(store.instrument(inst).params || {}),
      };
      cur[p.key] = v;
      store.setInstrumentProp(inst, "params", cur);
      val.textContent = v;
    });
    wrap.append(lab, input, val);
    grid.appendChild(wrap);
  });
  panel.appendChild(grid);
}

function renderLineSelect() {
  const synth = SYNTH_BANK[store.instrument(inst).synthId];
  const sel = $("#roll-lines");
  sel.innerHTML = '<option value="">— preset lines —</option>';
  synth.lines.forEach((l, i) => {
    const o = document.createElement("option");
    o.value = i;
    o.textContent = l.name;
    sel.appendChild(o);
  });
}

// --------------------------------------------------------------- keyboard



function onKeyDown(e) {
  if ($("#modal-roll").classList.contains("hidden")) return;
  if (e.target.matches?.("input, select, textarea, [contenteditable]")) return;

  // editing shortcuts
  const mod = e.metaKey || e.ctrlKey;
  if (mod && e.key === "c") {
    e.preventDefault();
    return copySelection();
  }
  if (mod && e.key === "v") {
    e.preventDefault();
    return pasteClipboard();
  }
  if (mod && e.key === "a") {
    e.preventDefault();
    selection = new Set(notes());
    setRollStatus(`${selection.size} notes selected.`);
    return drawRoll();
  }
  if (e.key === "Delete" || e.key === "Backspace") {
    e.preventDefault();
    return deleteSelection();
  }
  if (e.key.startsWith("Arrow") && selection.size) {
    e.preventDefault();
    if (e.key === "ArrowLeft") return nudgeSelection(-1, 0, 0);
    if (e.key === "ArrowRight") return nudgeSelection(1, 0, 0);
    if (e.key === "ArrowUp")
      return e.shiftKey ? nudgeSelection(0, 0, 0.08) : nudgeSelection(0, 1, 0);
    if (e.key === "ArrowDown")
      return e.shiftKey
        ? nudgeSelection(0, 0, -0.08)
        : nudgeSelection(0, -1, 0);
  }

  if (e.repeat) return;
  const k = e.key.toLowerCase();
  if (mod) return; // let global shortcuts (undo/redo) through
  if ((k === "z" || k === "x") && drumKeyboard(store.instrument(inst))) return;
  if (k === "z") {
    return setRollStatus(`Octave: C${setOctave(getOctave() - 1)}`);
  }
  if (k === "x") {
    return setRollStatus(`Octave: C${setOctave(getOctave() + 1)}`);
  }
  if (!(k in KEYMAP)) return;
  const pitch = performancePitch(store.instrument(inst), KEYMAP[k], getOctave());
  if (pitch == null || pitch < LOW || pitch > HIGH) return;
  e.preventDefault();
  e.stopImmediatePropagation();
  heldTyped.set(k, pitch);
  noteOn(`roll:key:${k}`, inst, pitch, TYPED_VEL);
}

function setRollStatus(msg) {
  $("#roll-status").textContent = msg;
}

const recording = new Map();
const recordingTakes = new Map();
let recordingTransaction = false;
const rollVisible = () => !$("#modal-roll").classList.contains("hidden");
function endRecordingTransactionIfIdle() {
  if (!recording.size && recordingTransaction) {
    recordingTransaction = false;
    endTransaction();
  }
}
function recordFinish(src, time = engine.ctx?.currentTime || 0) {
  const held = recording.get(src);
  if (!held) return;
  recording.delete(src);
  clearTimeout(held.timer);
  const index = store.project.instruments.findIndex(t => t.id === held.trackId);
  const inputEnd = Math.min(time, held.inputEnd ?? Infinity);
  if (held.project !== store.project || index < 0 || inputEnd < held.inputTime) {
    endRecordingTransactionIfIdle();
    return; // project changed, or a queued arp pulse was cancelled before it sounded
  }
  const end = inputEnd + held.clockShift;
  let segments = engine.getTransportSegments?.(held.time, end) || [];
  if (!segments.length && held.position?.playing) segments.push({ sequenceIndex: held.position.sequenceIndex, startStep: held.position.step, endStep: Math.min(NUM_STEPS, held.position.step + Math.max(1/960, (inputEnd-held.inputTime)/engine.stepDuration())) });
  const punch=store.project.timeline.punch;
  if(punch.enabled)segments=segments.map(s=>({...s,startStep:Math.max(s.startStep,(punch.start-s.sequenceIndex*16)*4),endStep:Math.min(s.endStep,(punch.end-s.sequenceIndex*16)*4)})).filter(s=>s.endStep>s.startStep);
  const settings=store.project.recording;
  const notes = quantizeRecordedSpan(segments, held.pitch, held.vel, NUM_STEPS,{grid:settings.quantize,strength:settings.strength,tieId:held.noteId,expression:held.expression});
  if (!notes.length) { endRecordingTransactionIfIdle(); return; }
  const owner=store.instrument(index);let take=recordingTakes.get(owner.id);
  if(!take){take={id:newId('take'),name:`Take ${(owner.takes?.length||0)+1}`,createdAt:Date.now(),notes:[],clipIds:[],cleared:[]};(owner.takes||=[]).push(take);owner.activeTakeId=take.id;recordingTakes.set(owner.id,take);}
  for (const { sequenceIndex, note } of notes) {
    note.id=newId('note');take.notes.push({sequenceIndex,note:structuredClone(note)});
    if(store.project.timeline.enabled){
      let clip=store.project.timeline.clips.find(c=>c.takeId===take.id&&c.trackId===owner.id&&c.start===sequenceIndex*16);
      if(!clip){clip=store.addClip({trackId:owner.id,type:'midi',start:sequenceIndex*16,duration:16,notes:[],takeId:take.id});take.clipIds.push(clip.id);}
      clip.notes.push(note);
    }else{
      while(store.project.sequences.length<=sequenceIndex){const seq=makeSequence(store.numChannels);while(seq.notes.length<store.project.instruments.length)seq.notes.push([]);store.project.sequences.push(seq);}
      const seq=store.project.sequences[sequenceIndex];
      if(settings.mode!=='overdub'&&!take.cleared.includes(sequenceIndex)){seq.notes[index]=[];take.cleared.push(sequenceIndex);}
      seq.notes[index].push(note);
    }
  }
  store.emit("notes", index,{historyPaths:[['sequences'],['timeline'],['instruments',index,'takes'],['instruments',index,'activeTakeId']]});
  endRecordingTransactionIfIdle();
  drawRoll();
}
function finishRecording(time) {
  for (const src of [...recording.keys()]) recordFinish(src, time);
  if (recordingTransaction) { recordingTransaction = false; endTransaction(); }
}
function onLiveNote({ detail: n }) {
  if (!n.on) return recordFinish(n.src, n.time);
  const owner = store.instrument(n.inst);
  if (!owner?.armed) return;
  if (!engine.isPlaying) {
    void engine.playFromEditor({firstNoteTime:n.time}).catch(error => {
      if (engine._transportPreparing) engine.pause();
      document.dispatchEvent(new CustomEvent('audio-error', {detail:{message:error.message}}));
    });
  }
  const time = engine.recordingInputTime(n.time), position = engine.getTransportPosition(time);
  if (!engine.isPlaying || !position.playing) return;
  recordFinish(n.src, n.time);
  if (!recordingTransaction) { beginTransaction(); recordingTransaction = true; }
  const held = { ...n, time, inputTime:n.time, clockShift:time-n.time, trackId:owner.id,
    noteId:newId('performance'),expression:[{offset:0,type:'bend',value:n.bend||0}],project:store.project,position,timer:0 };
  if (Number.isFinite(n.duration)) {
    held.inputEnd = n.time + n.duration;
    held.timer = setTimeout(() => recordFinish(n.src, held.inputEnd), Math.max(0, (held.inputEnd - engine.ctx.currentTime) * 1000));
  }
  recording.set(n.src, held);
}
function releaseRollInputs() {
  for(const [src,held] of recording)if(src.startsWith('roll:')||!store.track(held.trackId)?.armed)recordFinish(src);
  allOff("roll:");
  heldTyped.clear();
  lit.clear();
}
export function closeRoll() {
  releaseRollInputs();
  $("#modal-roll").classList.add("hidden");
}
function refreshRoll() {
  selection.clear();
  drag = null;
  if (!store.instrument(inst)) inst = 0;
  if (!rollVisible()) return;
  const instrument = store.instrument(inst);
  syncRollRecordControls();
  $("#roll-title").textContent = `${instrument.name} — MIDI Roll`;
  $("#roll-synth-select").value = instrument.synthId;
  renderSynthPanel();
  renderLineSelect();
  drawRoll();
}

function paintMidi() {
  const { on, names, error } = midiStatus();
  const b = $("#roll-midi");
  if (b) b.textContent = on ? "MIDI input: on" : "Enable MIDI input";
  b?.classList.toggle("on", on);
  if ($("#modal-roll").classList.contains("hidden")) return;
  setRollStatus(
    error ||
      (!on
        ? "MIDI input disabled."
        : names.length
          ? `MIDI in: ${names.join(", ")}. Arm REC and play to capture notes.`
          : "MIDI is on, but no controller was found — plug one in and it connects automatically."),
  );
}

// --------------------------------------------------------------- modal lifecycle
function syncRollRecordControls() {
  const id = store.instrument(inst)?.id;
  bindRecordArm($('#roll-rec'), id);
  if (armHint) bindRecordHint(armHint, id);
  if (quantizeTools) setQuantizeTrack(quantizeTools, id);
}
export function openRoll(i) {
  editingClipId=null;
  if (inst !== i) releaseRollInputs();
  inst = i;
  setMidiTarget(i);
  ensureMidi();
  lit.clear();
  selection.clear();
  engine.ensureContext();
  $("#roll-title").textContent = `${store.instrument(i).name} — MIDI Roll`;
  $("#roll-synth-select").value = store.instrument(i).synthId;
  renderSynthPanel();
  renderLineSelect();
  $("#modal-roll").classList.remove("hidden");
  canvas.width=KEY_W+rollLength()*CELL_W;
  syncRollRecordControls();
  $('.roll-scroll').scrollTop=(HIGH-76)*CELL_H;
  drawRoll(-1);
  setRollStatus(
    "Click = add · drag empty = select · drag note = move · alt+drag = duplicate · drag right edge = resize · dbl-click = split · right-click = delete · shift+wheel / shift+↑↓ = velocity · ⌘C/⌘V copy-paste · arrows nudge · A–L play (Z/X octave)",
  );
}
export function openClipRoll(clipId){const clip=store.project.timeline.clips.find(c=>c.id===clipId),i=store.project.instruments.findIndex(t=>t.id===clip?.trackId);if(!clip||i<0)return false;if(clip.type==='pattern'){const si=store.project.sequences.findIndex(s=>s.id===clip.sequenceId);if(si>=0)store.selectSequence(si);openRoll(i);return true;}if(clip.type!=='midi')return false;openRoll(i);editingClipId=clip.id;canvas.width=KEY_W+rollLength()*CELL_W;$('#roll-title').textContent=`${store.instrument(i).name} — MIDI clip`;drawRoll();return true;}

export function initPianoRoll() {
  canvas = $("#roll-canvas");
  canvas.width = KEY_W + NUM_STEPS * CELL_W;
  canvas.height = ROWS * CELL_H;
  ctx2d = canvas.getContext("2d");

  attachKeyboard(canvas, {
    inst:()=>inst, velAt:()=>TYPED_VEL, prefix:"roll:pointer:",
    hitTest:e=>{const {x,y}=eventXY(e),pitch=gridPos(x,y).pitch;
      return x>=0&&x<KEY_W&&y>=0&&pitch>=LOW&&pitch<=HIGH?{midi:pitch,el:canvas}:null;},
    keyAt:()=>null
  });
  canvas.addEventListener("mousedown", onMouseDown);
  canvas.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onMouseUp);
  canvas.addEventListener("dblclick", onDblClick);
  canvas.addEventListener("contextmenu", onContextMenu);
  canvas.addEventListener("wheel", onWheel, { passive: false });

  const sel = $("#roll-synth-select");
  createSynthPicker(sel, SYNTH_BANK, { cls: "roll-picker" }); // folder tree, wraps the select
  sel.addEventListener("change", () => {
    ensureMidi();
    releaseRollInputs();
    changeSynth(inst, sel.value);
    refreshRoll();
  });

  $("#roll-dur").addEventListener("change", (e) => {
    noteDur = +e.target.value;
  });

  $("#roll-lines").addEventListener("change", (e) => {
    const synth = SYNTH_BANK[store.instrument(inst).synthId];
    const line = synth.lines[+e.target.value];
    if (!line) return;
    setEditorNotes(parseLine(line.dsl));
    selection.clear();
    drawRoll();
    setRollStatus(`Loaded line "${line.name}" — press Play to hear it.`);
  });

  $("#roll-copy").addEventListener("click", copySelection);
  $("#roll-paste").addEventListener("click", pasteClipboard);

  armHint = document.createElement('span');
  armHint.className = 'record-arm-hint';
  quantizeTools = makeQuantizeControls(store.instrument(inst)?.id, {
    showStrength:true,
    onApply:(grid, strength) => {
      for (const note of selection.size ? selection : notes()) note.id ||= newId('note');
      const count = store.quantizeNotes(inst, grid, strength, selection.size ? [...selection].map(n => n.id) : null, {clipId:editingClipId});
      drawRoll();
      setRollStatus(count ? 'Updated timing for ' + count + ' MIDI notes. Off restores original timing.' : 'No notes to quantize.');
      return count;
    }
  });
  $("#roll-rec").after(armHint, quantizeTools);
  syncRollRecordControls();
  $("#roll-clear").addEventListener("click", () => {
    for(const [src,held] of recording)if(held.trackId===store.instrument(inst)?.id){clearTimeout(held.timer);recording.delete(src);}
    if(!recording.size&&recordingTransaction){recordingTransaction=false;endTransaction();}
    selection.clear();
    setEditorNotes([]);
    drawRoll();
  });
  $("#roll-close").addEventListener("click", closeRoll);
  $("#roll-midi").addEventListener("click", () => setMidiEnabled(!isMidiOn()));
  document.addEventListener("live-note", onLiveNote);
  document.addEventListener('live-expression',({detail:e})=>{for(const [src,held]of recording)if(src.startsWith(e.prefix)&&e.time>=held.inputTime){const segments=engine.getTransportSegments(held.time,e.time+held.clockShift),offset=segments.reduce((sum,s)=>sum+(s.endStep-s.startStep)/4,0);held.expression.push({offset,type:e.type,value:e.value,...(e.controller!=null&&{controller:e.controller})});}});
  document.addEventListener('transport',({detail})=>{if(detail.playing)recordingTakes.clear();});
  document.addEventListener("midi-status", paintMidi);
  paintMidi();

  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("keyup", (e) => {
    const k = e.key.toLowerCase();
    if (heldTyped.has(k)) {
      noteOff(`roll:key:${k}`);
      heldTyped.delete(k);
    }
  });
  window.addEventListener("blur", releaseRollInputs);
  document.addEventListener("transport-stop", ({detail}) => finishRecording(detail?.time));
  document.addEventListener("performance-reset", ({detail}) => {
    if (detail?.prefix || detail?.sources) {
      for (const src of [...recording.keys()]) if (
        (detail.prefix && src.startsWith(detail.prefix)) || detail.sources?.includes(src)
      ) recordFinish(src);
    } else finishRecording();
  });
  new MutationObserver(() => { if (!rollVisible()) releaseRollInputs(); }).observe($("#modal-roll"), { attributes: true, attributeFilter: ["class"] });
  document.addEventListener("instrument-target", ({ detail }) => {
    if (rollVisible() && inst !== detail.i) { releaseRollInputs(); inst = detail.i; refreshRoll(); }
  });
  store.on("load", () => { for(const held of recording.values())clearTimeout(held.timer);recording.clear();recordingTakes.clear();if(recordingTransaction){recordingTransaction=false;endTransaction();}releaseRollInputs(); refreshRoll(); });
  store.on("instrument", ({ i, prop }) => {
    if (prop === 'armed' && !store.instrument(i)?.armed) {
      for (const [src, held] of recording) if (held.trackId === store.instrument(i)?.id) recordFinish(src);
    }
    if (i !== inst || !rollVisible()) return;
    if (["synthId", "name"].includes(prop)) refreshRoll();
    if (prop === "params") {
      const params = { ...synthDefaults(store.instrument(inst).synthId), ...(store.instrument(inst).params || {}) };
      $("#roll-synth-panel").querySelectorAll("[data-param]").forEach(input => {
        input.value = params[input.dataset.param];
        input.parentElement.querySelector(".synth-val").textContent = input.value;
      });
    }
  });
  document.addEventListener("synth-note", (e) => {
    if (e.detail.i === inst) setLit(e.detail.pitch, e.detail.on);
  });
  store.on("sequence", () => {
    selection.clear();
    drawRoll();
  });
  store.on("notes", () => drawRoll());
  store.on('project',({prop}={})=>{if(prop==='timeline'&&editingClipId){if(!editingClip())editingClipId=null;drawRoll();}});
}

export function rollPlayhead(step) {
  drawRoll(editingClip()?(engine.getMusicalPosition().beat-editingClip().start)*4:step);
}

export function activeRollInstrument() {
  return inst;
}
