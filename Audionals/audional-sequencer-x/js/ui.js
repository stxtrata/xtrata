// ui.js — builds and updates the DOM: channels, step grid, sequence bar, modals.

import { store, NUM_CHANNELS, NUM_STEPS, MAX_SEQUENCES, stepVal, stepObj } from './state.js';
import { engine } from './engine.js';
import { loadSample, fetchAndDecode } from './loader.js';
import { SAMPLE_LIBRARY } from './library.js';
import { BEAT_PRESETS, expandPattern } from './beats.js';
import { NUM_INSTRUMENTS } from './state.js';
import { SYNTH_BANK } from './synths.js';
import { openRoll } from './pianoroll.js';
import { PLUGIN_TYPES, MAX_INSERTS, makeInsert, pluginDefaults } from './plugins.js';

const $ = s => document.querySelector(s);
const el = (tag, cls, text) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
};

export function setStatus(msg, isError = false) {
  const s = $('#status-text');
  s.textContent = msg;
  s.classList.toggle('error', isError);
}

// ---------------------------------------------------------------- channels
const stepButtons = []; // [ch][step] -> button element

export function buildChannels() {
  const root = $('#channels');
  root.innerHTML = '';
  stepButtons.length = 0;

  for (let ch = 0; ch < store.numChannels; ch++) {
    const c = store.channel(ch);
    const row = el('div', 'channel');
    row.dataset.ch = ch;
    row.style.setProperty('--ch-color', c.color);

    // --- controls block ---
    const ctrl = el('div', 'channel-controls');

    const nameInput = el('input', 'ch-name');
    nameInput.value = c.name;
    nameInput.spellcheck = false;
    nameInput.title = c.sampleName || 'Channel name';
    nameInput.addEventListener('change', () => store.setChannelProp(ch, 'name', nameInput.value));

    const loadBtn = el('button', 'ch-btn load', '⊕');
    loadBtn.title = 'Load sample';
    loadBtn.addEventListener('click', () => openLoader(ch));

    const previewBtn = el('button', 'ch-btn', '▹');
    previewBtn.title = 'Preview sample';
    previewBtn.addEventListener('click', () => engine.trigger(ch));

    const muteBtn = el('button', 'ch-btn toggle mute', 'M');
    muteBtn.title = 'Mute';
    muteBtn.addEventListener('click', () => {
      store.setChannelProp(ch, 'mute', !store.channel(ch).mute);
      muteBtn.classList.toggle('active', store.channel(ch).mute);
    });

    const soloBtn = el('button', 'ch-btn toggle solo', 'S');
    soloBtn.title = 'Solo';
    soloBtn.addEventListener('click', () => {
      store.setChannelProp(ch, 'solo', !store.channel(ch).solo);
      soloBtn.classList.toggle('active', store.channel(ch).solo);
    });

    const trimBtn = el('button', 'ch-btn', '✂');
    trimBtn.title = 'Trim / waveform';
    trimBtn.addEventListener('click', () => openTrim(ch));

    const fxBtn = el('button', 'ch-btn fx', 'FX');
    fxBtn.title = 'Channel FX: filter, drive, delay, reverb';
    fxBtn.addEventListener('click', () => openFx(ch));

    const insBtn = el('button', 'ch-btn fx ins', 'INS');
    insBtn.title = 'Insert plugins: EQ, compressor, gate, distortion, chorus, flanger, phaser, tremolo, bitcrusher';
    insBtn.classList.toggle('has-inserts', (c.inserts || []).some(i => i?.enabled));
    insBtn.addEventListener('click', () => openInserts(ch));

    const vol = el('input', 'ch-vol');
    vol.type = 'range'; vol.min = 0; vol.max = 1.5; vol.step = 0.01; vol.value = c.volume;
    vol.title = 'Volume';
    vol.addEventListener('input', () => {
      store.setChannelProp(ch, 'volume', +vol.value);
      engine.setChannelVolume(ch, +vol.value);
    });

    const pitch = el('input', 'ch-pitch');
    pitch.type = 'number'; pitch.min = 0.1; pitch.max = 4; pitch.step = 0.05; pitch.value = c.pitch;
    pitch.title = 'Pitch / playback rate';
    pitch.addEventListener('change', () => store.setChannelProp(ch, 'pitch', Math.max(0.1, Math.min(4, +pitch.value || 1))));

    // pattern tools
    const tools = el('div', 'ch-tools');
    const mk = (label, title, fn) => {
      const b = el('button', 'ch-btn tiny', label); b.title = title;
      b.addEventListener('click', fn); tools.appendChild(b);
    };
    // Auto-pattern cycler (classic feature): every step → 2nd → 4th → 8th → 16th → clear.
    let patMode = 0;
    const PAT_LABELS = ['', '1/1', '1/2', '1/4', '1/8', '1/16'];
    const patBtn = el('button', 'ch-btn tiny pattern', '◉');
    patBtn.title = 'Cycle trigger pattern: all → every 2nd → 4th → 8th → 16th → clear (right-click resets)';
    patBtn.addEventListener('click', () => {
      patMode = (patMode + 1) % 6;
      store.applyAutoPattern(ch, patMode);
      patBtn.textContent = patMode ? PAT_LABELS[patMode] : '◉';
      patBtn.classList.toggle('active', patMode > 0);
    });
    patBtn.addEventListener('contextmenu', e => {
      e.preventDefault();
      patMode = 0;
      store.applyAutoPattern(ch, 0);
      patBtn.textContent = '◉';
      patBtn.classList.remove('active');
    });
    tools.appendChild(patBtn);

    mk('⟲', 'Shift pattern left', () => store.shiftChannelPattern(ch, -1));
    mk('⟳', 'Shift pattern right', () => store.shiftChannelPattern(ch, 1));
    mk('✕', 'Clear channel pattern', () => store.clearChannelPattern(ch));

    ctrl.append(nameInput, loadBtn, previewBtn, muteBtn, soloBtn, trimBtn, fxBtn, insBtn, vol, pitch, tools);

    // --- step grid ---
    const grid = el('div', 'steps');
    const rowButtons = [];
    for (let s = 0; s < NUM_STEPS; s++) {
      const b = el('button', 'step');
      if (s % 16 === 0) b.classList.add('bar-start');
      else if (s % 4 === 0) b.classList.add('beat-start');
      b.addEventListener('click', e => {
        if (e.altKey) {
          if (!stepVal(store.seq.steps[ch][s])) store.cycleStep(ch, s);
          openStepEditorInternal(ch, s);
        } else {
          store.cycleStep(ch, s, e.shiftKey);
        }
      });
      b.addEventListener('contextmenu', e => {
        e.preventDefault();
        store.toggleStepReverse(ch, s); // OG-style right-click reverse
      });
      grid.appendChild(b);
      rowButtons.push(b);
    }
    stepButtons.push(rowButtons);

    // drag & drop audio files onto channel
    row.addEventListener('dragover', e => { e.preventDefault(); row.classList.add('drop'); });
    row.addEventListener('dragleave', () => row.classList.remove('drop'));
    row.addEventListener('drop', async e => {
      e.preventDefault(); row.classList.remove('drop');
      const file = e.dataTransfer.files[0];
      if (!file) return;
      try {
        setStatus(`Loading ${file.name}…`);
        await loadSample(ch, { type: 'file', file });
        refreshChannelRow(ch);
        setStatus(`Loaded ${file.name} → channel ${ch + 1}`);
      } catch (err) { setStatus(`Load failed: ${err.message}`, true); }
    });

    row.append(ctrl, grid);
    root.appendChild(row);
  }
  // add/remove channel controls
  const bar = el('div', 'channel-add-bar');
  const addBtn = el('button', 'ch-add', '+ Add channel');
  addBtn.title = 'Add a sample channel (up to 64)';
  addBtn.addEventListener('click', () => {
    if (store.addChannel()) {
      engine.ensureChannelChains?.();
      buildChannels();
      setStatus(`Channel ${store.numChannels} added.`);
    } else setStatus('Channel limit (64) reached.', true);
  });
  const remBtn = el('button', 'ch-add', '− Remove last');
  remBtn.title = 'Remove the last sample channel';
  remBtn.addEventListener('click', () => {
    const last = store.numChannels - 1;
    const c = store.channel(last);
    const hasContent = c.sampleName || store.project.sequences.some(s => s.steps[last]?.some(v => v));
    if (hasContent && !confirm(`Channel ${last + 1} has a sample or pattern data. Remove anyway?`)) return;
    if (store.removeChannel()) {
      engine.buffers[last] = null;
      engine.reverseBuffers[last] = null;
      buildChannels();
      setStatus(`Channel ${last + 1} removed.`);
    }
  });
  bar.append(addBtn, remBtn);
  root.appendChild(bar);

  refreshAllChannels();
  renderPattern();
}

