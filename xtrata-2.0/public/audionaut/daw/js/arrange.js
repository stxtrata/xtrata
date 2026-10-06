import { midiName } from "./onboard-catalog.js";
import { sustainDuration, sampleLoop } from "./onboard-library.js";
// arrange.js — Logic-style arrange view: the step grid flips to waveform regions.
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
// like the right edge trims from the end.
// Click = edit, right-click = reverse, click empty = add.

import {
  store,
  NUM_STEPS,
  stepVal,
  stepObj,
  stepOff,
  withStepOff,
} from "./state.js";
import { engine } from "./engine.js";
import { openStepEditor, setStatus } from "./ui.js";

const CELL_W = 14, // px per step at 1x zoom
  STRIP_H = 40;
const EDGE_PX = 5; // trim-handle zone at region edges
const XF_PX = 6; // crossfade-handle zone around a cutting boundary
let arrangeMode = false;
let zoom = 1; // 1, 2, 4, 8 — canvas pixels per step = CELL_W * zoom
let snap = 1; // move grid in steps: 1, .5, .25, .125, .0625 — 0 = free
const FINE_SNAP = 1 / 16; // grid while Ctrl is held
let lastCtrlDown = 0; // Ctrl+click is a right-click on macOS: don't treat it as one
const cw = () => CELL_W * zoom;
let playheadStep = -1;
let drag = null; // { kind:'trimL'|'trimR'|'xfade'|'maybeClick'|'pending'|'move'|'marquee', ch, ... }
let selection = new Set(); // "ch:step" keys of selected regions
const selKey = (ch, step) => `${ch}:${step}`;
const stripFor = (ch) =>
  document.querySelector(`#channels .channel[data-ch="${ch}"] .arrange-strip`);

export function isArrangeMode() {
  return arrangeMode;
}

const stepDurSec = () => 60 / store.project.bpm / 4;

// Regions for one channel: geometry + playback params + boundary info.
function channelRegions(ch) {
  const row = store.seq.steps[ch];
  const buffer = engine.buffers?.[ch];
  const c = store.channel(ch);
  const sd = stepDurSec();
  const triggers = [];
  for (let s = 0; s < NUM_STEPS; s++) if (stepVal(row[s])) triggers.push(s);
  return triggers.map((s, i) => {
    const o = stepObj(row[s]);
    const off = stepOff(row[s]);
    const pos = s + off;
    const trimStart = o?.trimStart ?? c.trimStart;
    const trimEnd = o?.trimEnd ?? c.trimEnd;
    const pitch = o?.pitch ?? c.pitch;
    const rev = o?.rev ?? !!c.reverse;
    const regionSec = buffer
      ? (sustainDuration(c, o, buffer, store.project.bpm) ??
        Math.max(0.001, (trimEnd - trimStart) * buffer.duration) / pitch)
      : sd;
    const naturalSteps = regionSec / sd;
    const next = triggers[i + 1] ?? null;
    const nextPos = next != null ? next + stepOff(row[next]) : null;
    const nextObj = next != null ? stepObj(row[next]) : null;
    const nextXfadeSteps = nextObj?.xfade ? nextObj.xfade / 1000 / sd : 0;

    let widthSteps = naturalSteps;
    let cut = false,
      xfaded = false;
    if (next != null && pos + naturalSteps > nextPos) {
      if (nextXfadeSteps > 0) {
        widthSteps = Math.min(naturalSteps, nextPos - pos + nextXfadeSteps);
        xfaded = true;
      } else if (store.project.choke) {
        widthSteps = nextPos - pos;
        cut = true;
      }
    }
    widthSteps = Math.min(widthSteps, NUM_STEPS - pos);
    return {
      step: s,
      off,
      pos,
      nextPos,
      widthSteps,
      naturalSteps,
      cut,
      xfaded,
      next,
      nextXfadeSteps,
      trimStart,
      trimEnd,
      pitch,
      rev,
      wordSelection: o?.wordSelection ?? c.wordSelection,
      loop:
        buffer && sustainDuration(c, o, buffer, store.project.bpm) != null
          ? sampleLoop(c)
          : null,
      noteLabel:
        c.soundMetadata?.rootMidi != null
          ? midiName(
              Math.round(c.soundMetadata.rootMidi + 12 * Math.log2(pitch)),
            )
          : null,
      accent: stepVal(row[s]) === 2,
    };
  });
}

