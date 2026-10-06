// Shared, transactional L1/L2 audio loader. Remote preview cache is bounded.
import { store, stepVal } from "./state.js";
import { engine } from "./engine.js";
import { renderSynthSample, ALL_SYNTH_DRUMS } from "./synthdrums.js";
import { SOUND_BY_KEY } from "./onboard-catalog.js";
import { ONBOARD_MANIFEST } from "./onboard-manifest.js";
import {
  loadOnboardAudio,
  onboardVariant,
  audioHash,
  validateSoundMetadata,
} from "./onboard-library.js";
import { LANDMARKS } from "./song-format.js";
import { fetchCatalogueAudio } from "./catalogue-retrieval.js";
import { base64ToBytes } from "./audio-utils.js";
const ORDINAL = /^[a-f0-9]{64}i\d+$/i,
  MAX_BYTES = 50 * 1024 * 1024,
  CACHE_BYTES = 64 * 1024 * 1024;
const cache = new Map(),
  pending = new Map(),
  tickets = new Map();
const abort = (signal) => {
  if (signal?.aborted)
    throw new DOMException("Loading cancelled.", "AbortError");
};
export function ordinalId(value) {
  const id = String(value)
    .trim()
    .replace(/^.*\/content\//, "")
    .split(/[?#]/)[0];
  if (!ORDINAL.test(id))
    throw new Error("Enter a valid Bitcoin inscription ID or content URL.");
  return id.toLowerCase();
}
export function resolveSource(source, settings = store.settings) {
  if (source.type === "ordinal")
    return (
      settings.ordinalsGateway.replace(/\/?$/, "/") + ordinalId(source.value)
    );
  if (source.type === "xtrata") {
    const id = String(source.value).trim();
    if (!/^\d+$/.test(id))
      throw new Error("Enter a numeric Xtrata inscription ID.");
    if (source.network || source.contractId) {
      if (
        !["mainnet", "testnet"].includes(source.network) ||
        !/^S[PT][A-Z0-9]{20,45}\.[a-zA-Z][a-zA-Z0-9-]{0,127}$/.test(
          source.contractId,
        )
      )
        throw new Error("Invalid mapped Xtrata source.");
      return `/runtime/content?network=${source.network}&contractId=${encodeURIComponent(source.contractId)}&tokenId=${id}`;
    }
    return settings.xtrataGateway.includes("{id}")
      ? settings.xtrataGateway.replaceAll("{id}", encodeURIComponent(id))
      : settings.xtrataGateway.replace(/\/?$/, "/") + id;
  }
  const url = String(source.value || "").trim();
  if (!/^(https?:\/\/|data:audio\/|blob:)/i.test(url))
    throw new Error("Enter an HTTP(S) audio URL.");
  return url;
}
function decodeBase64(value) {
  const raw = String(value)
    .replace(/^data:[^,]*,/, "")
    .replace(/\s/g, "");
  if (raw.length > (MAX_BYTES * 4) / 3 + 8)
    throw new Error("Audio exceeds the 50 MB import limit.");
  return base64ToBytes(raw);
}
function inlineBytes(buffer) {
  let text = "";
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.length; i += 32768)
    text += String.fromCharCode(...bytes.subarray(i, i + 32768));
  return "data:audio/octet-stream;base64," + btoa(text);
}
async function responseBytes(response) {
  if (Number(response.headers.get("content-length")) > MAX_BYTES)
    throw new Error("Audio exceeds the 50 MB import limit.");
  if (!response.body?.getReader) {
    const bytes = await response.arrayBuffer();
    if (bytes.byteLength > MAX_BYTES)
      throw new Error("Audio exceeds the 50 MB import limit.");
    return bytes;
  }
  const reader = response.body.getReader(),
    chunks = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > MAX_BYTES) {
      await reader.cancel();
      throw new Error("Audio exceeds the 50 MB import limit.");
    }
    chunks.push(value);
  }
  const output = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    output.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return output.buffer;
}
export async function extractAudio(
  response,
  fallback = "Sample",
  signal = null,
  depth = 0,
  allowNested = true,
) {
  abort(signal);
  if (depth > 2) throw new Error("Too many nested audio references.");
  const bytes = await responseBytes(response),
    ct = (response.headers.get("content-type") || "").toLowerCase(),
    prefix = new TextDecoder().decode(bytes.slice(0, 200)).trimStart();
  if (ct.includes("json") || prefix.startsWith("{")) {
    const json = JSON.parse(new TextDecoder().decode(bytes)),
      base64 =
        json.audioData ||
        json.audioData_base64 ||
        json.base64 ||
        json.audio?.data;
    if (typeof base64 !== "string")
      throw new Error("This JSON contains no supported embedded audio.");
    return {
      arrayBuffer: decodeBase64(base64),
      sourceBytes: bytes,
      sampleName: json.filename || json.fileName || json.name || fallback,
      soundMetadata: String(json.metadata?.key || "").startsWith("onboard:")
        ? validateSoundMetadata(json.metadata)
        : null,
    };
  }
  if (ct.includes("html") || /^<(?:!doctype|html|head)/i.test(prefix)) {
    const html = new TextDecoder().decode(bytes),
      doc = new DOMParser().parseFromString(html, "text/html");
    if (
      !allowNested &&
      new Set(
        html.match(
          /data:audio\/[a-z0-9.+-]+(?:;[^,\s"'<>]+)*;base64,[A-Za-z0-9+/=]+/gi,
        ) || [],
      ).size > 1
    )
      throw new Error(
        "Multiple embedded audio payloads are unsupported in Samples & Loops.",
      );
    const sampleName =
      doc.getElementById("sampleName")?.textContent.trim() ||
      doc
        .querySelector("audio[data-audionalsamplename]")
        ?.getAttribute("data-audionalsamplename") ||
      doc.title ||
      fallback;
    const attr = doc
      .querySelector("audio source[src],audio[src]")
      ?.getAttribute("src");
    if (attr?.startsWith("data:audio/"))
      return {
        arrayBuffer: decodeBase64(attr),
        sampleName,
        sourceBytes: bytes,
      };
    const inline = html.match(
      /data:audio\/[a-z0-9.+-]+(?:;[^,\s"'<>]+)*;base64,([A-Za-z0-9+/=\s]+)/i,
    );
    if (inline)
      return {
        arrayBuffer: decodeBase64(inline[1]),
        sampleName,
        sourceBytes: bytes,
      };
    if (attr) {
      if (!allowNested)
        throw new Error(
          "Recursive/external HTML audio is unsupported in Samples & Loops.",
        );
      const url = new URL(attr, response.url);
      if (!/^https?:$/.test(url.protocol))
        throw new Error("Unsupported nested audio URL.");
      const nested = await fetch(url, { signal });
      if (!nested.ok)
        throw new Error(`Nested audio failed (${nested.status}).`);
      return extractAudio(nested, sampleName, signal, depth + 1);
    }
    throw new Error("This HTML inscription contains no embedded audio.");
  }
  if (!allowNested && ct.startsWith("video/"))
    throw new Error("Video extraction is unsupported in Samples & Loops.");
  return { arrayBuffer: bytes, sourceBytes: bytes, sampleName: fallback };
}
function keep(key, value) {
  cache.delete(key);
  cache.set(key, value);
  let size = 0;
  for (const item of cache.values())
    size += item.audioBuffer.length * item.audioBuffer.numberOfChannels * 4;
  for (const [id, item] of cache) {
    if (size <= CACHE_BYTES) break;
    size -= item.audioBuffer.length * item.audioBuffer.numberOfChannels * 4;
    cache.delete(id);
  }
}
export async function fetchAndDecode(
  source,
  { signal = null, catalogue = false } = {},
) {
  if (catalogue) return fetchCatalogueAudio(source, { signal });
  abort(signal);
  if (source.type === "ordinal" && LANDMARKS[ordinalId(source.value)])
    throw new Error(
      "This inscription is a song or application. Open Songs & historic applications to audition or export a song session.",
    );
  const context = engine.ensureContext();
  if (source.type === "file") {
    if (source.file) {
      if (source.file.size > MAX_BYTES)
        throw new Error("Choose an audio file smaller than 50 MB.");
      const bytes = await source.file.arrayBuffer(),
        audioBuffer = await context.decodeAudioData(bytes.slice(0));
      abort(signal);
      return {
        audioBuffer,
        sampleName: source.file.name,
        source: {
          type: "file",
          value: inlineBytes(bytes),
          label: source.file.name,
        },
      };
    }
    if (!source.value?.startsWith("data:"))
      throw new Error("Re-select this legacy local file.");
  }
  const key =
    source.type === "synth"
      ? "synth:" +
        (SOUND_BY_KEY[source.value] ? onboardVariant(source).id : source.value)
      : resolveSource(source) +
        (source.audioSha256 ? "#" + source.audioSha256 : "");
  if (cache.has(key)) {
    const value = cache.get(key);
    keep(key, value);
    return value;
  }
  if (!signal && pending.has(key)) return pending.get(key);
  const request = (async () => {
    let result;
    if (source.type === "synth" && SOUND_BY_KEY[source.value])
      result = await loadOnboardAudio(source, context, { signal });
    else if (source.type === "synth")
      result = {
        audioBuffer: await renderSynthSample(source.value),
        sampleName: ALL_SYNTH_DRUMS[source.value].label,
      };
    else {
      const response = await fetch(
        source.type === "synth" ? key : resolveSource(source),
        { signal },
      );
      if (!response.ok)
        throw new Error(`Audio fetch failed (${response.status}).`);
      const fallback =
          source.label ||
          decodeURIComponent(key.split("/").pop()?.split("?")[0] || "Sample"),
        { arrayBuffer, sampleName, soundMetadata } = await extractAudio(
          response,
          fallback,
          signal,
        );
      const expectedHash = soundMetadata?.audioSha256 || source.audioSha256;
      if (expectedHash && (await audioHash(arrayBuffer)) !== expectedHash)
        throw new Error("Audio failed its integrity check.");
      result = {
        audioBuffer: await context.decodeAudioData(arrayBuffer.slice(0)),
        sampleName,
        soundMetadata:
          soundMetadata ||
          (source.assetId &&
          ONBOARD_MANIFEST.assets[source.assetId]?.audioSha256 ===
            source.audioSha256
            ? validateSoundMetadata(ONBOARD_MANIFEST.assets[source.assetId])
            : null),
      };
      if (soundMetadata)
        validateSoundMetadata(soundMetadata, result.audioBuffer.duration);
    }
    abort(signal);
    keep(key, result);
    return result;
  })();
  if (!signal) pending.set(key, request);
  try {
    return await request;
  } finally {
    if (pending.get(key) === request) pending.delete(key);
  }
}
export function assignDecodedSample(ch, source, result, { reset = true } = {}) {
  const channel = store.channel(ch);
  if (!channel) throw new Error("This sample channel no longer exists.");
  tickets.set(ch, Symbol());
  engine.silenceChannel(ch);
  engine.setBuffer(ch, result.audioBuffer);
  channel.source = result.source || {
    type: source.type,
    value: source.type === "ordinal" ? ordinalId(source.value) : source.value,
    label: source.label,
    ...(source.sourceSha256 && { sourceSha256: source.sourceSha256 }),
    ...(source.audioSha256 && { audioSha256: source.audioSha256 }),
    ...(source.assetId && {
      assetId: source.assetId,
      audioSha256: source.audioSha256,
      network: source.network,
      contractId: source.contractId,
      verifiedAudio: source.verifiedAudio === true,
    }),
  };
  channel.sampleName = source.label || result.sampleName;
  channel.unresolvedSource = null;
  channel.soundMetadata = result.soundMetadata || null;
  if (reset) {
    channel.gateSteps = result.soundMetadata?.loop ? 8 : 0;
    channel.sampleMidi = result.soundMetadata?.rootMidi ?? null;
  }
  if (reset) {
    channel.trimStart = 0;
    channel.trimEnd = 1;
    channel.reverse = false;
    channel.pitch = 1;
    channel.wordSelection = null;
    channel.clipSnapshot = null;
    for (const seq of store.project.sequences)
      seq.steps[ch] = seq.steps[ch].map((s) => stepVal(s));
  }
  channel.analysis = {
    duration: result.audioBuffer.duration,
    sampleRate: result.audioBuffer.sampleRate,
    channels: result.audioBuffer.numberOfChannels,
  };
  if (channel.name.startsWith("Channel "))
    channel.name = String(channel.sampleName)
      .replace(/\.[a-z0-9]+$/i, "")
      .slice(0, 24);
  store.emit("channel", { ch, prop: "source", value: channel.source });
  return channel.sampleName;
}
export function reserveSampleAssignment(ch) {
  const project = store.project,
    channel = store.channel(ch),
    ticket = Symbol();
  tickets.set(ch, ticket);
  return () =>
    project === store.project &&
    channel === store.channel(ch) &&
    tickets.get(ch) === ticket;
}
export async function loadSample(
  ch,
  source,
  { signal = null, preserve = false } = {},
) {
  const stillCurrent = reserveSampleAssignment(ch);
  const result = await fetchAndDecode(source, { signal });
  abort(signal);
  if (!stillCurrent())
    throw new DOMException(
      "The destination changed while loading.",
      "AbortError",
    );
  return assignDecodedSample(ch, source, result, { reset: !preserve });
}
// Restores every channel's audio. Channels load through a small worker pool so
// slow gateway fetches overlap instead of forming a waterfall at start-up.
export async function reloadAllSamples(onProgress, concurrency = 3) {
  const project = store.project,
    failures = [],
    queue = [];
  project.channels.forEach((channel, ch) => {
    if (channel.source) queue.push(ch);
    else engine.setBuffer(ch, null);
  });
  const restore = async (ch) => {
    const channel = project.channels[ch],
      source = channel.source;
    try {
      onProgress?.(ch, channel.sampleName || source.value);
      if (channel.clipSnapshot) {
        const { restoreClipChannel } = await import("./clip-actions.js");
        await restoreClipChannel(ch);
      } else await loadSample(ch, source, { preserve: true });
    } catch (error) {
      if (project !== store.project || error.name === "AbortError") return;
      engine.setBuffer(ch, null);
      if (channel.clipSnapshot)
        channel.unresolvedSource = {
          message: error.message,
          source: structuredClone(source),
        };
      failures.push(ch + 1);
    }
  };
  const worker = async () => {
    while (queue.length && project === store.project) await restore(queue.shift());
  };
  await Promise.all(
    Array.from({ length: Math.min(concurrency, queue.length) }, worker),
  );
  return failures.sort((a, b) => a - b);
}
