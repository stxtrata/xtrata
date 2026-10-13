// Browser check of radio gift wallets with the real wallet frame and a virtual passkey:
//  - a visitor with no Stacks wallet opens a gift link, taps once, and the gift is claimed for the new
//    listening wallet automatically (gift endpoints and chain are mocked; nothing is signed by a treasury)
//  - the gift code leaves the address bar at once
//  - a connected wallet sees "Gift Stacks music" (slider, plays), and the admin also sees campaign links
// Usage: VITE_LISTENING_WALLET_PARENTS=https://radio.xtrata.test npm run build:listening-wallet && npm run build:radio-ppp
//        node scripts/test-radio-gift-browser.mjs [screenshot-dir]
import { chromium } from 'playwright';
import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { getAddressFromPrivateKey, makeRandomPrivKey, privateKeyToString, TransactionVersion } from '@stacks/transactions';

const shots = process.argv[2];
const pub = new URL('../public/', import.meta.url), dist = new URL('../dist-listening-wallet/', import.meta.url);
const csp = /Content-Security-Policy: (.+)/.exec(await readFile(new URL('_headers', dist), 'utf8'))[1];
const SITE = 'https://radio.xtrata.test', WALLET = 'https://wallet.xtrata.test';
const addr = () => getAddressFromPrivateKey(privateKeyToString(makeRandomPrivKey()).slice(0, 64) + '01', TransactionVersion.Mainnet);
const GIFTER = addr(), ADMIN = addr(), TREASURY = addr();
const CODE = 'AbCdEfGhIjKlMnOpQrStUv';
const GIFT_TX = '0x' + 'e'.repeat(64);
const types = { js: 'text/javascript', mjs: 'text/javascript', css: 'text/css', html: 'text/html', svg: 'image/svg+xml', json: 'application/json' };
const type = (p) => types[p.split('.').pop()] || 'application/octet-stream';
const json = (route, body, status = 200) => route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });
const limits = { playFee: '300', returnFee: '3000', maxSessionPlays: 3000, sessionHours: 168 };

