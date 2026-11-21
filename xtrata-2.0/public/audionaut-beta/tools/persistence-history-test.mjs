#!/usr/bin/env node
// node public/audionaut-beta/tools/persistence-history-test.mjs
// Pure state/history checks plus real Chromium IndexedDB persistence and migration.
import assert from "node:assert/strict";
import { store, makeProject } from "../daw/js/state.js";
import * as history from "../daw/js/history.js";
import * as assets from "../daw/js/assets.js";
import * as persistence from "../daw/js/persistence.js";
import { serve, browser } from "./serve.mjs";
const flush = async () => { await Promise.resolve(); };
const variant = { type: "synth", value: "bank-sound", rootMidi: 60, velocityLayer: 1, version: "2.0.0" };
for (const [key, value] of [["rootMidi", 72], ["velocityLayer", 2], ["version", "3.0.0"]])
  assert.notEqual(assets.sourceIdentity(variant), assets.sourceIdentity({ ...variant, [key]: value }), `${key} must invalidate decoded audio`);
assert.equal(assets.sourceIdentity(variant), assets.sourceIdentity({ label: "Display only", ...variant }));

history.initHistory(() => {});
store.loadProject(makeProject());
store.selectSequence(1); await flush();
assert.equal(history.historyStats().undo, 1, "creating a sequence is undoable");
history.resetHistory();
for (let i = 0; i < 200; i++) store.selectSequence(i % 2);
await flush();
assert.equal(history.historyStats().entries, 0, "navigation and chained playback do not fill history");
store.setProjectProp("bpm", 130); await flush();
store.setProjectProp("bpm", 140); await flush();
assert.equal(history.historyStats().undo, 2, "separate actions remain separate inside250ms");
assert.equal(history.undo(), true); assert.equal(store.project.bpm, 130);
store.setProjectProp("bpm", 150);
assert.equal(history.redo(), false, "a pending edit invalidates redo immediately");
assert.equal(store.project.bpm, 150);
history.resetHistory();
history.beginTransaction();
for (let i = 0; i < 80; i++) store.setProjectProp("swing", i / 2);
await flush();
assert.equal(history.historyStats().entries, 0);
history.endTransaction();
assert.equal(history.historyStats().entries, 1, "one gesture is one delta");
history.undo(); assert.equal(store.project.swing, 0);
history.redo(); assert.equal(store.project.swing, 39.5);

const data = "data:audio/octet-stream;base64," + Buffer.alloc(2 * 1024 * 1024, 137).toString("base64");
const source = assets.assetSource({ type: "file", value: data, label: "sample.wav" });
assert.equal(source.localAssetId, assets.assetSource({ type: "file", value: data }).localAssetId);
store.setChannelProp(0, "source", source); await flush();
for (let i = 0; i < 120; i++) { store.setProjectProp("bpm", 80 + i); history.record(true); }
assert.equal(history.historyStats().entries, 100);
assert.ok(history.historyStats().bytes < 100000, "embedded audio does not multiply in undo deltas");
assert.equal(assets.assetStats().count, 1);
const exported = persistence.exportProject();
assert.equal(JSON.parse(exported).channels[0].source.value, data, "exports remain portable to older DAW versions");
assert.equal(JSON.parse(exported).channels[0].source.localAssetId, undefined);
persistence.importProject(exported);
assert.equal(assets.assetData(store.channel(0).source.localAssetId), data);
const retained = store.project, invalid = JSON.parse(exported);
invalid.channels[1] = null;
assert.throws(() => persistence.importProject(invalid)); assert.equal(store.project, retained);
for (const bpm of [-120, "Infinity", 0]) {
  const before=store.project;
  assert.throws(()=>persistence.importProject({ projectSequences: {Sequence0:{}}, projectBPM: bpm }),/setting|tempo|number/i);
  assert.equal(store.project,before,'invalid legacy tempo cannot replace the active project');
}
store.loadProject(makeProject()); history.resetHistory();
assert.equal(assets.assetStats().count, 0, "assets outside the current project and history are released");
store.project.largeMetadata = "x".repeat(5 * 1024 * 1024); store.emit("dirty"); history.record(true);
assert.ok(history.historyStats().bytes <= history.historyStats().maxBytes, "large actions respect history byte budget");
store.loadProject(makeProject()); history.resetHistory();
store.setChannelProp(0, "source", assets.assetSource({ type: "file", value: "data:audio/wav;base64," + "A".repeat(33 * 1024 * 1024) }));
history.record(true);
store.setChannelProp(0, "source", null); history.record(true);
assert.ok(history.historyStats().assetBytes <= history.historyStats().maxAssetBytes, "old audio has a separate retention budget");
assert.equal(assets.assetStats().count, 0, "oversized orphan audio is evicted with its undo action");
console.log("PASS state/history: transactions, redo, transport, memory cap, portable import/export, atomic validation, legacy tempo");

