// Performance view for the current instrument. The song and transport stay in the editor.
import { action, el } from './pro-ui.js';
import { buildPianoKeys } from './keyboard-layout.js';
import { drumKeyboard, instrumentKeyName } from './instrument-keyboard.js';
import { attachKeyboard, getOctave, setOctave, noteOn, noteOff } from './live-keys.js';
import { setMidiTarget } from './midi-input.js';
import { store } from './state.js';

let preferredSpan = 'auto';

export function openExpandedKeyboard(slot) {
  const track = store.instrument(slot);
  if (!track || document.querySelector('.expanded-keyboard')) return;
  setMidiTarget(slot);
  const dialog = el('dialog', null, {
    className: 'expanded-keyboard',
    'aria-labelledby': 'expanded-instrument'
  });
  const header = el('header'),
    name = el('h2', track.name, { id: 'expanded-instrument' });
  const close = action('Done', () => dialog.close());
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
  const lower = action('−', () => setOctave(startOctave - 1), { 'aria-label': 'Lower octave' }),
    higher = action('+', () => setOctave(startOctave + 1), { 'aria-label': 'Higher octave' });
  const readout = el('output', '', { 'aria-label': 'Visible notes' });
  const zoom = el('label', 'Show ');
  zoom.append(span);
  controls.append(zoom, lower, readout, higher);
  header.append(name, close);
  const bed = el('div', null, { className: 'expanded-keybed' });
  dialog.append(header, controls, bed);
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
  const finish = () => dialog.close();
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
  dialog.addEventListener(
    'close',
    () => {
      releaseAccessibleKey();
      handle?.dispose();
      wide.removeEventListener('change', resize);
      document.removeEventListener('instrument-target', targetChanged);
      document.removeEventListener('synth-note', voice);
      document.removeEventListener('live-octave', render);
      cleanup.forEach((off) => off());
      dialog.remove();
    },
    { once: true }
  );
  dialog.showModal();
  render();
}
