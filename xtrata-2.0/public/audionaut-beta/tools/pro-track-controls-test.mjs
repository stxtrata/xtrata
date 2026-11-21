import assert from 'node:assert/strict';
import { serve, browser, page } from './serve.mjs';
import { makeProject, makeSequence } from '../daw/js/state.js';
const project = makeProject();
project.channels = project.channels.slice(0, 3);
project.instruments = project.instruments.slice(0, 2);
project.sequences = [makeSequence(3, 2), makeSequence(3, 2)];
const { srv, url } = await serve();
let b,
  checks = 0;
const ok = (v, m) => {
  assert.ok(v, m);
  checks++;
};
try {
  b = await browser();
  const logs = [],
    p = await page(b, url, { logs });
  await p.addInitScript(
    (q) =>
      localStorage.setItem(
        'audionaut.beta.v0.2.project',
        JSON.stringify({ ...q, format: 'audionaut-workstation/3' })
      ),
    project
  );
  await p.goto(url + '/audionaut-beta/daw.html');
  await p.waitForSelector('#pro-workspace-nav');
  await p.evaluate(async () => {
    const base = '/audionaut-beta/daw/js/';
    window.test = {
      ...(await import(base + 'state.js')),
      ...(await import(base + 'history.js')),
      engine: (await import(base + 'engine.js')).engine
    };
    const { store, engine } = test;
    store.project.channels[0].source = { type: 'ordinal', value: 'a'.repeat(64) + 'i0' };
    store.project.channels[0].sampleName = 'Synthetic tone';
    const b = engine.ensureContext().createBuffer(1, 4410, 44100);
    b.getChannelData(0).fill(0.1);
    engine.setBuffer(0, b);
    store.emit('channel', { ch: 0 });
  });
  const patterns = await p.evaluate(() =>
    [
      ...document.querySelectorAll('#channels .channel-controls,#instruments .channel-controls')
    ].map((n) => ({
      id: n.dataset.trackId,
      buttons: [...n.querySelectorAll('button')]
        .filter((b) => !b.closest('.ch-tools'))
        .map((b) => b.title)
    }))
  );
  await p.getByRole('tab', { name: 'Timeline', exact: true }).click();
  await p.waitForSelector('.song-track');
  const actual = await p.evaluate(() =>
    [...document.querySelectorAll('.song-track .channel-controls')].map((n) => ({
      id: n.dataset.trackId,
      buttons: [...n.querySelectorAll('button')].map((b) => b.title)
    }))
  );
  ok(
    JSON.stringify(actual) === JSON.stringify(patterns),
    'Timeline retains shared sample and synth buttons except trigger-pattern tools'
  );
  const sample = p.locator('.song-track[data-kind="sample"]').first(),
    inst = p.locator('.song-track[data-kind="instrument"]').first();
  await sample.locator('.ch-name').fill('Timeline audio');
  await sample.locator('.ch-name').press('Enter');
  ok(
    (await p.locator('#channels .ch-name').first().inputValue()) === 'Timeline audio',
    'Name synchronizes to Patterns'
  );
  await sample.locator('.mute').click();
  ok(await p.evaluate(() => test.store.channel(0).mute), 'Timeline mute uses store');
  ok(
    (await p.locator('#channels .mute').first().getAttribute('aria-pressed')) === 'true',
    'Mute synchronized'
  );
  await sample.locator('.mute').click();
  await sample.locator('.solo').click();
  ok(await p.evaluate(() => test.store.channel(0).solo), 'Solo control');
  await sample.locator('.solo').click();
  await sample.locator('.ch-vol').evaluate((n) => {
    n.value = '.43';
    n.dispatchEvent(new Event('input', { bubbles: true }));
  });
  ok((await p.locator('#channels .ch-vol').first().inputValue()) === '0.43', 'Volume synchronized');
  ok(
    (await sample.locator('.ch-tools,.ch-pitch').count()) === 0,
    'Timeline omits trigger tools and playback-rate input'
  );
  await p.getByRole('tab', { name: 'Patterns', exact: true }).click();
  const patternSample = p.locator('#channels .channel[data-ch="0"]');
  ok(await patternSample.locator('.ch-tools').isVisible(), 'Patterns retains trigger tools');
  await patternSample.locator('.ch-pitch').fill('1.5');
  await patternSample.locator('.ch-pitch').press('Enter');
  ok(
    await p.evaluate(() => test.store.channel(0).pitch === 1.5),
    'Patterns retains playback-rate editing'
  );
  await p.getByRole('tab', { name: 'Timeline', exact: true }).click();
  ok(
    await p.evaluate(() => test.store.channel(0).pitch === 1.5),
    'Opening Timeline preserves saved playback rate'
  );
  for (const [selector, modal, close] of [
    ['.load', '#modal-loader', '#loader-cancel'],
    ['button[title="Trim / waveform"]', '#modal-trim', '#trim-close'],
    ['.fxb', '#modal-chain', '#chain-close'],
    ['.ins', '#modal-chain', '#chain-close']
  ]) {
    await sample.locator(selector).click();
    ok(await p.locator(modal).isVisible(), selector + ' opens canonical editor');
    await p.locator(close).click();
  }
  await sample.locator('.ord').click();
  ok(await sample.locator('.ord-card').isVisible(), 'Ordinal links open');
  ok(
    await sample.locator('.ord-card').evaluate((n) => {
      const b = n.getBoundingClientRect();
      return b.left >= 0 && b.right <= innerWidth && b.top >= 0 && b.bottom <= innerHeight;
    }),
    'Ordinal links stay within viewport'
  );
  await sample.locator('.ord').click();
  await p.getByLabel('Edit sequence', { exact: true }).selectOption('1');
  await p.getByRole('tab', { name: 'Patterns', exact: true }).click();
  await patternSample.locator('.pattern').click();
  ok(
    await p.evaluate(
      () =>
        test.store.project.sequences[1].steps[0].every((v) => v === 1) &&
        test.store.project.sequences[0].steps[0].every((v) => !v)
    ),
    'Pattern fill targets explicit sequence only'
  );
  await p.getByRole('tab', { name: 'Timeline', exact: true }).click();
  await p.getByRole('tab', { name: 'Patterns', exact: true }).click();
  await p.locator('#channels .pattern').first().click();
  ok(
    await p.evaluate(() => test.store.seq.steps[0].filter(Boolean).length === 32),
    'Pattern cycle continues across views from song data'
  );
  await patternSample.locator('button[title="Shift pattern right"]').click();
  ok(
    await p.evaluate(() => test.store.seq.steps[0][1] === 1 && !test.store.seq.steps[0][0]),
    'Shift pattern targets current sequence'
  );
  await patternSample.locator('button[title="Clear channel pattern"]').click();
  ok(await p.evaluate(() => test.store.seq.steps[0].every((v) => !v)), 'Clear pattern');
  await p.evaluate(() => test.undo());
  await p.waitForTimeout(50);
  ok(
    await p.evaluate(() => test.store.seq.steps[0].filter(Boolean).length === 32),
    'Pattern control undo'
  );
  await p.getByRole('tab', { name: 'Timeline', exact: true }).click();
  ok(
    (await sample.locator('.ch-tools,.ch-pitch').count()) === 0,
    'Removed Timeline controls stay absent after undo and view changes'
  );
  await inst.locator('.panel-open').click();
  ok(
    await p.locator('body').evaluate((n) => n.classList.contains('synth-dock-open')),
    'Synth panel opens within Timeline'
  );
  await p.click('#synth-dock-toggle');
  await inst.locator('.roll-open').click();
  ok(await p.locator('#modal-roll').isVisible(), 'MIDI editor opens');
  await p.click('#roll-close');
  await inst.locator('.fxb').click();
  ok((await p.locator('#chain-owner-label').textContent()) !== null, 'Synth FX editor opens');
  await p.click('#chain-close');
  await inst.locator('.synth-picker-btn').click();
  ok(await p.locator('.synth-pop').isVisible(), 'Shared synth folder picker opens');
  const next = await p.locator('.synth-pop .sp-item:not(.sel)').first().getAttribute('data-id');
  // Open its category if needed, then choose using the real shared popup.
  await p.locator(`.synth-pop .sp-item[data-id="${next}"]`).evaluate((n) => {
    const list = n.closest('.sp-list');
    if (list.hidden) list.previousElementSibling.click();
  });
  await p.locator(`.synth-pop .sp-item[data-id="${next}"]`).click();
  ok(
    await p.evaluate((id) => test.store.instrument(0).synthId === id, next),
    'Timeline synth selection updates track'
  );
  ok(
    (await p.locator('#instruments .inst-synth-select').first().inputValue()) === next,
    'Synth choice synchronized to Patterns'
  );
  await p.evaluate(() =>
    test.store.setNotes(0, [{ id: 'copy-note', step: 0, dur: 4, pitch: 60, vel: 0.8 }])
  );
  await inst.locator('button[title="Copy MIDI notes from this sequence"]').click();
  await p.getByLabel('Edit sequence', { exact: true }).selectOption('0');
  await inst.locator('button[title="Paste MIDI notes into this sequence"]').click();
  ok(
    await p.evaluate(
      () => test.store.seq.notes[0].length === 1 && test.store.seq.notes[0][0].pitch === 60
    ),
    'Shared MIDI clipboard with explicit sequence'
  );
  // A control must survive redraws while a name edit or fader gesture is active.
  await sample.locator('.ch-name').focus();
  await sample.locator('.ch-name').evaluate((n) => (window.focusedTrackInput = n));
  await p.evaluate(() => test.store.emit('dirty'));
  await p.waitForTimeout(50);
  ok(
    await p.evaluate(
      () =>
        document.activeElement === window.focusedTrackInput && window.focusedTrackInput.isConnected
    ),
    'Redraw preserves focused control element'
  );
  await p.getByRole('button', { name: '+ Audio channel', exact: true }).click();
  ok(await p.evaluate(() => test.store.numChannels === 4), 'Add sample channel from Timeline');
  await p.getByRole('button', { name: '+ Instrument', exact: true }).click();
  ok(
    await p.evaluate(() => test.store.project.instruments.length === 3),
    'Add instrument from Timeline'
  );
  await p.waitForTimeout(50);
  ok(
    (await p.locator('.song-track[data-kind="instrument"]').count()) === 3,
    'Track list rebuilds for new instruments'
  );
  for (const width of [1400, 850, 390]) {
    await p.setViewportSize({ width, height: 900 });
    await p.waitForTimeout(80);
    const layout = await p.evaluate(() => {
      const headers = document.querySelector('.song-track-headers').getBoundingClientRect(),
        rows = [...document.querySelectorAll('.song-track')];
      return {
        overflow: document.documentElement.scrollWidth > innerWidth + 1,
        fit: rows.every((row) => {
          const r = row.getBoundingClientRect();
          return [
            ...row.querySelectorAll(
              '.channel-controls input:not([hidden]),.channel-controls button'
            )
          ]
            .filter((n) => n.getClientRects().length)
            .every((n) => {
              const b = n.getBoundingClientRect();
              return (
                b.left >= r.left - 1 &&
                b.right <= r.right + 1 &&
                b.top >= r.top - 1 &&
                b.bottom <= r.bottom + 1
              );
            });
        }),
        headers: headers.width
      };
    });
    ok(
      !layout.overflow && layout.fit,
      `All controls fit without page overflow at ${width}px: ${JSON.stringify(layout)}`
    );
    if (width === 390)
      await p.screenshot({
        path: '/tmp/audionaut-timeline-track-controls-mobile.png',
        fullPage: true
      });
    if (width === 1400)
      await p.screenshot({
        path: process.env.TRACK_SCREENSHOT || '/tmp/audionaut-timeline-track-controls.png',
        fullPage: true
      });
  }
  ok(logs.filter((x) => x.startsWith('pageerror:')).length === 0, JSON.stringify(logs));
  console.log(
    JSON.stringify({
      checks,
      browser: process.env.AUDIONAUT_TEST_BROWSER || 'chromium',
      sharedControls: true
    })
  );
} finally {
  await b?.close();
  await new Promise((r) => srv.close(r));
}
