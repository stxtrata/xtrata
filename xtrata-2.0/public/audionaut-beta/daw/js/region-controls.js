// The same gestures drive Patterns and Timeline. Views provide coordinates and
// painting only; selection, snapping, trims, collisions and commits live here.
import { store, stepVal } from './state.js';
import { engine } from './engine.js';
import { beginTransaction, endTransaction } from './history.js';
import { beatToSeconds, secondsToBeat, swingStep, unswingStep } from './timeline.js';
import {
  batchEditSongRegions,
  regionKey,
  regionSource,
  sampleDestination
} from './song-regions.js';
import { status } from './pro-ui.js';

export const REGION_SNAP_OPTIONS = [
  ['1', 'Step'],
  ['0.5', '½ step'],
  ['0.25', '¼ step'],
  ['0.125', '⅛ step'],
  ['0.0625', '1/16 step'],
  ['0', 'Off']
];
export const regionSnap = () => Number(document.querySelector('#arrange-snap')?.value ?? 1);
export function setRegionSnap(value) {
  const select = document.querySelector('#arrange-snap');
  if (select) {
    select.value = String(value);
    select.dispatchEvent(new Event('change'));
  }
}
export const rawStep = (p, beat) => unswingStep(beat * 4, p.swing);
export const stepBeat = (p, step) => swingStep(step, p.swing) / 4;
export const regionCursor = (kind) =>
  ({
    body: 'grab',
    move: 'grabbing',
    trimL: 'ew-resize',
    trimR: 'ew-resize',
    xfade: 'col-resize',
    empty: 'cell',
    marquee: 'crosshair',
    seek: 'pointer'
  })[kind] || 'default';
const round = (n) => Math.round(n * 1000) / 1000;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const uniqueRegions = (rs) => [...new Map(rs.map((r) => [regionKey(r), r])).values()];

