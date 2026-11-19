import assert from 'node:assert/strict';
import { serve, browser, page } from './serve.mjs';
import { makeProject } from '../daw/js/state.js';
import { inspectPcmWav } from '../daw/js/pcm-wav.js';
// Synthetic PCM wrapper fixtures; no user audio is stored in Git.
const wav = Buffer.alloc(44 + 800 * 2);
wav.write('RIFF');
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
wav.writeUInt32LE(1600, 40);
for (let i = 0; i < 800; i++)
  wav.writeInt16LE(Math.round(Math.sin((i * 2 * Math.PI * 220) / 8000) * 12000), 44 + i * 2);
const ab = wav.buffer.slice(wav.byteOffset, wav.byteOffset + wav.byteLength);
const unusual = ab.slice(0);
new DataView(unusual).setUint32(24, 4000, true);
new DataView(unusual).setUint32(28, 8000, true);
assert.throws(
  () => inspectPcmWav(unusual),
  (e) => e.code === 'UNSUPPORTED_PCM_LAYOUT'
);
assert.throws(() => inspectPcmWav(ab.slice(0, -1)), /truncated/);
const data = 'data:audio/wav;base64,' + wav.toString('base64'),
  id = (n) => n.toString(16).padStart(64, 'a') + 'i0';
const cases = [
  ['audio/wav', wav],
  ['text/html', `<!doctype html><title>OB1 fixture</title><audio src="${data}"></audio>`],
  ['text/html', `<html><script>const sample='${data}';</script></html>`],
  ...['audioData', 'audioData_base64', 'base64'].map((key) => [
    'application/json',
    JSON.stringify({ [key]: wav.toString('base64') })
  ]),
  ['application/json', JSON.stringify({ audio: { data }, name: 'Nested JSON' })],
  ['application/octet-stream', `<audio><source src="${data}"></audio>`],
  ['text/html', `<audio src="${data.replace(/(.{80})/g, '$1\n')}"></audio>`]
];
const { srv, url } = await serve();
let b;
try {
  b = await browser();
  const logs = [],
    p = await page(b, url, { logs });
  await p.addInitScript(
    (q) =>
      localStorage.setItem(
        'audionaut.beta-pro.v0.2.project',
        JSON.stringify({ ...q, format: 'audionaut-workstation/3' })
      ),
    makeProject()
  );
  const requests = [];

  await p.route(url + '/content/**', (route) => {
    const n = cases.findIndex((_, i) =>
      route
        .request()
        .url()
        .endsWith(id(i + 1))
    );
    requests.push(route.request().url());
    if (n < 0) return route.fulfill({ status: 404, body: 'missing' });
    const [contentType, body] = cases[n];
    return route.fulfill({ contentType, body });
  });
  await p.route(url + '/broken/**', (r) => r.fulfill({ status: 503, body: 'gateway unavailable' }));
  await p.goto(url + '/audionaut-beta-pro/daw.html');
  await p.waitForSelector('#pro-workspace-nav');
  await p.click('#btn-play');
  await p.waitForFunction(async () => {
    const { engine } = await import('/audionaut-beta-pro/daw/js/engine.js');
    return engine.ctx?.state === 'running';
  });
  await p.click('#btn-stop');
  const result = await p.evaluate(
    async ({ url, ids, bytes, unusual, realNative }) => {
      const base = '/audionaut-beta-pro/daw/js/',
        { store, makeProject } = await import(base + 'state.js'),
        loader = await import(base + 'loader.js'),
        catalogue = await import(base + 'catalogue-retrieval.js'),
        { prepareImportedAudio } = await import(base + 'legacy-import-audio.js'),
        { decodeAudioBytes } = await import(base + 'audio-decode.js'),
        { engine } = await import(base + 'engine.js');
      store.settings.ordinalsGateway = url + '/broken/';
      store.settings.ordinalsFallbacks = [url + '/content/'];
      let checks = 0;
      const ok = (v, m) => {
        if (!v) throw Error(m);
        checks++;
      };
      for (const value of ids) {
        const source = { type: 'ordinal', value },
          direct = await loader.fetchAndDecode(source),
          sample = await catalogue.fetchCatalogueAudio(source);
        ok(
          direct.audioBuffer.duration > 0.09 && direct.audioBuffer.duration < 0.11,
          'direct duration'
        );
        ok(sample.audioBuffer.length === direct.audioBuffer.length, 'catalogue shares decode');
        const a = direct.audioBuffer.getChannelData(0),
          b = sample.audioBuffer.getChannelData(0);
        ok(
          a.every((v, i) => Math.abs(v - b[i]) < 1e-6),
          'PCM parity'
        );
      }
      const project = makeProject();
      project.channels.forEach((c) => (c.source = null));
      ids.forEach((value, i) => (project.channels[i].source = { type: 'ordinal', value }));
      project.sequences[0].steps.forEach((row) => row.fill(0));
      const staged = await prepareImportedAudio(project);
      ok(
        !staged.failures.length && staged.results.size === ids.length,
        'transactional importer shares all cases'
      );
      const raw = new Uint8Array(bytes).buffer;
      const odd = new Uint8Array(unusual).buffer;
      let fallbackCalls = 0;
      const sentinel = engine.ensureContext().createBuffer(1, 800, 8000);
      const fallback = await decodeAudioBytes(
        {
          decodeAudioData(input) {
            fallbackCalls++;
            ok(input.byteLength === odd.byteLength, 'fallback receives original bytes');
            return Promise.resolve(sentinel);
          }
        },
        odd
      );
      ok(
        fallback === sentinel && fallbackCalls === 1,
        'unsupported portable layout delegates to native decoder'
      );
      if (realNative) {
        const timeout = new AbortController();
        const timer = setTimeout(
          () => timeout.abort(new DOMException('Native decode timed out', 'TimeoutError')),
          5000
        );
        try {
          const nativeBuffer = await decodeAudioBytes(engine.ensureContext(), odd, {
            signal: timeout.signal
          });
          ok(
            Math.abs(nativeBuffer.duration - 0.2) < 0.001,
            'real browser fallback resamples unusual rate'
          );
        } finally {
          clearTimeout(timer);
        }
      }
      const cancelPending = new AbortController();
      const pending = decodeAudioBytes({ decodeAudioData: () => new Promise(() => {}) }, odd, {
        signal: cancelPending.signal
      });
      setTimeout(() => cancelPending.abort(), 0);
      try {
        await pending;
        throw Error('ignored pending cancel');
      } catch (e) {
        ok(e.name === 'AbortError', 'cancel releases pending native decode');
      }
      let native = 0;
      try {
        await decodeAudioBytes(
          {
            decodeAudioData() {
              native++;
            }
          },
          raw.slice(0, -1)
        );
        throw Error('accepted truncation');
      } catch (e) {
        ok(/truncated/.test(e.message) && native === 0, 'truncation never falls through');
      }
      const stopped = new AbortController();
      stopped.abort();
      try {
        await decodeAudioBytes(engine.ensureContext(), raw, { signal: stopped.signal });
        throw Error('ignored abort');
      } catch (e) {
        ok(e.name === 'AbortError', 'cancelled before decode');
      }
      // Existing nested-reference policy remains explicit: direct loading can follow
      // an audio link; catalogue/pinned extraction must not fetch unpinned content.
      try {
        await loader.extractAudio(
          new Response('<audio src="https://example.invalid/sound.wav"></audio>', {
            headers: { 'content-type': 'text/html' }
          }),
          'x',
          null,
          0,
          false
        );
        throw Error('accepted nested');
      } catch (e) {
        ok(/Recursive/.test(e.message), 'pinned extraction refuses nested sources');
      }
      try {
        await loader.extractAudio(
          new Response(JSON.stringify({ audioData: 'not base64!' }), {
            headers: { 'content-type': 'application/json' }
          })
        );
        throw Error('accepted malformed base64');
      } catch (e) {
        ok(e.name === 'InvalidCharacterError', 'bad base64 rejected');
      }
      return { checks };
    },
    {
      url,
      ids: cases.map((_, i) => id(i + 1)),
      bytes: [...wav],
      unusual: [...new Uint8Array(unusual)],
      realNative: !(
        process.platform === 'darwin' && process.env.AUDIONAUT_TEST_BROWSER === 'firefox'
      )
    }
  );
  assert.deepEqual(
    logs.filter((x) => x.startsWith('pageerror:')),
    []
  );
  console.log(
    JSON.stringify({
      ...result,
      wrappers: cases.length,
      nativeFallback:
        process.platform === 'darwin' && process.env.AUDIONAUT_TEST_BROWSER === 'firefox'
          ? 'contract and cancellation tested; native WAV decode stalls in local Firefox, including ordinary 44.1 kHz WAV'
          : 'real browser verified',
      browser: process.env.AUDIONAUT_TEST_BROWSER || 'chromium',
      fixture: 'synthetic; reported inscription was not downloadable from this environment'
    })
  );
} finally {
  await b?.close();
  await new Promise((r) => srv.close(r));
}
