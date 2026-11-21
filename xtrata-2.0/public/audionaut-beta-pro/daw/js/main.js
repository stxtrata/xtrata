import './mobile-track-groups.js';
// main.js — bootstrap and wiring between store, engine, UI, and persistence.

import { store, makeProject } from "./state.js";
import { engine } from "./engine.js";
import { restoreEditorSamples } from "./live-player-setup.js";
import * as ui from "./ui.js";
import * as persist from "./persistence.js";
import { initPianoRoll, rollPlayhead } from "./pianoroll.js";
import { initSynthPanel } from "./synth-panel.js";
import { initMidi, getMidiTarget, setMidiTarget } from "./midi-input.js";
import {
  initArrange,
  arrangePlayhead,
  attachStrips,
  isArrangeMode,
  syncArrangeControls,
} from "./arrange.js";
import { initHistory, resetHistory, undo, redo } from "./history.js";
import { initAudioTools } from "./audio-tools.js";
import { renderOrdinalReferences } from "./ordinal-links.js";
import { sourceIdentity } from "./assets.js";
import { initPerformanceControls } from "./performance-controls.js";
import { initProjectLibrary } from "./project-library.js";
import { initPublish } from "./publish.js";
import { initWorkspace } from "./pro-workspace.js";
import { openProjectFile } from './legacy-import-ui.js';
import { preparedImportFailures } from './legacy-import-audio.js';

const $ = (s) => document.querySelector(s);
let sampleRestore = Promise.resolve([]);
document.addEventListener('audio-error',event=>ui.setStatus(event.detail.message,true));

// ------------------------------------------------------------ transport
async function togglePlay() {
  if (engine.isPlaying) return engine.pause();
  try {
    const fromBeat = engine._pausedBeat == null ? engine.editorTransport?.startBeat() : undefined;
    await engine.play({ fromBeat });
  } catch (error) {
    ui.setStatus(error.message, true);
  }
}

function stopAll() {
  engine.stop();
  $("#btn-play").textContent = "▶";
  $("#btn-play").setAttribute("aria-label", "Play");
  $("#btn-play").classList.remove("active");
  ui.movePlayhead(-1);
}

engine.onStep = (step) => {
  ui.movePlayhead(step);
  rollPlayhead(step);
  if (document.body.dataset.workspace === "mobile") document.dispatchEvent(new Event("audionaut-display-step"));
  if (isArrangeMode()) arrangePlayhead(step);
};

// ------------------------------------------------------------ starter session
// Ready-made songs so the first screen has something to play. Lagos Late Night opens on a first
// visit and is what the Starter button loads; the dropdown next to the button lists the whole
// library (daw/data/starters/index.json) and loads + plays whichever is picked.
const DATA_URL = new URL("../data/", import.meta.url);
const STARTER_URL = new URL("starters/afrobeat.json", DATA_URL);
const STARTERS_INDEX_URL = new URL("starters/index.json", DATA_URL);
const WELCOME =
  "Welcome to The Audionaut — Lagos Late Night. Press Space to play the song, or type A–L to play the synth.";
let starterTicket = 0; // a newer pick makes an older one that is still loading give up