// ---------------------------------------------------------------- instrument channels
let midiClipboard = null;
export function buildInstruments() {
  const root = $('#instruments');
  root.innerHTML = '';
  for (let i = 0; i < NUM_INSTRUMENTS; i++) {
    const instr = store.instrument(i);
    const synth = SYNTH_BANK[instr.synthId] || SYNTH_BANK.jims10;
    const row = el('div', 'channel instrument');
    row.dataset.inst = i;
    row.style.setProperty('--ch-color', synth.color);

    const ctrl = el('div', 'channel-controls');

    const nameInput = el('input', 'ch-name');
    nameInput.value = instr.name;
    nameInput.spellcheck = false;
    nameInput.addEventListener('change', () => store.setInstrumentProp(i, 'name', nameInput.value));

    const rollBtn = el('button', 'ch-btn roll-open', '♪');
    rollBtn.title = 'Open MIDI roll & synth editor';
    rollBtn.addEventListener('click', () => openRoll(i));

    const previewBtn = el('button', 'ch-btn', '▹');
    previewBtn.title = 'Preview (C3)';
    previewBtn.addEventListener('click', () => engine.triggerNote(i, 48, 1, 0, 0.4));

    const muteBtn = el('button', 'ch-btn toggle mute', 'M');
    muteBtn.title = 'Mute';
    muteBtn.classList.toggle('active', instr.mute);
    muteBtn.addEventListener('click', () => {
      store.setInstrumentProp(i, 'mute', !store.instrument(i).mute);
      muteBtn.classList.toggle('active', store.instrument(i).mute);
    });

    const soloBtn = el('button', 'ch-btn toggle solo', 'S');
    soloBtn.title = 'Solo';
    soloBtn.classList.toggle('active', instr.solo);
    soloBtn.addEventListener('click', () => {
      store.setInstrumentProp(i, 'solo', !store.instrument(i).solo);
      soloBtn.classList.toggle('active', store.instrument(i).solo);
    });

    const vol = el('input', 'ch-vol');
    vol.type = 'range'; vol.min = 0; vol.max = 1.5; vol.step = 0.01; vol.value = instr.volume;
    vol.title = 'Volume';
    vol.addEventListener('input', () => {
      store.setInstrumentProp(i, 'volume', +vol.value);
      engine.setInstrumentVolume(i, +vol.value);
    });

    const synthLabel = el('span', 'inst-synth-label', synth.name);

    const copyBtn = el('button', 'ch-btn tiny', '⧉');
    copyBtn.title = 'Copy MIDI notes from this sequence';
    copyBtn.addEventListener('click', () => {
      midiClipboard = JSON.parse(JSON.stringify(store.seq.notes[i] || []));
      setStatus(`Copied ${midiClipboard.length} notes from ${store.instrument(i).name}.`);
    });
    const pasteBtn = el('button', 'ch-btn tiny', '⇪');
    pasteBtn.title = 'Paste MIDI notes into this sequence';
    pasteBtn.addEventListener('click', () => {
      if (!midiClipboard) return setStatus('No MIDI notes copied yet.', true);
      store.setNotes(i, JSON.parse(JSON.stringify(midiClipboard)));
      drawInstStrip(i);
      setStatus(`Pasted ${midiClipboard.length} notes into ${store.instrument(i).name}.`);
    });

    ctrl.append(nameInput, rollBtn, previewBtn, muteBtn, soloBtn, vol, copyBtn, pasteBtn, synthLabel);

    // mini note overview strip
    const strip = el('canvas', 'inst-strip');
    strip.width = 640; strip.height = 24;
    strip.addEventListener('click', e => { if (!e.altKey) openRoll(i); });
    // Alt/Option + drag strip onto another instrument row = copy its MIDI notes there
    strip.addEventListener('mousedown', e => {
      if (!e.altKey) return;
      e.preventDefault();
      const srcNotes = JSON.parse(JSON.stringify(store.seq.notes[i] || []));
      if (!srcNotes.length) return setStatus('No notes to copy on this instrument.', true);
      document.body.classList.add('midi-dragging');
      const over = ev => {
        document.querySelectorAll('.channel.instrument').forEach(r => {
          r.classList.toggle('drop', r.contains(ev.target));
        });
      };
      const up = ev => {
        document.removeEventListener('mousemove', over);
        document.removeEventListener('mouseup', up);
        document.body.classList.remove('midi-dragging');
        document.querySelectorAll('.channel.instrument').forEach(r => r.classList.remove('drop'));
        const targetRow = ev.target.closest?.('.channel.instrument');
        if (!targetRow) return;
        const dest = +targetRow.dataset.inst;
        if (dest === i) return;
        store.setNotes(dest, srcNotes);
        drawInstStrip(dest);
        setStatus(`Copied ${srcNotes.length} notes: ${store.instrument(i).name} → ${store.instrument(dest).name}.`);
      };
      document.addEventListener('mousemove', over);
      document.addEventListener('mouseup', up);
    });
    row.append(ctrl, strip);
    root.appendChild(row);
    drawInstStrip(i);
  }
}

