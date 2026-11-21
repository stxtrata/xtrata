#!/usr/bin/env node
import assert from 'node:assert/strict';
import { serve, browser, page } from './serve.mjs';
const { srv, url } = await serve();
let b;
let uiChecks = 0;
const equal = (...args) => {
  assert.equal(...args);
  uiChecks++;
};
const same = (...args) => {
  assert.deepEqual(...args);
  uiChecks++;
};
try {
  b = await browser();
  const p = await page(b, url);
  await p.goto(url + '/audionaut-beta/tools/harness.html');
  const result = await p.evaluate(async () => {
    const S = await import('/audionaut-beta/daw/js/state.js'),
      P = await import('/audionaut-beta/daw/js/persistence.js'),
      B = await import('/audionaut-beta/daw/js/legacy-bridge/index.js'),
      A = await import('/audionaut-beta/daw/js/legacy-import-audio.js'),
      { engine } = await import('/audionaut-beta/daw/js/engine.js');
    let checks = 0;
    const ok = (test, message) => {
        if (!test) throw Error(message);
        checks++;
      },
      reject = async (fn, pattern) => {
        let error;
        try {
          await fn();
        } catch (e) {
          error = e;
        }
        ok(
          error && pattern.test(error.message),
          'Expected rejection ' + pattern + ', got ' + error?.message
        );
      };
    const id = 'a'.repeat(64) + 'i0',
      raw = {
        projectName: 'Synthetic legacy import',
        projectBPM: 120,
        channelURLs: ['/content/' + id, id],
        channelVolume: [2, 1],
        channelPlaybackSpeed: [9.03, 1],
        trimSettings: [{ start: 10, end: 70 }, {}],
        projectSequences: {
          Sequence0: { ch0: { steps: [1, { index: 64, reverse: true }] }, ch1: { steps: [1] } }
        }
      };
    const initial = S.makeProject();
    initial.projectName = 'Do not replace';
    S.store.loadProject(initial);
    const ctx = engine.ensureContext(),
      buffer = ctx.createBuffer(1, 441, 44100);
    engine.setBuffer(0, buffer);
    const first = await B.prepareLegacyImport(raw);
    ok(
      !first.requiresProfileChoice &&
        first.project?.legacyImport.profileId === 'audionals-editor-v1',
      'Sparse file automatically uses editor playback'
    );
    const converted = await B.prepareLegacyImport(raw, { profileId: 'audionals-editor-v1' });
    ok(converted.project && S.store.project === initial, 'Pure conversion never commits');
    const candidate = P.prepareProject(converted.project);
    ok(
      candidate.channels[0].volume === 2 && candidate.channels[0].pitch === 9.03,
      'Historical bounds survive normalization'
    );
    ok(
      candidate.sequences[0].steps[0][63].rev === true && candidate.channels[0].trimStart === 0.1,
      'Reverse and old trim aliases survive'
    );
    ok(
      !candidate.legacyImport.originalDocument,
      'Source document is not duplicated in saved instructions'
    );
    let calls = 0;
    const load = async () => {
      calls++;
      return { audioBuffer: buffer, sampleName: 'fixture' };
    };
    const staged = await A.prepareImportedAudio(candidate, { load });
    ok(calls === 1 && staged.results.size === 2, 'Duplicate inscription samples fetched once');
    ok(
      S.store.project === initial && engine.buffers[0] === buffer,
      'Staging retains current song and buffers'
    );
    await reject(() => A.commitImportedAudio(staged, { guard: () => false }), /project changed/);
    ok(S.store.project === initial, 'Stale commit rejected atomically');
    const failed = await A.prepareImportedAudio(candidate, {
      load: async () => {
        throw Error('Synthetic unavailable source');
      }
    });
    await reject(() => A.commitImportedAudio(failed), /Some samples/);
    ok(S.store.project === initial, 'Missing source never silently commits');
    let retries = 0;
    const retried = await A.prepareImportedAudio(candidate, {
      previous: staged,
      load: async () => {
        retries++;
        throw Error('should not fetch');
      }
    });
    ok(retries === 0 && retried.results.size === 2, 'Retry reuses successfully staged audio');
    const cancelled = new AbortController();
    cancelled.abort();
    await reject(
      () => A.prepareImportedAudio(candidate, { signal: cancelled.signal, load }),
      /abort|cancel/i
    );
    const limited = await A.prepareImportedAudio(candidate, { load, maxDecodedBytes: 1 });
    ok(
      limited.failures.length === 2 && S.store.project === initial,
      'Decoded budget failure preserves project'
    );
    A.commitImportedAudio(staged, { installAudio: true });
    ok(
      S.store.project === candidate && engine.buffers[1] === buffer,
      'Commit installs retained buffers'
    );
    const reopened = P.prepareProject(P.exportProject({ project: candidate }));
    ok(
      reopened.legacyPlayback.id === 'audionals-editor-v1' &&
        reopened.channels[0].pitch === 9.03 &&
        reopened.legacyImport.sourceHash === candidate.legacyImport.sourceHash,
      'Native save/reopen preserves compatibility profile and provenance'
    );
    await reject(
      () =>
        P.prepareProject({
          ...reopened,
          legacyPlayback: { version: 99, id: 'audionals-editor-v1' }
        }),
      /profile/
    );
    await reject(
      () =>
        P.prepareProject({
          ...reopened,
          legacyImport: { ...reopened.legacyImport, originalDocument: raw }
        }),
      /provenance/
    );
    for (const point of [0.5, 1]) {
      const silent = JSON.parse(P.exportProject({ project: candidate }));
      silent.channels[0].trimStart = point;
      silent.channels[0].trimEnd = point;
      silent.sequences[0].steps[0][0] = { v: 1, trimStart: point, trimEnd: point };
      const exact = P.prepareProject(P.exportProject({ project: P.prepareProject(silent) }));
      ok(
        exact.channels[0].trimStart === point &&
          exact.channels[0].trimEnd === point &&
          exact.sequences[0].steps[0][0].trimStart === point &&
          exact.sequences[0].steps[0][0].trimEnd === point,
        'Historical silent trim stays exact after save/reopen'
      );
    }
    const bad = structuredClone(reopened);
    bad.format = 'audionaut-workstation/3';
    bad.channels[0].pitch = 101;
    await reject(() => P.prepareProject(bad), /playback rate/);
    const missingProject = P.prepareProject(converted.project),
      missingStage = await A.prepareImportedAudio(missingProject, {
        load: async () => {
          throw Error('unavailable');
        }
      });
    A.commitImportedAudio(missingStage, { allowMissing: true, installAudio: true });
    ok(
      missingProject.channels[0].source.value === id &&
        missingProject.channels[0].unresolvedSource &&
        missingProject.sequences[0].steps[0][63].rev,
      'Explicit incomplete import retains sources and events'
    );
    S.store.loadProject(initial);
    engine.setBuffer(0, buffer);
    const { openProjectFile } = await import('/audionaut-beta/daw/js/legacy-import-ui.js');
    await reject(
      () =>
        openProjectFile(
          new File(
            [
              JSON.stringify({
                format: 'audionaut-chain-song/1',
                manifest: { runtime: { version: 'unknown' } }
              })
            ],
            'chain.json'
          )
        ),
      /different AudioNaut runtime/
    );
    const standalone = await B.prepareLegacyImport(raw, { profileId: 'audionals-standalone-v1' });
    await openProjectFile(
      new File(
        [P.exportProject({ project: P.prepareProject(standalone.project) })],
        'saved-standalone.json'
      )
    );
    ok(
      S.store.project.legacyPlayback.id === 'audionals-standalone-v1' &&
        !S.store.project.sequences[0].steps[0][0] &&
        S.store.project.sequences[0].steps[0][1] &&
        !S.store.project.sequences[0].steps[0][63],
      'Native file reopening preserves the saved standalone profile and event positions'
    );
    ok(
      !document.querySelector('#legacy-import-dialog'),
      'Native files reopen without legacy choices'
    );
    S.store.loadProject(initial);
    engine.setBuffer(0, buffer);
    globalThis.legacyUITest = { S, P, A, raw, initial, openProjectFile };
    return { checks };
  });
  // Opening starts immediately. Hold sample reads to prove cancellation works
  // during automatic loading, without any profile choice or second open click.
  await p.evaluate(() => {
    legacyUITest.originalFetch = globalThis.fetch;
    globalThis.fetch = (_url, { signal } = {}) =>
      new Promise((_resolve, reject) => {
        legacyUITest.readStarted = true;
        const abort = () => reject(new DOMException('Cancelled', 'AbortError'));
        if (signal?.aborted) abort();
        else signal?.addEventListener('abort', abort, { once: true });
      });
    legacyUITest.pending = legacyUITest.openProjectFile(
      new File([JSON.stringify(legacyUITest.raw)], 'old.json')
    );
  });
  await p.locator('#legacy-import-dialog').waitFor();
  await p.waitForFunction(() => legacyUITest.readStarted);
  equal(await p.getByRole('combobox', { name: 'Historical player' }).isVisible(), false);
  equal(await p.locator('#legacy-import-open').isVisible(), false);
  await p.getByRole('button', { name: 'Cancel', exact: true }).click();
  equal(await p.evaluate(async () => await legacyUITest.pending), false);
  equal(await p.evaluate(() => legacyUITest.S.store.project === legacyUITest.initial), true);
  await p.evaluate(() => {
    globalThis.fetch = legacyUITest.originalFetch;
    legacyUITest.pending = legacyUITest.openProjectFile(
      new File([JSON.stringify(legacyUITest.raw)], 'old.json')
    );
  });
  await p.locator('#legacy-import-missing').waitFor({ state: 'visible' });
  equal(await p.evaluate(() => legacyUITest.S.store.project === legacyUITest.initial), true);
  equal(await p.getByRole('combobox', { name: 'Historical player' }).isVisible(), false);
  // A rare historical override stays available in collapsed advanced settings.
  await p.getByText('Advanced playback settings', { exact: true }).click();
  await p
    .getByRole('combobox', { name: 'Historical player' })
    .selectOption('audionals-standalone-v1');
  await p.locator('#legacy-import-missing').waitFor({ state: 'visible' });
  equal(
    await p.getByRole('combobox', { name: 'Historical player' }).inputValue(),
    'audionals-standalone-v1'
  );
  equal(await p.evaluate(() => legacyUITest.S.store.project === legacyUITest.initial), true);
  await p.getByRole('button', { name: 'Cancel', exact: true }).click();
  await p.evaluate(() => legacyUITest.pending);
  const logs = [],
    editor = await page(b, url, { logs });
  await editor.addInitScript(() =>
    localStorage.setItem(
      'audionaut.beta.v0.2.project',
      JSON.stringify({
        format: 'audionaut-workstation/2',
        projectName: 'Bridge initial',
        channels: [{}],
        sequences: [{ steps: [Array(64).fill(0)], notes: [[], [], [], []] }]
      })
    )
  );
  await editor.goto(url + '/audionaut-beta/daw.html');
  await editor.waitForFunction(
    () => document.querySelector('#project-name')?.value === 'Bridge initial'
  );
  const wav = Buffer.alloc(44 + 441 * 2);
  wav.write('RIFF');
  wav.writeUInt32LE(wav.length - 8, 4);
  wav.write('WAVEfmt ', 8);
  wav.writeUInt32LE(16, 16);
  wav.writeUInt16LE(1, 20);
  wav.writeUInt16LE(1, 22);
  wav.writeUInt32LE(44100, 24);
  wav.writeUInt32LE(88200, 28);
  wav.writeUInt16LE(2, 32);
  wav.writeUInt16LE(16, 34);
  wav.write('data', 36);
  wav.writeUInt32LE(wav.length - 44, 40);
  for (let i = 0; i < 441; i++) wav.writeInt16LE(Math.round(10000 * Math.sin(i * 0.1)), 44 + i * 2);
  const raw = {
    projectName: 'Full editor legacy fixture',
    projectBPM: 120,
    channelURLs: ['data:audio/wav;base64,' + wav.toString('base64')],
    channelVolume: [2],
    channelPlaybackSpeed: [9.03],
    projectChannelNames: ['a'.repeat(64) + 'i0'],
    projectSequences: { Sequence0: { ch0: { steps: [1, { index: 64, reverse: true }] } } }
  };
  await editor.locator('#file-input').setInputFiles({
    name: 'old-sequencer.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(raw))
  });
  await editor.waitForFunction(
    () => document.querySelector('#project-name')?.value === 'Full editor legacy fixture'
  );
  await editor
    .locator('#legacy-import-dialog')
    .waitFor({ state: 'detached' })
    .catch(async (error) => {
      throw new Error(
        error.message +
          ' ' +
          JSON.stringify({
            dialog: await editor.locator('#legacy-import-dialog').innerText(),
            logs
          })
      );
    });
  const loaded = await editor.evaluate(async () => {
    const { store } = await import('/audionaut-beta/daw/js/state.js'),
      { engine } = await import('/audionaut-beta/daw/js/engine.js');
    return {
      name: store.project.projectName,
      instruments: store.project.instruments.length,
      frames: engine.buffers[0]?.length,
      pitch: store.channel(0).pitch,
      reverse: store.project.sequences[0].steps[0][63].rev,
      profile: store.project.legacyImport.profileId,
      sampleName: store.channel(0).sampleName
    };
  });
  same(loaded, {
    name: raw.projectName,
    instruments: 0,
    frames: 441,
    pitch: 9.03,
    reverse: true,
    profile: 'audionals-editor-v1',
    sampleName: 'a'.repeat(64) + 'i0'
  });
  equal(await editor.locator('.ch-vol').first().inputValue(), '2');
  equal(await editor.locator('.ch-pitch').first().getAttribute('max'), '100');
  same(
    logs.filter((log) => log.startsWith('pageerror:')),
    []
  );
  console.log(
    JSON.stringify({
      checks: result.checks + uiChecks,
      browser: process.env.AUDIONAUT_TEST_BROWSER || 'chromium',
      atomicImport: true,
      dialog: true,
      fullEditor: true
    })
  );
} finally {
  await b?.close();
  srv.close();
}
