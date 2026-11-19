import assert from 'node:assert/strict';
import { serve, browser, page } from './serve.mjs';
const { srv, url } = await serve(),
  b = await browser(),
  logs = [];
try {
  const p = await page(b, url, { logs });
  await p.route(url + '/reader-fixture', (route) =>
    route.fulfill({
      contentType: 'text/html',
      body: '<!doctype html><title>Local decoder worker test</title>'
    })
  );
  await p.goto(url + '/reader-fixture');
  const result = await p.evaluate(async () => {
    const { readDocument } =
      await import('/audionaut-beta-pro/daw/js/legacy-bridge/read-document.js');
    const { prepareLegacyImport } =
      await import('/audionaut-beta-pro/daw/js/legacy-bridge/index.js');
    const document = {
        projectURLs: ['/content/' + 'ab'.repeat(32) + 'i0'],
        projectSequences: {
          Sequence0: { ch0: { steps: Array.from({ length: 64 }, (_, i) => i === 0 || i === 63) } }
        }
      },
      json = JSON.stringify(document);
    const gzip = await new Response(
      new Blob([json]).stream().pipeThrough(new CompressionStream('gzip'))
    ).arrayBuffer();
    const Native = window.Worker;
    let created = 0,
      terminated = 0,
      abortNext = null;
    window.Worker = class extends Native {
      constructor(...args) {
        super(...args);
        created++;
        if (abortNext) queueMicrotask(() => abortNext.abort());
      }
      terminate() {
        terminated++;
        return super.terminate();
      }
    };
    try {
      const decoded = await readDocument(gzip),
        gzipWorkers = created;
      const forced = await readDocument(json, { limits: { workerThreshold: 1 } }),
        jsonWorkers = created - gzipWorkers;
      const imported = await prepareLegacyImport(gzip),
        positions = imported.normalized.events.map((x) => x.step);
      abortNext = new AbortController();
      let cancelled = false;
      try {
        await readDocument(json, { signal: abortNext.signal, limits: { workerThreshold: 1 } });
      } catch (error) {
        cancelled = error.name === 'AbortError';
      }
      return {
        gzipWorkers,
        jsonWorkers,
        created,
        terminated,
        cancelled,
        container: decoded.container,
        sameDocument:
          JSON.stringify(decoded.document) === json && JSON.stringify(forced.document) === json,
        positions,
        sourceHash: decoded.sourceHash
      };
    } finally {
      window.Worker = Native;
    }
  });
  assert.equal(result.gzipWorkers, 1);
  assert.equal(result.jsonWorkers, 1);
  assert.equal(result.created, 4);
  assert.equal(result.terminated, 4);
  assert.equal(result.cancelled, true);
  assert.equal(result.container, 'gzip');
  assert.equal(result.sameDocument, true);
  assert.deepEqual(result.positions, [0, 63]);
  assert.match(result.sourceHash, /^[a-f0-9]{64}$/);
  assert.deepEqual(logs, []);
  console.log(
    'PASS actual browser local decoder workers: gzip and JSON, contextual import, abort and worker termination',
    result
  );
} finally {
  await b.close();
  await new Promise((r) => srv.close(r));
}
