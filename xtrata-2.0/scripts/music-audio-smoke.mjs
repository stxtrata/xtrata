/* global building, PLAYER, META */
import { chromium } from 'playwright';
import { readFile, mkdir } from 'node:fs/promises';
import { strict as assert } from 'node:assert';
const base = process.argv.find((a) => a.startsWith('https://')) || 'https://music-real.test';
const live = base !== 'https://music-real.test',
  root = new URL('../', import.meta.url);
const b = await chromium.launch({ headless: true, channel: 'chrome' });
const p = await b.newPage({ viewport: { width: 1280, height: 1000 } });
const errors = [];
p.on('pageerror', (e) => errors.push(e.message));
p.on('console', (m) => {
  if (m.type() === 'error') console.log('browser:', m.text().slice(0, 180));
});
try {
  if (!live)
    await p.route('https://music-real.test/**', async (r) => {
      let u = new URL(r.request().url()),
        path = u.pathname;
      try {
        let f =
          path === '/music/'
            ? 'music/index.html'
            : path.startsWith('/wizard/')
              ? 'xtrata-agent-one' + path
              : 'public' + path;
        return r.fulfill({
          body: await readFile(new URL(f, root)),
          contentType: path.endsWith('.js')
            ? 'application/javascript'
            : path.endsWith('.css')
              ? 'text/css'
              : path.endsWith('.svg')
                ? 'image/svg+xml'
                : 'text/html'
        });
      } catch {
        return r.fulfill({ status: 404, body: '' });
      }
    });
  // No actual wallet or inscription: read-only production quote on deployed tests, mock quotes locally.
  await p.addInitScript(() => {
    window.XtrataWizardFunding = {
      getAddress: () => null,
      connect: async () => null,
      pay: async () => {
        throw Error('No payments authorised');
      }
    };
  });
  await p.goto(base + '/music/' + (live ? '' : '?mock=1'));
  await p.waitForSelector('#musicFormat');
  // Real PCM WAV, two seconds. Generated only in memory, never committed.
  const n = 44100 * 2,
    buf = Buffer.alloc(44 + n * 2);
  buf.write('RIFF');
  buf.writeUInt32LE(buf.length - 8, 4);
  buf.write('WAVEfmt ', 8);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(44100, 24);
  buf.writeUInt32LE(88200, 28);
  buf.writeUInt16LE(2, 32);
  buf.writeUInt16LE(16, 34);
  buf.write('data', 36);
  buf.writeUInt32LE(n * 2, 40);
  for (let i = 0; i < n; i++)
    buf.writeInt16LE(Math.round(3000 * Math.sin((2 * Math.PI * 440 * i) / 44100)), 44 + i * 2);
  assert.equal(await p.locator('#musicQuality').inputValue(), 'optimised');
  await p.locator('#musicQuality').selectOption('original');
  await p.locator('#musicFormat').selectOption('audio');
  await p
    .locator('#picker')
    .setInputFiles({ name: 'untagged-tone.wav', mimeType: 'audio/wav', buffer: buf });
  await p.waitForFunction(() => !building && !!PLAYER, {}, { timeout: 180000 });
  console.log('Original WAV prepared');
  assert.equal(await p.locator('#musicPrepProgress').getAttribute('value'), '100');
  assert((await p.locator('#musicDiagnosticLog').textContent()).includes('engine-ready'));
  assert.equal(await p.evaluate(() => PLAYER.size), buf.length);
  assert.equal(await p.evaluate(() => META.artist), '');
  const bytes = await p.evaluate(async () =>
    Array.from(new Uint8Array(await PLAYER.arrayBuffer()))
  );
  assert.deepEqual(Buffer.from(bytes), buf);
  await p.waitForFunction(() => document.querySelector('#previewFrame').contentWindow != null);
  await p.locator('#musicQuality').selectOption('optimised');
  await p.waitForFunction(
    () => !building && META?.quality === 'optimised',
    {},
    { timeout: 180000 }
  );
  assert((await p.evaluate(() => PLAYER.size)) < buf.length);
  const size96 = await p.evaluate(() => PLAYER.size);
  for (const [quality, bitrate] of [
    ['high', 128],
    ['premium', 160]
  ]) {
    await p.locator('#musicQuality').selectOption(quality);
    await p.waitForFunction((q) => !building && META?.quality === q, quality, { timeout: 180000 });
    assert.equal(await p.evaluate(() => META.audioLabel), `Opus ${bitrate} kbps VBR`);
    assert((await p.evaluate(() => PLAYER.size)) > size96);
  }
  await p.locator('#musicQuality').selectOption('compact');
  await p.waitForFunction(() => !building && META?.quality === 'compact', {}, { timeout: 180000 });
  assert.equal(await p.evaluate(() => META.audioLabel), 'Opus 48 kbps VBR');
  assert((await p.evaluate(() => PLAYER.size)) < size96);
  await p.locator('#musicFormat').selectOption('details');
  await p.waitForFunction(() => !building && META?.format === 'details', {}, { timeout: 180000 });
  await p.locator('#musicStyleControls [data-option="timeline"]').selectOption('waveform');
  await p.waitForFunction(
    () => !building && META.appearance.timeline === 'waveform',
    {},
    { timeout: 30000 }
  );
  const frame = p.frames().find((f) => f !== p.mainFrame());
  await frame.waitForSelector('#timeline svg');
  assert((await frame.locator('#timeline rect').count()) > 0);

  await frame.waitForSelector('audio', { state: 'attached' });
  const playable = await frame.evaluate(async () => {
    let a = document.querySelector('audio');
    await a.play();
    return !a.paused;
  });
  assert(playable);
  console.log(
    'Player bounds',
    await frame.evaluate(() => {
      const e = document.querySelector('.player');
      const r = e.getBoundingClientRect();
      return {
        width: r.width,
        height: r.height,
        body: document.body.getBoundingClientRect().height
      };
    })
  );
  await p.locator('#previewFrame').scrollIntoViewIfNeeded();
  await p.locator('#previewFrame').screenshot({ path: '/tmp/xtrata-music-qa/player.png' });
  console.log('Optimised player plays');
  await mkdir('/tmp/xtrata-music-qa', { recursive: true });
  await p.screenshot({ path: '/tmp/xtrata-music-qa/real-audio-desktop.png', fullPage: true });
  await p.locator('#musicQuality').selectOption('original');
  await p.waitForFunction(() => !building && META?.quality === 'original', {}, { timeout: 180000 });
  await p.locator('#picker').setInputFiles({
    name: 'corrupt.wav',
    mimeType: 'audio/wav',
    buffer: Buffer.from('not audio')
  });
  await p.waitForFunction(() => !building, {}, { timeout: 180000 });
  assert(await p.locator('#go').isDisabled());
  assert.equal(await p.evaluate(() => PLAYER), null);
  assert.deepEqual(errors, []);
  console.log(
    JSON.stringify(
      {
        passed: true,
        base,
        checks: [
          'real FFmpeg original WAV byte equality',
          'untagged metadata',
          'real 48, 96, 128 and 160 kbps Opus conversion with smaller 48 kbps output',
          'embedded audio playback and precomputed real waveform',
          'original package rebuild',
          'corrupt audio rejection',
          'no page errors'
        ]
      },
      null,
      2
    )
  );
} catch (e) {
  console.log(
    'STATE',
    await p.locator('#hint').innerText(),
    await p.locator('#editHint').innerText()
  );
  throw e;
} finally {
  await b.close();
}
