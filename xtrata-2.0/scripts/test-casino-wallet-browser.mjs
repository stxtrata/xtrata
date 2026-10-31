// Real-browser check of the ParallaX Casino "Play now" flow (docs/plans/CASINO-PASSKEY-WALLET-PLAN.md): the real casino page
// (public/casino/index.html, ?passkey=1), the real casino wallet box (dist-casino-wallet) on its own origin in an iframe, Chrome's
// virtual authenticator with PRF, and a FAKE Hiro testnet API (faucet, balances, nonces, broadcast, transaction lookup).
// Nothing reaches a real network and no funds move.
//
// Usage: VITE_CASINO_WALLET_PARENTS=https://xtrata.test npm run build:casino-wallet
//        npm run build:casino-passkey
//        CHROME_PATH=<chrome or chromium> node scripts/test-casino-wallet-browser.mjs [screenshot-dir]
//        npm run build:casino-wallet   # rebuild with the production parent afterwards
import { chromium } from 'playwright';
import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { deserializeTransaction, addressToString, addressFromVersionHash, AddressVersion } from '@stacks/transactions';

const shots = process.argv[2];
const dist = new URL('../dist-casino-wallet/', import.meta.url);
const pub = new URL('../public/', import.meta.url);
const headersFile = await readFile(new URL('_headers', dist), 'utf8');
const csp = /Content-Security-Policy: (.+)/.exec(headersFile)[1];
assert.match(csp, /frame-ancestors https:\/\/xtrata\.test/, 'build with VITE_CASINO_WALLET_PARENTS=https://xtrata.test');
assert.match(csp, /connect-src 'none'/);

const SITE = 'https://xtrata.test', WALLET = 'https://casino-wallet.xtrata.test', API = 'https://api.testnet.hiro.so';
const EXCHANGE = 'ST10W2EEM757922QTVDZZ5CSEW55JEFNN33V2E7YA';
const STX = 1_000_000n;

