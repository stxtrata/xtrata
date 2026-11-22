import { store } from './state.js';
import { engine } from './engine.js';
import { songBarMarks } from './song-ruler.js';
import { el, field, action, row, number, choice, toggle, bindRefresh } from './pro-ui.js';
import { fillParameterPicker, pointValueControl, automationLabel, focusAutomation, automationFocus, automationTargets, targetKey, laneSpec, automationEnd, automationValue, drawAutomation, automationGestures, saveAutomation } from './automation-view.js';
import { PLUGIN_TYPES, sharedKeys, typeParams } from './plugins.js';
const recordedAt = new Map();
export function recordEffectControl(ownerId, slot, key, value) {
  if (!engine.isPlaying || store.project.automationMode === 'read') return;
  const type = PLUGIN_TYPES[slot.type], schema = typeParams(type).find(p => p.key === key);
  if (!schema) return;
  const shared = sharedKeys(type).has(key);
  const target = { trackId: shared ? 'master' : ownerId, kind: 'effectParam',
    slotId: shared ? 'return:' + type.shared : slot.id, param: key };
  const index = schema.options?.findIndex(([v]) => v === value);
  if (index === -1) return;
  recordAutomation(target, index ?? value, schema.options ? 'step' : 'linear');
}
export function recordAutomation(target, value, curve = 'linear') {
  if (!Number.isFinite(value) || !engine.isPlaying || !['touch', 'latch', 'write'].includes(store.project.automationMode)) return;
  const key = JSON.stringify(target), time = performance.now(), last = recordedAt.get(key) || 0;
  if (curve !== 'step' && time - last < 16) return; recordedAt.set(key, time);
  store.recordAutomationPoint(target, { beat: Math.max(0, engine.getMusicalPosition().beat), value, curve });
}
export function mount(root) {
  root.append(el('h2', 'Automation'), el('p', 'Click to add a point; drag to move it. Right-click or Delete removes a point. Arrow keys fine-tune a selected point. A flat line holds its value. Hiding automation in Timeline does not stop playback.', { className: 'pro-help' }));
  const controls = row(), editor = el('div'), canvas = el('canvas', null, { className: 'automation-detail-canvas', tabindex: 0, 'aria-label': 'Automation curve. Use the point controls below for keyboard editing.' });
  root.append(controls, canvas, editor);
  let pickTrack = automationFocus()?.trackId, selected = store.project.timeline.automation.find(l => targetKey(l.target) === targetKey(automationFocus()))?.id || store.project.timeline.automation[0]?.id, pickKey = automationFocus() ? targetKey(automationFocus()) : '', page = 0, gestures, dead = false, animation;
  const pageSize = 128, lane = () => store.project.timeline.automation.find(l => l.id === selected);
  function save(points) { const l = lane(); if (l) saveAutomation(l.target, points); }
  let catalog, generation;
  function targets() {
    if (!catalog || generation !== store.generation) {
      catalog = automationTargets();
      generation = store.generation;
    }
    return catalog;
  }
  function geometry() {
    const l = lane(); return { lane: l, spec: laneSpec(l, targets()), x: 52, y: 40, width: Math.max(20, canvas.clientWidth - 68), height: 160, start: 0, end: automationEnd(), limit: automationEnd(), snap: 1 / 16 };
  }
  function draw() {
    if (dead) return;
    const width = Math.max(220, canvas.clientWidth), height = 230, scale = devicePixelRatio || 1;
    canvas.width = Math.round(width * scale); canvas.height = Math.round(height * scale);
    const g = canvas.getContext('2d'); g.scale(scale, scale); g.fillStyle = '#111926'; g.fillRect(0, 0, width, height);
    const c = geometry(); g.font = '11px system-ui';
    for (let n = 0; n <= 4; n++) {
      const y = c.y + c.height * n / 4;
      g.strokeStyle = '#293745'; g.beginPath(); g.moveTo(c.x, y); g.lineTo(c.x + c.width, y); g.stroke();
      g.fillStyle = '#afbfce'; g.fillText(String(automationLabel(c.spec, c.spec.max - (c.spec.max - c.spec.min) * n / 4)), 5, y + 4, c.x - 9);
    }
    let last = -Infinity;
    for (const mark of songBarMarks(store.project, 0, c.end)) {
      const x = c.x + mark.beat / c.end * c.width;
      if (x - last < 35) continue; last = x;
      g.fillStyle = '#afbfce'; g.fillText(String(mark.bar), x + 3, 20);
      g.fillStyle = '#293745'; g.fillRect(x, c.y, 1, c.height);
    }
    g.fillStyle = '#afbfce'; g.fillText('BAR', 5, 20);
    if (c.lane) drawAutomation(g, c, { points: gestures?.points(c.spec.target) || c.lane.points, selected: gestures?.selection?.beat });
    else { g.fillStyle = '#afbfce'; g.fillText('Add a lane to reveal its automation line.', c.x + 8, 110); }
    const beat = engine.getMusicalPosition().beat;
    if (beat >= 0 && beat <= c.end) { const x = c.x + beat / c.end * c.width; g.fillStyle = '#43e4b1'; g.fillRect(x, 26, 1, 179); }
  }
  function paint() {
    if (dead) return;
    const list = targets(), lanes = store.project.timeline.automation;
    if (lanes.length && !lane()) selected = lanes[0].id;
    if (!list.some(s => s.trackId === pickTrack)) pickTrack = list[0].trackId;
    const available = list.filter(s => s.trackId === pickTrack);
    if (!available.some(s => targetKey(s.target) === pickKey)) pickKey = targetKey(available[0].target);
    const parameter = el('select', null, { 'aria-label': 'New lane' });
    fillParameterPicker(parameter, available);
    parameter.value = pickKey;
    parameter.onchange = () => { pickKey = parameter.value; };
    controls.replaceChildren(choice('Mode', ['read', 'touch', 'latch', 'write'], store.project.automationMode || 'read', v => store.setProjectProp('automationMode', v)));
    controls.append(choice('Track', [...new Map(list.map(s => [s.trackId, s.trackName]))], pickTrack, id => { pickTrack = id; paint(); }),
      field('New lane', parameter), action('Add lane', () => {
      const spec = list.find(s => targetKey(s.target) === pickKey), existing = lanes.find(l => targetKey(l.target) === pickKey);
      selected = existing?.id || saveAutomation(spec.target, [{ beat: 0, value: spec.value, curve: spec.options ? 'step' : 'linear' }]).id; page = 0; paint();
    }), choice('Lane', lanes.map(l => [l.id, laneSpec(l, list).label + (l.enabled === false ? ' (bypassed)' : '')]), selected || '', v => { gestures.clear(); selected = v; focusAutomation(lane()?.target); page = 0; paint(); }));
    editor.replaceChildren(); draw();
    const current = lane(); if (!current) { editor.append(el('p', 'Create a lane to start editing.')); return; }
    const spec = laneSpec(current, list);
    editor.append(row(toggle('Enabled', current.enabled !== false, v => store.setAutomationLane({ ...current, enabled: v })), action('Add point at playhead', () => {
      const beat = Math.max(0, Math.min(automationEnd(), engine.getMusicalPosition().beat));
      save([...current.points, { beat, value: automationValue(current.points, beat, spec.value), curve: spec.options ? 'step' : 'linear' }]); paint();
    }), action('Delete lane', () => { gestures.clear(); store.setTimeline({ automation: lanes.filter(l => l.id !== selected) }); selected = null; paint(); })));
    page = Math.max(0, Math.min(page, Math.ceil(current.points.length / pageSize) - 1));
    editor.append(row(action('Previous points', () => { page = Math.max(0, page - 1); paint(); }, { disabled: page === 0 }), el('span', `Points ${Math.min(current.points.length, page * pageSize + 1)}–${Math.min(current.points.length, (page + 1) * pageSize)} of ${current.points.length}`), action('Next points', () => { page++; paint(); }, { disabled: (page + 1) * pageSize >= current.points.length })));
    const points = el('div', null, { className: 'pro-points' });
    for (let i = page * pageSize; i < Math.min(current.points.length, (page + 1) * pageSize); i++) {
      const p = current.points[i], change = patch => { const next = structuredClone(lane().points); const at = next.findIndex(n => n.beat === p.beat); if (at < 0) return; Object.assign(next[at], patch); save(next); paint(); };
      points.append(row(number(`Point ${i + 1} beat`, p.beat, v => change({ beat: v }), { max: automationEnd(), step: 1 / 16 }), pointValueControl(`Point ${i + 1} value`, spec, p.value, v => change({ value: v })), choice(`Point ${i + 1} curve`, spec.options ? ['step'] : ['linear', 'step'], p.curve || 'linear', v => change({ curve: v })), action('Remove point', () => { save(lane().points.filter(n => n.beat !== p.beat)); paint(); })));
    }
    editor.append(points);
  }
  gestures = automationGestures(canvas, { hit: e => {
    const c = geometry(), r = canvas.getBoundingClientRect();
    return c.lane && e.clientX >= r.left + c.x - 6 && e.clientX <= r.left + c.x + c.width + 6 && e.clientY >= r.top + c.y - 6 && e.clientY <= r.top + c.y + c.height + 6 ? c : null;
  }, repaint: () => { if (gestures.dragging) draw(); else paint(); } });
  const off = bindRefresh(store, () => { if (!gestures.dragging) { if (editor.contains(document.activeElement)) draw(); else paint(); } }, ['project', 'load', 'channels', 'instruments', 'channel', 'instrument']);
  const ro = new ResizeObserver(draw); ro.observe(canvas);
  let previousBeat = -1;
  const animate = () => { if (dead) return; const beat = engine.getMusicalPosition().beat; if (beat !== previousBeat) { previousBeat = beat; draw(); } animation = requestAnimationFrame(animate); };
  paint(); animate();
  return () => { dead = true; gestures.dispose(); off(); ro.disconnect(); cancelAnimationFrame(animation); };
}
