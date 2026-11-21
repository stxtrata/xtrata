import assert from 'node:assert/strict';
import { serve, browser, page } from './serve.mjs';
const { srv, url } = await serve(),
  b = await browser(),
  logs = [];
const watchdog = setTimeout(() => {
  console.error('Device integration timed out', logs);
  process.exit(1);
}, 120000);
try {
  const p = await page(b, url, { logs });
  await p.goto(url + '/audionaut-beta/daw.html');
  await p.waitForSelector('#pro-workspace-nav');
  await p.evaluate(async () => {
    const { store, makeProject } = await import('/audionaut-beta/daw/js/state.js');
    store.loadProject(makeProject());
  });
  await p.getByRole('tab', { name: 'New instruments', exact: true }).click();
  for (const name of ['Drum Rack', 'Sample Granulator', 'Concert Piano'])
    await p.getByRole('button', { name: '+ ' + name, exact: true }).click();
  await p
    .getByLabel('Instrument', { exact: true })
    .selectOption({
      label: (
        await p.getByLabel('Instrument', { exact: true }).locator('option').allTextContents()
      ).find((t) => t.includes('Drum Rack'))
    });
  await p.getByText('Edit pad samples and controls', { exact: true }).click();
  const gains = p.locator('.pro-pad-grid').getByLabel('Gain', { exact: true });
  await gains.first().fill('0.5');
  await gains.first().dispatchEvent('change');
  await gains.first().fill('0.7');
  await gains.first().dispatchEvent('change');
  const pan = p.locator('.pro-pad-grid').getByLabel('Pan', { exact: true }).first();
  await pan.fill('-0.4');
  await pan.dispatchEvent('change');
  const result = await p.evaluate(async () => {
    const base = '/audionaut-beta/daw/js/',
      { store } = await import(base + 'state.js'),
      { engine } = await import(base + 'engine.js'),
      { exportProjectAsync, importProject } = await import(base + 'persistence.js'),
      { registerAudioBuffer } = await import(base + 'assets.js'),
      { loadSample } = await import(base + 'loader.js'),
      { renderMix } = await import(base + 'render-mix.js'),
      { makeSlot } = await import(base + 'plugins.js'),
      { createSamplerVoice } = await import(base + 'sampler-voice.js');
    const rack = store.project.instruments.find((t) => t.synthId === 'drumrack');
    const edit = [rack.sampleInstrument.pads[0].gain, rack.sampleInstrument.pads[0].pan];
    const ctx = engine.ensureContext(),
      buffer = ctx.createBuffer(1, 2400, 48000);
    for (let i = 0; i < buffer.length; i++)
      buffer.getChannelData(0)[i] =
        Math.sin((i * 2 * Math.PI * 220) / 48000) * 0.4 * Math.exp(-i / 700);
    await loadSample(0, await registerAudioBuffer(buffer));
    rack.sampleInstrument.sources = [{ id: 'kick', sourceTrackId: store.channel(0).id }];
    rack.sampleInstrument.pads[0].sourceId = 'kick';
    const piano = store.project.instruments.find((t) => t.synthId === 'concertpiano');
    piano.sampleInstrument = {
      version: 1,
      kind: 'concertpiano',
      sources: [{ id: 'piano', sourceTrackId: store.channel(0).id }],
      zones: [
        {
          id: 'zone',
          sourceId: 'piano',
          rootMidi: 60,
          lowMidi: 0,
          highMidi: 127,
          lowVelocity: 1,
          highVelocity: 127,
          gain: 1
        }
      ]
    };
    const grain = store.project.instruments.find((t) => t.synthId === 'granulator');
    grain.sampleInstrument = {
      version: 1,
      kind: 'granulator',
      sourceId: 'grain',
      sources: [{ id: 'grain', sourceTrackId: store.channel(0).id }],
      rootMidi: 60
    };
    store.project.timeline.enabled = true;
    store.project.timeline.lengthBeats = 1;
    store.project.timeline.clips = [rack, piano, grain].map((t, i) => ({
      id: 'clip' + i,
      type: 'midi',
      trackId: t.id,
      start: 0,
      duration: 1,
      offset: 0,
      gain: 1,
      notes: [{ step: 0, dur: 1, pitch: i === 0 ? 36 : 60, vel: 0.8 }]
    }));
    const hybrid = makeSlot('hybridReverb', { mix: 0.2 });
    hybrid.irSource = { sourceTrackId: store.channel(0).id };
    piano.fx = [hybrid];
    store.project.master.inserts = [makeSlot('dynamicEq'), makeSlot('masteringLimiter')];
    const json = await exportProjectAsync(),
      project = importProject(json);
    const wav = await renderMix(
      project,
      engine.buffers.map((b, i) => (i === 0 ? buffer : b)),
      { scope: 'song', tail: 0.25, sampleRate: 48000, bitDepth: 'float32' }
    );
    const rendered = await ctx.decodeAudioData(await wav.arrayBuffer());
    let peak = 0;
    for (const v of rendered.getChannelData(0)) peak = Math.max(peak, Math.abs(v));
    let oldZonePeak = 0;
    const offline = new OfflineAudioContext(1, 4800, 48000),
      sample = offline.createBuffer(1, 2400, 48000);
    sample.getChannelData(0).fill(0.2);
    createSamplerVoice(
      offline,
      offline.destination,
      {
        attack: 0.001,
        release: 0.01,
        zones: [{ sourceTrackId: 'sample', lowVelocity: 0, highVelocity: 1 }]
      },
      { pitch: 60, vel: 0.8, time: 0, dur: 0.03 },
      () => sample
    );
    for (const v of (await offline.startRendering()).getChannelData(0))
      oldZonePeak = Math.max(oldZonePeak, Math.abs(v));
    const bad = JSON.parse(json);
    bad.instruments.find(
      (t) => t.synthId === 'drumrack'
    ).sampleInstrument.sources[0].sourceTrackId = 'missing';
    const before = store.project;
    let rejected = false;
    try {
      importProject(bad);
    } catch {
      rejected = store.project === before;
    }
    return {
      edit,
      peak,
      oldZonePeak,
      rejected,
      pianoZone: project.instruments.find((t) => t.synthId === 'concertpiano').sampleInstrument
        .zones.length,
      ir: project.instruments.find((t) => t.synthId === 'concertpiano').fx[0].irSource,
      sourceId: project.channels[0].id
    };
  });
  assert.deepEqual(result.edit, [0.7, -0.4]);
  assert.ok(result.peak > 0.01 && result.peak < 1, result.peak);
  assert.ok(result.oldZonePeak > 0.1);
  assert.equal(result.rejected, true);
  assert.equal(result.pianoZone, 1);
  assert.equal(result.ir.sourceTrackId, result.sourceId);
  await p.getByRole('tab', { name: 'On-chain publishing', exact: true }).click();
  await p.getByRole('button', { name: 'Prepare dependencies', exact: true }).waitFor();
  await p.setViewportSize({ width: 390, height: 844 });
  await p.getByRole('tab', { name: 'New instruments', exact: true }).click();
  assert.equal(
    await p.evaluate(() => document.documentElement.scrollWidth > innerWidth + 2),
    false
  );
  assert.equal(logs.filter((s) => s.startsWith('pageerror:')).length, 0, logs.join('\n'));
  console.log(
    'PASS device UI repeated edits, 3 imported-sample instruments + 3 effects mix/export, roundtrip, legacy normalized velocity, missing-source rejection and mobile layout',
    result
  );
  await p.close();
} finally {
  clearTimeout(watchdog);
  await b.close();
  await new Promise((r) => srv.close(r));
}