function drawStrip(ch) {
  const cv = document.querySelector(
    `#channels .channel[data-ch="${ch}"] .arrange-strip`,
  );
  if (!cv) return;
  const g = cv.getContext("2d");
  const W = cv.width,
    H = cv.height;
  const c = store.channel(ch);
  g.clearRect(0, 0, W, H);
  g.fillStyle = "#0d1319";
  g.fillRect(0, 0, W, H);
  // grid: bars/beats always; every step from 2x zoom; the snap divisions from 4x
  const sub = snap > 0 && snap < 1 && zoom >= 4 ? snap : 0;
  if (sub) {
    g.fillStyle = "#151d26";
    for (let s = 0; s < NUM_STEPS; s += sub)
      if (s % 1) g.fillRect(Math.round(s * cw()), 0, 1, H);
  }
  for (let s = 0; s <= NUM_STEPS; s += zoom >= 2 ? 1 : 4) {
    g.fillStyle = s % 16 === 0 ? "#39424e" : s % 4 === 0 ? "#2a3541" : "#1e2732";
    g.fillRect(s * cw(), 0, 1, H);
  }

  const buffer = engine.buffers?.[ch];
  const data = buffer?.getChannelData(0);

  for (const r of channelRegions(ch)) {
    const x = r.pos * cw();
    const w = Math.max(3, r.widthSteps * cw());
    g.fillStyle = r.accent
      ? "rgba(255,255,255,0.16)"
      : "rgba(255,255,255,0.07)";
    g.fillRect(x, 1, w, H - 2);
    g.strokeStyle = r.cut ? "#ff9f43" : c.color;
    g.strokeRect(x + 0.5, 1.5, w - 1, H - 3);
    if (selection.has(selKey(ch, r.step))) {
      g.fillStyle = "rgba(67,255,164,0.16)";
      g.fillRect(x, 1, w, H - 2);
      g.strokeStyle = "#43ffa4";
      g.lineWidth = 2;
      g.strokeRect(x + 1, 2, w - 2, H - 4);
      g.lineWidth = 1;
    }

    if (data) {
      const startFrac = r.rev ? 1 - r.trimEnd : r.trimStart;
      const endFrac = r.rev ? 1 - r.trimStart : r.trimEnd;
      const i0 = Math.floor(startFrac * data.length);
      const i1 = Math.max(i0 + 1, Math.floor(endFrac * data.length));
      const span = i1 - i0;
      const visibleFrac = Math.min(1, r.widthSteps / r.naturalSteps);
      g.strokeStyle = r.rev ? "#ff9f43" : c.color;
      g.beginPath();
      const px = Math.max(1, Math.floor(w));
      for (let xx = 0; xx < px; xx++) {
        const frac = (xx / px) * visibleFrac;
        const elapsed = (xx / px) * r.widthSteps * stepDurSec();
        let idxF = r.rev ? i1 - 1 - frac * span : i0 + frac * span;
        const loopStart = r.loop?.start * buffer.sampleRate,
          loopEnd = r.loop?.end * buffer.sampleRate;
        if (r.loop) {
          idxF = i0 + elapsed * r.pitch * buffer.sampleRate;
          if (idxF >= loopEnd)
            idxF = loopStart + ((idxF - loopStart) % (loopEnd - loopStart));
        }
        const idx = Math.floor(Math.min(data.length - 1, Math.max(0, idxF)));
        const chunk = Math.max(
          1,
          Math.floor(
            r.loop
              ? (r.widthSteps * stepDurSec() * r.pitch * buffer.sampleRate) / px
              : (span * visibleFrac) / px,
          ),
        );
        let min = 1,
          max = -1;
        for (let k = idx, e = Math.min(idx + chunk, data.length); k < e; k++) {
          const at =
            r.loop && k >= loopEnd
              ? Math.floor(
                  loopStart + ((k - loopStart) % (loopEnd - loopStart)),
                )
              : k;
          if (data[at] < min) min = data[at];
          if (data[at] > max) max = data[at];
        }
        g.moveTo(x + xx + 0.5, ((1 + min) * (H - 6)) / 2 + 3);
        g.lineTo(x + xx + 0.5, ((1 + max) * (H - 6)) / 2 + 3);
      }
      g.stroke();
    }

    const regionLabel = r.wordSelection?.text || r.noteLabel;
    if (regionLabel && w > 35) {
      g.save();
      g.beginPath();
      g.rect(x + 3, 1, w - 6, H - 2);
      g.clip();
      g.font = "10px monospace";
      g.fillStyle = "#edf4ff";
      g.fillText(regionLabel, x + 5, 12);
      g.restore();
    }
    // trim handles
    g.fillStyle = "rgba(255,255,255,0.35)";
    g.fillRect(x, 1, 2, H - 2);
    g.fillRect(x + w - 2, 1, 2, H - 2);

    // cut marker (hard choke)
    if (r.cut) {
      g.fillStyle = "#ff9f43";
      g.fillRect(x + w - 2, 1, 2, H - 2);
    }

    // crossfade wedge: diagonal out/in lines over the fade span before the boundary
    if (r.xfaded && r.next != null && r.nextXfadeSteps > 0) {
      const bx = r.nextPos * cw();
      const fx = r.nextXfadeSteps * cw();
      g.strokeStyle = "#22d3ee";
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
    g.fillStyle = "rgba(67,255,164,0.25)";
    g.fillRect(playheadStep * cw(), 0, cw(), H);
  }
}

export function renderArrange() {
  if (!arrangeMode) return;
  for (let ch = 0; ch < store.numChannels; ch++) drawStrip(ch);
}

export function arrangePlayhead(step) {
  playheadStep = step;
  renderArrange();
}

// ---------------------------------------------------------------- interaction
function stripXY(cv, e) {
  const rect = cv.getBoundingClientRect();
  return (e.clientX - rect.left) * (cv.width / rect.width);
}

function hitTest(ch, x) {
  const regions = channelRegions(ch);
  // crossfade handle: near a boundary where the previous region reaches the next trigger
  for (const r of regions) {
    if (r.next == null) continue;
    const overlaps = r.pos + r.naturalSteps > r.nextPos;
    if (!overlaps) continue;
    const bx = r.nextPos * cw();
    const fxEnd = bx + Math.max(XF_PX, r.nextXfadeSteps * cw());
    if (x >= bx - XF_PX && x <= fxEnd + XF_PX) {
      return { kind: "xfade", region: r };
    }
  }
  for (const r of regions) {
    const x0 = r.pos * cw(),
      x1 = x0 + Math.max(3, r.widthSteps * cw());
    if (x < x0 || x > x1) continue;
    if (x - x0 <= EDGE_PX) return { kind: "trimL", region: r };
    if (x1 - x <= EDGE_PX) return { kind: "trimR", region: r };
    return { kind: "body", region: r };
  }
  return { kind: "empty" };
}

function onStripDown(ch, cv, e) {
  if (e.ctrlKey) lastCtrlDown = performance.now();
  if (e.button === 2) return;
  const x = stripXY(cv, e);
  const h = hitTest(ch, x);
  if (h.kind === "trimL" || h.kind === "trimR" || h.kind === "xfade") {
    // the left edge may slide between the neighbouring triggers' step slots
    const row = store.seq.steps[ch];
    let lo = 0,
      hi = NUM_STEPS - 0.001;
    for (let t = 0; t < NUM_STEPS; t++) {
      if (t === h.region.step || !stepVal(row[t])) continue;
      if (t < h.region.step) lo = Math.max(lo, t + 1);
      else hi = Math.min(hi, t - 0.001);
    }
    drag = {
      kind: h.kind,
      ch,
      region: h.region,
      startX: x,
      moved: false,
      trimStart0: h.region.trimStart,
      trimEnd0: h.region.trimEnd,
      at: h.region.step,
      pos0: h.region.pos,
      lo,
      hi,
    };
    e.preventDefault();
  } else {
    // Body or empty space: handled on the window so the drag can leave the strip.
    // Body = click edits / drag moves; empty = click adds / drag draws a marquee.
    drag = {
      kind: h.kind === "body" ? "pending" : "maybeClick",
      ch,
      region: h.region,
      startX: x,
      startClientX: e.clientX,
      startClientY: e.clientY,
      shift: e.shiftKey,
      moved: false,
      global: true,
    };
    e.preventDefault();
    window.addEventListener("mousemove", onGlobalMove);
    window.addEventListener("mouseup", onGlobalUp);
  }
}

// ------------------------------------------------- selection, marquee, group move
const r3 = (n) => Math.round(n * 1000) / 1000;

// Put the trigger at step `from` at the fractional position `pos` (step slot + offset).
// Returns the step slot it ends up in.
function relocate(ch, from, pos) {
  const row = store.seq.steps[ch];
  const to = Math.floor(pos);
  const val = withStepOff(row[from], r3(pos - to));
  if (to !== from) {
    row[from] = 0;
    store.emit("step", { ch, step: from, val: 0 });
  }
  row[to] = val;
  store.emit("step", { ch, step: to, val });
  return to;
}

function selectedItems() {
  const items = [];
  for (const k of selection) {
    const [ch, step] = k.split(":").map(Number);
    const val = store.seq.steps[ch]?.[step];
    if (stepVal(val)) items.push({ ch, step, val, pos: step + stepOff(val) });
  }
  return items;
}

function origRows(items) {
  const orig = new Map();
  for (const it of items)
    if (!orig.has(it.ch)) orig.set(it.ch, store.seq.steps[it.ch].slice());
  return orig;
}

// Can the whole group sit `delta` steps from where it started? It must stay on the
// timeline and may not land in a step slot held by a region that is not selected
// (or by another member of the group).
function groupFits(items, orig, delta) {
  const moving = new Set(items.map((it) => selKey(it.ch, it.step)));
  const used = new Set();
  for (const it of items) {
    const p = r3(it.pos + delta);
    if (p < 0 || p > NUM_STEPS - 0.001) return false;
    const to = Math.floor(p);
    const key = selKey(it.ch, to);
    if (used.has(key)) return false;
    used.add(key);
    if (stepVal(orig.get(it.ch)[to]) && !moving.has(key)) return false;
  }
  return true;
}

// Rebuild the touched rows from their originals with the group shifted by `delta`.
// Returns the moved items (new step, new value) for selection and change events.
function applyMove(items, orig, delta) {
  const rows = new Map([...orig].map(([ch, row]) => [ch, row.slice()]));
  for (const it of items) rows.get(it.ch)[it.step] = 0;
  const moved = items.map((it) => {
    const p = r3(it.pos + delta);
    const step = Math.floor(p);
    const val = withStepOff(it.val, r3(p - step));
    rows.get(it.ch)[step] = val;
    return { ch: it.ch, step, val, pos: p };
  });
  for (const [ch, row] of rows) store.seq.steps[ch] = row;
  return moved;
}

// Walk the delta toward `target` in snap-sized steps and stop at the first position
// where the group no longer fits, so a drag can never jump over another region.
function walkDelta(d, target) {
  const inc = d.grid > 0 ? d.grid : 1 / 32;
  let cur = d.delta;
  while (Math.abs(target - cur) > 1e-9) {
    const next = r3(cur + Math.sign(target - cur) * Math.min(inc, Math.abs(target - cur)));
    if (!groupFits(d.items, d.orig, next)) break;
    cur = next;
  }
  return cur;
}

// Tell the rest of the app (step grid, history) once the move has settled.
function commitMove(items, moved) {
  const cells = new Set();
  for (const it of items) cells.add(selKey(it.ch, it.step));
  for (const it of moved) cells.add(selKey(it.ch, it.step));
  for (const k of cells) {
    const [ch, step] = k.split(":").map(Number);
    store.emit("step", { ch, step, val: store.seq.steps[ch][step] });
  }
}

const plural = (n) => `${n} region${n === 1 ? "" : "s"}`;
const stepsLabel = (n) => `${r3(Math.abs(n))} step${Math.abs(n) === 1 ? "" : "s"}`;

function nudgeSelection(dir, big) {
  const items = selectedItems();
  if (!items.length) return;
  const unit = snap > 0 ? snap : 1 / 16;
  const orig = origRows(items);
  const d = { items, orig, grid: unit, delta: 0 };
  const delta = walkDelta(d, dir * unit * (big ? 4 : 1));
  if (!delta) return;
  const moved = applyMove(items, orig, delta);
  selection = new Set(moved.map((it) => selKey(it.ch, it.step)));
  commitMove(items, moved);
  renderArrange();
  setStatus(`Moved ${plural(items.length)} ${delta > 0 ? "right" : "left"} ${stepsLabel(delta)}.`);
}

function deleteSelection() {
  const items = selectedItems();
  if (!items.length) return;
  for (const it of items) store.seq.steps[it.ch][it.step] = 0;
  selection.clear();
  for (const it of items) store.emit("step", { ch: it.ch, step: it.step, val: 0 });
  renderArrange();
  setStatus(`Deleted ${plural(items.length)}.`);
}

function ensureMarquee() {
  let el = document.getElementById("arrange-marquee");
  if (!el) {
    el = document.createElement("div");
    el.id = "arrange-marquee";
    el.style.cssText =
      "position:fixed;z-index:9999;pointer-events:none;border:1px dashed #43ffa4;background:rgba(67,255,164,0.12);display:none";
    document.body.appendChild(el);
  }
  return el;
}

function marqueeHits(r) {
  const hits = [];
  for (let ch = 0; ch < store.numChannels; ch++) {
    const cv = stripFor(ch);
    if (!cv) continue;
    const box = cv.getBoundingClientRect();
    if (box.bottom < r.top || box.top > r.bottom) continue;
    const k = box.width / cv.width;
    for (const reg of channelRegions(ch)) {
      const x0 = box.left + reg.pos * cw() * k;
      const x1 = x0 + Math.max(3, reg.widthSteps * cw()) * k;
      if (x1 >= r.left && x0 <= r.right) hits.push(selKey(ch, reg.step));
    }
  }
  return hits;
}

function onGlobalMove(e) {
  const d = drag;
  if (!d?.global) return;
  const dx = e.clientX - d.startClientX,
    dy = e.clientY - d.startClientY;
  if (!d.moved) {
    // Ctrl = fine tuning, so it starts moving after a single pixel instead of three
    if (Math.hypot(dx, dy) <= (e.ctrlKey ? 1 : 3)) return;
    d.moved = true;
    if (d.kind === "pending") {
      const key = selKey(d.ch, d.region.step);
      if (!selection.has(key)) {
        if (!d.shift) selection.clear();
        selection.add(key);
      }
      d.kind = "move";
      d.items = selectedItems();
      d.orig = origRows(d.items);
      d.delta = 0;
      const cv = stripFor(d.ch);
      d.scale = cv.width / cv.getBoundingClientRect().width;
      document.body.style.cursor = "grabbing";
      cv.style.cursor = "grabbing";
    } else {
      d.kind = "marquee";
      if (!d.shift) selection.clear();
      d.base = new Set(selection);
    }
  }
  if (d.kind === "move") {
    // snap the grabbed region's own position to the grid (Alt = free, Ctrl = 1/16), the
    // rest of the group keeps its spacing
    d.grid = e.altKey ? 0 : e.ctrlKey ? FINE_SNAP : snap;
    const want = d.region.pos + (dx * d.scale) / cw();
    const snapped = d.grid > 0 ? Math.round(want / d.grid) * d.grid : want;
    const delta = walkDelta(d, r3(snapped - d.region.pos));
    if (delta === d.delta && d.movedItems) return;
    d.delta = delta;
    d.movedItems = applyMove(d.items, d.orig, delta);
    selection = new Set(d.movedItems.map((it) => selKey(it.ch, it.step)));
    renderArrange();
  } else if (d.kind === "marquee") {
    const r = {
      left: Math.min(d.startClientX, e.clientX),
      right: Math.max(d.startClientX, e.clientX),
      top: Math.min(d.startClientY, e.clientY),
      bottom: Math.max(d.startClientY, e.clientY),
    };
    const el = ensureMarquee();
    el.style.display = "block";
    el.style.left = r.left + "px";
    el.style.top = r.top + "px";
    el.style.width = r.right - r.left + "px";
    el.style.height = r.bottom - r.top + "px";
    selection = new Set([...d.base, ...marqueeHits(r)]);
    renderArrange();
  }
}

function onGlobalUp(e) {
  window.removeEventListener("mousemove", onGlobalMove);
  window.removeEventListener("mouseup", onGlobalUp);
  const d = drag;
  drag = null;
  document.body.style.cursor = "";
  const el = document.getElementById("arrange-marquee");
  if (el) el.style.display = "none";
  if (!d?.global) return;
  if (d.kind === "move") {
    const cv = stripFor(d.ch);
    if (cv) cv.style.cursor = "grab";
    if (d.delta && d.movedItems) {
      commitMove(d.items, d.movedItems);
      setStatus(
        `Moved ${plural(d.items.length)} ${d.delta > 0 ? "right" : "left"} ${stepsLabel(d.delta)}.`,
      );
    }
    renderArrange();
    return;
  }
  if (d.kind === "marquee") {
    setStatus(
      selection.size
        ? `${plural(selection.size)} selected. Drag one to move the group, Delete removes.`
        : "No regions selected.",
    );
    renderArrange();
    return;
  }
  // plain click
  if (d.kind === "pending") {
    const key = selKey(d.ch, d.region.step);
    if (d.shift) {
      if (selection.has(key)) selection.delete(key);
      else selection.add(key);
      renderArrange();
      return;
    }
    if (!selection.has(key)) selection.clear();
    renderArrange();
    openStepEditor(d.ch, d.region.step);
  } else {
    const cv = stripFor(d.ch);
    const hadSelection = selection.size > 0;
    if (!d.shift) selection.clear();
    if (cv && !(hadSelection && !d.shift)) {
      const s = Math.floor(stripXY(cv, e) / cw());
      if (s >= 0 && s < NUM_STEPS) store.cycleStep(d.ch, s);
    }
    renderArrange();
  }
}

function onStripMove(ch, cv, e) {
  if (drag?.global) return;
  const x = stripXY(cv, e);
  if (!drag || drag.ch !== ch) {
    // hover cursor
    const h = hitTest(ch, x);
    cv.style.cursor =
      h.kind === "trimL" || h.kind === "trimR"
        ? "ew-resize"
        : h.kind === "xfade"
          ? "col-resize"
          : h.kind === "body"
            ? "grab"
            : "cell";
    return;
  }
  const dx = x - drag.startX;
  if (Math.abs(dx) > 3) drag.moved = true;
  if (!drag.moved) return;

  const buffer = engine.buffers?.[ch];
  const r = drag.region;
  const sd = stepDurSec();

  if (drag.kind === "trimR" && buffer) {
    // new audible length (sec) from pixel width; a reversed region plays its trimmed
    // range backwards, so its right edge is the start of the range
    const newSteps = Math.max(0.1, r.naturalSteps + dx / cw());
    const frac = (newSteps * sd * r.pitch) / buffer.duration;
    store.setStepProps(
      ch,
      r.step,
      r.rev
        ? {
            trimStart: Math.max(0, drag.trimEnd0 - frac),
            trimEnd: drag.trimEnd0,
          }
        : {
            trimStart: drag.trimStart0,
            trimEnd: Math.max(drag.trimStart0 + 1e-7, Math.min(1, drag.trimStart0 + frac)),
          },
    );
    renderArrange();
  } else if (drag.kind === "trimL" && buffer) {
    const k = (sd * r.pitch) / buffer.duration; // share of the sample per step
    if (r.loop) {
      // sustained loops keep their own start; only the sample start moves
      const newTrimStart = Math.min(
        drag.trimEnd0 - 1e-7,
        Math.max(0, drag.trimStart0 + (dx / cw()) * k),
      );
      store.setStepProps(ch, r.step, {
        trimStart: newTrimStart,
        trimEnd: drag.trimEnd0,
      });
    } else {
      // Trim from the left along the timeline: the audio that is left keeps playing at
      // the same moment, so the start moves by exactly what was trimmed (the offset).
      // A reversed region plays its range backwards, so its left edge is the range end.
      const span = (drag.trimEnd0 - drag.trimStart0 - 1e-7) / k;
      const room = r.rev ? (1 - drag.trimEnd0) / k : drag.trimStart0 / k;
      const lo = Math.max(-room, drag.lo - drag.pos0);
      const hi = Math.min(span, drag.hi - drag.pos0);
      const pos = r3(drag.pos0 + Math.max(lo, Math.min(hi, dx / cw())));
      const dS = pos - drag.pos0;
      const key = selKey(ch, drag.at);
      drag.at = relocate(ch, drag.at, pos);
      if (selection.delete(key)) selection.add(selKey(ch, drag.at));
      store.setStepProps(
        ch,
        drag.at,
        r.rev
          ? { trimStart: drag.trimStart0, trimEnd: drag.trimEnd0 - dS * k }
          : { trimStart: drag.trimStart0 + dS * k, trimEnd: drag.trimEnd0 },
      );
    }
    renderArrange();
  } else if (drag.kind === "xfade") {
    // drag right of the boundary to lengthen the crossfade; left to shorten/remove
    const bx = r.nextPos * cw();
    const spanSteps = Math.max(0, (x - bx) / cw());
    const maxSteps = Math.max(0, r.pos + r.naturalSteps - r.nextPos);
    const ms = Math.round(Math.min(spanSteps, maxSteps) * sd * 1000);
    store.setStepProps(ch, r.next, ms > 5 ? { xfade: ms } : { xfade: 0 });
    renderArrange();
  }
}

function onStripUp(ch, cv, e) {
  if (drag?.global) return;
  if (!drag || drag.ch !== ch) {
    drag = null;
    return;
  }
  const d = drag;
  drag = null;
  const x = stripXY(cv, e);
  if (d.kind === "maybeClick" && !d.moved) {
    const h = hitTest(ch, x);
    if (h.kind === "body") openStepEditor(ch, h.region.step);
    else if (h.kind === "empty") {
      const s = Math.floor(x / cw());
      if (s >= 0 && s < NUM_STEPS) {
        store.cycleStep(ch, s);
        renderArrange();
      }
    }
  } else if (d.kind === "xfade" && d.moved) {
    const o = stepObj(store.seq.steps[ch][d.region.next]);
    setStatus(
      o?.xfade
        ? `Crossfade set: ${o.xfade} ms into step ${d.region.next + 1}.`
        : "Crossfade removed.",
    );
  } else if (d.kind === "trimL" && d.moved) {
    const o = stepOff(store.seq.steps[ch][d.at]);
    setStatus(
      `Step ${d.at + 1} trimmed from the left, audio stays in place (start at step ${d.at + 1}${o ? ` + ${o.toFixed(3)}` : ""}).`,
    );
  } else if (d.kind === "trimR" && d.moved) {
    setStatus(`Step ${d.region.step + 1} trimmed (per-step override).`);
  }
}

// Attach an arrange canvas to every channel row (call after buildChannels).
export function attachStrips() {
  document.querySelectorAll("#channels .channel[data-ch]").forEach((row) => {
    if (row.querySelector(".arrange-strip")) return;
    const ch = +row.dataset.ch;
    const cv = document.createElement("canvas");
    cv.className = "arrange-strip";
    cv.width = NUM_STEPS * cw();
    cv.height = STRIP_H;
    cv.addEventListener("mousedown", (e) => onStripDown(ch, cv, e));
    cv.addEventListener("mousemove", (e) => onStripMove(ch, cv, e));
    cv.addEventListener("mouseup", (e) => onStripUp(ch, cv, e));
    cv.addEventListener("mouseleave", () => {
      if (drag?.ch === ch && !drag.global && drag.kind !== "maybeClick")
        drag = null;
    });
    cv.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      // Ctrl+click on a Mac sends a contextmenu event; that is the fine-snap drag, not
      // a request to reverse the region
      if (performance.now() - lastCtrlDown < 800) return;
      const x = stripXY(cv, e);
      const h = hitTest(ch, x);
      if (h.kind !== "empty" && h.region) {
        store.toggleStepReverse(ch, h.region.step);
        renderArrange();
      }
    });
    row.appendChild(cv);
  });
  renderArrange();
}

