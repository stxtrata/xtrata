// pianoroll.js — canvas piano-roll MIDI editor for instrument channels.
// Editing toolkit: marquee drag-selection, move (all directions), resize (drag right
// edge), split (double-click), velocity editing (shift+wheel / shift+↑↓), nudge with
// arrows, copy/paste, per-synth parameter panels, preset lines, keyboard playing and
// live recording.

import { store, NUM_STEPS } from './state.js';
import { engine } from './engine.js';
import { SYNTH_BANK, synthDefaults, parseLine } from './synths.js';

const $ = s => document.querySelector(s);

const LOW = 21;   // A0
const HIGH = 96;  // C7
const ROWS = HIGH - LOW + 1;
const CELL_W = 14, CELL_H = 12, KEY_W = 44;
const RESIZE_PX = 5; // grab zone at note's right edge

let inst = 0;
let noteDur = 2;
let recArmed = false;
let canvas, ctx2d;

// --- editing state ---
let selection = new Set();          // note object references
let drag = null;                    // { mode:'move'|'resize'|'marquee', ... }
let clipboard = null;
let lastPlayStep = -1;

const isBlack = m => [1, 3, 6, 8, 10].includes(m % 12);
const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const midiName = m => NOTE_NAMES[m % 12] + (Math.floor(m / 12) - 1);
const notes = () => store.seq.notes[inst] || [];
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

function commit() { store.emit('notes', inst); }

// --------------------------------------------------------------- drawing
export function drawRoll(playStep = lastPlayStep) {
  lastPlayStep = playStep;
  if (!canvas || $('#modal-roll').classList.contains('hidden')) return;
  const W = KEY_W + NUM_STEPS * CELL_W, H = ROWS * CELL_H;
  const synth = SYNTH_BANK[store.instrument(inst).synthId];
  ctx2d.clearRect(0, 0, W, H);

  for (let r = 0; r < ROWS; r++) {
    const midi = HIGH - r;
    const y = r * CELL_H;
    ctx2d.fillStyle = isBlack(midi) ? '#1a222d' : '#d7e0ea';
    ctx2d.fillRect(0, y, KEY_W, CELL_H - 1);
    if (midi % 12 === 0) {
      ctx2d.fillStyle = isBlack(midi) ? '#7b8794' : '#26303d';
      ctx2d.font = '9px "IBM Plex Mono", monospace';
      ctx2d.fillText(midiName(midi), 4, y + 9);
    }
    ctx2d.fillStyle = isBlack(midi) ? '#0d1319' : '#121820';
    ctx2d.fillRect(KEY_W, y, NUM_STEPS * CELL_W, CELL_H - 1);
  }
  for (let s = 0; s <= NUM_STEPS; s++) {
    const x = KEY_W + s * CELL_W;
    ctx2d.fillStyle = s % 16 === 0 ? '#39424e' : s % 4 === 0 ? '#242e3a' : '#1a222d';
    ctx2d.fillRect(x, 0, 1, H);
  }

  // notes: opacity tracks velocity, white ring = selected, white fill = accent (vel>1)
  for (const n of notes()) {
    const r = HIGH - n.pitch;
    if (r < 0 || r >= ROWS) continue;
    const x = KEY_W + n.step * CELL_W + 1, y = r * CELL_H + 1;
    const w = n.dur * CELL_W - 2, h = CELL_H - 3;
    ctx2d.globalAlpha = clamp(0.25 + 0.75 * Math.min(1, n.vel), 0.25, 1);
    ctx2d.fillStyle = n.vel > 1 ? '#ffffff' : synth.color;
    ctx2d.fillRect(x, y, w, h);
    ctx2d.globalAlpha = 1;
    // velocity tick (small bar at note base)
    ctx2d.fillStyle = 'rgba(0,0,0,0.45)';
    ctx2d.fillRect(x, y + h - 2, w * clamp(n.vel, 0, 1.27) / 1.27, 2);
    if (selection.has(n)) {
      ctx2d.strokeStyle = '#ffffff';
      ctx2d.lineWidth = 1.5;
      ctx2d.strokeRect(x - 0.5, y - 0.5, w + 1, h + 1);
    }
  }

  // marquee rectangle
  if (drag?.mode === 'marquee') {
    const { x0, y0, x1, y1 } = drag;
    ctx2d.strokeStyle = 'rgba(67,255,164,0.9)';
    ctx2d.setLineDash([4, 3]);
    ctx2d.strokeRect(Math.min(x0, x1), Math.min(y0, y1), Math.abs(x1 - x0), Math.abs(y1 - y0));
    ctx2d.setLineDash([]);
    ctx2d.fillStyle = 'rgba(67,255,164,0.08)';
    ctx2d.fillRect(Math.min(x0, x1), Math.min(y0, y1), Math.abs(x1 - x0), Math.abs(y1 - y0));
  }

  if (playStep >= 0) {
    ctx2d.fillStyle = 'rgba(67,255,164,0.22)';
    ctx2d.fillRect(KEY_W + playStep * CELL_W, 0, CELL_W, H);
  }
}

