import assert from 'node:assert/strict';
export async function checkLegacyTrimPreview(page) {
  await page.evaluate(async () => {
    const base = '/audionaut-beta/daw/js/',
      { store, makeProject, makeSequence } = await import(base + 'state.js'),
      { engine } = await import(base + 'engine.js');
    const project = makeProject();
    project.channels.length = 1;
    project.instruments = [];
    project.sequences = [makeSequence(1, 0)];
    store.loadProject(project);
    const ctx = engine.ensureContext(),
      buffer = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    buffer.getChannelData(0).fill(0.02);
    engine.setBuffer(0, buffer);
    window.legacyPreview = { store, engine, calls: [] };
    const create = ctx.createBufferSource.bind(ctx);
    ctx.createBufferSource = () => {
      const src = create(),
        start = src.start.bind(src),
        set = src.playbackRate.setValueAtTime.bind(src.playbackRate),
        record = { events: [] };
      src.playbackRate.setValueAtTime = (...args) => {
        record.events.push(args);
        return set(...args);
      };
      src.start = (...args) => {
        legacyPreview.calls.push({ ...record, args, value: src.playbackRate.value });
        return start(...args);
      };
      return src;
    };
    legacyPreview.restore = () => (ctx.createBufferSource = create);
  });
  let assertions = 0;
  try {
    for (const test of [
      { id: 'audionals-editor-v1', rate: 2, reverse: true, expected: 0.5, event: true },
      { id: 'audionals-standalone-v1', rate: 2, reverse: true, expected: 0.25, event: false },
      { id: 'audionals-standalone-v1', rate: 0.5, reverse: false, expected: 0.875, event: false },
      { id: null, rate: 2, reverse: true, expected: 0.5, event: false },
      {
        id: 'audionals-standalone-v1',
        rate: 2,
        reverse: true,
        expected: 0.5,
        event: false,
        printed: true
      }
    ]) {
      await page.evaluate((test) => {
        const { store } = legacyPreview;
        store.project.legacyPlayback = test.id ? { version: 1, id: test.id } : undefined;
        Object.assign(store.channel(0), {
          pitch: test.rate,
          reverse: test.reverse,
          trimStart: 0.125,
          trimEnd: 0.625,
          clipSnapshot: test.printed ? {} : null
        });
      }, test);
      await page.locator('[title="Trim / waveform"]').first().click();
      await page.locator('#trim-play').click();
      const call = await page.evaluate(() => legacyPreview.calls.at(-1));
      assert.ok(
        Math.abs(call.args[1] - (test.reverse ? 0.375 : 0.125)) < 1e-12,
        JSON.stringify({ test, call })
      );
      assert.ok(Math.abs(call.args[2] - test.expected) < 1e-12, JSON.stringify({ test, call }));
      assert.equal(!!call.events.length, test.event, JSON.stringify({ test, call }));
      assertions += 3;
      await page.locator('#trim-stop').click();
      await page.locator('#trim-close').click();
    }
    await page.evaluate(() => {
      legacyPreview.store.project.legacyPlayback = { version: 1, id: 'audionals-editor-v1' };
      Object.assign(legacyPreview.store.channel(0), {
        trimStart: 0.5,
        trimEnd: 0.5,
        clipSnapshot: null
      });
    });
    const before = await page.evaluate(() => legacyPreview.calls.length);
    await page.locator('[title="Trim / waveform"]').first().click();
    await page.locator('#trim-play').click();
    assert.equal(await page.evaluate(() => legacyPreview.calls.length), before);
    assertions++;
    await page.locator('#trim-close').click();
    return assertions;
  } finally {
    await page.evaluate(() => {
      legacyPreview.restore();
      legacyPreview.engine.stop();
      delete window.legacyPreview;
    });
  }
}
