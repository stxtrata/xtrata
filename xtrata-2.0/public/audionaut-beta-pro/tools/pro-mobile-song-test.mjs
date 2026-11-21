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
  await btn('Loop bar').click();
  await p.waitForFunction(
    () =>
      testSong.engine._loopRange?.start === 8 &&
      testSong.engine._loopRange.end === 12 &&
      testSong.engine._transportRuns.some((r) => r.repeats > 1)
  );
  await selected('Bar 3');
  await btn('Loop sequence').click();
  await p.waitForFunction(
    () => testSong.engine._loopRange?.start === 0 && testSong.engine._loopRange.end === 16
  );
  await btn('Play song').click();
  await p.waitForFunction(() => testSong.engine._loopRange?.end === 32);
  await btn('Follow playback').click();
  await p.evaluate(() => testSong.engine.seekBeat(21));
  await p.waitForFunction(() => testSong.store.project.currentSequence === 1);
  await selected('Bar 2');
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
  const apply = (i) => p.locator('#beats-list .beat-row button').nth(i).click();
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
  assert.deepEqual(
    logs.filter((s) => s.startsWith('pageerror:')),
    []
  );
  console.log(
    'PASS live bar and sequence following, pinned edits, loop wrap and song mode; browsing, layering, protected tracks and undo'
  );
} finally {
  await driver.close();
  server.srv.close();
}
