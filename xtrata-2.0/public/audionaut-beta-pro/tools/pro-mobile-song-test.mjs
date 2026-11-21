import assert from 'node:assert/strict';
import { serve, browser, page } from './serve.mjs';
const server = await serve(),
  driver = await browser(),
  logs = [];
try {
  const p = await page(driver, server.url, { width: 390, height: 844, logs });
  p.setDefaultTimeout(12000);
  await p.goto(server.url + '/audionaut-beta-pro/daw.html');
  await p.waitForFunction(
    () =>
      document.querySelector('.mobile-pads') &&
      document.querySelector('#project-name').value.includes('Lagos')
  );
  await p.evaluate(async () => {
    const base = '/audionaut-beta-pro/daw/js/';
    const { store, makeProject, makeSequence } = await import(base + 'state.js');
    const { engine } = await import(base + 'engine.js');
    const project = makeProject();
    project.bpm = 240;
    project.playEmptySequences = true;
    project.sequences.push(makeSequence());
    store.loadProject(project);
    window.testSong = { store, engine };
  });
  const btn = (name) => p.getByRole('button', { name, exact: true });
  const selected = (s) =>
    p
      .locator('.mobile-bars button[aria-pressed=true]')
      .innerText()
      .then((t) => assert.equal(t, s));
  await p.locator('#btn-play').click();
  await p.waitForFunction(
    () =>
      document.querySelector('.mobile-bars [aria-pressed=true]').textContent === 'Bar 2' &&
      document.querySelector('.mobile-pads .playing')
  );
  await p.evaluate(() => testSong.engine.seekBeat(15.75));
  await p.waitForFunction(
    () =>
      document.querySelector('.mobile-selectors select').value === '1' &&
      document.querySelector('.mobile-bars [aria-pressed=true]').textContent === 'Bar 1'
  );
  await btn('Follow playback').click();
  await p.getByLabel('Sequence', { exact: true }).selectOption('0');
  await btn('Bar 3').click();
  await p.locator('.mobile-pads button').first().click();
  assert.ok(
    await p.evaluate(
      () =>
        testSong.store.project.sequences[0].steps[0][32] &&
        !testSong.store.project.sequences[1].steps[0][32] &&
        testSong.engine.playingSequence === 1
    )
  );
  // Keep a held live note and observe the scheduler across the mode changes.
  await p.evaluate(async () => {
    const { engine } = testSong;
    const live = await import('/audionaut-beta-pro/daw/js/live-keys.js');
    const scheduled = engine.scheduleEvent;
    window.transition = {
      live,
      start: engine._transportStart,
      generation: engine._transportGeneration,
      stops: 0,
      steps: []
    };
    document.addEventListener('transport-stop', () => transition.stops++);
    engine.scheduleEvent = function (event) {
      if (event.type === 'step') transition.steps.push({ beat: event.beat, time: event.time });
      return scheduled.call(this, event);
    };
    live.noteOn('mode-test', 0, 60);
  });
  await btn('Loop bar').click();
  await p.waitForFunction(
    () =>
      testSong.engine._loopRange?.start === 8 &&
      testSong.engine._loopRange.end === 12 &&
      testSong.engine._transportRuns.some((r) => r.repeats > 1)
  );
  await selected('Bar 3');
  // Change the destination in the first half of a bar. The old final sixteenth
  // and the new downbeat must be one step apart on the same audio clock.
  await p.waitForFunction(() => {
    const beat = testSong.engine.getMusicalPosition().beat;
    return beat >= 8.25 && beat < 9.5;
  });
  await btn('Bar 1').click();
  assert.match(await p.locator('.mobile-position').innerText(), /Queued sequence 1, bar 1/);
  await p.waitForFunction(
    () => testSong.engine._loopRange.start === 0 && testSong.engine.currentStep < 16
  );
  assert.ok(
    await p.evaluate(() =>
      transition.steps.some(
        (s, i, a) =>
          i &&
          s.beat === 0 &&
          a[i - 1].beat === 11.75 &&
          Math.abs(s.time - a[i - 1].time - 0.0625) < 1e-5
      )
    ),
    'Bar switch is quantized without a missing or duplicate beat'
  );
  await btn('Loop sequence').click();
  await p.waitForFunction(
    () => testSong.engine._loopRange?.start === 0 && testSong.engine._loopRange.end === 16
  );
  // Moving to another sequence while looping waits for the running sequence to finish.
  await p.getByLabel('Sequence', { exact: true }).selectOption({ value: '1' });
  await p.waitForFunction(
    () => testSong.engine._loopRange.start === 16 && testSong.engine.playingSequence === 1
  );
  assert.ok(
    await p.evaluate(() =>
      transition.steps.some(
        (s, i, a) =>
          i &&
          s.beat === 16 &&
          a[i - 1].beat === 15.75 &&
          Math.abs(s.time - a[i - 1].time - 0.0625) < 1e-5
      )
    )
  );
  await btn('Play song').click();
  await p.waitForFunction(() => testSong.engine._loopRange?.end === 32);
  await btn('Follow playback').click();
  assert.ok(
    await p.evaluate(() => {
      const { engine } = testSong;
      const running =
        engine.isPlaying &&
        engine._transportStart === transition.start &&
        engine._transportGeneration === transition.generation &&
        transition.stops === 0 &&
        transition.live.heldCount() === 1 &&
        engine.getMusicalPosition().beat >= 16;
      transition.live.noteOff('mode-test');
      return running;
    }),
    'Follow, bar, sequence and song commands preserve the running transport and held note'
  );
  await p.evaluate(() => testSong.engine.seekBeat(21));
  await p.waitForFunction(() => testSong.store.project.currentSequence === 1);
  await selected('Bar 2');
  // The last command wins, including leaving a queued jump for linear playback.
  await btn('Loop bar').click();
  await btn('Bar 4').click();
  await btn('Play song').click();
  await p.waitForFunction(() => testSong.engine.getMusicalPosition().beat >= 24);
  const afterCancel = await p.evaluate(() => testSong.engine.getMusicalPosition().beat);
  assert.ok(afterCancel < 28, 'Song mode cancels the queued jump and continues into bar 3');
  await btn('Follow playback').click();
  await p.locator('#btn-stop').click();

  // Start with real user material and make sure every navigation action is read-only.
  await p.evaluate(() => {
    const { store } = testSong,
      project = store.project;
    project.channels[0].name = 'Original sample';
    project.instruments[0].name = 'My synth';
    project.instruments[0].solo = true;
    project.sequences[1].notes[0] = [
      { id: 'user-note', pitch: 60, step: 0, dur: 4, vel: 1, rawDur: 4, rawStep: 0, expression: [] }
    ];
    project.currentSequence = 0;
    project.swing = 17;
    store.emit('sequence', 0);
    window.beforeBeats = structuredClone(project);
  });
  await btn('Add beat').click();
  await btn('Next →').click();
  await btn('← Previous').click();
  assert.ok(
    await p.evaluate(() => JSON.stringify(beforeBeats) === JSON.stringify(testSong.store.project))
  );
  const apply = (i) => p.locator('#beats-list .beat-apply').nth(i).click();
  const applied = () =>
    p.waitForFunction(
      () =>
        document.querySelector('#beats-cancel').hidden &&
        document.querySelector('#beats-status').textContent.startsWith('Applied')
    );
  await apply(0);
  await applied();
  const original = () =>
    p.evaluate(() => {
      const a = beforeBeats,
        b = testSong.store.project;
      return (
        b.bpm === a.bpm &&
        b.swing === a.swing &&
        b.continuous === a.continuous &&
        JSON.stringify(b.channels[0]) === JSON.stringify(a.channels[0]) &&
        JSON.stringify(b.instruments) === JSON.stringify(a.instruments) &&
        JSON.stringify(b.sequences.map((s) => s.notes)) ===
          JSON.stringify(a.sequences.map((s) => s.notes)) &&
        JSON.stringify(b.sequences[0].steps[0]) === JSON.stringify(a.sequences[0].steps[0])
      );
    });
  assert.ok(await original());
  await p.evaluate(() => {
    const b = testSong.store.project,
      i = b.channels.findIndex((c) => c.beatLayer);
    if (i < 0) throw Error('Missing first beat');
    testSong.store.setChannelProp(i, 'name', 'Hand-edited beat track');
    window.edited = [structuredClone(b.channels[i]), structuredClone(b.sequences[0].steps[i])];
    window.beforeSwap = JSON.stringify(b);
  });
  await apply(1);
  await applied();
  assert.ok(await original());
  assert.ok(
    await p.evaluate(() => {
      const b = testSong.store.project,
        i = b.channels.findIndex((c) => c.id === edited[0].id);
      return JSON.stringify([b.channels[i], b.sequences[0].steps[i]]) === JSON.stringify(edited);
    })
  );
  await p.evaluate(async () => {
    const { undo } = await import('/audionaut-beta-pro/daw/js/history.js');
    undo();
  });
  assert.deepEqual(
    await p.evaluate(() => JSON.parse(JSON.stringify(testSong.store.project))),
    await p.evaluate(() => JSON.parse(beforeSwap)),
    'One undo restores the previous layer and edits'
  );
  const protection = await p.evaluate(async () => {
    const base = '/audionaut-beta-pro/daw/js/';
    const { exportProject, prepareProject } = await import(base + 'persistence.js');
    const { planBeatLayer } = await import(base + 'beat-layer.js');
    const project = prepareProject(exportProject()),
      sequence = project.sequences[0];
    const reusable = project.channels.findIndex(
      (c) => c.beatLayer && c.name !== 'Hand-edited beat track'
    );
    const targets = planBeatLayer(project, sequence, 16).targets;
    const editedIndex = project.channels.findIndex((c) => c.name === 'Hand-edited beat track');
    const roundTrip = targets.includes(reusable) && !targets.includes(editedIndex);
    project.sequences[1].steps[reusable][4] = 1;
    const crossSequence = !planBeatLayer(project, sequence, 16).targets.includes(reusable);
    const { makeChannel } = await import(base + 'state.js');
    while (project.channels.length < 64) {
      project.channels.push(makeChannel(project.channels.length));
      project.sequences.forEach((s) => s.steps.push(Array(64).fill(0)));
    }
    for (const c of project.channels) c.name = 'Protected ' + c.id;
    const original = JSON.stringify(project);
    let refused = false;
    try {
      planBeatLayer(project, sequence, 1);
    } catch {
      refused = true;
    }
    return { roundTrip, crossSequence, full: refused && JSON.stringify(project) === original };
  });
  assert.deepEqual(protection, { roundTrip: true, crossSequence: true, full: true });
  await p.locator('#beats-close').click();
  await p.evaluate(async () => {
    const { store, engine } = testSong;
    const { makeProject, makeSequence } = await import('/audionaut-beta-pro/daw/js/state.js');
    const project = makeProject();
    project.sequences.push(makeSequence());
    project.bpm = 240;
    project.timeline.enabled = true;
    project.timeline.lengthBeats = 96;
    project.timeline.tempo = [{ beat: 0, bpm: 240 }];
    project.timeline.clips = [
      {
        id: 'placed-pattern',
        type: 'pattern',
        trackId: project.channels[0].id,
        sequenceId: project.sequences[1].id,
        start: 48,
        duration: 4,
        offset: 8,
        gain: 1
      }
    ];
    store.loadProject(project);
    await engine.play({ fromBeat: 48 });
  });
  await p.waitForFunction(
    () =>
      testSong.store.project.currentSequence === 1 &&
      document.querySelector('.mobile-bars [aria-pressed=true]').textContent === 'Bar 3' &&
      document.querySelector('.mobile-pads .playing')
  );
  await btn('Loop bar').click();
  await p.waitForFunction(
    () => testSong.engine._loopRange?.start === 48 && testSong.engine._loopRange.end === 52
  );
  await btn('Play song').click();
  await p.evaluate(() => testSong.engine.seekBeat(80));
  await p.waitForFunction(
    () =>
      document.querySelector('.mobile-position').textContent.includes('No single step pattern') &&
      !document.querySelector('.mobile-pads .playing')
  );
  assert.equal(await p.evaluate(() => testSong.store.project.sequences.length), 2);
  await p.locator('#btn-stop').click();
  // Auditioning uses real samples and a private output without editing or seeking the song.
  await p.evaluate(async () => {
    const base = '/audionaut-beta-pro/daw/js/';
    const { Engine, engine } = await import(base + 'engine.js');
    const { store, makeProject } = await import(base + 'state.js');
    store.loadProject(makeProject());
    engine.ensureContext();
    const probe = (window.auditionProbe = {
      before: JSON.stringify(store.project),
      buffers: engine.buffers.slice(),
      players: new Set(),
      songHits: 0
    });
    const connect = engine.masterGain.connect.bind(engine.masterGain);
    engine.masterGain.connect = (node, ...args) => {
      probe.monitor = node;
      return connect(node, ...args);
    };
    const schedule = Engine.prototype.scheduleEvent;
    Engine.prototype.scheduleEvent = function (event) {
      if (event.type === 'sample') {
        if (this === engine) probe.songHits++;
        else if (!probe.players.has(this)) {
          probe.players.add(this);
          probe.meter = this.ctx.createAnalyser();
          this.masterGain.connect(probe.meter);
        }
      }
      return schedule.call(this, event);
    };
    // Earlier timing checks observed the song instance. Delegate it to this probe now.
    delete engine.scheduleEvent;
  });
  await btn('Add beat').click();
  const rows = p.locator('#beats-list .beat-row'),
    previews = rows.locator('.beat-preview');
  await previews.first().click();
  await p.waitForFunction(() =>
    document.querySelector('#beats-status').textContent.startsWith('Previewing')
  );
  await p.waitForFunction(() => {
    const m = auditionProbe.meter;
    if (!m) return false;
    const values = new Float32Array(m.fftSize);
    m.getFloatTimeDomainData(values);
    return values.some((v) => Math.abs(v) > 0.002);
  });
  assert.ok(
    await p.evaluate(
      () =>
        !testSong.engine.isPlaying &&
        auditionProbe.players.size === 1 &&
        JSON.stringify(testSong.store.project) === auditionProbe.before &&
        testSong.engine.buffers.every((b, i) => b === auditionProbe.buffers[i])
    )
  );
  if (process.env.SCREENSHOT_DIR)
    await p.screenshot({ path: process.env.SCREENSHOT_DIR + '/beat-audition-phone.png' });
  for (const [width, height] of [
    [320, 568],
    [844, 390]
  ]) {
    await p.setViewportSize({ width, height });
    const pair = rows.first().locator('.beat-actions button');
    for (const control of await pair.all()) {
      await control.scrollIntoViewIfNeeded();
      const rect = await control.boundingBox();
      assert.ok(rect && rect.x >= 0 && rect.x + rect.width <= width + 1 && rect.height >= 44);
    }
  }
  await p.setViewportSize({ width: 390, height: 844 });
  await previews.nth(1).click();
  await p.waitForFunction(
    () =>
      auditionProbe.players.size === 2 &&
      [...auditionProbe.players].filter((e) => e.isPlaying).length === 1
  );
  await previews.nth(1).click();
  await p.waitForFunction(() => [...auditionProbe.players].every((e) => !e.isPlaying));
  const previewReady = async (predicate) => {
    await p.waitForFunction(predicate, undefined, { timeout: 30000 }).catch(async (error) => {
      throw Error((await p.locator('#beats-status').textContent()) + ' / ' + error.message);
    });
  };
  await p.locator('#beats-collection').selectOption({ value: 'tonal' });
  await previews.first().click();
  await previewReady(() =>
    document.querySelector('#beats-status').textContent.startsWith('Previewing')
  );
  await btn('Next →').click();
  await previewReady(() =>
    document.querySelectorAll('.beat-preview')[1]?.textContent.includes('Stop')
  );
  await p.locator('#beats-search').fill('no matching audition');
  await p.waitForFunction(() => [...auditionProbe.players].every((e) => !e.isPlaying));
  await p.locator('#beats-search').fill('');
  // The real gateway is outside this local test. Feed the normal Ordinal loader
  // a PCM WAV long enough for the catalogue's trimmed loops and single hits.
  const frames = 32 * 8000,
    wav = Buffer.alloc(44 + frames * 2);
  wav.write('RIFF', 0);
  wav.writeUInt32LE(wav.length - 8, 4);
  wav.write('WAVEfmt ', 8);
  wav.writeUInt32LE(16, 16);
  wav.writeUInt16LE(1, 20);
  wav.writeUInt16LE(1, 22);
  wav.writeUInt32LE(8000, 24);
  wav.writeUInt32LE(16000, 28);
  wav.writeUInt16LE(2, 32);
  wav.writeUInt16LE(16, 34);
  wav.write('data', 36);
  wav.writeUInt32LE(frames * 2, 40);
  for (let i = 0; i < 1600; i++) wav.writeInt16LE(Math.round(8000 * Math.sin(i / 12)), 44 + i * 2);
  await p.route('**/preview-ordinal/**', (r) => r.fulfill({ contentType: 'audio/wav', body: wav }));
  await p.route('**/preview-offline/**', (r) => r.fulfill({ status: 503, body: 'Unavailable' }));
  await p.evaluate(() => {
    testSong.store.settings.ordinalsGateway = location.origin + '/preview-offline/';
    testSong.store.settings.ordinalsFallbacks = [];
  });
  const collection = p.locator('#beats-collection');
  await collection.selectOption({ value: 'l1' });
  await previews.first().click();
  await previewReady(() =>
    document.querySelector('#beats-status').textContent.startsWith('Could not preview')
  );
  assert.equal(await previews.first().getAttribute('aria-pressed'), 'false');
  await p.evaluate(() => {
    testSong.store.settings.ordinalsGateway = location.origin + '/preview-ordinal/';
  });
  for (const value of ['l1', 'combined', 'drums-l1', 'original', 'drums-analog']) {
    await collection.selectOption({ value });
    await previews.first().click();
    await previewReady(() =>
      document.querySelector('#beats-status').textContent.startsWith('Previewing')
    );
    await previews.first().click();
  }
  assert.ok(
    await p.evaluate(
      () =>
        JSON.stringify(testSong.store.project) === auditionProbe.before &&
        !testSong.engine.isPlaying
    )
  );
  await collection.selectOption({ value: 'drums-studio' });
  // Closing during preparation must never let a stale preview start later.
  await p.evaluate(() => {
    document.querySelector('#beats-list .beat-preview').click();
    document.querySelector('#beats-close').click();
  });
  await btn('Play song').click();
  const generation = await p.evaluate(() => testSong.engine._transportGeneration);
  await btn('Add beat').click();
  await previews.first().click();
  await p.waitForFunction(
    () =>
      auditionProbe.monitor?.gain.value < 0.01 &&
      [...auditionProbe.players].some((e) => e.isPlaying)
  );
  assert.ok(
    await p.evaluate(
      (g) =>
        testSong.engine.isPlaying &&
        testSong.engine._transportGeneration === g &&
        JSON.stringify(testSong.store.project) === auditionProbe.before,
      generation
    )
  );
  // Apply ends the private preview and lets the running master play the real layer.
  await rows.first().locator('.beat-apply').click();
  await applied();
  await p.waitForFunction(
    () =>
      auditionProbe.monitor.gain.value > 0.99 &&
      auditionProbe.songHits > 0 &&
      [...auditionProbe.players].every((e) => !e.isPlaying)
  );
  assert.equal(await p.evaluate(() => testSong.engine._transportGeneration), generation);
  await p.keyboard.press('Escape');
  await p.locator('#btn-stop').click();
  assert.deepEqual(
    logs.filter((s) => s.startsWith('pageerror:')),
    []
  );
  console.log(
    'PASS mobile transport, isolated beat auditions, song monitoring, applying layers and undo'
  );
} finally {
  await driver.close();
  server.srv.close();
}
