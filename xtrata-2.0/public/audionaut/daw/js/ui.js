// ui.js — builds and updates the DOM: channels, step grid, sequence bar, modals.

import {
  store,
  NUM_CHANNELS,
  NUM_STEPS,
  MAX_SEQUENCES,
  stepVal,
  stepObj,
  stepOff,
} from "./state.js";
import { engine } from "./engine.js";
import { Kit as PluginFaces } from "./plugin-faces/index.js";
import { loadSample, fetchAndDecode } from "./loader.js";
import { SAMPLE_LIBRARY } from "./library.js";
import { renderOrdinalChip, renderOrdinalReferences } from "./ordinal-links.js";
import { playPlaylist, stopPlaylist, isPlaylistActive } from "./playlist.js";
import { LANDMARKS } from "./song-format.js";
import {
  auditionSong,
  fetchSong,
  exportSongSession,
  openHistoricPlayer,
} from "./song-player.js";
import { BEAT_PRESETS } from "./beats.js";
import { L1_BEAT_PRESETS } from "./l1-beats.js";
import { migrateOnboardToL2 } from "./l2-sound-manifest.js";
import { TONAL_BEAT_PRESETS } from "./tonal-beats.js";
import { DRUM_BEATS_STUDIO, DRUM_BEATS_L1 } from "./percussion-kits.js";
import {
  SOUND_BY_KEY,
  FAMILY_LABELS,
  midiName,
  noteRate,
  assetKey,
} from "./onboard-catalog.js";
import { ONBOARD_MANIFEST } from "./onboard-manifest.js";
import { sustainDuration, sampleLoop } from "./onboard-library.js";
import { packSoundRow, packSoundNotice, prefetchPack } from "./pack-library.js";
import { analogBeats, ANALOG_PERSONAS } from "./analog-kits.js";
import { ANALOG_PACK_ID } from "./analog-pack.js";
import { EXPANDED_COMBINED_BEAT_PRESETS as COMBINED_BEAT_PRESETS } from "./combined-beats.js";
import { loadBeatPreset } from "./l1-beat-loader.js";
import { record as recordHistory } from "./history.js";
import { NUM_INSTRUMENTS } from "./state.js";
import { SYNTH_BANK } from "./synths.js";
import { createSynthPicker } from "./synth-picker.js";
import { openRoll } from "./pianoroll.js";
import { openSynthPanel } from "./synth-panel.js";
import {
  PLUGIN_TYPES,
  makeSlot,
  pluginDefaults,
  pluginsFor,
  pluginNames,
  normalizeOwner,
} from "./plugins.js";

const $ = (s) => document.querySelector(s);
const el = (tag, cls, text) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
};

// Icon-only buttons carry just a title; mirror it to aria-label for screen readers.
export function labelIconButtons(root = document) {
  for (const b of root.querySelectorAll("button[title]:not([aria-label])"))
    b.setAttribute("aria-label", b.title);
}

export function setStatus(msg, isError = false) {
  const s = $("#status-text");
  s.textContent = msg;
  s.classList.toggle("error", isError);
}

// ---------------------------------------------------------------- channels
const stepButtons = []; // [ch][step] -> button element

