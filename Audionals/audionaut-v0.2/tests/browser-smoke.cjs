const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const assert = require("assert");
const fs = require("fs");
(async () => {
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.CHROMIUM_EXECUTABLE
      ? { executablePath: process.env.CHROMIUM_EXECUTABLE }
      : {}),
    args: ["--autoplay-policy=no-user-gesture-required"],
  });
  const page = await browser.newPage({
    viewport: { width: 1600, height: 1050 },
    acceptDownloads: true,
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(
    process.env.SEQUENCER_URL || "http://127.0.0.1:8080/index.html",
  );
  await page.locator("#channels .step").first().waitFor();
  assert.equal(await page.locator("#channels .step").count(), 1024);
  await page.evaluate(async () => {
    window.__testEngine = (await import("./js/engine.js")).engine;
  });
  await page.locator("#btn-l1-words").click();
  await page.waitForFunction(() =>
    document.querySelector(".browser-intro")?.textContent.includes("16,125"),
  );
  await page.getByRole("searchbox").fill("Each day");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  const card = page.locator(".source-card").first();
  await card.waitFor();
  await card.getByRole("button", { name: "Preview", exact: true }).click();
  await page.waitForFunction(
    () =>
      document.querySelector(".browser-status").textContent ===
      "Playing selected section.",
    null,
    { timeout: 60000 },
  );
  await card.getByRole("button", { name: "Save phrase" }).click();
  assert(
    (await page.locator(".browser-status").textContent()).includes("saved"),
  );
  const originalEnd = await card
    .getByRole("spinbutton", { name: "End (s)", exact: true })
    .inputValue();
  await card
    .getByRole("spinbutton", { name: "End (s)", exact: true })
    .fill("9999");
  await card.getByRole("button", { name: "Load into sampler" }).click();
  await page.waitForFunction(() =>
    document
      .querySelector(".browser-status")
      .textContent.includes("within the available"),
  );
  assert(
    await page.evaluate(
      async () => !(await import("./js/state.js")).store.channel(0).source,
    ),
  );
  await card
    .getByRole("spinbutton", { name: "End (s)", exact: true })
    .fill(originalEnd);
  await page
    .getByRole("combobox", { name: "Placement", exact: true })
    .selectOption("step");
  await page
    .getByRole("spinbutton", { name: "Destination step", exact: true })
    .fill("5");
  await card.getByRole("button", { name: "Load into sampler" }).click();
  await page.waitForFunction(() => !document.querySelector(".source-browser"));
  const loaded = await page.evaluate(async () => {
    const { store } = await import("./js/state.js"),
      { engine } = await import("./js/engine.js");
    const step = store.seq.steps[0][4];
    return {
      selection: step.wordSelection,
      start: step.trimStart * engine.buffers[0].duration,
      end: step.trimEnd * engine.buffers[0].duration,
      source: store.channel(0).source,
    };
  });
  assert(Math.abs(loaded.start - loaded.selection.start) < 1e-8);
  assert(Math.abs(loaded.end - loaded.selection.end) < 1e-8);
  const saved = await page.evaluate(async () => {
    const p = await import("./js/persistence.js");
    const json = p.exportProject();
    p.importProject(json);
    return json;
  });
  await page.waitForFunction(() => !!window.__testEngine.buffers[0]);
  assert.equal(JSON.parse(saved).format, "audionaut-workstation/2");
  await page.locator('#channels .channel[data-ch="1"] .load').click();
  await page.locator('[data-tab="xtrata"]').click();
  await page.locator("#input-xtrata").fill("1120");
  await page.locator("#loader-load").click();
  await page.waitForFunction(
    () =>
      !!window.__testEngine.buffers[1] ||
      document
        .querySelector("#status-text")
        .textContent.includes("Load failed"),
    null,
    { timeout: 60000 },
  );
  console.log(
    "L2 loader status:",
    await page.locator("#status-text").textContent(),
  );
  const decodedSources = await page.evaluate(async () => {
    const { loadSample } = await import("./js/loader.js");
    const { engine } = await import("./js/engine.js");
    const before = engine.buffers.slice(0, 4).map((b) => b?.duration ?? null);
    await loadSample(2, {
      type: "ordinal",
      value:
        "ef5707e6ecf4d5b6edb4c3a371ca1c57b5d1057c6505ccb5f8bdc8918b0c4d94i0",
    });
    const afterHtml = engine.buffers
      .slice(0, 4)
      .map((b) => b?.duration ?? null);
    await loadSample(3, {
      type: "ordinal",
      value:
        "6d8be8186e63b4557e51edd66184a567bc6f5f9f5ba4bb34ba8c67e652c1934ei0",
    });
    return {
      before,
      afterHtml,
      xtrata1120: engine.buffers[1]?.duration,
      bitcoinHtml: engine.buffers[2]?.duration,
      bitcoinJson: engine.buffers[3]?.duration,
    };
  });
  console.log(JSON.stringify({ decodedSources, errors }));
  assert(
    decodedSources.xtrata1120 > 0 &&
      decodedSources.bitcoinHtml > 0 &&
      decodedSources.bitcoinJson > 0,
  );
  await page.locator("#btn-view").click();
  assert(await page.locator(".arrange-strip").first().isVisible());
  await page.locator("#btn-play").click();
  await page.waitForFunction(
    () => document.querySelector("#lcd-pos").textContent !== "1.1",
  );
  await page.locator("#btn-stop").click();
  const out =
    process.env.OUTPUT_DIR ||
    fs.mkdtempSync(
      require("path").join(require("os").tmpdir(), "audional-l1xl2-"),
    );
  fs.mkdirSync(out, { recursive: true });
  await page.screenshot({ path: out + "/L1xL2-Arrange.png" });
  await page.locator("#btn-audio-tools").click();
  assert(
    (await page.locator(".audio-tools").textContent()).includes("149.786"),
  );
  const wavDownload = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "Export selected section WAV" })
    .click();
  const wav = await wavDownload;
  assert(wav.suggestedFilename().endsWith(".wav"));
  await page.getByRole("button", { name: "Close", exact: true }).click();
  await page.locator("#btn-l1-audio").click();
  await page.waitForFunction(() =>
    document.querySelector(".browser-status")?.textContent.includes("1,682"),
  );
  await page
    .getByRole("combobox", { name: "Catalogue filter" })
    .selectOption("words");
  assert(
    (await page.locator(".browser-status").textContent()).includes(
      "638 matches",
    ),
  );
  await page.getByRole("button", { name: "Favourites", exact: true }).click();
  assert((await page.locator(".source-card").count()) === 1);
  await page.getByRole("button", { name: "Close", exact: true }).click();
  await page.locator(".roll-open").first().click();
  await page.locator("#roll-lines").selectOption("0");
  const notesBefore = await page.evaluate(
    async () => (await import("./js/state.js")).store.seq.notes[0].length,
  );
  assert(notesBefore > 0);
  await page.locator("#roll-rec").click();
  await page.evaluate(async () => {
    const { engine } = await import("./js/engine.js");
    engine.play();
    (await import("./js/pianoroll.js")).handleMidiMessage({
      data: [0x90, 60, 100],
    });
  });
  await page.waitForTimeout(180);
  const midi = await page.evaluate(async () => {
    const roll = await import("./js/pianoroll.js"),
      { store } = await import("./js/state.js"),
      { engine } = await import("./js/engine.js");
    roll.handleMidiMessage({ data: [0x80, 60, 0] });
    engine.stop();
    return store.seq.notes[0].at(-1);
  });
  assert.equal(midi.pitch, 60);
  assert(midi.dur >= 1 && Math.abs(midi.vel - 100 / 127) < 1e-6);
  await page.locator("#roll-close").click();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator("#btn-l1-words").click();
  await page.getByRole("searchbox").fill("bitcoin");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await page.locator(".source-card").first().waitFor();
  assert(
    await page.evaluate(
      () =>
        document.querySelector(".source-browser").getBoundingClientRect()
          .right <= innerWidth,
    ),
  );
  await page.screenshot({ path: out + "/L1xL2-Mobile.png" });
  await page.setViewportSize({ width: 1600, height: 1050 });
  await page.screenshot({ path: out + "/L1xL2-Word-Search.png" });
  await page.keyboard.press("Escape");
  await page.locator("#btn-record-mix").click();
  await page.locator("#btn-play").click();
  await page.waitForTimeout(1200);
  const download = page.waitForEvent("download");
  await page.locator("#btn-record-mix").click();
  const recording = await download;
  assert(recording.suggestedFilename().endsWith(".webm"));
  await page.locator("#btn-stop").click();
  const l2 = await page.evaluate(async () => {
    const { store } = await import("./js/state.js");
    const { resolveSource } = await import("./js/loader.js");
    const url = resolveSource({ type: "xtrata", value: "1120" });
    try {
      const r = await fetch(url, { signal: AbortSignal.timeout(25000) });
      return {
        url,
        status: r.status,
        type: r.headers.get("content-type"),
        bytes: (await r.arrayBuffer()).byteLength,
      };
    } catch (e) {
      return { url, error: e.message };
    }
  });
  assert.deepEqual(errors, []);
  assert(l2.status === 200);
  const result = {
    loaded,
    l2,
    decodedSources,
    midi,
    pageErrors: errors,
    checks: [
      "boot",
      "real Bitcoin preview",
      "real L2 audio via loader UI",
      "Bitcoin HTML and Base64 JSON audio",
      "invalid range preserves channel",
      "exact per-step phrase import",
      "project round trip",
      "arrangement waveform",
      "transport",
      "WAV download",
      "catalogue and filters",
      "favourites",
      "synth roll presets",
      "synthetic MIDI note recording",
      "mobile dialog",
      "mix recording",
    ],
  };
  fs.writeFileSync(
    out + "/L1xL2-browser-validation.json",
    JSON.stringify(result, null, 2),
  );
  console.log(JSON.stringify(result, null, 2));
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
