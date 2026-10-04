import { midiName } from "./onboard-catalog.js";
import { sustainDuration, sampleLoop } from "./onboard-library.js";
// arrange.js — Logic-style arrange view: the step grid flips to waveform regions.
// Regions render their real audible length; choke cuts at the next trigger; per-step
// crossfades (xfade, ms) blend a region into the next one — drag the boundary to set.
// Drag region edges to trim. Click = edit, right-click = reverse, click empty = add.
// Drag on empty space to marquee-select regions (Shift adds); drag a selected region
// to move the whole group along the timeline. Delete removes, arrows nudge, Esc clears.

import { store, NUM_STEPS, stepVal, stepObj } from "./state.js";
import { engine } from "./engine.js";
import { openStepEditor, setStatus } from "./ui.js";

const CELL_W = 14,
  STRIP_H = 40;
const EDGE_PX = 5; // trim-handle zone at region edges
const XF_PX = 6; // crossfade-handle zone around a cutting boundary
let arrangeMode = false;
let playheadStep = -1;
let drag = null; // { kind:'trimL'|'trimR'|'xfade'|'maybeClick'|'pending'|'move'|'marquee', ch, step, ... }
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
    const nextObj = next != null ? stepObj(row[next]) : null;
    const nextXfadeSteps = nextObj?.xfade ? nextObj.xfade / 1000 / sd : 0;

    let widthSteps = naturalSteps;
    let cut = false,
      xfaded = false;
    if (next != null && s + naturalSteps > next) {
      if (nextXfadeSteps > 0) {
        widthSteps = Math.min(naturalSteps, next - s + nextXfadeSteps);
        xfaded = true;
      } else if (store.project.choke) {
        widthSteps = next - s;
        cut = true;
      }
    }
    widthSteps = Math.min(widthSteps, NUM_STEPS - s);
    return {
      step: s,
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
  for (let s = 0; s <= NUM_STEPS; s += 4) {
    g.fillStyle = s % 16 === 0 ? "#39424e" : "#1e2732";
    g.fillRect(s * CELL_W, 0, 1, H);
  }

  const buffer = engine.buffers?.[ch];
  const data = buffer?.getChannelData(0);

  for (const r of channelRegions(ch)) {
    const x = r.step * CELL_W;
    const w = Math.max(3, r.widthSteps * CELL_W);
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
      const bx = r.next * CELL_W;
      const fx = r.nextXfadeSteps * CELL_W;
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
    g.fillRect(playheadStep * CELL_W, 0, CELL_W, H);
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
    const overlaps = r.step + r.naturalSteps > r.next;
    if (!overlaps) continue;
    const bx = r.next * CELL_W;
    const fxEnd = bx + Math.max(XF_PX, r.nextXfadeSteps * CELL_W);
    if (x >= bx - XF_PX && x <= fxEnd + XF_PX) {
      return { kind: "xfade", region: r };
    }
  }
  for (const r of regions) {
    const x0 = r.step * CELL_W,
      x1 = x0 + Math.max(3, r.widthSteps * CELL_W);
    if (x < x0 || x > x1) continue;
    if (x - x0 <= EDGE_PX) return { kind: "trimL", region: r };
    if (x1 - x <= EDGE_PX) return { kind: "trimR", region: r };
    return { kind: "body", region: r };
  }
  return { kind: "empty" };
}

