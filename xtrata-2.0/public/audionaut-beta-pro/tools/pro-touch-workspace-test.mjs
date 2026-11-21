import assert from 'node:assert/strict';
import { browser, page, serve, selectWorkspace } from './serve.mjs';
const server = await serve(),
  b = await browser(),
  logs = [];
try {
  const p = await page(b, server.url, { width: 820, height: 1180, hasTouch: true, logs });
  await p.goto(server.url + '/audionaut-beta-pro/daw.html');
  await p.waitForFunction(
    () =>
      document.querySelector('#project-name')?.value.includes('Lagos') &&
      document.querySelector('.mobile-strip .solo')
  );
  await p.evaluate(async () => {
    window.testStore = (await import('/audionaut-beta-pro/daw/js/state.js')).store;
  });
  await p.getByRole('button', { name: 'Dismiss', exact: true }).tap();
  const strip = p.locator('.mobile-strip'),
    track = p.getByLabel('Track', { exact: true });
  const sample = await track.inputValue();
  await strip.locator('.solo').tap();
  assert.equal(await p.evaluate((id) => testStore.track(id).solo, sample), true);
  await strip.locator('.solo').tap();
  await strip.locator('.mute').tap();
  assert.equal(await p.evaluate((id) => testStore.track(id).mute, sample), true);
  await strip.locator('.mute').tap();
  await strip.locator('.ins').tap();
  assert.equal(
    await p.locator('#modal-chain [data-chain="inserts"]').getAttribute('aria-selected'),
    'true'
  );
  await p.locator('#chain-close').tap();
  for (const width of [320, 390, 820, 1180]) {
    await p.setViewportSize({ width, height: 1000 });
    const outside = await strip
      .locator('button:visible,input[type=range]:visible')
      .evaluateAll((nodes) =>
        nodes.flatMap((n) => {
          const { left, right, width, height } = n.getBoundingClientRect();
          if (left >= 0 && right <= innerWidth + 1 && width >= 44 && height >= 38) return [];
          return [
            {
              control: n.getAttribute('aria-label') || n.textContent,
              left,
              right,
              width,
              height,
              viewport: innerWidth
            }
          ];
        })
      );
    assert.deepEqual(outside, [], 'Sample controls fit at ' + width);
    if (process.env.SCREENSHOT_DIR && width === 390)
      await p
        .locator('.mobile-inspector')
        .screenshot({ path: process.env.SCREENSHOT_DIR + '/mobile-track.png' });
  }
  await p.setViewportSize({ width: 390, height: 844 });
  await p.getByRole('button', { name: 'Loop bar', exact: true }).tap();
  const second = await p.evaluate(() => testStore.channel(1).id);
  await p.getByRole('button', { name: 'Next track' }).tap();
  assert.equal(await track.inputValue(), second);
  await strip.locator('.mute').tap();
  await p.getByRole('button', { name: 'Previous track' }).tap();
  assert.equal(await track.inputValue(), sample);
  await p.getByRole('button', { name: 'Groups', exact: true }).tap();
  const dialog = p.getByRole('dialog', { name: 'Track groups' });
  await dialog.getByLabel('Group name', { exact: true }).fill('Bus beat');
  await dialog.locator('input[type=checkbox]').nth(1).check();
  await dialog.getByRole('button', { name: 'Save group' }).tap();
  assert.equal(await track.locator('option').count(), 2);
  const muteGroup = p.getByRole('button', { name: 'Mute group Bus beat' });
  await muteGroup.tap();
  async function waitForKickGain(audible) {
    await p.waitForFunction(
      async ({ sample, audible }) => {
        const { engine } = await import('/audionaut-beta-pro/daw/js/engine.js');
        const strip = engine._mixer.strips.get(sample);
        const gain = strip.fader.gain.value * strip.chain.input.gain.value;
        return audible ? gain > 0.01 : gain < 0.001;
      },
      { sample, audible }
    );
  }
  await waitForKickGain(false);
  if (process.env.SCREENSHOT_DIR)
    await p
      .locator('.mobile-inspector')
      .screenshot({ path: process.env.SCREENSHOT_DIR + '/mobile-track-groups.png' });
  assert.ok(await p.evaluate(() => testStore.channel(0).mute && testStore.channel(1).mute));
  await muteGroup.tap();
  await waitForKickGain(true);
  assert.ok(
    await p.evaluate(() => !testStore.channel(0).mute && testStore.channel(1).mute),
    'Release preserves an individually muted track'
  );
  await p.getByRole('button', { name: 'Next track' }).tap();
  await p.getByRole('button', { name: 'Next track' }).tap();
  assert.equal(await track.inputValue(), sample);
  const loop = await p.evaluate(async () => {
    const { engine } = await import('/audionaut-beta-pro/daw/js/engine.js');
    return [engine.isPlaying, engine._loopRange.end - engine._loopRange.start];
  });
  assert.deepEqual(loop, [true, 4]);
  await p.locator('#btn-stop').tap();
  await p.getByRole('button', { name: 'All tracks', exact: true }).tap();
  const synth = await p.evaluate(() => testStore.project.instruments[1].id);
  await track.selectOption(synth);
  assert.equal(await p.locator('.mobile-pads').isVisible(), false);
  await strip.locator('.solo').tap();
  assert.ok(
    await p.evaluate(
      ([a, b]) => testStore.track(a).solo && !testStore.track(b).solo,
      [synth, sample]
    )
  );
  await strip.locator('.synth-picker-btn').tap();
  await p.waitForSelector('.synth-pop');
  await p.keyboard.press('Escape');
  await strip.locator('.panel-open').tap();
  await p.waitForSelector('body.synth-dock-open #synth-dock');
  await p.locator('#synth-dock-toggle').tap();
  await strip.locator('.roll-open').tap();
  await p.locator('#roll-close').tap();
  await strip.locator('.fxb').tap();
  assert.equal(
    await p.locator('#modal-chain [data-chain="fx"]').getAttribute('aria-selected'),
    'true'
  );
  await p.locator('#chain-close').tap();
  await track.selectOption(sample);
  await p.setViewportSize({ width: 820, height: 1000 });
  await selectWorkspace(p, 'Timeline');
  const canvas = p.locator('.song-canvas'),
    scroller = p.locator('.song-scroll'),
    toggle = p.getByRole('button', { name: 'Track controls', exact: true });
  await p.waitForSelector('.song-names-only .song-track-name');
  const before = await p.evaluate(() => JSON.stringify(testStore.project));
  assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
  assert.ok(Number(await canvas.getAttribute('data-controls-width')) < 120);
  assert.match(await canvas.evaluate((n) => getComputedStyle(n).touchAction), /pan|manipulation/);
  if (process.env.SCREENSHOT_DIR)
    await p
      .locator('.song-frame')
      .screenshot({ path: process.env.SCREENSHOT_DIR + '/touch-timeline.png' });
  await canvas.scrollIntoViewIfNeeded();
  if (b.browserType().name() === 'chromium') {
    const cdp = await p.context().newCDPSession(p);
    async function swipe(dx, dy) {
      const box = await canvas.boundingBox(),
        x = box.x + box.width * 0.7,
        y = box.y + Math.min(150, box.height * 0.45);
      const send = (type, points) =>
        cdp.send('Input.dispatchTouchEvent', { type, touchPoints: points });
      await send('touchStart', [{ x, y }]);
      for (let n = 1; n <= 8; n++)
        await send('touchMove', [{ x: x + (dx * n) / 8, y: y + (dy * n) / 8 }]);
      await send('touchEnd', []);
    }
    await swipe(-150, 0);
    await p.waitForFunction(() => document.querySelector('.song-scroll').scrollLeft > 25);
    await swipe(0, -80);
    await p.waitForFunction(() => document.querySelector('.song-scroll').scrollTop > 15);
    await cdp.detach();
  }
  await scroller.evaluate((n) => n.scrollTo(0, 0));
  await toggle.tap();
  await p.waitForSelector('.song-track .channel-controls .solo');
  assert.equal(await toggle.getAttribute('aria-expanded'), 'true');
  for (const width of [320, 390, 820]) {
    await p.setViewportSize({ width, height: 1000 });
    await p.waitForFunction(() => {
      const canvas = document.querySelector('.song-canvas');
      return (
        Math.abs(
          canvas.getBoundingClientRect().width - document.querySelector('.song-scroll').clientWidth
        ) < 1
      );
    });
    for (const kind of ['sample', 'instrument']) {
      await p.evaluate((kind) => {
        const canvas = document.querySelector('.song-canvas');
        const rows = [
          ...testStore.project.channels.filter((t) => !t.assetOnly),
          ...testStore.project.instruments
        ];
        const index = rows.findIndex((t) => t.kind === kind);
        document.querySelector('.song-scroll').scrollTop =
          index * Number(canvas.dataset.trackHeight);
      }, kind);
      await p.waitForSelector('.song-track[data-kind="' + kind + '"] .solo');
      const fitting = await p
        .locator('.song-track[data-kind="' + kind + '"]')
        .first()
        .evaluate((row) => {
          const box = row.getBoundingClientRect();
          return [...row.querySelectorAll('button,input:not([type=hidden])')]
            .filter((n) => n.offsetWidth)
            .filter((n) => {
              const r = n.getBoundingClientRect();
              return (
                r.top < box.top || r.bottom > box.bottom || r.left < box.left || r.right > box.right
              );
            })
            .map((n) => n.title || n.className);
        });
      assert.deepEqual(fitting, [], kind + ' controls fit their track at ' + width);
    }
  }
  await scroller.evaluate((n) => n.scrollTo(0, 0));
  await toggle.tap();
  await p.getByRole('button', { name: 'Edit', exact: true }).tap();
  assert.equal(await canvas.evaluate((n) => getComputedStyle(n).touchAction), 'none');
  assert.equal(
    await p.evaluate(() => JSON.stringify(testStore.project)),
    before,
    'Navigation must preserve the song'
  );
  // Tap an empty sixteenth, using the actual timeline geometry, to prove Edit reaches the shared editor.
  await p.evaluate(() => {
    testStore.clearChannelPattern(0);
    document.querySelector('.song-scroll').scrollTo(0, 0);
  });
  await p.waitForFunction(
    () =>
      document.querySelector('.song-scroll').scrollTop === 0 &&
      [...document.querySelectorAll('.song-track-name')].some(
        (n) => n.parentElement.dataset.trackId === testStore.channel(0).id
      )
  );
  await p.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  await canvas.tap({
    position: { x: Number(await canvas.getAttribute('data-controls-width')) + 57, y: 68 }
  });
  await p.waitForFunction(() => testStore.seq.steps[0].some(Boolean), null, { timeout: 3000 });
  const groupStates = await p.evaluate(async () => {
    const { saveGroup, toggleGroup, removeGroup, readGroups } =
      await import('/audionaut-beta-pro/daw/js/mobile-track-groups.js');
    const { exportProject, importProject } =
      await import('/audionaut-beta-pro/daw/js/persistence.js');
    const { undo, redo } = await import('/audionaut-beta-pro/daw/js/history.js');
    const owners = [
      testStore.channel(0),
      testStore.channel(1),
      testStore.project.instruments[0]
    ].map((t) => t.id);
    const state = () => owners.map((id) => !!testStore.track(id).mute);
    for (const id of owners) testStore.setTrackProp(id, 'mute', false);
    const drums = saveGroup('', 'Drums', owners.slice(0, 2));
    const layers = saveGroup('', 'Layers', owners.slice(1));
    toggleGroup(drums);
    toggleGroup(layers);
    undo();
    const undone = state();
    redo();
    const redone = state();
    importProject(exportProject());
    const saved = readGroups().muted.includes(layers);
    toggleGroup(drums);
    const overlap = state();
    testStore.setTrackProp(owners[2], 'mute', false);
    testStore.setTrackProp(owners[2], 'mute', true);
    removeGroup(layers);
    return [undone, redone, saved, overlap, state()];
  });
  assert.deepEqual(groupStates, [
    [true, true, false],
    [true, true, true],
    true,
    [false, true, true],
    [false, false, true]
  ]);
  assert.deepEqual(
    logs.filter((x) => x.startsWith('pageerror:')),
    []
  );
  console.log(
    'PASS track switching during a bar loop, overlapping mute groups, undo and save/reopen, plug-ins, and touch Timeline navigation and editing'
  );
} finally {
  await b.close();
  server.srv.close();
}
