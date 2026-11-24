// Performance view for the current instrument. The song and transport stay in the editor.
import { action, el } from './pro-ui.js';
import { buildPianoKeys } from './keyboard-layout.js';
import { drumKeyboard, instrumentKeyName } from './instrument-keyboard.js';
import { attachKeyboard, getOctave, setOctave, noteOn, noteOff } from './live-keys.js';
import { setMidiTarget } from './midi-input.js';
import { engine } from './engine.js';
import { livePreference, saveLivePreference, prepareLiveInstrument } from './live-player-setup.js';
import { SYNTH_BANK } from './synths.js';
import { store, CHANNEL_COLORS } from './state.js';
import { bindRecordArm, bindRecordHint, makeRecordArm, makeQuantizeControls, markRecordTrack, setQuantizeTrack } from './record-controls.js';

let opened;
let preferredSpan = livePreference('span', 'auto');
if (!['auto','1','2','3','4'].includes(preferredSpan)) preferredSpan = 'auto';

export function openExpandedKeyboard(slot, opener = document.activeElement, direct = false) {
  let track = store.instrument(slot);
  if (!track) return;
  if (opened) { opened(slot, direct); return; }
  setMidiTarget(slot);
  const dialog = el('dialog', null, {
    className: 'expanded-keyboard',
    'aria-labelledby': 'expanded-instrument'
  });
  const header = el('header'),
    name = el('h2', track.name, { id: 'expanded-instrument' });
  const player = el('section', null, { className: 'expanded-key-player' });
  const close = action('Done', finish, { title: 'Close keyboard and return to the editor' });
  const screen = action('Full screen', toggleScreen);
  let playingFull = false, nativeActive = false, finished = false, viewId = 0;
  const nativeElement = () => document.fullscreenElement || document.webkitFullscreenElement;
  function exitNative() {
    if (nativeElement() !== player) return;
    const exit = document.exitFullscreen || document.webkitExitFullscreen;
    Promise.resolve(exit?.call(document)).catch(() => {});
  }
  function setView(full) {
    resetPedal();
    handle?.release();
    releaseAccessibleKey();
    viewId++;
    nativeActive = false;
    playingFull = full;
    dialog.close();
    dialog.classList.toggle('playing-full', full);
    screen.textContent = full ? 'Exit full screen' : 'Full screen';
    if (full) dialog.showModal();
    else dialog.show();
    render();
    if (full) prepare();
    else ++loadId;
    measureDock();
    screen.focus({ preventScroll: true });
  }
  function toggleScreen() {
    if (playingFull) {
      exitNative();
      setView(false);
      return;
    }
    setView(true);
    // The player also fills the studio when the host cannot enter native fullscreen.
    const request = player.requestFullscreen || player.webkitRequestFullscreen;
    if (request) {
      const id = viewId;
      try {
        const pending = request.call(player);
        pending?.then(() => {
          if (finished || id !== viewId) return;
          nativeActive = true;
          nativeChange();
        }).catch(() => {});
      } catch { /* The studio player is already open. */ }
    }
  }
  function nativeChange() {
    if (nativeElement() === player) {
      nativeActive = true;
      if (!playingFull || finished) exitNative();
    } else if (nativeActive) {
      nativeActive = false;
      if (playingFull && !finished) setView(false);
    }
  }
  function escape(event) {
    if (event.key !== 'Escape' || !dialog.open ||
        (!playingFull && document.querySelector('dialog:modal'))) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    if (playingFull) toggleScreen();
    else finish();
  }
  function measureDock() {
    const height = playingFull ? 0 : dialog.offsetHeight;
    if (!finished) document.body.style.setProperty('--keyboard-dock-height', height + 'px');
  }
  const observer = new ResizeObserver(measureDock);
  function finish() {
    if (finished) return;
    finished = true;
    opened = null;
    exitNative();
    dialog.close();
    observer.disconnect();
    ctx?.removeEventListener('statechange', audioState);
    document.removeEventListener('performance-reset', performanceReset);
    document.body.classList.remove('keyboard-docked');
    document.body.style.removeProperty('--keyboard-dock-height');
    releaseAccessibleKey();
    handle?.dispose();
    wide.removeEventListener('change', resize);
    document.removeEventListener('keydown', escape, true);
    document.removeEventListener('fullscreenchange', nativeChange);
    document.removeEventListener('webkitfullscreenchange', nativeChange);
    document.removeEventListener('instrument-target', targetChanged);
    document.removeEventListener('synth-note', voice);
    document.removeEventListener('live-octave', octaveChanged);
    document.removeEventListener('transport', syncTransport);
    cleanup.forEach((off) => off());
    dialog.remove();
    if (opener?.isConnected) opener.focus({ preventScroll: true });
  }
  const controls = el('div', null, { className: 'expanded-key-controls' });
  const span = el('select', null, { 'aria-label': 'Visible octaves' });
  for (const [value, label] of [
    ['auto', 'Auto'],
    ['1', '1 octave'],
    ['2', '2 octaves'],
    ['3', '3 octaves'],
    ['4', '4 octaves']
  ])
    span.add(new Option(label, value));
  span.value = preferredSpan;
  const lower = action('− Oct', () => setOctave(startOctave - 1), { 'aria-label': 'Lower octave' }),
    higher = action('+ Oct', () => setOctave(startOctave + 1), { 'aria-label': 'Higher octave' });
  const readout = el('output', '', { 'aria-label': 'Visible notes' });
  const zoom = el('label', 'Show ');
  zoom.append(span);
  controls.append(zoom, lower, readout, higher);
  header.append(name, screen, close);
  const recordStrip = el('div', null, {className:'expanded-record-controls', 'aria-label':'Performance transport and MIDI recording'});
  const play = action('▶', () => engine.isPlaying ? engine.pause() : engine.playFromEditor(), {className:'performance-play', 'aria-label':'Play transport'});
  const stop = action('■', () => engine.stop(), {className:'performance-stop', 'aria-label':'Stop transport'});
  const arm = makeRecordArm(track.id);
  const armHint = bindRecordHint(el('span', null, {className:'record-arm-hint'}), track.id);
  const quantize = makeQuantizeControls(track.id, {showStrength:true});
  recordStrip.append(play, stop, arm, armHint, quantize);
  function syncTransport() {
    play.textContent = engine.isPlaying ? '❚❚' : '▶';
    play.classList.toggle('active', engine.isPlaying);
    play.setAttribute('aria-label', engine.isPlaying ? 'Pause transport' : 'Play transport');
  }
  syncTransport();
  const bed = el('div', null, { className: 'expanded-keybed' });
  const live = el('div', null, {className:'live-instrument-controls'});
  const bank = el('div', null, {className:'live-instrument-bank', role:'group', 'aria-label':'Live instruments'});
  const pin = action('☆', () => {
    const ids = favourites().filter(id => id !== track.id);
    if (!favourites().includes(track.id)) ids.push(track.id);
    saveLivePreference(favouriteKey, ids);
    drawBank();
  }, {'aria-label':'Favourite instrument', title:'Place this instrument first in the live strip'});
  const edit = action('Edit synth', async () => {
    const i = slot;
    finish();
    const {openSynthPanel} = await import('./synth-panel.js');
    openSynthPanel(i);
  });
  const pedal = action('Sustain', () => setPedal(!pedalOn), {'aria-pressed':'false'});
  const status = el('output', '', {className:'live-ready', 'aria-live':'polite'});
  const retry = action('Tap to resume', prepare);
  const favouriteKey = 'favourites.' + store.project.projectId;
  function favourites() {
    const ids = livePreference(favouriteKey, []);
    return Array.isArray(ids) ? ids : [];
  }
  live.append(bank, pin, edit, pedal, status, retry);
  player.append(header, controls, recordStrip, live, bed);
  dialog.append(player);
  document.body.append(dialog);
  const wide = matchMedia('(min-width: 580px)');
  let startOctave,
    handle,
    keys = [],
    lit = new Map();
  let padRange = drumKeyboard(track), switching = false, ctx, loadId = 0;
  let ready = false, pedalOn = false, loadError = '';
  const octaveKey = () => 'octave.' + store.project.projectId + '.' + track.id;
  function setPedal(on) {
    pedalOn = on;
    handle?.setSustain(on);
    pedal.setAttribute('aria-pressed', String(on));
  }
  function resetPedal() { setPedal(false); }
  function performanceReset({detail}) { if (!detail?.prefix && !detail?.sources) resetPedal(); }
  function audioState() {
    if (finished) return;
    const paused = ctx?.state !== 'running';
    if (paused) { resetPedal(); handle?.release(); releaseAccessibleKey(); }
    retry.hidden = !paused && !loadError;
    retry.textContent = loadError ? 'Retry' : 'Tap to resume';
    status.textContent = loadError || (paused ? 'Audio paused' : ready ? 'Ready' : 'Loading ' + track.name + '…');
  }
  function prepare() {
    const id = ++loadId;
    ready = false;
    loadError = '';
    const current = () => !finished && id === loadId;
    try {
      const next = engine.ensureContext();
      if (ctx !== next) {
        ctx?.removeEventListener('statechange', audioState);
        ctx = next;
        ctx.addEventListener('statechange', audioState);
      }
      if (ctx.state !== 'running') ctx.resume().catch(() => { if (current()) audioState(); });
      audioState();
      prepareLiveInstrument(track, keys.map(k => Number(k.dataset.midi)), current).then(() => {
        if (current()) { ready = true; audioState(); }
      }).catch(error => { if (current()) { loadError = error.message; audioState(); } });
    } catch (error) { loadError = error.message; audioState(); }
  }
  const playableNow = () => !playingFull || ready && ctx?.state === 'running';
  function drawBank() {
    bank.replaceChildren();
    const pinned = favourites();
    const tracks = store.project.instruments.map((t,i) => ({t,i})).sort((a,b) => Number(pinned.includes(b.t.id)) - Number(pinned.includes(a.t.id)));
    for (const {t,i} of tracks) {
      const button = action(t.name, () => setMidiTarget(i), {'aria-pressed':String(i === slot)});
      button.style.setProperty('--track-color', SYNTH_BANK[t.synthId]?.color || t.color || CHANNEL_COLORS[i % CHANNEL_COLORS.length]);
      markRecordTrack(button, t.id);
      bank.append(button);
    }
    pin.textContent = pinned.includes(track.id) ? '★' : '☆';
    pin.setAttribute('aria-pressed', String(pinned.includes(track.id)));
  }
  function restoreOctave() {
    const octave = livePreference(octaveKey(), getOctave());
    if (Number.isInteger(octave)) setOctave(octave);
  }
  function paint(pitch) {
    keys.find((k) => +k.dataset.midi === pitch)?.classList.toggle('on', lit.has(pitch));
  }
  function voice({ detail: { i, pitch, on } }) {
    if (i !== slot) return;
    const count = (lit.get(pitch) || 0) + (on ? 1 : -1);
    if (count > 0) lit.set(pitch, count);
    else lit.delete(pitch);
    paint(pitch);
  }
  let focusedNote = false,
    previewTimer;
  function releaseAccessibleKey() {
    clearTimeout(previewTimer);
    if (focusedNote) noteOff('expanded:focus');
    focusedNote = false;
  }
  function playAccessibleKey(key) {
    releaseAccessibleKey();
    focusedNote = true;
    noteOn('expanded:focus', slot, +key.dataset.midi, 0.8);
  }
  // Screen-reader activation can arrive as a click without a pointer or key event.
  bed.onclick = (event) => {
    const key = event.target.closest('[data-midi]');
    if (!playableNow() || event.detail || !key || key.getAttribute('aria-disabled') === 'true') return;
    playAccessibleKey(key);
    previewTimer = setTimeout(releaseAccessibleKey, 250);
  };
  function render() {
    releaseAccessibleKey();
    if (switching) handle?.keepPointers();
    else handle?.release();
    const octaves = preferredSpan === 'auto' ? (wide.matches ? 2 : 1) : Number(preferredSpan);
    const highest = Math.min(6, Math.floor((127 - 12 * octaves) / 12) - 1);
    startOctave = Math.min(getOctave(), highest);
    const from = padRange?.from ?? 12 * (startOctave + 1);
    const to = padRange?.to ?? from + 12 * octaves;
    const built = buildPianoKeys(bed, { from, to, octaves });
    keys = built.keys;
    const pads = playingFull && !!padRange;
    bed.classList.toggle('live-pads', pads);
    if (pads) {
      built.kb.setAttribute('aria-label','Drum Rack pads');
      built.kb.replaceChildren();
      keys = padRange.pads.map(p => {
        const key = el('div', '', {'data-midi':p.note});
        built.kb.append(key);
        return key;
      });
    }
    pedal.hidden = pads;
    if (pads) resetPedal();
    bed.style.setProperty('--key-depth', pads ? '45vh' : (4 * parseFloat(keys[0].style.width)) + 'vw');
    zoom.hidden = lower.hidden = higher.hidden = !!padRange;
    lower.disabled = startOctave === 0;
    higher.disabled = startOctave === highest;
    readout.textContent = instrumentKeyName(track, from) + ' – ' + instrumentKeyName(track, to);
    let firstPlayable = true;
    for (const key of keys) {
      const pitch = +key.dataset.midi,
        label = instrumentKeyName(track, pitch);
      const pad = padRange?.pads.find((p) => p.note === pitch);
      const playable = !padRange || !!pad;
      key.setAttribute('role', 'button');
      key.tabIndex = playable && firstPlayable ? 0 : -1;
      if (playable) firstPlayable = false;
      key.setAttribute('aria-disabled', String(!playable));
      key.title = pad ? pad.name + ' · ' + label : label;
      key.setAttribute('aria-label', key.title);
      if (pad || pitch % 12 === 0)
        key.append(el('span', pad?.name || label, { 'aria-hidden': 'true' }));
      key.classList.toggle('on', lit.has(pitch));
    }
    handle ||= attachKeyboard(bed, {
      inst: () => slot,
      keyAt(node) {
        const key = node.closest?.('[data-midi]');
        return playableNow() && key && key.getAttribute('aria-disabled') !== 'true'
          ? { midi: +key.dataset.midi, el: key }
          : null;
      }
    });
  }
  bed.onkeydown = (event) => {
    const key = event.target.closest('[data-midi]');
    if (!playableNow() || !key || key.getAttribute('aria-disabled') === 'true') return;
    if (['ArrowLeft', 'ArrowRight'].includes(event.key)) {
      event.preventDefault();
      const playable = keys.filter((k) => k.getAttribute('aria-disabled') === 'false');
      const next = playable[playable.indexOf(key) + (event.key === 'ArrowLeft' ? -1 : 1)];
      if (next) {
        key.tabIndex = -1;
        next.tabIndex = 0;
        next.focus();
      }
    } else if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      if (!event.repeat) playAccessibleKey(key);
    }
  };
  bed.onkeyup = (event) => {
    if (event.key === ' ' || event.key === 'Enter') releaseAccessibleKey();
  };
  bed.onfocusout = releaseAccessibleKey;
  span.onchange = () => {
    preferredSpan = span.value;
    saveLivePreference('span', preferredSpan);
    render();
  };
  const resize = () => {
    if (!padRange && preferredSpan === 'auto') render();
  };
  const instrumentChange = ({ i, prop }) => {
    if (i !== slot) return;
    if (prop === 'name') { name.textContent = track.name; drawBank(); }
    if (['synthId', 'sampleInstrument'].includes(prop)) finish();
  };
  const cleanup = [
    store.on('load', finish),
    store.on('instruments', finish),
    store.on('instrument', instrumentChange)
  ];
  const targetChanged = ({ detail }) => {
    if (detail.i === slot) return;
    if (!playingFull || !store.instrument(detail.i)) return finish();
    switching = true;
    try {
      resetPedal();
      if (!padRange) saveLivePreference(octaveKey(), getOctave());
      slot = detail.i;
      track = store.instrument(slot);
      bindRecordArm(arm, track.id);
      bindRecordHint(armHint, track.id);
      setQuantizeTrack(quantize, track.id);
      padRange = drumKeyboard(track);
      name.textContent = track.name;
      lit.clear();
      restoreOctave();
      render();
      drawBank();
      prepare();
    } finally { switching = false; }
  };
  function octaveChanged() { saveLivePreference(octaveKey(), getOctave()); render(); }
  document.addEventListener('performance-reset', performanceReset);
  document.addEventListener('instrument-target', targetChanged);
  document.addEventListener('synth-note', voice);
  document.addEventListener('live-octave', octaveChanged);
  document.addEventListener('transport', syncTransport);
  wide.addEventListener('change', resize);
  document.addEventListener('keydown', escape, true);
  document.addEventListener('fullscreenchange', nativeChange);
  document.addEventListener('webkitfullscreenchange', nativeChange);
  dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    if (playingFull) toggleScreen();
    else finish();
  });
  document.body.classList.add('keyboard-docked');
  opened = (index, full) => {
    if (full && !playingFull) toggleScreen();
    setMidiTarget(index);
  };
  restoreOctave();
  drawBank();
  dialog.show();
  if (direct) toggleScreen();
  else render();
  measureDock();
  observer.observe(dialog);
}