export function drawInstStrip(i) {
  const strip = document.querySelector(`.channel.instrument[data-inst="${i}"] .inst-strip`);
  if (!strip) return;
  const c = strip.getContext('2d');
  const synth = SYNTH_BANK[store.instrument(i).synthId] || SYNTH_BANK.jims10;
  c.clearRect(0, 0, strip.width, strip.height);
  c.fillStyle = '#121820';
  c.fillRect(0, 0, strip.width, strip.height);
  for (let s = 0; s < 4; s++) { c.fillStyle = '#26303d'; c.fillRect(s * strip.width / 4, 0, 1, strip.height); }
  const notes = store.seq.notes?.[i] || [];
  if (!notes.length) return;
  const pitches = notes.map(n => n.pitch);
  const lo = Math.min(...pitches), hi = Math.max(...pitches, lo + 1);
  c.fillStyle = synth.color;
  const cw = strip.width / 64;
  for (const n of notes) {
    const y = strip.height - 3 - ((n.pitch - lo) / (hi - lo)) * (strip.height - 6);
    c.fillRect(n.step * cw, y, Math.max(2, n.dur * cw - 1), 3);
  }
}

export function refreshInstrumentRow(i) {
  const row = document.querySelector(`.channel.instrument[data-inst="${i}"]`);
  if (!row) return;
  const instr = store.instrument(i);
  const synth = SYNTH_BANK[instr.synthId] || SYNTH_BANK.jims10;
  row.style.setProperty('--ch-color', synth.color);
  row.querySelector('.ch-name').value = instr.name;
  row.querySelector('.inst-synth-label').textContent = synth.name;
  drawInstStrip(i);
}

