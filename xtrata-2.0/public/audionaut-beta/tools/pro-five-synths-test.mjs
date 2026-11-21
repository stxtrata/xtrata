import assert from 'node:assert/strict';
import { serve, browser, page } from './serve.mjs';
const server = await serve(),
  b = await browser(),
  logs = [];
try {
  const p = await page(b, server.url, { logs });
  await p.goto(server.url + '/audionaut-beta/daw.html');
  await p.waitForSelector('#synth-front', { state: 'attached' });
  const rows = await p.evaluate(async () => {
    const { verifyFiveSynths } = await import('./tools/five-synth-checks.js');
    const { offlineRenderSupport } = await import('./daw/js/audio-render-support.js');
    return offlineRenderSupport().supported ? verifyFiveSynths() : null;
  });
  console.log(JSON.stringify(rows, null, 2));
  if (rows) assert.equal(rows.length, 5);
  await p.setViewportSize({ width: 390, height: 844 });
  const host = await p.evaluate(async () => {
    const { verifyHost, verifyPlaying } = await import('./tools/five-synth-host-checks.js');
    const result = await verifyHost();
    await verifyPlaying();
    return result;
  });
  console.log(JSON.stringify(host, null, 2));
  assert.deepEqual(logs, []);
} finally {
  await b.close();
  await new Promise((resolve) => server.srv.close(resolve));
}
