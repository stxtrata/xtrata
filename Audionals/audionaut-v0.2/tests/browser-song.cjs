const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs");
(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.CHROMIUM_EXECUTABLE,
  });
  try {
    const page = await browser.newPage({
      viewport: { width: 1400, height: 1000 },
      acceptDownloads: true,
    });
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.addInitScript(() => {
      window.__started = [];
      const start = AudioBufferSourceNode.prototype.start;
      AudioBufferSourceNode.prototype.start = function (...args) {
        window.__started.push({
          time: args[0],
          offset: args[1],
          duration: args[2],
          rate: this.playbackRate.value,
        });
        return start.apply(this, args);
      };
    });
    await page.goto(
      process.env.SEQUENCER_URL ||
        "http://127.0.0.1:8768/audional-sequencer-l1xl2-v1/index.html",
    );
    await page.locator("#channels .step").first().waitFor();
    const before = await page.evaluate(async () =>
      (await import("./js/persistence.js")).exportProject(),
    );
    await page.locator("#channels .load").first().click();
    await page
      .locator("#library-category")
      .selectOption({ label: "Songs & historic applications" });
    const results = [];
    for (const [value, title] of [
      ["3", "OG cheese"],
      ["6", "TRUTH"],
      ["7", "ON DAY ONE"],
    ]) {
      await page.locator("#library-sample").selectOption(value);
      assert(await page.locator("#loader-load").isDisabled());
      assert(await page.locator("#library-export-song").isVisible());
      const count = await page.evaluate(() => window.__started.length);
      await page.locator("#library-audition").click();
      await page.waitForFunction(
        () =>
          /Playing song|✗|failed:|limit/.test(
            document.querySelector("#library-status").textContent,
          ),
        null,
        { timeout: 120000 },
      );
      const status = await page.locator("#library-status").textContent();
      assert(status.startsWith("Playing song"), status);
      await page.waitForFunction((n) => window.__started.length > n, count, {
        timeout: 20000,
      });
      const sources = await page.evaluate(
        (n) => window.__started.slice(n),
        count,
      );
      assert.equal(
        await page.evaluate(async () =>
          (await import("./js/persistence.js")).exportProject(),
        ),
        before,
      );
      await page.locator("#library-stop").click();
      assert.equal(
        await page.locator("#library-status").textContent(),
        "Audition stopped.",
      );
      const downloadPromise = page.waitForEvent("download");
      await page.locator("#library-export-song").click();
      const download = await downloadPromise;
      const session = JSON.parse(fs.readFileSync(await download.path()));
      assert.equal(session.channels.length, title === "OG cheese" ? 8 : 16);
      assert(session.sequences.length > 1);
      assert(
        session.channels.every((c) => !c.source || c.source.type === "ordinal"),
      );
      if (title === "TRUTH") {
        assert.equal(session.channels[4].pitch, 5.96);
        assert.deepEqual(session.sequences[1].steps[0][52], {
          v: 1,
          rev: true,
        });
      }
      results.push({
        title,
        status,
        channels: session.channels.length,
        sequences: session.sequences.length,
        bpm: session.bpm,
        started: sources,
      });
      console.log(title + " audition/export passed");
      if (title === "ON DAY ONE") {
        await page.locator("#loader-cancel").click();
        await page.locator("#file-input").setInputFiles(await download.path());
        await page.waitForFunction(
          async () => {
            const { engine } = await import("./js/engine.js"),
              { store } = await import("./js/state.js");
            return (
              store.project.projectName === "How We Be - Based" &&
              engine.buffers.filter(Boolean).length === 16
            );
          },
          null,
          { timeout: 120000 },
        );
        await page.locator("#btn-play").click();
        await page.waitForFunction(async () => {
          const { engine } = await import("./js/engine.js");
          return engine.currentStep > 4;
        });
        await page.locator("#btn-stop").click();
      }
    }
    // Catalogue sends songs to song options, never the single-sample decoder.
    await page.locator("#btn-l1-audio").click();
    await page.getByRole("searchbox").fill("First Audional Song");
    await page.getByRole("button", { name: "Search", exact: true }).click();
    await page
      .getByRole("button", { name: "Song options", exact: true })
      .click();
    assert.equal(await page.locator("#library-sample").inputValue(), "3");
    assert(await page.locator("#loader-load").isDisabled());
    await page.locator("#library-sample").selectOption("4");
    await page.locator("#library-audition").click();
    assert(await page.locator(".historic-player iframe").isVisible());
    assert.equal(
      await page.locator(".historic-player iframe").getAttribute("sandbox"),
      "allow-scripts allow-same-origin",
    );
    await page.locator("#library-stop").click();
    assert.equal(await page.locator(".historic-player iframe").count(), 0);
    await page.locator("#library-sample").selectOption("8");
    assert(!(await page.locator("#loader-load").isDisabled()));
    assert(!(await page.locator("#library-export-song").isVisible()));
    const output = process.env.OUTPUT_DIR || "/private/tmp";
    fs.mkdirSync(output, { recursive: true });
    fs.writeFileSync(
      output + "/L1xL2-song-validation.json",
      JSON.stringify({ results, errors }, null, 2),
    );
    assert.deepEqual(errors, []);
    console.log(
      JSON.stringify({
        results: results.map((x) => ({ ...x, started: x.started.length })),
        errors,
      }),
    );
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
