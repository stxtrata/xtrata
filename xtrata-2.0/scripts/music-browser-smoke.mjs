/* global building, PLAYER, META, EDITS_DIRTY, SB, payloads, extensionCalls */
import { chromium } from 'playwright';
import { readFile, mkdir } from 'node:fs/promises';
import { strict as assert } from 'node:assert';
const root = new URL('../', import.meta.url);
const live = process.argv.find((a) => a.startsWith('https://'));
const base = live || 'https://music.test';
const browser = await chromium.launch({ headless: true, channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1280, height: 950 } });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
const read = (p) => readFile(new URL(p, root), 'utf8');
try {
  if (!live)
    await page.route('**/*', async (route) => {
      const u = new URL(route.request().url());
      let path = u.pathname;
      if (path === '/music/')
        return route.fulfill({ contentType: 'text/html', body: await read('music/index.html') });
      if (path.startsWith('/wizard/') && !path.includes('agent-one.js')) {
        try {
          return route.fulfill({
            contentType: path.endsWith('.css') ? 'text/css' : 'application/javascript',
            body: await read('xtrata-agent-one' + path)
          });
        } catch {}
      }
      return route.fulfill({ body: '', contentType: 'application/javascript' });
    });
  // All payment and job calls are simulated. The browser has no user profile or extensions.
  await page.addInitScript(() => {
    window.XAO_AGENT_BUILD = '2026-12-01';
    window.extensionCalls = 0;
    window.payloads = [];
    window.XtrataWizardFunding = {
      getAddress: () => 'ST-DISPOSABLE-SIMULATION',
      connect: async () => 'ST-DISPOSABLE-SIMULATION',
      disconnect: async () => {},
      pay: async () => {
        throw Error('SIMULATION — payment intentionally blocked');
      }
    };
    window.XtrataWallet = {
      getAddress: () => {
        window.extensionCalls++;
        throw Error('Personal wallet access forbidden');
      }
    };
    const estimate = {
      requiredUstx: '100000',
      protocolFee: '20000',
      minerReserve: '50000',
      deliveryReserve: '10000',
      agentFeeUstx: '20000',
      agentFeePct: 20
    };
    window.musicFakeAgent = {
      health: async () => ({ mock: false, net: 'testnet' }),
      listJobs: async () => [],
      estimate: async () => {
        if (window.failQuote) throw Error('Quote unavailable');
        return estimate;
      },
      estimateBatch: async () => estimate,
      createJob: async (p) => {
        window.payloads.push({
          origin: p.origin,
          mime: p.mime,
          bytes: p.file ? await p.file.text() : null,
          items: p.items?.map((i) => ({ mime: i.mime, size: i.file.size }))
        });
        return {
          jobId: 'simulation',
          depositAddress: 'ST-SIMULATION',
          user: p.user,
          expectedFunder: p.expectedFunder,
          requiredUstx: '100000',
          status: 'AWAITING_DEPOSIT'
        };
      },
      getJob: async () => ({ job: { jobId: 'simulation', status: 'AWAITING_DEPOSIT' }, status: {} })
    };
    window.XtrataAgent = window.musicFakeAgent;
  });
  // Use actual output builder and player template, but a deterministic extraction fixture in UI tests.
  await page.route('**/audio-processing.js*', (route) =>
    route.fulfill({
      contentType: 'application/javascript',
      body: `window.XtrataAudioProcessing={slug:s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-'),extract:async(f,s,q)=>{if(f.name==='corrupt.wav')throw Error('Invalid audio');return {audioB64:btoa(await f.text()),audioBytes:new Uint8Array([1,2,3]),meta:{},coverB64:null,coverMime:null,opusBytes:q==='optimised'?3:null};}};`
    })
  );
  await page.route('**/agent-one.js*', (route) =>
    route.fulfill({
      contentType: 'application/javascript',
      body: 'window.XtrataAgent=window.musicFakeAgent;'
    })
  );
  await page.goto(base + '/music/');
  await page.waitForSelector('#saveMusicDraft');
  assert.equal(await page.title(), 'Xtrata Music — inscribe your music');
  assert(!/suno/i.test(await page.locator('body').innerText()));
  const file = {
    name: 'untagged.wav',
    mimeType: 'audio/wav',
    buffer: Buffer.from('exact fixture audio')
  };
  await page.locator('#picker').setInputFiles(file);
  await page.waitForFunction(() => !document.querySelector('#go').disabled);
  assert.equal(await page.locator('#eArtist').inputValue(), '');
  await page.locator('#eArtist').fill('Session musician');
  assert(await page.locator('#go').isDisabled());
  await page.locator('#applyEdits').click();
  await page.waitForFunction(() => !document.querySelector('#go').disabled);
  await page.locator('#musicFormat').selectOption('artwork');
  await page.waitForFunction(() => !document.querySelector('#go').disabled);
  await page
    .locator('#eCoverPick')
    .setInputFiles({
      name: 'art.png',
      mimeType: 'image/png',
      buffer: Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=',
        'base64'
      )
    });
  await page.waitForFunction(() => EDITS_DIRTY);
  await page.locator('#applyEdits').click();
  await page.waitForFunction(() => !document.querySelector('#go').disabled);
  assert(await page.evaluate(() => META.hasCover));
  await page.locator('#musicRemoveArt').click();
  await page.locator('#applyEdits').click();
  await page.waitForFunction(() => !document.querySelector('#go').disabled);
  assert(!(await page.evaluate(() => META.hasCover)));
  await page.locator('#saveMusicDraft').click();
  await page.waitForFunction(() =>
    document.querySelector('#draftStatus').textContent.includes('saved locally')
  );
  await page.locator('#eArtist').fill('Changed');
  await page.locator('#restoreMusicDraft').click();
  await page.waitForFunction(() =>
    document.querySelector('#draftStatus').textContent.includes('restored')
  );
  assert.equal(await page.locator('#eArtist').inputValue(), 'Session musician');
  await page.evaluate(() => (window.failQuote = true));
  await page.locator('#musicQuality').selectOption('optimised');
  await page.waitForFunction(() => !building);
  assert(await page.locator('#go').isDisabled());
  await page.evaluate(() => (window.failQuote = false));
  await page.locator('#musicQuality').selectOption('original');
  await page.waitForFunction(() => !document.querySelector('#go').disabled);
  await page.locator('#musicFormat').selectOption('audio');
  await page.waitForFunction(() => !document.querySelector('#go').disabled);
  assert.equal(await page.evaluate(() => PLAYER.text()), 'exact fixture audio');
  assert.equal(await page.evaluate(() => PLAYER.type), 'audio/wav');
  await page.setViewportSize({ width: 390, height: 844 });
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await mkdir('/tmp/xtrata-music-qa', { recursive: true });
  await page.screenshot({ path: '/tmp/xtrata-music-qa/mobile.png', fullPage: true });
  await page.locator('#go').click();
  await page.waitForFunction(() =>
    document.querySelector('#hint').textContent.includes('SIMULATION')
  );
  assert.deepEqual(await page.evaluate(() => payloads[0]), {
    origin: 'music',
    mime: 'audio/wav',
    bytes: 'exact fixture audio',
    items: undefined
  });
  assert(await page.locator('#go').isDisabled());
  await page.reload();
  await page.waitForSelector('#saveMusicDraft');
  await page.locator('#picker').setInputFiles([file, { ...file, name: 'second.wav' }]);
  await page.waitForFunction(() => !document.querySelector('#sbGo').disabled);
  await page.locator('.sbrow button[title="Edit this track"]').first().click();
  assert(await page.locator('#sbGo').isDisabled());
  await page.locator('#track-artist').fill('Batch artist');
  await page.locator('#shareTrack').click();
  await page.waitForFunction(() => !document.querySelector('#sbGo').disabled);
  assert.deepEqual(await page.evaluate(() => SB.items.map((i) => i.info.artist)), [
    'Batch artist',
    'Batch artist'
  ]);
  await page.locator('.sbrow button[title="Edit this track"]').first().click();
  await page.locator('#trackFormat').selectOption('audio');
  await page.locator('#saveTrack').click();
  await page.waitForFunction(() => !document.querySelector('#sbGo').disabled);
  assert.deepEqual(await page.evaluate(() => SB.items.map((i) => i.player.type)), [
    'audio/wav',
    'text/html'
  ]);
  await page.setViewportSize({ width: 1280, height: 950 });
  await page.screenshot({ path: '/tmp/xtrata-music-qa/desktop-batch.png', fullPage: true });
  await page.locator('#sbGo').click();
  await page.waitForFunction(() =>
    document.querySelector('#sbHint').textContent.includes('SIMULATION')
  );
  assert.equal(await page.evaluate(() => extensionCalls), 0);
  assert.equal(await page.evaluate(() => payloads[0].origin), 'music');
  assert.deepEqual(errors, []);
  console.log(
    JSON.stringify(
      {
        passed: true,
        base,
        checks: [
          'neutral branding',
          'untagged audio',
          'art add/remove',
          'dirty quote gate',
          'quote failure',
          'draft restore',
          'original bytes and MIME',
          'mobile width',
          'single simulated payment',
          'batch shared metadata',
          'mixed batch MIME',
          'batch simulated payment',
          'no personal wallet access',
          'no page errors'
        ]
      },
      null,
      2
    )
  );
} finally {
  await browser.close();
}
