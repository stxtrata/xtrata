import { store } from "./state.js";
import { engine } from "./engine.js";
import {
  fetchAndDecode,
  assignDecodedSample,
  reserveSampleAssignment,
} from "./loader.js";
import {
  copy,
  resolveClipRegion,
  canonicalJSON,
  sha256Text,
  validateClipSnapshot,
  parseClipLibrary,
  toDraftManifest,
} from "./clip-contract.js";
import { record } from "./history.js";
export function clipSource(source) {
  return {
    type: "ordinal",
    value: source.inscriptionId,
    label: source.title,
    sourceSha256:
      source.technical.sourceHash ?? source.workstationMeasurement?.sourceHash,
    audioSha256:
      source.technical.payloadHash ??
      source.workstationMeasurement?.payloadHash,
  };
}
export async function prepareClip(source, clip, options = {}) {
  if (clip.sourceId !== source.id)
    throw Error("Clip belongs to a different inscription.");
  parseClipLibrary(
    toDraftManifest({ sources: [source], clips: [clip], batches: [] }),
  );
  const result = await fetchAndDecode(clipSource(source), {
    signal: options.signal,
    catalogue: true,
  });
  const playback = resolveClipRegion(clip, result.audioBuffer, options);
  if (
    (source.technical.sampleRate != null &&
      source.technical.sampleRate !== result.audioBuffer.sampleRate) ||
    (source.technical.frames != null &&
      source.technical.frames !== result.audioBuffer.length)
  )
    playback.frameBasisChanged = true;
  const content = {
    version: 1,
    source: copy(source),
    clip: copy(clip),
    playback,
    decoded: {
      duration: result.audioBuffer.duration,
      sampleRate: result.audioBuffer.sampleRate,
      frames: result.audioBuffer.length,
      channels: result.audioBuffer.numberOfChannels,
    },
    retrieved: {
      sourceHash: result.sourceHash,
      payloadHash: result.payloadHash,
      verificationScope:
        "Fetched byte fingerprints, not independent chain proofs.",
    },
    effectiveVerification: {
      tempo: clip.loop.tempoVerified === true && !playback.frameBasisChanged,
      seam: clip.loop.seamVerified === true && !playback.frameBasisChanged,
      tuning: clip.tuning.verified === true,
    },
  };
  return {
    result,
    snapshot: { ...content, snapshotHash: sha256Text(canonicalJSON(content)) },
  };
}
export async function loadClip(ch, source, clip, options = {}) {
  const project = store.project,
    channel = store.channel(ch),
    sequence = store.seq,
    stillCurrent = reserveSampleAssignment(ch);
  if (!channel) throw Error("Choose an available sample channel.");
  const { result, snapshot } = await prepareClip(source, clip, options);
  if (
    options.signal?.aborted ||
    !stillCurrent() ||
    project !== store.project ||
    !project.sequences.includes(sequence)
  )
    throw new DOMException(
      "The destination changed while loading.",
      "AbortError",
    );
  record(true);
  const pinnedSource = {
    ...clipSource(source),
    label: clip.title,
    sourceSha256: result.sourceHash,
    audioSha256: result.payloadHash,
  };
  assignDecodedSample(ch, pinnedSource, result);
  Object.assign(channel, {
    clipSnapshot: snapshot,
    trimStart: snapshot.playback.start / result.audioBuffer.duration,
    trimEnd: snapshot.playback.end / result.audioBuffer.duration,
    pitch: snapshot.playback.rate,
    reverse: snapshot.playback.reverse,
    gateSteps: snapshot.playback.gateSteps,
    unresolvedSource: null,
  });
  if (!store.regions(ch, sequence).length) store.setStep(ch, 0, 1, sequence);
  store.emit("channel", { ch, prop: "clipSnapshot" });
  store.emit("sequence", project.currentSequence);
  record(true);
  return { result, snapshot };
}
export async function restoreClipChannel(ch) {
  const project = store.project,
    channel = store.channel(ch),
    stillCurrent = reserveSampleAssignment(ch),
    s = validateClipSnapshot(channel.clipSnapshot);
  const result = await fetchAndDecode(channel.source, { catalogue: true });
  if (!stillCurrent() || project !== store.project)
    throw new DOMException("Destination changed.", "AbortError");
  // Restore the pinned choice, never a current-library clip. Reject incompatible decodes.
  const referenceDuration = channel.analysis?.duration ?? s.decoded.duration,
    start = channel.trimStart * referenceDuration,
    end = channel.trimEnd * referenceDuration;
  resolveClipRegion(
    {
      ...s.clip,
      region: { ...s.clip.region, startSeconds: start, endSeconds: end },
      loop: s.playback.loop
        ? {
            ...s.clip.loop,
            startSeconds: s.playback.loop.start,
            endSeconds: s.playback.loop.end,
          }
        : s.clip.loop,
    },
    result.audioBuffer,
    {
      mode:
        s.playback.mode === "loop" && !channel.reverse && channel.gateSteps > 0
          ? "loop"
          : "one-shot",
      rate: channel.pitch,
      reverse: channel.reverse,
      gateSteps: channel.gateSteps,
    },
  );
  assignDecodedSample(ch, channel.source, result, { reset: false });
  channel.trimStart = start / result.audioBuffer.duration;
  channel.trimEnd = end / result.audioBuffer.duration;
  channel.unresolvedSource = null;
  return result;
}
let previewTicket = 0,
  previewController = null;
function cancelPendingPreview() {
  previewTicket++;
  previewController?.abort();
  previewController = null;
}
engine.stopCataloguePreview = cancelPendingPreview;
export function stopClipPreview() {
  cancelPendingPreview();
  engine.stopPreview();
}
export async function previewClip(source, clip, options = {}) {
  if (options.signal?.aborted)
    throw new DOMException("Preview cancelled.", "AbortError");
  stopClipPreview();
  const ticket = previewTicket,
    controller = new AbortController();
  previewController = controller;
  const cancel = () => controller.abort();
  options.signal?.addEventListener("abort", cancel, { once: true });
  try {
    const prepared = await prepareClip(source, clip, {
      ...options,
      signal: controller.signal,
    });
    if (controller.signal.aborted || ticket !== previewTicket)
      throw new DOMException("Preview cancelled.", "AbortError");
    await engine.ensureContext().resume();
    if (controller.signal.aborted || ticket !== previewTicket)
      throw new DOMException("Preview cancelled.", "AbortError");
    const p = prepared.snapshot.playback;
    engine._catalogueStarting = true;
    try {
      engine.playBuffer(
        prepared.result.audioBuffer,
        p.start,
        p.end,
        options.onEnded,
        {
          level: 0.35,
          rate: p.rate,
          reverse: p.reverse,
          loop: p.loop,
          gateSeconds:
            p.mode === "loop"
              ? (p.gateSteps * 60) / store.project.bpm / 4
              : null,
        },
      );
    } finally {
      engine._catalogueStarting = false;
    }
    return prepared;
  } finally {
    options.signal?.removeEventListener("abort", cancel);
  }
}
