import { SOUND_BY_KEY, assetKey } from "./onboard-catalog.js";
import { ONBOARD_MANIFEST } from "./onboard-manifest.js";
import { base64ToBytes } from "./audio-utils.js";
// family → { promise, pack, bytes }. The promise is stored so concurrent callers
// share one fetch+parse; a beat can touch ~25 MB of packs, so the cap is generous.
const packs = new Map(),
  MAX_PACK_BYTES = 64 * 1024 * 1024;
async function fetchPack(family, path) {
  // Not tied to any one caller's abort signal: other callers share this request.
  const response = await fetch(new URL("../" + path, import.meta.url));
  if (!response.ok) throw new Error("The local sound bank is unavailable.");
  const text = await response.text(),
    pack = JSON.parse(text),
    item = packs.get(family);
  if (item) {
    item.pack = pack;
    item.bytes = text.length;
  }
  let size = [...packs.values()].reduce((n, p) => n + p.bytes, 0);
  for (const [key, p] of packs) {
    if (size <= MAX_PACK_BYTES) break;
    if (key === family || !p.pack) continue; // never evict the pack being loaded
    size -= p.bytes;
    packs.delete(key);
  }
  return pack;
}
export function onboardVariant(source) {
  const sound = SOUND_BY_KEY[source.value];
  if (!sound) throw new Error("Unknown onboard sound.");
  const root = source.rootMidi ?? sound.rootMidi,
    velocity = source.velocityLayer ?? 1;
  if (
    !(sound.roots.length ? sound.roots : [null]).includes(root) ||
    !sound.velocities.includes(velocity)
  )
    throw new Error("Unavailable root or velocity layer.");
  const id = assetKey(sound, root, velocity),
    approved = ONBOARD_MANIFEST.assets[id];
  if (
    (source.version && source.version !== sound.version) ||
    (source.audioSha256 && source.audioSha256 !== approved?.audioSha256)
  )
    throw new Error(
      "This saved onboard sound differs from the installed bank.",
    );
  return { sound, root, velocity, id };
}
export async function audioHash(bytes) {
  return Array.from(
    new Uint8Array(await crypto.subtle.digest("SHA-256", bytes)),
    (v) => v.toString(16).padStart(2, "0"),
  ).join("");
}
export function validateSoundMetadata(m, duration = null) {
  if (
    !m ||
    typeof m !== "object" ||
    !SOUND_BY_KEY[m.key] ||
    m.version !== "2.0.0" ||
    !/^\w[\w-]*$/.test(m.soundId) ||
    !/^[a-f0-9]{64}$/.test(m.audioSha256)
  )
    throw new Error("Invalid onboard audio metadata.");
  const approved = ONBOARD_MANIFEST.assets[m.assetId];
  if (
    !approved ||
    approved.audioSha256 !== m.audioSha256 ||
    approved.key !== m.key ||
    approved.rootMidi !== m.rootMidi ||
    approved.velocityLayer !== m.velocityLayer
  )
    throw new Error("Audio metadata does not match the local manifest.");
  if (duration != null && Math.abs(duration - approved.duration) > 0.002)
    throw new Error("Audio duration differs from its manifest.");
  return structuredClone(approved);
}
export async function loadOnboardAudio(source, context, { signal } = {}) {
  const { sound, id } = onboardVariant(source),
    metadata = ONBOARD_MANIFEST.assets[id];
  if (!metadata) throw new Error("This onboard bank has not been built.");
  let item = packs.get(sound.family);
  if (!item) {
    item = { pack: null, bytes: 0, promise: null };
    packs.set(sound.family, item);
    item.promise = fetchPack(sound.family, metadata.pack).catch((error) => {
      if (packs.get(sound.family) === item) packs.delete(sound.family);
      throw error;
    });
  } else {
    packs.delete(sound.family); // refresh LRU position
    packs.set(sound.family, item);
  }
  const cancelled = () => new DOMException("Loading cancelled.", "AbortError");
  if (signal?.aborted) throw cancelled();
  const pack = await (signal
    ? Promise.race([
        item.promise,
        new Promise((_, reject) =>
          signal.addEventListener("abort", () => reject(cancelled()), {
            once: true,
          }),
        ),
      ])
    : item.promise);
  const entry = pack.entries?.[id];
  if (!entry || entry.metadata.audioSha256 !== metadata.audioSha256)
    throw new Error("This sound bank does not match its manifest.");
  const bytes = base64ToBytes(entry.audioData);
  if ((await audioHash(bytes)) !== metadata.audioSha256)
    throw new Error("Embedded audio failed its integrity check.");
  const audioBuffer = await context.decodeAudioData(bytes.slice(0));
  validateSoundMetadata(metadata, audioBuffer.duration);
  return {
    audioBuffer,
    sampleName: sound.label,
    soundMetadata: structuredClone(metadata),
    source: {
      type: "synth",
      value: sound.key,
      label: source.label || sound.label,
      rootMidi: metadata.rootMidi,
      velocityLayer: metadata.velocityLayer,
      version: metadata.version,
      audioSha256: metadata.audioSha256,
    },
  };
}
export function sampleLoop(channel) {
  return channel.clipSnapshot?.playback?.mode === "loop"
    ? channel.clipSnapshot.playback.loop
    : channel.soundMetadata?.loop;
}
export function sustainDuration(channel, over, buffer, bpm) {
  const loop = sampleLoop(channel),
    rev = over?.rev ?? channel.reverse,
    start = over?.trimStart ?? channel.trimStart,
    end = over?.trimEnd ?? channel.trimEnd;
  const gate = over?.gateSteps ?? channel.gateSteps ?? 0;
  if (
    loop &&
    !rev &&
    start <= loop.start / buffer.duration &&
    end >= loop.end / buffer.duration &&
    gate > 0
  )
    return (
      (Math.min(64, Math.max(1, gate)) * 60) / bpm / 4 +
      (channel.clipSnapshot ? 0 : 0.08)
    );
  return null;
}
export function packCacheBytes() {
  return [...packs.values()].reduce((n, p) => n + p.bytes, 0);
}
