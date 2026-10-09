// main.js — bootstrap and wiring between store, engine, UI, and persistence.

import { store, makeProject, NUM_INSTRUMENTS } from "./state.js";
import { engine } from "./engine.js";
import { reloadAllSamples } from "./loader.js";
import * as ui from "./ui.js";
import * as persist from "./persistence.js";
import { initPianoRoll, rollPlayhead } from "./pianoroll.js";
import { initSynthPanel } from "./synth-panel.js";
import { initMidi } from "./midi-input.js";
import {
  initArrange,
  arrangePlayhead,
  attachStrips,
  isArrangeMode,
  syncArrangeControls,
} from "./arrange.js";
import { initHistory, resetHistory, undo, redo } from "./history.js";
import { initSourceBrowser } from "./source-browser.js";
import { initSamplesLoops } from "./samples-loops-browser.js";
import { initAudioTools } from "./audio-tools.js";
import { renderOrdinalReferences } from "./ordinal-links.js";

const $ = (s) => document.querySelector(s);
let sampleRestore = Promise.resolve([]);

// ------------------------------------------------------------ transport
function togglePlay() {
  if (engine.isPlaying) {
    engine.pause();
    $("#btn-play").textContent = "▶";
    $("#btn-play").classList.remove("active");
  } else {
    engine.play();
    $("#btn-play").textContent = "❚❚";
    $("#btn-play").classList.add("active");
  }
}

function stopAll() {
  engine.stop();
  $("#btn-play").textContent = "▶";
  $("#btn-play").classList.remove("active");
  ui.movePlayhead(-1);
}

engine.onStep = (step) => {
  ui.movePlayhead(step);
  rollPlayhead(step);
  if (isArrangeMode()) arrangePlayhead(step);
};

// ------------------------------------------------------------ starter session
// A ready-made song (drums, bass, keys, pad, lead) so the first screen has something to play.
const STARTER_URL = new URL("../data/starter-session.json", import.meta.url);
const WELCOME =
  "Welcome to The Audionaut — press Space to play the song, or type A–L to play the synth.";

// Replaces the current project with the starter. `guard` lets boot() back out if the person
// has already done something else (New, Load) while the file was on its way.
async function loadStarter({ guard = null } = {}) {
  const response = await fetch(STARTER_URL);
  if (!response.ok) throw new Error(`Starter session unavailable (${response.status}).`);
  const text = await response.text();
  if (guard && store.project !== guard) return false;
  persist.importProject(text);
  resetHistory();
  ui.setStatus("Loading the starter session's sounds…");
  const project = store.project;
  const failures = await sampleRestore;
  if (project !== store.project) return true;
  ui.refreshAllChannels();
  ui.setStatus(
    failures.length
      ? `Starter opened; retry audio in channels ${failures.join(", ")}.`
      : WELCOME,
    !!failures.length,
  );
  return true;
}

// ------------------------------------------------------------ header controls
function syncHeaderFromProject() {
  const p = store.project;
  renderOrdinalReferences($("#project-ordinal-links"), [
    { id: p.songOrigin?.inscription, label: "Original song" },
    { id: p.songOrigin?.data, label: "Song instructions" },
    { id: p.songOrigin?.engine, label: "Original engine" },
  ]);
  $("#project-name").value = p.projectName;
  $("#artist-name").value = p.artistName;
  $("#bpm").value = p.bpm;
  $("#swing").value = p.swing;
  $("#swing-val").textContent = `${p.swing}%`;
  $("#master-volume").value = p.masterVolume;
  $("#chk-continuous").checked = p.continuous;
}

function initHeader() {
  $("#btn-play").addEventListener("click", togglePlay);
  $("#btn-stop").addEventListener("click", stopAll);
  $("#project-name").addEventListener("change", (e) =>
    store.setProjectProp("projectName", e.target.value),
  );
  $("#artist-name").addEventListener("change", (e) =>
    store.setProjectProp("artistName", e.target.value),
  );
  $("#bpm").addEventListener("change", (e) => {
    store.setProjectProp(
      "bpm",
      Math.max(20, Math.min(420, +e.target.value || 120)),
    );
    engine.syncDelayToBpm();
  });
  $("#swing").addEventListener("input", (e) => {
    store.setProjectProp("swing", +e.target.value);
    $("#swing-val").textContent = `${e.target.value}%`;
  });
  $("#master-volume").addEventListener("input", (e) => {
    store.setProjectProp("masterVolume", +e.target.value);
    engine.setMasterVolume(+e.target.value);
  });
  $("#chk-continuous").addEventListener("change", (e) =>
    store.setProjectProp("continuous", e.target.checked),
  );
}

