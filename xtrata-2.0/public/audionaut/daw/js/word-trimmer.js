import { validateWordSelection } from "./word-index.js";

// Only small waveform peaks are retained, not an AudioBuffer for every result.
export function createWordTrimmer(
  item,
  { onEdit = () => {}, onWaveform = () => {} } = {},
) {
  const make = (tag, text, cls) => {
    const el = document.createElement(tag);
    if (text) el.textContent = text;
    if (cls) el.className = cls;
    return el;
  };
  const element = make("div", null, "word-trimmer");
  let pad = Math.max(0.35, Math.min(1, (item.end - item.start) * 0.4)),
    duration = null,
    peaks = null,
    disposed = false;
  let low = Math.max(0, item.start - pad),
    high = item.end + pad,
    drag = null;
  const hint = make(
    "p",
    "Waveform loads automatically. You can adjust the trim sliders while it loads.",
    "word-trim-hint",
  );
  const canvas = make("canvas", null, "word-waveform");
  canvas.height = 100;
  canvas.width = 640;
  canvas.setAttribute("role", "img");
  canvas.setAttribute(
    "aria-label",
    `Waveform around ${item.text}. Drag either selection edge or use the trim sliders.`,
  );
  const controls = make("div", null, "word-trim-controls");
  function field(kind, value) {
    const wrap = make("div", null, "word-trim-field"),
      header = make("label", `${kind === "start" ? "Start" : "End"} (s)`);
    const number = make("input");
    number.type = "number";
    number.min = "0";
    number.step = ".001";
    number.value = value;
    number.setAttribute(
      "aria-label",
      `${kind === "start" ? "Start" : "End"} (s)`,
    );
    header.append(number);
    const slider = make("input");
    slider.type = "range";
    slider.step = ".001";
    slider.setAttribute("aria-label", `Trim ${kind}`);
    slider.addEventListener("input", () => {
      const other =
        kind === "start"
          ? end.number.valueAsNumber
          : start.number.valueAsNumber;
      const next =
        kind === "start"
          ? Math.min(slider.valueAsNumber, other - 0.001)
          : Math.max(slider.valueAsNumber, other + 0.001);
      number.value = Math.max(low, Math.min(high, next)).toFixed(3);
      changed();
    });
    number.addEventListener("input", changed);
    wrap.append(header, slider);
    controls.append(wrap);
    return { number, slider };
  }
  const start = field("start", item.start),
    end = field("end", item.end);
  const actions = make("div", null, "word-trim-actions"),
    readout = make("output");
  readout.className = "word-trim-duration";
  const reset = make("button", "Reset trims");
  reset.type = "button";
  reset.title = "Return both edges to the original word timings";
  reset.onclick = () => {
    start.number.value = item.start;
    end.number.value = item.end;
    changed();
  };
  const show = make("button", "Refresh waveform");
  show.type = "button";
  show.onclick = () => onWaveform(api);
  const wider = make("button", "Wider view");
  wider.type = "button";
  wider.title = "Show more audio before and after the selected word";
  wider.onclick = () => {
    pad *= 2;
    low = Math.max(0, low - pad);
    high = duration === null ? high + pad : Math.min(duration, high + pad);
    const a = start.number.valueAsNumber,
      b = end.number.valueAsNumber;
    if (Number.isFinite(a) && a >= 0) low = Math.min(low, a);
    if (Number.isFinite(b) && b > 0 && (duration === null || b <= duration))
      high = Math.max(high, b);
    peaks = null;
    sync();
    onWaveform(api);
  };
  actions.append(reset, show, wider, readout);
  element.append(canvas, controls, actions, hint);
  function changed() {
    onEdit();
    sync();
  }
  function sync() {
    for (const { slider, number } of [start, end]) {
      slider.min = low;
      slider.max = high;
      slider.value = number.value;
      slider.setAttribute(
        "aria-valuetext",
        `${Number(number.value).toFixed(3)} seconds`,
      );
    }
    const a = start.number.valueAsNumber,
      b = end.number.valueAsNumber;
    const valid = Number.isFinite(a) && Number.isFinite(b) && a >= 0 && b > a;
    readout.textContent = valid
      ? `${(b - a).toFixed(3)} s selected`
      : "Choose an end after the start";
    element.classList.toggle("invalid", !valid);
    draw();
  }
  function draw() {
    if (disposed) return;
    const width = Math.max(
        1,
        Math.round(canvas.getBoundingClientRect().width || 640),
      ),
      ratio = window.devicePixelRatio || 1;
    if (canvas.width !== Math.round(width * ratio))
      canvas.width = Math.round(width * ratio);
    if (canvas.height !== Math.round(100 * ratio))
      canvas.height = Math.round(100 * ratio);
    const g = canvas.getContext("2d");
    g.setTransform(ratio, 0, 0, ratio, 0, 0);
    g.clearRect(0, 0, width, 100);
    g.fillStyle = "#101821";
    g.fillRect(0, 0, width, 100);
    const x = (seconds) =>
      Math.max(0, Math.min(width, ((seconds - low) / (high - low)) * width));
    const a = start.number.valueAsNumber,
      b = end.number.valueAsNumber;
    if (Number.isFinite(a) && Number.isFinite(b) && b > a) {
      g.fillStyle = "#22d3ee24";
      g.fillRect(x(a), 0, x(b) - x(a), 100);
    }
    g.strokeStyle = "#3a4d60";
    g.beginPath();
    g.moveTo(0, 50);
    g.lineTo(width, 50);
    g.stroke();
    if (peaks) {
      g.strokeStyle = "#93b7d3";
      g.beginPath();
      for (let i = 0; i < peaks.length; i++) {
        const at = ((i + 0.5) / peaks.length) * width;
        g.moveTo(at, 50 - peaks[i][1] * 35);
        g.lineTo(at, 50 - peaks[i][0] * 35);
      }
      g.stroke();
    } else {
      g.fillStyle = "#9aaabc";
      g.font = "12px sans-serif";
      g.fillText(
        element.dataset.waveform === "error"
          ? "Waveform unavailable · Retry waveform"
          : "Loading waveform…",
        12,
        47,
      );
    }
    g.setLineDash([3, 4]);
    g.strokeStyle = "#8695a7";
    for (const original of [item.start, item.end]) {
      g.beginPath();
      g.moveTo(x(original), 4);
      g.lineTo(x(original), 79);
      g.stroke();
    }
    g.setLineDash([]);
    g.strokeStyle = "#22d3ee";
    g.lineWidth = 2;
    for (const value of [a, b])
      if (Number.isFinite(value)) {
        const at = x(value);
        g.beginPath();
        g.moveTo(at, 2);
        g.lineTo(at, 81);
        g.stroke();
        g.fillStyle = "#22d3ee";
        g.fillRect(Math.max(0, Math.min(width - 6, at - 3)), 2, 6, 10);
      }
    g.lineWidth = 1;
    g.fillStyle = "#9aaabc";
    g.font = "10px monospace";
    g.fillText(`${low.toFixed(3)}s`, 6, 94);
    const label = `${high.toFixed(3)}s`;
    g.fillText(label, width - g.measureText(label).width - 6, 94);
  }
  canvas.addEventListener("pointerdown", (event) => {
    if (element.closest('[aria-busy="true"]')) return;
    const r = canvas.getBoundingClientRect(),
      value = low + ((event.clientX - r.left) / r.width) * (high - low);
    drag =
      Math.abs(value - start.number.valueAsNumber) <=
      Math.abs(value - end.number.valueAsNumber)
        ? "start"
        : "end";
    canvas.setPointerCapture(event.pointerId);
    move(event);
    event.preventDefault();
  });
  function move(event) {
    if (!drag) return;
    const r = canvas.getBoundingClientRect(),
      value = Math.max(
        low,
        Math.min(
          high,
          low + ((event.clientX - r.left) / r.width) * (high - low),
        ),
      );
    const next =
      drag === "start"
        ? Math.min(value, end.number.valueAsNumber - 0.001)
        : Math.max(value, start.number.valueAsNumber + 0.001);
    (drag === "start" ? start : end).number.value = Math.max(
      low,
      Math.min(high, next),
    ).toFixed(3);
    changed();
  }
  canvas.addEventListener("pointermove", move);
  for (const event of ["pointerup", "pointercancel", "lostpointercapture"])
    canvas.addEventListener(event, () => {
      drag = null;
    });
  const observer = new ResizeObserver(draw);
  observer.observe(canvas);
  const api = {
    element,
    selection: () =>
      validateWordSelection({
        ...item,
        start: start.number.valueAsNumber,
        end: end.number.valueAsNumber,
      }),
    setLoading() {
      if (disposed) return;
      element.dataset.waveform = "loading";
      hint.textContent =
        "Loading waveform automatically. You can adjust the trim sliders while it loads.";
      show.textContent = "Refresh waveform";
      draw();
    },
    setError(message) {
      if (disposed) return;
      element.dataset.waveform = "error";
      hint.textContent = `Waveform could not load: ${message} Use Retry waveform to try again.`;
      show.textContent = "Retry waveform";
      draw();
    },
    setAudioBuffer(buffer) {
      if (disposed) return;
      element.dataset.waveform = "ready";
      duration = buffer.duration;
      low = Math.min(low, Math.max(0, duration - 0.001));
      high = Math.min(high, duration);
      const data = buffer.getChannelData(0),
        first = Math.floor(low * buffer.sampleRate),
        last = Math.min(data.length, Math.ceil(high * buffer.sampleRate));
      peaks = [];
      let maximum = 0;
      for (let bin = 0; bin < 640; bin++) {
        const a = Math.floor(first + ((last - first) * bin) / 640),
          b = Math.max(
            a + 1,
            Math.floor(first + ((last - first) * (bin + 1)) / 640),
          );
        let min = 0,
          max = 0;
        for (let i = a; i < Math.min(b, data.length); i++) {
          min = Math.min(min, data[i]);
          max = Math.max(max, data[i]);
        }
        peaks.push([min, max]);
        maximum = Math.max(maximum, -min, max);
      }
      if (maximum > 0)
        peaks = peaks.map(([a, b]) => [a / maximum, b / maximum]);
      hint.textContent =
        "Drag the cyan edges or use the sliders. Dashed lines mark the original word timings.";
      show.textContent = "Refresh waveform";
      sync();
    },
    dispose() {
      disposed = true;
      observer.disconnect();
    },
  };
  sync();
  return api;
}