export function initArrange() {
  const btn = document.querySelector("#btn-view");
  btn.addEventListener("click", () => {
    arrangeMode = !arrangeMode;
    document.body.classList.toggle("arrange-mode", arrangeMode);
    btn.classList.toggle("active", arrangeMode);
    btn.textContent = arrangeMode ? "Steps" : "Arrange";
    if (arrangeMode) {
      attachStrips();
      renderArrange();
    }
  });

  const snapSel = document.querySelector("#arrange-snap");
  const zoomSel = document.querySelector("#arrange-zoom");
  snapSel?.addEventListener("change", () => {
    snap = Math.max(0, +snapSel.value || 0);
    renderArrange();
  });
  zoomSel?.addEventListener("change", () => {
    zoom = [1, 2, 4, 8].includes(+zoomSel.value) ? +zoomSel.value : 1;
    document.body.style.setProperty("--az", String(zoom));
    document.body.classList.toggle("arrange-zoomed", zoom > 1);
    document.querySelectorAll(".arrange-strip").forEach((cv) => {
      cv.width = NUM_STEPS * cw();
    });
    renderArrange();
  });

  const choke = document.querySelector("#chk-choke");
  choke.checked = !!store.project.choke;
  choke.addEventListener("change", () => {
    store.setProjectProp("choke", choke.checked);
    renderArrange();
  });
  const fade = document.querySelector("#fade-ms");
  fade.value = store.project.fadeMs ?? 15;
  fade.addEventListener("change", () => {
    store.setProjectProp(
      "fadeMs",
      Math.max(1, Math.min(500, +fade.value || 15)),
    );
  });

  ["sequence", "channels", "load"].forEach((ev) =>
    store.on(ev, () => {
      selection.clear();
    }),
  );
  // Capture phase + stopImmediatePropagation: with regions selected, the arrows nudge
  // them instead of switching sequence (main.js) and Delete removes them.
  document.addEventListener(
    "keydown",
    (e) => {
      if (!arrangeMode || !selection.size) return;
      const t = e.target;
      if (
        t &&
        (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))
      )
        return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "Escape") {
        selection.clear();
        renderArrange();
      } else if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        e.stopImmediatePropagation();
        deleteSelection();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
        e.stopImmediatePropagation();
        nudgeSelection(e.key === "ArrowRight" ? 1 : -1, e.shiftKey);
      }
    },
    true,
  );

  ["step", "sequence", "channel", "channels", "load", "project"].forEach((ev) =>
    store.on(ev, () => {
      if (arrangeMode) {
        attachStrips();
        renderArrange();
      }
    }),
  );
}

export function syncArrangeControls() {
  const choke = document.querySelector("#chk-choke");
  const fade = document.querySelector("#fade-ms");
  if (choke) choke.checked = !!store.project.choke;
  if (fade) fade.value = store.project.fadeMs ?? 15;
}