// ------------------------------------------------------------ sequence bar
let seqClipboard = null;

function initSequenceBar() {
  $("#seq-prev").addEventListener("click", () =>
    store.selectSequence(store.project.currentSequence - 1),
  );
  $("#seq-next").addEventListener("click", () =>
    store.selectSequence(store.project.currentSequence + 1),
  );
  $("#btn-copy-seq").addEventListener("click", () => {
    seqClipboard = store.copySequence();
    ui.setStatus(`Copied sequence ${store.project.currentSequence + 1}`);
  });
  $("#btn-paste-seq").addEventListener("click", () => {
    if (!seqClipboard) return ui.setStatus("Nothing copied yet", true);
    store.pasteSequence(seqClipboard);
    ui.setStatus(`Pasted into sequence ${store.project.currentSequence + 1}`);
  });
  $("#btn-clear-seq").addEventListener("click", () => store.clearSequence());
}

// ------------------------------------------------------------ file ops
function initFileOps() {
  $("#btn-save").addEventListener("click", () => {
    persist.downloadProject();
    ui.setStatus("Project exported as JSON.");
  });
  $("#btn-load").addEventListener("click", () => $("#file-input").click());
  $("#file-input").addEventListener("change", async (e) => {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file) return;
    try {
      persist.importProject(await file.text());
      ui.setStatus("Project loaded. Fetching samples…");
      const failures = await sampleRestore;
      ui.refreshAllChannels();
      ui.setStatus(
        failures.length
          ? `Project opened; retry audio in channels ${failures.join(", ")}.`
          : `Loaded "${store.project.projectName}".`,
        !!failures.length,
      );
    } catch (err) {
      ui.setStatus(`Import failed: ${err.message}`, true);
    }
  });
  $("#btn-starter").addEventListener("click", async () => {
    if (!confirm("Load the starter session? Unsaved changes will be lost.")) return;
    stopAll();
    try {
      await loadStarter();
    } catch (err) {
      ui.setStatus(`Starter session failed: ${err.message}`, true);
    }
  });
  $("#btn-new").addEventListener("click", () => {
    if (!confirm("Start a new project? Unsaved changes will be lost.")) return;
    stopAll();
    persist.clearAutosave();
    store.loadProject(makeProject());
    resetHistory();
    ui.setStatus("New project.");
  });
}

// ------------------------------------------------------------ keyboard
function doUndo() {
  if (undo()) ui.setStatus("Undo.");
}
function doRedo() {
  if (redo()) ui.setStatus("Redo.");
}

const TEXT_FIELD =
  'textarea, [contenteditable], input:not([type="range"], [type="checkbox"], [type="radio"], [type="button"], [type="file"])';

function initKeyboard() {
  document.addEventListener("keydown", (e) => {
    // global undo/redo — works in every edit mode (grid, roll, arrange, modals),
    // but text fields keep their own native undo.
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "z") {
      if (e.target.matches?.(TEXT_FIELD)) return;
      e.preventDefault();
      if (e.shiftKey) doRedo();
      else doUndo();
      return;
    }
    if (e.target.matches?.("input, textarea, select, [contenteditable]")) return;
    if (e.code === "Space") {
      e.preventDefault();
      togglePlay();
    } else if (e.key === "ArrowLeft")
      store.selectSequence(store.project.currentSequence - 1);
    else if (e.key === "ArrowRight")
      store.selectSequence(store.project.currentSequence + 1);
  });
}

// ------------------------------------------------------------ store subscriptions
// Undo/redo keeps playback running when every pool sample still has the same audio source.
const audioKey = (s) => JSON.stringify([s.id, s.source ?? null, s.clipSnapshot ?? null]);
function sameAudioSources(a, b) {
  if (!a?.samples || !b?.samples || a.samples.length !== b.samples.length) return false;
  return a.samples.every((s, i) => audioKey(s) === audioKey(b.samples[i]));
}