export function regionHit(point, regions, bounds) {
  if (point.kind) return point;
  const lane = regions.filter((r) => r.trackId === point.trackId);
  // A crossfade boundary has priority over the overlapping region's trim edge.
  for (const r of lane)
    if (r.next && r.naturalEnd > r.next.start) {
      const box = bounds(r.next),
        fade = r.next.over?.xfade || 0;
      const span = bounds({
        ...r.next,
        end: secondsToBeat(point.project, beatToSeconds(point.project, r.next.start) + fade / 1000)
      });
      if (
        box &&
        point.clientX >= box.left - 6 &&
        point.clientX <= Math.max(box.left + 6, span?.right || box.left) + 6
      )
        return { ...point, kind: 'xfade', region: r };
    }
  for (const r of lane) {
    const box = bounds(r);
    if (!box || point.clientX < box.left || point.clientX > box.right) continue;
    const edge = Math.min(5, (box.right - box.left) / 4);
    return {
      ...point,
      region: r,
      kind:
        point.clientX - box.left <= edge
          ? 'trimL'
          : box.right - point.clientX <= edge
            ? 'trimR'
            : 'body'
    };
  }
  return { ...point, kind: 'empty' };
}
function canMove(project, items, delta, limits) {
  const selected = new Set(items.map(regionKey)),
    destinations = new Set();
  for (const r of items) {
    const position = rawStep(project, r.start) + delta,
      beat = stepBeat(project, position);
    if (position < limits.start || position > limits.end - 0.001 || beat < 0 || beat > 16384)
      return false;
    if (r.type === 'sample' && !r.clip) {
      const to = sampleDestination(project, r, beat);
      if (!to) return false;
      const key = `step:${to.sequence.id}:${r.index}:${to.step}`;
      if (
        destinations.has(key) ||
        (stepVal(to.sequence.steps[r.index][to.step]) && !selected.has(key))
      )
        return false;
      destinations.add(key);
    } else if (r.clip) {
      const c = regionSource(project, r).clip;
      if (!c || beat + c.duration > 16384) return false;
    } else {
      const source = regionSource(project, r);
      if (!source.note || source.note.tieId) return false;
      const local = r.sourceClip
        ? rawStep(project, beat - r.sourceClip.start + (r.sourceClip.offset || 0))
        : position % 64;
      if (local < 0 || (r.sourceClip?.type !== 'midi' && local + source.note.dur > 64))
        return false;
    }
  }
  return true;
}
export function walkRegionMove(project, items, from, target, grid, limits) {
  const increment = grid > 0 ? grid : 1 / 32;
  let delta = from;
  while (Math.abs(target - delta) > 1e-7) {
    const next = round(
      delta + Math.sign(target - delta) * Math.min(increment, Math.abs(target - delta))
    );
    if (next === delta || !canMove(project, items, next, limits)) break;
    delta = next;
  }
  return delta;
}
export function trimRegionPatch(project, r, delta, left, items, limits) {
  const start = rawStep(project, r.start),
    naturalEnd = rawStep(project, r.naturalEnd ?? r.end);
  if (!left) {
    const end = stepBeat(project, Math.max(start + 0.1, naturalEnd + delta));
    if (r.window?.loop) {
      const fraction =
        ((beatToSeconds(project, end) - beatToSeconds(project, r.start)) * r.window.rate) /
        r.buffer.duration;
      return r.window.reverse
        ? { trimStart: Math.max(0, r.window.end - fraction), trimEnd: r.window.end }
        : {
            trimStart: r.window.start,
            trimEnd: clamp(r.window.start + fraction, r.window.start + 1e-7, 1)
          };
    }
    return { end: Math.min(16384, end) };
  }
  if (r.window?.loop) {
    const fraction =
      ((beatToSeconds(project, stepBeat(project, start + delta)) -
        beatToSeconds(project, r.start)) *
        r.window.rate) /
      r.buffer.duration;
    return {
      trimStart: clamp(r.window.start + fraction, 0, r.window.end - 1e-7),
      trimEnd: r.window.end
    };
  }
  let low = limits.start,
    high = Math.min(limits.end - 0.001, naturalEnd - 0.1);
  if (r.type === 'sample' && !r.clip) {
    if (!r.buffer) throw Error('Load the sound before trimming it.');
    const w = r.window,
      room = ((w.reverse ? 1 - w.end : w.start) * r.buffer.duration) / w.rate;
    low = Math.max(
      low,
      rawStep(project, secondsToBeat(project, beatToSeconds(project, r.start) - room))
    );
    const selected = new Set(items.map(regionKey)),
      source = regionSource(project, r);
    const sequences = r.sourceClip ? [source.sequence] : project.sequences;
    for (const seq of sequences)
      for (let step = 0; step < 64; step++) {
        if (
          !stepVal(seq.steps[r.index]?.[step]) ||
          selected.has(`step:${seq.id}:${r.index}:${step}`)
        )
          continue;
        const cell = r.sourceClip
          ? rawStep(project, r.sourceClip.start - (r.sourceClip.offset || 0)) + step
          : project.sequences.indexOf(seq) * 64 + step;
        if (cell < start) low = Math.max(low, cell + 1);
        else high = Math.min(high, cell - 0.001);
      }
  } else if (r.clip) {
    const c = regionSource(project, r).clip;
    low = Math.max(
      low,
      rawStep(
        project,
        secondsToBeat(
          project,
          beatToSeconds(project, r.start) - (c.sourceOffsetSeconds || 0) / (c.playbackRate || 1)
        )
      )
    );
  }
  return {
    start: stepBeat(project, round(clamp(start + delta, low, high))),
    end: r.naturalEnd ?? r.end,
    trimLeft: true
  };
}

