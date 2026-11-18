// pack-library.js — the FLAC sample packs (audpack/1), served as static "web samples" until the
// packs are inscribed on Xtrata. Each pack is one file under media/packs/. The browser:
//   1. fetches the pack and checks its SHA-256 against the container hash in pack-catalogue.js
//      (that hash ships with the app, so a swapped or truncated pack is refused),
//   2. checks each sound's stored FLAC bytes against the hash in the pack's own index,
//   3. decodes the FLAC with the bundled pure-JS decoder and checks the decoded 16-bit PCM
//      against the sound's pcmSha256 (the sound's permanent identity), then
//   4. hands Web Audio a ready buffer. If the JS decoder cannot be loaded, the browser's own
//      FLAC support is used instead and the sound is reported as unverified.
// This module has no imports from the rest of the app so it can be tested on its own.
import { PACKS, PACK_CREDITS, PACK_LICENCES, TIER_LABEL } from "./pack-catalogue.js";

export { PACKS, PACK_CREDITS, PACK_LICENCES, TIER_LABEL };
export const PACK_BY_ID = Object.fromEntries(PACKS.map((p) => [p.id, p]));
const MAX_CACHE_BYTES = 48 * 1024 * 1024;

const hex = (buf) =>
  Array.from(new Uint8Array(buf), (v) => v.toString(16).padStart(2, "0")).join("");
const sha256 = async (bytes) => hex(await crypto.subtle.digest("SHA-256", bytes));

// "<pack>/<assetId>" -> { pack, assetId }
export function parsePackValue(value) {
  const at = String(value).indexOf("/");
  const pack = PACK_BY_ID[String(value).slice(0, at)];
  if (at < 1 || !pack) throw new Error("Unknown sample pack.");
  return { pack, assetId: String(value).slice(at + 1) };
}
export function packSoundRow(value) {
  const { pack, assetId } = parsePackValue(value);
  const row = pack.sounds.find((s) => s[0] === assetId);
  if (!row) throw new Error("This sound is not in its sample pack.");
  const [, label, rootMidi, folder, duration, credit, samples, licence] = row;
  return {
    pack,
    assetId,
    label,
    rootMidi,
    folder,
    duration,
    samples,
    credit: PACK_CREDITS[credit],
    licence: PACK_LICENCES[licence],
  };
}
// One line a person can read: licence, credit and (for the unverified tier) the warning.
export function packSoundNotice(value) {
  const s = packSoundRow(value);
  const parts = [
    s.pack.tier === "unverified"
      ? "Licence UNVERIFIED (not CC0)"
      : `${s.licence || s.pack.spdx}${s.pack.attribution ? " · attribution required" : ""}`,
  ];
  if (s.credit) parts.push(`credit: ${s.credit}`);
  return parts.join(" · ");
}

// audpack/1: "AUDP" u8 version u8 flags(bit0 = gzip index) u16 reserved u32le indexLen | index | payload
export async function readAudpack(u8) {
  if (String.fromCharCode(u8[0], u8[1], u8[2], u8[3]) !== "AUDP")
    throw new Error("This is not a sample pack.");
  if (u8[4] !== 1) throw new Error(`Unsupported sample pack version ${u8[4]}.`);
  const ilen = new DataView(u8.buffer, u8.byteOffset, u8.byteLength).getUint32(8, true);
  let ib = u8.subarray(12, 12 + ilen);
  if (u8[5] & 1) {
    if (typeof DecompressionStream === "undefined")
      throw new Error("This browser cannot unpack sample packs (no DecompressionStream).");
    ib = new Uint8Array(
      await new Response(
        new Blob([ib]).stream().pipeThrough(new DecompressionStream("gzip")),
      ).arrayBuffer(),
    );
  }
  const index = JSON.parse(new TextDecoder().decode(ib)),
    base = 12 + ilen;
  const byId = new Map(index.sounds.map((s) => [s.id, s]));
  return {
    index,
    sound: (id) => byId.get(id),
    bytesFor: (s) => u8.subarray(base + s.offset, base + s.offset + s.length),
  };
}