function initSubscriptions() {
  store.on("step", ({ ch, step, val }) => ui.updateStep(ch, step, val));
  // Playback follows the display: choosing another sequence while the transport is
  // running plays that sequence straight away (same step position, so it stays in
  // time). The engine's own chain-to-next-sequence sets this first, so it's a no-op there.
  store.on("sequence", () => {
    if (engine.isPlaying)
      engine.playingSequence = store.project.currentSequence;
  });
  store.on("sequence", () => {
    ui.renderPattern();
    ui.renderSequenceBar();
  });
  store.on("load", ({ restore, previous } = {}) => {
    // Undo/redo that leaves every channel's audio source alone keeps playback
    // and the decoded buffers running instead of stopping and re-fetching.
    const keepAudio = restore && sameAudioSources(previous, store.project);
    if (!keepAudio) {
      stopAll();
      engine.stopPreview();
      engine.clearBuffers();
    }
    engine.clampPlayingSequence();
    if (engine.ctx)
      for (let i = 0; i < store.numChannels; i++) engine.rebuildInserts(i);
    if (engine.ctx)
      for (let i = 0; i < NUM_INSTRUMENTS; i++) {
        engine.applyFx(i, true);
        engine.rebuildInserts(i, true);
      }
    syncArrangeControls();
    syncHeaderFromProject();
    ui.buildChannels();
    ui.buildInstruments();
    ui.refreshChainPanel();
    ui.refreshSoloDim();
    if (engine.ctx) engine.applySolo();
    ui.renderSequenceBar();
    const project = store.project;
    if (keepAudio) {
      sampleRestore = Promise.resolve([]);
      return;
    }
    sampleRestore = reloadAllSamples().then((failures) => {
      if (project !== store.project) return [];
      ui.refreshAllChannels();
      if (failures.length)
        ui.setStatus(
          `Re-select or retry samples in channels ${failures.join(", ")}.`,
          true,
        );
      return failures;
    });
  });
  store.on("channel", ({ ch }) => ui.refreshChannelRow(ch));
  store.on("channel", ({ ch, prop }) => {
    if (engine.ctx) {
      engine.setChannelVolume(ch, store.channel(ch).volume);
      engine.applyFx(ch);
      if (prop === "solo" || prop === "mute") engine.applySolo({ cut: prop === "solo" });
    }
    if (prop === "solo" || prop === "mute") ui.refreshSoloDim();
  });
  store.on("notes", (i) => ui.drawInstStrip(i));
  store.on("instrument", ({ i, prop }) => {
    ui.refreshInstrumentRow(i);
    if (engine.ctx) engine.setInstrumentVolume(i, store.instrument(i).volume);
    if (prop === "solo" || prop === "mute") {
      engine.applySolo({ cut: prop === "solo" }); // solo spans samples and synths
      ui.refreshSoloDim();
    }
  });
  document.addEventListener("instrument-renamed", (e) =>
    ui.refreshInstrumentRow(e.detail),
  );
  store.on("sequence", () => {
    for (let i = 0; i < 4; i++) ui.drawInstStrip(i);
  });
  let saveTimer = null;
  store.on("dirty", () => {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      saveTimer = null;
      persist.autosave();
    }, 800);
  });
  // Flush a pending autosave when the tab is hidden or closed so the last
  // edits inside the debounce window are not lost.
  const flushAutosave = () => {
    if (saveTimer == null) return;
    clearTimeout(saveTimer);
    saveTimer = null;
    persist.autosave();
  };
  addEventListener("pagehide", flushAutosave);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flushAutosave();
  });
}

// ------------------------------------------------------------ boot
function boot() {
  persist.restoreSettings();
  initHeader();
  initSequenceBar();
  initFileOps();
  initKeyboard();
  initSubscriptions();
  ui.initLoaderModal();
  ui.initTrimModal();
  ui.initChainPanel();
  ui.initBeatsModal();
  initPianoRoll();
  initSynthPanel();
  initMidi();
  initArrange();
  initSourceBrowser();
  initSamplesLoops();
  initAudioTools();
  ui.initSettingsModal(persist.saveSettings);
  ui.initModalDismissal();
  initHistory((canUndo, canRedo) => {
    $("#btn-undo").disabled = !canUndo;
    $("#btn-redo").disabled = !canRedo;
  });
  $("#btn-undo").addEventListener("click", doUndo);
  $("#btn-redo").addEventListener("click", doRedo);

  ui.labelIconButtons();
  const restored = persist.restoreAutosave();
  if (!restored) {
    syncHeaderFromProject();
    ui.buildChannels();
    attachStrips();
    ui.buildInstruments();
    ui.renderSequenceBar();
    // First visit (or cleared storage): open on the starter session. The empty project above
    // is what shows if the file cannot be fetched.
    ui.setStatus("Opening the starter session…");
    loadStarter({ guard: store.project }).catch((err) =>
      ui.setStatus(`Ready — ${err.message} Start with Beats or load a sample.`, true),
    );
  } else {
    ui.setStatus("Restored autosaved project. Reloading samples…");
    sampleRestore
      .then((failures) => {
        ui.refreshAllChannels();
        ui.setStatus(
          failures.length
            ? `Autosave opened; retry channels ${failures.join(", ")}.`
            : "Autosaved project restored.",
          !!failures.length,
        );
      })
      .catch(() => {});
  }
}

document.addEventListener("DOMContentLoaded", boot);
