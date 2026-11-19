import { songPosition, songBarMarks } from '../daw/js/song-ruler.js';
import assert from 'node:assert/strict';
import { makeProject, makeSequence } from '../daw/js/state.js';
import { normalizeProjectModel } from '../daw/js/project-model.js';
import { pianoLayout } from '../daw/js/keyboard-layout.js';
import {
  songRegions,
  editSongRegion,
  sampleWindow,
  waveformIndex
} from '../daw/js/song-regions.js';
import { samplePeaks } from '../daw/js/waveform-drawing.js';
import { serve, browser, page } from './serve.mjs';
let checks = 0;
const ok = (condition, message) => {
  assert.ok(condition, message);
  checks++;
};
for (const octaves of [1, 2, 3, 4, 6]) {
  const keys = pianoLayout(24, octaves),
    whites = keys.filter((k) => !k.black);
  ok(whites.length === octaves * 7 + 1, 'Includes final white key');
  for (const key of keys.filter((k) => k.black)) {
    const previous = keys.find((k) => k.midi === key.midi - 1);
    ok(
      Math.abs(key.left + key.width / 2 - (previous.left + previous.width)) < 1e-10,
      'Each black key centred on its white boundary'
    );
  }
  ok(Math.abs(whites.at(-1).left + whites.at(-1).width - 1) < 1e-10, 'Final key fits');
}
const p = normalizeProjectModel({
  ...makeProject(),
  sequences: [makeSequence(), makeSequence()],
  bpm: 120,
  choke: false,
  playEmptySequences: true
});
p.sequences.forEach((s) => s.steps.forEach((row) => row.fill(0)));
p.channels[0].trimStart = 0;
p.channels[0].trimEnd = 1;
p.channels[0].pitch = 1;
p.sequences[0].steps[0][63] = 1;
p.sequences[1].steps[1][0] = 1;
const data = Float32Array.from({ length: 2000 }, (_, i) => (i < 1000 ? -0.25 : 0.75)),
  buffer = { duration: 2, length: 2000, sampleRate: 1000, getChannelData: () => data };
const before = JSON.stringify(p),
  model = songRegions(p, [buffer, buffer]);