export function buildChannels() {
  const root = $("#channels");
  root.innerHTML = "";
  stepButtons.length = 0;

  for (let ch = 0; ch < store.numChannels; ch++) {
    const c = store.channel(ch);
    const row = el("div", "channel");
    row.dataset.ch = ch;
    row.style.setProperty("--ch-color", c.color);

    // --- controls block ---
    const ctrl = el("div", "channel-controls");

    const nameInput = el("input", "ch-name");
    nameInput.value = c.name;
    nameInput.spellcheck = false;
    nameInput.title = c.sampleName || "Channel name";
    nameInput.addEventListener("change", () =>
      store.setChannelProp(ch, "name", nameInput.value),
    );

    const loadBtn = el("button", "ch-btn load", "⊕");
    loadBtn.title = "Load sample";
    loadBtn.addEventListener("click", () => openLoader(ch));
    const previewBtn = el("button", "ch-btn", "▹");
    previewBtn.title = "Preview sample";
    previewBtn.addEventListener("click", () => engine.trigger(ch));

    const muteBtn = el("button", "ch-btn toggle mute", "M");
    muteBtn.title = "Mute";
    muteBtn.addEventListener("click", () => {
      store.setChannelProp(ch, "mute", !store.channel(ch).mute);
      muteBtn.classList.toggle("active", store.channel(ch).mute);
    });

    const soloBtn = el("button", "ch-btn toggle solo", "S");
    soloBtn.title = "Solo";
    soloBtn.addEventListener("click", () => {
      store.setChannelProp(ch, "solo", !store.channel(ch).solo);
      soloBtn.classList.toggle("active", store.channel(ch).solo);
    });

    const trimBtn = el("button", "ch-btn", "✂");
    trimBtn.title = "Trim / waveform";
    trimBtn.addEventListener("click", () => openTrim(ch));

    const fxBtn = el("button", "ch-btn fx fxb", "FX");
    fxBtn.title = `FX chain: ${pluginNames("fx")}`;
    fxBtn.addEventListener("click", () => openChain(ch, false, "fx"));

    const insBtn = el("button", "ch-btn fx ins", "INS");
    insBtn.title = `Insert chain: ${pluginNames("inserts")}`;
    insBtn.addEventListener("click", () => openChain(ch, false, "inserts"));
    markChainButtons(c, fxBtn, insBtn);

    const vol = el("input", "ch-vol");
    vol.type = "range";
    vol.min = 0;
    vol.max = store.project.songOrigin ? 3 : 1.5;
    vol.step = 0.01;
    vol.value = c.volume;
    vol.title = "Volume";
    vol.addEventListener("input", () => {
      store.setChannelProp(ch, "volume", +vol.value);
      engine.setChannelVolume(ch, +vol.value);
    });

    const pitch = el("input", "ch-pitch");
    pitch.type = "number";
    pitch.min = 0.1;
    pitch.max = store.project.songOrigin ? 100 : 4;
    pitch.step = 0.05;
    pitch.value = c.pitch;
    pitch.title = "Pitch / playback rate";
    pitch.addEventListener("change", () =>
      store.setChannelProp(
        ch,
        "pitch",
        Math.max(0.1, Math.min(+pitch.max, +pitch.value || 1)),
      ),
    );

    // pattern tools
    const tools = el("div", "ch-tools");
    const mk = (label, title, fn) => {
      const b = el("button", "ch-btn tiny", label);
      b.title = title;
      b.addEventListener("click", fn);
      tools.appendChild(b);
    };
    // Auto-pattern cycler (classic feature): every step → 2nd → 4th → 8th → 16th → clear.
    let patMode = 0;
    const PAT_LABELS = ["", "1/1", "1/2", "1/4", "1/8", "1/16"];
    const patBtn = el("button", "ch-btn tiny pattern", "◉");
    patBtn.title =
      "Cycle trigger pattern: all → every 2nd → 4th → 8th → 16th → clear (right-click resets)";
    patBtn.addEventListener("click", () => {
      patMode = (patMode + 1) % 6;
      store.applyAutoPattern(ch, patMode);
      patBtn.textContent = patMode ? PAT_LABELS[patMode] : "◉";
      patBtn.classList.toggle("active", patMode > 0);
    });
    patBtn.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      patMode = 0;
      store.applyAutoPattern(ch, 0);
      patBtn.textContent = "◉";
      patBtn.classList.remove("active");
    });
    tools.appendChild(patBtn);

    mk("⟲", "Shift pattern left", () => store.shiftChannelPattern(ch, -1));
    mk("⟳", "Shift pattern right", () => store.shiftChannelPattern(ch, 1));
    mk("✕", "Clear channel pattern", () => store.clearChannelPattern(ch));

    // Inscription link: a small ORD button in the control row (no line of its own).
    // The slot always exists so the sliders line up whether or not a sample has a source.
    const sourceLinks = el("span", "channel-source-links ord-wrap");
    renderOrdinalChip(sourceLinks, [
      { source: c.source, label: "Sample inscription" },
    ]);

    ctrl.append(
      nameInput,
      loadBtn,
      previewBtn,
      muteBtn,
      soloBtn,
      trimBtn,
      fxBtn,
      insBtn,
      sourceLinks,
      vol,
      pitch,
      tools,
    );

    // --- step grid ---
    const grid = el("div", "steps");
    const rowButtons = [];
    for (let s = 0; s < NUM_STEPS; s++) {
      const b = el("button", "step");
      if (s % 16 === 0) b.classList.add("bar-start");
      else if (s % 4 === 0) b.classList.add("beat-start");
      b.addEventListener("click", (e) => {
        if (e.altKey) {
          if (!stepVal(store.seq.steps[ch][s])) store.cycleStep(ch, s);
          openStepEditorInternal(ch, s);
        } else {
          store.cycleStep(ch, s, e.shiftKey);
        }
      });
      b.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        store.toggleStepReverse(ch, s); // OG-style right-click reverse
      });
      grid.appendChild(b);
      rowButtons.push(b);
    }
    stepButtons.push(rowButtons);

    // drag & drop audio files onto channel
    row.addEventListener("dragover", (e) => {
      e.preventDefault();
      row.classList.add("drop");
    });
    row.addEventListener("dragleave", () => row.classList.remove("drop"));
    row.addEventListener("drop", async (e) => {
      e.preventDefault();
      row.classList.remove("drop");
      const file = e.dataTransfer.files[0];
      if (!file) return;
      try {
        setStatus(`Loading ${file.name}…`);
        await loadSample(ch, { type: "file", file });
        refreshChannelRow(ch);
        setStatus(`Loaded ${file.name} → channel ${ch + 1}`);
      } catch (err) {
        setStatus(`Load failed: ${err.message}`, true);
      }
    });

    const controlStack = el("div", "channel-control-stack");
    controlStack.append(ctrl);
    row.append(controlStack, grid);
    root.appendChild(row);
  }
  // add/remove channel controls
  const bar = el("div", "channel-add-bar");
  const addBtn = el("button", "ch-add", "+ Add channel");
  addBtn.title = "Add a sample channel (up to 64)";
  addBtn.addEventListener("click", () => {
    if (store.addChannel()) {
      engine.ensureChannelChains?.();
      buildChannels();
      setStatus(`Channel ${store.numChannels} added.`);
    } else setStatus("Channel limit (64) reached.", true);
  });
  const remBtn = el("button", "ch-add", "− Remove last");
  remBtn.title = "Remove the last sample channel";
  remBtn.addEventListener("click", () => {
    const last = store.numChannels - 1;
    const c = store.channel(last);
    const hasContent =
      c.sampleName ||
      store.project.sequences.some((s) => s.steps[last]?.some((v) => v));
    if (
      hasContent &&
      !confirm(
        `Channel ${last + 1} has a sample or pattern data. Remove anyway?`,
      )
    )
      return;
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
  labelIconButtons(root);
}

// ---------------------------------------------------------------- instrument channels
let midiClipboard = null;
export function buildInstruments() {
  const root = $("#instruments");
  root.innerHTML = "";
  for (let i = 0; i < NUM_INSTRUMENTS; i++) {
    const instr = store.instrument(i);
    const synth = SYNTH_BANK[instr.synthId] || SYNTH_BANK.jims10;
    const row = el("div", "channel instrument");
    row.dataset.inst = i;
    row.style.setProperty("--ch-color", synth.color);

    const ctrl = el("div", "channel-controls");

    const nameInput = el("input", "ch-name");
    nameInput.value = instr.name;
    nameInput.spellcheck = false;
    nameInput.addEventListener("change", () =>
      store.setInstrumentProp(i, "name", nameInput.value),
    );

    const rollBtn = el("button", "ch-btn roll-open", "♪");
    rollBtn.title = "Open MIDI roll & synth editor";
    rollBtn.addEventListener("click", () => openRoll(i));

    const panelBtn = el("button", "ch-btn panel-open", "🎛");
    panelBtn.title = "Open the synth panel (pots, faders & pads)";
    panelBtn.hidden = !synth.ui;
    panelBtn.addEventListener("click", () => openSynthPanel(i));

    const fxBtn = el("button", "ch-btn fx fxb", "FX");
    fxBtn.title = `FX chain: ${pluginNames("fx")}`;
    fxBtn.addEventListener("click", () => openChain(i, true, "fx"));

    const insBtn = el("button", "ch-btn fx ins", "INS");
    insBtn.title = `Insert chain: ${pluginNames("inserts")}`;
    insBtn.addEventListener("click", () => openChain(i, true, "inserts"));
    markChainButtons(instr, fxBtn, insBtn);

    const previewBtn = el("button", "ch-btn", "▹");
    previewBtn.title = "Preview (C3)";
    previewBtn.addEventListener("click", () =>
      engine.triggerNote(i, 48, 1, 0, 0.4),
    );

    const muteBtn = el("button", "ch-btn toggle mute", "M");
    muteBtn.title = "Mute";
    muteBtn.classList.toggle("active", instr.mute);
    muteBtn.addEventListener("click", () => {
      store.setInstrumentProp(i, "mute", !store.instrument(i).mute);
      muteBtn.classList.toggle("active", store.instrument(i).mute);
    });

    const soloBtn = el("button", "ch-btn toggle solo", "S");
    soloBtn.title = "Solo";
    soloBtn.classList.toggle("active", instr.solo);
    soloBtn.addEventListener("click", () => {
      store.setInstrumentProp(i, "solo", !store.instrument(i).solo);
      soloBtn.classList.toggle("active", store.instrument(i).solo);
    });

    const vol = el("input", "ch-vol");
    vol.type = "range";
    vol.min = 0;
    vol.max = 1.5;
    vol.step = 0.01;
    vol.value = instr.volume;
    vol.title = "Volume";
    vol.addEventListener("input", () => {
      store.setInstrumentProp(i, "volume", +vol.value);
      engine.setInstrumentVolume(i, +vol.value);
    });

    // per-channel synth picker: any instrument channel can load any synth in the bank
    const synthSel = el("select", "inst-synth-select");
    synthSel.title = "Synth loaded on this instrument channel — pick any synth (resets its sound to that synth's default patch)";
    synthSel.setAttribute("aria-label", `Instrument ${i + 1} synth`);
    const synthPicker = createSynthPicker(synthSel, SYNTH_BANK); // folder tree: Bass, Leads, … Glass & Crystal
    synthSel.value = instr.synthId in SYNTH_BANK ? instr.synthId : "jims10";
    synthSel.addEventListener("change", () => {
      const id = synthSel.value;
      const next = SYNTH_BANK[id];
      if (!next) return;
      const prev = store.instrument(i);
      const prevDefault = SYNTH_BANK[prev.synthId]?.name;
      store.setInstrumentProp(i, "synthId", id);
      store.setInstrumentProp(i, "params", null); // the new synth starts from its own defaults
      // keep a name the user typed; follow the synth name only while it is still the default one
      if (!prev.name || prev.name === prevDefault) store.setInstrumentProp(i, "name", next.name);
      document.dispatchEvent(new CustomEvent("instrument-renamed", { detail: i }));
      setStatus(`${next.name} loaded on instrument ${i + 1}.`);
    });

    const copyBtn = el("button", "ch-btn tiny", "⧉");
    copyBtn.title = "Copy MIDI notes from this sequence";
    copyBtn.addEventListener("click", () => {
      midiClipboard = JSON.parse(JSON.stringify(store.seq.notes[i] || []));
      setStatus(
        `Copied ${midiClipboard.length} notes from ${store.instrument(i).name}.`,
      );
    });
    const pasteBtn = el("button", "ch-btn tiny", "⇪");
    pasteBtn.title = "Paste MIDI notes into this sequence";
    pasteBtn.addEventListener("click", () => {
      if (!midiClipboard) return setStatus("No MIDI notes copied yet.", true);
      store.setNotes(i, JSON.parse(JSON.stringify(midiClipboard)));
      drawInstStrip(i);
      setStatus(
        `Pasted ${midiClipboard.length} notes into ${store.instrument(i).name}.`,
      );
    });

    ctrl.append(
      nameInput,
      rollBtn,
      panelBtn,
      previewBtn,
      fxBtn,
      insBtn,
      muteBtn,
      soloBtn,
      vol,
      copyBtn,
      pasteBtn,
      synthPicker,
    );

    // mini note overview strip
    const strip = el("canvas", "inst-strip");
    strip.width = 640;
    strip.height = 24;
    strip.addEventListener("click", (e) => {
      if (!e.altKey) openRoll(i);
    });
    // Alt/Option + drag strip onto another instrument row = copy its MIDI notes there
    strip.addEventListener("mousedown", (e) => {
      if (!e.altKey) return;
      e.preventDefault();
      const srcNotes = JSON.parse(JSON.stringify(store.seq.notes[i] || []));
      if (!srcNotes.length)
        return setStatus("No notes to copy on this instrument.", true);
      document.body.classList.add("midi-dragging");
      const over = (ev) => {
        document.querySelectorAll(".channel.instrument").forEach((r) => {
          r.classList.toggle("drop", r.contains(ev.target));
        });
      };
      const up = (ev) => {
        document.removeEventListener("mousemove", over);
        document.removeEventListener("mouseup", up);
        document.body.classList.remove("midi-dragging");
        document
          .querySelectorAll(".channel.instrument")
          .forEach((r) => r.classList.remove("drop"));
        const targetRow = ev.target.closest?.(".channel.instrument");
        if (!targetRow) return;
        const dest = +targetRow.dataset.inst;
        if (dest === i) return;
        store.setNotes(dest, srcNotes);
        drawInstStrip(dest);
        setStatus(
          `Copied ${srcNotes.length} notes: ${store.instrument(i).name} → ${store.instrument(dest).name}.`,
        );
      };
      document.addEventListener("mousemove", over);
      document.addEventListener("mouseup", up);
    });
    row.append(ctrl, strip);
    root.appendChild(row);
    drawInstStrip(i);
  }
  labelIconButtons(root);
}

export function drawInstStrip(i) {
  const strip = document.querySelector(
    `.channel.instrument[data-inst="${i}"] .inst-strip`,
  );
  if (!strip) return;
  const c = strip.getContext("2d");
  const synth = SYNTH_BANK[store.instrument(i).synthId] || SYNTH_BANK.jims10;
  c.clearRect(0, 0, strip.width, strip.height);
  c.fillStyle = "#121820";
  c.fillRect(0, 0, strip.width, strip.height);
  for (let s = 0; s < 4; s++) {
    c.fillStyle = "#26303d";
    c.fillRect((s * strip.width) / 4, 0, 1, strip.height);
  }
  const notes = store.seq.notes?.[i] || [];
  if (!notes.length) return;
  const pitches = notes.map((n) => n.pitch);
  const lo = Math.min(...pitches),
    hi = Math.max(...pitches, lo + 1);
  c.fillStyle = synth.color;
  const cw = strip.width / 64;
  for (const n of notes) {
    const y =
      strip.height - 3 - ((n.pitch - lo) / (hi - lo)) * (strip.height - 6);
    c.fillRect(n.step * cw, y, Math.max(2, n.dur * cw - 1), 3);
  }
}

// Dim every row that solo is currently silencing (samples and synths alike).
export function refreshSoloDim() {
  const any = engine.anySolo();
  document.querySelectorAll("#channels .channel").forEach((row) => {
    const c = store.channel(+row.dataset.ch);
    row.classList.toggle("solo-dim", !!c && any && !c.solo);
  });
  document.querySelectorAll(".channel.instrument").forEach((row) => {
    const s = store.instrument(+row.dataset.inst);
    row.classList.toggle("solo-dim", !!s && any && !s.solo);
  });
}

export function refreshInstrumentRow(i) {
  const row = document.querySelector(`.channel.instrument[data-inst="${i}"]`);
  if (!row) return;
  const instr = store.instrument(i);
  const synth = SYNTH_BANK[instr.synthId] || SYNTH_BANK.jims10;
  row.style.setProperty("--ch-color", synth.color);
  row.querySelector(".ch-name").value = instr.name;
  const ss = row.querySelector(".inst-synth-select");
  if (ss && ss.value !== instr.synthId && instr.synthId in SYNTH_BANK) ss.value = instr.synthId;
  markChainButtons(instr, row.querySelector(".fxb"), row.querySelector(".ins"));
  const pb = row.querySelector(".panel-open");
  if (pb) pb.hidden = !synth.ui;
  drawInstStrip(i);
}

export function refreshChannelRow(ch) {
  const row = $(`#channels .channel[data-ch="${ch}"]`);
  if (!row) return;
  const c = store.channel(ch);
  renderOrdinalChip(row.querySelector(".channel-source-links"), [
    { source: c.source, label: "Sample inscription" },
  ]);
  row.querySelector(".ch-name").value = c.name;
  row.querySelector(".ch-name").title = c.sampleName || "Channel name";
  row.classList.toggle("unresolved-source", !!c.unresolvedSource);
  let clipInfo = row.querySelector(".channel-clip-info");
  if (c.clipSnapshot) {
    if (!clipInfo) {
      clipInfo = el("div", "channel-clip-info");
      row.append(clipInfo);
    }
    clipInfo.replaceChildren();
    const info = el(
      "span",
      null,
      `${c.clipSnapshot.clip.title} · pinned clip · ${c.clipSnapshot.playback.start.toFixed(4)}–${c.clipSnapshot.playback.end.toFixed(4)} s${c.unresolvedSource ? ` · Audio unresolved: ${c.unresolvedSource.message}` : ""}`,
    );
    const browse = el("button", "mini", "Samples & Loops");
    browse.onclick = () =>
      document.dispatchEvent(
        new CustomEvent("audionaut:samples-loops", { detail: { ch } }),
      );
    clipInfo.append(info, browse);
  } else clipInfo?.remove();
  row.querySelector(".ch-vol").value = c.volume;
  row.querySelector(".ch-pitch").value = c.pitch;
  row.querySelector(".mute").classList.toggle("active", c.mute);
  row.querySelector(".solo").classList.toggle("active", c.solo);
  row.classList.toggle("has-sample", !!c.sampleName);
  markChainButtons(c, row.querySelector(".fxb"), row.querySelector(".ins"));
}

export function refreshAllChannels() {
  for (let ch = 0; ch < store.numChannels; ch++) refreshChannelRow(ch);
  refreshSoloDim();
}

// ---------------------------------------------------------------- pattern
const STEP_HINT = "Click to toggle · Shift-click accent · Alt-click edit";
function paintStep(b, raw) {
  const v = stepVal(raw);
  const o = stepObj(raw);
  b.classList.toggle("on", v === 1);
  b.classList.toggle("accent", v === 2);
  b.classList.toggle("rev", !!o?.rev);
  b.classList.toggle(
    "edited",
    !!o && (o.trimStart != null || o.trimEnd != null || o.pitch != null),
  );
  // offset marker: a tick inside the step showing where in the step the hit lands
  const off = stepOff(raw);
  const offKey = off > 0 ? off.toFixed(3) : "";
  if (b._off !== offKey) {
    b._off = offKey;
    b.classList.toggle("offs", off > 0);
    if (off > 0) b.style.setProperty("--off", offKey);
    else b.style.removeProperty("--off");
  }
  const offText =
    off > 0
      ? ` · offset +${off.toFixed(2)} step (${Math.round((off * 15000) / store.project.bpm)} ms)`
      : "";
  const title =
    (o?.sampleMidi != null
      ? `${midiName(o.sampleMidi)}${o.gateSteps ? ` · sustain ${o.gateSteps} steps` : ""} · Alt-click to edit`
      : o?.wordSelection?.text
        ? `${o.wordSelection.text} · ${o.wordSelection.start.toFixed(3)}–${o.wordSelection.end.toFixed(3)}s · Alt-click to edit`
        : o?.rev
          ? "Reversed step (right-click to toggle, alt-click to edit)"
          : STEP_HINT) + offText;
  if (b.title !== title) b.title = title; // avoid 1,000+ redundant DOM writes per repaint
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
function openStepEditorInternal(ch, s) {
  openStepEditor(ch, s);
}

let lastPlayheadStep = -1,
  lcdPos = null;
export function movePlayhead(step) {
  if (lastPlayheadStep >= 0) {
    for (let ch = 0; ch < stepButtons.length; ch++)
      stepButtons[ch][lastPlayheadStep].classList.remove("playing");
  }
  if (step >= 0) {
    for (let ch = 0; ch < stepButtons.length; ch++)
      stepButtons[ch][step].classList.add("playing");
    (lcdPos ||= $("#lcd-pos")).textContent =
      `${Math.floor(step / 16) + 1}.${Math.floor((step % 16) / 4) + 1}`;
  }
  lastPlayheadStep = step;
}

// ---------------------------------------------------------------- sequences
export function renderSequenceBar() {
  const slots = $("#seq-slots");
  slots.innerHTML = "";
  const n = Math.min(store.project.sequences.length + 1, MAX_SEQUENCES);
  for (let i = 0; i < n; i++) {
    const exists = i < store.project.sequences.length;
    const b = el("button", "seq-slot", exists ? String(i + 1) : "+");
    if (i === store.project.currentSequence) b.classList.add("current");
    if (exists && !engine._isEmpty(store.project.sequences[i]))
      b.classList.add("filled");
    b.title = exists ? `Sequence ${i + 1}` : "Add sequence";
    b.addEventListener("click", () => store.selectSequence(i));
    slots.appendChild(b);
  }
  labelIconButtons(slots);
  $("#lcd-seq").textContent = String(
    store.project.currentSequence + 1,
  ).padStart(2, "0");
}

// ---------------------------------------------------------------- modals
let loaderChannel = 0;
let activeTab = "library";
let libraryAuditionTicket = 0;
let libraryMigration = null;

export function openLoader(ch) {
  loaderChannel = ch;
  $("#loader-channel-label").textContent = `→ Channel ${ch + 1}`;
  $("#modal-loader").classList.remove("hidden");
  $("#modal-loader .modal-box").scrollTop = 0;
}

export function openLibraryItem(id, ch = 0) {
  openLoader(ch);
  $("#library-search").value = "";
  $('#modal-loader [data-tab="library"]').click();
  const category = SAMPLE_LIBRARY.findIndex((c) =>
    c.items.some((item) => item.id === id),
  );
  if (category < 0) return;
  $("#library-category").value = category;
  populateLibrarySamples();
  $("#library-sample").value = SAMPLE_LIBRARY[category].items.findIndex(
    (item) => item.id === id,
  );
  syncLibrarySelection();
}

// --- library tab ---
function libStatus(msg, isError = false) {
  const el2 = $("#library-status");
  el2.textContent = msg;
  el2.classList.toggle("error", isError);
}

function currentLibrarySelection() {
  const cat = SAMPLE_LIBRARY[+$("#library-category").value || 0];
  const item =
    $("#library-sample").selectedIndex < 0
      ? null
      : cat.items[+$("#library-sample").value];
  return item ? { cat, item } : null;
}

function populateLibrarySamples() {
  engine.stopPreview();
  const cat = SAMPLE_LIBRARY[+$("#library-category").value || 0];
  const sel = $("#library-sample");
  sel.innerHTML = "";
  const query = ($("#library-search").value || "").toLowerCase().trim();
  cat.items.forEach((item, i) => {
    if (
      query &&
      !`${item.label} ${item.folder || ""} ${SOUND_BY_KEY[item.id]?.tags.join(" ") || ""}`
        .toLowerCase()
        .includes(query)
    )
      return;
    const o = document.createElement("option");
    o.value = i;
    o.textContent =
      item.label +
      (LANDMARKS[item.id]?.kind ? ` · ${LANDMARKS[item.id].kind}` : "");
    sel.appendChild(o);
  });
  sel.selectedIndex = 0;
  syncLibrarySelection();
}

function syncLibrarySelection() {
  libraryAuditionTicket++;
  engine.stopPreview();
  const sound = SOUND_BY_KEY[currentLibrarySelection()?.item.id];
  updatePackInfo(currentLibrarySelection()?.item);
  $("#library-onboard").hidden = !sound;
  if (sound) {
    $("#library-root").replaceChildren(
      ...(sound.roots.length ? sound.roots : [null]).map(
        (root) => new Option(midiName(root), root ?? ""),
      ),
    );
    $("#library-root").value = sound.rootMidi ?? "";
    $("#library-velocity").replaceChildren(
      ...sound.velocities.map(
        (v) => new Option(v === 1 ? "Bright / full" : "Soft", v),
      ),
    );
    $("#library-velocity").value = 1;
    updateSoundInfo();
  }
  const landmark = LANDMARKS[currentLibrarySelection()?.item.id];
  const item = currentLibrarySelection()?.item;
  $("#library-song-sources").hidden = landmark?.kind !== "song";
  $("#library-song-sources").open = false;
  $("#library-song-ordinal-links").replaceChildren();
  $("#library-show-song-sources").hidden = false;
  renderOrdinalReferences($("#library-ordinal-links"), [
    {
      source: { type: item?.type || "ordinal", value: item?.id },
      label:
        landmark?.kind === "song"
          ? "Song inscription"
          : landmark
            ? "Application inscription"
            : "Sample inscription",
    },
    { id: landmark?.data, label: "Song instructions" },
    { id: landmark?.engine, label: "Original engine" },
  ]);
  $("#library-export-song").hidden = landmark?.kind !== "song";
  $("#loader-load").disabled = activeTab === "library" && !!landmark;
  if (landmark)
    libStatus(
      landmark.kind === "song"
        ? "Song instructions: Audition plays the arrangement. Export song session saves its channels, steps and settings for the project Load button."
        : "Historic application: Audition opens its original player. It cannot be loaded as one audio sample.",
    );
  else libStatus("Choose an audio sample to audition or load.");
}

function librarySource(item) {
  const sound = SOUND_BY_KEY[item.id];
  return {
    type: item.type || "ordinal",
    value: item.id,
    label: item.label,
    ...(sound && {
      rootMidi: sound.rootMidi == null ? null : +$("#library-root").value,
      velocityLayer: +$("#library-velocity").value,
    }),
  };
}
// Licence, credit and root note for a FLAC pack sound. Attribution and the unverified
// warning are shown every time, because the audio carries them but the UI should too.
function updatePackInfo(item) {
  const box = $("#library-pack-info");
  if (!box) return;
  box.hidden = item?.type !== "pack";
  if (box.hidden) return;
  try {
    const row = packSoundRow(item.id);
    $("#library-pack-meta").textContent =
      `${row.rootMidi == null ? "Unpitched" : midiName(row.rootMidi)} · ${row.folder} · ${row.duration.toFixed(2)}s · mono 44.1 kHz FLAC (lossless)`;
    $("#library-pack-licence").textContent = packSoundNotice(item.id);
    box.classList.toggle("warn", row.pack.tier === "unverified");
  } catch (e) {
    $("#library-pack-meta").textContent = e.message;
    $("#library-pack-licence").textContent = "";
  }
}
function updateSoundInfo() {
  const sound = SOUND_BY_KEY[currentLibrarySelection()?.item.id];
  if (!sound) return;
  const root = sound.rootMidi == null ? null : +$("#library-root").value,
    v = +$("#library-velocity").value,
    m = ONBOARD_MANIFEST.assets[assetKey(sound, root, v)];
  $("#library-sound-meta").textContent =
    `${midiName(root)} · ${sound.tags.filter((t) => !["mono", "stereo"].includes(t)).join(" · ")} · ${m?.duration.toFixed(2)}s · ${m?.channels === 2 ? "stereo" : "mono"} · ${m?.headroomDb.toFixed(1)} dB headroom · v${sound.version} · Local embedded audio`;
  $("#library-pack").href = `daw/media/onboard-v2/${sound.family}.json`;
  $("#library-pack").textContent =
    `Download family bank (${(ONBOARD_MANIFEST.families[sound.family].packBytes / 1024 / 1024).toFixed(1)} MB)`;
}
function initLibraryTab() {
  $("#library-l2-migrate").onclick = () => $("#library-l2-file").click();
  $("#library-l2-file").onchange = async () => {
    libraryMigration?.abort();
    const controller = new AbortController();
    libraryMigration = controller;
    try {
      const file = $("#library-l2-file").files[0];
      if (!file) return;
      if (file.size > 2 * 1024 * 1024)
        throw new Error("Choose a manifest smaller than 2 MB.");
      const count = await migrateOnboardToL2(JSON.parse(await file.text()), {
        signal: controller.signal,
        onProgress: (n, total) =>
          libraryMigration === controller &&
          libStatus(`Verifying L2 audio ${n}/${total}…`),
      });
      if (libraryMigration !== controller) return;
      libStatus(
        `Verified manifest; migrated ${count} matching channels to L2. Notes, regions and steps were retained.`,
      );
    } catch (e) {
      if (libraryMigration === controller) libStatus(e.message, true);
    } finally {
      if (libraryMigration === controller) libraryMigration = null;
      $("#library-l2-file").value = "";
    }
  };
  $("#library-search").addEventListener("input", populateLibrarySamples);
  for (const id of ["#library-root", "#library-velocity"])
    $(id).addEventListener("change", () => {
      libraryAuditionTicket++;
      engine.stopPreview();
      updateSoundInfo();
    });
  const queueOwner = {};
  $("#library-play-all").onclick = () => {
    if (isPlaylistActive(queueOwner)) {
      stopPlaylist();
      return;
    }
    const category = SAMPLE_LIBRARY[+$("#library-category").value || 0];
    playPlaylist(
      Array.from(
        $("#library-sample").options,
        (option) => category.items[+option.value],
      ).map((item) => ({
        label: item.label,
        source: { type: item.type || "ordinal", value: item.id },
      })),
      {
        owner: queueOwner,
        status: libStatus,
        state: (active) => {
          $("#library-play-all").textContent = active
            ? "■ Stop all"
            : "▶ Play all";
          $("#library-play-all").setAttribute("aria-pressed", String(active));
        },
      },
    );
  };
  $("#library-show-song-sources").onclick = async () => {
    const selected = currentLibrarySelection()?.item;
    if (LANDMARKS[selected?.id]?.kind !== "song") return;
    try {
      const song = await fetchSong(selected.id);
      if (currentLibrarySelection()?.item.id !== selected.id) return;
      renderOrdinalReferences(
        $("#library-song-ordinal-links"),
        song.channels.map((channel, i) => ({
          source: channel.source,
          label: `Channel ${i + 1} · ${channel.name}`,
        })),
      );
      $("#library-show-song-sources").hidden = true;
    } catch (error) {
      libStatus(error.message, true);
    }
  };
  $("#library-sample").addEventListener("change", syncLibrarySelection);
  $("#library-export-song").addEventListener("click", async () => {
    const selected = currentLibrarySelection();
    if (!selected || LANDMARKS[selected.item.id]?.kind !== "song") return;
    try {
      libStatus("Reading song instructions…");
      const song = await exportSongSession(selected.item.id);
      libStatus(
        `Exported “${song.projectName}” · ${song.channels.length} channels · ${song.sequences.length} sequences. Use project Load to open it. Your current session is unchanged.`,
      );
    } catch (e) {
      libStatus(e.message, true);
    }
  });
  const catSel = $("#library-category");
  SAMPLE_LIBRARY.forEach((cat, i) => {
    const o = document.createElement("option");
    o.value = i;
    o.textContent = cat.category;
    catSel.appendChild(o);
  });
  catSel.value = SAMPLE_LIBRARY.findIndex((c) =>
    c.category.startsWith("Onboard · Studio kit"),
  );
  catSel.addEventListener("change", populateLibrarySamples);
  populateLibrarySamples();

  const audition = async () => {
    const ticket = ++libraryAuditionTicket;
    const sel = currentLibrarySelection();
    if (!sel) return;
    const landmark = LANDMARKS[sel.item.id];
    if (landmark && landmark.kind !== "song") {
      openHistoricPlayer(sel.item.id, $('[data-pane="library"]'), libStatus);
      return;
    }
    try {
      if (landmark?.kind === "song") {
        await auditionSong(sel.item.id, libStatus);
        return;
      }
      engine.stopPreview();
      libStatus(`Fetching ${sel.item.label}…`);
      const { audioBuffer } = await fetchAndDecode(librarySource(sel.item));
      if (ticket !== libraryAuditionTicket) return;
      engine.playBuffer(audioBuffer, 0, Math.min(30, audioBuffer.duration));
      libStatus(
        `Playing "${sel.item.label}" (${audioBuffer.duration.toFixed(2)}s)`,
      );
    } catch (e) {
      libStatus(`✗ ${sel.item.label}: ${e.message}`, true);
    }
  };
  $("#library-audition").addEventListener("click", audition);
  $("#library-sample").addEventListener("dblclick", audition);
  $("#library-stop").addEventListener("click", () => {
    libraryAuditionTicket++;
    engine.stopPreview();
    libStatus("Audition stopped.");
  });

  // Health check: fetch & decode every sample in the selected category.
  $("#library-test").addEventListener("click", async () => {
    const cat = SAMPLE_LIBRARY[+catSel.value || 0];
    let pass = 0;
    const fails = [];
    for (let i = 0; i < cat.items.length; i++) {
      const it = cat.items[i];
      libStatus(`Testing ${i + 1}/${cat.items.length}: ${it.label}…`);
      try {
        const kind = LANDMARKS[it.id]?.kind;
        if (kind === "song") await fetchSong(it.id);
        else if (kind) {
          continue;
        } else
          await fetchAndDecode({ type: it.type || "ordinal", value: it.id });
        pass++;
      } catch (e) {
        fails.push(`${it.label} (${e.message})`);
      }
    }
    libStatus(
      fails.length
        ? `✓ ${pass} audio/song checks passed. Failed: ${fails.join("; ")}`
        : `✓ ${pass} audio/song checks passed. Historic applications are opened through Audition.`,
      fails.length > 0,
    );
  });
}

export function initLoaderModal() {
  initLibraryTab();
  $("#input-url").addEventListener("input", () =>
    renderOrdinalReferences($("#input-url-ordinal-links"), [
      {
        source: { type: "url", value: $("#input-url").value },
        label: "Inscription",
      },
    ]),
  );
  const ordinalInput = $("#input-ordinal");
  ordinalInput.addEventListener("input", () =>
    renderOrdinalReferences($("#input-ordinal-links"), [
      {
        source: { type: "ordinal", value: ordinalInput.value },
        label: "Inscription",
      },
    ]),
  );
  document.querySelectorAll("#modal-loader .tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      activeTab = tab.dataset.tab;
      syncLibrarySelection();
      document
        .querySelectorAll("#modal-loader .tab")
        .forEach((t) => t.classList.toggle("active", t === tab));
      document
        .querySelectorAll("#modal-loader .tab-pane")
        .forEach((p) =>
          p.classList.toggle("hidden", p.dataset.pane !== activeTab),
        );
    });
  });
  $("#loader-cancel").addEventListener("click", () => {
    libraryMigration?.abort();
    libraryAuditionTicket++;
    engine.stopPreview();
    $("#modal-loader").classList.add("hidden");
  });
  $("#loader-load").addEventListener("click", async () => {
    let source;
    if (activeTab === "library") {
      const sel = currentLibrarySelection();
      if (!sel) return setStatus("Select a sample first", true);
      if (LANDMARKS[sel.item.id])
        return libStatus(
          "This is a song or application. Use Audition or Export song session.",
          true,
        );
      engine.stopPreview();
      source = librarySource(sel.item);
    } else if (activeTab === "file") {
      const file = $("#input-file").files[0];
      if (!file) return setStatus("Choose a file first", true);
      source = { type: "file", file };
    } else {
      const value = $(`#input-${activeTab}`).value.trim();
      if (!value) return setStatus("Enter an ID or URL first", true);
      source = { type: activeTab, value };
    }
    $("#modal-loader").classList.add("hidden");
    try {
      setStatus(`Loading sample for channel ${loaderChannel + 1}…`);
      const name = await loadSample(loaderChannel, source);
      if (source.label) {
        store.setChannelProp(loaderChannel, "sampleName", source.label);
        store.setChannelProp(loaderChannel, "name", source.label.slice(0, 24));
      }
      refreshChannelRow(loaderChannel);
      setStatus(
        `Loaded "${source.label || name}" → channel ${loaderChannel + 1}`,
      );
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
    return {
      trimStart: c.trimStart,
      trimEnd: c.trimEnd,
      rev: !!c.reverse,
      pitch: c.pitch,
      gateSteps: c.gateSteps || 0,
      sampleMidi: c.sampleMidi,
    };
  }
  const raw = store.seq.steps[editorScope.ch][editorScope.step];
  const o = raw && typeof raw === "object" ? raw : {};
  return {
    trimStart: o.trimStart ?? c.trimStart,
    trimEnd: o.trimEnd ?? c.trimEnd,
    rev: o.rev ?? !!c.reverse,
    pitch: o.pitch ?? c.pitch,
    xfade: o.xfade ?? 0,
    gateSteps: o.gateSteps ?? c.gateSteps ?? 0,
    sampleMidi: o.sampleMidi ?? c.sampleMidi,
  };
}

function editorApply(p) {
  const { ch, step } = editorScope;
  if (step == null) {
    store.setChannelProp(ch, "trimStart", p.trimStart);
    store.setChannelProp(ch, "trimEnd", p.trimEnd);
    store.setChannelProp(ch, "reverse", p.rev);
    store.setChannelProp(ch, "pitch", p.pitch);
    if (p.gateSteps != null) store.setChannelProp(ch, "gateSteps", p.gateSteps);
    if (p.sampleMidi != null)
      store.setChannelProp(ch, "sampleMidi", p.sampleMidi);
    refreshChannelRow(ch);
  } else {
    store.setStepProps(ch, step, {
      trimStart: p.trimStart,
      trimEnd: p.trimEnd,
      rev: p.rev,
      pitch: p.pitch,
      xfade: p.xfade,
      ...(p.gateSteps != null && { gateSteps: p.gateSteps }),
      ...(p.sampleMidi != null && { sampleMidi: p.sampleMidi }),
    });
    updateStep(ch, step, store.seq.steps[ch][step]);
  }
}

function drawWaveform(playFrac = -1) {
  const canvas = $("#trim-canvas");
  const ctx2d = canvas.getContext("2d");
  const { width: W, height: H } = canvas;
  const ch = editorScope.ch;
  const p = editorParams();
  ctx2d.clearRect(0, 0, W, H);
  ctx2d.fillStyle = "#0b0f14";
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
      let min = 1,
        max = -1;
      for (let i = xi * step, e = Math.min(i + step, data.length); i < e; i++) {
        if (data[i] < min) min = data[i];
        if (data[i] > max) max = data[i];
      }
      ctx2d.moveTo(x + 0.5, ((1 + min) * H) / 2);
      ctx2d.lineTo(x + 0.5, ((1 + max) * H) / 2);
    }
    ctx2d.stroke();
  } else {
    ctx2d.fillStyle = "#39424e";
    ctx2d.font = '14px "IBM Plex Mono", monospace';
    ctx2d.fillText("No sample loaded", 20, H / 2);
  }
  // trim window (displayed in playback orientation)
  const s = p.rev ? 1 - p.trimEnd : p.trimStart;
  const e = p.rev ? 1 - p.trimStart : p.trimEnd;
  ctx2d.fillStyle = "rgba(0,0,0,0.65)";
  ctx2d.fillRect(0, 0, s * W, H);
  ctx2d.fillRect(e * W, 0, W - e * W, H);
  ctx2d.fillStyle = "#ffffff";
  ctx2d.fillRect(s * W - 1, 0, 2, H);
  ctx2d.fillRect(e * W - 1, 0, 2, H);
  // playhead
  if (playFrac >= 0) {
    const x = (s + (e - s) * playFrac) * W;
    ctx2d.fillStyle = "#43ffa4";
    ctx2d.fillRect(x - 1, 0, 2, H);
  }
}

