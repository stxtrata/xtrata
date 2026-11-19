import { createRegionControls, rawStep, stepBeat, regionSnap } from './region-controls.js';
import { songRegions, waveformIndex } from './song-regions.js';
import { drawWaveformRegion } from './waveform-drawing.js';
import { STORAGE_KEYS } from './storage-config.js';
import { midiName } from './onboard-catalog.js';
// arrange.js — Logic-style arrange view (the default): waveform regions, with the step grid as the alternative view.
// Regions render their real audible length; choke cuts at the next trigger; per-step
// crossfades (xfade, ms) blend a region into the next one — drag the boundary to set.
// Drag region edges to trim, drag a region's body to move it. Regions sit at their true
// position (step + fractional offset); the Snap menu picks the move grid (Step … 1/16 of a
// step, or Off) and Alt bypasses it; hold Ctrl while dragging for an instant 1/16-step
// grid. Zoom widens the steps so fine moves are visible.
// Drag on empty space to marquee-select regions (Shift adds); drag a selected region to
// move the whole group, which stops at regions that are not selected. Arrow keys nudge the
// group by the snap amount (Shift = 4x), Delete removes it, Esc clears the selection.
// Dragging a region's left edge trims it in place: the audio stays where it is on the
// timeline and the region start moves right (or left) as a fractional offset, exactly
// like the right edge trims from the end. With several regions selected, trimming the
// edge of one of them trims the same edge of every selected region by the same amount.
// Click = edit, right-click = reverse, click empty = add.

import { store, NUM_STEPS, stepVal, stepObj, stepOff, withStepOff } from './state.js';
import { engine } from './engine.js';
import { openStepEditor, setStatus } from './ui.js';
import { beatToSeconds, stepToSeconds, secondsToBeat, unswingStep } from './timeline.js';

const CELL_W = 14, // px per step at 1x zoom
  STRIP_H = 40;
const VIEW_KEY = STORAGE_KEYS.view; // "wave" | "grid" — last view chosen in this browser
let arrangeMode = true; // the wave view is the default; initArrange() applies the stored choice
let zoom = 1; // 1, 2, 4, 8 — canvas pixels per step = CELL_W * zoom
let snap = 1; // move grid in steps: 1, .5, .25, .125, .0625 — 0 = free
const cw = () => CELL_W * zoom;
let playheadStep = -1;
let controls = null,
  regionModel = null,
  modelProject = null,
  modelGeneration = -1;
const displayProject = () => controls?.project || store.project;
function model(project = displayProject()) {
  if (!regionModel || modelProject !== project || modelGeneration !== store.generation) {
    regionModel = songRegions(project, engine.buffers, { patterns: true });
    modelProject = project;
    modelGeneration = store.generation;
  }
  return regionModel;
}
const visibleRegions = (project = displayProject()) =>
  model(project).regions.filter(
    (r) => r.type === 'sample' && r.sequenceIndex === store.project.currentSequence
  );
const stripFor = (ch) =>
  document.querySelector(`#channels .channel[data-ch="${ch}"] .arrange-strip`);

export function isArrangeMode() {
  return arrangeMode;
}

function readViewPref() {
  try {
    return localStorage.getItem(VIEW_KEY) !== 'grid';
  } catch {
    return true; // storage blocked: first-visit default
  }
}
function saveViewPref(on) {
  try {
    localStorage.setItem(VIEW_KEY, on ? 'wave' : 'grid');
  } catch {
    /* storage blocked: the choice just lasts for this session */
  }
}

// Single place that switches view: body class, button state and label, strips.
// The label names the view the button switches TO.
function setArrangeMode(on, { save = true } = {}) {
  arrangeMode = !!on;
  document.body.classList.toggle('arrange-mode', arrangeMode);
  const btn = document.querySelector('#btn-view');
  if (btn) {
    btn.classList.toggle('active', arrangeMode);
    btn.textContent = arrangeMode ? 'Grid' : 'Wave';
    btn.title = arrangeMode ? 'Switch to the step grid' : 'Switch to the wave (arrange) view';
  }
  if (save) saveViewPref(arrangeMode);
  if (arrangeMode) {
    attachStrips();
    renderArrange();
  }
}

const stepDurSec = () => 60 / store.project.bpm / 4;
const atSeconds = (pos) => stepToSeconds(displayProject(), pos, store.project.currentSequence);
const secondsBetween = (start, end) => atSeconds(end) - atSeconds(start);
const afterSeconds = (pos, seconds) =>
  unswingStep(
    (secondsToBeat(store.project, atSeconds(pos) + seconds) - store.project.currentSequence * 16) *
      4,
    store.project.swing
  );

