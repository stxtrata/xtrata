// Gesture transactions and reversible deltas. Audio payloads never enter history.
import { store } from "./state.js";
import { assetIds, assetBytes, retainAssetIds, pruneAssets } from "./assets.js";
const MAX_HISTORY = 100;
const MAX_BYTES = 8 * 1024 * 1024;
const MAX_ASSET_BYTES = 64 * 1024 * 1024; // old audio kept solely to make undo possible
let entries = [], index = 0, bytes = 0, baseline = null;
let restoring = false, scheduled = false, transactionDepth = 0, generation = 0;
let changed = false, unknownPaths = false, pendingPaths = new Map();
let onChange = null, unsubscribe = [], detachGestures = null;
const copy = (value) => value === undefined ? undefined : structuredClone(value);
function snapshot() {
  const project = copy(store.project);
  delete project.currentSequence; // playback/navigation is never an undoable edit
  return project;
}
function diff(before, after, path = [], changes = []) {
  if (Object.is(before, after)) return changes;
  const objects = before && after && typeof before === "object" && typeof after === "object";
  if (!objects || Array.isArray(before) !== Array.isArray(after) ||
      (Array.isArray(before) && before.length !== after.length)) {
    changes.push({ path, before: copy(before), after: copy(after), hadBefore: before !== undefined, hadAfter: after !== undefined });
  } else {
    for (const key of new Set([...Object.keys(before), ...Object.keys(after)])) diff(before[key], after[key], [...path, key], changes);
  }
  return changes;
}
function apply(project, changes, forward) {
  for (const change of changes) {
    const value = forward ? change.after : change.before;
    const exists = forward ? change.hadAfter : change.hadBefore;
    if (!change.path.length) { project = copy(value); continue; }
    let owner = project;
    for (const key of change.path.slice(0, -1)) owner = owner[key];
    const key = change.path.at(-1);
    if (exists) owner[key] = copy(value); else delete owner[key];
  }
  return project;
}
function retainedAudioBytes() {
  return assetBytes(new Set(entries.flatMap((entry) => entry.assets)), assetIds(store.project));
}
function retain() {
  const ids = assetIds(baseline);
  for (const entry of entries) for (const id of entry.assets) ids.add(id);
  retainAssetIds("history", ids);
  pruneAssets();
}
const listeners = new Set();
function notify() { onChange?.(index > 0, index < entries.length); for (const fn of listeners) fn(index > 0, index < entries.length); }
// Extra observers (the MIDI roll's own Undo/Redo buttons). Returns an unsubscribe function.
export function onHistoryChange(fn) { listeners.add(fn); fn(index > 0, index < entries.length); return () => listeners.delete(fn); }
function invalidateRedo() {
  if (index < entries.length) {
    entries.splice(index);
    bytes = entries.reduce((sum, entry) => sum + entry.bytes, 0);
    notify();
  }
}
function commit() {
  scheduled = false;
  if (restoring || !baseline || !changed) return;
  let current, changes=[];
  if (unknownPaths) { current=snapshot(); changes=diff(baseline,current); }
  else {
    const at=(value,path)=>path.reduce((owner,key)=>owner?.[key],value);
    const paths=[...pendingPaths.values()].sort((a,b)=>a.length-b.length), used=[];
    for(const path of paths) {
      if(used.some(parent=>parent.every((key,i)=>key===path[i])))continue;
      used.push(path);diff(at(baseline,path),at(store.project,path),path,changes);
    }
  }
  changed=false;unknownPaths=false;pendingPaths.clear();
  if (!changes.length) { retain(); return; }
  invalidateRedo();
  const entry = {
    changes,
    assets: [...new Set([...assetIds(baseline), ...assetIds(store.project)])],
    bytes: JSON.stringify(changes).length * 2,
  };
  baseline = current || apply(baseline, changes, true);
  entries.push(entry); bytes += entry.bytes; index = entries.length;
  while (entries.length && (entries.length > MAX_HISTORY || bytes > MAX_BYTES || retainedAudioBytes() > MAX_ASSET_BYTES)) {
    bytes -= entries.shift().bytes; index--;
  }
  retain(); notify();
}
export function record(immediate = false, change = null) {
  if (restoring || !baseline) return;
  changed=true;
  const paths=change?.historyPaths || change?.payload?.historyPaths;
  if (paths?.length) for(const path of paths) {
    if(path[0]!=='currentSequence')pendingPaths.set(JSON.stringify(path),path);
  } else unknownPaths=true;
  invalidateRedo(); // a new edit invalidates redo now, even before the gesture ends
  if (immediate) { generation++; commit(); return; }
  if (transactionDepth || scheduled) return;
  scheduled = true;
  const mine = generation;
  queueMicrotask(() => { if (mine === generation && !transactionDepth) commit(); });
}
export function beginTransaction() {
  if (!transactionDepth) { generation++; commit(); }
  transactionDepth++;
}
export function endTransaction() {
  if (transactionDepth) transactionDepth--;
  if (!transactionDepth) { generation++; commit(); }
}
function flush() { generation++; transactionDepth = 0; commit(); }
function restore() {
  restoring = true;
  try {
    const project = copy(baseline);
    project.currentSequence = Math.min(store.project.currentSequence, project.sequences.length - 1);
    store.loadProject(project, { restore: true });
  } finally { restoring = false; }
  retain(); notify();
}
export function undo() {
  flush();
  if (!index) return false;
  baseline = apply(copy(baseline), entries[--index].changes, false);
  restore(); return true;
}
export function redo() {
  flush();
  if (index >= entries.length) return false;
  baseline = apply(copy(baseline), entries[index++].changes, true);
  restore(); return true;
}
export function resetHistory() {
  generation++; scheduled = false; transactionDepth = 0;
  changed=false;unknownPaths=false;pendingPaths.clear();
  baseline = snapshot(); entries = []; index = 0; bytes = 0;
  retain(); notify();
}
function gestureHooks() {
  if (typeof document === "undefined") return () => {};
  const pointers = new Set(), keys = new Set();
  const down = (e) => { if (!pointers.size && !keys.size) beginTransaction(); pointers.add(e.pointerId); };
  const up = (e) => {
    pointers.delete(e.pointerId);
    queueMicrotask(() => { if (!pointers.size && !keys.size) endTransaction(); });
  };
  const keyDown = (e) => {
    if (e.repeat || keys.has(e.code)) return;
    if (!keys.size && !pointers.size) beginTransaction();
    keys.add(e.code);
  };
  const keyUp = (e) => { keys.delete(e.code); queueMicrotask(() => { if (!keys.size && !pointers.size) endTransaction(); }); };
  const cancel = () => { keys.clear(); pointers.clear(); flush(); };
  const events = [["pointerdown", down], ["pointerup", up], ["pointercancel", up], ["keydown", keyDown], ["keyup", keyUp]];
  for (const [event, fn] of events) document.addEventListener(event, fn, true);
  globalThis.addEventListener?.("blur", cancel);
  return () => {
    for (const [event, fn] of events) document.removeEventListener(event, fn, true);
    globalThis.removeEventListener?.("blur", cancel);
  };
}
export function initHistory(callback) {
  for (const off of unsubscribe) off(); detachGestures?.();
  onChange = callback;
  resetHistory();
  unsubscribe = [store.on("dirty", change => { if(change?.event!=='load')record(false,change); }), store.on("load", ({ restore } = {}) => { if (!restore) resetHistory(); }),
    store.on('identity',({projectId})=>{if(baseline)baseline.projectId=projectId;})];
  detachGestures = gestureHooks();
}
export function historyStats() { return { entries: entries.length, undo: index, redo: entries.length - index, bytes, maxBytes: MAX_BYTES, assetBytes: retainedAudioBytes(), maxAssetBytes: MAX_ASSET_BYTES }; }
