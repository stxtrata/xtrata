// Explicit, read-only migration. Every mapped audio payload is verified before any channel changes.
import { ONBOARD_MANIFEST } from "./onboard-manifest.js";
import { onboardVariant } from "./onboard-library.js";
import { fetchAndDecode, assignDecodedSample } from "./loader.js";
import { store } from "./state.js";
export function validateL2Manifest(data) {
  if (
    data?.format !== "audionaut-l2-sounds/1" ||
    !Array.isArray(data.assets) ||
    !data.assets.length ||
    data.assets.length > 1024
  )
    throw new Error("Choose an Audionaut L2 sound manifest.");
  const seen = new Set();
  return data.assets.map((ref) => {
    const approved = ONBOARD_MANIFEST.assets[ref.assetId];
    if (
      !approved ||
      ref.audioSha256 !== approved.audioSha256 ||
      seen.has(ref.assetId) ||
      !["mainnet", "testnet"].includes(ref.network) ||
      !/^S[PT][A-Z0-9]{20,45}\.[a-zA-Z][a-zA-Z0-9-]{0,127}$/.test(
        ref.contractId,
      ) ||
      !/^\d+$/.test(String(ref.tokenId))
    )
      throw new Error("Invalid, duplicate or mismatched L2 sound reference.");
    seen.add(ref.assetId);
    return {
      type: "xtrata",
      value: String(ref.tokenId),
      network: ref.network,
      contractId: ref.contractId,
      assetId: ref.assetId,
      audioSha256: ref.audioSha256,
      label: approved.soundId,
    };
  });
}
export async function migrateOnboardToL2(
  data,
  { signal, onProgress = () => {}, decode = fetchAndDecode } = {},
) {
  const sources = validateL2Manifest(data),
    project = store.project,
    snapshot = JSON.stringify(project),
    results = new Map();
  let next = 0;
  const batch = new AbortController(),
    abort = () => batch.abort();
  signal?.addEventListener("abort", abort, { once: true });
  if (signal?.aborted) batch.abort();
  try {
    await Promise.all(
      Array.from({ length: Math.min(2, sources.length) }, async () => {
        while (next < sources.length) {
          if (batch.signal.aborted)
            throw new DOMException("Cancelled", "AbortError");
          const source = sources[next++],
            result = await decode(source, { signal: batch.signal });
          if (
            !result.soundMetadata ||
            result.soundMetadata.audioSha256 !== source.audioSha256
          )
            throw new Error("L2 audio metadata is unverified.");
          results.set(source.assetId, {
            source: { ...source, verifiedAudio: true },
            result,
          });
          onProgress(results.size, sources.length);
        }
      }),
    );
  } catch (error) {
    batch.abort();
    throw error;
  } finally {
    signal?.removeEventListener("abort", abort);
  }
  if (
    signal?.aborted ||
    project !== store.project ||
    snapshot !== JSON.stringify(project)
  )
    throw new Error(
      "The session changed during verification; no channels were migrated.",
    );
  const changes = [];
  project.channels.forEach((channel, ch) => {
    if (
      channel.source?.type !== "synth" ||
      !channel.source.value.startsWith("onboard:v2:")
    )
      return;
    const id = onboardVariant(channel.source).id,
      entry = results.get(id);
    if (entry) changes.push({ ch, ...entry });
  });
  for (const { ch, source, result } of changes)
    assignDecodedSample(
      ch,
      { ...source, label: project.channels[ch].sampleName },
      result,
      { reset: false },
    );
  store.emit("sequence");
  return changes.length;
}
