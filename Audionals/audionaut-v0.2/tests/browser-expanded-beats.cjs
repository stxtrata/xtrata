const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const assert = require("assert"),
  fs = require("fs"),
  os = require("os"),
  path = require("path");
(async () => {
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.CHROMIUM_EXECUTABLE
      ? { executablePath: process.env.CHROMIUM_EXECUTABLE }
      : {}),
    args: ["--autoplay-policy=no-user-gesture-required"],
  });
  try {
    const page = await browser.newPage({
        viewport: { width: 1500, height: 1000 },
      }),
      errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(
      process.env.SEQUENCER_URL ||
        "http://127.0.0.1:8768/audional-sequencer-l1xl2-v1/index.html",
    );
    await page.locator("#channels .step").first().waitFor();
    const measured = await page.evaluate(async () => {
      const { BEAT_PRESETS } = await import("./js/beats.js"),
        { COMBINED_BEAT_PRESETS } = await import("./js/combined-beats.js"),
        { prepareBeatPreset, loadBeatPreset } = await import(
          "./js/l1-beat-loader.js"
        ),
        { store, makeProject } = await import("./js/state.js"),
        { engine } = await import("./js/engine.js"),
        { exportProject, importProject } = await import("./js/persistence.js");
      const stats = {
        originalPrepared: 0,
        combinedPrepared: 0,
        onboard: new Set(),
        ordinal: new Set(),
        variants: new Set(),
      };
      for (const [key, presets] of [
        ["originalPrepared", BEAT_PRESETS],
        ["combinedPrepared", COMBINED_BEAT_PRESETS],
      ])
        for (const preset of presets) {
          const prepared = await prepareBeatPreset(preset, {
            signal: AbortSignal.timeout(45000),
          });
          stats[key]++;
          for (const row of prepared) {
            const source = row.def.source;
            stats[source.type === "ordinal" ? "ordinal" : "onboard"].add(
              source.value,
            );
            if (row.result.soundMetadata)
              stats.variants.add(row.result.soundMetadata.assetId);
            for (const step of row.steps)
              if (
                step &&
                typeof step === "object" &&
                step.pitch != null &&
                (step.pitch < 0.1 || step.pitch > 4)
              )
                throw Error("Pitch outside sampler range");
          }
        }
      store.project = makeProject();
      await loadBeatPreset(BEAT_PRESETS[0]);
      engine.play();
      await new Promise((r) => setTimeout(r, 300));
      let stops = 0;
      const stop = engine.stop.bind(engine);
      engine.stop = () => {
        stops++;
        return stop();
      };
      for (const preset of [
        BEAT_PRESETS[29],
        COMBINED_BEAT_PRESETS[11],
        BEAT_PRESETS[95],
        COMBINED_BEAT_PRESETS[95],
      ]) {
        await loadBeatPreset(preset);
        if (!engine.isPlaying) throw Error("Playback stopped");
      }
      engine.stop = stop;
      if (stops) throw Error("Live kit changes called Stop");
      engine.stop();
      const original = exportProject();
      importProject(original);
      if (store.project.lastBeat.id !== COMBINED_BEAT_PRESETS[95].id)
        throw Error("Saved beat identity lost");
      if (!store.project.channels.some((c) => c.source?.audioSha256))
        throw Error("Saved sound identity lost");
      window.__expanded = { store, engine };
      return {
        ...stats,
        onboard: stats.onboard.size,
        ordinal: stats.ordinal.size,
        variants: stats.variants.size,
      };
    });
    assert.equal(measured.originalPrepared, 96);
    assert.equal(measured.combinedPrepared, 96);
    assert.equal(measured.onboard, 144);
    assert.equal(measured.variants, 184);
    await page.locator("#btn-beats").click();
    assert.equal(await page.locator(".beat-row").count(), 96);
    await page.locator(".beat-row details").first().locator("summary").click();
    assert(
      (await page.locator(".beat-row").first().textContent()).includes(
        "Studio kit",
      ),
    );
    await page.locator("#beats-search").fill("pads");
    assert((await page.locator(".beat-row").count()) > 0);
    assert((await page.locator(".beat-row").count()) < 96);
    await page.locator("#beats-search").fill("");
    await page.locator(".beat-row button.primary").nth(1).click();
    await page.waitForFunction(
      () => window.__expanded.store.project.lastBeat?.id === "original-0-1",
    );
    assert.equal(
      await page
        .locator("#modal-beats")
        .evaluate((e) => e.classList.contains("hidden")),
      false,
    );
    await page.locator("#beats-play").click();
    await page.waitForFunction(() => window.__expanded.engine.isPlaying);
    await page.locator("#beats-next").click();
    await page.waitForFunction(
      () => window.__expanded.store.project.lastBeat?.id === "original-0-2",
    );
    assert(await page.evaluate(() => window.__expanded.engine.isPlaying));
    await page.locator("#beats-collection").selectOption("combined");
    assert.equal(await page.locator(".beat-row").count(), 128);
    await page.locator(".beat-row button.primary").first().click();
    await page.waitForFunction(
      () => window.__expanded.store.project.lastBeat?.id === "combined-0-0",
    );
    assert(await page.evaluate(() => window.__expanded.engine.isPlaying));
    await page.locator("#beats-stop").click();
    const dir =
      process.env.OUTPUT_DIR ||
      path.join(os.tmpdir(), "audionaut-expanded-beats");
    fs.mkdirSync(dir, { recursive: true });
    await page.locator("#beats-collection").selectOption("original");
    await page.locator(".beat-row details").first().locator("summary").click();
    await page.screenshot({
      path: path.join(dir, "original-96.png"),
      fullPage: true,
    });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({
      path: path.join(dir, "original-96-mobile.png"),
      fullPage: true,
    });
    const box = await page.locator("#modal-beats .modal-box").boundingBox();
    assert(
      box.width <= 390 && box.x >= 0 && box.y >= 0 && box.y + box.height <= 844,
    );
    assert.deepEqual(errors, []);
    console.log(
      "Expanded beat browser checks passed",
      JSON.stringify(measured),
      dir,
    );
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
