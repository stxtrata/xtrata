/* global refresh */
import { chromium } from 'playwright';
import { readFile } from 'node:fs/promises';
import { strict as assert } from 'node:assert';
const root = new URL('../', import.meta.url);
const live = process.argv.find(a => a.startsWith('https://'));
const base = live || 'https://music.test';
const browser = await chromium.launch({ headless: true, channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const errors = [];
page.on('pageerror', e => errors.push(e.message));
try {
  if (!live) await page.route('**/*', async route => {
    const path = new URL(route.request().url()).pathname;
    if (path === '/music/') return route.fulfill({ contentType: 'text/html', body: await readFile(new URL('music/index.html', root), 'utf8') });
    if (path.startsWith('/wizard/') && !path.includes('agent-one.js')) {
      try { return route.fulfill({ contentType: path.endsWith('.css') ? 'text/css' : 'application/javascript', body: await readFile(new URL('xtrata-agent-one' + path, root), 'utf8') }); } catch {}
    }
    return route.fulfill({ body: '', contentType: 'application/javascript' });
  });
  // No extension, production wallet or chain call is available to this browser.
  await page.addInitScript(() => {
    window.XAO_AGENT_BUILD = '2026-12-01';
    const address = 'SP-DISPOSABLE-SIMULATED-PAYER';
    const initial = { job: { jobId: 'speed-simulation', status: 'FEE_WAITING', origin: 'music', fastTrack: true, feePolicy: 'music-v1',
      depositAddress: 'SP-DISPOSABLE-SIMULATED-DEPOSIT', depositReceivedUstx: '1500000', progress: 'Waiting for lower fees', expectedFunder: address },
      fees: { mode: 'economy', lastConfirmedAt: Date.now() - 180000, spent: '100000', approvedTotal: '1500000', extraReceived: '0', expiryBlocks: 3900 } };
    const load = () => JSON.parse(localStorage.getItem('simulated-speed') || JSON.stringify(initial));
    const save = s => localStorage.setItem('simulated-speed', JSON.stringify(s));
    window.speedPayments = 0;
    window.XtrataWallet = {
      getAddress: () => address,
      pay: async () => {
        window.speedPayments++;
        if (window.rejectSpeedPayment) throw Object.assign(Error('Payment cancelled'), { code: 'USER_CANCELLED' });
        return { txId: 'a'.repeat(64) };
      }
    };
    window.musicFakeAgent = {
      health: async () => ({ mock: false, net: 'mainnet' }),
      listJobs: async () => [load().job],
      getJob: async () => { const s = load(); return { job: s.job, status: { funded: true, musicFees: s.fees } }; },
      quoteMusicSpeedUp: async () => {
        const s = load(); const q = { id: 'review', state: 'review', balance: '1200000', additional: window.zeroTopUp ? '0' : '750000', total: window.zeroTopUp ? '1500000' : '2250000', service: '225000', sender: address };
        s.fees.upgrade = q; save(s); return q;
      },
      approveMusicSpeedUp: async () => {
        const s = load(); const q = s.fees.upgrade;
        if (q.state !== 'review') throw Error('Already requested');
        q.state = q.additional === '0' ? 'confirmed' : 'payment';
        if (q.state === 'confirmed') s.fees.mode = 'standard'; save(s); return q;
      },
      recordMusicTopUp: async (_id, _quote, txid) => { const s = load(); s.fees.upgrade.txid = txid; save(s); },
      dismissMusicTopUp: async () => { const s = load(); delete s.fees.upgrade; save(s); }
    };
    window.XtrataAgent = window.musicFakeAgent;
  });
  await page.route('**/agent-one.js*', route => route.fulfill({ contentType: 'application/javascript', body: 'window.XtrataAgent=window.musicFakeAgent;' }));
  await page.goto(base + '/music/');
  await page.waitForSelector('#musicSpeedOpen:visible');
  assert.match(await page.locator('#musicSpeedTitle').innerText(), /Still waiting/);
  await page.locator('#musicSpeedOpen').click();
  assert.equal(await page.locator('#musicSpeedExtra').innerText(), '0.75 STX');
  assert.equal(await page.locator('#musicSpeedTotal').innerText(), '2.25 STX');
  await page.locator('#musicSpeed').scrollIntoViewIfNeeded();
  await page.screenshot({ path: '/tmp/music-speed-mobile.png' });
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await page.locator('#musicSpeedKeep').click();
  assert.equal(await page.evaluate(() => window.speedPayments), 0);
  await page.locator('#musicSpeedOpen').click();
  await page.evaluate(() => { window.rejectSpeedPayment = true; });
  await page.locator('#musicSpeedApprove').click();
  await page.waitForFunction(() => !JSON.parse(localStorage.getItem('simulated-speed')).fees.upgrade);
  assert.equal(await page.evaluate(() => window.speedPayments), 1);
  await page.evaluate(() => { window.rejectSpeedPayment = false; });
  await page.locator('#musicSpeedOpen').click();
  await page.locator('#musicSpeedApprove').click();
  await page.waitForFunction(() => !!JSON.parse(localStorage.getItem('simulated-speed')).fees.upgrade.txid);
  assert.match(await page.locator('#musicSpeedTitle').innerText(), /Confirming additional/);
  assert(await page.locator('#musicSpeedOpen').isHidden());
  assert(await page.locator('#musicSpeedApprove').isHidden());
  assert.equal(await page.evaluate(() => window.speedPayments), 2);
  await page.reload();
  await page.waitForSelector('#musicSpeed:visible');
  assert.match(await page.locator('#musicSpeedTitle').innerText(), /Confirming additional/);
  assert.equal(await page.evaluate(() => window.speedPayments), 0);
  // An independently verified chain result updates the view; reloading never requests a payment.
  await page.evaluate(async () => {
    const s = JSON.parse(localStorage.getItem('simulated-speed'));
    s.fees.mode = 'standard'; s.fees.upgrade.state = 'confirmed'; s.fees.extraReceived = '750000';
    localStorage.setItem('simulated-speed', JSON.stringify(s)); await refresh();
  });
  assert.equal(await page.locator('#musicSpeedTitle').innerText(), 'Standard fee budget active');
  // Sufficient reserves: approval requires no wallet transfer.
  await page.evaluate(async () => {
    const s = JSON.parse(localStorage.getItem('simulated-speed')); s.fees.mode = 'economy'; delete s.fees.upgrade;
    localStorage.setItem('simulated-speed', JSON.stringify(s)); window.zeroTopUp = true; await refresh();
  });
  await page.locator('#musicSpeedOpen').click();
  assert.equal(await page.locator('#musicSpeedApprove').innerText(), 'Confirm faster processing');
  await page.locator('#musicSpeedApprove').click();
  await page.waitForFunction(() => JSON.parse(localStorage.getItem('simulated-speed')).fees.mode === 'standard');
  assert.equal(await page.evaluate(() => window.speedPayments), 0);
  assert.deepEqual(errors, []);
  console.log(JSON.stringify({ pass: true, source: base, checks: ['mobile review', 'no overflow', 'keep waiting', 'wallet rejection', 'one top-up request', 'reload pending payment', 'verified upgrade', 'zero-payment upgrade', 'no page errors'] }, null, 2));
} finally { await browser.close(); }
