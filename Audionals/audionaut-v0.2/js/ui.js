// ui.js — builds and updates the DOM: channels, step grid, sequence bar, modals.

import {
  store,
  NUM_CHANNELS,
  NUM_STEPS,
  MAX_SEQUENCES,
  stepVal,
  stepObj,
} from "./state.js";
import { engine } from "./engine.js";
import { loadSample, fetchAndDecode } from "./loader.js";
import { SAMPLE_LIBRARY } from "./library.js";
import { renderOrdinalReferences } from "./ordinal-links.js";
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
import {
  SOUND_BY_KEY,
  FAMILY_LABELS,
  midiName,
  noteRate,
  assetKey,
} from "./onboard-catalog.js";
import { ONBOARD_MANIFEST } from "./onboard-manifest.js";
import { sustainDuration, sampleLoop } from "./onboard-library.js";
import { EXPANDED_COMBINED_BEAT_PRESETS as COMBINED_BEAT_PRESETS } from "./combined-beats.js";
import { loadBeatPreset } from "./l1-beat-loader.js";
import { record as recordHistory } from "./history.js";
import { NUM_INSTRUMENTS } from "./state.js";
import { SYNTH_BANK } from "./synths.js";
import { openRoll } from "./pianoroll.js";
import {
  PLUGIN_TYPES,
  MAX_INSERTS,
  makeInsert,
  pluginDefaults,
} from "./plugins.js";