// --------------------------------------------------------------- hit testing
function eventXY(e) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (e.clientX - rect.left) * (canvas.width / rect.width),
    y: (e.clientY - rect.top) * (canvas.height / rect.height)
  };
}

function gridPos(x, y) {
  return { step: Math.floor((x - KEY_W) / CELL_W), pitch: HIGH - Math.floor(y / CELL_H) };
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
  const edgeX = KEY_W + (n.step + n.dur) * CELL_W;
  return x > edgeX - RESIZE_PX && x <= edgeX + 2;
}

// --------------------------------------------------------------- mouse editing
function onMouseDown(e) {
  if (e.button === 2) return; // handled in contextmenu
  const { x, y } = eventXY(e);
  if (x < KEY_W) { // keyboard strip: preview
    const { pitch } = gridPos(x, y);
    if (pitch >= LOW && pitch <= HIGH) engine.triggerNote(inst, pitch, 1, 0, noteDur * engine.stepDuration());
    return;
  }
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
      const clones = [...selection].map(m => ({ ...m }));
      for (const c of clones) store.seq.notes[inst].push(c);
      selection = new Set(clones);
      commit();
      setRollStatus(`Duplicated ${clones.length} note${clones.length === 1 ? '' : 's'} — drag to place.`);
    }
    const snapshot = [...selection].map(m => ({ ref: m, step: m.step, dur: m.dur, pitch: m.pitch }));
    drag = onRightEdge(n, x)
      ? { mode: 'resize', startX: x, snapshot, moved: false }
      : { mode: 'move', startX: x, startY: y, snapshot, moved: false };
  } else {
    drag = { mode: 'marquee', x0: x, y0: y, x1: x, y1: y, additive: e.shiftKey, moved: false };
  }
  drawRoll();
}

function onMouseMove(e) {
  const { x, y } = eventXY(e);
  // cursor feedback
  if (!drag) {
    const n = noteAtXY(x, y);
    canvas.style.cursor = n ? (onRightEdge(n, x) ? 'ew-resize' : 'move') : (x < KEY_W ? 'pointer' : 'cell');
  }
  if (!drag) return;
  const dSteps = Math.round((x - (drag.startX ?? 0)) / CELL_W);
  if (drag.mode === 'move') {
    const dPitch = -Math.round((y - drag.startY) / CELL_H);
    if (dSteps || dPitch) drag.moved = true;
    for (const s of drag.snapshot) {
      s.ref.step = clamp(s.step + dSteps, 0, NUM_STEPS - s.ref.dur);
      s.ref.pitch = clamp(s.pitch + dPitch, LOW, HIGH);
    }
    drawRoll();
  } else if (drag.mode === 'resize') {
    if (dSteps) drag.moved = true;
    for (const s of drag.snapshot) {
      s.ref.dur = clamp(s.dur + dSteps, 1, NUM_STEPS - s.ref.step);
    }
    drawRoll();
  } else if (drag.mode === 'marquee') {
    drag.x1 = x; drag.y1 = y;
    if (Math.abs(drag.x1 - drag.x0) + Math.abs(drag.y1 - drag.y0) > 6) drag.moved = true;
    drawRoll();
  }
}

