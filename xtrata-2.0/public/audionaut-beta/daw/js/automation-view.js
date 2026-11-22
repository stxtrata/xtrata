// Shared automation identity, drawing and gestures. This module changes the view,
// never the playback model or the saved song format.
import { store } from './state.js';
import { SYNTH_BANK } from './synths.js';
import { PLUGIN_TYPES, sendRows, RETURN_SCHEMA } from './plugins.js';
import { choice, number } from './pro-ui.js';
import { beginTransaction, endTransaction } from './history.js';
let focusedTarget = null;
export const focusAutomation = target => { focusedTarget = target; };
export const automationFocus = () => focusedTarget;
export const targetKey = t => JSON.stringify([t?.trackId, t?.kind, t?.slotId || '', t?.param || '']);
export const findLane = target => store.project.timeline.automation.find(l => targetKey(l.target) === targetKey(target));
export function automationTargets(project = store.project) {
  const result = [];
  for (const t of [...project.channels, ...project.instruments, ...project.buses, { ...project.master, id: 'master', name: 'Master' }]) {
    const add = (name, target, min, max, value, step = .01, group = 'Channel', options) =>
      result.push({ trackId: t.id, trackName: t.name, group, label: [t.name, group, name].join(' · '),
        name, target: { trackId: t.id, ...target }, min, max, value, step, options });
    add('Volume', { kind: 'volume' }, 0, 4, t.id === 'master' ? project.masterVolume : t.volume ?? 1);
    add('Pan', { kind: 'pan' }, -1, 1, t.pan || 0);
    if (t.kind === 'instrument') {
      add('Pitch bend', { kind: 'bend' }, -48, 48, 0);
      for (const p of SYNTH_BANK[t.synthId]?.params || []) if (typeof p.def === 'number')
        add(p.label || p.key, { kind: 'synthParam', param: p.key }, p.min ?? 0, p.max ?? 1, t.params?.[p.key] ?? p.def, p.step || .01, 'Instrument');
    }
    function parameter(group, p, value, target) {
      if (p.options) {
        const index = p.options.findIndex(([v]) => v === value);
        add(p.label || p.key, target, 0, p.options.length - 1, Math.max(0, index), 1, group, p.options);
      } else add(p.label || p.key, target, p.min, p.max, value, p.step || .01, group);
    }
    const returns = new Set();
    for (const [section, slots] of [['Insert', t.inserts], ['FX', t.fx], ['Send', sendRows(t)]]) {
      for (const [i, slot] of (slots || []).entries()) {
        const type = PLUGIN_TYPES[slot.type];
        if (!type) continue;
        const group = section === 'Send' ? type.name : `${section} ${i + 1} · ${type.name}`;
        for (const p of type.params)
          parameter(group, p, slot.params?.[p.key] ?? p.def, { kind: 'effectParam', slotId: slot.id, param: p.key });
        if (type.shared) returns.add(type.shared);
      }
    }
    if (t.id === 'master') for (const bus of Object.keys(RETURN_SCHEMA)) returns.add(bus);
    for (const bus of returns) {
      const group = bus === 'delay' ? 'Shared delay return' : 'Shared reverb return';
      for (const p of RETURN_SCHEMA[bus])
        parameter(group, p, project.returns?.[bus]?.[p.key] ?? p.def,
          { kind: 'effectParam', trackId: 'master', slotId: 'return:' + bus, param: p.key });
    }
  }
  return result;
}
export function fillParameterPicker(select, specs, markLanes = false) {
  const groups = new Map();
  for (const spec of specs) {
    if (!groups.has(spec.group)) {
      const group = document.createElement('optgroup');
      group.label = spec.group;
      groups.set(spec.group, group);
      select.append(group);
    }
    groups.get(spec.group).append(new Option((markLanes && findLane(spec.target) ? '● ' : '') + spec.name, targetKey(spec.target)));
  }
}
export const automationLabel = (spec, value) => spec.options?.[Math.round(value)]?.[1] ?? Number(value.toFixed(3));
export function pointValueControl(label, spec, value, update) {
  if (spec.options) return choice(label, spec.options.map(([,name], i) => [String(i), name]), String(value), v => update(Number(v)));
  return number(label, value, update, spec);
}
export function laneSpec(lane, list = automationTargets()) {
  const known = list.find(s => s.trackId === lane?.target?.trackId && targetKey(s.target) === targetKey(lane?.target));
  if (known) return known;
  let min = 0, max = 1;
  for (const point of lane?.points || []) { min = Math.min(min, point.value); max = Math.max(max, point.value); }
  return { target: lane?.target, label: 'Unavailable parameter', name: 'Unavailable parameter', min, max, value: 0, step: .01 };
}
export function automationEnd(project = store.project) {
  let end = Math.max(16, project.timeline.enabled ? project.timeline.lengthBeats : project.sequences.length * 16);
  for (const lane of project.timeline.automation) for (const point of lane.points) end = Math.max(end, point.beat);
  return end;
}
function lowerBound(points, beat) { let lo = 0, hi = points.length; while (lo < hi) { const mid = (lo + hi) >>> 1; if (points[mid].beat < beat) lo = mid + 1; else hi = mid; } return lo; }
export function automationValue(points, beat, fallback) {
  const i = lowerBound(points, beat), next = points[i], previous = points[i - 1];
  if (next?.beat === beat) return next.value;
  if (!previous) return fallback;
  if (!next || previous.curve === 'step') return previous.value;
  return previous.value + (next.value - previous.value) * (beat - previous.beat) / (next.beat - previous.beat);
}
export const pointX = (p, c) => c.x + (p.beat - c.start) / (c.end - c.start || 1) * c.width;
export const pointY = (p, c) => c.y + c.height - (p.value - c.spec.min) / (c.spec.max - c.spec.min || 1) * c.height;
export function drawAutomation(g, c, { points = c.lane?.points || [], selected = null } = {}) {
  const { x, y, width, height, start, end, spec, lane } = c;
  if (!(width > 0 && height > 0 && end > start)) return;
  g.save(); g.beginPath(); g.rect(x - 5, y - 6, width + 10, height + 12); g.clip();
  g.lineWidth = 2; g.strokeStyle = lane?.enabled === false ? '#8b97a6' : '#ffd166';
  g.setLineDash(!lane || !points.length || lane.enabled === false ? [5, 4] : []);
  const from = lowerBound(points, start), to = lowerBound(points, end);
  let visible = points.slice(from, to + (points[to]?.beat === end ? 1 : 0));
  // Preserve extrema when more than two recorded points occupy each screen pixel.
  if (visible.length > width * 2) {
    const reduced = []; let bucket;
    const flush = () => { if (bucket) for (const i of [...new Set([bucket.first, bucket.min, bucket.max, bucket.last])].sort((a, b) => a - b)) reduced.push(visible[i]); };
    visible.forEach((p, i) => { const pixel = Math.floor(pointX(p, c)); if (!bucket || pixel !== bucket.pixel) { flush(); bucket = { pixel, first: i, last: i, min: i, max: i }; } else { bucket.last = i; if (p.value < visible[bucket.min].value) bucket.min = i; if (p.value > visible[bucket.max].value) bucket.max = i; } });
    flush(); visible = reduced;
  }
  let previous = points[from - 1];
  g.beginPath(); g.moveTo(x, pointY({ value: automationValue(points, start, spec.value) }, c));
  for (const p of visible) {
    if (!previous || previous.curve === 'step') g.lineTo(pointX(p, c), pointY({ value: previous?.value ?? spec.value }, c));
    g.lineTo(pointX(p, c), pointY(p, c)); previous = p;
  }
  g.lineTo(x + width, pointY({ value: automationValue(points, end, spec.value) }, c)); g.stroke(); g.setLineDash([]);
  for (const p of visible) {
    g.beginPath(); g.arc(pointX(p, c), pointY(p, c), selected === p.beat ? 5 : 3.5, 0, Math.PI * 2);
    g.fillStyle = selected === p.beat ? '#ffffff' : '#ffd166'; g.fill();
    g.strokeStyle = '#16202b'; g.lineWidth = 1; g.stroke();
  }
  g.restore();
}
export function saveAutomation(target, points) {
  const lane = findLane(target);
  beginTransaction();
  try { return store.setAutomationLane({ ...lane, target, points }); } finally { endTransaction(); }
}
// A gesture edits a private draft. Cancel, blur, view changes and project changes
// discard it; a completed drag is one undo entry and cannot overwrite newer work.
export function automationGestures(canvas, { hit, active = () => true, repaint, selected: onSelected = () => {} }) {
  let drag = null, selection = null;
  const local = e => { const r = canvas.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
  const nearest = (c, p) => { let index = -1, distance = 10; (c.lane?.points || []).forEach((n, i) => { const d = Math.hypot(pointX(n, c) - p.x, pointY(n, c) - p.y); if (d <= distance) { distance = d; index = i; } }); return index; };
  function coordinate(e, c) {
    const p = local(e), snap = e.altKey ? 0 : e.ctrlKey ? 1 / 64 : c.snap || 0;
    let beat = c.start + (p.x - c.x) / c.width * (c.end - c.start);
    if (snap) beat = Math.round(beat / snap) * snap;
    const raw = c.spec.max - (p.y - c.y) / c.height * (c.spec.max - c.spec.min);
    const step = c.spec.step || .01;
    return { beat: Math.max(0, Math.min(c.limit ?? c.end, beat)), value: Math.max(c.spec.min, Math.min(c.spec.max, Math.round(raw / step) * step)) };
  }
  const current = () => !drag || store.project === drag.project && store.generation === drag.generation;
  function cancel() { if (!drag) return; const id = drag.id; drag = null; if (canvas.hasPointerCapture(id)) canvas.releasePointerCapture(id); repaint(); }
  function select(c, beat) { focusAutomation(c.spec.target); selection = { target: c.spec.target, beat, context: c }; onSelected(selection); }
  function down(e) {
    if (!active() || e.button !== 0 || drag) return;
    const c = hit(e); if (!c?.spec?.target) return;
    e.preventDefault(); e.stopImmediatePropagation(); canvas.focus({ preventScroll: true });
    const index = nearest(c, local(e)), points = structuredClone(c.lane?.points || []), p = coordinate(e, c);
    if (index < 0 && !points.length && p.beat > 0) points.push({ beat: 0, value: c.spec.value, curve: c.spec.options ? 'step' : 'linear' });
    const at = index < 0 ? points.push({ ...p, curve: c.spec.options ? 'step' : 'linear' }) - 1 : index;
    drag = { id: e.pointerId, project: store.project, generation: store.generation, c, points, index: at, changed: index < 0 };
    select(c, points[at].beat); canvas.setPointerCapture(e.pointerId); repaint();
  }
  function move(e) { if (!drag || e.pointerId !== drag.id) return; if (!current()) return cancel(); Object.assign(drag.points[drag.index], coordinate(e, drag.c)); drag.changed = true; selection.beat = drag.points[drag.index].beat; repaint(); }
  function up(e) {
    if (!drag || e.pointerId !== drag.id) return;
    if (!current()) return cancel();
    const d = drag; drag = null;
    if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
    if (d.changed) saveAutomation(d.c.spec.target, d.points);
    select(d.c, d.points[d.index].beat); repaint();
  }
  function remove(target, beat) { const l = findLane(target); if (l) saveAutomation(target, l.points.filter(p => p.beat !== beat)); selection = null; onSelected(null); repaint(); }
  function menu(e) { if (!active()) return; const c = hit(e); if (!c) return; e.preventDefault(); e.stopImmediatePropagation(); const i = nearest(c, local(e)); if (i >= 0) remove(c.spec.target, c.lane.points[i].beat); }
  function key(e) {
    if (!active() || (!drag && document.activeElement !== canvas)) return;
    if (e.key === 'Escape') { if (drag) { e.preventDefault(); e.stopImmediatePropagation(); cancel(); } return; }
    if (drag || !selection || e.metaKey || e.ctrlKey || e.altKey) return;
    const lane = findLane(selection.target), point = lane?.points.find(p => p.beat === selection.beat);
    if (!point) return;
    if (['Delete', 'Backspace'].includes(e.key)) { e.preventDefault(); e.stopImmediatePropagation(); remove(selection.target, selection.beat); return; }
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) return;
    e.preventDefault(); e.stopImmediatePropagation();
    const c = selection.context, factor = e.shiftKey ? 10 : 1, points = structuredClone(lane.points), p = points.find(p => p.beat === selection.beat);
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') p.beat = Math.max(0, Math.min(c.limit ?? c.end, p.beat + (e.key === 'ArrowRight' ? 1 : -1) * (c.snap || 1 / 16) * factor));
    else p.value = Math.max(c.spec.min, Math.min(c.spec.max, p.value + (e.key === 'ArrowUp' ? 1 : -1) * (c.spec.step || .01) * factor));
    saveAutomation(selection.target, points); select(c, p.beat); repaint();
  }
  const handlers = { pointerdown: down, pointermove: move, pointerup: up, pointercancel: cancel, lostpointercapture: cancel, contextmenu: menu };
  for (const [name, fn] of Object.entries(handlers)) canvas.addEventListener(name, fn, true);
  window.addEventListener('blur', cancel);
  window.addEventListener('keydown', key, true);
  const off = store.on('load', () => { cancel(); selection = null; onSelected(null); });
  return {
    get dragging() { return !!drag; }, get selection() { return selection; },
    points(target) { return drag && targetKey(target) === targetKey(drag.c.spec.target) ? [...drag.points].sort((a, b) => a.beat - b.beat) : findLane(target)?.points; },
    cancel,
    clear() { cancel(); selection = null; onSelected(null); },
    dispose() { cancel(); off(); window.removeEventListener('blur', cancel); window.removeEventListener('keydown', key, true); for (const [name, fn] of Object.entries(handlers)) canvas.removeEventListener(name, fn, true); }
  };
}
