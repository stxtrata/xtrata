import { LANDMARKS, songToProject } from "./song-format.js";
import { engine } from "./engine.js";
import { fetchAndDecode, resolveSource } from "./loader.js";
import { downloadBlob } from "./audio-utils.js";
import { renderOrdinalReferences } from "./ordinal-links.js";
const MAX_DOCUMENT = 4 * 1024 * 1024,
  MAX_AUDIO = 256 * 1024 * 1024;
let completion = null;
let ticket = 0,
  controller = null,
  timer = null,
  tail = null,
  frame = null;
const voices = new Set();
export function stopSongAudition(error = null) {
  ticket++;
  controller?.abort();
  controller = null;
  clearTimeout(timer);
  clearTimeout(tail);
  timer = tail = null;
  for (const [source, gain] of voices) {
    try {
      source.stop();
    } catch {}
    source.disconnect();
    gain.disconnect();
  }
  voices.clear();
  frame?.remove();
  frame = null;
  const done = completion;
  completion = null;
  done?.(error);
}
engine.stopSongPreview = stopSongAudition;
// Reading song instructions never executes the HTML/song inscription in the app.
export async function fetchSong(id, { signal = null } = {}) {
  const landmark = LANDMARKS[id];
  if (landmark?.kind !== "song")
    throw new Error("This landmark has no fixed song session.");
  const response = await fetch(
    resolveSource({ type: "ordinal", value: landmark.data }),
    { signal },
  );
  if (!response.ok)
    throw new Error(`Song instructions failed (${response.status}).`);
  const read = async (body) => {
    const reader = body.getReader(),
      chunks = [];
    let size = 0;
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.length;
        if (size > MAX_DOCUMENT)
          throw new Error("Song instructions exceed 4 MB.");
        chunks.push(value);
      }
    } finally {
      await reader.cancel();
      reader.releaseLock();
    }
    const bytes = new Uint8Array(size);
    let pos = 0;
    for (const c of chunks) {
      bytes.set(c, pos);
      pos += c.length;
    }
    return bytes;
  };
  if (Number(response.headers.get("content-length")) > MAX_DOCUMENT)
    throw new Error("Song instructions exceed 4 MB.");
  let bytes = await read(response.body);
  if (bytes[0] === 31 && bytes[1] === 139)
    bytes = await read(
      new Blob([bytes]).stream().pipeThrough(new DecompressionStream("gzip")),
    );
  if (signal?.aborted)
    throw new DOMException("Loading cancelled.", "AbortError");
  return songToProject(JSON.parse(new TextDecoder().decode(bytes)), {
    inscription: id,
    data: landmark.data,
    engine: landmark.engine,
    endStep: landmark.endStep,
  });
}
export async function exportSongSession(id, signal = null) {
  const project = await fetchSong(id, { signal });
  downloadBlob(
    new Blob([JSON.stringify(project, null, 2)], { type: "application/json" }),
    `${project.projectName.replace(/[^\w -]/g, "")}-L1xL2.json`,
  );
  return project;
}
export async function auditionSong(id, status = () => {}, onEnded = null) {
  engine.stopPreview();
  completion = onEnded;
  const version = ticket;
  controller = new AbortController();
  const signal = controller.signal;
  const ctx = engine.ensureContext();
  await ctx.resume();
  status("Reading on-chain song instructions…");
  try {
    const project = await fetchSong(id, { signal });
    const buffers = [];
    let size = 0;
    for (let ch = 0; ch < project.channels.length; ch++) {
      const c = project.channels[ch];
      if (!c.source) {
        buffers.push(null);
        continue;
      }
      status(`Loading song samples ${ch + 1}/${project.channels.length}…`);
      const { audioBuffer } = await fetchAndDecode(c.source, { signal });
      if (version !== ticket || signal.aborted) return;
      size += audioBuffer.length * audioBuffer.numberOfChannels * 4;
      if (size > MAX_AUDIO)
        throw new Error("Decoded song exceeds the 256 MB audition limit.");
      buffers.push(audioBuffer);
    }
    if (version !== ticket || signal.aborted) return;
    const reversed = new Map();
    let step = 0,
      time = ctx.currentTime + 0.05,
      endTime = time;
    const dt = 60 / project.bpm / 4;
    const schedule = () => {
      if (version !== ticket) return;
      try {
        while (time < ctx.currentTime + 0.12 && step < project.songEndStep) {
          const seq = project.sequences[Math.floor(step / 64)];
          seq.steps.forEach((row, ch) => {
            const active = row[step % 64],
              c = project.channels[ch];
            let buffer = buffers[ch];
            if (!active || !buffer) return;
            const reverse = !!active.rev;
            if (reverse) {
              if (!reversed.has(ch)) {
                const rev = ctx.createBuffer(
                  buffer.numberOfChannels,
                  buffer.length,
                  buffer.sampleRate,
                );
                for (let i = 0; i < buffer.numberOfChannels; i++)
                  rev
                    .getChannelData(i)
                    .set(buffer.getChannelData(i).slice().reverse());
                size += rev.length * rev.numberOfChannels * 4;
                if (size > MAX_AUDIO)
                  throw new Error(
                    "Decoded song exceeds the 256 MB audition limit.",
                  );
                reversed.set(ch, rev);
              }
              buffer = reversed.get(ch);
            }
            const source = ctx.createBufferSource(),
              gain = ctx.createGain();
            source.buffer = buffer;
            source.playbackRate.value = c.pitch;
            gain.gain.value = c.volume;
            source.connect(gain).connect(engine.masterGain);
            const voice = [source, gain];
            voices.add(voice);
            source.onended = () => {
              voices.delete(voice);
              source.disconnect();
              gain.disconnect();
            };
            const late = Math.min(0.999, Math.max(0, +active.off || 0)) * dt;
            source.start(
              time + late,
              (reverse ? 1 - c.trimEnd : c.trimStart) * buffer.duration,
              (c.trimEnd - c.trimStart) * buffer.duration,
            );
            endTime = Math.max(
              endTime,
              time +
                late +
                ((c.trimEnd - c.trimStart) * buffer.duration) / c.pitch,
            );
          });
          step++;
          time += dt;
        }
        if (step < project.songEndStep) timer = setTimeout(schedule, 25);
        else
          tail = setTimeout(
            () => {
              if (version === ticket) {
                stopSongAudition();
                status("Song audition finished.");
              }
            },
            Math.max(0, Math.max(time, endTime) - ctx.currentTime) * 1000 + 100,
          );
      } catch (error) {
        stopSongAudition(error);
        status(`Song playback failed: ${error.message}`, true);
      }
    };
    schedule();
    status(
      `Playing song “${project.projectName}” · ${project.channels.length} channels · ${project.bpm} BPM. Your session is unchanged.`,
    );
    return project;
  } catch (error) {
    if (version === ticket) {
      stopSongAudition(error);
      throw error;
    }
  }
}
export function openHistoricPlayer(id, container, status = () => {}) {
  engine.stopPreview();
  const wrapper = document.createElement("div");
  wrapper.className = "historic-player";
  const hint = document.createElement("p");
  hint.textContent =
    "Original on-chain application. Press its Play control when loading finishes. Stop or close the loader to end playback.";
  const player = document.createElement("iframe");
  player.title = "Original on-chain Audional player";
  // A remote origin keeps original inscription scripts separate from the local app.
  player.sandbox = "allow-scripts allow-same-origin";
  player.allow = "autoplay";
  player.src = "https://ordinals.com/content/" + id;
  const links = document.createElement("div");
  links.className = "ordinal-links";
  renderOrdinalReferences(links, [{ id, label: "Original application" }]);
  wrapper.append(hint, links, player);
  container.append(wrapper);
  frame = wrapper;
  status(
    "Opened original on-chain player. Use its Play control after loading.",
  );
}
