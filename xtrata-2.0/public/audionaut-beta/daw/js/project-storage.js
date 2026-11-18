import { PROJECT_DATABASE } from "./storage-config.js";
// IndexedDB stores small project revisions separately from shared audio payloads.
import { assetIds, newProjectId } from "./assets.js";
const DATABASE = PROJECT_DATABASE;
const MAX_PROJECTS = 12, MAX_VERSIONS = 5;
let opening, lastTimestamp = 0;
const request = (req) => new Promise((resolve, reject) => {
  req.onsuccess = () => resolve(req.result);
  req.onerror = () => reject(req.error || new Error("Browser storage request failed."));
});
const finished = (tx) => new Promise((resolve, reject) => {
  tx.oncomplete = resolve;
  tx.onabort = tx.onerror = () => reject(tx.error || new Error("Browser storage transaction failed."));
});
async function database() {
  if (!globalThis.indexedDB) throw new Error("Browser recovery storage is unavailable. Export a project file to keep your work.");
  if (!opening) opening = new Promise((resolve, reject) => {
    const req = indexedDB.open(DATABASE, 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore("versions", { keyPath: "id" });
      req.result.createObjectStore("assets", { keyPath: "id" });
      req.result.createObjectStore("meta", { keyPath: "key" });
    };
    req.onsuccess = () => {
      const db = req.result;
      db.onversionchange = () => { db.close(); opening = null; };
      resolve(db);
    };
    req.onerror = () => { opening = null; reject(req.error); };
    req.onblocked = () => { opening = null; reject(new Error("Another Audionaut tab is blocking browser recovery. Close that tab and retry.")); };
  });
  return opening;
}
function bounded(records) {
  const groups = new Map(), keep = [];
  for (const record of records.sort((a, b) => b.updatedAt - a.updatedAt)) {
    if (!groups.has(record.projectId)) {
      if (groups.size >= MAX_PROJECTS) continue;
      groups.set(record.projectId, 0);
    }
    if (groups.get(record.projectId) >= MAX_VERSIONS) continue;
    groups.set(record.projectId, groups.get(record.projectId) + 1);
    keep.push(record);
  }
  return keep;
}
export async function saveProjectRevision(project, assets, { isActive = () => true } = {}) {
  const db = await database();
  const tx = db.transaction(["versions", "assets", "meta"], "readwrite"), done = finished(tx);
  const versions = tx.objectStore("versions"), audio = tx.objectStore("assets");
  const record = {
    id: newProjectId(), projectId: project.projectId, projectName: project.projectName,
    updatedAt: lastTimestamp = Math.max(Date.now(), lastTimestamp + 1),
    project, assetIds: [...assetIds(project)],
  };
  const reads = Promise.all([request(versions.getAll()), request(audio.getAllKeys())]);
  try {
    const [existing, oldAssetIds] = await reads;
    const kept = bounded([record, ...existing]), keptIds = new Set(kept.map((r) => r.id));
    versions.put(record);
    for (const previous of existing) if (!keptIds.has(previous.id)) versions.delete(previous.id);
    const referenced = new Set(kept.flatMap((r) => r.assetIds));
    for (const asset of assets) audio.put(asset);
    for (const id of oldAssetIds) if (!referenced.has(id)) audio.delete(id);
    if (isActive()) tx.objectStore("meta").put({ key: "active", value: record.id });
    await done;
    return record;
  } catch (error) { try { tx.abort(); } catch {} await done.catch(() => {}); throw error; }
}
export async function listProjectRevisions() {
  const db = await database(), tx = db.transaction("versions", "readonly");
  const records = await request(tx.objectStore("versions").getAll());
  const latest = new Set();
  return records.sort((a, b) => b.updatedAt - a.updatedAt).map(({ id, projectId, projectName, updatedAt }) => {
    const isLatest = !latest.has(projectId); latest.add(projectId);
    return { id, projectId, projectName, updatedAt, isLatest };
  });
}
export async function loadProjectRevision(id = null) {
  const db = await database(), tx = db.transaction(["versions", "assets", "meta"], "readonly");
  if (!id) id = (await request(tx.objectStore("meta").get("active")))?.value;
  if (!id) return null;
  const record = await request(tx.objectStore("versions").get(id));
  if (!record) throw new Error("That recovery version is no longer available.");
  const assets = await Promise.all(record.assetIds.map((key) => request(tx.objectStore("assets").get(key))));
  if (assets.some((asset) => !asset)) throw new Error("That recovery version has missing audio; the current project was retained.");
  return { ...record, assets };
}
export async function clearActiveProject({ guard = () => true, projectId = null } = {}) {
  const db = await database(), tx = db.transaction(["meta", "versions"], "readwrite"), done = finished(tx);
  try {
    const meta = tx.objectStore("meta"), active = await request(meta.get("active"));
    const record = active ? await request(tx.objectStore("versions").get(active.value)) : null;
    const unchanged = guard();
    if (unchanged && (!projectId || !record || record.projectId === projectId)) meta.delete("active");
    await done;
    return unchanged;
  } catch (error) { try { tx.abort(); } catch {} await done.catch(() => {}); throw error; }
}
export async function deleteProjectRevisions(projectId) {
  const db = await database(), tx = db.transaction(["versions", "assets", "meta"], "readwrite"), done = finished(tx);
  try {
    const [records, keys, active] = await Promise.all([
      request(tx.objectStore("versions").getAll()), request(tx.objectStore("assets").getAllKeys()), request(tx.objectStore("meta").get("active")),
    ]);
    const remaining = records.filter((r) => r.projectId !== projectId);
    for (const record of records) if (record.projectId === projectId) tx.objectStore("versions").delete(record.id);
    const refs = new Set(remaining.flatMap((r) => r.assetIds));
    for (const id of keys) if (!refs.has(id)) tx.objectStore("assets").delete(id);
    if (active && !remaining.some((r) => r.id === active.value)) tx.objectStore("meta").delete("active");
    await done;
  } catch (error) { try { tx.abort(); } catch {} await done.catch(() => {}); throw error; }
}