ok(JSON.stringify(p) === before, 'Opening timeline never changes project');
ok(model.regions.length === 2, 'Automatically projects patterns');
ok(model.regions[0].end > 16, 'Tail crosses sequence boundary');
ok(model.regions[1].start === 16, 'Next sequence starts at four-bar boundary');
const moved = structuredClone(p);
editSongRegion(moved, model.regions[0], { start: 16.5 });
ok(
  !moved.sequences[0].steps[0][63] && moved.sequences[1].steps[0][2],
  'Move crosses sequence boundary'
);
const r = songRegions(moved, [buffer, buffer]).regions.find(
  (r) => r.trackId === moved.channels[0].id
);
moved.sequences[1].steps[0][4] = 1;
const snapshot = JSON.stringify(moved);
assert.throws(() => editSongRegion(moved, r, { start: 17 }), /already/);
ok(JSON.stringify(moved) === snapshot, 'Collision preserves source');
const trimmed = structuredClone(p);
trimmed.channels[0].trimStart = 0.25;
trimmed.channels[0].trimEnd = 0.75;
trimmed.channels[0].pitch = 2;
trimmed.sequences[0].steps[0][63] = 0;
trimmed.sequences[0].steps[0][0] = 1;
const tr = songRegions(trimmed, [buffer, buffer]).regions[0];
editSongRegion(trimmed, tr, { start: 0.5, end: 1, trimLeft: true });
ok(
  trimmed.sequences[0].steps[0][2].trimStart === 0.5 &&
    trimmed.sequences[0].steps[0][2].trimEnd === 0.75,
  'Left trim preserves remaining source'
);
const reverse = sampleWindow(
  p,
  { trimStart: 0.25, trimEnd: 0.75, pitch: 1, reverse: true },
  null,
  buffer
);
ok(waveformIndex(reverse, buffer, 0) === 1499, 'Reverse waveform begins at actual source end');
assert.deepEqual(samplePeaks(data, 0, 2000), [-0.25, 0.75]);
checks++;
const custom = structuredClone(p);
custom.timeline.enabled = true;
custom.timeline.clips = [
  {
    id: 'custom',
    type: 'pattern',
    trackId: p.channels[0].id,
    sequenceId: p.sequences[0].id,
    start: 32,
    duration: 16,
    offset: 0,
    gain: 1
  }
];
ok(
  songRegions(custom, [buffer]).regions[0].start === 47.75,
  'Saved arrangement placement preserved'
);
const printed = structuredClone(p);
printed.timeline.enabled = true;
printed.timeline.tempo = [
  { beat: 0, bpm: 120 },
  { beat: 2, bpm: 60 }
];
printed.timeline.clips = [
  {
    id: 'printed',
    type: 'audio',
    trackId: p.channels[0].id,
    start: 0,
    duration: 3,
    tailSeconds: 1,
    sourceOffsetSeconds: 0,
    playbackRate: 1
  }
];
const longBuffer = { ...buffer, duration: 20, length: 20000 };
let printedRegion = songRegions(printed, [longBuffer]).regions[0];
ok(printedRegion.end === 4, 'Printed tail follows the tempo map in seconds');
editSongRegion(printed, printedRegion, { end: 3.5 });
ok(
  printed.timeline.clips[0].duration === 2.5 &&
    songRegions(printed, [longBuffer]).regions[0].end === 3.5,
  'Trimming preserves effect-tail seconds across tempo changes'
);
printedRegion = songRegions(printed, [longBuffer]).regions[0];
editSongRegion(printed, printedRegion, { start: 1, end: 3.5, trimLeft: true });
ok(
  printed.timeline.clips[0].sourceOffsetSeconds === 0.5 &&
    songRegions(printed, [longBuffer]).regions[0].end === 3.5,
  'Left trim preserves printed clip end and advances source'
);
const meterProject = structuredClone(p);
meterProject.timeline.meter = [
  { beat: 0, numerator: 4, denominator: 4 },
  { beat: 8, numerator: 3, denominator: 4 }
];
assert.deepEqual(songPosition(meterProject, 12), { bar: 4, beat: 2 });
assert.deepEqual(
  songBarMarks(meterProject, 0, 14).map((m) => m.beat),
  [0, 4, 8, 11, 14]
);
checks += 2;
const { srv, url } = await serve();
let b;
try {
  b = await browser();
  const logs = [],
    tab = await page(b, url, { logs });
  await tab.addInitScript(
    (project) =>
      localStorage.setItem(
        'audionaut.beta-pro.v0.2.project',
        JSON.stringify({ ...project, format: 'audionaut-workstation/3' })
      ),
    p
  );
  await tab.goto(url + '/audionaut-beta-pro/daw.html');
  await tab.waitForSelector('#pro-workspace-nav');
  await tab.evaluate(async () => {
    const base = '/audionaut-beta-pro/daw/js/',
      { engine } = await import(base + 'engine.js'),
      { store } = await import(base + 'state.js');
    window.testState = { engine, store };
    const ctx = engine.ensureContext();
    const b = ctx.createBuffer(1, 88200, 44100);
    const a = b.getChannelData(0);
    for (let i = 0; i < a.length; i++) a[i] = Math.sin(i * 0.08) * 0.3;
    engine.setBuffer(0, b);
    engine.setBuffer(1, b);
    window.testState.before = JSON.stringify(store.project);
  });
  await tab.getByRole('tab', { name: 'Timeline', exact: true }).click();
  await tab.waitForSelector('.song-canvas');
  ok(
    await tab.evaluate(() => JSON.stringify(testState.store.project) === testState.before),
    'Opening workspace preserves song'
  );
  ok(
    (await tab.getByRole('button', { name: 'Build from patterns', exact: true }).count()) === 0,
    'No conversion needed in normal view'
  );
  ok((await tab.locator('.song-playhead').count()) === 1, 'Playhead mounted');
  ok(
    (await tab.locator('.song-transport select').first().inputValue()) === '0.25',
    'Default snap label is Step'
  );
  const box = await tab.locator('.song-canvas').boundingBox();
  await tab.mouse.click(box.x + 220 + 4 * 56, box.y + 15);
  await tab.waitForTimeout(50);
  ok(
    Math.abs((await tab.evaluate(() => testState.engine.getMusicalPosition().beat)) - 4) < 0.05,
    'Ruler seeks exact song beat'
  );
  await tab.getByRole('button', { name: 'Play or pause song' }).click();
  await tab.waitForTimeout(250);
  const a = +(await tab.locator('.song-playhead').getAttribute('data-beat'));
  await tab.waitForTimeout(180);
  const c = +(await tab.locator('.song-playhead').getAttribute('data-beat'));
  ok(c > a, 'Playhead follows audio clock');
  await tab.getByRole('button', { name: 'Play or pause song' }).click();
  const stopped = +(await tab.locator('.song-playhead').getAttribute('data-beat'));
  await tab.waitForTimeout(100);
  ok(
    Math.abs(+(await tab.locator('.song-playhead').getAttribute('data-beat')) - stopped) < 0.06,
    'Paused position stays fixed'
  );
  await tab.getByRole('button', { name: 'Return to start', exact: true }).click();
  await tab.waitForTimeout(50);
  ok(
    +(await tab.locator('.song-playhead').getAttribute('data-beat')) === 0,
    'Return to start resets visible playhead'
  );
  await tab.locator('.song-scroll').evaluate((n) => {
    n.scrollLeft = 700;
    n.scrollTop = 110;
    n.dispatchEvent(new Event('scroll'));
  });
  ok(
    (await tab.locator('.song-track-headers').evaluate((n) => n.getBoundingClientRect().left)) ===
      (await tab.locator('.song-frame').evaluate((n) => n.getBoundingClientRect().left)) + 1,
    'Track controls stay pinned'
  );
  // Drag a region into the next sequence, then undo and redo as one edit.
  await tab.locator('.song-scroll').evaluate((n) => {
    n.scrollLeft = 700;
    n.scrollTop = 0;
    n.dispatchEvent(new Event('scroll'));
  });
  const surface = await tab.locator('.song-canvas').boundingBox();
  const x =
    surface.x +
    220 +
    15.75 * 56 -
    (await tab.locator('.song-scroll').evaluate((n) => n.scrollLeft));
  await tab.mouse.move(x + 15, surface.y + 65);
  await tab.mouse.down();
  await tab.mouse.move(x + 15 + 42, surface.y + 65, { steps: 5 });
  await tab.mouse.up();
  ok(
    await tab.evaluate(
      () =>
        !testState.store.project.sequences[0].steps[0][63] &&
        !!testState.store.project.sequences[1].steps[0][2]
    ),
    'Real pointer move edits the next sequence'
  );
  await tab.evaluate(async () => {
    const h = await import('/audionaut-beta-pro/daw/js/history.js');
    h.undo();
  });
  ok(
    await tab.evaluate(
      () =>
        !!testState.store.project.sequences[0].steps[0][63] &&
        !testState.store.project.sequences[1].steps[0][2]
    ),
    'Undo restores both sides of boundary move'
  );
  await tab.evaluate(async () => {
    const h = await import('/audionaut-beta-pro/daw/js/history.js');
    h.redo();
  });
  ok(
    await tab.evaluate(() => !!testState.store.project.sequences[1].steps[0][2]),
    'Redo reapplies boundary move'
  );
  ok(
    await tab.evaluate(async () => {
      const p = await import('/audionaut-beta-pro/daw/js/persistence.js');
      const copy = p.prepareProject(p.exportProject());
      return !!copy.sequences[1].steps[0][2] && !copy.timeline.enabled;
    }),
    'Save/reopen retains edits without creating timeline clips'
  );
  await tab.setViewportSize({ width: 390, height: 844 });
  await tab.waitForTimeout(80);
  ok(
    await tab.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
    'Mobile view does not widen page'
  );
  await tab.setViewportSize({ width: 1400, height: 900 });
  await tab.getByRole('tab', { name: 'Patterns', exact: true }).click();
  await tab.getByRole('tab', { name: 'Timeline', exact: true }).click();
  await tab.waitForSelector('.song-canvas');
  ok((await tab.locator('.song-canvas').count()) === 1, 'View switches dispose old surface');
  if (process.env.SCREENSHOT_DIR) {
    await tab.evaluate(async () => {
      const { store, engine } = testState,
        { makeSequence } = await import('/audionaut-beta-pro/daw/js/state.js');
      store.project.projectName = 'Continuous waveform timeline';
      store.project.sequences = Array.from({ length: 8 }, () =>
        makeSequence(store.numChannels, store.project.instruments.length)
      );
      const ctx = engine.ensureContext();
      for (let ch = 0; ch < store.numChannels; ch++) {
        const b = ctx.createBuffer(1, Math.floor((0.2 + ch * 0.13) * 44100), 44100),
          a = b.getChannelData(0);
        for (let i = 0; i < a.length; i++)
          a[i] = Math.sin(i * (0.025 + ch * 0.012)) * Math.exp((-i / a.length) * 5) * 0.8;
        engine.setBuffer(ch, b);
        for (let seq = 0; seq < 8; seq++)
          for (let step = (ch + seq) % 8; step < 64; step += 8 + (ch % 4) * 4)
            store.project.sequences[seq].steps[ch][step] = 1;
      }
      store.emit('project', { prop: 'sequences' });
    });
    await tab.waitForTimeout(100);
    await tab.screenshot({ path: process.env.SCREENSHOT_DIR + '/unified-timeline.png' });
  }
  assert.deepEqual(
    logs.filter((x) => x.startsWith('pageerror:')),
    []
  );
  checks++;
  console.log(
    JSON.stringify({
      checks,
      browser: process.env.AUDIONAUT_TEST_BROWSER || 'chromium',
      projection: true,
      transport: true
    })
  );
} finally {
  await b?.close();
  await new Promise((r) => srv.close(r));
}