// Regions for one channel: geometry + playback params + boundary info.
function channelRegions(ch) {
  const project = displayProject(),
    base = store.project.currentSequence * 64,
    c = project.channels[ch];
  return visibleRegions(project)
    .filter((r) => r.index === ch)
    .map((r) => {
      const pos = rawStep(project, r.start) - base,
        naturalSteps = rawStep(project, r.naturalEnd) - base - pos;
      const next = r.next?.sequenceIndex === r.sequenceIndex ? r.next : null;
      return {
        ...r,
        source: r,
        pos,
        naturalSteps,
        widthSteps: Math.min(64 - pos, Math.max(0.01, rawStep(project, r.end) - base - pos)),
        audioWindow: r.window,
        rev: r.window.reverse,
        trimStart: r.window.start,
        trimEnd: r.window.end,
        pitch: r.window.rate,
        next: next?.step,
        nextPos: next ? rawStep(project, next.start) - base : null,
        nextXfadeSteps: next?.over?.xfade
          ? rawStep(
              project,
              secondsToBeat(project, beatToSeconds(project, next.start) + next.over.xfade / 1000)
            ) - rawStep(project, next.start)
          : 0,
        xfaded: !!next?.over?.xfade,
        accent: stepVal(project.sequences[r.sequenceIndex].steps[ch][r.step]) === 2,
        wordSelection: r.over?.wordSelection ?? c.wordSelection,
        noteLabel:
          c.soundMetadata?.rootMidi != null
            ? midiName(Math.round(c.soundMetadata.rootMidi + 12 * Math.log2(r.window.rate)))
            : null
      };
    });
}

function drawStrip(ch) {
  const cv = document.querySelector(`#channels .channel[data-ch="${ch}"] .arrange-strip`);
  if (!cv) return;
  const g = cv.getContext('2d');
  const W = cv.width,
    H = cv.height;
  const c = store.channel(ch);
  g.clearRect(0, 0, W, H);
  g.fillStyle = '#0d1319';
  g.fillRect(0, 0, W, H);
  // grid: bars/beats always; every step from 2x zoom; the snap divisions from 4x
  const sub = snap > 0 && snap < 1 && zoom >= 4 ? snap : 0;
  if (sub) {
    g.fillStyle = '#151d26';
    for (let s = 0; s < NUM_STEPS; s += sub) if (s % 1) g.fillRect(Math.round(s * cw()), 0, 1, H);
  }
  for (let s = 0; s <= NUM_STEPS; s += zoom >= 2 ? 1 : 4) {
    g.fillStyle = s % 16 === 0 ? '#39424e' : s % 4 === 0 ? '#2a3541' : '#1e2732';
    g.fillRect(s * cw(), 0, 1, H);
  }

  const buffer = engine.buffers?.[ch];
  const data = buffer?.getChannelData(0);

  for (const r of channelRegions(ch)) {
    const x = r.pos * cw();
    const w = Math.max(3, r.widthSteps * cw());
    g.fillStyle = r.accent ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.07)';
    g.fillRect(x, 1, w, H - 2);
    g.strokeStyle = r.cut ? '#ff9f43' : c.color;
    g.strokeRect(x + 0.5, 1.5, w - 1, H - 3);
    if (controls?.isSelected(r.source)) {
      g.fillStyle = 'rgba(67,255,164,0.16)';
      g.fillRect(x, 1, w, H - 2);
      g.strokeStyle = '#43ffa4';
      g.lineWidth = 2;
      g.strokeRect(x + 1, 2, w - 2, H - 4);
      g.lineWidth = 1;
    }

    if (data) {
      drawWaveformRegion(g, {
        buffer,
        x,
        width: w,
        height: H,
        loop: r.audioWindow.loop,
        reverse: r.audioWindow.reverse,
        color: r.rev ? '#ff9f43' : c.color,
        indexAt: (f) =>
          waveformIndex(r.audioWindow, buffer, secondsBetween(r.pos, r.pos + f * r.widthSteps))
      });
    }

    const regionLabel = r.wordSelection?.text || r.noteLabel;
    if (regionLabel && w > 35) {
      g.save();
      g.beginPath();
      g.rect(x + 3, 1, w - 6, H - 2);
      g.clip();
      g.font = '10px monospace';
      g.fillStyle = '#edf4ff';
      g.fillText(regionLabel, x + 5, 12);
      g.restore();
    }
    // trim handles
    g.fillStyle = 'rgba(255,255,255,0.35)';
    g.fillRect(x, 1, 2, H - 2);
    g.fillRect(x + w - 2, 1, 2, H - 2);

    // cut marker (hard choke)
    if (r.cut) {
      g.fillStyle = '#ff9f43';
      g.fillRect(x + w - 2, 1, 2, H - 2);
    }

    // crossfade wedge: diagonal out/in lines over the fade span before the boundary
    if (r.xfaded && r.next != null && r.nextXfadeSteps > 0) {
      const bx = r.nextPos * cw();
      const fx = r.nextXfadeSteps * cw();
      g.strokeStyle = '#22d3ee';
      g.lineWidth = 1.5;
      g.beginPath();
      g.moveTo(bx, 2);
      g.lineTo(bx + fx, H - 2); // outgoing fade-down
      g.moveTo(bx + fx, 2);
      g.lineTo(bx, H - 2); // incoming fade-up
      g.stroke();
      g.lineWidth = 1;
    }
  }

  if (playheadStep >= 0) {
    g.fillStyle = 'rgba(67,255,164,0.25)';
    g.fillRect(playheadStep * cw(), 0, cw(), H);
  }
}

