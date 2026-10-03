const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const assert = require("assert"),
  fs = require("fs"),
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
      errors = [],
      requests = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("request", (r) => requests.push(r.url()));
    await page.goto(
      process.env.SEQUENCER_URL ||
        "http://127.0.0.1:8768/audional-sequencer-l1xl2-v1/index.html",
    );
    await page.locator("#channels .step").first().waitFor();
    assert.equal(
      requests.filter((url) => url.includes("media/onboard-v2/")).length,
      0,
      "No banks preload at startup",
    );
    const result = await page.evaluate(async () => {
      const { ONBOARD_SOUNDS, assetKey } = await import(
          "./js/onboard-catalog.js"
        ),
        { ONBOARD_MANIFEST: m } = await import("./js/onboard-manifest.js"),
        { fetchAndDecode, loadSample, reloadAllSamples } = await import(
          "./js/loader.js"
        ),
        { engine } = await import("./js/engine.js"),
        { store, makeProject } = await import("./js/state.js"),
        { loadBeatPreset } = await import("./js/l1-beat-loader.js"),
        { TONAL_BEAT_PRESETS } = await import("./js/tonal-beats.js"),
        { exportProject, importProject } = await import("./js/persistence.js");
      let decoded = 0;
      for (const sound of ONBOARD_SOUNDS)
        for (const root of sound.roots.length ? sound.roots : [null])
          for (const velocity of sound.velocities) {
            const r = await fetchAndDecode({
              type: "synth",
              value: sound.key,
              rootMidi: root,
              velocityLayer: velocity,
            });
            if (
              Math.abs(
                r.audioBuffer.duration -
                  m.assets[assetKey(sound, root, velocity)].duration,
              ) > 0.002
            )
              throw Error("Wrong decoded duration");
            decoded++;
          }
      const packed = Object.values(m.assets).find((x) => x.category === "keys");
      const embedded = await fetchAndDecode({
        type: "url",
        value: new URL(
          `./media/onboard-v2/publication/${packed.assetId.replace(/[^\w.-]/g, "_")}.json`,
          location.href,
        ).href,
      });
      if (embedded.soundMetadata?.audioSha256 !== packed.audioSha256)
        throw Error("Standalone embedded JSON metadata lost");
      const legacy = await fetchAndDecode({
          type: "synth",
          value: "kick-hard",
        }),
        studio = await fetchAndDecode({
          type: "synth",
          value: "onboard:v2:kick-hard",
        });
      const peak = (b) => Math.max(...Array.from(b.getChannelData(0)));
      if (!(peak(legacy.audioBuffer) > 1 && peak(studio.audioBuffer) < 0.708))
        throw Error("Legacy changed or quality failed");
      const pure = ONBOARD_SOUNDS.find((s) => s.label === "Pure Sub"),
        tone = await fetchAndDecode({ type: "synth", value: pure.key }),
        a = tone.audioBuffer.getChannelData(0),
        sr = tone.audioBuffer.sampleRate;
      let crossings = [];
      for (let n = Math.floor(sr * 0.07); n < Math.floor(sr * 0.26); n++)
        if (a[n] <= 0 && a[n + 1] > 0)
          crossings.push(n - a[n] / (a[n + 1] - a[n]));
      const measured =
          ((crossings.length - 1) * sr) / (crossings.at(-1) - crossings[0]),
        expected = 440 * 2 ** ((pure.rootMidi - 69) / 12);
      if (Math.abs(1200 * Math.log2(measured / expected)) > 2)
        throw Error("Root tuning wrong");
      store.project = makeProject();
      await loadBeatPreset(TONAL_BEAT_PRESETS[0]);
      engine.play();
      await new Promise((r) => setTimeout(r, 250));
      const before = engine.currentStep;
      await loadBeatPreset(TONAL_BEAT_PRESETS[5]);
      if (!engine.isPlaying) throw Error("Beat stopped on replacement");
      engine.stop();
      const pad = ONBOARD_SOUNDS.find((s) => s.family === "pads");
      await loadSample(0, { type: "synth", value: pad.key });
      store.seq.steps[0][0] = {
        v: 1,
        pitch: 2,
        sampleMidi: pad.rootMidi + 12,
        gateSteps: 32,
      };
      const saved = exportProject();
      importProject(saved);
      const failures = await reloadAllSamples();
      if (failures.length) throw Error("Reopen failed");
      if (
        store.seq.steps[0][0].gateSteps !== 32 ||
        store.channel(0).soundMetadata.rootMidi !== 48
      )
        throw Error("Lost notes or gates");
      engine.trigger(0, 0, 1, store.seq.steps[0][0]);
      const voice = engine._lastVoice[0];
      if (!voice.src.loop || voice.src.playbackRate.value !== 2)
        throw Error("Pad not looped/pitched");
      engine.silenceChannel(0);
      window.__onboard = { engine, store };
      return {
        decoded,
        rootMeasuredHz: measured,
        rootExpectedHz: expected,
        cacheBytes: (await import("./js/onboard-library.js")).packCacheBytes(),
        clockBefore: before,
      };
    });
    assert.equal(result.decoded, 184);
    assert(result.cacheBytes <= 24 * 1024 * 1024);
    // Real controls: rooted sample, note editor, sustain setting, family filters.
    await page.evaluate(async () => {
      (await import("./js/ui.js")).openLoader(0);
    });
    await page
      .locator("#library-category")
      .selectOption({ label: "Onboard · Keys (16)" });
    await page.locator("#library-root").selectOption("48");
    await page.locator("#library-velocity").selectOption("0.55");
    await page.locator("#library-audition").click();
    await page.waitForFunction(() =>
      document
        .querySelector("#library-status")
        .textContent.startsWith("Playing"),
    );
    await page.locator("#loader-load").click();
    await page.waitForFunction(
      () => window.__onboard.store.channel(0).soundMetadata?.rootMidi === 48,
    );
    await page.evaluate(async () => {
      (await import("./js/ui.js")).openStepEditor(0, 2);
    });
    await page.locator("#trim-note").selectOption("60");
    assert.equal(await page.locator("#trim-pitch").inputValue(), "2");
    await page.locator("#trim-close").click();
    await page.locator("#btn-beats").click();
    await page.locator("#beats-collection").selectOption("tonal");
    assert.equal(await page.locator(".beat-row").count(), 32);
    await page.locator(".beat-row button.primary").first().click();
    await page.waitForFunction(
      () => window.__onboard.store.project.lastBeat?.collection === "tonal",
    );
    assert.equal(
      await page
        .locator("#modal-beats")
        .evaluate((e) => e.classList.contains("hidden")),
      false,
    );
    await page.locator("#beats-collection").selectOption("combined");
    assert.equal(await page.locator(".beat-row").count(), 128);
    await page.screenshot({
      path: "/private/tmp/audionaut-expanded-beats.png",
      fullPage: true,
    });
    await page.evaluate(() =>
      document.querySelector("#modal-beats").classList.add("hidden"),
    );
    await page.evaluate(async () => {
      (await import("./js/ui.js")).openLoader(0);
    });
    await page
      .locator("#library-category")
      .selectOption({ label: "Onboard · Pads (12)" });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({
      path: "/private/tmp/audionaut-expanded-library-mobile.png",
      fullPage: true,
    });
    const box = await page.locator("#modal-loader .modal-box").boundingBox();
    assert(box.x >= 0 && box.width <= 390);
    // Corrupt one embedded payload in a fresh pack cache: hash rejection happens before decode/assignment.
    const original = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, "../media/onboard-v2/pads.json")),
    );
    const first = Object.values(original.entries)[0];
    const bytes = Buffer.from(first.audioData, "base64");
    bytes[100] ^= 1;
    first.audioData = bytes.toString("base64");
    await page.route("**/media/onboard-v2/pads.json", (route) =>
      route.fulfill({
        contentType: "application/json",
        body: JSON.stringify(original),
      }),
    );
    const rejected = await page.evaluate(async () => {
      const { loadOnboardAudio } = await import(
        "./js/onboard-library.js?integrity-test"
      );
      const { ONBOARD_SOUNDS } = await import("./js/onboard-catalog.js");
      try {
        await loadOnboardAudio(
          { value: ONBOARD_SOUNDS.find((s) => s.family === "pads").key },
          window.__onboard.engine.ensureContext(),
        );
        return false;
      } catch (e) {
        return e.message.includes("integrity");
      }
    });
    assert(rejected);
    assert.deepEqual(errors, []);
    console.log("Browser onboard checks passed", JSON.stringify(result));
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
