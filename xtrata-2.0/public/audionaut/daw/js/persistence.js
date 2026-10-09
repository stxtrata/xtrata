// persistence.js — save/load project JSON (native + legacy Audional format), autosave.

import {
  store,
  makeProject,
  makeSequence,
  makeChannel,
  makeLegacyChannel,
  makeLegacyProject,
  makeLegacySequence,
  makeInstrument,
  NUM_CHANNELS,
  MAX_CHANNELS,
  NUM_STEPS,
  MAX_SEQUENCES,
  NUM_INSTRUMENTS,
} from "./state.js";
import { validateWordSelection } from "./word-index.js";
import { SYNTH_BANK } from "./synths.js";
import { validateSoundMetadata } from "./onboard-library.js";
import { validateClipSnapshot } from "./clip-contract.js";
import { normalizeOwner } from "./plugins.js";
import {
  bindChannel,
  blankSample,
  collectUnusedSamples,
  ensureDefaultSample,
  invalidatePool,
  isBlankSample,
  newId,
  rowToRegions,
  sampleById as poolSampleById,
  sortRegions,
} from "./region-model.js";

// Display names the synths carried before the rename. A saved instrument whose name is still
// the old stock name follows the synth to its new name; custom names are never touched.
const LEGACY_SYNTH_NAMES = {
  fm4: "jiFM4",
  vox: "jiVOX",
  pluck: "jiPLUCK",
  jibass: "jiBASS",
  ensemble: "jiENSEMBLE",
  tine: "jiTINE",
  kit: "jiKIT",
  tonewheel: "jiTONEWHEEL",
  morph: "jiMORPH",
  texture: "jiTEXTURE",
  winds: "jiWINDS",
  modal: "jiMODAL",
  lantern: "jiLANTERN",
  prism: "jiPRISM",
};
const finite = (value, fallback, min, max) =>
  Number.isFinite(+value) ? Math.max(min, Math.min(max, +value)) : fallback;
function wordMetadata(value) {
  if (!value) return null;
  try {
    const valid = validateWordSelection(value);
    return {
      ...valid,
      text:
        typeof valid.text === "string"
          ? valid.text.slice(0, 160)
          : "Saved section",
    };
  } catch {
    return null;
  }
}

// v0.3 stores the sample-pool-and-regions model. The v0.2 key is read once when there is no v0.3
// autosave (an old session), migrated on load, and removed with the next clear.
const AUTOSAVE_KEY = "audionaut.v0.3.project";
const AUTOSAVE_KEY_V2 = "audionaut.v0.2.project";
const SETTINGS_KEY = "audionaut.v0.2.settings";

// Pretty-printed for files people may open; `compact` (autosave) saves ~30% of
// the localStorage quota that embedded audio and big projects compete for.
export function exportProject({ compact = false } = {}) {
  return JSON.stringify(
    {
      ...store.project,
      format: "audionaut-workstation/3",
      clipSnapshotVersion: 1,
    },
    null,
    compact ? 0 : 2,
  );
}