export function refreshChannelRow(ch) {
  const row = $(`#channels .channel[data-ch="${ch}"]`);
  if (!row) return;
  const c = store.channel(ch);
  row.querySelector('.ch-name').value = c.name;
  row.querySelector('.ch-name').title = c.sampleName || 'Channel name';
  row.querySelector('.ch-vol').value = c.volume;
  row.querySelector('.ch-pitch').value = c.pitch;
  row.querySelector('.mute').classList.toggle('active', c.mute);
  row.querySelector('.solo').classList.toggle('active', c.solo);
  row.classList.toggle('has-sample', !!c.sampleName);
  row.querySelector('.ins')?.classList.toggle('has-inserts', (c.inserts || []).some(i => i?.enabled));
}

export function refreshAllChannels() {
  for (let ch = 0; ch < store.numChannels; ch++) refreshChannelRow(ch);
}

// ---------------------------------------------------------------- pattern
function paintStep(b, raw) {
  const v = stepVal(raw);
  const o = stepObj(raw);
  b.classList.toggle('on', v === 1);
  b.classList.toggle('accent', v === 2);
  b.classList.toggle('rev', !!o?.rev);
  b.classList.toggle('edited', !!o && (o.trimStart != null || o.trimEnd != null || o.pitch != null));
  b.title = o?.rev ? 'Reversed step (right-click to toggle, alt-click to edit)' : '';
}

export function renderPattern() {
  const seq = store.seq;
  for (let ch = 0; ch < stepButtons.length; ch++) {
    for (let s = 0; s < NUM_STEPS; s++) {
      paintStep(stepButtons[ch][s], seq.steps[ch][s]);
    }
  }
}

export function updateStep(ch, s, v) {
  paintStep(stepButtons[ch][s], v);
}

// forward declaration wrapper (openStepEditor defined in the editor section below)
function openStepEditorInternal(ch, s) { openStepEditor(ch, s); }

let lastPlayheadStep = -1;
export function movePlayhead(step) {
  if (lastPlayheadStep >= 0) {
    for (let ch = 0; ch < stepButtons.length; ch++) stepButtons[ch][lastPlayheadStep].classList.remove('playing');
  }
  if (step >= 0) {
    for (let ch = 0; ch < stepButtons.length; ch++) stepButtons[ch][step].classList.add('playing');
    $('#lcd-pos').textContent = `${Math.floor(step / 16) + 1}.${Math.floor((step % 16) / 4) + 1}`;
  }
  lastPlayheadStep = step;
}

// ---------------------------------------------------------------- sequences
export function renderSequenceBar() {
  const slots = $('#seq-slots');
  slots.innerHTML = '';
  const n = Math.min(store.project.sequences.length + 1, MAX_SEQUENCES);
  for (let i = 0; i < n; i++) {
    const exists = i < store.project.sequences.length;
    const b = el('button', 'seq-slot', exists ? String(i + 1) : '+');
    if (i === store.project.currentSequence) b.classList.add('current');
    if (exists && !engine._isEmpty(store.project.sequences[i])) b.classList.add('filled');
    b.title = exists ? `Sequence ${i + 1}` : 'Add sequence';
    b.addEventListener('click', () => store.selectSequence(i));
    slots.appendChild(b);
  }
  $('#lcd-seq').textContent = String(store.project.currentSequence + 1).padStart(2, '0');
}

// ---------------------------------------------------------------- modals
let loaderChannel = 0;
let activeTab = 'library';

function openLoader(ch) {
  loaderChannel = ch;
  $('#loader-channel-label').textContent = `→ Channel ${ch + 1}`;
  $('#modal-loader').classList.remove('hidden');
}

// --- library tab ---
function libStatus(msg, isError = false) {
  const el2 = $('#library-status');
  el2.textContent = msg;
  el2.classList.toggle('error', isError);
}

function currentLibrarySelection() {
  const cat = SAMPLE_LIBRARY[+$('#library-category').value || 0];
  const item = cat.items[+$('#library-sample').value];
  return item ? { cat, item } : null;
}

function populateLibrarySamples() {
  const cat = SAMPLE_LIBRARY[+$('#library-category').value || 0];
  const sel = $('#library-sample');
  sel.innerHTML = '';
  cat.items.forEach((item, i) => {
    const o = document.createElement('option');
    o.value = i;
    o.textContent = item.label;
    sel.appendChild(o);
  });
  sel.selectedIndex = 0;
}

function initLibraryTab() {
  const catSel = $('#library-category');
  SAMPLE_LIBRARY.forEach((cat, i) => {
    const o = document.createElement('option');
    o.value = i;
    o.textContent = cat.category;
    catSel.appendChild(o);
  });
  catSel.addEventListener('change', populateLibrarySamples);
  populateLibrarySamples();

  const audition = async () => {
    const sel = currentLibrarySelection();
    if (!sel) return;
    try {
      libStatus(`Fetching ${sel.item.label}…`);
      const { audioBuffer } = await fetchAndDecode({ type: sel.item.type || 'ordinal', value: sel.item.id });
      engine.playBuffer(audioBuffer);
      libStatus(`Playing "${sel.item.label}" (${audioBuffer.duration.toFixed(2)}s)`);
    } catch (e) {
      libStatus(`✗ ${sel.item.label}: ${e.message}`, true);
    }
  };
  $('#library-audition').addEventListener('click', audition);
  $('#library-sample').addEventListener('dblclick', audition);
  $('#library-stop').addEventListener('click', () => engine.stopPreview());

  // Health check: fetch & decode every sample in the selected category.
  $('#library-test').addEventListener('click', async () => {
    const cat = SAMPLE_LIBRARY[+catSel.value || 0];
    let pass = 0;
    const fails = [];
    for (let i = 0; i < cat.items.length; i++) {
      const it = cat.items[i];
      libStatus(`Testing ${i + 1}/${cat.items.length}: ${it.label}…`);
      try {
        await fetchAndDecode({ type: it.type || 'ordinal', value: it.id });
        pass++;
      } catch (e) {
        fails.push(`${it.label} (${e.message})`);
      }
    }
    libStatus(fails.length
      ? `✓ ${pass}/${cat.items.length} decoded. Failed: ${fails.join('; ')}`
      : `✓ All ${pass} samples fetched & decoded OK.`, fails.length > 0);
  });
}

