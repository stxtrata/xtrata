import { instruments } from './five-synth-checks.js';
import { store, makeProject } from '../daw/js/state.js';
import { SYNTH_BANK, synthDefaults } from '../daw/js/synths.js';
import { changeSynth } from '../daw/js/synth-selection.js';
import { openSynthPanel, closeSynthPanel } from '../daw/js/synth-panel.js';
import { exportProject, prepareProject } from '../daw/js/persistence.js';
import {
  saveUserPreset,
  exportPresetBank,
  deleteUserPreset,
  importPresetBank
} from '../daw/js/preset-bank.js';
import { resetHistory, record, undo, redo } from '../daw/js/history.js';
import { renderMix } from '../daw/js/render-mix.js';
import { freezeTrack, unfreezeTrack } from '../daw/js/pro-freeze.js';
import { decodePcmPlanes } from '../daw/js/pcm-wav.js';
import { engine } from '../daw/js/engine.js';
import { offlineRenderSupport } from '../daw/js/audio-render-support.js';

function check(ok, label) {
  if (!ok) throw Error(label);
}
export async function verifyHostState(id) {
  closeSynthPanel();
  store.loadProject(makeProject());
  const patch = synthDefaults(id),
    def = SYNTH_BANK[id],
    key = def.params[0].key;
  changeSynth(0, id);
  changeSynth(1, id);
  store.setInstrumentProp(0, 'params', { ...patch, [key]: def.params[0].max });
  resetHistory();
  store.setInstrumentProp(1, 'params', { ...patch, level: 0.31 });
  record(true);
  check(undo() && store.instrument(1).params?.level !== 0.31, id + ' undo');
  check(redo() && store.instrument(1).params.level === 0.31, id + ' redo');
  changeSynth(0, 'jims10');
  changeSynth(0, id);
  check(
    store.instrument(0).params[key] === def.params[0].max &&
      store.instrument(1).params[key] === patch[key],
    id + ' slot isolation and switch'
  );
  const saved = prepareProject(exportProject());
  check(
    saved.instruments[0].synthId === id && saved.instruments[0].params[key] === def.params[0].max,
    id + ' project restore'
  );
  const preset = saveUserPreset(id, { name: 'QA round trip', params: store.instrument(1).params });
  const bank = exportPresetBank(id);
  deleteUserPreset(preset.id);
  check(
    importPresetBank(bank).some((p) => p.id === preset.id && p.params.level === 0.31),
    id + ' bank restore'
  );
  deleteUserPreset(preset.id);
  for (let pass = 0; pass < 2; pass++) {
    openSynthPanel(0);
    const root = document.querySelector('#synth-front');
    check(
      root.classList.contains('sfp-' + id) &&
        root.querySelectorAll('#sfp-preset option').length === 9,
      id + ' panel/preset mount'
    );
    const pad = root.querySelector('.sfp-xy'),
      slider = root.querySelector('[data-key="level"]');
    check(pad && slider && root.querySelector('.kb-w'), id + ' pad, output and keyboard');
    const before = store.instrument(0).params.level;
    slider.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    check(store.instrument(0).params.level < before, id + ' panel key edit');
    closeSynthPanel();
  }
}
export async function verifyDelivery(id) {
  if (!offlineRenderSupport().supported) return { id, offline: 'unsupported' };
  const project = makeProject();
  project.songEndStep = 16;
  project.renderSeed = 'five-instrument-freeze';
  project.instruments[0].synthId = id;
  project.instruments[0].params = synthDefaults(id);
  project.sequences[0].notes[0] = [{ id: 'last-note', step: 14, dur: 2, pitch: 55, vel: 0.8 }];
  store.loadProject(project);
  store.setProjectProp('bpm', 240);
  const track = store.instrument(0),
    rate = engine.ensureContext().sampleRate;
  const mix = async () =>
    decodePcmPlanes(
      await (
        await renderMix(store.project, engine.buffers, {
          sampleRate: rate,
          bitDepth: 'float32',
          tail: 'auto'
        })
      ).arrayBuffer()
    );
  const original = await mix(),
    stem = await freezeTrack(track.id);
  const printed = engine.buffers[store.project.channels.indexOf(stem)];
  check(printed && track.mute && track.freezeState, id + ' printed track');
  const after = await mix();
  check(unfreezeTrack(track.id) && !track.freezeState && !track.mute, id + ' unfreeze');
  const restored = await mix();
  let error = 0,
    restoreError = 0,
    peak = 0;
  for (let ch = 0; ch < original.length; ch++) {
    const a = original[ch],
      b = after[ch],
      c = restored[ch];
    check(a.length === b.length && a.length === c.length, id + ' export length');
    for (let i = 0; i < a.length; i++) {
      peak = Math.max(peak, Math.abs(a[i]));
      error = Math.max(error, Math.abs(a[i] - b[i]));
      restoreError = Math.max(restoreError, Math.abs(a[i] - c[i]));
    }
  }
  check(
    peak > 0.001 && error <= 1e-6 && restoreError <= 1e-6,
    id + ' frozen/restored errors ' + error + '/' + restoreError
  );
  return {
    id,
    rate,
    restoreError,
    originalFrames: original[0].length,
    frozenFrames: after[0].length,
    peak,
    error
  };
}
export async function verifyHost() {
  const rows = [];
  for (const id of instruments) {
    await verifyHostState(id);
    rows.push(await verifyDelivery(id));
  }
  return rows;
}