export function renderArrange() {
  if (!arrangeMode || document.querySelector('#channels')?.hidden) return;
  for (let ch = 0; ch < store.numChannels; ch++) drawStrip(ch);
}

export function arrangePlayhead(step) {
  playheadStep = step;
  renderArrange();
}

// View adapter: coordinates and painting only. Shared controller owns gestures.
export function attachStrips() {
  document.querySelectorAll('#channels .channel[data-ch]').forEach((row) => {
    if (row.querySelector('.arrange-strip')) return;
    const canvas = document.createElement('canvas');
    canvas.className = 'arrange-strip';
    canvas.width = NUM_STEPS * cw();
    canvas.height = STRIP_H;
    canvas.tabIndex = 0;
    canvas.style.touchAction = 'none';
    row.append(canvas);
  });
  renderArrange();
}
function regionBounds(r) {
  if (r.sequenceIndex !== store.project.currentSequence) return null;
  const cv = stripFor(r.index);
  if (!cv) return null;
  const b = cv.getBoundingClientRect(),
    p = displayProject(),
    base = store.project.currentSequence * 64;
  const left = b.left + ((rawStep(p, r.start) - base) * b.width) / 64;
  return {
    left,
    right: Math.min(
      b.right,
      left + Math.max(3, ((rawStep(p, r.end) - rawStep(p, r.start)) * b.width) / 64)
    ),
    top: b.top,
    bottom: b.bottom
  };
}
function showMarquee(rect) {
  let box = document.querySelector('#arrange-marquee');
  if (!box) {
    box = document.createElement('div');
    box.id = 'arrange-marquee';
    box.className = 'region-marquee';
    document.body.append(box);
  }
  box.hidden = !rect;
  if (rect)
    Object.assign(box.style, {
      left: rect.left + 'px',
      top: rect.top + 'px',
      width: rect.right - rect.left + 'px',
      height: rect.bottom - rect.top + 'px'
    });
}
function initRegionControls() {
  controls = createRegionControls({
    root: document.querySelector('#channels'),
    active: () => arrangeMode && !document.querySelector('#channels').hidden,
    regions: visibleRegions,
    bounds: regionBounds,
    repaint: renderArrange,
    marquee: showMarquee,
    limits: () => ({
      start: store.project.currentSequence * 64,
      end: (store.project.currentSequence + 1) * 64
    }),
    point(e) {
      const cv = e.target.closest?.('.arrange-strip');
      if (!cv) return null;
      const b = cv.getBoundingClientRect(),
        ch = +cv.closest('[data-ch]').dataset.ch,
        position = store.project.currentSequence * 64 + ((e.clientX - b.left) * 64) / b.width;
      return {
        target: cv,
        position,
        beat: stepBeat(displayProject(), position),
        trackId: store.channel(ch).id
      };
    },
    open: (r) => openStepEditor(r.index, r.step),
    add: (h) => {
      const ch = store.project.channels.findIndex((t) => t.id === h.trackId),
        step = Math.floor(h.position - store.project.currentSequence * 64);
      if (ch >= 0 && step >= 0 && step < 64) store.cycleStep(ch, step);
    }
  });
}
export function initArrange() {
  initRegionControls();
  const btn = document.querySelector('#btn-view');
  btn.addEventListener('click', () => setArrangeMode(!arrangeMode));
  // opens in the stored view; first-time visitors get the wave view
  setArrangeMode(readViewPref(), { save: false });

  const snapSel = document.querySelector('#arrange-snap');
  const zoomSel = document.querySelector('#arrange-zoom');
  snapSel?.addEventListener('change', () => {
    snap = Math.max(0, +snapSel.value || 0);
    renderArrange();
  });
  zoomSel?.addEventListener('change', () => {
    zoom = [1, 2, 4, 8].includes(+zoomSel.value) ? +zoomSel.value : 1;
    document.body.style.setProperty('--az', String(zoom));
    document.body.classList.toggle('arrange-zoomed', zoom > 1);
    document.querySelectorAll('.arrange-strip').forEach((cv) => {
      cv.width = NUM_STEPS * cw();
    });
    renderArrange();
  });

  const choke = document.querySelector('#chk-choke');
  choke.checked = !!store.project.choke;
  choke.addEventListener('change', () => {
    store.setProjectProp('choke', choke.checked);
    renderArrange();
  });
  const fade = document.querySelector('#fade-ms');
  fade.value = store.project.fadeMs ?? 15;
  fade.addEventListener('change', () => {
    store.setProjectProp('fadeMs', Math.max(1, Math.min(500, +fade.value || 15)));
  });

  store.on('sequence', () => controls?.clear());
  ['step', 'sequence', 'channel', 'channels', 'load', 'project'].forEach((ev) =>
    store.on(ev, () => {
      regionModel = null;
      if (arrangeMode) {
        attachStrips();
        renderArrange();
      }
    })
  );
}

export function syncArrangeControls() {
  const choke = document.querySelector('#chk-choke');
  const fade = document.querySelector('#fade-ms');
  if (choke) choke.checked = !!store.project.choke;
  if (fade) fade.value = store.project.fadeMs ?? 15;
}