export function initLoaderModal() {
  initLibraryTab();
  document.querySelectorAll('#modal-loader .tab').forEach(tab => {
    tab.addEventListener('click', () => {
      activeTab = tab.dataset.tab;
      document.querySelectorAll('#modal-loader .tab').forEach(t => t.classList.toggle('active', t === tab));
      document.querySelectorAll('#modal-loader .tab-pane').forEach(p =>
        p.classList.toggle('hidden', p.dataset.pane !== activeTab));
    });
  });
  $('#loader-cancel').addEventListener('click', () => {
    engine.stopPreview();
    $('#modal-loader').classList.add('hidden');
  });
  $('#loader-load').addEventListener('click', async () => {
    let source;
    if (activeTab === 'library') {
      const sel = currentLibrarySelection();
      if (!sel) return setStatus('Select a sample first', true);
      engine.stopPreview();
      source = { type: sel.item.type || 'ordinal', value: sel.item.id, label: sel.item.label };
    } else if (activeTab === 'file') {
      const file = $('#input-file').files[0];
      if (!file) return setStatus('Choose a file first', true);
      source = { type: 'file', file };
    } else {
      const value = $(`#input-${activeTab}`).value.trim();
      if (!value) return setStatus('Enter an ID or URL first', true);
      source = { type: activeTab, value };
    }
    $('#modal-loader').classList.add('hidden');
    try {
      setStatus(`Loading sample for channel ${loaderChannel + 1}…`);
      const name = await loadSample(loaderChannel, source);
      if (source.label) {
        store.setChannelProp(loaderChannel, 'sampleName', source.label);
        store.setChannelProp(loaderChannel, 'name', source.label.slice(0, 24));
      }
      refreshChannelRow(loaderChannel);
      setStatus(`Loaded "${source.label || name}" → channel ${loaderChannel + 1}`);
    } catch (err) {
      setStatus(`Load failed: ${err.message}`, true);
    }
  });
}

// --- sample / step editor modal ---
// Edits either channel defaults (scope {ch}) or a single step's overrides
// (scope {ch, step}) — trim, reverse, pitch — with a transport + playhead.
let editorScope = { ch: 0, step: null };
let trimPlaying = null; // { startedAt, durSec, raf }

function editorParams() {
  const c = store.channel(editorScope.ch);
  if (editorScope.step == null) {
    return { trimStart: c.trimStart, trimEnd: c.trimEnd, rev: !!c.reverse, pitch: c.pitch };
  }
  const raw = store.seq.steps[editorScope.ch][editorScope.step];
  const o = (raw && typeof raw === 'object') ? raw : {};
  return {
    trimStart: o.trimStart ?? c.trimStart,
    trimEnd: o.trimEnd ?? c.trimEnd,
    rev: o.rev ?? !!c.reverse,
    pitch: o.pitch ?? c.pitch,
    xfade: o.xfade ?? 0
  };
}

function editorApply(p) {
  const { ch, step } = editorScope;
  if (step == null) {
    store.setChannelProp(ch, 'trimStart', p.trimStart);
    store.setChannelProp(ch, 'trimEnd', p.trimEnd);
    store.setChannelProp(ch, 'reverse', p.rev);
    store.setChannelProp(ch, 'pitch', p.pitch);
    refreshChannelRow(ch);
  } else {
    store.setStepProps(ch, step, { trimStart: p.trimStart, trimEnd: p.trimEnd, rev: p.rev, pitch: p.pitch, xfade: p.xfade });
    updateStep(ch, step, store.seq.steps[ch][step]);
  }
}

