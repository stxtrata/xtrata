// Browser check of making the listening-wallet passkey in a new tab (the WebKit path), in Chromium with an
// iPhone Safari user agent and a virtual passkey. Covers what Chromium can reproduce:
//  - "Turn on pay-per-play" shows "Make my passkey (new tab)" instead of creating inside the frame
//  - the tap opens wallet.xtrata.xyz/create in a new tab with a valid request, and the frame waits ("Made your passkey?")
//  - the create page makes the passkey (user id and name as requested) and says to go back
// Chromium's virtual authenticators are per tab, so signing in in the frame with the passkey made in the other tab
// cannot be reproduced here: that part is covered by the engine tests and checked on a real iPhone.
// Usage: VITE_LISTENING_WALLET_PARENTS=https://radio.xtrata.test npm run build:listening-wallet && npm run build:radio-ppp
//        node scripts/test-listening-wallet-new-tab-browser.mjs
import { chromium } from 'playwright';
import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const pub = new URL('../public/', import.meta.url), dist = new URL('../dist-listening-wallet/', import.meta.url);
const csp = /Content-Security-Policy: (.+)/.exec(await readFile(new URL('_headers', dist), 'utf8'))[1];
const SITE = 'https://radio.xtrata.test', WALLET = 'https://wallet.xtrata.test';
const IPHONE = 'Mozilla/5.0 (iPhone; CPU iPhone OS 26_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1';
const types = { js: 'text/javascript', css: 'text/css', html: 'text/html', svg: 'image/svg+xml', json: 'application/json' };
const type = (p) => types[p.split('.').pop()] || 'application/octet-stream';
const json = (route, body, status = 200) => route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });
const limits = { playFee: '300', returnFee: '3000', maxSessionPlays: 3000, sessionHours: 168 };

const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH || undefined });
const errors = [];
const context = await browser.newContext({ viewport: { width: 390, height: 900 }, userAgent: IPHONE });
await context.route('**/*', async (route) => {
  const url = new URL(route.request().url());
  if (url.origin === WALLET) {
    // Cloudflare Pages serves /create from create.html.
    const path = url.pathname === '/' ? 'index.html' : url.pathname === '/create' ? 'create.html' : url.pathname.slice(1);
    try { return route.fulfill({ body: await readFile(new URL(path, dist)), headers: { 'content-type': type(path), 'content-security-policy': csp } }); }
    catch { return route.fulfill({ status: 404, body: '' }); }
  }
  if (url.origin !== SITE) return route.abort();
  if (url.pathname === '/radio/listening-wallet/config')
    return json(route, { enabled: true, allowed: false, here: true, radioUrl: SITE + '/radio.html', canary: true, walletOrigin: WALLET, passkeyOnly: true, limits, gifts: { enabled: false } });
  if (url.pathname.startsWith('/hiro/mainnet/v2/accounts/')) return json(route, { balance: '0x0', nonce: 0 });
  if (url.pathname.startsWith('/hiro/') || ['/radio/counts', '/radio/chain-likes', '/radio/gift', '/radio/listening-wallet/link'].some((p) => url.pathname.startsWith(p))) return json(route, {}, 404);
  try { const path = url.pathname.slice(1) || 'index.html'; return route.fulfill({ body: await readFile(new URL(path, pub)), headers: { 'content-type': type(path) } }); }
  catch { return route.fulfill({ status: 404, body: '' }); }
});
const page = await context.newPage();
page.setDefaultTimeout(15000);
page.on('pageerror', (e) => errors.push(e.message));
await page.goto(SITE + '/radio.html');
const panel = page.locator('#ppp');
await panel.getByRole('button', { name: 'Turn on pay-per-play · no wallet needed' }).click();
const frame = page.frameLocator('.ppp-frame iframe');
const ok = frame.locator('#p-ok');
await ok.filter({ hasText: 'Make my passkey (new tab)' }).waitFor();
await page.waitForTimeout(1200); // the confirm button arms after 0.8 s
const [tab] = await Promise.all([context.waitForEvent('page'), ok.click()]);
await frame.locator('#p-title', { hasText: 'Made your passkey?' }).waitFor();
const summary = await frame.locator('#p-summary').innerText();
const name = /choose "(Xtrata listening wallet · [0-9A-F]{4})"/.exec(summary)?.[1];
assert.ok(name, `the frame names the passkey to choose (${summary})`);

// The new tab: a top-level wallet page with its own passkey.
tab.on('pageerror', (e) => errors.push(e.message));
await tab.waitForLoadState();
assert.equal(new URL(tab.url()).origin, WALLET);
assert.equal(await tab.evaluate(() => window.opener), null, 'no opener link back to the radio');
assert.equal(new URL(tab.url()).hash, '', 'the request leaves the address bar');
assert.equal(await tab.locator('#c-name').innerText(), `It will be named “${name}”.`);
const cdp = await context.newCDPSession(tab);
await cdp.send('WebAuthn.enable');
const { authenticatorId } = await cdp.send('WebAuthn.addVirtualAuthenticator', { options: { protocol: 'ctap2', ctap2Version: 'ctap2_1', transport: 'internal', hasResidentKey: true, hasUserVerification: true, isUserVerified: true, hasPrf: true, automaticPresenceSimulation: true } });
await tab.getByRole('button', { name: 'Create passkey' }).click();
await tab.getByText('Passkey saved ✓').waitFor();
const { credentials } = await cdp.send('WebAuthn.getCredentials', { authenticatorId });
assert.equal(credentials.length, 1, 'one passkey made');
assert.equal(credentials[0].rpId, 'wallet.xtrata.test');
assert.ok(credentials[0].isResidentCredential, 'discoverable, so the frame can offer it');
assert.ok(credentials[0].userHandle, 'carries the user id the frame asked for');

// A bad or edited request makes nothing.
const bad = await context.newPage();
await bad.goto(WALLET + '/create#' + new URLSearchParams({ u: 'x', n: 'Your bank · ABCD' }));
await bad.getByText('This link is not complete').waitFor();
assert.equal(await bad.getByRole('button', { name: 'Create passkey' }).isVisible(), false);

await browser.close();
assert.deepEqual(errors, []);
console.log('listening wallet new-tab check passed');