export function createRegionControls(view) {
  let selection = new Set(),
    drag = null,
    preview = null,
    lastCtrl = -Infinity,
    disposed = false;
  const project = () => preview?.project || store.project;
  const regions = () => view.regions(project());
  const picked = () => uniqueRegions(regions().filter((r) => selection.has(regionKey(r))));
  const repaint = () => {
    if (!disposed) view.repaint();
  };
  const cursor = (kind, target) => {
    if (target?.style) target.style.cursor = regionCursor(kind);
  };
  const hit = (e) => {
    const point = view.point(e);
    return point
      ? regionHit(
          { ...point, clientX: e.clientX, clientY: e.clientY, project: project() },
          regions(),
          view.bounds
        )
      : null;
  };
  const report = (error) => {
    status(error.message, true);
    view.message?.(error.message);
  };
  function commit(result) {
    if (!result) return;
    beginTransaction();
    try {
      for (const key of ['sequences', 'timeline', 'channels', 'instruments'])
        store.project[key] = result.project[key];
      store.emit(
        'project',
        { prop: 'sequences' },
        { historyPaths: [['sequences'], ['timeline'], ['channels'], ['instruments']] }
      );
    } finally {
      endTransaction();
    }
    selection = new Set(result.keys);
    repaint();
  }
  function apply(edits) {
    try {
      commit(batchEditSongRegions(store.project, edits));
    } catch (error) {
      report(error);
    }
  }
  function cancel() {
    const d = drag;
    drag = null;
    preview = null;
    if (d) {
      selection = d.selection;
      try {
        d.target.releasePointerCapture(d.pointerId);
      } catch {}
      cursor('body', d.target);
    }
    document.body.style.cursor = '';
    view.marquee?.(null);
    repaint();
  }
  function down(e) {
    if (!view.active() || e.button > 0 || drag) return;
    const h = hit(e);
    if (!h || h.kind === 'outside') return;
    if (e.ctrlKey) lastCtrl = performance.now();
    e.preventDefault();
    h.target?.focus?.();
    if (h.kind === 'seek') {
      view.seek?.(h.beat);
      return;
    }
    drag = {
      hit: h,
      kind: h.kind,
      pointerId: e.pointerId,
      target: h.target || e.target,
      startX: e.clientX,
      startY: e.clientY,
      startPosition: h.position,
      base: structuredClone(store.project),
      generation: store.generation,
      selection: new Set(selection),
      shift: e.shiftKey,
      delta: 0,
      moved: false,
      items: null
    };
    try {
      drag.target.setPointerCapture(e.pointerId);
    } catch {}
  }
  function move(e) {
    if (!view.active()) return;
    const h = hit(e);
    if (!drag) {
      if (h) cursor(h.kind, h.target || e.target);
      return;
    }
    if (e.pointerId !== drag.pointerId) return;
    if (store.generation !== drag.generation) {
      cancel();
      return;
    }
    const d = drag,
      dx = e.clientX - d.startX,
      dy = e.clientY - d.startY;
    if (!d.moved && Math.hypot(dx, dy) <= (e.ctrlKey ? 1 : 3)) return;
    if (!d.moved) {
      d.moved = true;
      if (d.kind === 'body') d.kind = 'move';
      else if (d.kind === 'empty') d.kind = 'marquee';
      if (d.hit.region) {
        const key = regionKey(d.hit.region);
        if (!selection.has(key)) {
          if (!d.shift) selection.clear();
          selection.add(key);
        }
        d.items = uniqueRegions(view.regions(d.base).filter((r) => selection.has(regionKey(r))));
      } else if (!d.shift) selection.clear();
    }
    cursor(d.kind, d.target);
    document.body.style.cursor = regionCursor(d.kind);
    if (d.kind === 'marquee') {
      const rect = {
        left: Math.min(d.startX, e.clientX),
        right: Math.max(d.startX, e.clientX),
        top: Math.min(d.startY, e.clientY),
        bottom: Math.max(d.startY, e.clientY)
      };
      selection = new Set(d.shift ? d.selection : []);
      for (const r of regions()) {
        const b = view.bounds(r);
        if (
          b &&
          b.left <= rect.right &&
          b.right >= rect.left &&
          b.top <= rect.bottom &&
          b.bottom >= rect.top
        )
          selection.add(regionKey(r));
      }
      view.marquee?.(rect);
      repaint();
      return;
    }
    const point = view.point(e, true);
    if (!point) return;
    const delta = point.position - d.startPosition,
      limits = view.limits(d.base);
    let edits;
    try {
      if (d.kind === 'move') {
        const grid = e.altKey ? 0 : e.ctrlKey ? 1 / 16 : regionSnap(),
          anchor = rawStep(d.base, d.hit.region.start),
          want = anchor + delta;
        const target = round((grid ? Math.round(want / grid) * grid : want) - anchor);
        d.delta = walkRegionMove(d.base, d.items, d.delta, target, grid, limits);
        edits = d.items.map((r) => ({
          region: r,
          patch: { start: stepBeat(d.base, rawStep(d.base, r.start) + d.delta) }
        }));
      } else if (d.kind === 'trimL' || d.kind === 'trimR') {
        edits = d.items.map((r) => ({
          region: r,
          patch: trimRegionPatch(d.base, r, delta, d.kind === 'trimL', d.items, limits)
        }));
      } else if (d.kind === 'xfade') {
        const r = d.hit.region,
          next = r.next;
        const seconds = clamp(
          beatToSeconds(d.base, point.beat) - beatToSeconds(d.base, next.start),
          0,
          beatToSeconds(d.base, r.naturalEnd) - beatToSeconds(d.base, next.start)
        );
        const ms = Math.round(seconds * 1000);
        edits = [{ region: next, patch: { xfade: ms > 5 ? ms : 0 } }];
      }
      if (edits) {
        const result = batchEditSongRegions(d.base, edits);
        preview = result;
        selection = new Set(result.keys);
        d.error = null;
      }
    } catch (error) {
      d.error = error;
    } // Hold the last valid position instead of losing audio.
    repaint();
  }
  function up(e) {
    if (!drag || e.pointerId !== drag.pointerId) return;
    const d = drag,
      result = preview;
    drag = null;
    preview = null;
    document.body.style.cursor = '';
    view.marquee?.(null);
    cursor('body', d.target);
    try {
      d.target.releasePointerCapture(d.pointerId);
    } catch {}
    if (store.generation !== d.generation) {
      selection = d.selection;
      repaint();
      return;
    }
    if (d.moved) {
      if (result) commit(result);
      else if (d.error) report(d.error);
      repaint();
      return;
    }
    if (d.kind === 'body') {
      const key = regionKey(d.hit.region);
      if (d.shift) {
        if (selection.has(key)) selection.delete(key);
        else selection.add(key);
      } else {
        if (!selection.has(key)) selection.clear();
        view.open(d.hit.region);
      }
    } else if (d.kind === 'empty') {
      const had = selection.size > 0;
      if (!d.shift) selection.clear();
      if (!(had && !d.shift)) view.add?.(d.hit);
    }
    repaint();
  }
  function context(e) {
    if (!view.active()) return;
    const h = hit(e);
    if (!h || h.kind === 'outside' || h.kind === 'seek') return;
    e.preventDefault();
    if (performance.now() - lastCtrl < 800) return;
    if (h.region?.type === 'sample' && !h.region.clip)
      apply([{ region: h.region, patch: { reverse: !h.region.window.reverse } }]);
  }
  function key(e) {
    if (
      !view.active() ||
      e.target?.isContentEditable ||
      e.target?.closest?.('dialog,.modal:not(.hidden),.synth-pop,.channel-controls,button,a') ||
      /^(INPUT|TEXTAREA|SELECT)$/.test(e.target?.tagName) ||
      e.metaKey ||
      e.ctrlKey ||
      e.altKey
    )
      return;
    if (e.key === 'Escape') {
      if (drag) cancel();
      selection.clear();
      view.marquee?.(null);
      repaint();
      return;
    }
    const items = picked();
    if (!items.length) return;
    if (!['Delete', 'Backspace', 'ArrowLeft', 'ArrowRight'].includes(e.key)) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    if (e.key === 'Delete' || e.key === 'Backspace')
      apply(items.map((region) => ({ region, patch: { remove: true } })));
    else {
      const unit = regionSnap() || 1 / 16,
        delta = walkRegionMove(
          store.project,
          items,
          0,
          (e.key === 'ArrowRight' ? 1 : -1) * unit * (e.shiftKey ? 4 : 1),
          unit,
          view.limits(store.project)
        );
      if (delta)
        apply(
          items.map((region) => ({
            region,
            patch: { start: stepBeat(store.project, rawStep(store.project, region.start) + delta) }
          }))
        );
    }
  }
  const root = view.root;
  const listeners = {
    pointerdown: down,
    pointermove: move,
    pointerup: up,
    pointercancel: cancel,
    lostpointercapture: () => {
      if (drag) cancel();
    },
    contextmenu: context
  };
  for (const [name, fn] of Object.entries(listeners)) root.addEventListener(name, fn);
  window.addEventListener('keydown', key, true);
  window.addEventListener('blur', cancel);
  const offs = ['load', 'channels'].map((name) =>
    store.on(name, () => {
      cancel();
      selection.clear();
    })
  );
  return {
    get project() {
      return project();
    },
    get dragging() {
      return !!drag;
    },
    get selection() {
      return selection;
    },
    get selected() {
      return picked();
    },
    isSelected: (r) => selection.has(regionKey(r)),
    apply,
    clear() {
      cancel();
      selection.clear();
      repaint();
    },
    dispose() {
      cancel();
      disposed = true;
      for (const [name, fn] of Object.entries(listeners)) root.removeEventListener(name, fn);
      window.removeEventListener('keydown', key, true);
      window.removeEventListener('blur', cancel);
      offs.forEach((f) => f());
    }
  };
}
