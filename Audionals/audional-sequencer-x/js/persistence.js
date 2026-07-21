// persistence.js — save/load project JSON (native + legacy Audional format), autosave.

import { store, makeProject, makeSequence, makeChannel, NUM_CHANNELS, MAX_CHANNELS, NUM_STEPS, MAX_SEQUENCES, NUM_INSTRUMENTS } from './state.js';

const AUTOSAVE_KEY = 'audionalSequencerX.project';
const SETTINGS_KEY = 'audionalSequencerX.settings';

export function exportProject() {
  return JSON.stringify({ format: 'audional-sequencer-x/1', ...store.project }, null, 2);
}

export function downloadProject() {
  const blob = new Blob([exportProject()], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${(store.project.projectName || 'audional-project').replace(/[^\w\- ]+/g, '')}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
}

export function importProject(json) {
  const data = typeof json === 'string' ? JSON.parse(json) : json;
  const project = data.format?.startsWith('audional-sequencer-x')
    ? normalizeNative(data)
    : convertLegacy(data);
  store.loadProject(project);
  return project;
}

function normalizeNative(data) {
  const p = makeProject();
  p.choke = !!data.choke;
  p.fadeMs = +data.fadeMs || 15;
  Object.assign(p, {
    projectName: data.projectName ?? p.projectName,
    artistName: data.artistName ?? '',
    bpm: +data.bpm || 120,
    swing: +data.swing || 0,
    masterVolume: data.masterVolume ?? 0.9,
    continuous: data.continuous ?? true,
    currentSequence: 0
  });
  if (Array.isArray(data.channels)) {
    const count = Math.max(1, Math.min(data.channels.length, MAX_CHANNELS));
    while (p.channels.length < count) p.channels.push(makeChannel(p.channels.length));
    p.channels.length = count;
    data.channels.slice(0, count).forEach((c, i) => {
      const fx = { ...p.channels[i].fx, ...(c.fx || {}) };
      Object.assign(p.channels[i], c, { fx });
    });
  }
  const chCount = p.channels.length;
  if (Array.isArray(data.instruments)) {
    data.instruments.slice(0, NUM_INSTRUMENTS).forEach((inst, i) => Object.assign(p.instruments[i], inst));
  }
  if (Array.isArray(data.sequences) && data.sequences.length) {
    p.sequences = data.sequences.slice(0, MAX_SEQUENCES).map(s => {
      const seq = makeSequence(chCount);
      (s.steps || []).slice(0, chCount).forEach((row, ch) => {
        row.slice(0, NUM_STEPS).forEach((v, st) => {
          if (v && typeof v === 'object') {
            seq.steps[ch][st] = { v: v.v === 2 ? 2 : 1, ...(v.rev && { rev: true }),
              ...(v.trimStart != null && { trimStart: +v.trimStart }),
              ...(v.trimEnd != null && { trimEnd: +v.trimEnd }),
              ...(v.pitch != null && { pitch: +v.pitch }),
              ...(v.xfade != null && { xfade: +v.xfade }) };
          } else {
            seq.steps[ch][st] = v ? (v === 2 ? 2 : 1) : 0;
          }
        });
      });
      (s.notes || []).slice(0, NUM_INSTRUMENTS).forEach((list, i) => {
        seq.notes[i] = (list || []).filter(n =>
          n && n.step >= 0 && n.step < NUM_STEPS && n.pitch >= 0 && n.pitch < 128
        ).map(n => ({ step: n.step | 0, dur: Math.max(1, n.dur | 0), pitch: n.pitch | 0, vel: +n.vel || 1 }));
      });
      return seq;
    });
  }
  return p;
}

// Convert the original Audional Sequencer (B64x / BETA_XI) preset format.
function convertLegacy(data) {
  const p = makeProject();
  p.projectName = data.projectName || 'Imported project';
  p.artistName = data.artistName || '';
  p.bpm = +data.projectBPM || +data.bpm || 120;

  const urls = data.channelURLs || [];
  const vols = data.channelVolume || [];
  const speeds = data.channelPlaybackSpeed || [];
  const trims = data.trimSettings || [];
  const names = data.projectChannelNames || [];

  const legacyCount = Math.max(NUM_CHANNELS, Math.min(urls.length, MAX_CHANNELS));
  while (p.channels.length < legacyCount) p.channels.push(makeChannel(p.channels.length));
  for (let i = 0; i < Math.min(urls.length, legacyCount); i++) {
    const c = p.channels[i];
    if (urls[i]) {
      const isOrd = /ordinals\.com\/content\//.test(urls[i]);
      c.source = isOrd
        ? { type: 'ordinal', value: urls[i].split('/content/')[1] }
        : { type: 'url', value: urls[i] };
    }
    if (names[i]) { c.name = String(names[i]).slice(0, 24); c.sampleName = names[i]; }
    if (vols[i] != null) c.volume = Math.min(1.5, +vols[i]);
    if (speeds[i] != null && +speeds[i] > 0) c.pitch = +speeds[i];
    const t = trims[i];
    if (t) {
      // legacy trim values are percentages 0..100
      c.trimStart = Math.max(0, Math.min(1, (+t.start || 0) / 100));
      c.trimEnd = Math.max(c.trimStart, Math.min(1, (+t.end || 100) / 100));
    }
  }

  const seqs = data.projectSequences || {};
  const keys = Object.keys(seqs).sort((a, b) => (parseInt(a.replace(/\D/g, '')) - parseInt(b.replace(/\D/g, ''))));
  p.sequences = [];
  for (const key of keys.slice(0, MAX_SEQUENCES)) {
    const seq = makeSequence(p.channels.length);
    const chans = seqs[key] || {};
    for (const chKey of Object.keys(chans)) {
      const chIdx = parseInt(chKey.replace(/\D/g, ''), 10);
      if (isNaN(chIdx) || chIdx >= p.channels.length) continue;
      for (const s of chans[chKey].steps || []) {
        // legacy steps are 1-based; may be numbers or {index, reverse} objects
        const idx = (typeof s === 'object' ? s.index : s) - 1;
        if (idx >= 0 && idx < NUM_STEPS) seq.steps[chIdx][idx] = 1;
      }
    }
    p.sequences.push(seq);
  }
  if (!p.sequences.length) p.sequences.push(makeSequence());
  return p;
}

// --- autosave ---
export function autosave() {
  if (!store.settings.autosave) return;
  try { localStorage.setItem(AUTOSAVE_KEY, exportProject()); } catch { /* quota */ }
}

export function restoreAutosave() {
  try {
    const raw = localStorage.getItem(AUTOSAVE_KEY);
    if (raw) { importProject(raw); return true; }
  } catch { /* ignore corrupt */ }
  return false;
}

export function clearAutosave() {
  localStorage.removeItem(AUTOSAVE_KEY);
}

export function saveSettings() {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(store.settings));
}

export function restoreSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) Object.assign(store.settings, JSON.parse(raw));
  } catch { /* ignore */ }
}