function drawWaveform(playFrac = -1) {
  const canvas = $('#trim-canvas');
  const ctx2d = canvas.getContext('2d');
  const { width: W, height: H } = canvas;
  const ch = editorScope.ch;
  const p = editorParams();
  ctx2d.clearRect(0, 0, W, H);
  ctx2d.fillStyle = '#0b0f14';
  ctx2d.fillRect(0, 0, W, H);

  const buffer = engine.buffers[ch];
  const c = store.channel(ch);
  if (buffer) {
    const data = buffer.getChannelData(0);
    const step = Math.ceil(data.length / W);
    ctx2d.strokeStyle = c.color;
    ctx2d.beginPath();
    for (let x = 0; x < W; x++) {
      // reverse view flips the waveform display
      const xi = p.rev ? W - 1 - x : x;
      let min = 1, max = -1;
      for (let i = xi * step, e = Math.min(i + step, data.length); i < e; i++) {
        if (data[i] < min) min = data[i];
        if (data[i] > max) max = data[i];
      }
      ctx2d.moveTo(x + 0.5, (1 + min) * H / 2);
      ctx2d.lineTo(x + 0.5, (1 + max) * H / 2);
    }
    ctx2d.stroke();
  } else {
    ctx2d.fillStyle = '#39424e';
    ctx2d.font = '14px "IBM Plex Mono", monospace';
    ctx2d.fillText('No sample loaded', 20, H / 2);
  }
  // trim window (displayed in playback orientation)
  const s = p.rev ? 1 - p.trimEnd : p.trimStart;
  const e = p.rev ? 1 - p.trimStart : p.trimEnd;
  ctx2d.fillStyle = 'rgba(0,0,0,0.65)';
  ctx2d.fillRect(0, 0, s * W, H);
  ctx2d.fillRect(e * W, 0, W - e * W, H);
  ctx2d.fillStyle = '#ffffff';
  ctx2d.fillRect(s * W - 1, 0, 2, H);
  ctx2d.fillRect(e * W - 1, 0, 2, H);
  // playhead
  if (playFrac >= 0) {
    const x = (s + (e - s) * playFrac) * W;
    ctx2d.fillStyle = '#43ffa4';
    ctx2d.fillRect(x - 1, 0, 2, H);
  }
}

function trimStopPlayback() {
  if (trimPlaying) {
    cancelAnimationFrame(trimPlaying.raf);
    try { trimPlaying.src.stop(); } catch { /* ended */ }
    trimPlaying = null;
    drawWaveform();
  }
}

function trimStartPlayback() {
  trimStopPlayback();
  engine.ensureContext();
  const ch = editorScope.ch;
  const p = editorParams();
  const buffer = p.rev ? engine.getReverseBuffer(ch) : engine.buffers[ch];
  if (!buffer) return;
  const src = engine.ctx.createBufferSource();
  src.buffer = buffer;
  src.playbackRate.value = p.pitch;
  src.connect(engine.channelGains[ch]);
  let start = p.trimStart * buffer.duration;
  if (p.rev) start = (1 - p.trimEnd) * buffer.duration;
  const regionSec = Math.max(0.001, (p.trimEnd - p.trimStart) * buffer.duration);
  const durSec = regionSec / p.pitch; // audible duration after pitch
  const startedAt = engine.ctx.currentTime;
  src.start(startedAt, start, regionSec);
  trimPlaying = { src, startedAt, durSec, raf: 0 };
  src.onended = () => { if (trimPlaying?.src === src) { trimPlaying = null; drawWaveform(); } };
  const tick = () => {
    if (!trimPlaying) return;
    const frac = (engine.ctx.currentTime - startedAt) / durSec;
    if (frac >= 1) { trimPlaying = null; drawWaveform(); return; }
    drawWaveform(Math.max(0, frac));
    trimPlaying.raf = requestAnimationFrame(tick);
  };
  tick();
}

function openTrim(ch, step = null) {
  trimStopPlayback();
  editorScope = { ch, step };
  const c = store.channel(ch);
  const p = editorParams();
  $('#trim-channel-label').textContent = step == null
    ? `— ${c.name} (channel defaults)`
    : `— ${c.name} · step ${step + 1}`;
  $('#trim-scope').textContent = step == null
    ? 'Editing channel defaults (used by steps without overrides)'
    : 'Editing THIS STEP only — overrides channel settings';
  $('#trim-reset-step').style.display = step == null ? 'none' : '';
  $('#trim-start').value = Math.round(p.trimStart * 1000);
  $('#trim-end').value = Math.round(p.trimEnd * 1000);
  $('#trim-reverse').checked = p.rev;
  $('#trim-pitch').value = p.pitch;
  $('#trim-xfade').value = p.xfade || 0;
  $('#trim-xfade-wrap').style.display = step == null ? 'none' : '';
  $('#modal-trim').classList.remove('hidden');
  drawWaveform();
}

export function openStepEditor(ch, step) { openTrim(ch, step); }

export function initTrimModal() {
  const apply = () => {
    let s = +$('#trim-start').value / 1000;
    let e = +$('#trim-end').value / 1000;
    if (e <= s) e = Math.min(1, s + 0.001);
    editorApply({
      trimStart: s, trimEnd: e,
      rev: $('#trim-reverse').checked,
      pitch: Math.max(0.1, Math.min(4, +$('#trim-pitch').value || 1)),
      xfade: Math.max(0, Math.min(2000, +$('#trim-xfade').value || 0))
    });
    drawWaveform();
  };
  ['#trim-start', '#trim-end', '#trim-reverse', '#trim-pitch', '#trim-xfade'].forEach(sel =>
    $(sel).addEventListener('input', apply));
  $('#trim-play').addEventListener('click', trimStartPlayback);
  $('#trim-stop').addEventListener('click', trimStopPlayback);
  $('#trim-reset-step').addEventListener('click', () => {
    const { ch, step } = editorScope;
    if (step == null) return;
    const raw = store.seq.steps[ch][step];
    const v = (raw && typeof raw === 'object') ? (raw.v || 1) : (raw || 1);
    store.setStep(ch, step, v); // strip overrides, keep on/accent state
    openTrim(ch, step);
    setStatus(`Step ${step + 1} reset to channel settings.`);
  });
  $('#trim-close').addEventListener('click', () => { trimStopPlayback(); $('#modal-trim').classList.add('hidden'); });
}