export function downloadProject() {
  const blob = new Blob([exportProject()], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${(store.project.projectName || "audional-project").replace(/[^\w\- ]+/g, "")}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}

export function importProject(json) {
  const data = typeof json === "string" ? JSON.parse(json) : json;
  if (!data || typeof data !== "object")
    throw new Error("Choose an Audional project JSON.");
  if (!Array.isArray(data.channels) && !data.projectSequences)
    throw new Error("This file is not a supported Audional project.");
  const project =
    data.format?.startsWith("audional-sequencer-x") ||
    data.format === "audional-sequencer-l1xl2/1" ||
    data.format === "audionaut-workstation/2" ||
    data.format === "audionaut-workstation/3"
      ? normalizeNative(data)
      : convertLegacy(data);
  store.loadProject(project);
  return project;
}

// Validates and bounds the sample fields of `target` (a pool entry, or a v2 channel standing in
// for its default sample) from the raw saved values `c`.
function cleanSample(target, c, songMode) {
  if (
    c.clipSnapshot &&
    (!Number.isFinite(c.trimStart) ||
      !Number.isFinite(c.trimEnd) ||
      c.trimStart < 0 ||
      c.trimEnd > 1 ||
      c.trimEnd <= c.trimStart ||
      !Number.isFinite(c.pitch) ||
      c.pitch < 0.1 ||
      c.pitch > 4 ||
      (c.gateSteps != null &&
        (!Number.isFinite(c.gateSteps) ||
          c.gateSteps < 0 ||
          c.gateSteps > 64)))
  )
    throw new Error(
      "Invalid saved clip playback settings; the current project was retained.",
    );
  target.sampleName = String(c.sampleName || "").slice(0, 160);
  target.pitch = finite(c.pitch, 1, 0.1, songMode ? 100 : 4);
  target.trimStart = finite(c.trimStart, 0, 0, 1 - 1e-7);
  target.trimEnd = finite(c.trimEnd, 1, target.trimStart + 1e-7, 1);
  target.reverse = !!c.reverse;
  target.source = c.source ?? null;
  target.wordSelection = wordMetadata(c.wordSelection);
  target.clipSnapshot = c.clipSnapshot
    ? validateClipSnapshot(c.clipSnapshot)
    : null;
  if (
    target.clipSnapshot &&
    (target.source?.type !== "ordinal" ||
      target.source.value !== target.clipSnapshot.source.inscriptionId ||
      target.source.audioSha256 !==
        target.clipSnapshot.retrieved.payloadHash ||
      target.source.sourceSha256 !== target.clipSnapshot.retrieved.sourceHash)
  )
    throw new Error("Channel source differs from its pinned clip snapshot.");
  target.soundMetadata = c.soundMetadata
    ? validateSoundMetadata(c.soundMetadata)
    : null;
  target.gateSteps = finite(
    c.gateSteps,
    target.soundMetadata?.loop ? 8 : 0,
    0,
    64,
  );
  target.sampleMidi =
    c.sampleMidi == null ? null : finite(c.sampleMidi, 60, 0, 127) | 0;
  if (c.analysis && typeof c.analysis === "object") target.analysis = c.analysis;
}

function normalizeNative(data) {
  const p = makeProject();
  p.choke = !!data.choke;
  p.fadeMs = +data.fadeMs || 15;
  p.playEmptySequences = !!data.playEmptySequences;
  if (
    data.songOrigin &&
    ["audx", "compressed-b64x"].includes(data.songOrigin.format)
  )
    p.songOrigin = data.songOrigin;
  if (data.songEndStep != null)
    p.songEndStep = finite(data.songEndStep, 64, 1, MAX_SEQUENCES * NUM_STEPS);
  Object.assign(p, {
    projectName: data.projectName ?? p.projectName,
    artistName: data.artistName ?? "",
    bpm: +data.bpm || 120,
    swing: +data.swing || 0,
    masterVolume: data.masterVolume ?? 0.9,
    continuous: data.continuous ?? true,
    currentSequence: 0,
  });
  // Channels, and the sample pool they play from. Version 2 files keep each channel's sample on
  // the channel itself (and steps in the sequences); version 3 files carry `samples` and
  // `defaultSample`. Either way the sample fields are validated by cleanSample, and v2 channels
  // are cleaned through their view of their default sample.
  const isV3 = Array.isArray(data.samples);
  if (Array.isArray(data.channels)) {
    const count = Math.max(1, Math.min(data.channels.length, MAX_CHANNELS));
    while (p.channels.length < count)
      p.channels.push(bindChannel(p, makeChannel(p.channels.length)));
    p.channels.length = count;
    p.sequences.forEach((seq) => (seq.regions.length = count));
    if (isV3) {
      p.nextId = Math.max(0, Math.floor(+data.nextId || 0));
      const seen = new Set();
      p.samples = data.samples.slice(0, 4096).flatMap((raw) => {
        if (!raw || typeof raw !== "object" || typeof raw.id !== "string" || seen.has(raw.id)) return [];
        seen.add(raw.id);
        const sample = { id: raw.id };
        Object.assign(sample, blankSample(raw.id), raw);
        cleanSample(sample, raw, p.songOrigin);
        return [sample];
      });
      invalidatePool(p);
    }
    data.channels.slice(0, count).forEach((c, i) => {
      if (!c || typeof c !== "object")
        throw new Error("The project contains an invalid channel.");
      const channel = p.channels[i];
      if (isV3) {
        for (const k of ["color", "mute", "solo"]) if (k in c) channel[k] = c[k];
        channel.defaultSample = poolSampleById(p, c.defaultSample)
          ? c.defaultSample
          : null;
      } else {
        Object.assign(channel, c);
        cleanSample(channel, c, p.songOrigin);
      }
      channel.name = String(c.name || `Channel ${i + 1}`).slice(0, 64);
      channel.volume = finite(c.volume, 0.9, 0, p.songOrigin ? 3 : 1.5);
      // fx/inserts: current chains, or the old fixed FX object + 4 insert slots
      channel.inserts = c.inserts;
      channel.fx = c.fx && typeof c.fx === "object" ? c.fx : [];
      normalizeOwner(channel);
    });
  }
  const chCount = p.channels.length;
  if (
    data.lastBeat &&
    ["original", "l1", "combined", "tonal", "analog"].includes(
      data.lastBeat.collection,
    ) &&
    typeof data.lastBeat.id === "string" &&
    /^[\w-]{1,180}$/.test(data.lastBeat.id)
  )
    p.lastBeat = {
      id: data.lastBeat.id,
      name: String(data.lastBeat.name || "Saved beat").slice(0, 180),
      collection: data.lastBeat.collection,
    };
  p.lastPresetChannels = finite(data.lastPresetChannels, 0, 0, chCount) | 0;
  if (Array.isArray(data.instruments)) {
    data.instruments.slice(0, NUM_INSTRUMENTS).forEach((inst, i) => {
      Object.assign(p.instruments[i], inst);
      if (!SYNTH_BANK[p.instruments[i].synthId])
        p.instruments[i].synthId = "jims10";
      p.instruments[i].volume = finite(p.instruments[i].volume, 0.8, 0, 1.5);
      p.instruments[i].fx =
        inst && inst.fx && typeof inst.fx === "object" ? inst.fx : [];
      p.instruments[i].inserts = inst?.inserts;
      normalizeOwner(p.instruments[i]);
      {
        const cur0 = p.instruments[i];
        const legacy = LEGACY_SYNTH_NAMES[cur0.synthId];
        if (legacy && String(cur0.name || "").trim().toLowerCase() === legacy.toLowerCase())
          cur0.name = SYNTH_BANK[cur0.synthId].name;
      }
      // Projects saved before the Coinbase / Gm / Taproot synths had every slot on
      // jiMS10. Move slots that were never touched (stock name, no tweaks, no notes
      // in any sequence) onto the new default synth for that slot.
      const cur = p.instruments[i];
      const hasNotes = (data.sequences || []).some(
        (s) => Array.isArray(s?.notes?.[i]) && s.notes[i].length,
      );
      if (
        i > 0 &&
        cur.synthId === "jims10" &&
        !cur.params &&
        /^Synth \d+$/.test(String(cur.name || "")) &&
        !hasNotes
      ) {
        const fresh = makeInstrument(i);
        cur.synthId = fresh.synthId;
        cur.name = fresh.name;
      }
    });
  }
  if (Array.isArray(data.sequences) && data.sequences.length) {
    // v3 regions: keep only well-formed ones that point at a pool entry that exists.
    const cleanRegion = (r, seen) => {
      if (
        !r ||
        typeof r !== "object" ||
        !Number.isFinite(+r.pos) ||
        !poolSampleById(p, r.sample)
      )
        return [];
      let id = typeof r.id === "string" && /^r\w{1,12}$/.test(r.id) ? r.id : null;
      if (id) p.nextId = Math.max(p.nextId, parseInt(id.slice(1), 36) || 0);
      if (!id || seen.has(id)) id = newId(p, "r");
      seen.add(id);
      return [
        {
          id,
          sample: r.sample,
          pos: finite(r.pos, 0, 0, NUM_STEPS - 1e-6),
          v: r.v === 2 ? 2 : 1,
          ...(r.rev != null && { rev: !!r.rev }),
          ...(r.trimStart != null && { trimStart: +r.trimStart }),
          ...(r.trimEnd != null && { trimEnd: +r.trimEnd }),
          ...(r.pitch != null && { pitch: +r.pitch }),
          ...(r.xfade != null && { xfade: +r.xfade }),
          ...(r.gateSteps != null && { gateSteps: finite(r.gateSteps, 0, 0, 64) }),
          ...(r.sampleMidi != null && { sampleMidi: finite(r.sampleMidi, 60, 0, 127) | 0 }),
          ...(r.wordSelection && { wordSelection: wordMetadata(r.wordSelection) }),
        },
      ];
    };
    p.sequences = data.sequences.slice(0, MAX_SEQUENCES).map((s) => {
      const seq = makeSequence(chCount);
      if (isV3) {
        const seen = new Set();
        (s.regions || []).slice(0, chCount).forEach((row, ch) => {
          seq.regions[ch] = sortRegions(
            (Array.isArray(row) ? row : []).slice(0, 4096).flatMap((r) => cleanRegion(r, seen)),
          );
        });
      } else {
        (s.steps || []).slice(0, chCount).forEach((row, ch) => {
          const clean = new Array(NUM_STEPS).fill(0);
          row.slice(0, NUM_STEPS).forEach((v, st) => {
            if (v && typeof v === "object") {
              clean[st] = {
                v: v.v === 2 ? 2 : 1,
                ...(v.rev != null && { rev: !!v.rev }),
                ...(v.trimStart != null && { trimStart: +v.trimStart }),
                ...(v.trimEnd != null && { trimEnd: +v.trimEnd }),
                ...(v.pitch != null && { pitch: +v.pitch }),
                ...(v.xfade != null && { xfade: +v.xfade }),
                ...(v.off != null &&
                  finite(v.off, 0, 0, 0.999) > 0 && {
                    off: finite(v.off, 0, 0, 0.999),
                  }),
                ...(v.gateSteps != null && {
                  gateSteps: finite(v.gateSteps, 0, 0, 64),
                }),
                ...(v.sampleMidi != null && {
                  sampleMidi: finite(v.sampleMidi, 60, 0, 127) | 0,
                }),
              };
              if (v.wordSelection)
                clean[st].wordSelection = wordMetadata(v.wordSelection);
            } else {
              clean[st] = v ? (v === 2 ? 2 : 1) : 0;
            }
          });
          // Steps on a channel that has no sample yet still need a pool entry to point at.
          if (clean.some(Boolean))
            seq.regions[ch] = sortRegions(
              rowToRegions(p, clean, ensureDefaultSample(p, p.channels[ch]).id),
            );
        });
      }
      (s.notes || []).slice(0, NUM_INSTRUMENTS).forEach((list, i) => {
        seq.notes[i] = (list || [])
          .filter(
            (n) =>
              n &&
              n.step >= 0 &&
              n.step < NUM_STEPS &&
              n.pitch >= 0 &&
              n.pitch < 128,
          )
          .map((n) => ({
            step: n.step | 0,
            dur: Math.max(1, n.dur | 0),
            pitch: n.pitch | 0,
            vel: +n.vel || 1,
          }));
      });
      return seq;
    });
  }
  // v2 files list every channel's (mostly stock) sample fields. Keep a pool entry only where it
  // holds something or a region plays it.
  const played = new Set(p.sequences.flatMap((seq) => seq.regions.flat().map((r) => r.sample)));
  for (const c of p.channels) {
    const own = poolSampleById(p, c.defaultSample);
    if (own && isBlankSample(own) && !played.has(own.id)) c.defaultSample = null;
  }
  collectUnusedSamples(p);
  p.bpm = finite(p.bpm, 120, 20, 420);
  p.swing = finite(p.swing, 0, 0, 60);
  p.masterVolume = finite(p.masterVolume, 0.9, 0, 1.5);
  p.fadeMs = finite(p.fadeMs, 15, 1, 500);
  p.currentSequence =
    finite(data.currentSequence, 0, 0, p.sequences.length - 1) | 0;
  return p;
}

// Convert the original Audional Sequencer (B64x / BETA_XI) preset format.
function convertLegacy(data) {
  const p = makeLegacyProject();
  p.projectName = data.projectName || "Imported project";
  p.artistName = data.artistName || "";
  p.bpm = +data.projectBPM || +data.bpm || 120;

  const urls = data.channelURLs || [];
  const vols = data.channelVolume || [];
  const speeds = data.channelPlaybackSpeed || [];
  const trims = data.trimSettings || [];
  const names = data.projectChannelNames || [];

  const legacyCount = Math.max(
    NUM_CHANNELS,
    Math.min(urls.length, MAX_CHANNELS),
  );
  while (p.channels.length < legacyCount)
    p.channels.push(makeLegacyChannel(p.channels.length));
  for (let i = 0; i < Math.min(urls.length, legacyCount); i++) {
    const c = p.channels[i];
    if (urls[i]) {
      const isOrd = /ordinals\.com\/content\//.test(urls[i]);
      c.source = isOrd
        ? { type: "ordinal", value: urls[i].split("/content/")[1] }
        : { type: "url", value: urls[i] };
    }
    if (names[i]) {
      c.name = String(names[i]).slice(0, 24);
      c.sampleName = names[i];
    }
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
  const keys = Object.keys(seqs).sort(
    (a, b) => parseInt(a.replace(/\D/g, "")) - parseInt(b.replace(/\D/g, "")),
  );
  p.sequences = [];
  for (const key of keys.slice(0, MAX_SEQUENCES)) {
    const seq = makeLegacySequence(p.channels.length);
    const chans = seqs[key] || {};
    for (const chKey of Object.keys(chans)) {
      const chIdx = parseInt(chKey.replace(/\D/g, ""), 10);
      if (isNaN(chIdx) || chIdx >= p.channels.length) continue;
      for (const s of chans[chKey].steps || []) {
        // legacy steps are 1-based; may be numbers or {index, reverse} objects
        const idx = (typeof s === "object" ? s.index : s) - 1;
        if (idx >= 0 && idx < NUM_STEPS) seq.steps[chIdx][idx] = 1;
      }
    }
    p.sequences.push(seq);
  }
  if (!p.sequences.length) p.sequences.push(makeLegacySequence());
  return p;
}

// --- autosave ---
export function autosave() {
  if (!store.settings.autosave) return;
  try {
    localStorage.setItem(AUTOSAVE_KEY, exportProject({ compact: true }));
  } catch {
    document.querySelector("#status-text").textContent =
      "Browser storage is full. Save a project file to keep embedded audio.";
  }
}

export function restoreAutosave() {
  try {
    const raw =
      localStorage.getItem(AUTOSAVE_KEY) ?? localStorage.getItem(AUTOSAVE_KEY_V2);
    if (raw) {
      importProject(raw);
      return true;
    }
  } catch {
    /* ignore corrupt */
  }
  return false;
}

export function clearAutosave() {
  try {
    localStorage.removeItem(AUTOSAVE_KEY);
    localStorage.removeItem(AUTOSAVE_KEY_V2);
  } catch {
    /* storage unavailable */
  }
}

export function saveSettings() {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(store.settings));
  } catch {
    /* storage unavailable */
  }
}

export function restoreSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) Object.assign(store.settings, JSON.parse(raw));
  } catch {
    /* ignore */
  }
}
