import { STORAGE_KEYS } from "./storage-config.js";
// persistence.js — save/load project JSON (native + legacy Audional format), autosave.

import {
  store,
  makeProject,
  makeSequence,
  makeChannel,
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
import { normalizeOwner, cleanReturns } from "./plugins.js";
import { internProjectAssets, portableProject, storageAssets, registerAsset, newProjectId, pruneAssets } from "./assets.js";
import { saveProjectRevision, listProjectRevisions, loadProjectRevision, clearActiveProject, deleteProjectRevisions } from "./project-storage.js";
import { normalizeArp } from "./arpeggiator.js";

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

const AUTOSAVE_KEY = STORAGE_KEYS.legacyProject;
const SETTINGS_KEY = STORAGE_KEYS.settings;

// Pretty-printed for files people may open; compact files omit whitespace.
// Browser recovery stores project objects and shared assets separately in IndexedDB.
export function exportProject({ compact = false, project = store.project } = {}) {
  return JSON.stringify(
    {
      ...portableProject(project),
      format: "audionaut-workstation/2",
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
  updateStatus({ message: "Project exported as a portable file." });
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
    data.format === "audionaut-workstation/2"
      ? normalizeNative(data)
      : convertLegacy(data);
  internProjectAssets(project);
  store.loadProject(project);
  pruneAssets();
  return project;
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
    projectId: typeof data.projectId === "string" && /^[\w-]{1,100}$/.test(data.projectId) ? data.projectId : newProjectId(),
    projectName: data.projectName ?? p.projectName,
    artistName: data.artistName ?? "",
    bpm: +data.bpm || 120,
    swing: +data.swing || 0,
    masterVolume: data.masterVolume ?? 0.9,
    continuous: data.continuous ?? true,
    currentSequence: 0,
  });
  if (Array.isArray(data.channels)) {
    const count = Math.max(1, Math.min(data.channels.length, MAX_CHANNELS));
    while (p.channels.length < count)
      p.channels.push(makeChannel(p.channels.length));
    p.channels.length = count;
    data.channels.slice(0, count).forEach((c, i) => {
      if (!c || typeof c !== "object")
        throw new Error("The project contains an invalid channel.");
      Object.assign(p.channels[i], c);
      const channel = p.channels[i];
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
      channel.name = String(channel.name || `Channel ${i + 1}`).slice(0, 64);
      channel.sampleName = String(channel.sampleName || "").slice(0, 160);
      channel.volume = finite(channel.volume, 0.9, 0, p.songOrigin ? 3 : 1.5);
      channel.pitch = finite(channel.pitch, 1, 0.1, p.songOrigin ? 100 : 4);
      channel.trimStart = finite(channel.trimStart, 0, 0, 1 - 1e-7);
      channel.trimEnd = finite(channel.trimEnd, 1, channel.trimStart + 1e-7, 1);
      channel.wordSelection = wordMetadata(c.wordSelection);
      channel.clipSnapshot = c.clipSnapshot
        ? validateClipSnapshot(c.clipSnapshot)
        : null;
      if (
        channel.clipSnapshot &&
        (channel.source?.type !== "ordinal" ||
          channel.source.value !== channel.clipSnapshot.source.inscriptionId ||
          channel.source.audioSha256 !==
            channel.clipSnapshot.retrieved.payloadHash ||
          channel.source.sourceSha256 !==
            channel.clipSnapshot.retrieved.sourceHash)
      )
        throw new Error(
          "Channel source differs from its pinned clip snapshot.",
        );
      channel.soundMetadata = c.soundMetadata
        ? validateSoundMetadata(c.soundMetadata)
        : null;
      channel.gateSteps = finite(
        c.gateSteps,
        channel.soundMetadata?.loop ? 8 : 0,
        0,
        64,
      );
      channel.sampleMidi =
        c.sampleMidi == null ? null : finite(c.sampleMidi, 60, 0, 127) | 0;
      // fx/inserts: current chains, or the old fixed FX object + 4 insert slots
      channel.inserts = c.inserts;
      channel.fx = c.fx && typeof c.fx === "object" ? c.fx : [];
      channel.sends = c.sends; // delay / reverb send values; older files hold them as FX slots
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
      p.instruments[i].arp = normalizeArp(p.instruments[i].arp);
      p.instruments[i].fx =
        inst && inst.fx && typeof inst.fx === "object" ? inst.fx : [];
      p.instruments[i].inserts = inst?.inserts;
      p.instruments[i].sends = inst?.sends;
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
    p.sequences = data.sequences.slice(0, MAX_SEQUENCES).map((s) => {
      const seq = makeSequence(chCount);
      (s.steps || []).slice(0, chCount).forEach((row, ch) => {
        row.slice(0, NUM_STEPS).forEach((v, st) => {
          if (v && typeof v === "object") {
            seq.steps[ch][st] = {
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
              seq.steps[ch][st].wordSelection = wordMetadata(v.wordSelection);
          } else {
            seq.steps[ch][st] = v ? (v === 2 ? 2 : 1) : 0;
          }
        });
      });
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
  p.bpm = finite(p.bpm, 120, 20, 420);
  p.swing = finite(p.swing, 0, 0, 60);
  p.masterVolume = finite(p.masterVolume, 0.9, 0, 1.5);
  p.fadeMs = finite(p.fadeMs, 15, 1, 500);
  if (data.returns && typeof data.returns === "object") p.returns = cleanReturns(data.returns);
  p.currentSequence =
    finite(data.currentSequence, 0, 0, p.sequences.length - 1) | 0;
  return p;
}

// Convert the original Audional Sequencer (B64x / BETA_XI) preset format.
function convertLegacy(data) {
  const p = makeProject();
  p.projectName = data.projectName || "Imported project";
  p.artistName = data.artistName || "";
  p.bpm = finite(data.projectBPM ?? data.bpm, 120, 20, 420);

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
    p.channels.push(makeChannel(p.channels.length));
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
    const seq = makeSequence(p.channels.length);
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
  if (!p.sequences.length) p.sequences.push(makeSequence());
  return p;
}

// --- async browser recovery ---
let revision = 0, saveQueue = Promise.resolve(), clearedProject = null;
let status = { state: "dirty", dirty: true, message: "Not saved yet.", savedAt: null };
const statusListeners = new Set();
function updateStatus(next) {
  status = { ...status, ...next };
  for (const listener of statusListeners) listener({ ...status });
}
export function subscribeSaveStatus(listener) {
  statusListeners.add(listener); listener({ ...status });
  return () => statusListeners.delete(listener);
}
store.on("dirty", () => {
  revision++;
  updateStatus({ state: store.settings.autosave ? "dirty" : "disabled", dirty: true,
    message: store.settings.autosave ? "Changes awaiting browser recovery." : "Browser recovery is off. Export a project file." });
});
function reportStorageError(error) {
  updateStatus({ state: "error", dirty: true, message: `Browser recovery failed: ${error.message || error}. Export a project file to keep your work.` });
}
export function autosave({ force = false } = {}) {
  if (!force && !store.settings.autosave) {
    updateStatus({ state: "disabled", message: "Browser recovery is off. Export a project file." });
    return Promise.resolve(null);
  }
  const project = store.project, savedRevision = revision;
  // Capture a small immutable project now; storageAssets captures its audio records
  // before asynchronous hashing, so later edits cannot change the pending save.
  const pending = storageAssets(structuredClone(project));
  updateStatus({ state: "saving", message: "Saving browser recovery…" });
  const task = saveQueue.catch(() => {}).then(async () => {
    const prepared = await pending;
    const saved = await saveProjectRevision(prepared.project, prepared.assets, {
      isActive: () => project === store.project && project !== clearedProject,
    });
    if (project === store.project && savedRevision === revision)
      updateStatus({ state: "saved", dirty: false, message: "Saved in this browser.", savedAt: saved.updatedAt });
    else updateStatus({ state: "dirty", dirty: true, message: "Newer changes awaiting browser recovery.", savedAt: saved.updatedAt });
    return saved;
  }).catch((error) => { reportStorageError(error); throw error; });
  // Attach a handler immediately, including when callers intentionally fire-and-forget.
  task.catch(() => {}); pending.catch(() => {});
  saveQueue = task;
  return task;
}
async function applyRecovery(saved) {
  if (!saved) return false;
  for (const asset of saved.assets) registerAsset(asset.data, asset.id);
  importProject({ ...saved.project, format: "audionaut-workstation/2" });
  updateStatus({ state: "saved", dirty: false, message: "Restored browser recovery.", savedAt: saved.updatedAt });
  return true;
}
export async function restoreAutosave() {
  const initialProject = store.project, initialRevision = revision;
  const unchanged = () => store.project === initialProject && revision === initialRevision;
  let loaded = false;
  try {
    const saved = await loadProjectRevision();
    if (!unchanged()) return false; // never replace edits made while storage was opening
    if (saved) return await applyRecovery(saved);
    const raw = globalThis.localStorage?.getItem(AUTOSAVE_KEY);
    if (!raw) return false;
    importProject(raw);
    loaded = true;
    const migratedProject = store.project, migratedRevision = revision;
    // Keep legacy recovery until its replacement is committed successfully.
    const prepared = await storageAssets(structuredClone(migratedProject));
    const migrated = await saveProjectRevision(prepared.project, prepared.assets, {
      isActive: () => store.project === migratedProject && migratedProject !== clearedProject,
    });
    globalThis.localStorage?.removeItem(AUTOSAVE_KEY);
    if (store.project === migratedProject && revision === migratedRevision)
      updateStatus({ state: "saved", dirty: false, message: "Migrated browser recovery.", savedAt: migrated.updatedAt });
    return true;
  } catch (error) {
    reportStorageError(error);
    if (loaded) return true; // migration failure must not re-import over subsequent edits
    if (!unchanged()) return false;
    // A disabled/unavailable IndexedDB must not make an existing legacy save vanish.
    try {
      const raw = globalThis.localStorage?.getItem(AUTOSAVE_KEY);
      if (raw) { importProject(raw); reportStorageError(error); return true; }
    } catch { /* retained current project and the original recovery data */ }
    throw error;
  }
}
export const listSavedProjects = () => listProjectRevisions();
export async function restoreSavedProject(id) {
  const previous = store.project, previousRevision = revision;
  try {
    const saved = await loadProjectRevision(id);
    if (store.project !== previous || revision !== previousRevision)
      throw new Error("The project changed while recovery loaded; your current work was retained.");
    return await applyRecovery(saved);
  }
  catch (error) { reportStorageError(error); throw error; }
}
export const deleteSavedProject = (projectId) => deleteProjectRevisions(projectId);
export async function clearAutosave({ guard = () => true } = {}) {
  const project = store.project;
  clearedProject = project;
  try {
    await saveQueue.catch(() => {});
    if (!guard()) { if (clearedProject === project) clearedProject = null; return false; }
    const cleared = await clearActiveProject({ guard, projectId: project.projectId });
    if (!cleared || !guard()) { if (clearedProject === project) clearedProject = null; return false; }
    globalThis.localStorage?.removeItem(AUTOSAVE_KEY);
    return true;
  } catch (error) { if (clearedProject === project) clearedProject = null; throw error; }
}

function syncAutosaveStatus() {
  if (!store.settings.autosave)
    updateStatus({ state: "disabled", message: "Browser recovery is off. Export a project file." });
  else if (status.state === "disabled")
    updateStatus({ state: status.dirty ? "dirty" : "saved", message: status.dirty ? "Changes awaiting browser recovery." : "Saved in this browser." });
}
export function saveSettings() {
  syncAutosaveStatus();
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
    syncAutosaveStatus();
  } catch {
    /* ignore */
  }
}