function trimStopPlayback() {
  if (trimPlaying) {
    cancelAnimationFrame(trimPlaying.raf);
    try {
      trimPlaying.src.stop();
    } catch {
      /* ended */
    }
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
  const regionSec = Math.max(
    0.001,
    (p.trimEnd - p.trimStart) * buffer.duration,
  );
  const sustain = sustainDuration(
    store.channel(ch),
    p,
    buffer,
    store.project.bpm,
  );
  const durSec = sustain ?? regionSec / p.pitch; // audible duration after pitch
  const startedAt = engine.ctx.currentTime;
  if (sustain) {
    src.loop = true;
    src.loopStart = sampleLoop(store.channel(ch)).start;
    src.loopEnd = sampleLoop(store.channel(ch)).end;
    src.start(startedAt, start);
    src.stop(startedAt + durSec);
  } else src.start(startedAt, start, regionSec);
  trimPlaying = { src, startedAt, durSec, raf: 0 };
  src.onended = () => {
    if (trimPlaying?.src === src) {
      trimPlaying = null;
      drawWaveform();
    }
  };
  const tick = () => {
    if (!trimPlaying) return;
    const frac = (engine.ctx.currentTime - startedAt) / durSec;
    if (frac >= 1) {
      trimPlaying = null;
      drawWaveform();
      return;
    }
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
  renderOrdinalReferences($("#trim-ordinal-links"), [
    { source: c.source, label: "Sample inscription" },
  ]);
  $("#trim-channel-label").textContent =
    step == null
      ? `— ${c.name} (channel defaults)`
      : `— ${c.name} · step ${step + 1}`;
  $("#trim-scope").textContent =
    step == null
      ? "Editing channel defaults (used by steps without overrides)"
      : "Editing THIS STEP only — overrides channel settings";
  $("#trim-reset-step").style.display = step == null ? "none" : "";
  $("#trim-start").value = Math.round(p.trimStart * 1000);
  $("#trim-end").value = Math.round(p.trimEnd * 1000);
  $("#trim-reverse").checked = p.rev;
  $("#trim-pitch").max = store.project.songOrigin ? 100 : 4;
  $("#trim-pitch").value = p.pitch;
  const root = c.soundMetadata?.rootMidi;
  $("#trim-note-wrap").hidden = root == null;
  $("#trim-gate-wrap").hidden = !sampleLoop(c);
  $("#trim-gate").value = p.gateSteps || 0;
  $("#trim-note").replaceChildren();
  if (root != null) {
    for (let n = Math.max(0, root - 24); n <= Math.min(127, root + 24); n++)
      $("#trim-note").append(new Option(midiName(n), n));
    $("#trim-note").value = Math.round(root + 12 * Math.log2(p.pitch));
  }
  $("#trim-note-meta").textContent =
    root == null
      ? ""
      : `Root ${midiName(root)} · ${p.pitch.toFixed(3)}× · notes change playback length${c.soundMetadata?.voicing ? " · whole chord transposes" : ""}`;
  $("#trim-xfade").value = p.xfade || 0;
  $("#trim-xfade-wrap").style.display = step == null ? "none" : "";
  const duration = engine.buffers[ch]?.duration || 0;
  $("#trim-start-seconds").value = String(p.trimStart * duration);
  $("#trim-end-seconds").value = String(p.trimEnd * duration);
  $("#modal-trim").classList.remove("hidden");
  drawWaveform();
}

export function openStepEditor(ch, step) {
  openTrim(ch, step);
}

export function initTrimModal() {
  $("#trim-note").addEventListener("change", () => {
    const p = editorParams(),
      root = store.channel(editorScope.ch).soundMetadata?.rootMidi;
    if (root == null) return;
    p.sampleMidi = +$("#trim-note").value;
    p.pitch = noteRate(p.sampleMidi, root);
    editorApply(p);
    openTrim(editorScope.ch, editorScope.step);
  });
  $("#trim-gate").addEventListener("change", () => {
    const p = editorParams();
    p.gateSteps = +$("#trim-gate").value;
    editorApply(p);
    drawWaveform();
  });
  const apply = () => {
    const current = editorParams();
    // Slider rounding must not change a short word when pitch/reverse is edited.
    let s = current.trimStart;
    let e = current.trimEnd;
    editorApply({
      trimStart: s,
      trimEnd: e,
      rev: $("#trim-reverse").checked,
      pitch: Math.max(
        0.1,
        Math.min(
          store.project.songOrigin ? 100 : 4,
          +$("#trim-pitch").value || 1,
        ),
      ),
      xfade: Math.max(0, Math.min(2000, +$("#trim-xfade").value || 0)),
      gateSteps: current.gateSteps,
      ...(store.channel(editorScope.ch).soundMetadata?.rootMidi != null && {
        sampleMidi: Math.round(
          store.channel(editorScope.ch).soundMetadata.rootMidi +
            12 * Math.log2(+$("#trim-pitch").value || 1),
        ),
      }),
    });
    drawWaveform();
  };
  ["#trim-reverse", "#trim-pitch", "#trim-xfade"].forEach((sel) =>
    $(sel).addEventListener("input", apply),
  );
  for (const [sel, key] of [
    ["#trim-start", "trimStart"],
    ["#trim-end", "trimEnd"],
  ])
    $(sel).addEventListener("input", () => {
      const p = editorParams();
      p[key] = +$(sel).value / 1000;
      p.trimStart = Math.min(p.trimStart, p.trimEnd - 1e-7);
      p.trimEnd = Math.max(p.trimEnd, p.trimStart + 1e-7);
      editorApply(p);
      openTrim(editorScope.ch, editorScope.step);
    });
  for (const [sel, key] of [
    ["#trim-start-seconds", "trimStart"],
    ["#trim-end-seconds", "trimEnd"],
  ])
    $(sel).addEventListener("change", () => {
      const duration = engine.buffers[editorScope.ch]?.duration;
      if (!duration) return;
      const value = $(sel).valueAsNumber,
        p = editorParams();
      if (!Number.isFinite(value) || value < 0 || value > duration)
        return setStatus("Choose a time within the sample.", true);
      p[key] = value / duration;
      if (p.trimEnd <= p.trimStart)
        return setStatus("End time must be later than start time.", true);
      editorApply(p);
      openTrim(editorScope.ch, editorScope.step);
    });
  $("#trim-words").onclick = () => {
    trimStopPlayback();
    $("#modal-trim").classList.add("hidden");
    document.dispatchEvent(
      new CustomEvent("l1xl2:library", {
        detail: { ...editorScope, mode: "words" },
      }),
    );
  };
  $("#trim-tools").onclick = () => {
    trimStopPlayback();
    $("#modal-trim").classList.add("hidden");
    document.dispatchEvent(
      new CustomEvent("l1xl2:tools", { detail: { ...editorScope } }),
    );
  };
  $("#trim-play").addEventListener("click", trimStartPlayback);
  $("#trim-stop").addEventListener("click", trimStopPlayback);
  $("#trim-reset-step").addEventListener("click", () => {
    const { ch, step } = editorScope;
    if (step == null) return;
    const raw = store.seq.steps[ch][step];
    const v = raw && typeof raw === "object" ? raw.v || 1 : raw || 1;
    store.setStep(ch, step, v); // strip overrides, keep on/accent state
    openTrim(ch, step);
    setStatus(`Step ${step + 1} reset to channel settings.`);
  });
  $("#trim-close").addEventListener("click", () => {
    trimStopPlayback();
    $("#modal-trim").classList.add("hidden");
  });
}

// --- plugin chain panel (INS and FX buttons) ---
// One panel, two chains. Both are ordered lists of plugin slots from plugins.js:
// add from a grouped list, bypass, reorder (drag or arrows), expand for knobs, remove.

// Channel- or instrument-aware accessors.
const ownerOf = (isInst, i) => (isInst ? store.instrument(i) : store.channel(i));
const setOwnerProp = (isInst, i, prop, v) =>
  isInst ? store.setInstrumentProp(i, prop, v) : store.setChannelProp(i, prop, v);
const refreshOwnerRow = (isInst, i) =>
  isInst ? refreshInstrumentRow(i) : refreshChannelRow(i);

// Light the FX / INS buttons when their chain has an active plugin.
function markChainButtons(owner, fxBtn, insBtn) {
  if (!owner) return;
  if (!Array.isArray(owner.fx) || !Array.isArray(owner.inserts)) normalizeOwner(owner);
  const live = (arr) => (arr || []).filter((s) => s?.enabled).length;
  const nFx = live(owner.fx);
  const nIns = live(owner.inserts);
  fxBtn?.classList.toggle("has-fx", nFx > 0);
  insBtn?.classList.toggle("has-inserts", nIns > 0);
  if (fxBtn) fxBtn.dataset.count = nFx || "";
  if (insBtn) insBtn.dataset.count = nIns || "";
}

const chain = { idx: 0, isInst: false, kind: "inserts", open: new Set(), drag: null };
const CHAIN_LABEL = { inserts: "insert", fx: "FX" };

const chainOwner = () => ownerOf(chain.isInst, chain.idx);
const chainSlots = (kind = chain.kind) => {
  const o = chainOwner();
  if (!Array.isArray(o.fx) || !Array.isArray(o.inserts)) normalizeOwner(o);
  return o[kind];
};

// Every structural change goes through here: new array → store (undoable) → engine.
function commitChain(arr, kind = chain.kind) {
  setOwnerProp(chain.isInst, chain.idx, kind, arr);
  engine.syncChain(chain.idx, chain.isInst);
  renderChain();
  refreshOwnerRow(chain.isInst, chain.idx);
}

// ---- plugin faces: a pop-out front panel for models that have one (js/plugin-faces/) ----
let faceH = null; // { dispose, id, idx, isInst, subs:Set }
function closePluginFace() {
  if (!faceH) return;
  const f = faceH;
  faceH = null;
  f.dispose();
  engine.releaseSlotTaps(f.idx, f.isInst, f.id);
  $("#modal-plugin-face")?.classList.add("hidden");
}
function openPluginFace(slotId) {
  const idx = chain.idx;
  const isInst = chain.isInst;
  const find = () => ownerOf(isInst, idx)?.[chain.kind]?.find((s) => s.id === slotId) ||
    [...(ownerOf(isInst, idx)?.inserts || []), ...(ownerOf(isInst, idx)?.fx || [])].find((s) => s.id === slotId);
  const slot0 = find();
  if (!slot0 || !PluginFaces.has(slot0.type)) return;
  closePluginFace();
  engine.ensureContext();
  let modal = $("#modal-plugin-face");
  if (!modal) {
    modal = el("div", "modal hidden");
    modal.id = "modal-plugin-face";
    modal.innerHTML =
      '<div class="pf-box"><div class="pf-bar"><b id="pf-title"></b><span id="pf-sub"></span><span class="pf-spacer"></span><button id="pf-preview" class="ch-btn tiny" title="Play a test note or hit through this plugin">TEST</button><button id="pf-done" class="ch-btn tiny primary">DONE</button></div><div class="pf-host"></div></div>';
    document.body.appendChild(modal);
    modal.addEventListener("pointerdown", (e) => {
      if (e.target === modal) closePluginFace();
    });
    $("#pf-done").addEventListener("click", closePluginFace);
    window.addEventListener(
      "keydown",
      (e) => {
        if (e.key === "Escape" && faceH) {
          e.stopImmediatePropagation();
          closePluginFace();
        }
      },
      true,
    );
  }
  const t0 = PLUGIN_TYPES[slot0.type];
  $("#pf-title").textContent = t0.name;
  $("#pf-sub").textContent = ` · ${t0.role || t0.category} · ${ownerOf(isInst, idx)?.name || ""}`;
  $("#pf-preview").onclick = () =>
    isInst ? engine.triggerNote(idx, 48, 1, 0, 0.5) : engine.trigger(idx);
  const subs = new Set();
  const link = {
    getParams: () => ({ ...pluginDefaults(slot0.type), ...(find()?.params || {}) }),
    setParams(o) {
      const sl = find();
      if (!sl) return;
      sl.params = { ...pluginDefaults(sl.type), ...(sl.params || {}), ...o };
      engine.updateSlot(idx, isInst, slotId);
      store.emit("dirty");
    },
    getEnabled: () => find()?.enabled !== false,
    setEnabled(b) {
      const sl = find();
      if (!sl || (sl.enabled !== false) === b) return;
      sl.enabled = b;
      engine.updateSlot(idx, isInst, slotId);
      store.emit("dirty");
      if (!$("#modal-chain").classList.contains("hidden")) renderChain();
    },
    onChange(fn) {
      subs.add(fn);
      return () => subs.delete(fn);
    },
    inst: () => engine.slotInstance(idx, isInst, slotId),
    taps: () => engine.slotTaps(idx, isInst, slotId),
  };
  modal.classList.remove("hidden");
  const h = PluginFaces.mount(modal.querySelector(".pf-host"), slot0.type, link, { chrome: 80 });
  faceH = { id: slotId, idx, isInst, subs, dispose: () => h?.dispose() };
}
const notifyPluginFace = () => faceH?.subs.forEach((f) => f());

function moveSlot(from, to) {
  const arr = [...chainSlots()];
  if (to < 0 || to >= arr.length || from === to) return;
  const [s] = arr.splice(from, 1);
  arr.splice(to, 0, s);
  commitChain(arr);
}

const decimals = (step) => {
  const t = String(step);
  return t.includes(".") ? t.split(".")[1].length : 0;
};
const fmt = (ps, v) => (+v).toFixed(decimals(ps.step));
// Log sliders run 0..1000 internally and map exponentially onto min..max.
const toSlider = (ps, v) =>
  ps.log ? Math.round((1000 * Math.log(v / ps.min)) / Math.log(ps.max / ps.min)) : v;
const fromSlider = (ps, x) => {
  if (!ps.log) return +x;
  const v = ps.min * Math.pow(ps.max / ps.min, +x / 1000);
  return +(Math.round(v / ps.step) * ps.step).toFixed(decimals(ps.step));
};

function renderParams(slot) {
  const t = PLUGIN_TYPES[slot.type];
  const grid = el("div", "synth-params chain-params");
  const P = { ...pluginDefaults(slot.type), ...(slot.params || {}) };
  const live = (key, v) => {
    slot.params = { ...P, ...slot.params, [key]: v };
    P[key] = v;
    engine.updateSlot(chain.idx, chain.isInst, slot.id);
    store.emit("dirty"); // history snapshots (debounced) — slider drags are undoable
  };
  t.params.forEach((ps) => {
    const wrap = el("label", "synth-param");
    wrap.appendChild(el("span", "", ps.label));
    if (ps.options) {
      const sel = el("select");
      ps.options.forEach(([v, label]) => {
        const o = el("option", "", label);
        o.value = v;
        sel.appendChild(o);
      });
      sel.value = P[ps.key];
      sel.addEventListener("change", () => live(ps.key, sel.value));
      wrap.appendChild(sel);
    } else {
      const input = el("input");
      input.type = "range";
      input.min = ps.log ? 0 : ps.min;
      input.max = ps.log ? 1000 : ps.max;
      input.step = ps.log ? 1 : ps.step;
      input.value = toSlider(ps, P[ps.key]);
      const val = el("span", "synth-val", fmt(ps, P[ps.key]));
      input.addEventListener("input", () => {
        const v = fromSlider(ps, input.value);
        val.textContent = fmt(ps, v);
        live(ps.key, v);
      });
      input.addEventListener("dblclick", () => {
        input.value = toSlider(ps, ps.def);
        val.textContent = fmt(ps, ps.def);
        live(ps.key, ps.def);
      });
      input.title = "Double-click to reset";
      wrap.append(input, val);
    }
    grid.appendChild(wrap);
  });
  return grid;
}

function renderChain() {
  const root = $("#chain-slots");
  if (!root) return;
  const owner = chainOwner();
  $("#chain-owner-label").textContent = `— ${owner.name}`;
  document.querySelectorAll("#modal-chain .chain-tabs .tab").forEach((b) => {
    const k = b.dataset.chain;
    b.classList.toggle("active", k === chain.kind);
    b.setAttribute("aria-selected", k === chain.kind);
    const n = chainSlots(k).length;
    b.querySelector(".chain-count").textContent = n ? n : "";
  });
  root.innerHTML = "";
  const slots = chainSlots();
  if (!slots.length) {
    const empty = el(
      "li",
      "chain-empty",
      `Add ${chain.kind === "fx" ? "an FX" : "an insert"} plugin below to start this chain.`,
    );
    root.appendChild(empty);
  }
  slots.forEach((slot, i) => {
    const t = PLUGIN_TYPES[slot.type];
    const li = el("li", "chain-slot" + (slot.enabled ? " on" : ""));
    li.dataset.id = slot.id;
    li.style.setProperty("--plug-color", t.color);

    const head = el("div", "chain-head");
    head.draggable = true;
    const grip = el("span", "chain-grip", "⋮⋮");
    grip.title = "Drag to reorder";
    const name = el("button", "chain-name", t.name);
    name.title = "Show / hide controls";
    name.setAttribute("aria-expanded", chain.open.has(slot.id));
    name.addEventListener("click", () => {
      chain.open.has(slot.id) ? chain.open.delete(slot.id) : chain.open.add(slot.id);
      renderChain();
    });
    const cat = el("span", "chain-cat", t.role || t.category);
    const faceBtn = PluginFaces.has(slot.type) ? el("button", "ch-btn tiny chain-face", "FACE") : null;
    if (faceBtn) {
      faceBtn.title = `Open the ${t.name} front panel`;
      faceBtn.addEventListener("click", () => openPluginFace(slot.id));
    }

    const power = el(
      "button",
      "ch-btn tiny chain-power" + (slot.enabled ? " active" : ""),
      slot.enabled ? "ON" : "BYP",
    );
    power.title = slot.enabled ? "Bypass this plugin" : "Turn this plugin back on";
    power.setAttribute("aria-pressed", slot.enabled);
    power.addEventListener("click", () =>
      commitChain(
        chainSlots().map((s) => (s.id === slot.id ? { ...s, enabled: !s.enabled } : s)),
      ),
    );
    const up = el("button", "ch-btn tiny", "▲");
    up.title = "Move up";
    up.disabled = i === 0;
    up.addEventListener("click", () => moveSlot(i, i - 1));
    const down = el("button", "ch-btn tiny", "▼");
    down.title = "Move down";
    down.disabled = i === slots.length - 1;
    down.addEventListener("click", () => moveSlot(i, i + 1));
    const del = el("button", "ch-btn tiny chain-del", "✕");
    del.title = "Remove";
    del.addEventListener("click", () => {
      chain.open.delete(slot.id);
      commitChain(chainSlots().filter((s) => s.id !== slot.id));
    });

    head.append(el("span", "chain-num", `${i + 1}`), grip, name, cat, ...(faceBtn ? [faceBtn] : []), power, up, down, del);
    li.appendChild(head);
    if (chain.open.has(slot.id)) li.appendChild(renderParams(slot));

    // drag to reorder (by the header row, so sliders still drag normally)
    head.addEventListener("dragstart", (e) => {
      chain.drag = slot.id;
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", slot.id);
      li.classList.add("dragging");
    });
    head.addEventListener("dragend", () => {
      chain.drag = null;
      li.classList.remove("dragging");
      root.querySelectorAll(".drop-before,.drop-after").forEach((n) =>
        n.classList.remove("drop-before", "drop-after"),
      );
    });
    li.addEventListener("dragover", (e) => {
      if (!chain.drag) return;
      e.preventDefault();
      const r = li.getBoundingClientRect();
      const after = e.clientY > r.top + r.height / 2;
      li.classList.toggle("drop-after", after);
      li.classList.toggle("drop-before", !after);
    });
    li.addEventListener("dragleave", () => li.classList.remove("drop-before", "drop-after"));
    li.addEventListener("drop", (e) => {
      e.preventDefault();
      const after = li.classList.contains("drop-after");
      li.classList.remove("drop-before", "drop-after");
      const arr = chainSlots();
      const from = arr.findIndex((s) => s.id === chain.drag);
      if (from < 0) return;
      let to = arr.findIndex((s) => s.id === slot.id) + (after ? 1 : 0);
      if (from < to) to--;
      moveSlot(from, to);
    });
    root.appendChild(li);
  });

  // Add list: this chain's plugins, grouped by category
  const sel = $("#chain-add-type");
  const keep = sel.value;
  sel.innerHTML = "";
  for (const [category, items] of pluginsFor(chain.kind)) {
    const og = el("optgroup");
    og.label = category;
    for (const [id, t] of items) {
      const o = el("option", "", t.role ? `${t.name} · ${t.role}` : t.name);
      o.value = id;
      og.appendChild(o);
    }
    sel.appendChild(og);
  }
  if ([...sel.options].some((o) => o.value === keep)) sel.value = keep;
  $("#chain-add-btn").textContent = `+ Add ${CHAIN_LABEL[chain.kind]}`;
}

function openChain(idx, isInst = false, kind = "inserts") {
  chain.idx = idx;
  chain.isInst = isInst;
  chain.kind = kind;
  engine.ensureContext();
  normalizeOwner(chainOwner());
  $("#modal-chain").classList.remove("hidden");
  renderChain();
}

export function initChainPanel() {
  document.querySelectorAll("#modal-chain .chain-tabs .tab").forEach((b) =>
    b.addEventListener("click", () => {
      chain.kind = b.dataset.chain;
      renderChain();
    }),
  );
  $("#chain-add-btn").addEventListener("click", () => {
    const type = $("#chain-add-type").value;
    if (!PLUGIN_TYPES[type]) return;
    const slot = makeSlot(type);
    chain.open.add(slot.id); // new plugins open with their controls showing
    commitChain([...chainSlots(), slot]);
  });
  $("#chain-preview").addEventListener("click", () =>
    chain.isInst
      ? engine.triggerNote(chain.idx, 48, 1, 0, 0.4)
      : engine.trigger(chain.idx),
  );
  $("#chain-clear").addEventListener("click", () => {
    if (chainSlots().length) commitChain([]);
  });
  $("#chain-close").addEventListener("click", () => {
    $("#modal-chain").classList.add("hidden");
    refreshOwnerRow(chain.isInst, chain.idx);
  });
  document.addEventListener("open-inst-fx", (e) => openChain(e.detail, true, "fx"));
  document.addEventListener("open-inst-inserts", (e) =>
    openChain(e.detail, true, "inserts"),
  );
}
// Re-render if an undo/redo or project load lands while the panel is open.
export function refreshChainPanel() {
  notifyPluginFace();
  if ($("#modal-chain") && !$("#modal-chain").classList.contains("hidden")) {
    if (!chainOwner()) return $("#modal-chain").classList.add("hidden");
    renderChain();
  }
}

// --- Beats (preset) modal ---
let beatLoad = null;
const currentBeatCollection = () => {
  const key = $("#beats-collection").value;
  // The Analog Kit set is built lazily (and per kit voicing) the first time it is opened.
  if (key === "drums-analog") return analogBeats($("#beats-kit").value || "auto");
  return (
    {
      original: BEAT_PRESETS,
      l1: L1_BEAT_PRESETS,
      combined: COMBINED_BEAT_PRESETS,
      tonal: TONAL_BEAT_PRESETS,
      "drums-studio": DRUM_BEATS_STUDIO,
      "drums-l1": DRUM_BEATS_L1,
    }[key] || DRUM_BEATS_STUDIO
  );
};

const beatId = (preset) =>
  preset.id ||
  `original-${preset.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
let pendingBeatId = null;
function syncBeatTransport() {
  const play = $("#beats-play");
  if (!play) return;
  play.textContent = engine.isPlaying ? "❚❚ Pause" : "▶ Play";
  play.classList.toggle("active", engine.isPlaying);
  $("#beats-stop").disabled = !engine.isPlaying;
  const status = $("#beats-status");
  if (!beatLoad && /^(Loaded|Playing) "/.test(status.textContent))
    status.textContent = status.textContent
      .replace(/^(Loaded|Playing)/, engine.isPlaying ? "Playing" : "Loaded")
      .replace(
        /Choose another beat to switch while playing\.|Press Play here to audition, then choose another beat\./,
        engine.isPlaying
          ? "Choose another beat to switch while playing."
          : "Press Play here to audition, then choose another beat.",
      );
}
function syncBeatRows() {
  const loaded = store.project.lastBeat?.id;
  for (const row of $("#beats-list").children) {
    row.classList.toggle("beat-current", row.dataset.beatId === loaded);
    row.classList.toggle("beat-loading", row.dataset.beatId === pendingBeatId);
    const button = row.querySelector("button");
    if (button)
      button.textContent =
        row.dataset.beatId === pendingBeatId
          ? "Loading…"
          : row.dataset.beatId === loaded
            ? "Reload"
            : "Load";
  }
}
async function applyCatalogPreset(preset) {
  beatLoad?.abort();
  const controller = new AbortController();
  beatLoad = controller;
  pendingBeatId = beatId(preset);
  syncBeatRows();
  const status = $("#beats-status");
  $("#beats-cancel").hidden = false;
  status.textContent = `Loading ${preset.name}…${engine.isPlaying ? " Current beat keeps playing." : ""}`;
  recordHistory(true);
  try {
    await loadBeatPreset(preset, {
      signal: controller.signal,
      onProgress: (loaded, total, name) => {
        if (beatLoad === controller && !controller.signal.aborted)
          status.textContent = `Loading ${preset.name} · ${loaded}/${total} sounds · ${name}${engine.isPlaying ? " · current beat keeps playing" : ""}`;
      },
    });
    if (beatLoad !== controller) return;
    $("#bpm").value = preset.bpm;
    $("#swing").value = preset.swing || 0;
    $("#swing-val").textContent = `${preset.swing || 0}%`;
    $("#chk-continuous").checked = false;
    $("#btn-play").textContent = engine.isPlaying ? "❚❚" : "▶";
    $("#btn-play").classList.toggle("active", engine.isPlaying);
    refreshAllChannels();
    recordHistory(true);
    status.textContent = `${engine.isPlaying ? "Playing" : "Loaded"} "${preset.name}" · ${preset.genre} · ${preset.bpm} BPM. ${engine.isPlaying ? "Choose another beat to switch while playing." : "Press Play here to audition, then choose another beat."}`;
    setStatus(status.textContent);
  } catch (error) {
    if (beatLoad !== controller) return;
    status.textContent = controller.signal.aborted
      ? "Beat loading cancelled. Your current beat is unchanged."
      : `${error.message} Your current beat is unchanged. Try another beat or retry.`;
    setStatus(status.textContent, !controller.signal.aborted);
  } finally {
    if (beatLoad === controller) {
      beatLoad = null;
      pendingBeatId = null;
      $("#beats-cancel").hidden = true;
      syncBeatRows();
      syncBeatTransport();
    }
  }
}

function renderBeatsList() {
  const genre = $("#beats-genre").value;
  const key = $("#beats-collection").value;
  const isDrums = key.startsWith("drums-");
  const isAnalog = key === "drums-analog";
  const filter = isDrums ? $("#beats-type").value : "";
  $("#beats-type").hidden = !isDrums;
  $("#beats-kit").hidden = !isAnalog;
  const query = $("#beats-search").value.trim().toLowerCase();
  const collection = currentBeatCollection();
  const matches = collection.filter(
    (p) =>
      (!genre || p.genre === genre) &&
      (!filter ||
        (filter === "start" ? p.startHere : filter === "bass" ? p.withBass : true)) &&
      (!query ||
        `${p.name} ${p.genre} ${p.description || ""} ${(p.soundFamilies || []).join(" ")} ${p.channels.map((c) => `${c.source.label} ${c.source.value}`).join(" ")}`
          .toLowerCase()
          .includes(query)),
  );
  const isL1 = key === "l1" || key === "drums-l1";
  const isCombined = key === "combined";
  const isTonal = key === "tonal";
  $("#beats-title").textContent = isDrums
    ? isAnalog
      ? "Drum Beats · Analog Kit"
      : isL1
        ? "Drum Beats · Bitcoin L1"
        : "Drum Beats · Studio Kit"
    : isTonal
      ? "Onboard Tonal Beats"
      : isL1
        ? "L1 Beat Collection"
        : isCombined
          ? "Combined Beat Collection"
          : "Beat Presets";
  const kitNote = {
    "drums-studio":
      "Drums only — kicks, snares, toms, hats and cymbals from the Studio kit, in every genre. ★ Start here lists the generic essentials first.",
    "drums-l1":
      "Drums only, from Bitcoin L1 single hits (OB1 + OG). Toms, rims and shakers are retunes of those hits. ★ Start here lists the essentials first.",
    "drums-analog":
      "Drums only, played on the Analog Kit: real acoustic drum recordings (CC0) voiced on six kits — Jazz Club, Rusty, Unruly, Swirly, Concert and Modern Mix. Pick a kit to hear any beat on it. ★ Start here lists the essentials first.",
    l1: "Bitcoin samples only (OB1 + OG hits). Loads the current pattern; other tracks are muted.",
    combined:
      "L1 percussion plus the embedded bank. Loads the current pattern; other tracks are muted.",
    tonal: "Embedded kit; ensembles add bass, plucks, keys, pads and chord stabs.",
    original: "Four-bar arrangements with bass and melody on the embedded sound bank.",
  }[key];
  $("#beats-summary").textContent =
    `${matches.length} of ${collection.length} beats · ${kitNote} ${isAnalog ? "The Analog Kit sample pack (7.9 MB) downloads the first time you load a beat from it." : "Local today / planned L2."}`;
  const list = $("#beats-list");
  list.innerHTML = "";
  matches.forEach((preset) => {
    const row = el("div", "beat-row");
    row.dataset.beatId = beatId(preset);
    row.beatPreset = preset;
    const info = el("div", "beat-info");
    const title = el("span", "beat-name", preset.name);
    if (preset.startHere) title.append(" ", el("span", "beat-tag", "★ Start here"));
    if (preset.withBass) title.append(" ", el("span", "beat-tag bass", "With bass"));
    info.appendChild(title);
    info.appendChild(
      el(
        "span",
        "beat-meta",
        `${preset.genre} · ${preset.feltBpm ? `${preset.feltBpm} BPM feel (grid ${preset.bpm})` : `${preset.bpm} BPM`}${preset.swing ? ` · swing ${preset.swing}%` : ""} · ${preset.bars} bar${preset.bars > 1 ? "s" : ""} · ${preset.channels.length} ch${preset.persona ? ` · ${ANALOG_PERSONAS.find((p) => p.key === preset.persona)?.label} kit` : ""}`,
      ),
    );
    if (preset.description)
      info.append(el("span", "beat-meta", preset.description));
    if (!isTonal) {
      const details = el("details");
      details.append(
        el(
          "summary",
          "",
          isAnalog
            ? `Analog Kit recordings · ${preset.channels.length} channels`
            : isCombined
            ? `Sources · ${preset.channels.filter((c) => c.source.type === "ordinal").length} L1 + ${preset.channels.filter((c) => c.source.type === "synth").length} built-in`
            : isL1
              ? `L1 sample inscriptions · ${preset.channels.length} channels`
              : `Embedded sounds · ${preset.channels.length} channels · ${preset.drumBeat ? "drums" : (preset.soundFamilies || []).map((f) => FAMILY_LABELS[f] || f).join(" / ")}`,
        ),
      );
      const references = el("div", "ordinal-links");
      renderOrdinalReferences(
        references,
        preset.channels
          .filter((c) => c.source.type === "ordinal")
          .map((c) => ({
            source: c.source,
            label: `${c.source.label}${c.kind === "loop" ? ` · ${c.loopBeats}-beat loop at ${c.sourceBpm} BPM` : " · single hit"}`,
          })),
      );
      details.append(references);
      if (isAnalog) {
        for (const channel of preset.channels)
          details.append(
            el("div", "beat-meta", `${channel.name} · ${channel.source.label}`),
          );
        const first = preset.channels.find((c) => c.source.type === "pack");
        if (first)
          details.append(el("p", "beat-meta", `Licence · ${packSoundNotice(first.source.value)}`));
      } else if (isCombined || !isL1) {
        details.append(
          el("p", "beat-meta", "Built-in sounds · local today / planned L2"),
        );
        for (const channel of preset.channels.filter(
          (c) => c.source.type === "synth",
        ))
          details.append(
            el(
              "div",
              "beat-meta",
              `${channel.source.label}${SOUND_BY_KEY[channel.source.value] ? ` · ${FAMILY_LABELS[SOUND_BY_KEY[channel.source.value].family]} · ${midiName(channel.source.rootMidi ?? SOUND_BY_KEY[channel.source.value].rootMidi)}${channel.source.velocityLayer === 0.55 ? " · soft layer" : ""}` : ""}`,
            ),
          );
      }
      info.append(details);
    }
    const loadBtn = el("button", "primary", "Load");
    loadBtn.addEventListener("click", async () => {
      await applyCatalogPreset(preset);
    });
    row.append(info, loadBtn);
    list.appendChild(row);
  });
  syncBeatRows();
  syncBeatTransport();
  $("#beats-prev").disabled = !matches.length;
  $("#beats-next").disabled = !matches.length;
  if (!matches.length)
    list.append(
      el("p", "beat-meta", "No beats match. Try a different genre or search."),
    );
}

export function initBeatsModal() {
  const sel = $("#beats-genre");
  const updateGenres = () => {
    const previous = sel.value;
    sel.replaceChildren(new Option("All genres", ""));
    const genres = [
      ...new Set(currentBeatCollection().map((p) => p.genre)),
    ].sort();
    for (const genre of genres) sel.append(new Option(genre, genre));
    if (genres.includes(previous)) sel.value = previous;
    renderBeatsList();
  };
  // Analog Kit: kit voicing menu, plus fetching the sample pack ahead of the first load.
  const kitSelect = $("#beats-kit");
  kitSelect.replaceChildren(new Option("Kit: each beat's own", "auto"));
  for (const persona of ANALOG_PERSONAS) kitSelect.append(new Option(`${persona.label} kit`, persona.key));
  const analogOption = [...$("#beats-collection").options].find((o) => o.value === "drums-analog");
  if (analogOption) analogOption.textContent = `Analog kit drums · ${analogBeats("auto").length}`;
  const warmAnalogPack = async () => {
    if ($("#beats-collection").value !== "drums-analog" || beatLoad) return;
    const status = $("#beats-status");
    if (!status.textContent) status.textContent = "Preparing the Analog Kit sample pack (7.9 MB)…";
    const result = await prefetchPack(ANALOG_PACK_ID);
    if (!beatLoad && /^Preparing the Analog Kit/.test(status.textContent))
      status.textContent = result.ok
        ? "Analog Kit ready. Pick a beat to load it."
        : "The Analog Kit sample pack could not be downloaded yet; it will retry when you load a beat.";
  };
  kitSelect.addEventListener("change", () => {
    renderBeatsList();
    // Hearing the same beat on another kit: reload the current Analog beat in the new voicing.
    const loaded = store.project.lastBeat;
    if (loaded?.collection !== "analog") return;
    const row = [...$("#beats-list").children].find((r) => r.dataset.beatId === loaded.id);
    if (row?.beatPreset) applyCatalogPreset(row.beatPreset);
  });
  $("#beats-collection").addEventListener("change", () => {
    updateGenres();
    warmAnalogPack();
  });
  $("#beats-search").addEventListener("input", renderBeatsList);
  $("#beats-type").addEventListener("change", renderBeatsList);
  sel.addEventListener("change", renderBeatsList);
  const open = (collection) => {
    if (beatLoad && !beatLoad.signal.aborted) return;
    beatLoad = null;
    pendingBeatId = null;
    $("#beats-cancel").hidden = true;
    $("#beats-collection").value = collection;
    $("#beats-search").value = "";
    $("#beats-type").value = "";
    sel.value = "";
    $("#beats-status").textContent = "";
    updateGenres();
    $("#modal-beats").classList.remove("hidden");
    warmAnalogPack();
  };
  $("#btn-beats").addEventListener("click", () => open("drums-studio"));
  $("#beats-play").addEventListener("click", () => {
    $("#btn-play").click();
    syncBeatTransport();
  });
  $("#beats-stop").addEventListener("click", () => {
    $("#btn-stop").click();
    syncBeatTransport();
  });
  const advance = (direction) => {
    const rows = [...$("#beats-list").children].filter((row) => row.beatPreset);
    if (!rows.length) return;
    const current = rows.findIndex(
      (row) =>
        row.dataset.beatId === (pendingBeatId || store.project.lastBeat?.id),
    );
    const next =
      current < 0
        ? direction > 0
          ? 0
          : rows.length - 1
        : (current + direction + rows.length) % rows.length;
    rows[next].scrollIntoView({ block: "nearest" });
    applyCatalogPreset(rows[next].beatPreset);
  };
  $("#beats-prev").addEventListener("click", () => advance(-1));
  $("#beats-next").addEventListener("click", () => advance(1));
  for (const selector of ["#btn-play", "#btn-stop"])
    $(selector).addEventListener("click", () =>
      queueMicrotask(syncBeatTransport),
    );
  document.addEventListener("keydown", (event) => {
    if (event.code === "Space") queueMicrotask(syncBeatTransport);
  });
  $("#beats-cancel").addEventListener("click", () => beatLoad?.abort());
  $("#beats-close").addEventListener("click", () => {
    beatLoad?.abort();
    $("#modal-beats").classList.add("hidden");
  });
}

// --- settings modal ---
export function initSettingsModal(onSave) {
  $("#btn-settings").addEventListener("click", () => {
    $("#set-ordinals-gateway").value = store.settings.ordinalsGateway;
    $("#set-xtrata-gateway").value = store.settings.xtrataGateway;
    $("#set-autosave").checked = store.settings.autosave;
    $("#modal-settings").classList.remove("hidden");
  });
  $("#settings-close").addEventListener("click", () => {
    store.settings.ordinalsGateway =
      $("#set-ordinals-gateway").value.trim() ||
      "https://ordinals.com/content/";
    store.settings.xtrataGateway =
      $("#set-xtrata-gateway").value.trim() ||
      "/runtime/content?network=mainnet&contractId=SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3&fallbackContractId=SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v2-1-0&tokenId={id}";
    store.settings.autosave = $("#set-autosave").checked;
    $("#modal-settings").classList.add("hidden");
    onSave?.();
  });
}

// close modals on backdrop click / Escape
export function initModalDismissal() {
  document.querySelectorAll(".modal").forEach((m) => {
    m.addEventListener("click", (e) => {
      if (e.target === m) {
        if (m.id === "modal-beats") beatLoad?.abort();
        engine.stopPreview();
        trimStopPlayback();
        m.classList.add("hidden");
      }
    });
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      beatLoad?.abort();
      engine.stopPreview();
      trimStopPlayback();
      document
        .querySelectorAll(".modal")
        .forEach((m) => m.classList.add("hidden"));
    }
  });
}
