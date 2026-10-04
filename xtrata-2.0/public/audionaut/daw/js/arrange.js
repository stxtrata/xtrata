import { midiName } from "./onboard-catalog.js";
import { sustainDuration, sampleLoop } from "./onboard-library.js";
// arrange.js — Logic-style arrange view: the step grid flips to waveform regions.
// Regions render their real audible length; choke cuts at the next trigger; per-step
// crossfades (xfade, ms) blend a region into the next one — drag the boundary to set.
// Drag region edges to trim, drag a region's body to move it. Regions sit at their true
// position (step + fractional offset); the Snap menu picks the move grid (Step … 1/16 of a
// step, or Off) and Alt bypasses it. Zoom widens the steps so fine moves are visible.
// A region stops at its neighbours. Click = edit, right-click = reverse, click empty = add.

import { store, NUM_STEPS, stepVal, stepObj, stepOff } from "./state.js";
import { engine } from "./engine.js";
import { openStepEditor, setStatus } from "./ui.js";

const CELL_W = 14, // px per step at 1x zoom
  STRIP_H = 40;
const EDGE_PX = 5; // trim-handle zone at region edges
const XF_PX = 6; // crossfade-handle zone around a cutting boundary
let arrangeMode = false;
let zoom = 1; // 1, 2, 4, 8 — canvas pixels per step = CELL_W * zoom
let snap = 1; // move grid in steps: 1, .5, .25, .125, .0625 — 0 = free
const cw = () => CELL_W * zoom;
let playheadStep = -1;
let drag = null; // { kind:'trimL'|'trimR'|'xfade'|'move', ch, step, ... }

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

// Round a position (in steps) to the move grid, then keep it inside [lo, hi].
function fitPos(pos, lo, hi, grid) {
  let p = grid > 0 ? Math.round(pos / grid) * grid : pos;
  if (p < lo) p = grid > 0 ? Math.ceil(lo / grid - 1e-9) * grid : lo;
  if (p > hi) p = grid > 0 ? Math.floor(hi / grid + 1e-9) * grid : hi;
  return Math.round(p * 1000) / 1000;
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
  } else if (h.kind === "body") {
    // Body: click opens the editor, drag moves the region. It can slide between its
    // neighbouring triggers but not jump over them.
    const row = store.seq.steps[ch];
    const from = h.region.step;
    // the region keeps its own step slot between its neighbours' slots
    let lo = 0,
      hi = NUM_STEPS - 0.001;
    for (let t = 0; t < NUM_STEPS; t++) {
      if (t === from || !stepVal(row[t])) continue;
      if (t < from) lo = Math.max(lo, t + 1);
      else hi = Math.min(hi, t - 0.001);
    }
    drag = {
      kind: "move",
      ch,
      region: h.region,
      startX: x,
      moved: false,
      from,
      at: from,
      pos: h.region.pos,
      pos0: h.region.pos,
      lo,
      hi,
    };
    e.preventDefault();
  } else {
    drag = { kind: "maybeClick", ch, startX: x, moved: false };
  }
}

function onStripMove(ch, cv, e) {
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

  if (drag.kind === "move") {
    cv.style.cursor = "grabbing";
    const grid = e.altKey ? 0 : snap; // Alt = free move
    const to = fitPos(drag.pos0 + dx / cw(), drag.lo, drag.hi, grid);
    if (to !== drag.pos) {
      drag.at = store.moveStep(ch, drag.at, to);
      drag.pos = to;
      renderArrange();
    }
  } else if (drag.kind === "trimR" && buffer) {
    // new audible length (sec) from pixel width → new trimEnd
    const newSteps = Math.max(0.1, r.naturalSteps + dx / cw());
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
    const dSec = (dx / cw()) * sd * r.pitch;
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
    const bx = r.nextPos * cw();
    const spanSteps = Math.max(0, (x - bx) / cw());
    const maxSteps = Math.max(0, r.pos + r.naturalSteps - r.nextPos);
    const ms = Math.round(Math.min(spanSteps, maxSteps) * sd * 1000);
    store.setStepProps(ch, r.next, ms > 5 ? { xfade: ms } : { xfade: 0 });
    renderArrange();
  }
}

function onStripUp(ch, cv, e) {
  if (!drag || drag.ch !== ch) {
    drag = null;
    return;
  }
  const d = drag;
  drag = null;
  const x = stripXY(cv, e);
  if (d.kind === "move") {
    if (!d.moved) openStepEditor(ch, d.from);
    else if (d.pos !== d.pos0) {
      const o = stepOff(store.seq.steps[ch][d.at]);
      setStatus(
        `Moved from step ${d.from + 1} to step ${d.at + 1}${o ? ` + ${o.toFixed(3)} step` : ""}.`,
      );
    }
    cv.style.cursor = "grab";
  } else if (d.kind === "maybeClick" && !d.moved) {
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
    cv.width = NUM_STEPS * cw();
    cv.height = STRIP_H;
    cv.addEventListener("mousedown", (e) => onStripDown(ch, cv, e));
    cv.addEventListener("mousemove", (e) => onStripMove(ch, cv, e));
    cv.addEventListener("mouseup", (e) => onStripUp(ch, cv, e));
    cv.addEventListener("mouseleave", () => {
      if (drag?.ch === ch && drag.kind !== "maybeClick") drag = null;
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