// --- insert plugins modal ---
let insertsChannel = 0;

function renderInsertSlots() {
  const root = $('#inserts-slots');
  root.innerHTML = '';
  const c = store.channel(insertsChannel);
  c.inserts = c.inserts || [];
  for (let slot = 0; slot < MAX_INSERTS; slot++) {
    const def = c.inserts[slot] || null;
    const box = el('div', 'insert-slot' + (def?.enabled ? ' on' : ''));
    if (def && PLUGIN_TYPES[def.type]) box.style.setProperty('--plug-color', PLUGIN_TYPES[def.type].color);

    const head = el('div', 'insert-head');
    const sel = el('select', 'insert-type');
    const optEmpty = el('option', '', '— empty —'); optEmpty.value = '';
    sel.appendChild(optEmpty);
    Object.entries(PLUGIN_TYPES).forEach(([id, t]) => {
      const o = el('option', '', t.name); o.value = id;
      sel.appendChild(o);
    });
    sel.value = def?.type || '';
    sel.addEventListener('change', () => {
      const arr = [...(store.channel(insertsChannel).inserts || [])];
      arr[slot] = sel.value ? makeInsert(sel.value) : null;
      store.setChannelProp(insertsChannel, 'inserts', arr);
      engine.rebuildInserts(insertsChannel);
      renderInsertSlots();
      refreshChannelRow(insertsChannel);
    });

    head.append(el('span', 'insert-slot-num', `${slot + 1}`), sel);

    if (def) {
      const enable = el('button', 'ch-btn tiny' + (def.enabled ? ' active' : ''), def.enabled ? 'ON' : 'off');
      enable.title = 'Bypass toggle';
      enable.addEventListener('click', () => {
        def.enabled = !def.enabled;
        store.setChannelProp(insertsChannel, 'inserts', store.channel(insertsChannel).inserts);
        engine.rebuildInserts(insertsChannel);
        renderInsertSlots();
      });
      head.appendChild(enable);
    }
    box.appendChild(head);

    if (def && PLUGIN_TYPES[def.type]) {
      const t = PLUGIN_TYPES[def.type];
      const grid = el('div', 'synth-params');
      const P = { ...pluginDefaults(def.type), ...(def.params || {}) };
      t.params.forEach(ps => {
        const wrap = el('label', 'synth-param');
        const lab = el('span', '', ps.label);
        const input = el('input');
        input.type = 'range';
        input.min = ps.min; input.max = ps.max; input.step = ps.step;
        input.value = P[ps.key];
        const val = el('span', 'synth-val', String(P[ps.key]));
        input.addEventListener('input', () => {
          def.params = { ...P, ...def.params, [ps.key]: +input.value };
          P[ps.key] = +input.value;
          val.textContent = input.value;
          engine.updateInsertParams(insertsChannel, slot);
          store.emit('dirty');
        });
        wrap.append(lab, input, val);
        grid.appendChild(wrap);
      });
      box.appendChild(grid);
    }
    root.appendChild(box);
  }
}

function openInserts(ch) {
  insertsChannel = ch;
  engine.ensureContext();
  $('#inserts-channel-label').textContent = `— ${store.channel(ch).name}`;
  $('#modal-inserts').classList.remove('hidden');
  renderInsertSlots();
}

export function initInsertsModal() {
  $('#inserts-close').addEventListener('click', () => {
    $('#modal-inserts').classList.add('hidden');
    refreshChannelRow(insertsChannel);
  });
}

// --- FX modal ---
let fxChannel = 0;

function openFx(ch) {
  fxChannel = ch;
  engine.ensureContext();
  const fx = store.channel(ch).fx || {};
  $('#fx-channel-label').textContent = `— ${store.channel(ch).name}`;
  $('#fx-filter').value = fx.filter || 'off';
  $('#fx-cutoff').value = fx.cutoff || 8000;
  $('#fx-cutoff-val').textContent = `${fx.cutoff || 8000} Hz`;
  $('#fx-drive').value = fx.drive || 0;
  $('#fx-delay').value = fx.delay || 0;
  $('#fx-reverb').value = fx.reverb || 0;
  $('#modal-fx').classList.remove('hidden');
}

export function initFxModal() {
  const apply = () => {
    const fx = {
      filter: $('#fx-filter').value,
      cutoff: +$('#fx-cutoff').value,
      drive: +$('#fx-drive').value,
      delay: +$('#fx-delay').value,
      reverb: +$('#fx-reverb').value
    };
    store.setChannelProp(fxChannel, 'fx', fx);
    engine.applyFx(fxChannel);
    $('#fx-cutoff-val').textContent = `${fx.cutoff} Hz`;
  };
  ['#fx-filter', '#fx-cutoff', '#fx-drive', '#fx-delay', '#fx-reverb'].forEach(sel =>
    $(sel).addEventListener('input', apply));
  $('#fx-preview').addEventListener('click', () => engine.trigger(fxChannel));
  $('#fx-reset').addEventListener('click', () => {
    store.setChannelProp(fxChannel, 'fx', { filter: 'off', cutoff: 8000, drive: 0, delay: 0, reverb: 0 });
    engine.applyFx(fxChannel);
    openFx(fxChannel);
  });
  $('#fx-close').addEventListener('click', () => $('#modal-fx').classList.add('hidden'));
}

