// The track's armed flag is the single source of truth in every editor/player.
import { store } from './state.js';
import { engine } from './engine.js';
import { activeMidiTake, MIDI_QUANTIZE_CHOICES } from './performance-recorder.js';
import { el, action, status } from './pro-ui.js';

const instrument = id => store.project.instruments.find(t => t.id === id);
const modeOf = track => !track?.armed ? 'off' :
  engine.isPlaying && !engine._transportPreparing ? 'recording' : 'armed';

function paintArm(button) {
  const track = instrument(button.dataset.recordArm), mode = modeOf(track);
  button.disabled = !track;
  button.dataset.recordMode = mode;
  button.setAttribute('aria-pressed', String(!!track?.armed));
  button.textContent = button.dataset.recordCompact === 'true' || mode === 'off' ? '● REC' :
    mode === 'armed' ? '● ARMED' : '● RECORDING';
  const label = track?.name || 'Instrument';
  button.setAttribute('aria-label', (track?.armed ? 'Disarm MIDI recording: ' : 'Arm MIDI recording: ') + label);
  button.title = label + ' · ' + (mode === 'off' ? 'Arm MIDI recording' :
    mode === 'armed' ? 'Armed — play a note to start, or press Play for count-in' : 'Recording MIDI — tap to disarm without stopping playback');
}

export function bindRecordArm(button, trackId, { compact = false } = {}) {
  button.type = 'button';
  button.classList.add('record-arm-btn');
  button.dataset.recordArm = trackId || '';
  button.dataset.recordCompact = String(compact);
  button.onclick = () => {
    const i = store.project.instruments.findIndex(t => t.id === button.dataset.recordArm);
    const track = store.instrument(i);
    if (!track) return;
    const armed = !track.armed;
    store.setInstrumentProp(i, 'armed', armed);
    status(track.name + (armed ? engine.isPlaying
      ? ' armed. Play notes to record in time.'
      : ' armed. Play a note to start recording, or press Play for count-in.'
      : ' disarmed. Your recorded notes are retained.'));
  };
  paintArm(button);
  return button;
}

export function makeRecordArm(trackId, { compact = false, className = '' } = {}) {
  return bindRecordArm(el('button', null, {className}), trackId, {compact});
}

export function markRecordTrack(node, trackId) {
  node.dataset.recordTrack = trackId || '';
  node.dataset.recordMode = modeOf(instrument(trackId));
  if (node.dataset.recordMode !== 'off') node.setAttribute('aria-description',
    node.dataset.recordMode === 'armed' ? 'Record armed' : 'Recording MIDI');
  else node.removeAttribute('aria-description');
  return node;
}

export function bindRecordHint(node, trackId) {
  node.dataset.recordHint = trackId || '';
  paintHint(node);
  return node;
}
function paintHint(node) {
  const mode = modeOf(instrument(node.dataset.recordHint));
  node.dataset.recordMode = mode;
  node.textContent = mode === 'armed' ? 'Play a note to start' : mode === 'recording' ? 'Recording MIDI' : 'Arm REC to record MIDI';
}

function setRecording(key, value) {
  if (store.project.recording[key] !== value) store.setProjectProp('recording', { ...store.project.recording, [key]:value });
}
function paintQuantize(root) {
  const r = store.project.recording, grid = root.querySelector('[data-midi-quantize-grid]');
  const value = String(r.quantize);
  if (![...grid.options].some(o => o.value === value)) grid.add(new Option(value + ' beats', value));
  grid.value = value;
  const strength = root.querySelector('[data-midi-quantize-strength]');
  if (strength && document.activeElement !== strength) strength.value = Math.round(r.strength * 100);
  const apply = root.querySelector('[data-quantize-take]');
  if (apply) apply.disabled = !activeMidiTake(instrument(root.dataset.quantizeTrack))?.notes.length;
}
export function setQuantizeTrack(root, trackId) {
  root.dataset.quantizeTrack = trackId || '';
  paintQuantize(root);
}

// The grid and strength also govern subsequent capture. Applying is explicit,
// so changing the grid never silently changes a previously recorded take.
export function makeQuantizeControls(trackId, { showStrength = false, onApply = null } = {}) {
  const root = el('div', null, {className:'record-quantize-tools'});
  const grid = el('select', null, {'aria-label':'MIDI quantize grid', 'data-midi-quantize-grid':''});
  for (const [value, label] of MIDI_QUANTIZE_CHOICES) grid.add(new Option(label, value));
  grid.onchange = () => setRecording('quantize', +grid.value);
  const field = el('label', 'Quantize');
  field.append(grid);
  root.append(field);
  if (showStrength) {
    const strength = el('input', null, {type:'number', min:0, max:100, step:5, 'aria-label':'Quantize strength percent', 'data-midi-quantize-strength':''});
    strength.onchange = () => {
      if (!Number.isFinite(strength.valueAsNumber)) return paintQuantize(root);
      strength.value = Math.min(100, Math.max(0, strength.valueAsNumber));
      setRecording('strength', +strength.value / 100);
    };
    const label = el('label', 'Strength %');
    label.append(strength);
    root.append(label);
  }
  const apply = action(onApply ? 'Apply to notes' : 'Apply to take', () => {
    const { quantize, strength } = store.project.recording;
    const count = onApply ? onApply(quantize, strength) : store.quantizeTake(root.dataset.quantizeTrack, quantize, strength);
    status(count ? ((!quantize || !strength ? 'Restored original timing for ' : 'Quantized ') + count + ' MIDI notes.') : 'There are no MIDI notes to quantize.');
  }, {className:'record-quantize-apply', title:onApply
    ? 'Apply to selected notes, or all notes in this roll. Off restores original timing.'
    : 'Apply this grid and strength to the active MIDI take. Off restores original timing.'});
  if (!onApply) apply.dataset.quantizeTake = '';
  root.append(apply);
  setQuantizeTrack(root, trackId);
  return root;
}

export function syncRecordControls() {
  document.querySelectorAll('button[data-record-arm]').forEach(paintArm);
  document.querySelectorAll('[data-record-track]').forEach(n => markRecordTrack(n, n.dataset.recordTrack));
  document.querySelectorAll('[data-record-hint]').forEach(paintHint);
  document.querySelectorAll('.record-quantize-tools').forEach(paintQuantize);
}
for (const event of ['load', 'instruments', 'notes']) store.on(event, syncRecordControls);
store.on('instrument', ({ prop } = {}) => {
  if (['armed', 'name', 'activeTakeId', 'takes'].includes(prop)) syncRecordControls();
});
store.on('project', ({ prop } = {}) => {
  if (prop === 'recording' || prop === 'timeline') syncRecordControls();
});
document.addEventListener('transport', syncRecordControls);
