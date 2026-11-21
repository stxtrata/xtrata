import {
  createRegionControls,
  REGION_SNAP_OPTIONS,
  regionSnap,
  setRegionSnap,
  rawStep
} from './region-controls.js';
import { songPosition, songBarMarks } from './song-ruler.js';
import { store } from './state.js';
import { engine } from './engine.js';
import { songRegions, editSongRegion, waveformIndex } from './song-regions.js';
import { drawWaveformRegion } from './waveform-drawing.js';
import { beatToSeconds, secondsToBeat } from './timeline.js';
import { beginTransaction, endTransaction } from './history.js';
import {
  openStepEditor,
  createTrackControls,
  refreshTrackControls,
  bindChannelDrop
} from './ui.js';
import { getMidiTarget } from './midi-input.js';
import { openRoll, openClipRoll } from './pianoroll.js';
import { fillParameterPicker, automationLabel, pointValueControl, focusAutomation, automationTargets, targetKey, findLane, automationEnd, automationValue, drawAutomation, automationGestures, saveAutomation } from './automation-view.js';
import { el, action, row, choice, toggle, status, number } from './pro-ui.js';

const HEADER = 44;
export function mount(root) {
  const touch = navigator.maxTouchPoints > 0 || matchMedia('(any-pointer: coarse)').matches;
  let scrolling = touch, compactTracks = touch;
  let LEFT = 560,
    TRACK = 48,
    zoom = 56,
    follow = true,
    controls = null,
    modelProject = null,
    modelGeneration = -1,
    model = null,
    rows = [],
    dead = false,
    frame = 0,
    queued = 0,
    advancedDispose = null,
    automation = false,
    automationControls = null,
    specs = [], specGeneration = -1;
  const parameters = new Map();
  try { automation = localStorage.getItem('audionaut.beta-pro.timeline.automation') === 'on'; } catch {}
  const play = action('Play', () => document.querySelector('#btn-play').click(), {
      'aria-label': 'Play or pause song'
    }),
    position = el('output', 'Bar 1 · Beat 1', { 'aria-label': 'Song position' });
  const toolbar = row(
    play,
    action('Stop', () => document.querySelector('#btn-stop').click()),
    action('Return to start', () => engine.seekBeat(0)),
    position,
    choice('Snap', REGION_SNAP_OPTIONS, String(regionSnap()), setRegionSnap),
    choice(
      'Zoom',
      [
        ['14', '25%'],
        ['28', '50%'],
        ['56', '100%'],
        ['112', '200%'],
        ['224', '400%']
      ],
      String(zoom),
      (v) => {
        zoom = +v;
        draw();
      }
    ),
    action('Fit song', () => {
      zoom = Math.max(1, (scroll.clientWidth - LEFT - 20) / (automation ? Math.max(model.end, automationEnd()) : model.end));
      draw();
    }),
    toggle('Follow playhead', follow, (v) => (follow = v))
  );
  const navigation = el('div', null, {
    className: 'song-navigation', role: 'group', 'aria-label': 'Timeline navigation'
  });
  const scrollButton = action('Scroll', () => setInteraction(true), {title:'Swipe the waveform to scroll in time or between tracks'});
  const editButton = action('Edit', () => setInteraction(false), {title:'Drag regions, trim their edges or edit automation'});
  function setInteraction(value) {
    scrolling = value;
    controls?.clear();
    automationControls?.clear();
    frameBox.classList.toggle('song-scroll-mode', value);
    scrollButton.setAttribute('aria-pressed', String(value));
    editButton.setAttribute('aria-pressed', String(!value));
    editTools();
  }
  const tracksButton = action('Track controls', () => {
    const anchor = scroll.scrollTop / TRACK;
    compactTracks = !compactTracks;
    draw();
    scroll.scrollTop = anchor * TRACK;
    draw();
  }, {title:'Show or collapse the channel controls beside the waveforms'});
  if (touch) navigation.append(scrollButton, editButton);
  navigation.append(tracksButton);
  const sequenceField = choice('Edit sequence', [], '0', (v) => store.selectSequence(+v));
  const sequenceSelect = sequenceField.querySelector('select');
  sequenceSelect.title = 'MIDI rolls and note copy/paste use this sequence.';
  toolbar.append(
    sequenceField,
    action('+ Audio channel', () => document.querySelector('#channels .ch-add').click()),
    action('+ Instrument', () => document.querySelector('#pro-add-instrument').click())
  );
  const automationButton = action('Automation', () => {
    controls?.clear(); automationControls?.clear();
    automation = !automation;
    try { localStorage.setItem('audionaut.beta-pro.timeline.automation', automation ? 'on' : 'off'); } catch {}
    refresh();
  }, { className: 'song-automation-toggle', 'aria-pressed': String(automation), title: 'Show or hide automation editing. Playback automation stays enabled.' });
  toolbar.append(automationButton);
  toolbar.classList.add('song-transport');
  const frameBox = el('div', null, { className: 'song-frame' }),
    scroll = el('div', null, {
      className: 'song-scroll',
      'aria-label': 'Scrollable song timeline',
      tabindex: 0
    }),
    content = el('div', null, { className: 'song-content' }),
    canvas = el('canvas', null, {
      className: 'song-canvas',
      'aria-label': 'Song waveform timeline',
      tabindex: 0
    }),
    headers = el('div', null, { className: 'song-track-headers' }),
    playhead = el('div', null, { className: 'song-playhead', 'aria-hidden': 'true' }),
    info = el(
      'p',
      'Drag regions to move; drag either edge to trim. Shift-click or drag empty space to select a group. Alt: free · Ctrl: fine · right-click: reverse.',
      { className: 'pro-help' }
    ),
    tools = row(),
    advanced = el('details', null, { className: 'song-advanced' });
  advanced.append(
    el('summary', 'Advanced arrangement, loop and tempo'),
    el(
      'p',
      'Existing custom arrangements are preserved. Pattern edits update every linked appearance.',
      { className: 'pro-help' }
    )
  );
  content.append(canvas);
  scroll.append(content);
  frameBox.append(scroll, headers, playhead);
  root.append(toolbar, navigation, frameBox, info, tools, advanced);
  let advancedTicket = 0;
  advanced.addEventListener('toggle', async () => {
    if (!advanced.open || advancedDispose) return;
    const ticket = ++advancedTicket;
    const module = await import('./pro-arrangement-tools.js');
    if (dead || ticket !== advancedTicket) return;
    const host = el('div');
    advanced.append(host);
    advancedDispose = module.mount(host);
  });
  const displayProject = () => controls?.project || store.project;
  function getModel(project = displayProject()) {
    if (!model || modelProject !== project || modelGeneration !== store.generation) {
      model = songRegions(project, engine.buffers);
      modelProject = project;
      modelGeneration = store.generation;
    }
    return model;
  }
  const chosen = () => controls?.selected[0];
  function openEditor(r) {
    if (r.clip) {
      advanced.open = true;
      return;
    }
    if (r.sourceClip?.type === 'midi') {
      openClipRoll(r.sourceClip.id);
      return;
    }
    store.selectSequence(r.sequenceIndex);
    if (r.type === 'sample') openStepEditor(r.index, r.step);
    else openRoll(r.index);
  }
  function editTools() {
    tools.replaceChildren();
    if (scrolling) {
      info.textContent = 'Swipe to scroll through the song and tracks. Tap Edit to move regions or change automation.';
      return;
    }
    info.textContent = 'Drag a region to move it or drag either end to trim.';
    if (automation) {
      info.textContent = 'Automation overlay · click to add, drag to move, right-click to remove. Arrow keys fine-tune a selected point. Alt: free · Ctrl: fine. Switch Automation off to edit regions; automation keeps playing.';
      const selection = automationControls?.selection, lane = selection && findLane(selection.target), point = lane?.points.find(p => p.beat === selection.beat);
      if (point) {
        const spec = specs.find(s => targetKey(s.target) === targetKey(selection.target));
        if (!spec) return;
        const change = patch => { const l = findLane(selection.target); if (!l) return; const points = structuredClone(l.points), p = points.find(p => p.beat === selection.beat); if (!p) return; Object.assign(p, patch); saveAutomation(selection.target, points); selection.beat = p.beat; draw(); editTools(); };
        tools.append(el('strong', spec.label), number('Automation point beat', point.beat, v => change({ beat: v }), { max: automationEnd(), step: 1 / 16 }), pointValueControl('Automation point value', spec, point.value, v => change({ value: v })), choice('Automation point curve', spec.options ? ['step'] : ['linear', 'step'], point.curve || 'linear', v => change({ curve: v })));
      }
      return;
    }
    const r = chosen();
    if (!r) return;
    info.textContent = `${r.track.name} · ${r.type === 'sample' ? 'Audio region' : 'Note'} · beat ${(r.start + 1).toFixed(2)}${r.missing ? ' · Sound unavailable' : ''}`;
    tools.append(
      action('Edit region', () => openEditor(r)),
      action(controls.selected.length > 1 ? 'Delete selected' : 'Delete region', () =>
        controls.apply(controls.selected.map((region) => ({ region, patch: { remove: true } })))
      )
    );
    if (r.type === 'sample' && !r.clip)
      tools.append(
        action('Reverse', () =>
          controls.apply([{ region: r, patch: { reverse: !r.window.reverse } }])
        )
      );
  }
  function refresh() {
    if (dead) return;
    modelProject = null;
    model = getModel();
    rows = [...store.project.channels, ...store.project.instruments, ...(automation ? [...store.project.buses, { ...store.project.master, id: 'master', name: 'Master' }] : [])].filter((t) => !t.assetOnly);

    const sequenceIds = store.project.sequences.map((s) => s.id).join(',');
    if (sequenceSelect.dataset.ids !== sequenceIds) {
      sequenceSelect.replaceChildren(
        ...store.project.sequences.map((s, i) => el('option', `Sequence ${i + 1}`, { value: i }))
      );
      sequenceSelect.dataset.ids = sequenceIds;
    }
    sequenceSelect.value = store.project.currentSequence;
    draw();
    editTools();
  }
  function queue() {
    if (!queued)
      queued = requestAnimationFrame(() => {
        queued = 0;
        refresh();
      });
  }
  function draw() {
    if (dead) return;
    model = getModel();
    rows = [...store.project.channels, ...store.project.instruments, ...(automation ? [...store.project.buses, { ...store.project.master, id: 'master', name: 'Master' }] : [])].filter((t) => !t.assetOnly);
    if (specGeneration !== store.generation) { specs = automationTargets(); specGeneration = store.generation; }
    automationButton.setAttribute('aria-pressed', String(automation));
    frameBox.classList.toggle('song-automation-active', automation);
    const songEnd = automation ? Math.max(model.end, automationEnd()) : model.end;
    const width = Math.max(1, scroll.clientWidth),
      height = Math.max(180, scroll.clientHeight),
      sx = scroll.scrollLeft,
      sy = scroll.scrollTop;
    LEFT = compactTracks ? Math.min(104, Math.floor(width * .21)) :
      touch ? Math.min(350, Math.floor(width * .52)) :
      width >= 1000 ? 560 : width >= 700 ? 300 : Math.min(220, Math.floor(width * .55));
    // The expanded instrument strip occupies 14 grid cells including its two double-width fields.
    // Keep this in step with the touch grid's 44px targets, 3px gaps and 15px side insets.
    const columns = Math.max(2, Math.floor((LEFT - 15 + 3) / 47));
    const touchHeight = Math.ceil(14 / columns) * 47 + 8;
    TRACK = compactTracks ? 48 : touch ? touchHeight :
      width >= 1000 ? 48 : width >= 700 ? 96 : 144;
    tracksButton.setAttribute('aria-expanded', String(!compactTracks));
    frameBox.classList.toggle('song-compact-controls', !compactTracks && (touch || width < 1000));
    frameBox.classList.toggle('song-touch-controls', touch && !compactTracks);
    frameBox.classList.toggle('song-names-only', compactTracks);
    frameBox.style.setProperty('--song-controls-width', LEFT + 'px');
    frameBox.style.setProperty('--song-track-height', TRACK + 'px');
    canvas.dataset.controlsWidth = LEFT;
    canvas.dataset.trackHeight = TRACK;
    content.style.width = `${Math.max(width, LEFT + songEnd * zoom + 24)}px`;
    content.style.height = `${Math.max(height, HEADER + rows.length * TRACK)}px`;
    const scale = window.devicePixelRatio || 1;
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    const g = canvas.getContext('2d');
    g.scale(scale, scale);
    g.fillStyle = '#0d1319';
    g.fillRect(0, 0, width, height);
    const leftBeat = Math.max(0, sx / zoom),
      rightBeat = (sx + width - LEFT) / zoom;
    g.save();
    g.beginPath();
    g.rect(LEFT, HEADER, width - LEFT, height - HEADER);
    g.clip();
    for (let b = Math.floor(leftBeat); b <= rightBeat; b++) {
      const x = LEFT + b * zoom - sx;
      g.fillStyle = b % 16 === 0 && !store.project.timeline.enabled ? '#52606e' : '#1e2933';
      g.fillRect(x, HEADER, 1, height);
    }
    // Meter-aware bar lines; sequence boundaries remain at 16 quarter-note beats.
    for (const mark of songBarMarks(store.project, leftBeat, rightBeat)) {
      g.fillStyle = '#34404b';
      g.fillRect(LEFT + mark.beat * zoom - sx, HEADER, 1, height);
    }
    const seen = new Set();
    rows.forEach((track, i) => {
      const y = HEADER + i * TRACK - sy;
      if (y + TRACK < HEADER || y > height) return;
      g.fillStyle = '#25303b';
      g.fillRect(LEFT, y + TRACK - 1, width - LEFT, 1);
      seen.add(track.id);
      let label = [...headers.children].find((n) => n.dataset.trackId === track.id);
      const sampleIndex = store.project.channels.findIndex((t) => t.id === track.id);
      const index =
        sampleIndex < 0
          ? store.project.instruments.findIndex((t) => t.id === track.id)
          : sampleIndex;
      const kind = sampleIndex >= 0 ? 'sample' : index >= 0 ? 'instrument' : 'bus';
      if (label && (label.dataset.ownerIndex !== String(index) || label.dataset.kind !== kind || label.dataset.compact !== String(compactTracks))) {
        label.remove();
        label = null;
      }
      if (!label) {
        label = el('div', null, { className: 'song-track', role: 'group', tabindex: -1 });
        label.dataset.trackId = track.id;
        label.dataset.ownerIndex = index;
        label.dataset.kind = kind;
        label.dataset.compact = String(compactTracks);
        if (compactTracks) label.append(el('span', track.name, {className:'song-track-name'}));
        else label.append(kind === 'bus' ? el('div') : createTrackControls(track.id, { patternTools: false, playbackRate: false }));
        if (kind === 'sample') bindChannelDrop(label, index);
        headers.append(label);
      }
      label.style.top = y - HEADER + 'px';
      label.setAttribute('aria-label', `${track.name} controls`);
      label.classList.toggle('midi-target', kind === 'instrument' && getMidiTarget() === index);
      label.classList.toggle('solo-dim', engine.anySolo() && !track.solo);
      label.classList.toggle('has-sample', !!track.sampleName);
      label.classList.toggle('unresolved-source', !!track.unresolvedSource);
      label.title = track.unresolvedSource?.message || '';
      if (compactTracks) {
        label.firstElementChild.textContent = track.name;
      } else {
        if (kind !== 'bus') refreshTrackControls(label.firstElementChild);
        label.firstElementChild.hidden = automation;
        automationHeader(label, track);
      }
      const color = label.firstElementChild.style.getPropertyValue('--ch-color') || track.color || '#80cbd6';
      label.style.borderLeftColor = color;
      g.globalAlpha = automation ? .22 : 1;
      for (const r of model.byTrack.get(track.id) || []) {
        if (r.end < leftBeat || r.start > rightBeat) continue;
        const x = LEFT + r.start * zoom - sx,
          w = Math.max(3, ((r.missing ? Math.max(r.end, r.start + 0.25) : r.end) - r.start) * zoom),
          top = y + 4,
          h = TRACK - 8;
        g.fillStyle = controls?.isSelected(r) ? '#43ffa42b' : '#ffffff10';
        g.fillRect(x, top, w, h);
        g.strokeStyle = controls?.isSelected(r)
          ? '#43ffa4'
          : r.cut || r.window?.reverse
            ? '#ff9f43'
            : color;
        g.strokeRect(x + 0.5, top + 0.5, w - 1, h - 1);
        if (r.buffer && r.end > r.start) {
          drawWaveformRegion(g, {
            buffer: r.buffer,
            loop: r.window.loop,
            reverse: r.window.reverse,
            x,
            y: top,
            width: w,
            height: h,
            color: color,
            visibleLeft: LEFT,
            visibleRight: width,
            indexAt: (f) =>
              waveformIndex(
                r.window,
                r.buffer,
                beatToSeconds(displayProject(), r.start + f * (r.end - r.start)) -
                  beatToSeconds(displayProject(), r.start)
              )
          });
        } else if (r.type === 'note') {
          g.fillStyle = color;
          const noteY = top + 5 + (1 - (r.pitch % 12) / 12) * (h - 12);
          g.fillRect(x + 2, noteY, Math.max(1, w - 4), 4);
        }
        g.fillStyle = '#ffffff59';
        g.fillRect(x, top, 2, h);
        g.fillRect(x + w - 2, top, 2, h);
        if (r.next?.over?.xfade && r.naturalEnd > r.next.start) {
          const bx = LEFT + r.next.start * zoom - sx,
            fx =
              (secondsToBeat(
                displayProject(),
                beatToSeconds(displayProject(), r.next.start) + r.next.over.xfade / 1000
              ) -
                r.next.start) *
              zoom;
          g.strokeStyle = '#22d3ee';
          g.beginPath();
          g.moveTo(bx, top);
          g.lineTo(bx + fx, top + h);
          g.moveTo(bx + fx, top);
          g.lineTo(bx, top + h);
          g.stroke();
        }
        if (r.missing && w > 45) {
          g.fillStyle = '#c3ced9';
          g.font = '10px system-ui';
          g.fillText('Missing sound', x + 4, top + 20);
        }
      }
      g.globalAlpha = 1;
      if (automation) {
        const c = automationGeometry(track, i);
        if (c) drawAutomation(g, c, { points: automationControls?.points(c.spec.target) || c.lane?.points || [], selected: targetKey(automationControls?.selection?.target) === targetKey(c.spec.target) ? automationControls.selection.beat : null });
      }
    });
    for (const label of [...headers.children]) if (!seen.has(label.dataset.trackId)) label.remove();
    g.restore();
    g.fillStyle = '#101922';
    g.fillRect(0, 0, width, HEADER);
    g.fillRect(0, HEADER, LEFT, height - HEADER);
    g.fillStyle = '#aebfce';
    g.font = '11px system-ui';
    let labelX = -Infinity;
    for (const mark of songBarMarks(store.project, leftBeat, rightBeat)) {
      const x = LEFT + mark.beat * zoom - sx;
      if (x < LEFT) continue;
      if (x - labelX >= 40) {
        g.fillText(String(mark.bar), x + 3, 17);
        labelX = x;
      }
      if (zoom * 16 >= 95 && mark.beat % 16 === 0 && !store.project.timeline.enabled)
        g.fillText(`Sequence ${Math.floor(mark.beat / 16) + 1}`, x + 3, 34);
    }
    g.fillText('TRACKS', 8, 26);
    paintTransport();
  }
  function specFor(track) {
    const available = specs.filter(s => s.trackId === track.id);
    let spec = available.find(s => targetKey(s.target) === parameters.get(track.id));
    spec ||= available.find(s => findLane(s.target)) || available[0];
    if (spec) parameters.set(track.id, targetKey(spec.target));
    return spec;
  }
  function automationGeometry(track, index) {
    const spec = specFor(track); if (!spec) return null;
    const start = scroll.scrollLeft / zoom, end = Math.min(automationEnd(), (scroll.scrollLeft + scroll.clientWidth - LEFT) / zoom);
    return { lane: findLane(spec.target), spec, start, end, x: LEFT, y: HEADER + index * TRACK - scroll.scrollTop + 9, width: (end - start) * zoom, height: TRACK - 18, limit: automationEnd(), snap: regionSnap() / 4 };
  }
  function automationHeader(label, track) {
    let header = label.querySelector('.song-automation-header');
    if (!automation) { if (header) header.hidden = true; return; }
    if (!header) { header = el('div', null, { className: 'song-automation-header' }); label.append(header); }
    header.hidden = false;
    const spec = specFor(track); if (!spec) return;
    const available = specs.filter(s => s.trackId === track.id), signature = JSON.stringify([track.name, available.map(s => [targetKey(s.target), s.group, s.name, !!findLane(s.target)])]);
    if (header.dataset.signature !== signature) {
      header.replaceChildren(el('strong', track.name));
      const select = el('select', null, { 'aria-label': `${track.name} automation parameter` });
      fillParameterPicker(select, available, true);
      select.addEventListener('change', () => { automationControls.clear(); parameters.set(track.id, select.value); focusAutomation(specFor(track).target); draw(); editTools(); });
      const bypass = action('Read', () => { const l = findLane(specFor(track).target); if (l) store.setAutomationLane({ ...l, enabled: l.enabled === false }); }, { 'aria-label': `${track.name} automation playback`, title: 'Enable or bypass this automation lane. The Automation toggle only hides its display.' });
      header.append(select, bypass, el('output', null, { 'aria-label': `${track.name} automation value` })); header.dataset.signature = signature;
    }
    header.querySelector('strong').textContent = track.name;
    header.querySelector('select').value = targetKey(spec.target);
    header.querySelector('select').title = spec.label;
    const lane = findLane(spec.target), button = header.querySelector('button');
    button.disabled = !lane; button.textContent = lane?.enabled === false ? 'Bypassed' : lane ? 'Read' : 'Guide'; button.setAttribute('aria-pressed', String(lane?.enabled !== false && !!lane));
    header.querySelector('output').textContent = automationLabel(spec, automationValue(lane?.points || [], engine.getMusicalPosition().beat, spec.value));
  }
  function paintTransport() {
    const beat = engine.getMusicalPosition().beat || 0,
      pos = songPosition(store.project, beat);
    position.textContent = `Bar ${pos.bar} · Beat ${pos.beat.toFixed(2)}`;
    play.textContent = engine.isPlaying ? 'Pause' : 'Play';
    const x = LEFT + beat * zoom - scroll.scrollLeft;
    playhead.hidden = x < LEFT || x > scroll.clientWidth;
    playhead.style.left = x + 'px';
    playhead.dataset.beat = String(beat);
    if (
      engine.isPlaying &&
      follow &&
      !controls?.dragging && !automationControls?.dragging &&
      (x > scroll.clientWidth - 35 || x < LEFT)
    )
      scroll.scrollLeft = Math.max(0, beat * zoom - (scroll.clientWidth - LEFT) * 0.25);
  }
  function animate() {
    if (dead) return;
    paintTransport();
    if (automation && !compactTracks && engine.isPlaying) for (const label of headers.children) {
      const track = rows.find(t => t.id === label.dataset.trackId), spec = track && specFor(track), out = label.querySelector('output');
      if (spec && out) out.textContent = automationLabel(spec, automationValue(findLane(spec.target)?.points || [], engine.getMusicalPosition().beat, spec.value));
    }
    frame = requestAnimationFrame(animate);
  }
  function bounds(r) {
    const box = canvas.getBoundingClientRect(),
      i = rows.findIndex((t) => t.id === r.trackId);
    const y = box.top + HEADER + i * TRACK - scroll.scrollTop,
      left = box.left + LEFT + r.start * zoom - scroll.scrollLeft;
    if (
      i < 0 ||
      y + TRACK < box.top + HEADER ||
      y > box.bottom ||
      left > box.right ||
      left + Math.max(3, (r.end - r.start) * zoom) < box.left + LEFT
    )
      return null;
    return {
      left,
      right: left + Math.max(3, (r.end - r.start) * zoom),
      top: y + 4,
      bottom: y + TRACK - 4
    };
  }
  const marquee = el('div', null, { className: 'region-marquee', hidden: true });
  document.body.append(marquee);
  controls = createRegionControls({
    root: canvas,
    active: () => !dead && root.isConnected && !scrolling && !automation,
    regions: (p) => getModel(p).regions,
    bounds,
    repaint: () => {
      draw();
      editTools();
    },
    message: (text) => (info.textContent = text),
    open: openEditor,
    seek: (beat) => engine.seekBeat(beat),
    limits: (p) => ({ start: 0, end: p.timeline.enabled ? 65536 : p.sequences.length * 64 }),
    point(e, forced = false) {
      const b = canvas.getBoundingClientRect(),
        x = e.clientX - b.left,
        y = e.clientY - b.top,
        beat = (x - LEFT + scroll.scrollLeft) / zoom,
        track = rows[Math.floor((y - HEADER + scroll.scrollTop) / TRACK)];
      return {
        target: canvas,
        trackId: track?.id,
        beat: Math.max(0, beat),
        position: rawStep(displayProject(), beat),
        ...(!forced
          ? x < LEFT || y < 0 || y > b.height
            ? { kind: 'outside' }
            : y < HEADER
              ? { kind: 'seek' }
              : !track
                ? { kind: 'outside' }
                : {}
          : {})
      };
    },
    marquee: (rect) => {
      marquee.hidden = !rect;
      if (rect)
        Object.assign(marquee.style, {
          left: rect.left + 'px',
          top: rect.top + 'px',
          width: rect.right - rect.left + 'px',
          height: rect.bottom - rect.top + 'px'
        });
    },
    add: (h) => {
      const p = store.project,
        ch = p.channels.findIndex((t) => t.id === h.trackId);
      if (ch < 0) return;
      const clip = p.timeline.enabled
        ? p.timeline.clips.find(
            (c) =>
              c.type === 'pattern' &&
              c.trackId === h.trackId &&
              h.beat >= c.start &&
              h.beat < c.start + c.duration
          )
        : null;
      if (p.timeline.enabled && !clip) {
        status('Add a clip in Advanced arrangement for this empty lane.');
        return;
      }
      const seq = clip
        ? p.sequences.find((s) => s.id === clip.sequenceId)
        : p.sequences[Math.floor(h.position / 64)];
      const step = Math.floor(
        clip ? rawStep(p, h.beat - clip.start + (clip.offset || 0)) : h.position % 64
      );
      if (!seq || step < 0 || step >= 64) return;
      beginTransaction();
      try {
        const v = seq.steps[ch][step];
        seq.steps[ch][step] = v ? 0 : 1;
        store.emit('project', { prop: 'sequences' });
      } finally {
        endTransaction();
      }
    }
  });
  automationControls = automationGestures(canvas, {
    active: () => automation && !scrolling && !dead,
    hit: e => {
      const box = canvas.getBoundingClientRect(), x = e.clientX - box.left, y = e.clientY - box.top;
      if (x < LEFT || x > box.width || y < HEADER || y > box.height) return null;
      const index = Math.floor((y - HEADER + scroll.scrollTop) / TRACK), track = rows[index];
      const c = track && automationGeometry(track, index);
      return c && c.width > 0 && x <= c.x + c.width ? c : null;
    },
    repaint: () => { draw(); if (!automationControls.dragging) editTools(); }
  });
  canvas.addEventListener('pointerdown', e => {
    const b = canvas.getBoundingClientRect();
    if (!scrolling && automation && e.button === 0 && e.clientX >= b.left + LEFT && e.clientY < b.top + HEADER) engine.seekBeat(Math.max(0, (e.clientX - b.left - LEFT + scroll.scrollLeft) / zoom));
  });
  scroll.addEventListener('scroll', draw);
  headers.addEventListener(
    'wheel',
    (event) => {
      if (event.ctrlKey) return;
      scroll.scrollTop += event.deltaY;
      scroll.scrollLeft += event.deltaX;
      event.preventDefault();
    },
    { passive: false }
  );
  function releaseFollow() {
    if (engine.isPlaying && follow) {
      follow = false;
      toolbar.querySelector('input[type=checkbox]').checked = false;
    }
  }
  scroll.addEventListener('wheel', releaseFollow, { passive: true });
  scroll.addEventListener('touchmove', () => { if (scrolling) releaseFollow(); }, { passive: true });
  canvas.addEventListener('click', e => {
    if (!scrolling) return;
    const box = canvas.getBoundingClientRect(), x = e.clientX - box.left;
    if (x >= LEFT && e.clientY - box.top < HEADER) engine.seekBeat((x - LEFT + scroll.scrollLeft) / zoom);
  });
  const offs = [
    'dirty',
    'load',
    'channel',
    'instrument',
    'channels',
    'instruments',
    'sequence'
  ].map((name) => store.on(name, queue));
  document.addEventListener('instrument-target', queue);
  const ro = new ResizeObserver(draw);
  ro.observe(scroll);
  setInteraction(scrolling);
  refresh();
  animate();
  return () => {
    dead = true;
    advancedTicket++;
    controls.dispose();
    automationControls.dispose();
    marquee.remove();
    ro.disconnect();
    document.removeEventListener('instrument-target', queue);
    offs.forEach((f) => f());
    cancelAnimationFrame(frame);
    cancelAnimationFrame(queued);
    advancedDispose?.();
  };
}
