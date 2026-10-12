// Visual + flow smoke test of the /radio pay-per-play panel with the real wallet frame.
// Chain and API calls are mocked; no wallet popups, no funds. The main wallet is a throwaway key made
// here: its link signature is served as if saved from another device, so the flow reaches paying.
// Usage: VITE_LISTENING_WALLET_PARENTS=https://radio.xtrata.test npm run build:listening-wallet && npm run build:radio-ppp
//        node scripts/test-radio-ppp-browser.mjs [screenshot-dir]
import { chromium } from 'playwright';
import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { createRequire } from 'node:module';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { getAddressFromPrivateKey, makeRandomPrivKey, privateKeyToString, TransactionVersion } from '@stacks/transactions';

// The real link signer, bundled from source, with a disposable key that never holds funds.
const linkOut = join(await mkdtemp(join(tmpdir(), 'ppp-link-')), 'link.cjs');
await build({ entryPoints: [new URL('../src/lib/listening-wallet/link.ts', import.meta.url).pathname], bundle: true, format: 'cjs', platform: 'node', outfile: linkOut, logLevel: 'silent' });
const { signLink } = createRequire(import.meta.url)(linkOut);
const mainKey = privateKeyToString(makeRandomPrivKey()).slice(0, 64) + '01';

const shots = process.argv[2];
const pub = new URL('../public/', import.meta.url), dist = new URL('../dist-listening-wallet/', import.meta.url);
const csp = /Content-Security-Policy: (.+)/.exec(await readFile(new URL('_headers', dist), 'utf8'))[1];
const SITE = 'https://radio.xtrata.test', MAINSITE = 'https://xtrata.test', WALLET = 'https://wallet.xtrata.test';
const MAIN = getAddressFromPrivateKey(mainKey, TransactionVersion.Mainnet);
const types = { js: 'text/javascript', mjs: 'text/javascript', css: 'text/css', html: 'text/html', svg: 'image/svg+xml', json: 'application/json' };
const type = (p) => types[p.split('.').pop()] || 'application/octet-stream';
const json = (route, body, status = 200) => route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });

