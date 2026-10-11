// Browser checks use a fresh, extension-free profile and simulated ledger/session
// responses. They never connect a personal wallet, sign a transaction or pay STX.
import { chromium } from 'playwright';
import { readFile, mkdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { makeRandomPrivKey, privateKeyToString, getAddressFromPrivateKey, TransactionVersion } from '@stacks/transactions';
const root = new URL('../', import.meta.url);
const address = getAddressFromPrivateKey(privateKeyToString(makeRandomPrivKey()), TransactionVersion.Mainnet);
const other = getAddressFromPrivateKey(privateKeyToString(makeRandomPrivKey()), TransactionVersion.Mainnet);
const catalogue = JSON.parse(await readFile(new URL('functions/lib/audionaut-royalties-catalogue.json', root), 'utf8'));
const rows = catalogue.editions.slice(0, 3).map((e, i) => ({ ...e, tokenId: 3100 + i, mintedAt: 100,
  firstSongId: catalogue.artists.find(a => a.artist === e.artist).firstSongId,
  receivingAddress: i === 2 ? other : address, dueMicroStx: 5000000,
  status: ['paid', 'unrecorded', 'unverified'][i], txId: i === 1 ? null : '0x' + 'a'.repeat(64),
  recipient: i === 1 ? null : address, note: i === 2 ? 'Temporary chain lookup failure' : '' }));
let mode = 'out', receiptError = false, ledgerFetches = 0;
const browser = await chromium.launch({ headless: true, channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
await page.route('**/*', async route => {
  const url = new URL(route.request().url());
  if (url.origin !== 'https://royalties.test') return route.abort();
  if (url.pathname === '/api/audionaut-royalties') {
    ledgerFetches++;
    if (route.request().method() === 'POST') {
      assert.equal(mode, 'admin');
      assert.deepEqual(route.request().postDataJSON().editions, [2]);
      return route.fulfill({ status: receiptError ? 400 : 200, json: receiptError ? { error: 'Wrong receiving address.' } : { ok: true } });
    }
    if (mode === 'out') return route.fulfill({ status: 401, json: { error: 'Sign in.' } });
    if (mode === 'denied') return route.fulfill({ status: 403, json: { error: 'This wallet does not hold a receiving song.' } });
    if (mode === 'offline') return route.abort();
    return route.fulfill({ json: { address, admin: mode === 'admin', checkedAt: Date.now(), blockHeight: 120,
      artists: catalogue.artists.map(a => ({ ...a, address, error: null })), rows } });
  }
  if (url.pathname === '/manage/session') return route.fulfill({ json: { signedIn: false } });
  let file = url.pathname;
  if (file.endsWith('/')) file += 'index.html';
  if (!file.startsWith('/audionauts/royalties/')) return route.fulfill({ body: '' });
  return route.fulfill({ contentType: file.endsWith('.html') ? 'text/html' : file.endsWith('.css') ? 'text/css' : 'application/javascript',
    body: await readFile(new URL('public' + file, root), 'utf8') });
});
try {
  await page.goto('https://royalties.test/audionauts/royalties/');
  await page.waitForFunction(() => !document.getElementById('message').textContent);
  assert.equal(await page.locator('#ledger').isVisible(), false);
  assert.equal(await page.locator('#sign-in').isVisible(), true);
  mode = 'recipient'; await page.reload(); await page.locator('#rows tr').first().waitFor();
  assert.equal(await page.locator('#rows tr').count(), 3);
  assert.equal(await page.locator('#paid-total').textContent(), '5 STX');
  assert.equal(await page.locator('#unrecorded-total').textContent(), '5 STX');
  assert.equal(await page.locator('#unverified-count').textContent(), '1');
  assert.equal(await page.locator('#record-panel').isVisible(), false);
  await page.selectOption('#scope', 'mine'); assert.equal(await page.locator('#rows tr').count(), 3); // includes historical payments
  await page.selectOption('#status', 'unrecorded'); assert.equal(await page.locator('#rows tr').count(), 1);
  await page.selectOption('#status', ''); await page.fill('#search', '002'); assert.equal(await page.locator('#rows tr').count(), 1);
  await page.fill('#search', 'no-match'); assert.equal(await page.locator('#empty').isVisible(), true);
  await page.fill('#search', '');
  // Uploaded metadata stays plain text; it cannot create DOM or run a script.
  rows[0].title = '<img src=x onerror="window.metadataExecuted=true">';
  await page.click('#refresh'); await page.waitForFunction(() => document.querySelector('#rows')?.textContent.includes('<img'));
  assert.equal(await page.locator('#rows img').count(), 0);
  assert.equal(await page.evaluate(() => window.metadataExecuted), undefined);
  rows[0].title = catalogue.editions[0].title;
  mode = 'admin'; await page.reload(); await page.locator('#record-panel').waitFor();
  await page.locator('#record-panel summary').click();
  await page.fill('#tx-id', '0x' + 'a'.repeat(64)); await page.fill('#editions', '2');
  receiptError = true; await page.locator('#receipt-form button').click();
  await page.waitForFunction(() => document.getElementById('receipt-message').textContent === 'Wrong receiving address.');
  assert.equal(await page.locator('#rows tr .paid').count(), 1);
  receiptError = false; await page.locator('#receipt-form button').click();
  await page.waitForFunction(() => document.getElementById('receipt-message').textContent === 'Receipt verified and recorded.');
  await page.locator('#record-panel summary').click();
  await mkdir(new URL('_claude_scratch/audionaut-royalties/', root), { recursive: true });
  await page.screenshot({ path: new URL('_claude_scratch/audionaut-royalties/desktop.png', root).pathname, fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  await page.screenshot({ path: new URL('_claude_scratch/audionaut-royalties/mobile.png', root).pathname, fullPage: true });
  mode = 'denied'; await page.click('#refresh'); await page.waitForFunction(() => document.getElementById('ledger').hidden);
  assert.equal(await page.locator('#rows tr').count(), 0);
  mode = 'recipient'; await page.reload(); await page.locator('#rows tr').first().waitFor();
  await page.click('#sign-out'); assert.equal(await page.locator('#ledger').isVisible(), false);
  assert.equal(await page.locator('#rows tr').count(), 0);
  assert.deepEqual(errors, []);
  assert(ledgerFetches < 20, 'No polling loop');
  console.log('Browser smoke passed: private gate, filters, receipts, unsafe metadata, sign-out, desktop and mobile. All sessions/payments simulated.');
} finally { await browser.close(); }
