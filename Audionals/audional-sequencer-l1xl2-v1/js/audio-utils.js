// Decoded-audio measurements and PCM export. No network or project mutations.
export function audioAnalysis(buffer) {
  let peak = 0,
    sum = 0,
    dc = 0,
    silent = 0,
    count = 0;
  for (let c = 0; c < buffer.numberOfChannels; c++) {
    const data = buffer.getChannelData(c);
    for (const value of data) {
      peak = Math.max(peak, Math.abs(value));
      sum += value * value;
      dc += value;
      if (Math.abs(value) < 0.001) silent++;
      count++;
    }
  }
  const rms = Math.sqrt(sum / count);
  return {
    duration: buffer.duration,
    sampleRate: buffer.sampleRate,
    channels: buffer.numberOfChannels,
    peak,
    peakDb: peak ? 20 * Math.log10(peak) : null,
    rms,
    rmsDb: rms ? 20 * Math.log10(rms) : null,
    dcOffset: dc / count,
    silencePercent: (100 * silent) / count,
  };
}

export function selectionBounds(buffer, start = 0, end = buffer.duration) {
  if (
    !Number.isFinite(start) ||
    !Number.isFinite(end) ||
    start < 0 ||
    end <= start ||
    start >= buffer.duration ||
    end > buffer.duration + 0.001
  )
    throw new Error("Choose start/end times within the available audio.");
  return { start, end: Math.min(end, buffer.duration) };
}

export function encodeWav(
  buffer,
  {
    start = 0,
    end = buffer.duration,
    reverse = false,
    pitch = 1,
    loop = null,
    sustainSeconds = null,
  } = {},
) {
  const bounds = selectionBounds(buffer, start, end);
  if (!Number.isFinite(pitch) || pitch < 0.1 || pitch > 4)
    throw new Error("Playback speed must be between 0.1 and 4.");
  const first = Math.floor(bounds.start * buffer.sampleRate),
    last = Math.min(buffer.length, Math.ceil(bounds.end * buffer.sampleRate));
  const sustained =
    loop &&
    !reverse &&
    sustainSeconds > 0 &&
    start <= loop.start &&
    end >= loop.end;
  const frames = Math.max(
      1,
      sustained
        ? Math.ceil(sustainSeconds * buffer.sampleRate)
        : Math.ceil((last - first) / pitch),
    ),
    channels = buffer.numberOfChannels;
  const bytes = frames * channels * 2;
  if (bytes > 200 * 1024 * 1024)
    throw new Error("This WAV is too large. Export a shorter section.");
  const output = new ArrayBuffer(44 + bytes),
    view = new DataView(output);
  const text = (at, s) => {
    for (let i = 0; i < s.length; i++) view.setUint8(at + i, s.charCodeAt(i));
  };
  text(0, "RIFF");
  view.setUint32(4, 36 + bytes, true);
  text(8, "WAVE");
  text(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, channels, true);
  view.setUint32(24, buffer.sampleRate, true);
  view.setUint32(28, buffer.sampleRate * channels * 2, true);
  view.setUint16(32, channels * 2, true);
  view.setUint16(34, 16, true);
  text(36, "data");
  view.setUint32(40, bytes, true);
  for (let c = 0; c < channels; c++) {
    const data = buffer.getChannelData(c);
    for (let f = 0; f < frames; f++) {
      let position = reverse ? last - 1 - f * pitch : first + f * pitch;
      if (sustained && position >= loop.end * buffer.sampleRate)
        position =
          loop.start * buffer.sampleRate +
          ((position - loop.start * buffer.sampleRate) %
            ((loop.end - loop.start) * buffer.sampleRate));
      const i = Math.max(first, Math.min(last - 1, Math.floor(position))),
        next = Math.min(last - 1, i + 1);
      const fraction = Math.max(0, Math.min(1, position - i));
      const envelope = sustained
        ? Math.min(
            1,
            f / Math.max(1, buffer.sampleRate * 0.005),
            (frames - 1 - f) / Math.max(1, buffer.sampleRate * 0.005),
          )
        : 1;
      const value =
        envelope *
        Math.max(
          -1,
          Math.min(1, data[i] * (1 - fraction) + data[next] * fraction),
        );
      view.setInt16(
        44 + (f * channels + c) * 2,
        value < 0 ? value * 32768 : value * 32767,
        true,
      );
    }
  }
  return new Blob([output], { type: "audio/wav" });
}

export function downloadBlob(blob, name) {
  const url = URL.createObjectURL(blob),
    a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function reportCsv(rows) {
  const quote = (value) =>
    '"' +
    (
      (typeof value === "string" && /^[=+@\-\t\r]/.test(value) ? "'" : "") +
      String(value ?? "")
    ).replaceAll('"', '""') +
    '"';
  return rows.map((row) => row.map(quote).join(",")).join("\r\n");
}
