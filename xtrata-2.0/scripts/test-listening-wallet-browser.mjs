// Real-browser check of the listening wallet origin: CSP, cross-origin iframe passkeys (Chrome's
// virtual authenticator with PRF), the bridge, and frame-ancestors. No network, no funds.
// Usage: VITE_LISTENING_WALLET_PARENTS=https://radio.xtrata.test npm run build:listening-wallet
//        node scripts/test-listening-wallet-browser.mjs
import { chromium } from 'playwright';
import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { deserializeTransaction } from '@stacks/transactions';

const dist = new URL('../dist-listening-wallet/', import.meta.url);
const headersFile = await readFile(new URL('_headers', dist), 'utf8');
const csp = /Content-Security-Policy: (.+)/.exec(headersFile)[1];
assert.match(csp, /frame-ancestors https:\/\/radio\.xtrata\.test/, 'build with VITE_LISTENING_WALLET_PARENTS=https://radio.xtrata.test');

const WALLET = 'https://wallet.xtrata.test', PARENT = 'https://radio.xtrata.test', EVIL = 'https://evil.test';
const parentPage = (walletOrigin) => `<!doctype html><meta charset="utf-8"><body>
<iframe id="w" allow="publickey-credentials-get ${walletOrigin}; publickey-credentials-create ${walletOrigin}" src="${walletOrigin}/" style="width:480px;height:300px"></iframe>
<script>
const pending=new Map();
addEventListener('message',e=>{if(e.origin!=='${walletOrigin}'||e.data?.protocol!=='xtrata.wallet.bridge.v1')return;const p=pending.get(e.data.id);if(p){pending.delete(e.data.id);e.data.ok?p.res(e.data.result):p.rej(new Error(e.data.error?.message));}});
window.ask=(method,params)=>new Promise((res,rej)=>{const id=crypto.randomUUID().replaceAll('-','');pending.set(id,{res,rej});document.getElementById('w').contentWindow.postMessage({protocol:'xtrata.wallet.bridge.v1',kind:'request',id,method,params},'${walletOrigin}');});
window.loaded=new Promise(r=>document.getElementById('w').addEventListener('load',r));
</script>`;

const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH || undefined });
const context = await browser.newContext();
const errors = [], consoleLines = [];
await context.route('**/*', async (route) => {
  const url = new URL(route.request().url());
  if (url.origin === WALLET) {
    const path = url.pathname === '/' ? 'index.html' : url.pathname.slice(1);
    try {
      const body = await readFile(new URL(path, dist));
      const type = path.endsWith('.js') ? 'text/javascript' : path.endsWith('.css') ? 'text/css' : 'text/html';
      return route.fulfill({ status: 200, body, headers: { 'content-type': type, 'content-security-policy': csp, 'x-content-type-options': 'nosniff' } });
    } catch { return route.fulfill({ status: 404, body: '' }); }
  }
  if (url.origin === PARENT || url.origin === EVIL) return route.fulfill({ status: 200, contentType: 'text/html', body: parentPage(WALLET) });
  return route.abort();
});

const page = await context.newPage();
page.setDefaultTimeout(15000);
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => consoleLines.push(m.text()));
const cdp = await context.newCDPSession(page);
await cdp.send('WebAuthn.enable');
const { authenticatorId } = await cdp.send('WebAuthn.addVirtualAuthenticator', {
  options: { protocol: 'ctap2', ctap2Version: 'ctap2_1', transport: 'internal', hasResidentKey: true, hasUserVerification: true, isUserVerified: true, hasPrf: true, automaticPresenceSimulation: true }
});

await page.goto(PARENT + '/');
await page.evaluate(() => window.loaded);
const frame = page.frameLocator('#w');
const ask = (method, params) => page.evaluate(([m, p]) => window.ask(m, p), [method, params]);
const clickThrough = async (pending) => {
  // Each wallet panel is confirmed INSIDE the frame (user activation for WebAuthn).
  // A click right after the panel appears can be refused (arming delay / visibility), so retry.
  for (let i = 0; i < 20; i++) {
    const done = await Promise.race([pending.then(() => true, () => true), new Promise((r) => setTimeout(() => r(false), 500))]);
    if (done) break;
    const ok = frame.locator('#p-ok');
    if (await ok.isVisible() && await ok.isEnabled()) await ok.click({ timeout: 2000 }).catch(() => {});
  }
  return pending;
};

assert.deepEqual(await ask('listening.status'), { state: 'none', session: null });
const created = await clickThrough(ask('listening.unlock', { mode: 'create' }));
assert.match(created.address, /^SP/);
console.log('created', created.address);
const status = await ask('listening.status');
assert.equal(status.state, 'unlocked');
const stored = await frame.locator('body').evaluate(() => JSON.stringify(localStorage));
assert.ok(stored.includes(created.address) && !/privateKey|prf/i.test(stored), 'only public records stored');

await ask('listening.lock');
assert.equal((await ask('listening.status')).state, 'known');
const terms = { fee: '300', maxPlays: 2, budget: '700', expires: Date.now() + 3600_000 };
const unlocked = await clickThrough(ask('listening.unlock', { mode: 'unlock', terms }));
assert.equal(unlocked.address, created.address, 'same passkey derives the same wallet');
assert.equal(unlocked.session.playsLeft, 2);

const signed = await ask('listening.signPlay', { core: 3, song: 42, receipt: 'ab'.repeat(16), fee: '300', nonce: '0', balance: '500000' });
const tx = deserializeTransaction(signed.raw);
assert.equal('0x' + tx.txid(), signed.txid);
assert.equal(tx.payload.functionName.content, 'play');
assert.equal(tx.postConditions.values[0].amount, 50n);

// Cancelling in the frame signs nothing.
const outcome = (p) => p.then(() => 'resolved', (e) => e.message); // settle now: no unhandled rejection
const cancelled = outcome(ask('listening.approveSession', terms));
await frame.locator('#p-cancel').click();
assert.match(await cancelled, /Cancelled/);

// Clickjacking guard: a faded/overlaid frame cannot be confirmed (IntersectionObserver v2).
await page.evaluate(() => { document.getElementById('w').style.opacity = '0.3'; });
const hidden = outcome(ask('listening.approveSession', terms));
await page.waitForTimeout(1200);
await frame.locator('#p-ok').click();
assert.match(await frame.locator('#p-error').innerText(), /hidden/);
await page.evaluate(() => { document.getElementById('w').style.opacity = '1'; });
await frame.locator('#p-cancel').click();
assert.match(await hidden, /Cancelled/);

// A different parent origin is refused twice over: CSP frame-ancestors blocks the frame,
// and the bridge allowlist would ignore it anyway.
const evil = await context.newPage();
await evil.goto(EVIL + '/');
await evil.waitForTimeout(1500);
const evilAnswer = await evil.evaluate(() => Promise.race([window.ask('listening.status'), new Promise((r) => setTimeout(() => r('no-answer'), 2000))]));
assert.equal(evilAnswer, 'no-answer');

const cspViolations = consoleLines.filter((l) => /Content Security Policy|Refused to/i.test(l) && !/frame-ancestors/.test(l));
assert.deepEqual(cspViolations, [], 'wallet bundle runs under its strict CSP');
assert.deepEqual(errors, []);
await cdp.send('WebAuthn.removeVirtualAuthenticator', { authenticatorId });
await browser.close();
console.log('listening wallet browser check passed');