// --- Beats (preset) modal ---
async function applyBeatPreset(preset) {
  engine.ensureContext();
  setStatus(`Loading "${preset.name}" kit…`);
  store.setProjectProp('bpm', preset.bpm);
  store.setProjectProp('swing', preset.swing || 0);
  $('#bpm').value = preset.bpm;
  $('#swing').value = preset.swing || 0;
  $('#swing-val').textContent = `${preset.swing || 0}%`;
  engine.syncDelayToBpm();

  // Only clear step rows used by the PREVIOUS preset (if any) — leave all other
  // channels and all instrument/MIDI data untouched.
  const prevUsed = store.project.lastPresetChannels || 0;
  for (let i = preset.channels.length; i < prevUsed && i < store.numChannels; i++) {
    store.seq.steps[i].fill(0);
  }
  store.project.lastPresetChannels = preset.channels.length;

  const fails = [];
    while (store.numChannels < preset.channels.length) store.addChannel();
  engine.ensureChannelChains?.();
  for (let i = 0; i < preset.channels.length && i < store.numChannels; i++) {
    const def = preset.channels[i];
    try {
      await loadSample(i, def.source);
    } catch (e) {
      fails.push(`${def.source.label}: ${e.message}`);
    }
    store.setChannelProp(i, 'name', (def.name || def.source.label || '').slice(0, 24));
    store.setChannelProp(i, 'sampleName', def.source.label || '');
    store.setChannelProp(i, 'volume', def.volume ?? 0.9);
    store.setChannelProp(i, 'pitch', def.pitch ?? 1);
    store.setChannelProp(i, 'fx', { filter: 'off', cutoff: 8000, drive: 0, delay: 0, reverb: 0, ...(def.fx || {}) });
    engine.setChannelVolume(i, def.volume ?? 0.9);
    engine.applyFx(i);
    store.seq.steps[i] = expandPattern(def.pattern);
  }
  store.emit('sequence', store.project.currentSequence);
  refreshAllChannels();
  setStatus(fails.length
    ? `"${preset.name}" loaded with issues: ${fails.join('; ')}`
    : `Loaded "${preset.name}" — ${preset.genre}, ${preset.bpm} BPM, ${preset.bars} bar${preset.bars > 1 ? 's' : ''}. Press Play.`,
    fails.length > 0);
}

function renderBeatsList() {
  const genre = $('#beats-genre').value;
  const list = $('#beats-list');
  list.innerHTML = '';
  BEAT_PRESETS.filter(p => !genre || p.genre === genre).forEach(preset => {
    const row = el('div', 'beat-row');
    const info = el('div', 'beat-info');
    info.appendChild(el('span', 'beat-name', preset.name));
    info.appendChild(el('span', 'beat-meta',
      `${preset.genre} · ${preset.bpm} BPM${preset.swing ? ` · swing ${preset.swing}%` : ''} · ${preset.bars} bar${preset.bars > 1 ? 's' : ''} · ${preset.channels.length} ch`));
    const loadBtn = el('button', 'primary', 'Load');
    loadBtn.addEventListener('click', async () => {
      $('#modal-beats').classList.add('hidden');
      await applyBeatPreset(preset);
    });
    row.append(info, loadBtn);
    list.appendChild(row);
  });
}

export function initBeatsModal() {
  const genres = [...new Set(BEAT_PRESETS.map(p => p.genre))];
  const sel = $('#beats-genre');
  genres.forEach(g => {
    const o = document.createElement('option');
    o.value = g; o.textContent = g;
    sel.appendChild(o);
  });
  sel.addEventListener('change', renderBeatsList);
  $('#btn-beats').addEventListener('click', () => {
    renderBeatsList();
    $('#modal-beats').classList.remove('hidden');
  });
  $('#beats-close').addEventListener('click', () => $('#modal-beats').classList.add('hidden'));
}

// --- settings modal ---
export function initSettingsModal(onSave) {
  $('#btn-settings').addEventListener('click', () => {
    $('#set-ordinals-gateway').value = store.settings.ordinalsGateway;
    $('#set-xtrata-gateway').value = store.settings.xtrataGateway;
    $('#set-autosave').checked = store.settings.autosave;
    $('#modal-settings').classList.remove('hidden');
  });
  $('#settings-close').addEventListener('click', () => {
    store.settings.ordinalsGateway = $('#set-ordinals-gateway').value.trim() || 'https://ordinals.com/content/';
    store.settings.xtrataGateway = $('#set-xtrata-gateway').value.trim() || 'https://xtrata.io/api/content/{id}';
    store.settings.autosave = $('#set-autosave').checked;
    $('#modal-settings').classList.add('hidden');
    onSave?.();
  });
}

// close modals on backdrop click / Escape
export function initModalDismissal() {
  document.querySelectorAll('.modal').forEach(m => {
    m.addEventListener('click', e => { if (e.target === m) m.classList.add('hidden'); });
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
  });
}
