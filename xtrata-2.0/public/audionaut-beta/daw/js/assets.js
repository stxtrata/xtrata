// Audio payloads live once outside the editable project and its undo history.
// Portable exports expand these references back to data URLs for older players.
const assets = new Map();
const byData = new Map();
const owners = new Map();
let serial = 0;
export const newProjectId = () => globalThis.crypto?.randomUUID?.() || `local-${Date.now().toString(36)}-${++serial}`;

export function registerAsset(data, preferredId = null) {
  if (typeof data !== "string" || !/^data:audio\/[^,]+,/i.test(data))
    throw new Error("The saved audio asset is invalid.");
  if (preferredId && assets.has(preferredId) && assets.get(preferredId).data !== data)
    throw new Error("Conflicting saved audio asset IDs.");
  const existing = byData.get(data);
  const id = preferredId || existing || `audio-${newProjectId()}`;
  if (!assets.has(id)) assets.set(id, { id, data });
  if (!existing) byData.set(data, id);
  return id;
}

export function assetData(id) {
  const record = assets.get(id);
  if (!record) throw new Error("This project's embedded audio is missing. Reopen its original project file.");
  return record.data;
}

export function assetSource(source) {
  if (!source || typeof source !== "object") return source;
  if (source.localAssetId) {
    assetData(source.localAssetId); // reject dangling references before replacing a project
    return { ...source, value: `asset:${source.localAssetId}` };
  }
  if (typeof source.value !== "string" || !/^data:audio\//i.test(source.value)) return source;
  const localAssetId = registerAsset(source.value);
  return { ...source, value: `asset:${localAssetId}`, localAssetId };
}

export function internProjectAssets(project) {
  for (const channel of project.channels || []) {
    channel.source = assetSource(channel.source);
    if (channel.unresolvedSource?.source)
      channel.unresolvedSource.source = assetSource(channel.unresolvedSource.source);
  }
  return project;
}

export function assetIds(value, result = new Set()) {
  if (!value || typeof value !== "object") return result;
  if (typeof value.localAssetId === "string") result.add(value.localAssetId);
  for (const item of Object.values(value)) if (item && typeof item === "object") assetIds(item, result);
  return result;
}
export function retainAssetIds(owner, ids) { owners.set(owner, new Set(ids)); }
export function retainAssets(owner, value) { retainAssetIds(owner, assetIds(value)); }
export function pruneAssets() {
  const retained = new Set([...owners.values()].flatMap((set) => [...set]));
  for (const [id, record] of assets) if (!retained.has(id)) {
    assets.delete(id);
    if (byData.get(record.data) === id) {
      byData.delete(record.data);
      const alias = [...assets.values()].find((other) => other.data === record.data);
      if (alias) byData.set(record.data, alias.id);
    }
  }
}
export function assetBytes(ids, excluding = []) {
  const excluded = new Set([...excluding].map((id) => assets.get(id)?.data));
  const data = new Set([...ids].map((id) => assets.get(id)?.data).filter((value) => value && !excluded.has(value)));
  return [...data].reduce((sum, value) => sum + value.length * 2, 0);
}
export function assetStats() {
  return { count: assets.size, characters: [...new Set([...assets.values()].map((a) => a.data))].reduce((n, data) => n + data.length, 0) };
}

export function portableProject(project) {
  const copy = structuredClone(project);
  function expand(value) {
    if (!value || typeof value !== "object") return;
    if (value.localAssetId) {
      value.value = assetData(value.localAssetId);
      delete value.localAssetId;
    }
    for (const item of Object.values(value)) if (item && typeof item === "object") expand(item);
  }
  expand(copy);
  return copy;
}

// Stable identifiers keep undo/source comparisons independent of embedded audio size.
export function sourceIdentity(source) {
  if (!source) return "";
  // Every source option can affect decoding (including rootMidi, velocityLayer,
  // version and future bank dimensions). Only display labels are irrelevant.
  // Local payloads have already been interned, so this never serializes their bytes.
  const identity = Object.fromEntries(Object.keys(source).sort()
    .filter((key) => key !== "label" && !(source.localAssetId && key === "value"))
    .map((key) => [key, source[key]]));
  return JSON.stringify(identity);
}

// Hash once per asset, off the synchronous edit/history path. Persisted IDs deduplicate
// the same imported audio across project files and browser sessions as well.
export async function storageAssets(project) {
  const records = [...assetIds(project)].map((id) => {
    const record = assets.get(id);
    if (!record) throw new Error("An embedded audio asset is missing; browser recovery was not replaced.");
    return record;
  });
  const remap = new Map();
  const stored = await Promise.all(records.map(async (record) => {
    if (!record.storageId) record.storageId = (async () => {
      if (!globalThis.crypto?.subtle) throw new Error("Browser recovery requires a secure page (HTTPS or localhost).");
      const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(record.data));
      return "sha256-" + [...new Uint8Array(hash)].map((v) => v.toString(16).padStart(2, "0")).join("");
    })();
    const id = await record.storageId;
    remap.set(record.id, id);
    return { id, data: record.data };
  }));
  const copy = structuredClone(project);
  function rewrite(value) {
    if (!value || typeof value !== "object") return;
    if (value.localAssetId) {
      value.localAssetId = remap.get(value.localAssetId);
      value.value = `asset:${value.localAssetId}`;
    }
    for (const item of Object.values(value)) if (item && typeof item === "object") rewrite(item);
  }
  rewrite(copy);
  return { project: copy, assets: stored };
}