const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH || undefined });
const errors = [];
for (const viewport of [{ width: 1280, height: 1000 }, { width: 390, height: 900 }]) {
  // ---- the recipient: no Stacks wallet at all
  const context = await browser.newContext({ viewport });
  const state = { balance: 0n, claims: [], mined: false, claimed: null, leaked: false, busyOnce: viewport.width > 1000, busySeen: false };
  await context.route('**/*', async (route) => {
    const url = new URL(route.request().url());
    if (url.origin === WALLET) {
      const path = url.pathname === '/' ? 'index.html' : url.pathname.slice(1);
      try { return route.fulfill({ body: await readFile(new URL(path, dist)), headers: { 'content-type': type(path), 'content-security-policy': csp } }); }
      catch { return route.fulfill({ status: 404, body: '' }); }
    }
    if (url.origin !== SITE) return route.abort();
    if (url.pathname === '/radio/listening-wallet/config')
      return json(route, { enabled: true, allowed: false, here: true, radioUrl: SITE + '/radio.html', canary: true, walletOrigin: WALLET, passkeyOnly: true, limits,
        gifts: { enabled: true, treasury: TREASURY, turnstileSiteKey: null, admin: false, fee: '3000' } });
    if (url.search.includes('gift')) state.leaked = true; // the code must never reach the server in a URL
    if (url.pathname === '/radio/gift/status') {
      assert.equal(JSON.parse(route.request().postData()).code, CODE);
      return json(route, { status: state.claimed ? 'claiming' : 'live', amount: '250000', source: 'friend', from: GIFTER, label: '', expires: Date.now() + 86400000 });
    }
    if (url.pathname === '/radio/gift/for') return json(route, { gift: state.claimed === url.searchParams.get('wallet') ? { returnTo: GIFTER, from: GIFTER, source: 'friend', amount: '250000', txid: GIFT_TX, label: '' } : null });
    if (url.pathname === '/radio/gift/claim') {
      const body = JSON.parse(route.request().postData());
      // The treasury is busy with someone else's gift once: the page waits and tries again by itself.
      if (state.busyOnce) { state.busyOnce = false; state.busySeen = true; return json(route, { error: 'The gift treasury is sending another gift. Trying again in a moment…' }, 503); }
      state.claims.push(body); state.claimed = body.wallet;
      return json(route, { txid: GIFT_TX, amount: '250000', already: false });
    }
    if (url.pathname.startsWith('/hiro/mainnet/v2/accounts/')) return json(route, { balance: '0x' + state.balance.toString(16), nonce: 0 });
    if (url.pathname === `/hiro/mainnet/extended/v1/tx/${GIFT_TX}`) return state.mined ? json(route, { tx_status: 'success', canonical: true, is_unanchored: false }) : json(route, {}, 404);
    if (url.pathname.startsWith('/hiro/') || url.pathname.startsWith('/radio/counts') || url.pathname.startsWith('/radio/chain-likes')) return json(route, {}, 404);
    try { const path = url.pathname.slice(1) || 'index.html'; return route.fulfill({ body: await readFile(new URL(path, pub)), headers: { 'content-type': type(path) } }); }
    catch { return route.fulfill({ status: 404, body: '' }); }
  });
  // "Not now" puts the gift aside: the link is forgotten on this device, and the usual choices come back.
  {
    const aside = await context.newPage();
    aside.setDefaultTimeout(15000);
    aside.on('pageerror', (e) => errors.push(e.message));
    await aside.goto(`${SITE}/radio.html#gift=${CODE}`);
    const p = aside.locator('#ppp');
    await p.getByText(/sent you 0\.25 STX/).waitFor();
    await p.getByRole('button', { name: 'I already have a listening wallet' }).waitFor();
    await p.getByRole('button', { name: 'Not now' }).click();
    await p.getByRole('button', { name: 'Turn on pay-per-play · no wallet needed' }).waitFor();
    assert.equal(await p.getByText(/sent you 0\.25 STX/).count(), 0, 'the gift banner is gone');
    assert.equal(await aside.evaluate(() => localStorage.getItem('xtrata.radio.gift.incoming.v1')), null, 'forgotten on this device');
    assert.equal(state.claims.length, 0, 'putting it aside claims nothing');
    await aside.close();
  }
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  page.on('pageerror', (e) => errors.push(e.message));
  const cdp = await context.newCDPSession(page);
  await cdp.send('WebAuthn.enable');
  await cdp.send('WebAuthn.addVirtualAuthenticator', { options: { protocol: 'ctap2', ctap2Version: 'ctap2_1', transport: 'internal', hasResidentKey: true, hasUserVerification: true, isUserVerified: true, hasPrf: true, automaticPresenceSimulation: true } });

  await page.goto(`${SITE}/radio.html#gift=${CODE}`);
  const panel = page.locator('#ppp');
  await panel.getByText(/sent you 0\.25 STX of on-chain music: about 705 paid plays/).waitFor();
  assert.equal(new URL(page.url()).hash, '', 'the gift code leaves the address bar');
  assert.ok(await page.evaluate(() => localStorage.getItem('xtrata.radio.gift.incoming.v1')), 'kept on this device until claimed');
  if (shots) await page.screenshot({ path: `${shots}/gift-landing-${viewport.width}.png`, fullPage: true });

  await panel.getByRole('button', { name: 'Claim my gift · no wallet needed' }).click();
  const frame = page.frameLocator('.ppp-frame iframe');
  const showConfirm = async () => {
    await page.locator('.ppp-frame').evaluate((el) => el.scrollIntoView({ block: 'center' })).catch(() => {});
    await frame.locator('#p-ok').evaluate((el) => el.scrollIntoView({ block: 'center' })).catch(() => {});
  };
  // Create, confirm and re-check the passkey, then the gift is claimed by itself.
  for (const until = Date.now() + 60_000; Date.now() < until;) {
    if (state.claims.length) break;
    if (!(await frame.locator('#panel').isVisible().catch(() => false))) { await page.waitForTimeout(300); continue; }
    await showConfirm();
    await frame.locator('#p-ok:not([disabled])').waitFor({ timeout: 5000 }).catch(() => {});
    await frame.locator('#p-ok').click({ timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(600);
  }
  await page.waitForFunction(() => document.querySelector('#ppp .ppp-key')?.textContent?.includes('Funds on their way'), null, { timeout: 30000 });
  assert.equal(state.busySeen, viewport.width > 1000, 'waited for the treasury and retried by itself');
  assert.equal(state.leaked, false, 'the gift code never appeared in a request URL');
  assert.equal(state.claims.length, 1, 'claimed exactly once');
  assert.match(state.claims[0].wallet, /^SP[0-9A-Z]{30,40}$/);
  assert.equal(state.claims[0].code, CODE);
  assert.equal(await page.evaluate(() => localStorage.getItem('xtrata.radio.gift.incoming.v1')), null, 'forgotten once claimed');
  if (shots) await page.screenshot({ path: `${shots}/gift-claimed-${viewport.width}.png`, fullPage: true });
  // It lands: paying starts, and returns go to the friend who paid for it.
  state.balance = 250_000n; state.mined = true;
  await page.evaluate(() => window.dispatchEvent(new Event('xtrata:wallet-changed')));
  await panel.locator('.ppp-key', { hasText: /Paying as you listen/ }).waitFor({ timeout: 20000 });
  await panel.locator('.ppp-wallets').evaluate((d) => { d.open = true; });
  await panel.locator('.ppp-facts', { hasText: GIFTER }).waitFor({ timeout: 20000 });
  await context.close();

  // ---- a listener with a Stacks wallet, who is also the admin: gift a friend, make campaign links
  const giver = await browser.newContext({ viewport, permissions: ['clipboard-read', 'clipboard-write'] });
  const GIFT_ID = 'a'.repeat(24), MY_CODE = 'ZyXwVuTsRqPoNmLkJiHgFe';
  await giver.addInitScript(([key, main, mine, id, code]) => {
    localStorage.setItem(key, JSON.stringify({ isConnected: true, address: main, network: 'mainnet' }));
    // one friend gift already paid for: its link can be copied and shared
    localStorage.setItem(mine, JSON.stringify([{ id, code, amount: '250000', at: Date.now(), txid: '0x' + 'b'.repeat(64) }]));
  }, ['xtrata.v15.1.wallet.session', ADMIN, 'xtrata.radio.gift.mine.v1:' + ADMIN, GIFT_ID, MY_CODE]);
  await giver.route('**/*', async (route) => {
    const url = new URL(route.request().url());
    if (url.origin === WALLET) {
      const path = url.pathname === '/' ? 'index.html' : url.pathname.slice(1);
      try { return route.fulfill({ body: await readFile(new URL(path, dist)), headers: { 'content-type': type(path), 'content-security-policy': csp } }); }
      catch { return route.fulfill({ status: 404, body: '' }); }
    }
    if (url.origin !== SITE) return route.abort();
    if (url.pathname === '/radio/listening-wallet/config')
      return json(route, { enabled: true, allowed: true, here: true, radioUrl: SITE + '/radio.html', canary: true, walletOrigin: WALLET, passkeyOnly: true, limits,
        gifts: { enabled: true, treasury: TREASURY, turnstileSiteKey: null, admin: true, fee: '3000' } });
    if (url.pathname === '/radio/listening-wallet/link') return json(route, { links: [] });
    if (url.pathname === '/radio/gift/confirm' || url.pathname === '/radio/gift') return json(route, { status: 'live', amount: '250000', source: 'friend', from: ADMIN, label: '', expires: Date.now() + 86400000 });
    if (url.pathname.startsWith('/hiro/') || url.pathname.startsWith('/radio/counts') || url.pathname.startsWith('/radio/chain-likes')) return json(route, {}, 404);
    try { const path = url.pathname.slice(1) || 'index.html'; return route.fulfill({ body: await readFile(new URL(path, pub)), headers: { 'content-type': type(path) } }); }
    catch { return route.fulfill({ status: 404, body: '' }); }
  });
  const gp = await giver.newPage();
  gp.on('pageerror', (e) => errors.push(e.message));
  await gp.goto(SITE + '/radio.html');
  const fold = gp.locator('#ppp .ppp-gifts');
  await fold.waitFor({ state: 'attached' });
  await gp.waitForFunction(() => !document.querySelector('#ppp .ppp-gifts')?.hidden);
  await fold.evaluate((d) => { d.open = true; });
  await fold.getByRole('button', { name: 'Gift 0.25 STX' }).waitFor();
  await fold.locator('input[type=range]').fill('500000');
  assert.match(await fold.locator('.ppp-gift-amount').innerText(), /^0\.5 STX · about 1,420 paid plays · you pay 0\.503 STX/);
  await fold.getByRole('button', { name: 'Gift 0.5 STX' }).waitFor();
  await fold.getByRole('button', { name: 'Sign and make links' }).waitFor();
  // Copy and Share answer the click: the label changes and the button turns green for a moment.
  const copyLink = fold.getByRole('button', { name: 'Copy link' });
  await copyLink.waitFor();
  await copyLink.click();
  const copied = fold.locator('button[data-feedback^="gift-copy:"]');
  await copied.filter({ hasText: 'Copied ✓' }).waitFor();
  assert.match(await copied.getAttribute('class'), /is-done/);
  assert.equal(await gp.evaluate(() => navigator.clipboard.readText()), `${SITE}/radio.html#gift=${MY_CODE}`);
  if (shots) await fold.screenshot({ path: `${shots}/gift-fold-copied-${viewport.width}.png` });
  await gp.waitForFunction(() => document.querySelector('button[data-feedback^="gift-copy:"]')?.textContent === 'Copy link', null, { timeout: 5000 }); // back after a moment
  await gp.evaluate(() => { delete navigator.share; }).catch(() => {});
  await fold.getByRole('button', { name: 'Share' }).click();
  await fold.locator('button[data-feedback^="gift-share:"]').filter({ hasText: /Shared ✓|Link copied ✓/ }).waitFor();
  if (shots) await fold.screenshot({ path: `${shots}/gift-fold-${viewport.width}.png` });
  const overflow = await gp.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  assert.ok(overflow <= 1, `no horizontal scroll at ${viewport.width}px (${overflow})`);
  await giver.close();
}
await browser.close();
const relevant = errors.filter((e) => !/turnstile|ResizeObserver/i.test(e));
assert.deepEqual(relevant, []);
console.log('radio gift check passed');