const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH || undefined });
const errors = [];
for (const viewport of [{ width: 1280, height: 1000 }, { width: 390, height: 900 }]) {
  const context = await browser.newContext({ viewport, permissions: ['clipboard-read', 'clipboard-write'] });
  const chain = { balance: 0n, links: [] };
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
    if (url.pathname === '/radio/listening-wallet/link') return json(route, { links: chain.links });
    if (url.pathname.startsWith('/hiro/mainnet/v2/accounts/')) return json(route, { balance: '0x' + chain.balance.toString(16), nonce: 0 });
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
  assert.equal(await page.locator('.ppp-steps li').count(), 4);
  assert.match(await page.locator('.ppp-stage').innerText(), /^Step 1 of 4/);
  if (shots) await page.locator('#ppp').screenshot({ path: `${shots}/ppp-elsewhere-${viewport.width}.png` });

  await page.goto(SITE + '/radio.html');
  const panel = page.locator('#ppp');
  await panel.getByRole('button', { name: 'Turn on pay-per-play' }).waitFor();
  assert.match(await panel.innerText(), /SETUP HELPER/);
  assert.match(await panel.locator('.ppp-stage').innerText(), /^Step 2 of 4 · create your passkey/);
  assert.equal(await panel.locator('.ppp-steps li.done').count(), 1);
  assert.match(await panel.locator('.ppp-steps li[aria-current=step]').innerText(), /2\s*Passkey/);
  if (shots) await panel.screenshot({ path: `${shots}/ppp-intro-${viewport.width}.png` });

  await panel.getByRole('button', { name: 'Turn on pay-per-play' }).click();
  const frame = page.frameLocator('.ppp-frame iframe');
  // A listener scrolls the wallet box to the middle of the screen, clear of the radio's fixed player bar.
  const showConfirm = async () => {
    await page.locator('.ppp-frame').evaluate((el) => el.scrollIntoView({ block: 'center' })).catch(() => {});
    await frame.locator('#p-ok').evaluate((el) => el.scrollIntoView({ block: 'center' })).catch(() => {});
  };
  await frame.locator('#p-summary').waitFor();
  assert.match(await frame.locator('#p-summary').innerText(), /Keep no more than 1 STX/); // the key warning stays visible
  assert.equal(await frame.locator('#p-more').getAttribute('open'), null); // the rest is folded under Details
  if (shots) await panel.screenshot({ path: `${shots}/ppp-create-${viewport.width}.png` });
  // Create, confirm and re-check the passkey: three confirms, each enabled only once steadily visible.
  for (const until = Date.now() + 45_000; Date.now() < until;) {
    if (await panel.getByRole('button', { name: 'Link to my wallet' }).isVisible()) break;
    if (!(await frame.locator('#panel').isVisible().catch(() => false))) { await page.waitForTimeout(300); continue; }
    // Like a listener: bring the confirm into view, wait for it to enable, then tap.
    await showConfirm();
    await frame.locator('#p-ok:not([disabled])').waitFor({ timeout: 5000 }).catch(() => {});
    await frame.locator('#p-ok').click({ timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(600);
  }
  try { await panel.getByRole('button', { name: 'Link to my wallet' }).waitFor(); }
  catch (e) { if (shots) await page.screenshot({ path: `${shots}/ppp-fail-${viewport.width}.png`, fullPage: true }); console.log('frame error:', await frame.locator('#p-error').innerText().catch(() => '?')); throw e; }
  assert.match(await frame.locator('#idle').innerText(), /Unlocked · SP/);
  assert.match(await panel.locator('.ppp-stage').innerText(), /^Step 3 of 4 · link/);
  if (shots) await panel.screenshot({ path: `${shots}/ppp-link-${viewport.width}.png` });
  // One-tap unlock: a returning listener's first tap in the frame goes straight to the passkey.
  await page.reload();
  await panel.getByText(/It goes straight to your passkey/).waitFor();
  assert.match(await panel.locator('.ppp-stage').innerText(), /^Step 2 of 4 · unlock/); // not linked yet in this test, so still first-time setup
  await frame.locator('#p-ok', { hasText: 'Unlock and keep paying' }).waitFor();
  assert.equal(await panel.getByRole('button', { name: 'Unlock and keep paying' }).count(), 0); // no page button to click first
  if (shots) await panel.screenshot({ path: `${shots}/ppp-armed-${viewport.width}.png` });
  await showConfirm();
  await frame.locator('#p-ok:not([disabled])').waitFor(); // enabled once up, and fully visible, for the arming delay
  await frame.locator('#p-ok').click(); // the one tap: the virtual authenticator answers the passkey prompt
  try { await panel.getByRole('button', { name: 'Link to my wallet' }).waitFor(); }
  catch (e) { console.log('one-tap frame error:', await frame.locator('#p-error').innerText().catch(() => '?'), '| page:', await panel.locator('.ppp-err, .ppp-msg').allInnerTexts().catch(() => '?')); throw e; }
  assert.match(await frame.locator('#idle').innerText(), /Unlocked · SP/);

  // Link (signature as if saved on another device: confirmed in the wallet box), fund, then paying.
  await panel.locator('.ppp-wallets').evaluate((d) => { d.open = true; });
  await panel.locator('.ppp-facts').getByRole('button', { name: 'Copy' }).click();
  const listening = await page.evaluate(() => navigator.clipboard.readText());
  assert.match(listening, /^SP[0-9A-Z]{30,40}$/);
  const issued = Date.now();
  chain.links = [{ listening, issued, mainSignature: signLink({ main: MAIN, listening, issued }, mainKey) }];
  chain.balance = 1_000_000n;
  await panel.locator('.ppp-wallets').evaluate((d) => { d.open = false; });
  await panel.getByRole('button', { name: /Link to my wallet|Confirm my wallet/ }).click();
  await frame.locator('#p-ok', { hasText: 'This is my wallet' }).waitFor();
  await showConfirm();
  await frame.locator('#p-ok:not([disabled])').waitFor();
  await frame.locator('#p-ok').click();
  await panel.getByRole('button', { name: 'Switch off' }).waitFor();
  // First time: the last step waits for the first paid play.
  assert.match(await panel.locator('.ppp-stage').innerText(), /^Step 4 of 4 · listen to a song for 30 seconds/);
  if (shots) await panel.screenshot({ path: `${shots}/ppp-first-${viewport.width}.png` });
  // Once a paid play has confirmed (as stored by the panel), the steps go away for good.
  await page.evaluate(([who]) => {
    localStorage.setItem('xtrata.ppp.v1.entries:' + who, JSON.stringify([{ id: 'a'.repeat(32), address: who, kind: 'play', core: 3, song: 2978, recipient: 'SP3JB6ABCDEFGHJKMNPQRSTVWXYZ012DWHX', amount: '50', fee: '300', nonce: '0', created: Date.now(), status: 'confirmed', txid: '0x' + 'b'.repeat(64), title: 'SuperUser', artist: 'melophonic' }]));
    window.dispatchEvent(new Event('xtrata:wallet-changed'));
  }, [listening]);
  await panel.locator('.ppp-steps').waitFor({ state: 'hidden' });
  // Set up: no steps, no badge, one line with plays left and balance, one button.
  assert.equal(await panel.locator('.ppp-steps').isVisible(), false);
  assert.equal(await panel.locator('.ppp-badge').isVisible(), false);
  assert.match(await panel.locator('.ppp-key').innerText(), /^Paying as you listen · up to [\d,]+ plays left · 1\.000000 STX$/);
  assert.deepEqual(await panel.locator('.ppp-actions').first().getByRole('button').allInnerTexts(), ['Switch off']);
  assert.equal(await panel.locator('.ppp-frame-label').isVisible(), false);
  if (shots) await panel.screenshot({ path: `${shots}/ppp-ready-${viewport.width}.png` });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  assert.ok(overflow <= 1, `no horizontal scroll at ${viewport.width}px (${overflow})`);
  await context.close();
}
await browser.close();
const relevant = errors.filter((e) => !/radio|catalogue|counts|Failed to fetch|NetworkError|JSON/i.test(e));
assert.deepEqual(relevant, []);
console.log('radio pay-per-play panel check passed');
