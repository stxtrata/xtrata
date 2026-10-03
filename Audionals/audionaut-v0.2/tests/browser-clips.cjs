const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const assert = require("node:assert/strict"),
  fs = require("node:fs"),
  path = require("node:path");
const base =
  process.env.SEQUENCER_URL ||
  "http://127.0.0.1:8768/audionaut-v0.2/index.html";
const live = process.env.LIVE_INSCRIPTIONS === "1",
  report = {
    scope: live
      ? "real inscription retrieval and automated engine playback"
      : "generated WAV fixtures in the real workstation",
    humanListeningReview: false,
    checks: [],
    sources: [],
    failures: [],
  };
function wav() {
  const frames = 96000,
    b = Buffer.alloc(44 + frames * 4);
  b.write("RIFF");
  b.writeUInt32LE(b.length - 8, 4);
  b.write("WAVEfmt ", 8);
  b.writeUInt32LE(16, 16);
  b.writeUInt16LE(1, 20);
  b.writeUInt16LE(2, 22);
  b.writeUInt32LE(48000, 24);
  b.writeUInt32LE(192000, 28);
  b.writeUInt16LE(4, 32);
  b.writeUInt16LE(16, 34);
  b.write("data", 36);
  b.writeUInt32LE(frames * 4, 40);
  for (let i = 0; i < frames; i++) {
    const v = Math.round(Math.sin((i / 48000) * 2 * Math.PI * 220) * 10000);
    b.writeInt16LE(v, 44 + i * 4);
    b.writeInt16LE(Math.round(v * 0.5), 46 + i * 4);
  }
  return b;
}
(async () => {
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.CHROMIUM_EXECUTABLE
      ? { executablePath: process.env.CHROMIUM_EXECUTABLE }
      : {}),
    args: ["--autoplay-policy=no-user-gesture-required"],
  });
  const context = await browser.newContext({
      viewport: { width: 1500, height: 1000 },
    }),
    errors = [],
    requests = [];
  if (!live)
    await context.route(/https:\/\/ordinals\.com\/content\//, (route) =>
      route.fulfill({
        body: wav(),
        contentType: "audio/wav",
        headers: { "Access-Control-Allow-Origin": "*" },
      }),
    );
  try {
    let page = await context.newPage();
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("request", (r) => {
      if (r.url().includes("ordinals.com/content/")) requests.push(r.url());
    });
    await page.goto(base);
    await page.locator("#channels .step").first().waitFor();
    assert.equal(requests.length, 0);
    report.checks.push("No inscription audio fetch at workstation startup");
    await page.locator("#btn-samples-loops").click();
    await page.locator(".clip-list-item").first().waitFor();
    assert.equal(await page.locator(".clip-list-item").count(), 22);
    assert.equal(requests.length, 0);
    report.checks.push(
      "First 22 draft candidates visible without audio downloads",
    );
    assert(
      (await page.locator(".clip-detail").textContent()).includes(
        "permission: unknown",
      ),
    );
    const projectBefore = await page.evaluate(async () => {
      const { exportProject } = await import("./js/persistence.js");
      return exportProject();
    });
    await page
      .getByRole("button", { name: "Preview source", exact: true })
      .click();
    await page.waitForFunction(
      () => {
        const t = document.querySelector(".clip-status")?.textContent;
        return t && !t.startsWith("Loading");
      },
      { timeout: 45000 },
    );
    const status = await page.locator(".clip-status").textContent();
    if (!status.includes("Preview"))
      throw Error("Actual preview failed: " + status);
    assert.equal(
      await page.evaluate(async () => {
        const { exportProject } = await import("./js/persistence.js");
        return exportProject();
      }),
      projectBefore,
    );
    report.checks.push("Actual decoder/preview route leaves project unchanged");
    await page
      .getByRole("button", { name: "Stop preview / cancel load", exact: true })
      .click();
    await page
      .getByLabel("Region start (source seconds)", { exact: true })
      .fill("0.1");
    await page
      .getByLabel("Region end (blank = decoded end)", { exact: true })
      .fill("0.6");
    await page.locator(".clip-settings summary").click();
    await page
      .getByLabel("Playback rate (also changes pitch)", { exact: true })
      .fill("1.25");
    await page
      .getByLabel("Load into channel", { exact: true })
      .selectOption("1");
    await page
      .getByRole("button", { name: "Load region into channel", exact: true })
      .click();
    await page.waitForFunction(
      () =>
        document
          .querySelector(".clip-status")
          ?.textContent.startsWith("Loaded"),
      { timeout: 45000 },
    );
    const produced = await page.evaluate(async () => {
      const { store } = await import("./js/state.js"),
        { engine } = await import("./js/engine.js"),
        { exportProject } = await import("./js/persistence.js");
      const c = store.channel(1),
        s = c.clipSnapshot,
        analyser = engine.ctx.createAnalyser();
      analyser.fftSize = 1024;
      engine.channelGains[1].connect(analyser);
      engine.play();
      let rms = 0;
      for (let i = 0; i < 8; i++) {
        await new Promise((r) => setTimeout(r, 30));
        const samples = new Float32Array(1024);
        analyser.getFloatTimeDomainData(samples);
        rms = Math.max(
          rms,
          Math.sqrt(samples.reduce((n, v) => n + v * v, 0) / samples.length),
        );
      }
      const running = engine.isPlaying;
      engine.stop();
      engine.channelGains[1].disconnect(analyser);
      analyser.disconnect();
      return {
        snapshot: s,
        project: exportProject(),
        rms,
        running,
        step: store.seq.steps[1][0],
        untouched: store.channel(0).source,
      };
    });
    assert.equal(produced.snapshot.playback.start, 0.1);
    assert.equal(produced.snapshot.playback.end, 0.6);
    assert.equal(produced.snapshot.playback.rate, 1.25);
    assert.equal(produced.snapshot.playback.mode, "one-shot");
    assert.equal(produced.untouched, null);
    assert.equal(produced.step, 1);
    assert(produced.running);
    assert(
      produced.rms > 1e-5,
      "Non-zero decoded audio passes through the sequencer channel graph",
    );
    report.sources.push({
      id: produced.snapshot.source.inscriptionId,
      gateway: "https://ordinals.com/content/",
      decoded: produced.snapshot.decoded,
      sourceHash: produced.snapshot.retrieved.sourceHash,
      payloadHash: produced.snapshot.retrieved.payloadHash,
      sequencerRms: produced.rms,
      region: produced.snapshot.playback,
    });
    report.checks.push(
      "Selected region loads into channel 2 and produces audio through the actual running sequencer",
    );
    const looping = await page.evaluate(async () => {
      const { getClipLibrary } = await import("./js/clip-library.js"),
        { loadClip, previewClip, stopClipPreview } = await import(
          "./js/clip-actions.js"
        ),
        { store } = await import("./js/state.js"),
        { engine } = await import("./js/engine.js"),
        l = await getClipLibrary(),
        s = l.sources.find((s) => s.id === l.batches[0].source_record_ids[0]),
        c = l.clips.find((c) => c.sourceId === s.id);
      await loadClip(
        3,
        s,
        { ...c, region: { startSeconds: 0.1, endSeconds: 0.6 } },
        { mode: "loop", gateSteps: 8, rate: 0.8 },
      );
      const create = engine.ctx.createBufferSource.bind(engine.ctx);
      let voice;
      engine.ctx.createBufferSource = () => (voice = create());
      engine.trigger(3);
      engine.ctx.createBufferSource = create;
      const observed = {
        loop: voice.loop,
        start: voice.loopStart,
        end: voice.loopEnd,
        rate: voice.playbackRate.value,
      };
      engine.silenceChannel(3);
      let shortStart;
      engine.ctx.createBufferSource = () => {
        const node = create(),
          start = node.start.bind(node);
        node.start = (...args) => {
          shortStart = args;
          return start(...args);
        };
        return node;
      };
      engine.trigger(1, 0, 1, {
        trimStart: 0.1 / engine.buffers[1].duration,
        trimEnd: 0.1005 / engine.buffers[1].duration,
      });
      engine.ctx.createBufferSource = create;
      observed.shortRegionDuration = shortStart[2];
      engine.play();
      await previewClip(s, c);
      observed.runningDuringPreview = engine.isPlaying;
      stopClipPreview();
      observed.runningAfterStop = engine.isPlaying;
      engine.stop();
      return observed;
    });
    assert.equal(looping.loop, true);
    assert.equal(looping.start, 0.1);
    assert.equal(looping.end, 0.6);
    assert(Math.abs(looping.rate - 0.8) < 1e-6);
    assert(Math.abs(looping.shortRegionDuration - 0.0005) < 1e-9);
    assert(looping.runningDuringPreview && looping.runningAfterStop);
    report.checks.push(
      "Explicit loop bounds/rate reach the actual sampler; preview/stop leaves the running transport active",
    );
    await page
      .getByRole("button", { name: "New independent clip", exact: true })
      .click();
    assert(
      (await page.locator(".clip-status").textContent()).includes(
        "Independent",
      ),
    );
    const pinnedHash = produced.snapshot.snapshotHash;
    await page.evaluate(async () => {
      const { effectiveLibrary, refreshClipLibrary } = await import(
          "./js/clip-library.js"
        ),
        { toDraftManifest } = await import("./js/clip-contract.js"),
        { store } = await import("./js/state.js");
      const m = toDraftManifest(effectiveLibrary());
      m.clips[0].title = "Updated catalogue title";
      m.clips[0].region.end_seconds = 0.8;
      refreshClipLibrary(m);
      if (
        store.channel(1).clipSnapshot.clip.title === "Updated catalogue title"
      )
        throw Error("A catalogue update changed a pinned project");
    });
    report.checks.push(
      "Catalogue refresh retains personal clips and does not alter the saved snapshot",
    );
    await page.getByRole("button", { name: "Close", exact: true }).click();
    await page.evaluate(
      (saved) => localStorage.setItem("audionaut.v0.2.project", saved),
      produced.project,
    );
    if (!live) {
      await page.evaluate(() =>
        localStorage.removeItem("audionaut.v0.2.clip-library"),
      );
      await context.route("**/data/samples-loops-catalogue.json", (route) =>
        route.abort("failed"),
      );
    }
    await page.close();
    page = await context.newPage();
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(base);
    await page.waitForFunction(
      async () => {
        const { engine } = await import("./js/engine.js");
        return !!engine.buffers[1];
      },
      { timeout: 45000 },
    );
    const reopened = await page.evaluate(async () => {
      const { store } = await import("./js/state.js");
      return store.channel(1);
    });
    assert.equal(reopened.clipSnapshot.snapshotHash, pinnedHash);
    assert.equal(reopened.pitch, 1.25);
    assert.equal(reopened.clipSnapshot.playback.end, 0.6);
    if (!live) {
      await context.unroute("**/data/samples-loops-catalogue.json");
      report.checks.push(
        "Pinned project reopens while the catalogue file and stored library are unavailable",
      );
    }
    report.checks.push(
      "Close/reopen reloads the pinned inscription, exact region, hashes and playback settings",
    );
    if (live) {
      const more = await page.evaluate(async () => {
        const { getClipLibrary } = await import("./js/clip-library.js"),
          { prepareClip, previewClip, stopClipPreview } = await import(
            "./js/clip-actions.js"
          );
        const l = await getClipLibrary(),
          ids = l.batches[0].source_record_ids.slice(1, 3),
          results = [];
        for (const id of ids) {
          const s = l.sources.find((s) => s.id === id),
            c = l.clips.find((c) => c.sourceId === id);
          try {
            const p = await previewClip(s, c);
            stopClipPreview();
            results.push({
              id: s.inscriptionId,
              gateway: p.result.retrievedVia,
              decoded: p.snapshot.decoded,
              payloadHash: p.result.payloadHash,
              success: true,
            });
          } catch (e) {
            results.push({
              id: s.inscriptionId,
              success: false,
              error: e.message,
            });
          }
        }
        return results;
      });
      report.sources.push(...more);
      report.failures.push(...more.filter((r) => !r.success));
    } else {
      await page.evaluate(async () => {
        const { clearCatalogueCache } = await import(
          "./js/catalogue-retrieval.js"
        );
        clearCatalogueCache();
        localStorage.removeItem("audionaut.v0.2.clip-library");
      });
      await context.route(/https:\/\/ordinals\.com\/content\//, (r) =>
        r.abort("internetdisconnected"),
      );
      const unresolved = await page.evaluate(async () => {
        const { reloadAllSamples } = await import("./js/loader.js"),
          { store } = await import("./js/state.js");
        await reloadAllSamples();
        return store.channel(1);
      });
      assert.equal(unresolved.clipSnapshot.snapshotHash, pinnedHash);
      assert(unresolved.unresolvedSource);
      report.checks.push(
        "Missing catalogue/offline audio retains unresolved source and production settings",
      );
    }
    await page.locator("#btn-samples-loops").click();
    await page.locator(".clip-list-item").first().waitFor();
    await page.setViewportSize({ width: 390, height: 844 });
    if (!live) {
      const safe = await page.evaluate(async () => {
        const { extractAudio } = await import("./js/loader.js"),
          { effectiveLibrary, refreshClipLibrary } = await import(
            "./js/clip-library.js"
          ),
          { toDraftManifest } = await import("./js/clip-contract.js");
        window.__inscriptionExecuted = 0;
        const html =
          '<html><script>window.__inscriptionExecuted=1</script><audio src="data:audio/wav;base64,AQID"></audio></html>';
        const extracted = await extractAudio(
          new Response(html, { headers: { "content-type": "text/html" } }),
          "fixture",
          null,
          0,
          false,
        );
        let recursive = false;
        try {
          await extractAudio(
            new Response(
              '<html><audio src="https://example.invalid/recursive.js"></audio></html>',
              { headers: { "content-type": "text/html" } },
            ),
            "fixture",
            null,
            0,
            false,
          );
        } catch (e) {
          recursive = e.message.includes("unsupported");
        }
        const m = toDraftManifest(effectiveLibrary());
        m.clips[0].title =
          '<img src=x onerror="window.__inscriptionExecuted=2">';
        refreshClipLibrary(m);
        return {
          executed: window.__inscriptionExecuted,
          bytes: extracted.arrayBuffer.byteLength,
          recursive,
        };
      });
      assert.equal(safe.executed, 0);
      assert.equal(safe.bytes, 3);
      assert(safe.recursive);
      await page.getByRole("button", { name: "Close", exact: true }).click();
      await page.locator("#btn-samples-loops").click();
      await page.locator(".clip-list-item").first().waitFor();
      assert.equal(await page.locator(".samples-loops-browser img").count(), 0);
      assert.equal(await page.evaluate(() => window.__inscriptionExecuted), 0);
      report.checks.push(
        "Inscription HTML and metadata never execute; recursive audio fails explicitly",
      );
    }
    const bounds = await page
      .locator(".samples-loops-browser")
      .evaluate((d) => ({
        width: d.clientWidth,
        scroll: d.scrollWidth,
        box: {
          x: d.getBoundingClientRect().x,
          right: d.getBoundingClientRect().right,
        },
      }));
    assert(
      bounds.scroll <= bounds.width + 1,
      "No horizontal overflow in mobile catalogue",
    );
    assert(bounds.box.x >= 0 && bounds.box.right <= 390);
    assert(
      await page
        .getByRole("button", { name: "Load region into channel", exact: true })
        .count(),
    );
    const screenshots = path.join(require("node:os").tmpdir(), "audionaut-v02");
    fs.mkdirSync(screenshots, { recursive: true });
    await page
      .locator(".samples-loops-browser")
      .evaluate((d) => (d.scrollTop = 0));
    await page.screenshot({
      path: path.join(
        screenshots,
        live ? "catalogue-live-mobile.png" : "catalogue-mobile.png",
      ),
    });
    await page.setViewportSize({ width: 1500, height: 1000 });
    await page.screenshot({
      path: path.join(
        screenshots,
        live ? "catalogue-live-desktop.png" : "catalogue-desktop.png",
      ),
    });
    report.checks.push("Touch controls and mobile layout at 390 × 844");
    assert.deepEqual(errors, []);
    report.browser = await browser.version();
    report.device = "macOS Chromium desktop + 390 × 844 emulation";
    report.completedAt = new Date().toISOString();
    report.passed = report.failures.length === 0;
    fs.writeFileSync(
      path.join(
        __dirname,
        "../reports/" +
          (live
            ? "samples-loops-live.json"
            : "samples-loops-browser-fixtures.json"),
      ),
      JSON.stringify(report, null, 2) + "\n",
    );
    console.log(JSON.stringify(report, null, 2));
    if (!report.passed) process.exitCode = 1;
  } catch (e) {
    report.failures.push({ error: e.stack });
    report.passed = false;
    fs.writeFileSync(
      path.join(
        __dirname,
        "../reports/" +
          (live
            ? "samples-loops-live.json"
            : "samples-loops-browser-fixtures.json"),
      ),
      JSON.stringify(report, null, 2) + "\n",
    );
    throw e;
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
