#!/usr/bin/env node
// Verify beta startup, preferences, migration and recovery never touch production DAW state.
import assert from "node:assert/strict";
import { STORAGE_KEYS, PROJECT_DATABASE, ccStorageKey, HANDOFF_SOURCE } from "../daw/js/storage-config.js";
import { serve, browser } from "./serve.mjs";
for (const key of [...Object.values(STORAGE_KEYS), ccStorageKey("jims10")]) assert.ok(key.startsWith("audionaut.beta."));
assert.equal(PROJECT_DATABASE, "audionaut-beta-projects-v1");
assert.equal(HANDOFF_SOURCE, "audionaut-beta");
const { srv, url } = await serve();
let b;
try {
  b = await browser();
  const page = await b.newPage();
  const errors = []; page.on("pageerror", (error) => errors.push(error.message));
  await page.route("**/*", (route) => route.request().url().startsWith(url) ? route.continue() : route.abort());
  await page.route(url + "/__storage-isolation", (route) => route.fulfill({ contentType: "text/html", body: "<!doctype html><title>Storage isolation</title>" }));
  const starter = { format: "audionaut-workstation/2", projectName: "Beta starter", channels: [{}], sequences: [{ steps: [Array(64).fill(0)], notes: [[], [], [], []] }] };
  await page.route("**/audionaut-beta/daw/data/starters/afrobeat.json", (route) => route.fulfill({ contentType: "application/json", body: JSON.stringify(starter) }));
  await page.goto(url + "/__storage-isolation");
  const production = await page.evaluate(async (starter) => {
    const project = { ...starter, projectName: "Untouched production project", projectId: "production-sentinel" };
    const local = {
      "audionaut.v0.2.project": JSON.stringify(project),
      "audionaut.v0.2.settings": JSON.stringify({ autosave: false, ordinalsGateway: "https://production.invalid/" }),
      "audionaut.v0.2.favourites": "[]", "audionaut.v0.2.clip-library": '{"production":"clip-library"}',
      "audionaut.midi": "off", "audionaut.dock": '{"open":false,"inst":2}',
      "audionaut.view": "grid", "audionaut.cc.jims10": '{"7":"cutoff"}',
    };
    for (const [key,value] of Object.entries({...local})) local[key.replace('audionaut.','audionaut.beta-pro.')] = 'beta-pro sentinel ' + value;
    for (const [key, value] of Object.entries(local)) localStorage.setItem(key, value);
    const record = { id: "production-revision", projectId: project.projectId, projectName: project.projectName, updatedAt: 1, project, assetIds: [] };
    await new Promise((resolve, reject) => {
      const req = indexedDB.open("audionaut-projects-v1", 1);
      req.onupgradeneeded = () => { for (const name of ["versions", "assets"]) req.result.createObjectStore(name, { keyPath: "id" }); req.result.createObjectStore("meta", { keyPath: "key" }); };
      req.onerror = () => reject(req.error);
      req.onsuccess = () => { const db = req.result, tx = db.transaction(["versions", "meta"], "readwrite"); tx.objectStore("versions").put(record); tx.objectStore("meta").put({ key: "active", value: record.id }); tx.oncomplete = () => { db.close(); resolve(); }; tx.onerror = () => reject(tx.error); };
    });
    return { local, record };
  }, starter);
  await page.addInitScript(() => {
    window.__storageTraffic = [];
    for (const method of ["getItem", "setItem", "removeItem"]) {
      const original = Storage.prototype[method];
      Storage.prototype[method] = function (key, ...args) {
        if (String(key).startsWith("audionaut.") && !String(key).startsWith("audionaut.beta.")) window.__storageTraffic.push({ method, key });
        return original.call(this, key, ...args);
      };
    }
    const open = indexedDB.open.bind(indexedDB);
    indexedDB.open = (name, ...args) => { window.__storageTraffic.push({ method: "open", key: name }); return open(name, ...args); };
    navigator.requestMIDIAccess = async () => ({ inputs: new Map(), onstatechange: null });
  });
  await page.goto(url + "/audionaut-beta/daw.html");
  await page.waitForFunction(() => document.querySelector("#project-name").value === "Beta starter");
  await page.click("#btn-view");
  const result = await page.evaluate(async (keys) => {
    const { store } = await import("/audionaut-beta/daw/js/state.js");
    const P = await import("/audionaut-beta/daw/js/persistence.js");
    const M = await import("/audionaut-beta/daw/js/midi-input.js");
    const S = await import("/audionaut-beta/daw/js/synth-panel.js");
    const F = await import("/audionaut-beta/daw/js/source-browser.js");
    const C = await import("/audionaut-beta/daw/js/clip-library.js");
    const assert = (ok, message) => { if (!ok) throw Error(message); };
    assert(store.settings.autosave === true, "production preferences must not load in beta");
    assert(await M.ensureMidi(), "production MIDI-off preference must not disable beta MIDI");
    await M.setMidiEnabled(false);
    S.closeSynthPanel(); S.openSynthPanel(0);
    assert(F.getFavourites().length === 0, "beta favourites start separately");
    const clips = await C.getClipLibrary();
    C.saveClipEdits(clips.clips[0].id, { title: "Beta clip edit" });
    store.settings.autosave = false; P.saveSettings(); store.settings.autosave = true; P.saveSettings();
    store.setProjectProp("projectName", "Beta saved project"); await P.autosave({ force: true });
    assert((await P.listSavedProjects()).every((r) => r.projectId !== "production-sentinel"), "production recovery must not appear in beta");
    await P.clearAutosave();
    const legacy = JSON.parse(P.exportProject()); legacy.projectName = "Beta legacy recovery";
    localStorage.setItem(keys.legacyProject, JSON.stringify(legacy));
    assert(await P.restoreAutosave(), "beta can migrate its own legacy save");
    assert(localStorage.getItem(keys.legacyProject) === null, "beta legacy migration completes");
    assert(store.project.projectName === "Beta legacy recovery", "beta legacy contents restored");
    const { prepareInscription } = await import("/audionaut-beta/daw/js/publish.js");
    const { takeCreateHandoff } = await import("/create-routing.js");
    const handoff = new URL(await prepareInscription(new File([P.exportProject()], "beta.json", { type: "application/json" })), location.origin);
    const selected = await takeCreateHandoff(handoff.searchParams.get("handoffId"));
    assert(handoff.searchParams.get("from") === "audionaut-beta" && selected.source === "audionaut-beta", "shared handoff labels beta explicitly");
    return { traffic: [...window.__storageTraffic], betaKeys: Object.keys(localStorage).filter((key) => key.startsWith("audionaut.beta.")) };
  }, STORAGE_KEYS);
  assert.deepEqual(result.traffic.filter((entry) => entry.key !== PROJECT_DATABASE && entry.key !== "xtrata-create-handoff"), [], "beta never reads/writes/removes production browser state");
  assert.ok(result.betaKeys.includes(STORAGE_KEYS.settings));
  assert.ok(result.betaKeys.includes(STORAGE_KEYS.clipLibrary));
  assert.ok(result.betaKeys.includes(STORAGE_KEYS.midi));
  assert.ok(result.betaKeys.includes(STORAGE_KEYS.dock));
  assert.ok(result.betaKeys.includes(STORAGE_KEYS.view));
  const after = await page.evaluate(async (keys) => {
    const local = Object.fromEntries(keys.map((key) => [key, localStorage.getItem(key)]));
    const record = await new Promise((resolve, reject) => { const req = indexedDB.open("audionaut-projects-v1", 1); req.onerror = () => reject(req.error); req.onsuccess = () => { const db = req.result, get = db.transaction("versions").objectStore("versions").get("production-revision"); get.onsuccess = () => { db.close(); resolve(get.result); }; get.onerror = () => reject(get.error); }; });
    return { local, record };
  }, Object.keys(production.local));
  assert.deepEqual(after, production, "production project/settings/library/preferences and database remain byte-for-byte unchanged");
  assert.deepEqual(errors, []);
  console.log("PASS beta storage isolation: production state untouched, beta migration/recovery/preferences separate, shared handoff labeled beta");
} finally { await b?.close(); await new Promise((resolve) => srv.close(resolve)); }