const $ = (s) => document.querySelector(s);
const el = (tag, cls, text) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
};

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

    const fxBtn = el("button", "ch-btn fx", "FX");
    fxBtn.title = "Channel FX: filter, drive, delay, reverb";
    fxBtn.addEventListener("click", () => openFx(ch));

    const insBtn = el("button", "ch-btn fx ins", "INS");
    insBtn.title =
      "Insert plugins: EQ, compressor, gate, distortion, chorus, flanger, phaser, tremolo, bitcrusher";
    insBtn.classList.toggle(
      "has-inserts",
      (c.inserts || []).some((i) => i?.enabled),
    );
    insBtn.addEventListener("click", () => openInserts(ch));

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

    ctrl.append(
      nameInput,
      loadBtn,
      previewBtn,
      muteBtn,
      soloBtn,
      trimBtn,
      fxBtn,
      insBtn,
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
    const sourceLinks = el("div", "channel-source-links");
    renderOrdinalReferences(sourceLinks, [
      { source: c.source, label: "Sample inscription" },
    ]);
    controlStack.append(ctrl, sourceLinks);
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

    const synthLabel = el("span", "inst-synth-label", synth.name);

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
      previewBtn,
      muteBtn,
      soloBtn,
      vol,
      copyBtn,
      pasteBtn,
      synthLabel,
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

export function refreshInstrumentRow(i) {
  const row = document.querySelector(`.channel.instrument[data-inst="${i}"]`);
  if (!row) return;
  const instr = store.instrument(i);
  const synth = SYNTH_BANK[instr.synthId] || SYNTH_BANK.jims10;
  row.style.setProperty("--ch-color", synth.color);
  row.querySelector(".ch-name").value = instr.name;
  row.querySelector(".inst-synth-label").textContent = synth.name;
  drawInstStrip(i);
}

export function refreshChannelRow(ch) {
  const row = $(`#channels .channel[data-ch="${ch}"]`);
  if (!row) return;
  const c = store.channel(ch);
  renderOrdinalReferences(row.querySelector(".channel-source-links"), [
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
  row.querySelector(".ins")?.classList.toggle(
    "has-inserts",
    (c.inserts || []).some((i) => i?.enabled),
  );
}

export function refreshAllChannels() {
  for (let ch = 0; ch < store.numChannels; ch++) refreshChannelRow(ch);
}

// ---------------------------------------------------------------- pattern
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
  b.title =
    o?.sampleMidi != null
      ? `${midiName(o.sampleMidi)}${o.gateSteps ? ` · sustain ${o.gateSteps} steps` : ""} · Alt-click to edit`
      : o?.wordSelection?.text
        ? `${o.wordSelection.text} · ${o.wordSelection.start.toFixed(3)}–${o.wordSelection.end.toFixed(3)}s · Alt-click to edit`
        : o?.rev
          ? "Reversed step (right-click to toggle, alt-click to edit)"
          : "Click to toggle · Shift-click accent · Alt-click edit";
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

let lastPlayheadStep = -1;
export function movePlayhead(step) {
  if (lastPlayheadStep >= 0) {
    for (let ch = 0; ch < stepButtons.length; ch++)
      stepButtons[ch][lastPlayheadStep].classList.remove("playing");
  }
  if (step >= 0) {
    for (let ch = 0; ch < stepButtons.length; ch++)
      stepButtons[ch][step].classList.add("playing");
    $("#lcd-pos").textContent =
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
      !`${item.label} ${SOUND_BY_KEY[item.id]?.tags.join(" ") || ""}`
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
function updateSoundInfo() {
  const sound = SOUND_BY_KEY[currentLibrarySelection()?.item.id];
  if (!sound) return;
  const root = sound.rootMidi == null ? null : +$("#library-root").value,
    v = +$("#library-velocity").value,
    m = ONBOARD_MANIFEST.assets[assetKey(sound, root, v)];
  $("#library-sound-meta").textContent =
    `${midiName(root)} · ${sound.tags.filter((t) => !["mono", "stereo"].includes(t)).join(" · ")} · ${m?.duration.toFixed(2)}s · ${m?.channels === 2 ? "stereo" : "mono"} · ${m?.headroomDb.toFixed(1)} dB headroom · v${sound.version} · Local embedded audio`;
  $("#library-pack").href = `media/onboard-v2/${sound.family}.json`;
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

// --- insert plugins modal ---
let insertsChannel = 0;

function renderInsertSlots() {
  const root = $("#inserts-slots");
  root.innerHTML = "";
  const c = store.channel(insertsChannel);
  c.inserts = c.inserts || [];
  for (let slot = 0; slot < MAX_INSERTS; slot++) {
    const def = c.inserts[slot] || null;
    const box = el("div", "insert-slot" + (def?.enabled ? " on" : ""));
    if (def && PLUGIN_TYPES[def.type])
      box.style.setProperty("--plug-color", PLUGIN_TYPES[def.type].color);

    const head = el("div", "insert-head");
    const sel = el("select", "insert-type");
    const optEmpty = el("option", "", "— empty —");
    optEmpty.value = "";
    sel.appendChild(optEmpty);
    Object.entries(PLUGIN_TYPES).forEach(([id, t]) => {
      const o = el("option", "", t.name);
      o.value = id;
      sel.appendChild(o);
    });
    sel.value = def?.type || "";
    sel.addEventListener("change", () => {
      const arr = [...(store.channel(insertsChannel).inserts || [])];
      arr[slot] = sel.value ? makeInsert(sel.value) : null;
      store.setChannelProp(insertsChannel, "inserts", arr);
      engine.rebuildInserts(insertsChannel);
      renderInsertSlots();
      refreshChannelRow(insertsChannel);
    });

    head.append(el("span", "insert-slot-num", `${slot + 1}`), sel);

    if (def) {
      const enable = el(
        "button",
        "ch-btn tiny" + (def.enabled ? " active" : ""),
        def.enabled ? "ON" : "off",
      );
      enable.title = "Bypass toggle";
      enable.addEventListener("click", () => {
        def.enabled = !def.enabled;
        store.setChannelProp(
          insertsChannel,
          "inserts",
          store.channel(insertsChannel).inserts,
        );
        engine.rebuildInserts(insertsChannel);
        renderInsertSlots();
      });
      head.appendChild(enable);
    }
    box.appendChild(head);

    if (def && PLUGIN_TYPES[def.type]) {
      const t = PLUGIN_TYPES[def.type];
      const grid = el("div", "synth-params");
      const P = { ...pluginDefaults(def.type), ...(def.params || {}) };
      t.params.forEach((ps) => {
        const wrap = el("label", "synth-param");
        const lab = el("span", "", ps.label);
        const input = el("input");
        input.type = "range";
        input.min = ps.min;
        input.max = ps.max;
        input.step = ps.step;
        input.value = P[ps.key];
        const val = el("span", "synth-val", String(P[ps.key]));
        input.addEventListener("input", () => {
          def.params = { ...P, ...def.params, [ps.key]: +input.value };
          P[ps.key] = +input.value;
          val.textContent = input.value;
          engine.updateInsertParams(insertsChannel, slot);
          store.emit("dirty");
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
  $("#inserts-channel-label").textContent = `— ${store.channel(ch).name}`;
  $("#modal-inserts").classList.remove("hidden");
  renderInsertSlots();
}

export function initInsertsModal() {
  $("#inserts-close").addEventListener("click", () => {
    $("#modal-inserts").classList.add("hidden");
    refreshChannelRow(insertsChannel);
  });
}

// --- FX modal ---
let fxChannel = 0;

function openFx(ch) {
  fxChannel = ch;
  engine.ensureContext();
  const fx = store.channel(ch).fx || {};
  $("#fx-channel-label").textContent = `— ${store.channel(ch).name}`;
  $("#fx-filter").value = fx.filter || "off";
  $("#fx-cutoff").value = fx.cutoff || 8000;
  $("#fx-cutoff-val").textContent = `${fx.cutoff || 8000} Hz`;
  $("#fx-drive").value = fx.drive || 0;
  $("#fx-delay").value = fx.delay || 0;
  $("#fx-reverb").value = fx.reverb || 0;
  $("#modal-fx").classList.remove("hidden");
}

export function initFxModal() {
  const apply = () => {
    const fx = {
      filter: $("#fx-filter").value,
      cutoff: +$("#fx-cutoff").value,
      drive: +$("#fx-drive").value,
      delay: +$("#fx-delay").value,
      reverb: +$("#fx-reverb").value,
    };
    store.setChannelProp(fxChannel, "fx", fx);
    engine.applyFx(fxChannel);
    $("#fx-cutoff-val").textContent = `${fx.cutoff} Hz`;
  };
  ["#fx-filter", "#fx-cutoff", "#fx-drive", "#fx-delay", "#fx-reverb"].forEach(
    (sel) => $(sel).addEventListener("input", apply),
  );
  $("#fx-preview").addEventListener("click", () => engine.trigger(fxChannel));
  $("#fx-reset").addEventListener("click", () => {
    store.setChannelProp(fxChannel, "fx", {
      filter: "off",
      cutoff: 8000,
      drive: 0,
      delay: 0,
      reverb: 0,
    });
    engine.applyFx(fxChannel);
    openFx(fxChannel);
  });
  $("#fx-close").addEventListener("click", () =>
    $("#modal-fx").classList.add("hidden"),
  );
}

// --- Beats (preset) modal ---
let beatLoad = null;
const currentBeatCollection = () =>
  ({
    original: BEAT_PRESETS,
    l1: L1_BEAT_PRESETS,
    combined: COMBINED_BEAT_PRESETS,
    tonal: TONAL_BEAT_PRESETS,
  })[$("#beats-collection").value] || BEAT_PRESETS;

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
  const query = $("#beats-search").value.trim().toLowerCase();
  const collection = currentBeatCollection();
  const matches = collection.filter(
    (p) =>
      (!genre || p.genre === genre) &&
      (!query ||
        `${p.name} ${p.genre} ${p.description || ""} ${(p.soundFamilies || []).join(" ")} ${p.channels.map((c) => `${c.source.label} ${c.source.value}`).join(" ")}`
          .toLowerCase()
          .includes(query)),
  );
  const isL1 = $("#beats-collection").value === "l1";
  const isCombined = $("#beats-collection").value === "combined";
  const isTonal = $("#beats-collection").value === "tonal";
  $("#beats-title").textContent = isTonal
    ? "Onboard Tonal Beats"
    : isL1
      ? "L1 Beat Collection"
      : isCombined
        ? "Combined Beat Collection"
        : "Beat Presets";
  $("#beats-summary").textContent =
    `${matches.length} of ${collection.length} beats${isL1 ? " · Bitcoin samples only · OB1 + OG hits and short loops. Loads the current pattern; other tracks are muted." : isCombined ? " · L1 percussion + the full 144-sound embedded bank. Embedded sounds are local today, planned for L2. Loads the current pattern; other tracks are muted." : isTonal ? " · Embedded kit + bass, pluck, keys, sustained pads and chord stabs. Local today / planned L2." : " · 96 four-bar arrangements using all 144 embedded sounds. Studio Pocket, Melodic Motion and Texture & Fills. Local today / planned L2."}`;
  const list = $("#beats-list");
  list.innerHTML = "";
  matches.forEach((preset) => {
    const row = el("div", "beat-row");
    row.dataset.beatId = beatId(preset);
    row.beatPreset = preset;
    const info = el("div", "beat-info");
    info.appendChild(el("span", "beat-name", preset.name));
    info.appendChild(
      el(
        "span",
        "beat-meta",
        `${preset.genre} · ${preset.bpm} BPM${preset.swing ? ` · swing ${preset.swing}%` : ""} · ${preset.bars} bar${preset.bars > 1 ? "s" : ""} · ${preset.channels.length} ch`,
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
          isCombined
            ? `Sources · ${preset.channels.filter((c) => c.source.type === "ordinal").length} L1 + ${preset.channels.filter((c) => c.source.type === "synth").length} built-in`
            : isL1
              ? `L1 sample inscriptions · ${preset.channels.length} channels`
              : `Embedded sounds · ${preset.channels.length} channels · ${(preset.soundFamilies || []).map((f) => FAMILY_LABELS[f] || f).join(" / ")}`,
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
      if (isCombined || !isL1) {
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
  $("#beats-collection").addEventListener("change", updateGenres);
  $("#beats-search").addEventListener("input", renderBeatsList);
  sel.addEventListener("change", renderBeatsList);
  const open = (collection) => {
    if (beatLoad && !beatLoad.signal.aborted) return;
    beatLoad = null;
    pendingBeatId = null;
    $("#beats-cancel").hidden = true;
    $("#beats-collection").value = collection;
    $("#beats-search").value = "";
    sel.value = "";
    $("#beats-status").textContent = "";
    updateGenres();
    $("#modal-beats").classList.remove("hidden");
  };
  $("#btn-beats").addEventListener("click", () => open("original"));
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
      "https://xtrata.io/api/content/{id}";
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
