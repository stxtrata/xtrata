import { store } from "./state.js";
import { editClip, canonicalJSON } from "./clip-contract.js";
import {
  getClipLibrary,
  effectiveLibrary,
  searchClips,
  refreshClipLibrary,
  saveClipEdits,
  createPersonalClip,
  exportClipLibrary,
  exportClipBackup,
  importClipBackup,
  recordClipMeasurement,
  clearedClipExport,
} from "./clip-library.js";
import { loadClip, previewClip, stopClipPreview } from "./clip-actions.js";
import { renderOrdinalReferences } from "./ordinal-links.js";
const make = (tag, text, cls) => {
  const n = document.createElement(tag);
  if (text != null) n.textContent = text;
  if (cls) n.className = cls;
  return n;
};
const button = (text, fn) => {
  const b = make("button", text);
  b.type = "button";
  b.onclick = fn;
  return b;
};
function download(name, data) {
  const url = URL.createObjectURL(
      new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }),
    ),
    a = make("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
let closeActive;
export async function openSamplesLoops({ ch = 0 } = {}) {
  closeActive?.();
  const dialog = make("dialog", null, "source-browser samples-loops-browser");
  dialog.setAttribute("aria-label", "Samples & Loops");
  const heading = make("header"),
    title = make("h2", "Samples & Loops"),
    close = button("Close", () => dialog.close());
  heading.append(title, close);
  const help = make(
    "p",
    "Bitcoin-inscribed sources with independent clips. Drafts and unknown permissions remain available. Audio loads only when requested.",
    "clip-help",
  );
  const tools = make("div", null, "clip-toolbar"),
    filters = {},
    search = make("input");
  search.type = "search";
  search.placeholder = "Title, tag, instrument, inscription number or ID";
  search.setAttribute("aria-label", "Search Samples & Loops");
  function select(label, items, value) {
    const wrap = make("label", label),
      s = make("select");
    s.setAttribute("aria-label", label);
    for (const [v, t] of items) {
      const o = make("option", t);
      o.value = v;
      s.append(o);
    }
    s.value = value;
    wrap.append(s);
    return { wrap, input: s };
  }
  for (const [key, label, items, value] of [
    [
      "batch",
      "Catalogue",
      [
        ["first22", "First 22 musical candidates"],
        ["all", "All 195 sources + personal clips"],
      ],
      "first22",
    ],
    [
      "use",
      "Use",
      [
        ["all", "All uses"],
        ["loop", "Loops (may be proposed)"],
        ["one_shot", "Single hits"],
        ["texture", "Textures"],
        ["phrase", "Phrases"],
        ["unclassified", "Unclassified"],
      ],
      "all",
    ],
    [
      "duration",
      "Duration",
      [
        ["all", "All durations"],
        ["source-short", "Reported source under 20 s"],
        ["source-long", "Reported source 20 s or longer"],
        ["clip-short", "Selected clip under 20 s"],
        ["unknown", "Unknown reported duration"],
      ],
      "all",
    ],
    [
      "review",
      "Review",
      [
        ["all", "All review states"],
        ["unreviewed", "Unreviewed"],
        ["approved", "Curator approved"],
        ["rejected", "Rejected"],
      ],
      "all",
    ],
    [
      "permission",
      "Permission",
      [
        ["all", "All permission states"],
        ["unknown", "Unknown"],
        ["permission_granted", "Permission granted"],
        ["licensed", "Licensed"],
        ["public_domain", "Public domain"],
      ],
      "all",
    ],
  ]) {
    const s = select(label, items, value);
    filters[key] = s.input;
    tools.append(s.wrap);
    s.input.onchange = () => renderList();
  }
  const searchWrap = make("label", "Search");
  searchWrap.append(search);
  tools.prepend(searchWrap);
  let searchTimer;
  search.oninput = () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(renderList, 150);
  };
  const destination = select(
    "Load into channel",
    store.project.channels.map((c, i) => [String(i), `${i + 1} · ${c.name}`]),
    String(ch),
  );
  tools.append(destination.wrap);
  const count = make("p", "Loading catalogue…", "clip-count"),
    status = make("p", "", "clip-status");
  status.setAttribute("role", "status");
  const content = make("div", null, "clip-browser-content"),
    list = make("div", null, "clip-list"),
    detail = make("section", null, "clip-detail");
  content.append(list, detail);
  const exports = make("div", null, "clip-toolbar"),
    file = make("input");
  file.type = "file";
  file.accept = ".json,application/json";
  file.hidden = true;
  const migration = make("input");
  migration.type = "checkbox";
  const migrationLabel = make(
    "label",
    "Convert v0.1 single-region catalogues on import",
  );
  migrationLabel.prepend(migration);
  exports.append(
    button("Import catalogue / manifest", () => file.click()),
    button("Export draft clips", () =>
      download("audionaut-v0.2-draft-clips.json", exportClipLibrary()),
    ),
    button("Back up personal edits", () =>
      download("audionaut-v0.2-personal-clips.json", exportClipBackup()),
    ),
    button("Curator-cleared export + omissions", () =>
      download("audionaut-v0.2-curator-readiness.json", clearedClipExport()),
    ),
    migrationLabel,
    file,
  );
  dialog.append(heading, help, tools, count, content, status, exports);
  document.body.append(dialog);
  dialog.showModal();
  let lib,
    selected = null,
    buffer = null,
    source = null,
    fields = {},
    offset = 0,
    matches = [],
    controller = null,
    generation = 0;
  function cancel() {
    generation++;
    controller?.abort();
    controller = null;
    stopClipPreview();
  }
  destination.input.onchange = () => {
    cancel();
    message("Destination changed; pending load cancelled.");
  };
  dialog.addEventListener(
    "close",
    () => {
      clearTimeout(searchTimer);
      cancel();
      buffer = peaks = peakBuffer = null;
      dialog.remove();
      if (closeActive === closeDialog) closeActive = null;
    },
    { once: true },
  );
  const closeDialog = () => dialog.close();
  closeActive = closeDialog;
  function message(text, error = false) {
    status.textContent = text;
    status.classList.toggle("error", error);
  }
  const nullable = (n) => (n.value === "" ? null : Number(n.value));
  function draft() {
    const patch = {},
      title = fields.title.value,
      tags = fields.tags.value
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      notes = fields.notes.value;
    if (title !== selected.title) patch.title = title;
    if (canonicalJSON(tags) !== canonicalJSON(selected.tags)) patch.tags = tags;
    if (notes !== selected.notes) patch.notes = notes;
    const start = nullable(fields.start),
      end = nullable(fields.end),
      originalStart =
        selected.region.startSeconds ??
        (selected.region.startFrame == null
          ? null
          : selected.region.startFrame / selected.region.frameRate),
      originalEnd =
        selected.region.endSeconds ??
        (selected.region.endFrame == null
          ? null
          : selected.region.endFrame / selected.region.frameRate);
    if (start !== originalStart || end !== originalEnd)
      patch.region = {
        startSeconds: start,
        endSeconds: end,
        startFrame: null,
        endFrame: null,
        frameRate: null,
        endExclusive: true,
      };
    const lp = {
      ...selected.loop,
      startSeconds: nullable(fields.loopStart),
      endSeconds: nullable(fields.loopEnd),
      bpm: nullable(fields.bpm),
      beats: nullable(fields.beats),
    };
    if (canonicalJSON(lp) !== canonicalJSON(selected.loop)) patch.loop = lp;
    const tuning = { ...selected.tuning, key: fields.key.value || null };
    if (canonicalJSON(tuning) !== canonicalJSON(selected.tuning))
      patch.tuning = tuning;
    return { clip: editClip(selected, patch), patch };
  }
  function playback() {
    return {
      mode: fields.mode.value,
      rate: Number(fields.rate.value),
      reverse: fields.reverse.checked,
      gateSteps: Number(fields.gate.value),
    };
  }
  // Min/max peaks per pixel column are computed once per decoded buffer; slider
  // drags then only redraw the region overlay instead of rescanning the audio.
  let peakBuffer = null,
    peaks = null;
  function waveformPeaks(width) {
    if (peakBuffer === buffer && peaks?.length === width * 2) return peaks;
    const samples = buffer.getChannelData(0),
      out = new Float32Array(width * 2);
    for (let x = 0; x < width; x++) {
      const first = Math.floor((x * samples.length) / width),
        last = Math.floor(((x + 1) * samples.length) / width);
      let lo = 0,
        hi = 0;
      for (let i = first; i < last; i++) {
        const v = samples[i];
        if (v < lo) lo = v;
        if (v > hi) hi = v;
      }
      out[x * 2] = lo;
      out[x * 2 + 1] = hi;
    }
    peakBuffer = buffer;
    return (peaks = out);
  }
  function drawWave() {
    const canvas = fields.wave;
    if (!canvas || !buffer) return;
    const width = 900,
      height = 110;
    if (canvas.width !== width) canvas.width = width;
    if (canvas.height !== height) canvas.height = height;
    const ctx = canvas.getContext("2d"),
      columns = waveformPeaks(width);
    ctx.fillStyle = "#101923";
    ctx.fillRect(0, 0, width, height);
    const start = nullable(fields.start) ?? 0,
      end = nullable(fields.end) ?? buffer.duration;
    ctx.fillStyle = "#22d3ee22";
    ctx.fillRect(
      (start / buffer.duration) * width,
      0,
      ((end - start) / buffer.duration) * width,
      height,
    );
    ctx.strokeStyle = "#2edb84";
    ctx.beginPath();
    for (let x = 0; x < width; x++) {
      ctx.moveTo(x, height / 2 - columns[x * 2] * height * 0.45);
      ctx.lineTo(x, height / 2 - columns[x * 2 + 1] * height * 0.45);
    }
    ctx.stroke();
    ctx.strokeStyle = "#22d3ee";
    for (const seconds of [start, end]) {
      ctx.beginPath();
      ctx.moveTo((seconds / buffer.duration) * width, 0);
      ctx.lineTo((seconds / buffer.duration) * width, height);
      ctx.stroke();
    }
  }
  function updateWaveControls() {
    for (const key of ["startSlider", "endSlider"]) {
      fields[key].disabled = !buffer;
      if (buffer) fields[key].max = buffer.duration;
    }
    if (buffer) {
      fields.startSlider.value = nullable(fields.start) ?? 0;
      fields.endSlider.value = nullable(fields.end) ?? buffer.duration;
      fields.measured.textContent = `Decoded: ${buffer.duration.toFixed(6)} s · ${buffer.sampleRate} Hz · ${buffer.numberOfChannels} channel(s). Measurement does not mark listening or loop review.`;
    }
    drawWave();
  }
  function renderDetail(clip) {
    cancel();
    selected = clip;
    source = lib.sources.find((s) => s.id === clip.sourceId);
    buffer = null;
    fields = {};
    detail.replaceChildren();
    fields.reviewLine = make(
      "p",
      `${clip.review.status} · permission: ${clip.rights.status || "unknown"} · ${clip.category} · ${clip.usageType}`,
    );
    detail.append(make("h3", clip.title), fields.reviewLine);
    const refs = make("div");
    renderOrdinalReferences(refs, [
      {
        id: source.inscriptionId,
        label: `Inscription ${source.number == null ? "" : `#${source.number}`}`,
      },
    ]);
    detail.append(refs);
    detail.append(
      make(
        "p",
        `Reported duration: ${source.reportedDuration == null ? "unknown" : source.reportedDuration + " s"} · Curator measured: ${source.technical.durationSeconds == null ? "unknown" : source.technical.durationSeconds + " s"}`,
      ),
    );
    const notes = make("details"),
      summary = make("summary", "Source notes, permission evidence & review");
    notes.append(
      summary,
      make("p", source.note?.text || "No original note supplied."),
      make(
        "p",
        `Original BPM note: ${source.note?.bpm_reported ?? "unknown"} (reported; does not enable sync).`,
      ),
      make(
        "pre",
        JSON.stringify(
          {
            review: clip.review,
            loopReview: {
              seam: clip.loop.seamVerified,
              tempo: clip.loop.tempoVerified,
            },
            tuning: clip.tuning,
            rights: clip.rights,
            provenance: source.provenance,
            proposal: clip.proposal,
            sourceHashes: source.technical,
          },
          null,
          2,
        ),
      ),
    );
    detail.append(notes);
    const editor = make("div", null, "clip-editor");
    function input(key, label, value, type = "text") {
      const wrap = make("label", label),
        n = make(type === "textarea" ? "textarea" : "input");
      if (type !== "textarea") n.type = type;
      n.value = value ?? "";
      n.setAttribute("aria-label", label);
      if (type === "number") {
        n.min = "0";
        n.step = "any";
      }
      wrap.append(n);
      editor.append(wrap);
      fields[key] = n;
      return n;
    }
    input("title", "Clip title", clip.title);
    input("tags", "Tags", clip.tags.join(", "));
    input("notes", "Personal clip notes", clip.notes, "textarea");
    fields.wave = make("canvas", null, "clip-wave");
    fields.wave.setAttribute(
      "aria-label",
      "Decoded waveform and selected region",
    );
    detail.append(fields.wave);
    fields.measured = make(
      "p",
      source.workstationMeasurement
        ? `Last local decode: ${source.workstationMeasurement.duration} s · ${source.workstationMeasurement.sampleRate} Hz. Preview/load to retrieve its waveform; saved measurements are not cached audio.`
        : "Waveform loads when you preview or load this source.",
    );
    detail.append(fields.measured);
    input(
      "start",
      "Region start (source seconds)",
      clip.region.startSeconds ??
        (clip.region.startFrame == null
          ? null
          : clip.region.startFrame / clip.region.frameRate),
      "number",
    );
    input(
      "end",
      "Region end (blank = decoded end)",
      clip.region.endSeconds ??
        (clip.region.endFrame == null
          ? null
          : clip.region.endFrame / clip.region.frameRate),
      "number",
    );
    for (const [key, label, target] of [
      ["startSlider", "Trim start", "start"],
      ["endSlider", "Trim end", "end"],
    ]) {
      const s = input(key, label, 0, "range");
      s.min = 0;
      s.step = 0.001;
      s.disabled = true;
      s.oninput = () => {
        fields[target].value = s.value;
        drawWave();
      };
    }
    fields.start.oninput = fields.end.oninput = () => updateWaveControls();
    const boundsTools = make("div", null, "clip-toolbar");
    boundsTools.append(
      button("Reset region", () => {
        fields.start.value =
          clip.region.startSeconds ??
          (clip.region.startFrame == null
            ? ""
            : clip.region.startFrame / clip.region.frameRate);
        fields.end.value =
          clip.region.endSeconds ??
          (clip.region.endFrame == null
            ? ""
            : clip.region.endFrame / clip.region.frameRate);
        updateWaveControls();
      }),
      button("Use decoded end", () => {
        if (!buffer)
          return message("Preview this source first to measure its end.");
        fields.end.value = buffer.duration;
        updateWaveControls();
      }),
    );
    editor.append(boundsTools);
    input(
      "loopStart",
      "Loop start (blank = region start)",
      clip.loop.startSeconds,
      "number",
    );
    input(
      "loopEnd",
      "Loop end (blank = region end)",
      clip.loop.endSeconds,
      "number",
    );
    input(
      "bpm",
      `Clip BPM (${clip.loop.tempoVerified === true ? "verified by curator" : "draft / unverified"})`,
      clip.loop.bpm,
      "number",
    );
    input("beats", "Quarter-note beats (manual)", clip.loop.beats, "number");
    input(
      "key",
      `Key (${clip.tuning.verified === true ? "verified by curator" : "draft / unverified"})`,
      clip.tuning.key,
    );
    const mode = select(
      "Playback mode",
      [
        ["one-shot", "One-shot"],
        ["loop", "Repeat loop for gate duration"],
      ],
      "one-shot",
    );
    fields.mode = mode.input;
    editor.append(mode.wrap);
    input("rate", "Playback rate (also changes pitch)", 1, "number");
    fields.rate.min = 0.1;
    fields.rate.max = 4;
    input("gate", "Loop gate (sequencer steps)", 8, "number");
    fields.gate.min = 1;
    fields.gate.max = 64;
    fields.reverse = input("reverse", "Reverse one-shot", null, "checkbox");
    editor.append(
      make(
        "p",
        "Choosing Loop is an explicit playback edit; a proposed loop label never turns it on automatically. BPM notes do not retime audio. Pitch-preserving time stretching is unavailable.",
        "clip-help",
      ),
    );
    const regionEditor = make("div", null, "clip-editor");
    for (const key of ["start", "end", "startSlider", "endSlider"])
      regionEditor.append(fields[key].parentElement);
    regionEditor.append(boundsTools);
    const settings = make("details", null, "clip-settings");
    settings.append(
      make("summary", "Playback settings, musical metadata & personal notes"),
      editor,
    );
    detail.append(regionEditor, mode.wrap, settings);
    const actions = make("div", null, "clip-toolbar");
    const run = async (action) => {
      controller?.abort();
      stopClipPreview();
      controller = new AbortController();
      const signal = controller.signal,
        ticket = ++generation;
      message("Loading selected inscription…");
      try {
        const current = draft(),
          opts = { ...playback(), signal };
        const prepared =
          action === "load"
            ? await loadClip(
                Number(destination.input.value),
                source,
                current.clip,
                opts,
              )
            : await previewClip(
                source,
                action === "whole"
                  ? {
                      ...current.clip,
                      region: {
                        startSeconds: 0,
                        endSeconds: null,
                        startFrame: null,
                        endFrame: null,
                        frameRate: null,
                        endExclusive: true,
                      },
                    }
                  : current.clip,
                {
                  ...opts,
                  ...(action === "whole"
                    ? { mode: "one-shot", reverse: false, rate: 1 }
                    : {}),
                  onEnded: () => {
                    if (ticket === generation) message("Preview finished.");
                  },
                },
              );
        if (signal.aborted || ticket !== generation) return;
        buffer = prepared.result.audioBuffer;
        updateWaveControls();
        try {
          recordClipMeasurement(source.id, prepared.result);
          lib = effectiveLibrary();
          source = lib.sources.find((s) => s.id === source.id);
          selected = lib.clips.find((c) => c.id === selected.id) || selected;
          fields.reviewLine.textContent = `${selected.review.status} · permission: ${selected.rights.status || "unknown"} · ${selected.category} · ${selected.usageType}`;
          fields.bpm.parentElement.firstChild.textContent = `Clip BPM (${selected.loop.tempoVerified === true ? "verified by curator" : "draft / unverified"})`;
        } catch (e) {
          message(
            `Audio ready; measurement could not be saved: ${e.message}`,
            true,
          );
          return;
        }
        message(
          action === "load"
            ? `Loaded “${current.clip.title}” into channel ${Number(destination.input.value) + 1}. Step 1 is active if the channel was empty. Save pins this source and region; Undo restores the previous sound.`
            : "Previewing through the existing engine. The project and sequencer transport are unchanged.",
        );
      } catch (e) {
        if (ticket === generation)
          message(
            e.name === "AbortError"
              ? "Loading or preview cancelled; the current sound was retained."
              : e.message,
            e.name !== "AbortError",
          );
      }
    };
    actions.append(
      button("Preview source", () => run("whole")),
      button("Preview region", () => run("region")),
      button("Stop preview / cancel load", () => {
        cancel();
        message("Preview and pending load stopped.");
      }),
      button("Load region into channel", () => run("load")),
      button("Save personal clip edits", () => {
        try {
          const { patch } = draft();
          saveClipEdits(clip.id, patch);
          lib = effectiveLibrary();
          renderList();
          renderDetail(lib.clips.find((c) => c.id === clip.id));
          message(
            "Personal overlay saved. Curated metadata and existing productions are unchanged.",
          );
        } catch (e) {
          message(e.message, true);
        }
      }),
      button("New independent clip", () => {
        try {
          const { patch } = draft(),
            c = createPersonalClip(clip.id, patch);
          lib = effectiveLibrary();
          renderList();
          renderDetail(c);
          message(
            "Independent personal clip created without curator approvals.",
          );
        } catch (e) {
          message(e.message, true);
        }
      }),
    );
    detail.insertBefore(actions, fields.wave);
    for (const b of list.querySelectorAll(".clip-list-item")) {
      b.classList.toggle("selected", b.dataset.clipId === clip.id);
      b.setAttribute("aria-pressed", String(b.dataset.clipId === clip.id));
    }
    updateWaveControls();
  }
  function renderList() {
    if (!lib) return;
    matches = searchClips(lib, {
      query: search.value,
      ...Object.fromEntries(
        Object.entries(filters).map(([k, n]) => [k, n.value]),
      ),
    });
    offset = 0;
    list.replaceChildren();
    filters.batch.querySelector('option[value="all"]').textContent =
      `All ${lib.sources.length} sources + personal clips`;
    count.textContent = `${matches.length} clips · ${lib.sources.length} source inscriptions · working catalogue`;
    appendRows();
    if (!selected || !matches.some((c) => c.id === selected.id)) {
      cancel(); // the clip being loaded or previewed is no longer in the list
      if (matches.length) renderDetail(matches[0]);
      else {
        detail.replaceChildren(
          make("p", "No matching clips. Change the filters."),
        );
        selected = null;
        buffer = null;
      }
    }
  }
  function appendRows() {
    list.querySelector(".clip-more")?.remove();
    for (const c of matches.slice(offset, offset + 25)) {
      const s = lib.sources.find((s) => s.id === c.sourceId),
        b = button(
          `${c.title}\n#${s.number ?? "?"} · ${c.category} · ${c.review.status}\nPermission: ${c.rights.status || "unknown"}`,
          () => {
            renderDetail(c);
            if (window.matchMedia("(max-width: 650px)").matches)
              detail.scrollIntoView({ block: "start" });
          },
        );
      b.className = "clip-list-item";
      b.dataset.clipId = c.id;
      list.append(b);
    }
    offset += 25;
    if (offset < matches.length) {
      const more = button("Show more clips", appendRows);
      more.className = "clip-more";
      list.append(more);
    }
  }
  file.onchange = async () => {
    const f = file.files[0];
    if (!f) return;
    cancel();
    try {
      if (f.size > 20 * 1024 * 1024)
        throw Error("Catalogue file exceeds 20 MB.");
      const data = JSON.parse(await f.text());
      lib =
        data.version === 1 && data.base
          ? importClipBackup(data)
          : refreshClipLibrary(data, { migrateV01: migration.checked });
      selected = null;
      renderList();
      message(
        "Catalogue refreshed. Personal overlays and pinned project clips were retained.",
      );
    } catch (e) {
      message(
        `Import rejected; library and project retained. ${e.message}`,
        true,
      );
    } finally {
      file.value = "";
    }
  };
  try {
    lib = await getClipLibrary();
    if (dialog.open) renderList();
  } catch (e) {
    message(e.message, true);
  }
}
export function initSamplesLoops() {
  document.querySelector("#btn-samples-loops").onclick = () =>
    openSamplesLoops();
  document.addEventListener("audionaut:samples-loops", (e) =>
    openSamplesLoops(e.detail || {}),
  );
}
