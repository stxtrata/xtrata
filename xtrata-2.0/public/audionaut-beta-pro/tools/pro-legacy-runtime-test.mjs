#!/usr/bin/env node
// A cold, self-contained runtime with only simulated Bitcoin content responses.
// Website modules, CDNs, wallets and Stacks RPC are unavailable in this test.
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { browser } from './serve.mjs';
const b = await browser(),
  requests = [],
  unexpected = [],
  errors = [];
const id = 'a'.repeat(64) + 'i0',
  other = 'b'.repeat(64) + 'i0';
const wav = Buffer.alloc(44 + 2205 * 2);
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
for (let i = 0; i < 2205; i++)
  wav.writeInt16LE(Math.round(12000 * Math.sin((i * 2 * Math.PI * 220) / 44100)), 44 + i * 2);
try {
  const context = await b.newContext();
  await context.route('**/*', (route) => {
    const target = new URL(route.request().url());
    if (target.protocol === 'file:' || target.protocol === 'blob:' || target.protocol === 'data:')
      return route.continue();
    if (target.origin === 'https://ordinals.com' && target.pathname === '/content/' + id) {
      requests.push(target.href);
      return route.fulfill({
        body: wav,
        contentType: 'audio/wav',
        headers: { 'access-control-allow-origin': '*' }
      });
    }
    if (target.origin === 'https://ordinals.com' && target.pathname === '/content/' + other) {
      requests.push(target.href);
      return route.fulfill({
        status: 404,
        body: 'Synthetic missing inscription',
        headers: { 'access-control-allow-origin': '*' }
      });
    }
    unexpected.push(target.href);
    return route.abort();
  });
  const p = await context.newPage();
  p.on('pageerror', (error) => errors.push(error.message));
  await p.goto('file://' + fileURLToPath(new URL('../chain-runtime/player.html', import.meta.url)));
  await p.waitForFunction(() => !!globalThis.AudioNautChainPlayer);
  const result = await p.evaluate(
    async ({ id, other }) => {
      const player = AudioNautChainPlayer,
        initial = player.store.project;
      let checks = 0;
      const ok = (v, m) => {
          if (!v) throw Error(m);
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
            'Expected ' + pattern + ', got ' + error?.message
          );
        };
      const song = {
        projectName: 'Cold Bitcoin fixture',
        projectBPM: 120,
        channelURLs: [id],
        channelVolume: [2],
        channelPlaybackSpeed: [0.5],
        trimSettings: [{ startSliderValue: 10, endSliderValue: 60 }],
        projectSequences: { Sequence0: { ch0: { steps: [1, '64r'] } } }
      };
      const report = await player.openLegacySong(song);
      ok(player.store.project !== initial, 'Automatic legacy load commits without a player choice');
      ok(
        report.profileId === 'audionals-editor-v1',
        'Ambiguous sparse input defaults to editor playback'
      );
      ok(
        report.canImport && player.store.project.legacyPlayback.id === 'audionals-editor-v1',
        'Legacy bridge bundled in cold runtime'
      );
      ok(
        player.store.project.channels[0].source.type === 'ordinal' &&
          player.store.project.channels[0].source.value === id,
        'Original Bitcoin identity retained'
      );
      ok(
        player.engine.buffers[0]?.length === 2205,
        'Original audio decoded without website modules'
      );
      ok(player.store.project.sequences[0].steps[0][63].rev, 'Reverse event retained');
      await player.openLegacySong(song, { profileId: 'audionals-standalone-v1' });
      ok(
        player.store.project.legacyPlayback.id === 'audionals-standalone-v1',
        'Explicit standalone override retained'
      );
      ok(
        !player.store.project.sequences[0].steps[0][0] &&
          player.store.project.sequences[0].steps[0][1] &&
          !player.store.project.sequences[0].steps[0][63],
        'Standalone override keeps zero-based steps and inactive64'
      );
      const dense = {
        ...song,
        projectName: 'Detected boolean grid',
        projectSequences: {
          Sequence0: { ch0: { steps: Array.from({ length: 64 }, (_, i) => i === 0 || i === 63) } }
        }
      };
      await player.openLegacySong(dense);
      ok(
        player.store.project.legacyImport.profileId === 'audionals-dense-v1' &&
          player.store.project.sequences[0].steps[0][0] &&
          player.store.project.sequences[0].steps[0][63],
        'Dense input automatically retains its positional decoding'
      );
      const saved = player.store.project;
      song.channelURLs = [other];
      await reject(
        () => player.openLegacySong(song, { profileId: 'audionals-editor-v1' }),
        /unavailable/
      );
      ok(player.store.project === saved, 'Unavailable Bitcoin sample retains previous song');
      song.channelURLs = ['https://unbound.invalid/sample.wav'];
      await reject(
        () => player.openLegacySong(song, { profileId: 'audionals-editor-v1' }),
        /Bitcoin inscription/
      );
      await reject(
        () =>
          player.openSong({
            format: 'audionaut-chain-song/1',
            manifest: { runtime: { version: 'wrong-runtime' } }
          }),
        /different inscribed/
      );
      // Exercise the embedded decoding worker as well as the small-file path.
      const large = { ...song, channelURLs: [id], projectName: 'Large JSON worker fixture' };
      const bytes = new TextEncoder().encode(JSON.stringify(large) + ' '.repeat(270000));
      await player.openLegacySong(bytes);
      ok(
        player.store.project.channels[0].source.value === id,
        'Large legacy decode uses bundled worker'
      );
      return { checks, version: player.version };
    },
    { id, other }
  );
  // Exercise the normal downloaded player's file picker, not just its JS API.
  assert.equal(await p.locator('#advanced-playback').getAttribute('open'), null);
  assert.equal(await p.locator('#legacy-profile').isVisible(), false);
  assert.equal(await p.locator('#legacy-profile').inputValue(), '');
  assert.equal(result.version, 'beta-pro-shared-audio-1');
  const fileSong = {
    projectName: 'Automatic file fixture',
    projectBPM: 120,
    channelURLs: [id],
    channelVolume: [2],
    channelPlaybackSpeed: [0.5],
    trimSettings: [{ startSliderValue: 10, endSliderValue: 60 }],
    projectSequences: { Sequence0: { ch0: { steps: [1, '64r'] } } }
  };
  await p
    .locator('#song')
    .setInputFiles({
      name: 'automatic.audx',
      mimeType: 'application/json',
      buffer: Buffer.from(JSON.stringify(fileSong))
    });
  await p.waitForFunction(
    () =>
      AudioNautChainPlayer.store.project.projectName === 'Automatic file fixture' &&
      !document.querySelector('#play').disabled
  );
  assert.equal(
    await p.evaluate(() => AudioNautChainPlayer.store.project.legacyPlayback.id),
    'audionals-editor-v1'
  );
  assert.equal(await p.locator('#advanced-playback').getAttribute('open'), null);
  await p.getByText('Advanced playback', { exact: true }).click();
  await p.locator('#legacy-profile').selectOption('audionals-standalone-v1');
  await p
    .locator('#song')
    .setInputFiles({
      name: 'override.audx',
      mimeType: 'application/json',
      buffer: Buffer.from(JSON.stringify({ ...fileSong, projectName: 'Explicit file override' }))
    });
  await p.waitForFunction(
    () =>
      AudioNautChainPlayer.store.project.projectName === 'Explicit file override' &&
      !document.querySelector('#play').disabled
  );
  const override = await p.evaluate(() => ({
    profile: AudioNautChainPlayer.store.project.legacyPlayback.id,
    first: AudioNautChainPlayer.store.project.sequences[0].steps[0][0],
    second: AudioNautChainPlayer.store.project.sequences[0].steps[0][1]
  }));
  assert.deepEqual(override, { profile: 'audionals-standalone-v1', first: 0, second: 1 });
  result.checks += 7;
  // A user gesture is required by some engines even in a local downloaded file.
  await p.getByRole('button', { name: 'Play', exact: true }).click();
  await p.waitForFunction(() => AudioNautChainPlayer.engine.isPlaying);
  await p.getByRole('button', { name: 'Stop', exact: true }).click();
  assert.deepEqual(unexpected, []);
  assert.deepEqual(errors, []);
  assert.ok(requests.length >= 2);
  console.log(
    JSON.stringify({
      ...result,
      browser: process.env.AUDIONAUT_TEST_BROWSER || 'chromium',
      bitcoinReads: requests.length,
      websiteReads: unexpected.length,
      coldPlayback: true
    })
  );
} finally {
  await b.close();
}