// ---- fake testnet ----
const chain = { balances: new Map(), nonces: new Map(), txs: new Map(), faucetCalls: [], broadcasts: [] };
const bal = (a) => chain.balances.get(a) ?? 0n;
async function hiro(route, url) {
  const p = url.pathname, json = (status, body) => route.fulfill({ status, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(body) });
  if (route.request().method() === 'OPTIONS') return route.fulfill({ status: 204, headers: { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': '*' } });
  if (p === '/extended/v1/faucets/stx') {
    const a = url.searchParams.get('address');
    chain.faucetCalls.push(a);
    setTimeout(() => chain.balances.set(a, bal(a) + 500n * STX), 1500); // lands a moment later, like the real one
    return json(200, { success: true, txId: '0x' + 'fa'.repeat(32), txRaw: '00' });
  }
  let m = /^\/extended\/v3\/principals\/([^/]+)\/balances\/stx$/.exec(p);
  if (m) return json(200, { balance: bal(m[1]).toString(), available: bal(m[1]).toString() });
  m = /^\/extended\/v1\/address\/([^/]+)\/nonces$/.exec(p);
  if (m) return json(200, { possible_next_nonce: chain.nonces.get(m[1]) ?? 0, detected_missing_nonces: [], last_mempool_tx_nonce: null });
  if (p === '/v2/transactions' && route.request().method() === 'POST') {
    const tx = deserializeTransaction(new Uint8Array(route.request().postDataBuffer()));
    const c = tx.auth.spendingCondition, pl = tx.payload;
    const sender = addressToString(addressFromVersionHash(AddressVersion.TestnetSingleSig, c.signer));
    const amount = BigInt(pl.amount), fee = BigInt(c.fee), nonce = Number(c.nonce);
    if (nonce !== (chain.nonces.get(sender) ?? 0)) return json(400, { error: 'transaction rejected', reason: 'BadNonce', txid: tx.txid() });
    if (bal(sender) < amount + fee) return json(400, { error: 'transaction rejected', reason: 'NotEnoughFunds', txid: tx.txid() });
    chain.balances.set(sender, bal(sender) - amount - fee);
    chain.nonces.set(sender, nonce + 1);
    const recipient = addressToString(pl.recipient.address);
    chain.txs.set('0x' + tx.txid(), { tx_id: '0x' + tx.txid(), tx_type: 'token_transfer', tx_status: 'success', sender_address: sender, token_transfer: { recipient_address: recipient, amount: amount.toString() }, block_height: 100 + chain.txs.size, canonical: true });
    chain.broadcasts.push({ sender, recipient, amount, fee, nonce });
    return json(200, tx.txid());
  }
  m = /^\/extended\/v3\/transactions\/([^/]+)$/.exec(p);
  if (m) { const t = chain.txs.get(decodeURIComponent(m[1])); return t ? json(200, t) : json(404, { error: 'not found' }); }
  return json(404, { error: 'not mocked: ' + p });
}

const types = { '.js': 'text/javascript', '.css': 'text/css', '.html': 'text/html', '.json': 'application/json', '.glb': 'model/gltf-binary' };
const typeOf = (path) => types[(/\.[a-z]+$/.exec(path) || [''])[0]] || 'application/octet-stream';

const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH || undefined });

async function newPlayer({ prf = true } = {}) {
  const context = await browser.newContext({ viewport: { width: 900, height: 900 } });
  await context.route('**/*', async (route) => {
    const url = new URL(route.request().url());
    if (url.origin === WALLET) {
      const path = url.pathname === '/' ? 'index.html' : url.pathname === '/create' ? 'create.html' : url.pathname.slice(1);
      try {
        return route.fulfill({ status: 200, body: await readFile(new URL(path, dist)), headers: { 'content-type': typeOf(path), 'content-security-policy': csp, 'x-content-type-options': 'nosniff' } });
      } catch { return route.fulfill({ status: 404, body: '' }); }
    }
    if (url.origin === SITE) {
      if (url.pathname === '/casino-status.json') return route.fulfill({ status: 200, contentType: 'application/json', body: '{"state":"open"}' });
      const path = url.pathname.endsWith('/') ? url.pathname.slice(1) + 'index.html' : url.pathname.slice(1);
      try { return route.fulfill({ status: 200, body: await readFile(new URL(path, pub)), headers: { 'content-type': typeOf(path) } }); }
      catch { return route.fulfill({ status: 404, body: '' }); }
    }
    if (url.origin === API) return hiro(route, url);
    return route.abort();
  });
  const page = await context.newPage();
  page.setDefaultTimeout(30000);
  const errors = [], logs = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => logs.push(m.text()));
  const cdp = await context.newCDPSession(page);
  await cdp.send('WebAuthn.enable');
  await cdp.send('WebAuthn.addVirtualAuthenticator', {
    options: { protocol: 'ctap2', ctap2Version: 'ctap2_1', transport: 'internal', hasResidentKey: true, hasUserVerification: true, isUserVerified: true, hasPrf: prf, automaticPresenceSimulation: true }
  });
  // The page's wallet script would load https://casino-wallet.xtrata.xyz; point it at the test wallet origin.
  await page.addInitScript((w) => {
    if (window.top !== window) return;
    window.ParallaxCasinoWalletOrigin = w;
    // Headless software WebGL draws the 3D casino at about 1 frame a second, which starves clicks. Draw one frame every 4 s instead:
    // this test is about the exchange panel, not the scene.
    const raf = window.requestAnimationFrame.bind(window);
    window.requestAnimationFrame = (cb) => setTimeout(() => raf(cb), 4000);
  }, WALLET);
  return { context, page, errors, logs };
}

