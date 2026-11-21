import { sustainDuration, sampleLoop } from "./onboard-library.js";
import { store } from "./state.js";
import { engine } from "./engine.js";
import {
  audioAnalysis,
  encodeWav,
  downloadBlob,
  reportCsv,
} from "./audio-utils.js";
import { setStatus } from "./ui.js";
import { renderOrdinalReferences } from "./ordinal-links.js";
let closeActive, recorder, destination;
const make = (tag, text) => {
  const n = document.createElement(tag);
  if (text !== undefined) n.textContent = text;
  return n;
};
export function openAudioTools({ ch = 0, step = null } = {}) {
  closeActive?.();
  const dialog = make("dialog");
  dialog.className = "audio-tools";
  dialog.setAttribute("aria-label", "Audio tools");
  const title = make("div");
  title.className = "browser-title";
  title.append(make("h2", "Audio Tools"));
  const close = () => {
    off();
    dialog.close();
    dialog.remove();
    if (closeActive === close) closeActive = null;
  };
  closeActive = close;
  const closeBtn = make("button", "Close");
  closeBtn.onclick = close;
  title.append(closeBtn);
  const channel = make("select");
  channel.setAttribute("aria-label", "Analyse channel");
  for (let i = 0; i < store.numChannels; i++) {
    const o = make("option", `${i + 1} · ${store.channel(i).name}`);
    o.value = i;
    channel.append(o);
  }
  channel.value = ch;
  const status = make("p"),
    report = make("dl"),
    actions = make("div");
  const sourceLinks = make("div");
  sourceLinks.className = "ordinal-links";
  actions.className = "source-actions";
  status.setAttribute("role", "status");
  const exportWav = make("button", "Export selected section WAV"),
    exportCsv = make("button", "Export analysis CSV");
  actions.append(exportWav, exportCsv);
  const beats = make("input");
  beats.type = "number";
  beats.min = "1";
  beats.max = "256";
  beats.value = "4";
  beats.setAttribute("aria-label", "Beats in selected loop");
  const bpm = make("p"),
    loopLabel = make("label", "Beats in selected loop ");
  loopLabel.append(beats);
  let buffer, analysis, params;
  function refresh() {
    renderOrdinalReferences(sourceLinks, [
      {
        source: store.channel(+channel.value).source,
        label: "Sample inscription",
      },
    ]);
    buffer = engine.bufferOf(+channel.value);
    report.replaceChildren();
    exportWav.disabled = exportCsv.disabled = !buffer;
    if (!buffer) {
      status.textContent = "Load audio into this channel first.";
      bpm.textContent = "";
      return;
    }
    const c = store.channel(+channel.value),
      over =
        step !== null ? store.cellRegions(+channel.value, step)[0] || null : null;
    params = {
      start: (over?.trimStart ?? c.trimStart) * buffer.duration,
      end: (over?.trimEnd ?? c.trimEnd) * buffer.duration,
      reverse: over?.rev ?? c.reverse,
      pitch: over?.pitch ?? c.pitch,
      loop: sampleLoop(c),
      sustainSeconds: sustainDuration(c, over, buffer, store.project.bpm),
    };
    analysis = audioAnalysis(buffer);
    status.textContent = `${c.sampleName || c.name}${step !== null ? ` · step ${step + 1}` : ""} · selected ${params.start.toFixed(3)}–${params.end.toFixed(3)}s`;
    const rows = [
      ["Duration", `${analysis.duration.toFixed(3)} s`],
      ["Sample rate", `${analysis.sampleRate.toLocaleString()} Hz`],
      ["Channels", analysis.channels],
      [
        "Peak",
        analysis.peakDb === null
          ? "Silence"
          : `${analysis.peakDb.toFixed(2)} dBFS`,
      ],
      [
        "RMS",
        analysis.rmsDb === null
          ? "Silence"
          : `${analysis.rmsDb.toFixed(2)} dBFS`,
      ],
      ["DC offset", analysis.dcOffset.toFixed(6)],
      ["Samples below −60 dBFS", `${analysis.silencePercent.toFixed(2)}%`],
    ];
    for (const [name, value] of rows)
      report.append(make("dt", name), make("dd", String(value)));
    calcBpm();
  }
  function calcBpm() {
    const value = beats.valueAsNumber;
    bpm.textContent =
      buffer && value > 0
        ? `Tempo from your beat count: ${((60 * value) / ((params.end - params.start) / params.pitch)).toFixed(2)} BPM. This is not automatic beat detection.`
        : "";
  }
  exportWav.onclick = () => {
    try {
      downloadBlob(
        encodeWav(buffer, params),
        `channel-${+channel.value + 1}-section.wav`,
      );
    } catch (e) {
      status.textContent = e.message;
    }
  };
  exportCsv.onclick = () => {
    const c = store.channel(+channel.value);
    downloadBlob(
      new Blob(
        [
          reportCsv([
            [
              "Name",
              "Source type",
              "Source ID / URL",
              ...Object.keys(analysis),
              "Selection start (s)",
              "Selection end (s)",
            ],
            [
              c.sampleName,
              c.source?.type,
              c.source?.value?.startsWith("data:")
                ? "Embedded local file"
                : c.source?.value,
              ...Object.values(analysis),
              params.start,
              params.end,
            ],
          ]),
        ],
        { type: "text/csv" },
      ),
      "audio-analysis.csv",
    );
  };
  channel.onchange = () => {
    step = null;
    refresh();
  };
  beats.oninput = calcBpm;
  dialog.append(
    title,
    channel,
    sourceLinks,
    status,
    report,
    actions,
    loopLabel,
    bpm,
  );
  const off = store.on("load", close);
  dialog.addEventListener("cancel", (e) => {
    e.preventDefault();
    close();
  });
  document.body.append(dialog);
  dialog.showModal();
  refresh();
}
export function initAudioTools() {
  document.querySelector("#btn-audio-tools").onclick = () => openAudioTools();
  document.addEventListener("l1xl2:tools", (e) => openAudioTools(e.detail));
  const record = document.querySelector("#btn-record-mix");
  record.onclick = () => {
    if (recorder) {
      recorder.stop();
      return;
    }
    try {
      if (!globalThis.MediaRecorder)
        throw new Error("Mix recording is not supported in this browser.");
      const ctx = engine.ensureContext();
      destination = ctx.createMediaStreamDestination();
      engine.masterGain.connect(destination);
      const mime = [
        "audio/webm;codecs=opus",
        "audio/ogg;codecs=opus",
        "audio/webm",
      ].find((type) => MediaRecorder.isTypeSupported(type));
      recorder = new MediaRecorder(
        destination.stream,
        mime ? { mimeType: mime } : undefined,
      );
      const chunks = [];
      const active = recorder,
        sink = destination;
      let finished = false,
        failed = false;
      recorder.ondataavailable = (e) => {
        if (e.data.size) chunks.push(e.data);
      };
      const finish = () => {
        if (finished) return;
        finished = true;
        engine.masterGain.disconnect(sink);
        for (const track of sink.stream.getTracks()) track.stop();
        recorder = null;
        destination = null;
        record.textContent = "Record mix";
        record.classList.remove("active");
      };
      recorder.onstop = () => {
        const type = active.mimeType;
        finish();
        if (failed) return;
        if (chunks.length)
          downloadBlob(
            new Blob(chunks, { type }),
            `audional-mix.${type.includes("ogg") ? "ogg" : "webm"}`,
          );
        setStatus("Mix recording exported.");
      };
      recorder.onerror = () => {
        failed = true;
        finish();
        setStatus("Mix recording failed.", true);
      };
      recorder.start(1000);
      record.textContent = "Stop recording";
      record.classList.add("active");
      setStatus(
        "Recording the master output. Play the sequence, then stop recording to export.",
      );
    } catch (e) {
      if (destination) {
        try {
          engine.masterGain.disconnect(destination);
        } catch {}
        destination = null;
      }
      recorder = null;
      setStatus(e.message, true);
    }
  };
}
