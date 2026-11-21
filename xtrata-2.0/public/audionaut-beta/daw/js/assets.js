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
  return record.data || (record.url ||= URL.createObjectURL(record.blob));
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
  const seen = new WeakSet();
  function visit(value) {
    if (!value || typeof value !== "object" || seen.has(value)) return;
    seen.add(value);
    if (value.source && typeof value.source === "object") value.source = assetSource(value.source);
    for (const item of Object.values(value)) if (item && typeof item === "object") visit(item);
  }
  visit(project);
  return project;
}

export function assetIds(value, result = new Set()) {
  if (!value || typeof value !== "object") return result;
  if (typeof value.localAssetId === "string") result.add(value.localAssetId);
  for (const [key,item] of Object.entries(value)) {
    // Audio references live on sources, never in musical-event arrays or patch values.
    if (['steps','notes','expression','automation','tempo','meter','params','analysis'].includes(key)) continue;
    if (item && typeof item === "object") assetIds(item, result);
  }
  return result;
}
export function retainAssetIds(owner, ids) { owners.set(owner, new Set(ids)); }
export function retainAssets(owner, value) { retainAssetIds(owner, assetIds(value)); }
export function pruneAssets() {
  const retained = new Set([...owners.values()].flatMap((set) => [...set]));
  for (const [id, record] of assets) if (!retained.has(id)) {
    assets.delete(id);
    if (record.url) URL.revokeObjectURL(record.url);
    if (record.data && byData.get(record.data) === id) {
      byData.delete(record.data);
      const alias = [...assets.values()].find((other) => other.data === record.data);
      if (alias) byData.set(record.data, alias.id);
    }
  }
}
export function assetBytes(ids, excluding = []) {
  const value = id => { const r = assets.get(id); return r?.data || r?.blob; };
  const excluded = new Set([...excluding].map(value));
  const data = new Set([...ids].map(value).filter(v => v && !excluded.has(v)));
  return [...data].reduce((sum, value) => sum + (typeof value === 'string' ? value.length * 2 : value.size), 0);
}
export function assetStats() {
  return { count: assets.size, characters: [...new Set([...assets.values()].map((a) => a.data).filter(Boolean))].reduce((n, data) => n + data.length, 0), binaryBytes: [...assets.values()].reduce((n,a)=>n+(a.blob?.size||0),0) };
}

export function portableProject(project) {
  const copy = structuredClone(project);
  function expand(value) {
    if (!value || typeof value !== "object") return;
    if (value.localAssetId) {
      const record = assets.get(value.localAssetId);
      if (!record?.data) throw new Error('Use asynchronous project export for recorded binary audio.');
      value.value = record.data;
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
      record.blob ||= dataUrlBlob(record.data);
      const hash = await crypto.subtle.digest("SHA-256", await record.blob.arrayBuffer());
      return "sha256-" + [...new Uint8Array(hash)].map((v) => v.toString(16).padStart(2, "0")).join("");
    })();
    const id = await record.storageId;
    remap.set(record.id, id);
    return { id, blob: record.blob, mime: record.blob.type, bytes: record.blob.size };
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

export function dataUrlBlob(data) {
  const comma = data.indexOf(","), header = data.slice(0, comma);
  if (comma < 0 || !/^data:audio\//i.test(header)) throw new Error("Invalid embedded audio.");
  const mime = header.slice(5).split(";")[0] || "audio/octet-stream";
  const text = /;base64/i.test(header) ? atob(data.slice(comma + 1).replace(/\s/g, "")) : decodeURIComponent(data.slice(comma + 1));
  const chunks = [];
  for (let offset = 0; offset < text.length; offset += 65536) {
    const part = text.slice(offset, offset + 65536), bytes = new Uint8Array(part.length);
    for (let i = 0; i < part.length; i++) bytes[i] = part.charCodeAt(i);
    chunks.push(bytes);
  }
  return new Blob(chunks, { type: mime });
}
export async function blobDataUrl(blob) {
  const bytes = new Uint8Array(await blob.arrayBuffer()); let text = "";
  for (let i = 0; i < bytes.length; i += 32768) text += String.fromCharCode(...bytes.subarray(i, i + 32768));
  return `data:${blob.type || "audio/octet-stream"};base64,${btoa(text)}`;
}
export async function registerStoredAsset(record) {
  const id = record.id;
  if (record.data) registerAsset(record.data, id);
  else if (!assets.has(id)) assets.set(id,{id,blob:record.blob});
  const item = assets.get(id); item.blob ||= record.blob || dataUrlBlob(record.data);
  if (id.startsWith("sha256-")) item.storageId = Promise.resolve(id);
  return id;
}
export function assetBlob(id) {
  const record = assets.get(id);
  if (!record) throw new Error("Audio asset is missing.");
  return record.blob ||= dataUrlBlob(record.data);
}

export async function portableProjectAsync(project) {
  const copy = structuredClone(project), urls = new Map();
  for (const id of assetIds(project)) {
    const record = assets.get(id); if (!record) throw new Error('Audio asset is missing.');
    urls.set(id, record.data || await blobDataUrl(assetBlob(id)));
  }
  function expand(value) {
    if (!value || typeof value !== 'object') return;
    if (value.localAssetId) { value.value=urls.get(value.localAssetId);delete value.localAssetId; }
    for(const item of Object.values(value))if(item&&typeof item==='object')expand(item);
  }
  expand(copy);return copy;
}
export function registerBlob(blob, {name='Audio recording', id=null}={}) {
  if (!(blob instanceof Blob) || !blob.size) throw new Error('The audio recording is empty.');
  id ||= `audio-${newProjectId()}`;
  if (!assets.has(id)) assets.set(id,{id,blob});
  return {type:'file',value:`asset:${id}`,localAssetId:id,label:name};
}
export async function registerAudioBuffer(buffer,{name='Recording.wav',bitDepth=24}={}) {
  const {encodeWavAsync}=await import('./audio-utils.js');
  return registerBlob(await encodeWavAsync(buffer,{bitDepth}),{name});
}
