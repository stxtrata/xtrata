// Visual + flow smoke test of the /radio pay-per-play panel with the real wallet frame.
// Chain and API calls are mocked; no wallet popups, no funds. Stops at the link step,
// which needs a real Xverse/Leather signature.
// Usage: VITE_LISTENING_WALLET_PARENTS=https://radio.xtrata.test npm run build:listening-wallet && npm run build:radio-ppp
//        node scripts/test-radio-ppp-browser.mjs [screenshot-dir]
import { chromium } from 'playwright';
import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const shots = process.argv[2];
const pub = new URL('../public/', import.meta.url), dist = new URL('../dist-listening-wallet/', import.meta.url);
const csp = /Content-Security-Policy: (.+)/.exec(await readFile(new URL('_headers', dist), 'utf8'))[1];
const SITE = 'https://radio.xtrata.test', MAINSITE = 'https://xtrata.test', WALLET = 'https://wallet.xtrata.test';
const MAIN = 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7';
const types = { js: 'text/javascript', mjs: 'text/javascript', css: 'text/css', html: 'text/html', svg: 'image/svg+xml', json: 'application/json' };
const type = (p) => types[p.split('.').pop()] || 'application/octet-stream';
const json = (route, body, status = 200) => route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });

const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH || undefined });
const errors = [];
for (const viewport of [{ width: 1280, height: 1000 }, { width: 390, height: 900 }]) {
  const context = await browser.newContext({ viewport });
  await context.addInitScript(([key, main]) => {
    if (location.origin === 'https://radio.xtrata.test') localStorage.setItem(key, JSON.stringify({ isConnected: true, address: main, network: 'mainnet' }));
  }, ['xtrata.v15.1.wallet.session', MAIN]);
  await context.route('**/*', async (route) => {
    const url = new URL(route.request().url());
    if (url.origin === WALLET) {
      const path = url.pathname === '/' ? 'index.html' : url.pathname.slice(1);
      try { return route.fulfill({ body: await readFile(new URL(path, dist)), headers: { 'content-type': type(path), 'content-security-policy': csp } }); }
      catch { return route.fulfill({ status: 404, body: '' }); }
    }
    if (url.origin !== SITE && url.origin !== MAINSITE) return route.abort();
    if (url.pathname === '/radio/listening-wallet/config')
      return json(route, url.origin === SITE
        ? { enabled: true, allowed: true, here: true, radioUrl: SITE + '/radio.html', canary: true, walletOrigin: WALLET, limits: { playFee: '300', returnFee: '3000', maxSessionPlays: 3000, sessionHours: 168 } }
        : { enabled: true, allowed: false, here: false, radioUrl: SITE + '/radio.html', canary: true, walletOrigin: null, limits: { playFee: '300', returnFee: '3000', maxSessionPlays: 3000, sessionHours: 168 } });
    if (url.pathname === '/radio/listening-wallet/link') return json(route, { links: [] });
    if (url.pathname.startsWith('/hiro/mainnet/v2/accounts/')) return json(route, { balance: '0x0', nonce: 0 });
    if (url.pathname.startsWith('/hiro/') || url.pathname.startsWith('/radio/counts') || url.pathname.startsWith('/radio/chain-likes')) return json(route, {}, 404);
    try { const path = url.pathname.slice(1) || 'index.html'; return route.fulfill({ body: await readFile(new URL(path, pub)), headers: { 'content-type': type(path) } }); }
    catch { return route.fulfill({ status: 404, body: '' }); }
  });
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  page.on('pageerror', (e) => errors.push(e.message));
  const cdp = await context.newCDPSession(page);
  await cdp.send('WebAuthn.enable');
  await cdp.send('WebAuthn.addVirtualAuthenticator', { options: { protocol: 'ctap2', ctap2Version: 'ctap2_1', transport: 'internal', hasResidentKey: true, hasUserVerification: true, isUserVerified: true, hasPrf: true, automaticPresenceSimulation: true } });

  // On the main site the panel only points to the radio host and never loads the wallet.
  await page.goto(MAINSITE + '/radio.html');
  await page.locator('#ppp').getByRole('link', { name: /Open the pay-per-play radio/ }).waitFor();
  assert.equal(await page.locator('.ppp-frame iframe').count(), 0);
  assert.equal(await page.locator('.ppp-steps li').count(), 8);
  assert.match(await page.locator('.ppp-stage').innerText(), /^Stage 1 of 8/);
  if (shots) await page.locator('#ppp').screenshot({ path: `${shots}/ppp-elsewhere-${viewport.width}.png` });

  await page.goto(SITE + '/radio.html');
  const panel = page.locator('#ppp');
  await panel.getByRole('button', { name: 'Turn on pay-per-play' }).waitFor();
  assert.match(await panel.innerText(), /CANARY/);
  assert.match(await panel.locator('.ppp-stage').innerText(), /^Stage 4 of 8 · create your passkey/);
  assert.equal(await panel.locator('.ppp-steps li.done').count(), 3);
  assert.match(await panel.locator('.ppp-steps li[aria-current=step]').innerText(), /4\s*Passkey wallet/);
  if (shots) await panel.screenshot({ path: `${shots}/ppp-intro-${viewport.width}.png` });

  await panel.getByRole('button', { name: 'Turn on pay-per-play' }).click();
  const frame = page.frameLocator('.ppp-frame iframe');
  await frame.locator('#p-warn').waitFor();
  if (shots) await panel.screenshot({ path: `${shots}/ppp-create-${viewport.width}.png` });
  for (let i = 0; i < 8; i++) {
    if (await panel.getByRole('button', { name: 'Link to my wallet' }).isVisible()) break;
    await frame.locator('#p-ok').click();
    await page.waitForTimeout(600);
  }
  try { await panel.getByRole('button', { name: 'Link to my wallet' }).waitFor(); }
  catch (e) { if (shots) await page.screenshot({ path: `${shots}/ppp-fail-${viewport.width}.png`, fullPage: true }); console.log('frame error:', await frame.locator('#p-error').innerText().catch(() => '?')); throw e; }
  assert.match(await frame.locator('#idle').innerText(), /Unlocked · SP/);
  assert.match(await panel.locator('.ppp-stage').innerText(), /^Stage 5 of 8 · link/);
  if (shots) await panel.screenshot({ path: `${shots}/ppp-link-${viewport.width}.png` });
  // One-tap unlock: a returning listener's first tap in the frame goes straight to the passkey.
  await page.reload();
  await panel.getByText(/It goes straight to your passkey/).waitFor();
  assert.match(await panel.locator('.ppp-stage').innerText(), /^Stage 4 of 8 · unlock/);
  await frame.locator('#p-ok', { hasText: 'Unlock and keep paying' }).waitFor();
  assert.equal(await panel.getByRole('button', { name: 'Unlock and keep paying' }).count(), 0); // no page button to click first
  if (shots) await panel.screenshot({ path: `${shots}/ppp-armed-${viewport.width}.png` });
  await page.waitForTimeout(900); // the frame's arming delay
  await frame.locator('#p-ok').click(); // the one tap: the virtual authenticator answers the passkey prompt
  await panel.getByRole('button', { name: 'Link to my wallet' }).waitFor();
  assert.match(await frame.locator('#idle').innerText(), /Unlocked · SP/);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  assert.ok(overflow <= 1, `no horizontal scroll at ${viewport.width}px (${overflow})`);
  await context.close();
}
await browser.close();
const relevant = errors.filter((e) => !/radio|catalogue|counts|Failed to fetch|NetworkError|JSON/i.test(e));
assert.deepEqual(relevant, []);
console.log('radio pay-per-play panel check passed');