const { srv, url } = await serve();
let b;
try {
  b = await browser();
  const context = await b.newContext(), page = await context.newPage();
  await page.route(url + "/__storage-test", (r) => r.fulfill({ contentType: "text/html", body: "<!doctype html><title>Storage checks</title>" }));
  await page.goto(url + "/__storage-test");
  const result = await page.evaluate(async () => {
    const { store, makeProject } = await import("/audionaut-beta/daw/js/state.js");
    const H = await import("/audionaut-beta/daw/js/history.js");
    const A = await import("/audionaut-beta/daw/js/assets.js");
    const P = await import("/audionaut-beta/daw/js/persistence.js");
    const check = (value, message) => { if (!value) throw Error(message); };
    H.initHistory(() => {});
    const observed = []; P.subscribeSaveStatus((status) => observed.push(status));
    const data = "data:audio/wav;base64," + btoa("test sample bytes");
    store.loadProject(makeProject());
    store.setProjectProp("projectName", "First project");
    store.setChannelProp(0, "source", A.assetSource({ type: "file", value: data, label: "local.wav" }));
    const projectId = store.project.projectId;
    for (let i = 0; i < 7; i++) { store.setProjectProp("bpm", 100 + i); await P.autosave(); }
    let saved = await P.listSavedProjects();
    check(saved.length === 5, "five bounded recovery versions");
    check(saved.filter((v) => v.isLatest).length === 1, "latest marker");
    const older = saved.at(-1), last = saved[0];
    store.loadProject(makeProject()); H.resetHistory();
    check(A.assetStats().count === 0, "unloaded audio released from memory");
    await P.restoreSavedProject(older.id);
    check(store.project.bpm === 102 && store.project.projectId === projectId, "older revision restores");
    check(await A.blobDataUrl(A.assetBlob(store.channel(0).source.localAssetId)) === data, "persisted binary audio restores byte-for-byte");
    await P.restoreSavedProject(last.id);
    check(store.project.bpm === 106, "latest revision restores");
    const portable = JSON.parse(await P.exportProjectAsync());
    check(portable.channels[0].source.value === data && !portable.channels[0].source.localAssetId, "portable recovered export");
    // A second project stays available independently; its identical asset is deduplicated on disk.
    store.loadProject(makeProject()); store.setProjectProp("projectName", "Second project");
    store.setChannelProp(0, "source", A.assetSource({ type: "file", value: data }));
    const secondId = store.project.projectId;
    await P.autosave();
    saved = await P.listSavedProjects();
    check(new Set(saved.map((r) => r.projectId)).size === 2, "multiple independent projects");
    const db = await new Promise((resolve, reject) => { const req = indexedDB.open("audionaut-beta-projects-v1"); req.onsuccess = () => resolve(req.result); req.onerror = () => reject(req.error); });
    const countAssets = () => new Promise((resolve) => { const r = db.transaction("assets").objectStore("assets").count(); r.onsuccess = () => resolve(r.result); });
    check(await countAssets() === 1, "audio shared across persisted projects");
    await P.clearAutosave();
    check(await P.restoreAutosave() === false, "New clears active pointer without erasing recovery versions");
    check((await P.listSavedProjects()).length === 6, "New preserves recovery browser");
    await P.deleteSavedProject(projectId);
    check(await countAssets() === 1, "shared audio survives deleting one project");
    await P.deleteSavedProject(secondId);
    check(await countAssets() === 0, "orphan audio is garbage collected");
    // Existing single-key localStorage saves migrate only after a committed IndexedDB write.
    portable.projectId = "legacy-migration-test";
    localStorage.setItem("audionaut.beta.v0.2.project", JSON.stringify(portable));
    check(await P.restoreAutosave() === true, "legacy recovery imports");
    check(localStorage.getItem("audionaut.beta.v0.2.project") === null, "legacy key removed after successful migration");
    check(store.project.projectId === "legacy-migration-test", "migration keeps identity");
    check(observed.some((s) => s.state === "saving") && observed.at(-1).state === "saved", "save status lifecycle");
    // Completed saves capture the requested revision even if another edit happens during hashing.
    store.setProjectProp("bpm", 111);
    const pending = P.autosave();
    store.setProjectProp("bpm", 222);
    await pending;
    check(observed.at(-1).dirty, "save completion cannot mark newer changes saved");
    // Restoration waits for IndexedDB without overwriting edits made during that wait.
    const recovering = P.restoreAutosave();
    store.setProjectProp("projectName", "Edit during restore");
    check(await recovering === false && store.project.projectName === "Edit during restore", "async restore guard");
    store.settings.autosave = false;
    const countBeforeDisabled = (await P.listSavedProjects()).length;
    await P.autosave();
    check((await P.listSavedProjects()).length === countBeforeDisabled, "autosave setting respected");
    await P.autosave({ force: true });
    check(observed.at(-1).state === "saved", "explicit browser save works with autosave off");
    store.settings.autosave = true;
    const beforeFailure = (await P.listSavedProjects()).map((r) => r.id).join(",");
    const realPut = IDBObjectStore.prototype.put;
    IDBObjectStore.prototype.put = function (...args) {
      if (this.name === "versions") throw new DOMException("Simulated quota failure", "QuotaExceededError");
      return realPut.apply(this, args);
    };
    store.setProjectProp("bpm", 223); // unchanged checkpoints intentionally deduplicate without writing
    let rejected = false;
    try { await P.autosave(); } catch { rejected = true; }
    finally { IDBObjectStore.prototype.put = realPut; }
    check(rejected && observed.at(-1).state === "error", "storage errors are visible");
    check((await P.listSavedProjects()).map((r) => r.id).join(",") === beforeFailure, "failed saves retain prior recovery atomically");
    store.setProjectProp("bpm", 123); const first = P.autosave();
    store.setProjectProp("bpm", 234); const second = P.autosave();
    await Promise.all([first, second]);
    const newest = (await P.listSavedProjects())[0];
    await P.restoreSavedProject(newest.id);
    check(store.project.bpm === 234, "concurrent saves retain ordered immutable revisions");
    const oldSave = P.autosave(), clear = P.clearAutosave();
    store.loadProject(makeProject());
    await Promise.all([oldSave, clear]);
    check(await P.restoreAutosave() === false, "pending old saves cannot reactivate a cleared project");
    // Retention limits remove old projects and their unique orphaned audio.
    for (let i = 0; i < 14; i++) {
      store.loadProject(makeProject());
      store.setProjectProp("projectName", "Retention " + i);
      store.setChannelProp(0, "source", A.assetSource({ type: "file", value: "data:audio/wav;base64," + btoa("unique audio " + i) }));
      await P.autosave();
    }
    check(new Set((await P.listSavedProjects()).map((r) => r.projectId)).size === 12, "project count bounded");
    check(await countAssets() === 12, "automatic retention also deletes orphan audio");
    db.close();
    return { recoveryVersions: (await P.listSavedProjects()).length, statuses: [...new Set(observed.map((s) => s.state))] };
  });
  console.log("PASS real Chromium IndexedDB:", JSON.stringify(result));
  await context.close();
} finally { await b?.close(); await new Promise((resolve) => srv.close(resolve)); }
