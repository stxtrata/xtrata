#!/usr/bin/env node
// Exercise the shared production gate without a wallet, chain access, or gate bypass.
// Use AUDIONAUT_GATE_BUNDLE for a locally downloaded production bundle when the
// ignored build output is absent. Its bytes are served unchanged; never commit it.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { serve, browser } from "./serve.mjs";

const bundlePath = process.env.AUDIONAUT_GATE_BUNDLE || fileURLToPath(new URL("../../audionaut/audionaut-gate.js", import.meta.url));
const bundle = await readFile(bundlePath).catch((error) => {
  throw new Error(`Gate bundle unavailable: build:audionaut or set AUDIONAUT_GATE_BUNDLE to an unchanged production bundle. ${error.message}`);
});
const SESSION_KEY = "xtrata.v15.1.wallet.session";
const ADDRESS = "SP" + "0".repeat(39); // Synthetic; never connects to a wallet.
const CORE_ASSET = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3::xtrata-inscription";
const COLLECTION = "SP3JB6BCKV14CG25NF017CR7KRVSM8RAGHB52DWHX/xtrata-collection-audionauts-1-3c855746";
const GATE_PATH = "/audionaut/audionaut-gate.js";
const BETA_DAW = "/audionaut-beta/daw.html";
const MAIN_DAW = "/audionaut/daw.html";
const deferred = () => {
  let resolve;
  const promise = new Promise((done) => { resolve = done; });
  return { promise, resolve };
};
const observed = async (event, label) => {
  let timer;
  try {
    await Promise.race([event.promise, new Promise((_, reject) => { timer = setTimeout(() => reject(new Error(`Timed out waiting for ${label}`)), 10000); })]);
  } finally { clearTimeout(timer); }
};
const { srv, url } = await serve();
let b;
try {
  b = await browser();

  async function scenario(name, { session = true, held = true, member = false, delayed = false, fault = false } = {}) {
    const context = await b.newContext({ serviceWorkers: "block", viewport: { width: 1440, height: 1000 } });
    const p = await context.newPage();
    const errors = [], dawRequests = [], unexpected = [];
    const requestedHoldings = deferred(), requestedProof = deferred();
    const allowHoldings = deferred(), allowProof = deferred();
    let gateRequests = 0, holdingsRequests = 0, proofRequests = 0;
    if (!delayed) { allowHoldings.resolve(); allowProof.resolve(); }
    p.on("pageerror", (error) => errors.push(error.message));
    if (session) await p.addInitScript(({ key, address }) => {
      if (window !== window.top) return;
      localStorage.setItem(key, JSON.stringify({ isConnected: true, address, network: "mainnet" }));
    }, { key: SESSION_KEY, address: ADDRESS });
    // All external requests are blocked. Only static files and the explicit
    // chain-read fixtures below can be reached, including from the child frame.
    await context.route("**/*", async (route) => {
      const request = route.request(), target = new URL(request.url());
      if (target.origin !== url) return route.abort();
      if (target.pathname === GATE_PATH) {
        gateRequests++;
        return route.fulfill({ contentType: "text/javascript", body: bundle });
      }
      // Sales are independent of the access check; do not load purchase code.
      if (target.pathname === "/audionaut/sell/audionaut-sell.js") return route.fulfill({ contentType: "text/javascript", body: "// Sales are outside this gate test." });
      if (target.pathname === BETA_DAW || target.pathname === MAIN_DAW) {
        dawRequests.push(target.pathname);
        // DAW functionality has its own browser suite. This fixture observes
        // the actual gate's iframe navigation and subsequent unload directly.
        return route.fulfill({ contentType: "text/html", body: "<!doctype html><title>Gate destination fixture</title><p id='destination'>Studio mounted</p>" });
      }
      if (target.pathname === "/hiro/mainnet/extended/v1/tokens/nft/holdings") {
        holdingsRequests++;
        assert.equal(request.method(), "GET");
        assert.equal(target.searchParams.get("principal"), ADDRESS);
        assert.equal(target.searchParams.get("asset_identifiers"), CORE_ASSET);
        requestedHoldings.resolve();
        await allowHoldings.promise;
        return route.fulfill({ status: fault ? 503 : 200, contentType: "application/json", body: JSON.stringify({ total: held ? 1 : 0, results: held ? [{ value: { repr: "u999999" } }] : [] }) });
      }
      if (target.pathname === `/hiro/mainnet/v2/contracts/call-read/${COLLECTION}/get-token-mint-context`) {
        proofRequests++;
        assert.equal(request.method(), "POST");
        assert.deepEqual(request.postDataJSON(), { sender: ADDRESS, arguments: ["0x01" + BigInt(999999).toString(16).padStart(32, "0")] });
        requestedProof.resolve();
        await allowProof.promise;
        return route.fulfill({ contentType: "application/json", body: JSON.stringify({ okay: true, result: member ? "0x0a0c00000003" : "0x09" }) });
      }
      // Edition/helmet metadata is display-only and optional.
      if (target.pathname.startsWith("/i/")) return route.fulfill({ contentType: "text/plain", body: "No edition metadata in this fixture." });
      if (target.pathname.startsWith("/hiro/") || request.method() !== "GET") {
        unexpected.push(`${request.method()} ${target.pathname}`);
        return route.abort();
      }
      return route.continue();
    });
    const sealed = async () => {
      assert.equal(await p.locator("#daw").getAttribute("src"), null, `${name}: no DAW src before verification`);
      assert.equal(await p.locator("#daw").evaluate((frame) => frame.hidden), true);
      assert.deepEqual(dawRequests, [], `${name}: no DAW request before verification`);
    };
    try {
      await p.goto(url + "/audionaut-beta/");
      assert.equal(gateRequests, 1, `${name}: loads the existing shared gate bundle`);
      assert.equal(await p.locator("body").getAttribute("data-daw-src"), BETA_DAW);
      if (!session) {
        assert.equal(await p.locator("#actionLabel").textContent(), "CONNECT WALLET");
        await sealed();
        assert.equal(holdingsRequests, 0);
        assert.equal(proofRequests, 0);
        for (const width of [1440, 390]) {
          await p.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
          const bounds = await p.evaluate(() => ({
            width: innerWidth, scrollWidth: document.documentElement.scrollWidth,
            elements: [".panel", ".controls", ".caption", "#action"].map((selector) => {
              const { left, right } = document.querySelector(selector).getBoundingClientRect();
              return { selector, left, right };
            }),
          }));
          assert.ok(bounds.scrollWidth <= bounds.width + 1, `${width}px gate has no horizontal overflow`);
          for (const element of bounds.elements) assert.ok(element.left >= -1 && element.right <= width + 1, `${width}px ${element.selector} stays within viewport`);
          if (process.env.SCREENSHOT_DIR) {
            await mkdir(process.env.SCREENSHOT_DIR, { recursive: true });
            await p.screenshot({ path: join(process.env.SCREENSHOT_DIR, `audionaut-beta-gate-${width}.png`), fullPage: true });
          }
        }
      } else {
        await observed(requestedHoldings, "holdings lookup");
        if (delayed) {
          await sealed();
          allowHoldings.resolve();
          await observed(requestedProof, "collection proof");
          // An inscription held by the wallet is insufficient: collection
          // membership must finish before the frame can be mounted.
          // Wait past the gate's normal 1.76-second scan animation while the
          // proof remains unanswered: animation completion cannot grant access.
          await p.waitForTimeout(2200);
          await sealed();
          allowProof.resolve();
        }
        if (!member || fault) {
          await p.waitForFunction(() => document.querySelector("#headline").textContent === "Access denied" || document.querySelector("#headline").textContent === "Signal lost");
          await sealed();
          assert.equal(await p.locator("#headline").textContent(), fault ? "Signal lost" : "Access denied");
          assert.equal(proofRequests, held && !fault ? 1 : 0);
        } else {
          await p.waitForFunction(() => document.body.dataset.view === "seq");
          assert.equal(await p.locator("#daw").getAttribute("src"), BETA_DAW);
          assert.deepEqual(dawRequests, [BETA_DAW], "member unlocks only the beta destination");
          assert.ok(proofRequests >= 1, "unlock required collection proof");
          const frame = await p.locator("#daw").contentFrame();
          assert.equal(await frame.locator("#destination").textContent(), "Studio mounted");
          await p.locator("#leave").click();
          await p.waitForFunction(() => !document.querySelector("#daw").hasAttribute("src") && document.querySelector("#daw").hidden);
          await p.waitForFunction((key) => localStorage.getItem(key) === null, SESSION_KEY);
          assert.equal(await p.locator("body").getAttribute("data-view"), "gate");
          assert.equal(await p.locator("#daw").evaluate((element) => element.contentDocument?.getElementById("destination") === null), true, "disconnect unloads the child document");
        }
      }
      assert.deepEqual(unexpected, [], `${name}: only expected read-only chain fixtures used`);
      assert.deepEqual(errors, [], `${name}: no uncaught browser errors`);
      console.log(`PASS gate: ${name}`);
    } finally {
      allowHoldings.resolve(); allowProof.resolve();
      await context.close();
    }
  }

  await scenario("no session stays sealed", { session: false });
  await scenario("empty holdings denied", { held: false });
  await scenario("non-Audionaut inscription denied");
  await scenario("lookup failure stays sealed", { fault: true });
  await scenario("held Audionaut proof unlocks beta; disconnect unloads", { member: true, delayed: true });
  console.log(`PASS unchanged shared gate bundle SHA-256 ${createHash("sha256").update(bundle).digest("hex")}`);
} finally {
  await b?.close();
  await new Promise((resolve) => srv.close(resolve));
}