/** Confirm each panel INSIDE the wallet frame until `done()` (arming delay: a click too early is ignored, so retry). */
async function confirmInFrame(page, done, label) {
  const frame = page.frameLocator('#lxPasskeyFrame iframe');
  for (let i = 0; i < 80; i++) {
    if (await done()) return;
    const ok = frame.locator('#p-ok');
    if (await ok.isVisible().catch(() => false) && await ok.isEnabled().catch(() => false)) await ok.click({ timeout: 2000 }).catch(() => {});
    await page.waitForTimeout(400);
  }
  const text = await frame.locator('body').innerText().catch((e) => 'unreadable: ' + e.message);
  const okState = await frame.locator('#p-ok').evaluate((b) => ({ disabled: b.disabled, text: b.textContent })).catch(() => null);
  throw new Error('wallet frame never finished: ' + label + '\nframe: ' + text + '\nok: ' + JSON.stringify(okState) + '\npage: ' + JSON.stringify(await snap(page).catch(() => null)) + '\nerror line: ' + await page.locator('#layrTestnetError').textContent());
}
const snap = (page) => page.evaluate(() => window.ParallaxLAYRExchange.client.snapshot());
const layr = (page) => page.evaluate(() => Number(document.getElementById('layrRoomBalance')?.textContent.replace(/[^0-9]/g, '') || 0));
async function waitFor(page, check, ms, label) {
  const t0 = Date.now();
  for (;;) {
    if (await check()) return;
    if (Date.now() - t0 > ms) throw new Error('timed out: ' + label + ' · ' + JSON.stringify(await snap(page).catch(() => null)));
    await page.waitForTimeout(500);
    // The page polls a pending transfer every 12 s from its frame loop; nudge it so the test does not wait on the render loop.
    await page.evaluate(() => { const c = window.ParallaxLAYRExchange.client; if (c.snapshot().pending?.txId) c.check(); }).catch(() => {});
  }
}

