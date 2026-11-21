#!/usr/bin/env node
// Real UI regressions for replacements and inscription handoff racing edits.
import assert from "node:assert/strict";
import { serve, browser } from "./serve.mjs";
const { srv, url } = await serve();
let b;
try {
  b = await browser();
  const page = await b.newPage();
  const errors = []; page.on("pageerror", (error) => errors.push(error.message));
  page.on("dialog", (dialog) => dialog.accept());
  await page.route("**/*", (route) => route.request().url().startsWith(url) ? route.continue() : route.abort());
  await page.addInitScript(() => {
    localStorage.setItem("audionaut.beta.v0.2.project", JSON.stringify({ format: "audionaut-workstation/2", projectName: "Race start", channels: [{}], sequences: [{ steps: [Array(64).fill(0)], notes: [[], [], [], []] }] }));
    navigator.requestMIDIAccess = async () => ({ inputs: new Map(), addEventListener() {} });
  });
  await page.goto(url + "/audionaut-beta/daw.html");
  await page.waitForFunction(() => document.querySelector("#project-name").value === "Race start" && document.querySelector("#save-state").dataset.state === "saved");
  const incoming = await page.evaluate(async () => {
    const P = await import("/audionaut-beta/daw/js/persistence.js");
    const data = JSON.parse(P.exportProject()); data.projectName = "Incoming file"; return JSON.stringify(data);
  });
  await page.evaluate(() => {
    const original = File.prototype.arrayBuffer;
    File.prototype.arrayBuffer = function () { return this.name === "delayed.json" ? new Promise((resolve) => window.__fileReady = resolve) : original.call(this); };
  });
  await page.setInputFiles("#file-input", { name: "delayed.json", mimeType: "application/json", buffer: Buffer.from(incoming) });
  await page.waitForFunction(() => typeof window.__fileReady === "function");
  await page.evaluate(async (incoming) => {
    const { store } = await import("/audionaut-beta/daw/js/state.js");
    store.setProjectProp("bpm", 177); window.__fileReady(new TextEncoder().encode(incoming).buffer);
  }, incoming);
  await page.waitForFunction(() => document.querySelector("#status-text").textContent.includes("changed while the file"));
  assert.equal(await page.evaluate(async () => (await import("/audionaut-beta/daw/js/state.js")).store.project.bpm), 177);

  await page.evaluate(() => {
    const original = window.fetch;
    window.fetch = (resource, options) => String(resource).endsWith("starters/afrobeat.json") ? new Promise((resolve) => window.__starterReady = (text) => resolve(new Response(text, { status: 200 }))) : original(resource, options);
  });
  await page.click("#btn-starter");
  await page.waitForFunction(() => typeof window.__starterReady === "function");
  await page.evaluate(async (incoming) => {
    const { store } = await import("/audionaut-beta/daw/js/state.js");
    store.setProjectProp("projectName", "Edited during starter"); window.__starterReady(incoming);
  }, incoming);
  await page.waitForTimeout(50);
  assert.equal(await page.evaluate(async () => (await import("/audionaut-beta/daw/js/state.js")).store.project.projectName), "Edited during starter");

  await page.evaluate(async () => {
    const { store } = await import("/audionaut-beta/daw/js/state.js");
    const A = await import("/audionaut-beta/daw/js/assets.js"), P = await import("/audionaut-beta/daw/js/persistence.js");
    const digest = crypto.subtle.digest.bind(crypto.subtle);
    crypto.subtle.digest = (...args) => new Promise((resolve, reject) => window.__hashReady = () => { crypto.subtle.digest = digest; digest(...args).then(resolve, reject); });
    store.setChannelProp(0, "source", A.assetSource({ type: "file", value: "data:audio/wav;base64," + btoa("delayed audio") }));
    window.__saving = P.autosave();
  });
  await page.waitForFunction(() => typeof window.__hashReady === "function");
  await page.click("#btn-new");
  await page.evaluate(async () => {
    const { store } = await import("/audionaut-beta/daw/js/state.js");
    store.setProjectProp("bpm", 199); window.__hashReady(); await window.__saving;
  });
  await page.waitForFunction(() => document.querySelector("#status-text").textContent.includes("changed while New"));
  assert.equal(await page.evaluate(async () => (await import("/audionaut-beta/daw/js/state.js")).store.project.bpm), 199);
  await page.evaluate(async () => { const { store } = await import("/audionaut-beta/daw/js/state.js"); store.setChannelProp(0, "source", null); });

  await page.click("#btn-publish");
  await page.selectOption("#publish-format", "project");
  await page.click("#publish-prepare");
  await page.waitForFunction(() => !document.querySelector("#publish-continue").disabled);
  // Change the project inside the asynchronous handoff write, after its save completed.
  await page.evaluate(async () => {
    const { store } = await import("/audionaut-beta/daw/js/state.js");
    const put = IDBObjectStore.prototype.put;
    IDBObjectStore.prototype.put = function (...args) {
      if (this.name === "pending") { store.setProjectProp("projectName", "Edit during handoff"); IDBObjectStore.prototype.put = put; }
      return put.apply(this, args);
    };
  });
  await page.click("#publish-continue");
  await page.waitForFunction(() => document.querySelector("#publish-status").textContent.includes("changed before the inscription review"));
  assert.ok(page.url().endsWith("/audionaut-beta/daw.html"), "new edits cannot navigate away to an old prepared inscription");
  assert.equal(await page.locator("#publish-continue").isDisabled(), true);
  assert.equal(await page.evaluate(() => new Promise((resolve, reject) => {
    const request = indexedDB.open("xtrata-create-handoff");
    request.onerror = () => reject(request.error);
    request.onsuccess = () => { const db = request.result, count = db.transaction("pending").objectStore("pending").count(); count.onsuccess = () => { resolve(count.result); db.close(); }; };
  })), 0, "canceled handoff audio is removed");
  assert.deepEqual(errors, []);
  console.log("PASS real UI races: file read, starter fetch, New storage wait, inscription handoff");
} finally { await b?.close(); await new Promise((resolve) => srv.close(resolve)); }