function onMouseUp(e) {
  if (!drag) return;
  const d = drag;
  drag = null;
  if (d.mode === 'marquee') {
    if (!d.moved) {
      // plain click on empty grid → add a note
      const { x, y } = eventXY(e);
      const { step, pitch } = gridPos(x, y);
      if (step >= 0 && step < NUM_STEPS && pitch >= LOW && pitch <= HIGH) {
        const note = { step, dur: Math.min(noteDur, NUM_STEPS - step), pitch, vel: e.shiftKey ? 1.27 : 1 };
        store.addNote(inst, note);
        selection.clear(); selection.add(note);
        engine.triggerNote(inst, pitch, note.vel, 0, note.dur * engine.stepDuration());
      }
    } else {
      // marquee select
      if (!d.additive) selection.clear();
      const sx = Math.min(d.x0, d.x1), ex = Math.max(d.x0, d.x1);
      const sy = Math.min(d.y0, d.y1), ey = Math.max(d.y0, d.y1);
      for (const n of notes()) {
        const nx0 = KEY_W + n.step * CELL_W, nx1 = nx0 + n.dur * CELL_W;
        const ny0 = (HIGH - n.pitch) * CELL_H, ny1 = ny0 + CELL_H;
        if (nx1 > sx && nx0 < ex && ny1 > sy && ny0 < ey) selection.add(n);
      }
      setRollStatus(`${selection.size} note${selection.size === 1 ? '' : 's'} selected.`);
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
  const tail = { step: splitAt, dur: n.step + n.dur - splitAt, pitch: n.pitch, vel: n.vel };
  n.dur = splitAt - n.step;
  store.addNote(inst, tail);
  selection.clear(); selection.add(n); selection.add(tail);
  setRollStatus('Note split.');
  drawRoll();
}

function onContextMenu(e) {
  e.preventDefault();
  const { x, y } = eventXY(e);
  const n = noteAtXY(x, y);
  if (!n) { selection.clear(); drawRoll(); return; }
  if (selection.has(n) && selection.size > 1) {
    deleteSelection();
  } else {
    const idx = notes().indexOf(n);
    if (idx >= 0) store.removeNote(inst, idx);
    selection.delete(n);
  }
  drawRoll();
}

function onWheel(e) {
  if (!e.shiftKey) return; // plain wheel = scroll container
  e.preventDefault();
  const { x, y } = eventXY(e);
  const target = noteAtXY(x, y);
  const set = selection.size && (!target || selection.has(target)) ? selection : (target ? new Set([target]) : null);
  if (!set) return;
  const delta = e.deltaY < 0 ? 0.08 : -0.08;
  for (const n of set) n.vel = clamp(+(n.vel + delta).toFixed(2), 0.1, 1.27);
  commit();
  setRollStatus(`Velocity ${e.deltaY < 0 ? '+' : '−'} (${[...set][0].vel.toFixed(2)})`);
  drawRoll();
}

// --------------------------------------------------------------- selection ops
function deleteSelection() {
  if (!selection.size) return;
  store.setNotes(inst, notes().filter(n => !selection.has(n)));
  setRollStatus(`Deleted ${selection.size} notes.`);
  selection.clear();
  drawRoll();
}

function copySelection() {
  const src = selection.size ? [...selection] : notes();
  if (!src.length) return setRollStatus('Nothing to copy.');
  clipboard = src.map(n => ({ ...n }));
  setRollStatus(`Copied ${clipboard.length} notes.`);
}

function pasteClipboard() {
  if (!clipboard?.length) return setRollStatus('Clipboard empty.');
  const pasted = clipboard.map(n => ({ ...n }));
  for (const n of pasted) store.addNote(inst, n);
  selection = new Set(pasted);
  setRollStatus(`Pasted ${pasted.length} notes — drag to position them.`);
  drawRoll();
}

function nudgeSelection(dStep, dPitch, dVel) {
  if (!selection.size) return;
  for (const n of selection) {
    if (dStep) n.step = clamp(n.step + dStep, 0, NUM_STEPS - n.dur);
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
  const panel = $('#roll-synth-panel');
  panel.innerHTML = '';
  panel.style.setProperty('--synth-color', synth.color);
  panel.className = `synth-panel synth-${instr.synthId}`;

  const head = document.createElement('div');
  head.className = 'synth-head';
  head.innerHTML = `<span class="synth-name">${synth.name}</span><span class="synth-tag">${synth.tagline}</span>`;
  panel.appendChild(head);

  const params = { ...synthDefaults(instr.synthId), ...(instr.params || {}) };
  const grid = document.createElement('div');
  grid.className = 'synth-params';
  synth.params.forEach(p => {
    const wrap = document.createElement('label');
    wrap.className = 'synth-param';
    const lab = document.createElement('span');
    lab.textContent = p.label;
    let input;
    if (p.type === 'select') {
      input = document.createElement('select');
      p.options.forEach(o => {
        const opt = document.createElement('option');
        opt.value = o; opt.textContent = o;
        input.appendChild(opt);
      });
      input.value = params[p.key];
    } else {
      input = document.createElement('input');
      input.type = 'range';
      input.min = p.min; input.max = p.max; input.step = p.step;
      input.value = params[p.key];
    }
    const val = document.createElement('span');
    val.className = 'synth-val';
    val.textContent = params[p.key];
    input.addEventListener('input', () => {
      const v = p.type === 'select' ? input.value : +input.value;
      const cur = { ...synthDefaults(instr.synthId), ...(store.instrument(inst).params || {}) };
      cur[p.key] = v;
      store.setInstrumentProp(inst, 'params', cur);
      val.textContent = v;
    });
    wrap.append(lab, input, val);
    grid.appendChild(wrap);
  });
  panel.appendChild(grid);
}

function renderLineSelect() {
  const synth = SYNTH_BANK[store.instrument(inst).synthId];
  const sel = $('#roll-lines');
  sel.innerHTML = '<option value="">— preset lines —</option>';
  synth.lines.forEach((l, i) => {
    const o = document.createElement('option');
    o.value = i; o.textContent = l.name;
    sel.appendChild(o);
  });
}

// --------------------------------------------------------------- keyboard
const KEYMAP = { a: 0, w: 1, s: 2, e: 3, d: 4, f: 5, t: 6, g: 7, y: 8, h: 9, u: 10, j: 11, k: 12, o: 13, l: 14 };
let baseOctave = 3;

function onKeyDown(e) {
  if ($('#modal-roll').classList.contains('hidden')) return;
  if (e.target.matches?.('input, select, textarea')) return;

  // editing shortcuts
  const mod = e.metaKey || e.ctrlKey;
  if (mod && e.key === 'c') { e.preventDefault(); return copySelection(); }
  if (mod && e.key === 'v') { e.preventDefault(); return pasteClipboard(); }
  if (mod && e.key === 'a') {
    e.preventDefault();
    selection = new Set(notes());
    setRollStatus(`${selection.size} notes selected.`);
    return drawRoll();
  }
  if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); return deleteSelection(); }
  if (e.key.startsWith('Arrow') && selection.size) {
    e.preventDefault();
    if (e.key === 'ArrowLeft') return nudgeSelection(-1, 0, 0);
    if (e.key === 'ArrowRight') return nudgeSelection(1, 0, 0);
    if (e.key === 'ArrowUp') return e.shiftKey ? nudgeSelection(0, 0, 0.08) : nudgeSelection(0, 1, 0);
    if (e.key === 'ArrowDown') return e.shiftKey ? nudgeSelection(0, 0, -0.08) : nudgeSelection(0, -1, 0);
  }

  if (e.repeat) return;
  const k = e.key.toLowerCase();
  if (mod) return; // let global shortcuts (undo/redo) through
  if (k === 'z') { baseOctave = Math.max(0, baseOctave - 1); return setRollStatus(`Octave: C${baseOctave}`); }
  if (k === 'x') { baseOctave = Math.min(7, baseOctave + 1); return setRollStatus(`Octave: C${baseOctave}`); }
  if (!(k in KEYMAP)) return;
  const pitch = (baseOctave + 1) * 12 + KEYMAP[k];
  if (pitch < LOW || pitch > HIGH) return;
  engine.triggerNote(inst, pitch, 1, 0, noteDur * engine.stepDuration());
  if (recArmed && engine.isPlaying) {
    const step = engine.currentStep % NUM_STEPS;
    store.addNote(inst, { step, dur: noteDur, pitch, vel: 1 });
    drawRoll();
  }
}

function setRollStatus(msg) { $('#roll-status').textContent = msg; }

// --------------------------------------------------------------- modal lifecycle
export function openRoll(i) {
  inst = i;
  selection.clear();
  engine.ensureContext();
  $('#roll-title').textContent = `${store.instrument(i).name} — MIDI Roll`;
  $('#roll-synth-select').value = store.instrument(i).synthId;
  renderSynthPanel();
  renderLineSelect();
  $('#modal-roll').classList.remove('hidden');
  drawRoll(-1);
  setRollStatus('Click = add · drag empty = select · drag note = move · alt+drag = duplicate · drag right edge = resize · dbl-click = split · right-click = delete · shift+wheel / shift+↑↓ = velocity · ⌘C/⌘V copy-paste · arrows nudge · A–L play (Z/X octave)');
}

export function initPianoRoll() {
  canvas = $('#roll-canvas');
  canvas.width = KEY_W + NUM_STEPS * CELL_W;
  canvas.height = ROWS * CELL_H;
  ctx2d = canvas.getContext('2d');

  canvas.addEventListener('mousedown', onMouseDown);
  canvas.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);
  canvas.addEventListener('dblclick', onDblClick);
  canvas.addEventListener('contextmenu', onContextMenu);
  canvas.addEventListener('wheel', onWheel, { passive: false });

  const sel = $('#roll-synth-select');
  Object.entries(SYNTH_BANK).forEach(([id, s]) => {
    const o = document.createElement('option');
    o.value = id; o.textContent = s.name;
    sel.appendChild(o);
  });
  sel.addEventListener('change', () => {
    store.setInstrumentProp(inst, 'synthId', sel.value);
    store.setInstrumentProp(inst, 'params', null);
    const label = SYNTH_BANK[sel.value].name;
    store.setInstrumentProp(inst, 'name', label);
    $('#roll-title').textContent = `${label} — MIDI Roll`;
    renderSynthPanel();
    renderLineSelect();
    drawRoll();
    document.dispatchEvent(new CustomEvent('instrument-renamed', { detail: inst }));
  });

  $('#roll-dur').addEventListener('change', e => { noteDur = +e.target.value; });

  $('#roll-lines').addEventListener('change', e => {
    const synth = SYNTH_BANK[store.instrument(inst).synthId];
    const line = synth.lines[+e.target.value];
    if (!line) return;
    store.setNotes(inst, parseLine(line.dsl));
    selection.clear();
    drawRoll();
    setRollStatus(`Loaded line "${line.name}" — press Play to hear it.`);
  });

  $('#roll-copy').addEventListener('click', copySelection);
  $('#roll-paste').addEventListener('click', pasteClipboard);

  $('#roll-rec').addEventListener('click', () => {
    recArmed = !recArmed;
    $('#roll-rec').classList.toggle('rec-on', recArmed);
    setRollStatus(recArmed
      ? 'REC armed — press Play, then play keys A–L to record (quantized to 16ths).'
      : 'Recording disarmed.');
  });
  $('#roll-clear').addEventListener('click', () => { selection.clear(); store.clearNotes(inst); drawRoll(); });
  $('#roll-close').addEventListener('click', () => $('#modal-roll').classList.add('hidden'));

  document.addEventListener('keydown', onKeyDown);
  store.on('sequence', () => { selection.clear(); drawRoll(); });
  store.on('notes', () => drawRoll());
}

export function rollPlayhead(step) {
  drawRoll(step);
}

export function activeRollInstrument() { return inst; }