async function openExchange(page) {
  await page.goto(SITE + '/casino/?passkey=1', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForFunction(() => window.ParallaxLAYRExchange && window.ParallaxPasskeyWallet, null, { timeout: 120000 });
  await page.evaluate(() => window.ParallaxLAYRExchange.open(0));
  await page.locator('#lxPlayNow').waitFor({ state: 'visible' });
}

// ---- 1. a new player with a passkey ----
{
  const { context, page, errors } = await newPlayer();
  await openExchange(page);
  assert.equal(await page.locator('#lxPlayNow').textContent(), 'Play now · no wallet needed');
  assert.equal(await page.locator('#layrConnectWallet').textContent(), 'I have a Stacks wallet');
  const before = await layr(page);
  if (shots) await page.screenshot({ path: `${shots}/1-play-now.png`, timeout: 120000, animations: 'disabled' });
  await page.locator('#lxPlayNow').click();
  await page.locator('#lxPasskeyFrame iframe').waitFor({ state: 'visible' });
  if (shots) { await page.waitForTimeout(1200); await page.screenshot({ path: `${shots}/2-wallet-panel.png`, timeout: 120000, animations: 'disabled' }); }
  await confirmInFrame(page, async () => !!(await snap(page)).address, 'create passkey wallet');
  const address = (await snap(page)).address;
  assert.match(address, /^ST/);
  assert.equal((await snap(page)).walletKind, 'passkey');
  assert.equal(await page.locator('#lxPasskeyFrame').isHidden(), true, 'frame hides once open');
  // Faucet → 500 STX → automatic first buy of 10 STX → credited 1,000,000 LAYR.
  await waitFor(page, async () => ['credited', 'already-credited'].includes((await snap(page)).phase), 90000, 'first buy credited');
  assert.deepEqual(chain.faucetCalls, [address]);
  assert.equal(chain.broadcasts.length, 1);
  assert.deepEqual(chain.broadcasts[0], { sender: address, recipient: EXCHANGE, amount: 10n * STX, fee: 3000n, nonce: 0 });
  await page.waitForTimeout(500);
  assert.equal(await layr(page) - before, 1_000_000, 'one million LAYR credited');
  if (shots) await page.screenshot({ path: `${shots}/3-credited.png`, timeout: 120000, animations: 'disabled' });

  // A second buy, from the exchange's own Buy button, needs no popup.
  await page.locator('[data-layr-amount="2"]').click();
  await page.locator('#layrDispenseButton').click();
  await waitFor(page, async () => chain.broadcasts.length === 2 && ['credited', 'already-credited'].includes((await snap(page)).phase), 60000, 'second buy');
  assert.deepEqual(chain.broadcasts[1], { sender: address, recipient: EXCHANGE, amount: 2n * STX, fee: 3000n, nonce: 1 });

  // Reload: one tap opens the same wallet, and the first buy is NOT repeated.
  await openExchange(page);
  await page.waitForFunction(() => /Open my casino wallet/.test(document.getElementById('lxPlayNow').textContent));
  await page.locator('#lxPlayNow').click();
  await confirmInFrame(page, async () => !!(await snap(page)).address, 'unlock');
  assert.equal((await snap(page)).address, address);
  await page.waitForFunction(() => /Ready/.test(document.getElementById('lxPasskeyStatus').textContent), null, { timeout: 30000 });
  assert.equal(chain.broadcasts.length, 2, 'no second automatic buy');
  assert.equal(chain.faucetCalls.length, 1, 'no faucet call while funded');
  assert.deepEqual(errors, []);
  await context.close();
  console.log('ok 1 · passkey: create → faucet → auto-buy 1,000,000 LAYR → buy again → reload unlocks, no repeat');
}

// ---- 2. a browser with no passkey PRF: the browser-only wallet ----
{
  const { context, page, errors } = await newPlayer({ prf: false });
  await openExchange(page);
  await page.locator('#lxPlayDevice').click();
  await confirmInFrame(page, async () => !!(await snap(page)).address, 'browser-only wallet');
  const address = (await snap(page)).address;
  await waitFor(page, async () => ['credited', 'already-credited'].includes((await snap(page)).phase), 90000, 'device first buy');
  assert.equal(chain.broadcasts.at(-1).sender, address);
  assert.equal(chain.broadcasts.at(-1).amount, 10n * STX);
  assert.deepEqual(errors, []);
  await context.close();
  console.log('ok 2 · no passkey: browser-only wallet → faucet → auto-buy');
}

// ---- 3. flag off: the page is exactly as before ----
{
  const { context, page } = await newPlayer();
  await page.goto(SITE + '/casino/?passkey=0', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForFunction(() => window.ParallaxLAYRExchange, null, { timeout: 120000 });
  await page.evaluate(() => window.ParallaxLAYRExchange.open(0));
  await page.waitForTimeout(1500);
  assert.equal(await page.locator('#lxPasskey').isHidden(), true);
  assert.equal(await page.evaluate(() => !!window.ParallaxPasskeyWallet), false, 'wallet script not loaded');
  assert.equal(await page.locator('#layrConnectWallet').textContent(), 'Connect wallet');
  await context.close();
  console.log('ok 3 · flag off: no casino wallet, page unchanged');
}

// ---- 4. the wallet box answers no other site ----
{
  const { context, page } = await newPlayer();
  await context.route('https://evil.test/**', (route) => route.fulfill({ status: 200, contentType: 'text/html', body: `<iframe id="w" src="${WALLET}/"></iframe>` }));
  await page.goto('https://evil.test/');
  await page.waitForTimeout(1500);
  const frames = page.frames().filter((f) => f.url().startsWith(WALLET));
  // frame-ancestors blocks it: Chrome replaces the frame with an error page, so the wallet never runs there.
  const ran = frames.length ? await frames[0].evaluate(() => !!document.getElementById('idle')).catch(() => false) : false;
  assert.equal(ran, false, 'wallet must not render inside another site');
  await context.close();
  console.log('ok 4 · another site cannot embed the wallet (frame-ancestors)');
}

await browser.close();
console.log('casino wallet browser check passed');
