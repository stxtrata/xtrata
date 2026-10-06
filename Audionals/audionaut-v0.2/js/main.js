// main.js — bootstrap and wiring between store, engine, UI, and persistence.

import { store, makeProject, makeSequence } from "./state.js";
import { engine } from "./engine.js";
import { reloadAllSamples } from "./loader.js";
import * as ui from "./ui.js";
import * as persist from "./persistence.js";
import { initPianoRoll, rollPlayhead } from "./pianoroll.js";
import {
  initArrange,
  arrangePlayhead,
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
    seqClipboard = JSON.parse(JSON.stringify(store.seq));
    ui.setStatus(`Copied sequence ${store.project.currentSequence + 1}`);
  });
  $("#btn-paste-seq").addEventListener("click", () => {
    if (!seqClipboard) return ui.setStatus("Nothing copied yet", true);
    store.project.sequences[store.project.currentSequence] = JSON.parse(
      JSON.stringify(seqClipboard),
    );
    store.emit("sequence", store.project.currentSequence);
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
  $("#btn-new").addEventListener("click", () => {
    if (!confirm("Start a new project? Unsaved changes will be lost.")) return;
    stopAll();
    persist.clearAutosave();
    store.loadProject(makeProject());
    engine.buffers.fill(null);
    engine.reverseBuffers.fill(null);
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

function initKeyboard() {
  document.addEventListener("keydown", (e) => {
    // global undo/redo — works in every edit mode (grid, roll, arrange, modals)
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "z") {
      e.preventDefault();
      if (e.shiftKey) doRedo();
      else doUndo();
      return;
    }
    if (e.target.matches?.("input, textarea")) return;
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
function initSubscriptions() {
  store.on("step", ({ ch, step, val }) => ui.updateStep(ch, step, val));
  store.on("sequence", () => {
    ui.renderPattern();
    ui.renderSequenceBar();
  });
  store.on("load", () => {
    stopAll();
    engine.stopPreview();
    engine.buffers.fill(null);
    engine.reverseBuffers.fill(null);
    if (engine.ctx)
      for (let i = 0; i < store.numChannels; i++) engine.rebuildInserts(i);
    syncArrangeControls();
    syncHeaderFromProject();
    ui.buildChannels();
    ui.buildInstruments();
    ui.renderSequenceBar();
    const project = store.project;
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
  store.on("channel", ({ ch }) => {
    if (engine.ctx) {
      engine.setChannelVolume(ch, store.channel(ch).volume);
      engine.applyFx(ch);
    }
  });
  store.on("notes", (i) => ui.drawInstStrip(i));
  store.on("instrument", ({ i }) => {
    ui.refreshInstrumentRow(i);
    if (engine.ctx) engine.setInstrumentVolume(i, store.instrument(i).volume);
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
    saveTimer = setTimeout(persist.autosave, 800);
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
  ui.initFxModal();
  ui.initInsertsModal();
  ui.initBeatsModal();
  initPianoRoll();
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

  const restored = persist.restoreAutosave();
  if (!restored) {
    syncHeaderFromProject();
    ui.buildChannels();
    ui.buildInstruments();
    ui.renderSequenceBar();
  } else {
    ui.setStatus(
      "Restored autosaved project. Samples reload on first Load/fetch.",
    );
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