// pack id -> { promise, pack, bytes }. Packs are 2–8 MB; a session rarely touches more than a few.
const packs = new Map();
async function fetchPack(id, fetcher) {
  const info = PACK_BY_ID[id];
  // Shared between callers, so it is not tied to any one caller's abort signal.
  const response = await fetcher(new URL(`../media/packs/${id}.audpack`, import.meta.url));
  if (!response.ok) throw new Error(`The ${info.title} sample pack is unavailable (${response.status}).`);
  const bytes = new Uint8Array(await response.arrayBuffer());
  if (bytes.length !== info.bytes || (await sha256(bytes)) !== info.sha256)
    throw new Error(`The ${info.title} sample pack failed its integrity check.`);
  const parsed = await readAudpack(bytes);
  if (parsed.index.pack !== id || parsed.index.sounds.length !== info.sounds.length)
    throw new Error(`The ${info.title} sample pack does not match its catalogue.`);
  const item = packs.get(id);
  if (item) {
    item.pack = parsed;
    item.bytes = bytes.length;
  }
  let size = [...packs.values()].reduce((n, p) => n + p.bytes, 0);
  for (const [key, p] of packs) {
    if (size <= MAX_CACHE_BYTES) break;
    if (key === id || !p.pack) continue;
    size -= p.bytes;
    packs.delete(key);
  }
  return parsed;
}
function packFor(id, { signal, fetcher = fetch } = {}) {
  let item = packs.get(id);
  if (!item) {
    item = { pack: null, bytes: 0, promise: null };
    packs.set(id, item);
    item.promise = fetchPack(id, fetcher).catch((error) => {
      if (packs.get(id) === item) packs.delete(id);
      throw error;
    });
  } else {
    packs.delete(id); // refresh LRU position
    packs.set(id, item);
  }
  const cancelled = () => new DOMException("Loading cancelled.", "AbortError");
  if (signal?.aborted) throw cancelled();
  return signal
    ? Promise.race([
        item.promise,
        new Promise((_, reject) =>
          signal.addEventListener("abort", () => reject(cancelled()), { once: true }),
        ),
      ])
    : item.promise;
}
export function packCacheBytes() {
  return [...packs.values()].reduce((n, p) => n + p.bytes, 0);
}
export function clearPackCache() {
  packs.clear();
}

// Starts (or joins) the download of one pack so the first beat from it plays sooner. Safe to call
// repeatedly; failures are returned, not thrown, because prefetching is only an optimisation.
export function prefetchPack(id, options = {}) {
  return packFor(id, options).then(
    () => ({ ok: true }),
    (error) => ({ ok: false, error }),
  );
}

let flacDecoder;
async function jsDecoder() {
  return (flacDecoder ||= import("./codecs/codec-flac.mjs")
    .then((m) => m.createDecoder({ verify: true }))
    .catch(() => null));
}

// Decodes one stored FLAC. Returns { audioBuffer, verified } where verified means the decoded
// PCM matched the sound's pcmSha256.
export async function decodeFlac(bytes, context, expectedPcmSha256) {
  const dec = await jsDecoder();
  if (dec) {
    const r = await dec.decodeInt(bytes);
    if (r.channels !== 1 || r.bitsPerSample !== 16)
      throw new Error("Unexpected sample pack audio format.");
    const ints = r.data[0],
      pcm = new Int16Array(r.length),
      floats = new Float32Array(r.length);
    for (let i = 0; i < r.length; i++) {
      pcm[i] = ints[i];
      floats[i] = ints[i] / 32768;
    }
    if ((await sha256(pcm.buffer)) !== expectedPcmSha256)
      throw new Error("Decoded audio failed its integrity check.");
    const audioBuffer = context.createBuffer(1, r.length, r.sampleRate);
    audioBuffer.copyToChannel(floats, 0);
    return { audioBuffer, verified: true };
  }
  // No JS decoder (blocked import): fall back to the browser's own FLAC support.
  const audioBuffer = await context.decodeAudioData(bytes.slice().buffer);
  return { audioBuffer, verified: false };
}

// source = { type: "pack", value: "<pack>/<assetId>", label?, audioSha256? }
export async function loadPackAudio(source, context, { signal, fetcher } = {}) {
  const { pack, assetId } = parsePackValue(source.value),
    row = packSoundRow(source.value),
    parsed = await packFor(pack.id, { signal, fetcher }),
    entry = parsed.sound(assetId);
  if (!entry) throw new Error("This sound is missing from its sample pack.");
  if (source.audioSha256 && source.audioSha256 !== entry.pcmSha256)
    throw new Error("This saved sample differs from the installed sample pack.");
  const bytes = parsed.bytesFor(entry);
  if ((await sha256(bytes)) !== entry.sha256)
    throw new Error("Sample pack audio failed its integrity check.");
  const { audioBuffer, verified } = await decodeFlac(bytes, context, entry.pcmSha256);
  if (signal?.aborted) throw new DOMException("Loading cancelled.", "AbortError");
  return {
    audioBuffer,
    sampleName: row.label,
    rootMidi: row.rootMidi,
    verified,
    source: {
      type: "pack",
      value: source.value,
      label: source.label || row.label,
      rootMidi: row.rootMidi,
      audioSha256: entry.pcmSha256,
    },
  };
}
