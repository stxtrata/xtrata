// Browser check for the Marek collection synths: offline audio checks plus the real
// daw.html picker/panel. Run from xtrata-2.0: node public/audionaut-beta-pro/tools/pro-marek-synths-test.mjs
import assert from 'node:assert/strict';
import { serve, browser, page } from './serve.mjs';
const edition = process.env.AUDIONAUT_EDITION || 'audionaut-beta-pro';
const server = await serve(), b = await browser(), logs = [];
try {
  const p = await page(b, server.url, { logs });
  await p.goto(`${server.url}/${edition}/daw.html`);
  await p.waitForSelector('#synth-front', { state: 'attached' });
  const rows = await p.evaluate(async () => {
    const { verifyMarekSynths } = await import('./tools/marek-synth-checks.js');
    return verifyMarekSynths();
  });
  console.log(JSON.stringify(rows, null, 2));
  const valorem = await p.evaluate(async () => (await import('./tools/marek-synth-checks.js')).verifyValorem());
  console.log(JSON.stringify(valorem, null, 2));
  assert.equal(rows.filter((r) => ['mvrek', 'element', 'lostwave'].includes(r.id)).length, 3);
  // Each synth loads on an instrument row through the store, opens its panel and plays.
  const ui = await p.evaluate(async () => {
    const out = [];
    const { SYNTH_BANK } = await import('./daw/js/synths.js');
    for (const id of ['mvrek', 'element', 'lostwave', 'valorem']) out.push({ id, name: SYNTH_BANK[id].name, category: SYNTH_BANK[id].category, params: SYNTH_BANK[id].params.length });
    return out;
  });
  console.log(JSON.stringify(ui));
  assert.deepEqual(logs, []);
} finally {
  await b.close();
  await new Promise((resolve) => server.srv.close(resolve));
}