// A disposable virtual input exercises the same sustain, bend and record path
// as a controller. Tests never request access to physical hardware.
export async function verifyPlaying(
  advance = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
) {
  const { setMidiEnabled } = await import('../daw/js/midi-input.js');
  const { heldCount, setArpSettings, panic } = await import('../daw/js/live-keys.js');
  const port = { id: 'five-synth-test', name: 'Test input', state: 'connected' };
  const original = Object.getOwnPropertyDescriptor(navigator, 'requestMIDIAccess');
  await setMidiEnabled(false);
  Object.defineProperty(navigator, 'requestMIDIAccess', {
    configurable: true,
    value: async () => ({ inputs: new Map([[port.id, port]]) })
  });
  const send = (...bytes) => port.onmidimessage({ data: bytes, timeStamp: performance.now() });
  try {
    check(await setMidiEnabled(true), 'virtual MIDI input');
    for (const id of instruments) {
      closeSynthPanel();
      store.loadProject(makeProject());
      changeSynth(0, id);
      store.setInstrumentProp(0, 'armed', true);
      await engine.play();
      await advance(100);
      send(0x90, 60, 95);
      send(0xb0, 64, 127);
      send(0xe0, 0, 100);
      send(0x80, 60, 0);
      check(heldCount() === 1, id + ' pedal hold');
      await advance(140);
      send(0xb0, 64, 0);
      check(heldCount() === 0, id + ' pedal release');
      const recorded = store.project.sequences
        .flatMap((seq) => seq.notes[0])
        .find((n) => n.pitch === 60);
      check(
        recorded &&
          recorded.dur > 0 &&
          recorded.expression?.some((e) => e.type === 'bend' && e.value > 0),
        id + ' recorded note and pitch bend'
      );
      setArpSettings(0, { enabled: true, rate: 4 });
      const events = [];
      const listen = (e) => events.push(e.detail);
      document.addEventListener('live-note', listen);
      try {
        send(0x90, 67, 90);
        await advance(170);
        send(0x80, 67, 0);
        check(
          events.some((n) => n.src.startsWith('arp:') && n.on && n.duration > 0),
          id + ' arp pulse'
        );
      } finally {
        document.removeEventListener('live-note', listen);
      }
      engine.stop();
      panic();
      check(engine.liveCount() === 0 && heldCount() === 0, id + ' panic/stop');
    }
  } finally {
    engine.stop();
    panic();
    await setMidiEnabled(false);
    if (original) Object.defineProperty(navigator, 'requestMIDIAccess', original);
    else delete navigator.requestMIDIAccess;
  }
}
