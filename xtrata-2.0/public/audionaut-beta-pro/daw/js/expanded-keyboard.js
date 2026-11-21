// Performance view for the current instrument. The song and transport stay in the editor.
import { action, el } from './pro-ui.js';
import { buildPianoKeys } from './keyboard-layout.js';
import { drumKeyboard, instrumentKeyName } from './instrument-keyboard.js';
import { attachKeyboard, getOctave, setOctave, noteOn, noteOff } from './live-keys.js';
import { setMidiTarget } from './midi-input.js';
import { store } from './state.js';

let preferredSpan = 'auto';

export function openExpandedKeyboard(slot, opener = document.activeElement) {
  const track = store.instrument(slot);
  if (!track || document.querySelector('.expanded-keyboard')) return;
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
    exitNative();
    dialog.close();
    observer.disconnect();
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
    document.removeEventListener('live-octave', render);
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
  const bed = el('div', null, { className: 'expanded-keybed' });
  player.append(header, controls, bed);
  dialog.append(player);
  document.body.append(dialog);
  const wide = matchMedia('(min-width: 580px)');
  let startOctave,
    handle,
    keys = [],
    lit = new Map();
  const padRange = drumKeyboard(track);
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
    if (event.detail || !key || key.getAttribute('aria-disabled') === 'true') return;
    playAccessibleKey(key);
    previewTimer = setTimeout(releaseAccessibleKey, 250);
  };
  function render() {
    releaseAccessibleKey();
    handle?.dispose();
    const octaves = preferredSpan === 'auto' ? (wide.matches ? 2 : 1) : Number(preferredSpan);
    const highest = Math.min(6, Math.floor((127 - 12 * octaves) / 12) - 1);
    startOctave = Math.min(getOctave(), highest);
    const from = padRange?.from ?? 12 * (startOctave + 1);
    const to = padRange?.to ?? from + 12 * octaves;
    const built = buildPianoKeys(bed, { from, to, octaves });
    keys = built.keys;
    bed.style.setProperty('--key-depth', (4 * parseFloat(keys[0].style.width)) + 'vw');
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
    handle = attachKeyboard(built.kb, {
      inst: () => slot,
      keyAt(node) {
        const key = node.closest?.('[data-midi]');
        return key && key.getAttribute('aria-disabled') !== 'true'
          ? { midi: +key.dataset.midi, el: key }
          : null;
      }
    });
  }
  bed.onkeydown = (event) => {
    const key = event.target.closest('[data-midi]');
    if (!key || key.getAttribute('aria-disabled') === 'true') return;
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
    render();
  };
  const resize = () => {
    if (!padRange && preferredSpan === 'auto') render();
  };
  const instrumentChange = ({ i, prop }) => {
    if (i !== slot) return;
    if (prop === 'name') name.textContent = store.instrument(slot).name;
    if (['synthId', 'sampleInstrument'].includes(prop)) finish();
  };
  const cleanup = [
    store.on('load', finish),
    store.on('instruments', finish),
    store.on('instrument', instrumentChange)
  ];
  const targetChanged = ({ detail }) => {
    if (detail.i !== slot) finish();
  };
  document.addEventListener('instrument-target', targetChanged);
  document.addEventListener('synth-note', voice);
  document.addEventListener('live-octave', render);
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
  dialog.show();
  render();
  measureDock();
  observer.observe(dialog);
}