function onStripDown(ch, cv, e) {
  if (e.button === 2) return;
  const x = stripXY(cv, e);
  const h = hitTest(ch, x);
  if (h.kind === "trimL" || h.kind === "trimR" || h.kind === "xfade") {
    drag = {
      kind: h.kind,
      ch,
      region: h.region,
      startX: x,
      moved: false,
      trimStart0: h.region.trimStart,
      trimEnd0: h.region.trimEnd,
    };
    e.preventDefault();
  } else {
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
function selectedItems() {
  const items = [];
  for (const k of selection) {
    const [ch, step] = k.split(":").map(Number);
    const val = store.seq.steps[ch]?.[step];
    if (stepVal(val)) items.push({ ch, step, val });
  }
  return items;
}

function moveBounds(items) {
  let lo = Infinity,
    hi = -Infinity;
  for (const it of items) {
    lo = Math.min(lo, it.step);
    hi = Math.max(hi, it.step);
  }
  return { min: -lo, max: NUM_STEPS - 1 - hi };
}

// Rebuild the touched rows from their originals with the group shifted by delta.
function applyMove(items, orig, delta) {
  for (const [ch, row0] of orig) {
    const row = row0.slice();
    for (const it of items) if (it.ch === ch) row[it.step] = 0;
    for (const it of items) if (it.ch === ch) row[it.step + delta] = it.val;
    store.seq.steps[ch] = row;
  }
}

function origRows(items) {
  const orig = new Map();
  for (const it of items)
    if (!orig.has(it.ch)) orig.set(it.ch, store.seq.steps[it.ch].slice());
  return orig;
}

// Tell the rest of the app (step grid, history) once the move has settled.
function commitMove(items, delta) {
  const cells = new Set();
  for (const it of items) {
    cells.add(selKey(it.ch, it.step));
    cells.add(selKey(it.ch, it.step + delta));
  }
  for (const k of cells) {
    const [ch, step] = k.split(":").map(Number);
    store.emit("step", { ch, step, val: store.seq.steps[ch][step] });
  }
}

function nudgeSelection(delta) {
  const items = selectedItems();
  if (!items.length) return;
  const { min, max } = moveBounds(items);
  delta = Math.max(min, Math.min(max, delta));
  if (!delta) return;
  applyMove(items, origRows(items), delta);
  selection = new Set(items.map((it) => selKey(it.ch, it.step + delta)));
  commitMove(items, delta);
  renderArrange();
  setStatus(`Moved ${items.length} region${items.length === 1 ? "" : "s"} ${delta > 0 ? "right" : "left"} ${Math.abs(delta)} step${Math.abs(delta) === 1 ? "" : "s"}.`);
}

function deleteSelection() {
  const items = selectedItems();
  if (!items.length) return;
  for (const it of items) store.seq.steps[it.ch][it.step] = 0;
  selection.clear();
  for (const it of items) store.emit("step", { ch: it.ch, step: it.step, val: 0 });
  renderArrange();
  setStatus(`Deleted ${items.length} region${items.length === 1 ? "" : "s"}.`);
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
      const x0 = box.left + reg.step * CELL_W * k;
      const x1 = x0 + Math.max(3, reg.widthSteps * CELL_W) * k;
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
    if (Math.hypot(dx, dy) <= 3) return;
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
      d.bounds = moveBounds(d.items);
      d.delta = 0;
      const cv = stripFor(d.ch);
      const box = cv.getBoundingClientRect();
      d.scale = cv.width / box.width;
    } else {
      d.kind = "marquee";
      if (!d.shift) selection.clear();
      d.base = new Set(selection);
    }
  }
  if (d.kind === "move") {
    const raw = Math.round((dx * d.scale) / CELL_W);
    const delta = Math.max(d.bounds.min, Math.min(d.bounds.max, raw));
    if (delta === d.delta) return;
    d.delta = delta;
    applyMove(d.items, d.orig, delta);
    selection = new Set(d.items.map((it) => selKey(it.ch, it.step + delta)));
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
  const el = document.getElementById("arrange-marquee");
  if (el) el.style.display = "none";
  if (!d?.global) return;
  if (d.kind === "move") {
    if (d.delta) {
      commitMove(d.items, d.delta);
      setStatus(
        `Moved ${d.items.length} region${d.items.length === 1 ? "" : "s"} ${d.delta > 0 ? "right" : "left"} ${Math.abs(d.delta)} step${Math.abs(d.delta) === 1 ? "" : "s"}.`,
      );
    }
    renderArrange();
    return;
  }
  if (d.kind === "marquee") {
    setStatus(
      selection.size
        ? `${selection.size} region${selection.size === 1 ? "" : "s"} selected. Drag one to move the group, Delete removes.`
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
      const s = Math.floor(stripXY(cv, e) / CELL_W);
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
            ? "pointer"
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
    // new audible length (sec) from pixel width → new trimEnd
    const newSteps = Math.max(0.1, r.naturalSteps + dx / CELL_W);
    const newRegionSec = newSteps * sd * 1; // audible sec
    const newTrimEnd = Math.min(
      1,
      drag.trimStart0 + (newRegionSec * r.pitch) / buffer.duration,
    );
    store.setStepProps(ch, r.step, {
      trimStart: drag.trimStart0,
      trimEnd: Math.max(drag.trimStart0 + 1e-7, newTrimEnd),
    });
    renderArrange();
  } else if (drag.kind === "trimL" && buffer) {
    const dSec = (dx / CELL_W) * sd * r.pitch;
    const newTrimStart = Math.min(
      drag.trimEnd0 - 1e-7,
      Math.max(0, drag.trimStart0 + dSec / buffer.duration),
    );
    store.setStepProps(ch, r.step, {
      trimStart: newTrimStart,
      trimEnd: drag.trimEnd0,
    });
    renderArrange();
  } else if (drag.kind === "xfade") {
    // drag right of the boundary to lengthen the crossfade; left to shorten/remove
    const bx = r.next * CELL_W;
    const spanSteps = Math.max(0, (x - bx) / CELL_W);
    const maxSteps = Math.max(0, r.step + r.naturalSteps - r.next);
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
      const s = Math.floor(x / CELL_W);
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
  } else if ((d.kind === "trimL" || d.kind === "trimR") && d.moved) {
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
    cv.width = NUM_STEPS * CELL_W;
    cv.height = STRIP_H;
    cv.addEventListener("mousedown", (e) => onStripDown(ch, cv, e));
    cv.addEventListener("mousemove", (e) => onStripMove(ch, cv, e));
    cv.addEventListener("mouseup", (e) => onStripUp(ch, cv, e));
    cv.addEventListener("mouseleave", () => {
      if (drag?.ch === ch && !drag.global && drag.kind !== "maybeClick") drag = null;
    });
    cv.addEventListener("contextmenu", (e) => {
      e.preventDefault();
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
  // Capture phase + stopImmediatePropagation: with regions selected, the arrows
  // nudge them instead of switching sequence (main.js) and Delete removes them.
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
        nudgeSelection(
          (e.key === "ArrowRight" ? 1 : -1) * (e.shiftKey ? 4 : 1),
        );
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