// Replaces the current project with a starter song (default: Lagos Late Night). `guard` lets
// boot() back out if the person has already done something else (New, Load) while the file was on
// its way.
async function loadStarter({ guard = null, url = STARTER_URL, message = WELCOME } = {}) {
  const ticket = ++starterTicket;
  const unchanged = replacementGuard();
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Starter song unavailable (${response.status}).`);
  const text = await response.text();
  if (ticket !== starterTicket || !unchanged() || (guard && store.project !== guard)) return false;
  persist.importProject(text);
  resetHistory();
  ui.setStatus("Loading the starter session's sounds…");
  const project = store.project;
  const failures = await sampleRestore;
  if (ticket !== starterTicket || project !== store.project) return false;
  ui.refreshAllChannels();
  ui.setStatus(
    failures.length
      ? `Starter opened; retry audio in channels ${failures.join(", ")}.`
      : message,
    !!failures.length,
  );
  return true;
}

// Has the person changed anything since the current project finished loading? Playing, chaining
// sequences and the project's own samples arriving do not count; steps, notes, synth and mixer
// changes do. Used to decide when switching songs needs a confirmation.
const sessionState = { edited: false, revision: 0 };
let replacementTicket = 0;
function replacementGuard() {
  const project = store.project, revision = sessionState.revision, ticket = ++replacementTicket;
  return () => store.project === project && sessionState.revision === revision && replacementTicket === ticket;
}
function trackEdits() {
  store.on("dirty", (change) => {
    sessionState.revision++;
    if (change?.event !== "load") sessionState.edited = true;
  });
  store.on("load", ({ restore } = {}) => { if (!restore) sessionState.edited = false; });
}
const confirmReplace = () => !sessionState.edited || confirm("Replace this project? Download a project file first if you want a separate copy of your changes.");

// The song library behind the dropdown. Fails quietly: without the index the select stays hidden
// and the Starter button still works.
async function initStarterLibrary() {
  const select = $("#starter-select");
  let songs;
  try {
    const response = await fetch(STARTERS_INDEX_URL);
    if (!response.ok) return;
    songs = (await response.json()).songs;
  } catch {
    return;
  }
  if (!Array.isArray(songs) || !songs.length) return;
  select.replaceChildren(new Option("♪ Starter songs…", ""));
  for (const song of songs)
    select.append(new Option(`${song.name} · ${song.genre} · ${song.bpm}`, song.id));
  select.hidden = false;
  let current = "";
  select.addEventListener("change", async () => {
    const song = songs.find((s) => s.id === select.value);
    if (!song) return;
    // Auditioning should be quick: only ask when there is something of the person's own to lose.
    if (sessionState.edited && !confirm(`Load "${song.name}"? Unsaved changes will be lost.`)) {
      select.value = current;
      return;
    }
    current = select.value;
    stopAll();
    try {
      const loaded = await loadStarter({
        url: new URL(song.file, DATA_URL),
        message: `${song.name} — ${song.blurb} Space plays and stops.`,
      });
      if (loaded && !engine.isPlaying) togglePlay();
    } catch (err) {
      ui.setStatus(`Starter song failed: ${err.message}`, true);
    }
  });
  // the pick follows whichever project is open: a library song shows its name, anything else clears it
  const syncPick = () => {
    const name = store.project.projectName;
    current = songs.find((s) => (s.projectName || s.name) === name)?.id || "";
    select.value = current;
  };
  store.on("load", syncPick);
  syncPick(); // the first-visit song may have finished loading before the index arrived
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
  $("#btn-save").addEventListener("click", async () => {
    try {
      await persist.downloadProject();
      sessionState.edited = false;
      ui.setStatus("Project exported as JSON.");
    } catch (error) { ui.setStatus(`Export failed: ${error.message}`, true); }
  });
  $("#btn-load").addEventListener("click", () => $("#file-input").click());
  $("#file-input").addEventListener("change", async (e) => {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file) return;
    if (!confirmReplace()) return;
    const unchanged = replacementGuard();
    try {
      if(!await openProjectFile(file,{guard:unchanged,onStatus:ui.setStatus}))return;
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
  $("#btn-new").addEventListener("click", async () => {
    if (!confirm("Start a new project? Unsaved changes will be lost.")) return;
    stopAll();
    const unchanged = replacementGuard();
    try {
      if (!await persist.clearAutosave({ guard: unchanged }) || !unchanged())
        return ui.setStatus("The project changed while New was opening. Your current work was retained.", true);
    } catch (error) { return ui.setStatus(`Could not start a new project: ${error.message}`, true); }
    store.loadProject(makeProject());
    resetHistory();
    ui.setStatus("Blank project ready. Open Project for starter templates, or Library for beats and samples.");
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
    if (e.target?.closest?.("dialog")) return;
    if (e.defaultPrevented || (e.code === "Space" && e.target?.closest?.("button,dialog"))) return;
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
      if (document.querySelector("#modal-beats:not(.hidden)")) return;
      e.preventDefault();
      togglePlay();
    } else if (document.querySelector(".modal:not(.hidden)")) return;
    else if (e.key === "ArrowLeft")
      store.selectSequence(store.project.currentSequence - 1);
    else if (e.key === "ArrowRight")
      store.selectSequence(store.project.currentSequence + 1);
  });
}

// ------------------------------------------------------------ store subscriptions
const audioKey = (c) => `${sourceIdentity(c.source)}|${JSON.stringify(c.clipSnapshot ?? null)}`;
function sameAudioSources(a, b) {
  if (!a || !b || a.channels.length !== b.channels.length) return false;
  return a.channels.every((c, i) => audioKey(c) === audioKey(b.channels[i]));
}

function initSubscriptions() {
  document.addEventListener('transport',({detail})=>{const playing=!!detail?.playing;$('#btn-play').setAttribute('aria-label',playing?'Pause':'Play');$('#btn-play').textContent=playing?'❚❚':'▶';$('#btn-play').classList.toggle('active',playing);});
  store.on("step", ({ ch, step, val }) => ui.updateStep(ch, step, val));
  // Playback follows the display: choosing another sequence while the transport is
  // running plays that sequence straight away (same step position, so it stays in
  // time). The engine's own chain-to-next-sequence sets this first, so it's a no-op there.
  store.on("sequence", () => {
    if (engine.isPlaying && !engine._selectingSequence && !engine.editorTransport)
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
      engine.buffers.fill(null);
      engine.reverseBuffers.fill(null);
    }
    engine.clampPlayingSequence();
    if (engine.ctx) {
      engine.ensureChannelChains();
      engine.ensureInstrumentChains();
      engine.setMasterVolume(store.project.masterVolume);
      for (let i = 0; i < store.numChannels; i++) engine.setChannelVolume(i, store.channel(i).volume);
      engine.syncDelayToBpm();
    }
    if (engine.ctx)
      for (let i = 0; i < store.numChannels; i++) engine.rebuildInserts(i);
    if (engine.ctx)
      for (let i = 0; i < store.project.instruments.length; i++) {
        engine.applyFx(i, true);
        engine.rebuildInserts(i, true);
      }
    syncArrangeControls();
    syncHeaderFromProject();
    const channelsChanged = !restore || previous?.channels.length !== store.numChannels;
    const instrumentsChanged = !restore || previous?.instruments.length !== store.project.instruments.length || previous?.instruments.some((s,i)=>s.synthId !== store.instrument(i)?.synthId);
    if (channelsChanged) ui.buildChannels(); else { ui.refreshAllChannels(); ui.renderPattern(); }
    if (instrumentsChanged) ui.buildInstruments(); else for (let i=0;i<store.project.instruments.length;i++) { ui.refreshInstrumentRow(i); ui.drawInstStrip(i); }
    engine.syncMixer?.();
    ui.refreshChainPanel();
    ui.refreshSoloDim();
    if (engine.ctx) engine.applySolo();
    ui.renderSequenceBar();
    const project = store.project;
    if (keepAudio) {
      sampleRestore = Promise.resolve([]);
      return;
    }
    const preparedFailures=preparedImportFailures(project);
    if(preparedFailures){sampleRestore=Promise.resolve(preparedFailures);return;}
    sampleRestore = restoreEditorSamples().then((failures) => {
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
  store.on("channels", () => engine.ensureChannelChains());
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
    for (let i = 0; i < store.project.instruments.length; i++) ui.drawInstStrip(i);
  });
  store.on("instruments", () => { engine.ensureInstrumentChains(); ui.buildInstruments(); setMidiTarget(Math.min(getMidiTarget(),store.project.instruments.length-1)); document.dispatchEvent(new CustomEvent("instrument-renamed")); });
  store.on("project", () => { if (engine.ctx) engine.syncMixer?.(); });
  persist.startCheckpoints({ idleMs: 800, maxMs: 10000 });
}

// ------------------------------------------------------------ boot
async function boot() {
  persist.restoreSettings();
  initHeader();
  initStarterLibrary();
  initSequenceBar();
  initFileOps();
  initKeyboard();
  initSubscriptions();
  trackEdits();
  ui.initLoaderModal();
  ui.initTrimModal();
  ui.initChainPanel();
  ui.initBeatsModal();
  initPianoRoll();
  initSynthPanel();
  initMidi();
  initPerformanceControls();
  initProjectLibrary({ confirmReplace });
  initPublish({ samplesReady: () => sampleRestore });
  initArrange();
  const sourceBrowser=detail=>import('./source-browser.js').then(m=>m.openSourceBrowser(detail)).catch(error=>ui.setStatus(error.message,true));
  const sampleBrowser=detail=>import('./samples-loops-browser.js').then(m=>m.openSamplesLoops(detail)).catch(error=>ui.setStatus(error.message,true));
  $('#btn-l1-audio').onclick=()=>sourceBrowser();$('#btn-l1-words').onclick=()=>sourceBrowser({mode:'words'});
  $('#btn-samples-loops').onclick=()=>sampleBrowser();
  document.addEventListener('l1xl2:library',event=>sourceBrowser(event.detail));
  document.addEventListener('audionaut:samples-loops',event=>sampleBrowser(event.detail||{}));
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
  initWorkspace();
  const bootProject = store.project;
  let restored = false;
  try { restored = await persist.restoreAutosave(); }
  catch (error) { ui.setStatus(`Browser recovery is unavailable: ${error.message}. You can load a project file.`, true); }
  if (!restored) {
    if (store.project !== bootProject || sessionState.edited) return;
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

document.addEventListener("audionaut-panic", () => {
  $("#btn-play").textContent = "▶";
  $("#btn-play").setAttribute("aria-label", "Play");
  $("#btn-play").classList.remove("active");
  ui.movePlayhead(-1);
  ui.setStatus("All notes and playback stopped.");
});
document.addEventListener("DOMContentLoaded", () => boot().catch((error) => ui.setStatus(`Could not open the workstation: ${error.message}`, true)));

// An expired membership check pauses audio and checkpoints the in-memory song.
// The outer gate retains this frame so the member can reauthenticate or export.
window.addEventListener('message', async event => {
  if(event.origin!==location.origin||event.source!==window.parent)return;
  if(event.data?.type==='audionaut-pro-export-project'){try{await persist.downloadProject();}catch(error){ui.setStatus(error.message,true);}return;}
  if(event.data?.type!=='audionaut-pro-access-expired')return;
  stopAll();
  try { await persist.checkpoint({reason:'access-expired'}); } catch {}
  ui.setStatus('Membership needs rechecking. Your project remains here; you can save a copy.',true);
});
