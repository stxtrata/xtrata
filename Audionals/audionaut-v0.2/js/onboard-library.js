import { SOUND_BY_KEY, assetKey } from "./onboard-catalog.js";
import { ONBOARD_MANIFEST } from "./onboard-manifest.js";
const packs = new Map(),
  MAX_PACK_BYTES = 24 * 1024 * 1024;
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
  let pack = packs.get(sound.family)?.pack;
  if (!pack) {
    const response = await fetch(
      new URL("../" + metadata.pack, import.meta.url),
      { signal },
    );
    if (!response.ok) throw new Error("The local sound bank is unavailable.");
    const text = await response.text();
    pack = JSON.parse(text);
    packs.set(sound.family, { pack, bytes: text.length });
    let size = [...packs.values()].reduce((n, p) => n + p.bytes, 0);
    for (const [key, p] of packs) {
      if (size <= MAX_PACK_BYTES) break;
      size -= p.bytes;
      packs.delete(key);
    }
  } else {
    const item = packs.get(sound.family);
    packs.delete(sound.family);
    packs.set(sound.family, item);
  }
  if (signal?.aborted)
    throw new DOMException("Loading cancelled.", "AbortError");
  const entry = pack.entries?.[id];
  if (!entry || entry.metadata.audioSha256 !== metadata.audioSha256)
    throw new Error("This sound bank does not match its manifest.");
  const bytes = Uint8Array.from(atob(entry.audioData), (c) =>
    c.charCodeAt(0),
  ).buffer;
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
