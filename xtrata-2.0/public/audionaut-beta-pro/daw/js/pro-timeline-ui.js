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
import { openStepEditor } from './ui.js';
import { openRoll, openClipRoll } from './pianoroll.js';
import { el, action, row, choice, toggle, status } from './pro-ui.js';

const HEADER = 44,
  TRACK = 44,
  LEFT = 220;
export function mount(root) {
  let zoom = 56,
    follow = true,
    controls = null,
    modelProject = null,
    modelGeneration = -1,
    model = null,
    rows = [],
    dead = false,
    frame = 0,
    queued = 0,
    advancedDispose = null;
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
      zoom = Math.max(1, (scroll.clientWidth - LEFT - 20) / model.end);
      draw();
    }),
    toggle('Follow playhead', follow, (v) => (follow = v))
  );
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
  root.append(toolbar, frameBox, info, tools, advanced);
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
    rows = [...store.project.channels, ...store.project.instruments].filter((t) => !t.assetOnly);

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
    const width = Math.max(320, scroll.clientWidth),
      height = Math.max(180, scroll.clientHeight),
      sx = scroll.scrollLeft,
      sy = scroll.scrollTop;
    content.style.width = `${Math.max(width, LEFT + model.end * zoom + 24)}px`;
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
      if (!label) {
        label = el('div', null, { className: 'song-track' });
        label.dataset.trackId = track.id;
        label.append(
          el('span'),
          action('M', () => store.setTrackProp(track.id, 'mute', !store.track(track.id).mute)),
          action('S', () => store.setTrackProp(track.id, 'solo', !store.track(track.id).solo))
        );
        const gain = el('input', null, { type: 'range', min: 0, step: 0.01 });
        gain.addEventListener('input', () => store.setTrackProp(track.id, 'volume', +gain.value));
        label.append(gain);
        headers.append(label);
      }
      label.style.top = y - HEADER + 'px';
      label.style.borderLeftColor = track.color || '#76cad4';
      label.firstChild.textContent = track.name;
      label.firstChild.title = track.name;
      const buttons = label.querySelectorAll('button');
      buttons[0].setAttribute('aria-label', `Mute ${track.name}`);
      buttons[0].setAttribute('aria-pressed', String(!!track.mute));
      buttons[1].setAttribute('aria-label', `Solo ${track.name}`);
      buttons[1].setAttribute('aria-pressed', String(!!track.solo));
      const gain = label.querySelector('input');
      gain.max = store.project.legacyPlayback ? 3 : 1.5;
      gain.setAttribute('aria-label', `${track.name} volume`);
      if (document.activeElement !== gain) gain.value = track.volume ?? 1;
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
            : track.color || '#80cbd6';
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
            color: track.color || '#80cbd6',
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
          g.fillStyle = track.color || '#80cbd6';
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
    });
    for (const label of headers.children) if (!seen.has(label.dataset.trackId)) label.remove();
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
      !controls?.dragging &&
      (x > scroll.clientWidth - 35 || x < LEFT)
    )
      scroll.scrollLeft = Math.max(0, beat * zoom - (scroll.clientWidth - LEFT) * 0.25);
  }
  function animate() {
    if (dead) return;
    paintTransport();
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
    active: () => !dead && root.isConnected,
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
  scroll.addEventListener('scroll', draw);
  scroll.addEventListener(
    'wheel',
    () => {
      if (engine.isPlaying && follow) {
        follow = false;
        toolbar.querySelector('input[type=checkbox]').checked = false;
      }
    },
    { passive: true }
  );
  const offs = ['dirty', 'load', 'channel'].map((name) => store.on(name, queue));
  const ro = new ResizeObserver(draw);
  ro.observe(scroll);
  refresh();
  animate();
  return () => {
    dead = true;
    advancedTicket++;
    controls.dispose();
    marquee.remove();
    ro.disconnect();
    offs.forEach((f) => f());
    cancelAnimationFrame(frame);
    cancelAnimationFrame(queued);
    advancedDispose?.();
  };
}
