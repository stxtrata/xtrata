/* global building, PLAYER, META, SB, payloads, extensionCalls */
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
  assert.equal(await page.locator('#musicQuality').inputValue(), 'optimised');
  await page.locator('#musicQuality').selectOption('original');
  await page.waitForSelector('#saveMusicDraft');
  assert.equal(await page.title(), 'Xtrata Music — inscribe your music');
  assert(!/suno/i.test(await page.locator('body').innerText()));
  const file = {
    name: 'untagged.wav',
    mimeType: 'audio/wav',
    buffer: Buffer.from('exact fixture audio')
  };
  assert(
    await page.evaluate(async () => {
      const c = document.createElement('canvas');
      c.width = 64;
      c.height = 32;
      const ctx = c.getContext('2d');
      ctx.fillStyle = 'red';
      ctx.fillRect(0, 0, 20, 20);
      const blob = await new Promise((r) => c.toBlob(r, 'image/png'));
      const out = await window.XtrataMusicArtwork.optimise(
        new File([blob], 'alpha.png', { type: 'image/png' }),
        'small'
      );
      const bitmap = await createImageBitmap(out.file);
      const check = document.createElement('canvas');
      check.width = 64;
      check.height = 32;
      const x = check.getContext('2d');
      x.drawImage(bitmap, 0, 0);
      bitmap.close();
      return out.width === 64 && out.height === 32 && x.getImageData(63, 31, 1, 1).data[3] === 0;
    })
  );
  await page.locator('#picker').setInputFiles(file);
  await page.waitForFunction(() => !document.querySelector('#go').disabled);
  assert.equal(await page.locator('#eArtist').inputValue(), '');
  await page.locator('#eArtist').fill('Session musician');
  assert(await page.locator('#go').isDisabled());
  await page.locator('#applyEdits').click();
  await page.waitForFunction(() => !document.querySelector('#go').disabled);
  await page.locator('#musicFormat').selectOption('artwork');
  await page.waitForFunction(() => !document.querySelector('#go').disabled);
  const cover = await page.evaluate(() => {
    const c = document.createElement('canvas');
    c.width = 2048;
    c.height = 1024;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#245c42';
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.fillStyle = 'white';
    ctx.font = '120px sans-serif';
    ctx.fillText('Music artwork', 120, 400);
    return c.toDataURL('image/png').split(',')[1];
  });
  await page.locator('#eCoverPick').setInputFiles({
    name: 'cover.png',
    mimeType: 'image/png',
    buffer: Buffer.from(cover, 'base64')
  });
  await page.waitForFunction(() => !document.querySelector('#artworkApply').disabled);
  assert((await page.locator('#artworkWarning').innerText()).includes('High resolution'));
  await page.locator('#artworkPreset').selectOption('small');
  await page.waitForFunction(() => !document.querySelector('#artworkApply').disabled);
  assert((await page.locator('#artworkResult').innerText()).includes('256 × 128'));
  await page.screenshot({ path: '/tmp/music-artwork-review.png' });
  await page.locator('#artworkApply').click();
  await page.waitForFunction(() => META.hasCover && !document.querySelector('#go').disabled);
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
  await page.locator('#musicQuality').selectOption('compact');
  await page.waitForFunction(() => !document.querySelector('#go').disabled);
  assert.equal(await page.evaluate(() => META.audioLabel), 'Opus 48 kbps VBR');
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
  await page.locator('.sbrow button[title="Change this player’s artwork"]').first().click();
  await page.locator('#sbArtPick').setInputFiles({
    name: 'cover.png',
    mimeType: 'image/png',
    buffer: Buffer.from(cover, 'base64')
  });
  await page.waitForFunction(() => !document.querySelector('#artworkApply').disabled);
  await page.locator('#artworkPreset').selectOption('tiny');
  await page.waitForFunction(() => !document.querySelector('#artworkApply').disabled);
  await page.locator('#artworkApply').click();
  await page.waitForFunction(
    () => SB.items[0].info.hasCover && !document.querySelector('#sbGo').disabled
  );
  assert.equal(await page.evaluate(() => SB.items[0].info.artist), 'Batch artist');
  assert.equal(await page.evaluate(() => SB.items[0].info.artworkInfo.width), 128);
  await page.locator('.sbrow button[title="Edit this track"]').first().click();
  await page.locator('#trackQuality').selectOption('compact');
  await page.locator('#trackFormat').selectOption('audio');
  await page.locator('#saveTrack').click();
  await page.waitForFunction(() => !document.querySelector('#sbGo').disabled);
  assert.deepEqual(await page.evaluate(() => SB.items.map((i) => i.player.type)), [
    'audio/webm; codecs=opus',
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
          'art add/remove, resize comparison and high-resolution warning',
          'transparent artwork preserved without upscaling',
          'batch artwork resize and per-track 48 kbps output',
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
