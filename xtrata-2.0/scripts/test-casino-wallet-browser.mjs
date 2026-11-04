// Real-browser check of the ParallaX Casino "Play now" flow (docs/plans/CASINO-PASSKEY-WALLET-PLAN.md): the real casino page
// (public/casino/index.html), the real casino wallet box (dist-casino-wallet) on its own origin in an iframe, Chrome's
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
import { build } from 'esbuild';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

// The room server's own challenge and signature check (functions/lib/casino-room-proof.ts), bundled for this script, so the
// fake room below accepts exactly what the real one would.
const proofFile = join(tmpdir(), `casino-room-proof-${process.pid}.mjs`);
await build({ entryPoints: [new URL('../functions/lib/casino-room-proof.ts', import.meta.url).pathname], bundle: true, format: 'esm', platform: 'node', outfile: proofFile, logLevel: 'silent',
  banner: { js: "import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);" } });
const proof = await import(pathToFileURL(proofFile).href);
const ROOM_SECRET = 'r'.repeat(40);

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

/**
 * room: false (default) answers the room endpoints 503, as when the room is off, so the exchange checks are not covered by the
 * arrival prompt. room: true runs a fake room: real challenges and signature checks, a session per player, and a WebSocket that
 * shows guests the head count only (anonymous watching off).
 */
async function newPlayer({ prf = true, extension = false, room = false } = {}) {
  const context = await browser.newContext({ viewport: { width: 900, height: 900 } });
  await context.route('**/*', async (route) => {
    const url = new URL(route.request().url());
    if (url.origin === WALLET) {
      const path = url.pathname === '/' ? 'index.html' : url.pathname === '/create' ? 'create.html' : url.pathname.slice(1);
      try {
        return route.fulfill({ status: 200, body: await readFile(new URL(path, dist)), headers: { 'content-type': typeOf(path), 'content-security-policy': csp, 'x-content-type-options': 'nosniff' } });
      } catch { return route.fulfill({ status: 404, body: '' }); }
    }
    if (url.origin === SITE && url.pathname.startsWith('/casino/room/')) {
      if (!room) return route.fulfill({ status: 503, contentType: 'application/json', body: '{"error":"The casino room is offline."}' });
      const json = (status, body) => route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });
      if (url.pathname === '/casino/room/challenge') return json(200, { challenge: proof.issueRoomChallenge(ROOM_SECRET, url.searchParams.get('address')) });
      if (url.pathname === '/casino/room/session') {
        const method = route.request().method();
        if (method === 'GET') return json(200, roomState.signed ? { address: roomState.signed, expiresAt: Date.now() + 3600e3 } : { address: null, expiresAt: null });
        if (method === 'DELETE') { roomState.signed = null; return json(200, { ok: true }); }
        const body = JSON.parse(route.request().postData() || '{}');
        let challenge;
        try { challenge = proof.validateRoomChallenge(ROOM_SECRET, body.challenge); } catch (e) { return json(400, { error: e.message }); }
        const ok = proof.verifyRoomProof(challenge, body.signature);
        if (!ok) return json(401, { error: 'That signature does not match this address. Nothing changed.' });
        roomState.signed = ok.address; roomState.signIns.push(ok.address);
        return json(200, { address: ok.address, hash160: ok.hash160, network: challenge.network, expiresAt: Date.now() + 3600e3 });
      }
      return route.fulfill({ status: 404, body: '' });
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
  const roomState = { signed: null, signIns: [] };
  if (room) {
    await context.routeWebSocket(/\/casino\/room\/ws$/, (ws) => {
      const a = roomState.signed;
      const hello = () => ws.send(JSON.stringify({
        t: 'room', v: 1, features: ['play', 'move'], you: { a, n: a ? a.slice(0, 5) : 'Guest', guest: !a, k: null },
        watch: !!a, spots: {}, players: a ? [{ a, n: a.slice(0, 5), spot: null }] : [], walkers: [], joined: 3 + (a ? 1 : 0), guests: a ? 0 : 1, at: Date.now()
      }));
      hello();
      ws.onMessage((m) => { try { const t = JSON.parse(String(m)).t; if (t === 'hello') hello(); if (t === 'ping') ws.send(JSON.stringify({ t: 'pong', at: Date.now() })); } catch { /* ignore */ } });
    });
  }
  const page = await context.newPage();
  page.setDefaultTimeout(30000);
  const errors = [], logs = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => logs.push(m.text()));
  const cdp = await context.newCDPSession(page);
  await cdp.send('WebAuthn.enable');
  const { authenticatorId } = await cdp.send('WebAuthn.addVirtualAuthenticator', {
    options: { protocol: 'ctap2', ctap2Version: 'ctap2_1', transport: 'internal', hasResidentKey: true, hasUserVerification: true, isUserVerified: true, hasPrf: prf, automaticPresenceSimulation: true }
  });
  // The page's wallet script would load https://casino-wallet.xtrata.xyz; point it at the test wallet origin.
  await page.addInitScript(([w, ext]) => {
    if (window.top !== window) return;
    window.ParallaxCasinoWalletOrigin = w;
    if (ext) window.LeatherProvider = { request: async () => ({}) }; // what Leather injects
    // Headless software WebGL draws the 3D casino at about 1 frame a second, which starves clicks. Draw one frame every 4 s instead:
    // this test is about the exchange panel, not the scene.
    const raf = window.requestAnimationFrame.bind(window);
    window.requestAnimationFrame = (cb) => setTimeout(() => raf(cb), 4000);
  }, [WALLET, extension]);
  return { context, page, errors, logs, roomState, cdp, authenticatorId };
}

/** Confirm each panel INSIDE the wallet frame until `done()` (arming delay: a click too early is ignored, so retry). */
async function confirmInFrame(page, done, label, { makeNew = false } = {}) {
  const frame = page.frameLocator('#lxPasskeyFrame iframe');
  // makeNew: while the "use my passkey or make one" panel shows, answer "Make a new one"; confirm every other panel.
  for (let i = 0; i < 80; i++) {
    if (await done()) return;
    const alt = frame.locator('#p-alt'), ok = frame.locator('#p-ok');
    const choosing = makeNew && await alt.isVisible().catch(() => false);
    const button = choosing ? alt : ok;
    if (await button.isVisible().catch(() => false) && await button.isEnabled().catch(() => false)) await button.click({ timeout: 2000 }).catch(() => {});
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

/** Opens the casino on its normal link and the first exchange; waits until the casino wallet has said what this device holds. */
async function openExchange(page, expect = '#lxPlayNow') {
  await page.goto(SITE + '/casino/', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForFunction(() => window.ParallaxLAYRExchange && window.ParallaxPasskeyWallet, null, { timeout: 120000 });
  await page.evaluate(() => window.ParallaxLAYRExchange.open(0));
  await page.locator(expect).waitFor({ state: 'visible' });
}
const visible = (page, sel) => page.locator(sel).isVisible();

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
  await confirmInFrame(page, async () => !!(await snap(page)).address, 'create passkey wallet', { makeNew: true });
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

  // Reload: no longer a new player (chips, and a passkey wallet here), so the standard exchange shows, with one tap to open the same
  // wallet. The first buy is NOT repeated.
  await openExchange(page, '#lxPasskeyAltBtn');
  assert.equal(await visible(page, '#lxPlayNow'), false, 'Play now is for new players only');
  assert.equal(await page.locator('#layrConnectWallet').textContent(), 'Connect wallet');
  assert.match(await page.locator('#lxPasskeyAltBtn').textContent(), /^Open my passkey wallet · ST/);
  if (shots) await page.screenshot({ path: `${shots}/4-returning.png`, timeout: 120000, animations: 'disabled' });
  await page.locator('#lxPasskeyAltBtn').click();
  await confirmInFrame(page, async () => !!(await snap(page)).address, 'unlock');
  assert.equal((await snap(page)).address, address);
  await page.waitForFunction(() => /Ready/.test(document.getElementById('lxPasskeyStatus').textContent), null, { timeout: 30000 });
  assert.equal(chain.broadcasts.length, 2, 'no second automatic buy');
  assert.equal(chain.faucetCalls.length, 1, 'no faucet call while funded');
  assert.deepEqual(errors, []);
  assert.equal(await visible(page, '#lxPasskeyAlt'), false, 'no passkey offer while on a passkey wallet');
  await context.close();
  console.log('ok 1 · new player: Play now → passkey → faucet → auto-buy 1,000,000 LAYR → buy again → returns to the standard exchange, one tap, no repeat');
}

// ---- 2. browser-only wallet, then offered (and upgraded to) a passkey wallet ----
{
  const { context, page, errors } = await newPlayer();
  await openExchange(page);
  await page.locator('#lxPlayDevice').click();
  await confirmInFrame(page, async () => !!(await snap(page)).address, 'browser-only wallet');
  const device = (await snap(page)).address;
  await waitFor(page, async () => ['credited', 'already-credited'].includes((await snap(page)).phase), 90000, 'device first buy');
  assert.equal(chain.broadcasts.at(-1).sender, device);
  assert.equal(chain.broadcasts.at(-1).amount, 10n * STX);
  // Not linked to a passkey: the standard exchange offers one.
  await page.locator('#lxPasskeyAltBtn').waitFor({ state: 'visible' });
  assert.equal(await page.locator('#lxPasskeyAltBtn').textContent(), 'Passkey wallet');
  await page.locator('#lxPasskeyAltBtn').click();
  await confirmInFrame(page, async () => { const a = (await snap(page)).address; return !!a && a !== device; }, 'upgrade to passkey', { makeNew: true });
  const passkey = (await snap(page)).address;
  await waitFor(page, async () => chain.broadcasts.at(-1).sender === passkey && ['credited', 'already-credited'].includes((await snap(page)).phase), 90000, 'passkey first buy');
  await page.waitForFunction(() => document.getElementById('lxPasskeyAlt').hidden);
  assert.deepEqual(errors, []);
  await context.close();
  console.log('ok 2 · browser-only wallet → auto-buy → offered "Passkey wallet" → made one → auto-buy');
}

// ---- 2b. no passkey PRF on this device: the browser-only wallet still works ----
{
  const { context, page, errors } = await newPlayer({ prf: false });
  await openExchange(page);
  await page.locator('#lxPlayDevice').click();
  await confirmInFrame(page, async () => !!(await snap(page)).address, 'browser-only wallet, no PRF');
  await waitFor(page, async () => ['credited', 'already-credited'].includes((await snap(page)).phase), 90000, 'device first buy, no PRF');
  assert.deepEqual(errors, []);
  await context.close();
  console.log('ok 2b · no passkey PRF: browser-only wallet → faucet → auto-buy');
}

// ---- 2c. a player with a wallet extension: standard exchange, plus the passkey option ----
{
  const { context, page, errors } = await newPlayer({ extension: true });
  await openExchange(page, '#lxPasskeyAltBtn');
  assert.equal(await visible(page, '#lxPlayNow'), false);
  assert.equal(await page.locator('#layrConnectWallet').textContent(), 'Connect wallet');
  assert.equal(await page.locator('#lxPasskeyAltBtn').textContent(), 'Passkey wallet');
  assert.match(await page.locator('#lxPasskeyAltNote').textContent(), /Use your casino passkey from any of your devices.*500 free testnet STX/);
  if (shots) await page.screenshot({ path: `${shots}/5-has-extension.png`, timeout: 120000, animations: 'disabled' });
  assert.deepEqual(errors, []);
  await context.close();
  console.log('ok 2c · wallet extension: standard exchange with "Passkey wallet" (use yours or make one), no Play now');
}

// ---- R1. a brand-new visitor: asked to join on arrival, joins with a new casino wallet, gets STX and chips ----
const roomState_ = (page) => page.evaluate(() => window.__pxRoom?.state ?? null);
const roomButton = (page, text) => page.locator('#pxroom-panel button', { hasText: text });
{
  const { context, page, errors, roomState, cdp, authenticatorId } = await newPlayer({ room: true });
  await page.goto(SITE + '/casino/', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForFunction(() => window.__pxRoom?.state?.open && window.ParallaxCasinoWalletUI?.available(), null, { timeout: 120000 });
  const panelText = await page.locator('#pxroom-panel').innerText();
  assert.match(panelText, /3 people are in the room\. Sign in to join them\./);
  assert.match(panelText, /Until you join you are invisible/);
  const first = await page.locator('#pxroom-panel .row button').first().textContent();
  assert.equal(first, 'Casino wallet', 'a new visitor is offered the casino wallet first');
  if (shots) await page.screenshot({ path: `${shots}/6-arrival.png`, timeout: 120000, animations: 'disabled' });
  await roomButton(page, 'Casino wallet').click();
  if (shots) { await page.locator('#lxPasskeyFrame iframe').waitFor({ state: 'visible' }); await page.waitForTimeout(1500); await page.screenshot({ path: `${shots}/7-use-or-make.png`, timeout: 120000, animations: 'disabled' }); }
  await confirmInFrame(page, async () => !!(await roomState_(page))?.signed, 'join the room with a new casino wallet', { makeNew: true });
  const address = (await roomState_(page)).signed;
  assert.match(address, /^ST/);
  assert.deepEqual(roomState.signIns, [address], 'the room server accepted the casino wallet signature');
  assert.equal((await snap(page)).address, address, 'one wallet for the room and the exchange');
  // The welcome: 500 free testnet STX, then the first 1,000,000 LAYR.
  await waitFor(page, async () => ['credited', 'already-credited'].includes((await snap(page)).phase), 90000, 'room-made wallet first buy');
  assert.equal(chain.broadcasts.at(-1).sender, address);
  // Reload within the session: no prompt, still in the room.
  await page.goto(SITE + '/casino/', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForFunction(() => window.__pxRoom?.state?.signed, null, { timeout: 120000 });
  await page.waitForTimeout(4000);
  assert.equal((await roomState_(page)).prompted, false, 'no arrival prompt while a session is live');

  // The same passkey on a "new device": this browser forgets every casino wallet record; the passkey is still in the
  // authenticator (as a synced passkey would be). "Use my passkey" must open the SAME wallet, and no new passkey is made.
  const box = page.frames().find((f) => f.url().startsWith(WALLET));
  await box.evaluate(() => localStorage.clear());
  await openExchange(page, '#lxPasskeyAltBtn');
  assert.equal(await page.locator('#lxPasskeyAltBtn').textContent(), 'Passkey wallet');
  await page.locator('#lxPasskeyAltBtn').click();
  await confirmInFrame(page, async () => (await snap(page)).address === address, 'synced passkey opens the same wallet');
  const { credentials } = await cdp.send('WebAuthn.getCredentials', { authenticatorId });
  assert.equal(credentials.length, 1, 'no second passkey was made');
  assert.deepEqual(errors, []);
  await context.close();
  console.log('ok R1b · same passkey, browser forgot the wallet: "Use my passkey" opens the same wallet, no new passkey');
  console.log('ok R1 · new visitor: arrival prompt (room hidden) → casino wallet → signed in → 500 STX + 1,000,000 LAYR; reload: no prompt');
}

// ---- R2. "Not now", then Play now at the exchange: signed into the room without touching the Room panel ----
{
  const { context, page, errors, roomState } = await newPlayer({ room: true });
  await page.goto(SITE + '/casino/', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForFunction(() => window.__pxRoom?.state?.open && window.ParallaxCasinoWalletUI?.available(), null, { timeout: 120000 });
  await roomButton(page, 'Not now').click();
  assert.equal((await roomState_(page)).open, false);
  assert.equal((await roomState_(page)).signed, null, 'Not now leaves them invisible');
  await page.evaluate(() => window.ParallaxLAYRExchange.open(0));
  await page.locator('#lxPlayNow').click();
  await confirmInFrame(page, async () => !!(await roomState_(page))?.signed, 'Play now signs into the room', { makeNew: true });
  const address = (await snap(page)).address;
  assert.equal((await roomState_(page)).signed, address);
  assert.deepEqual(roomState.signIns, [address]);
  await waitFor(page, async () => ['credited', 'already-credited'].includes((await snap(page)).phase), 90000, 'Play now first buy');
  assert.deepEqual(errors, []);
  await context.close();
  console.log('ok R2 · Not now keeps them invisible; Play now at the exchange signs them into the room automatically');
}

// ---- V. first person is the default; V puts your own avatar on screen behind you, and the choice is remembered ----
const view = (page) => page.evaluate(() => { const v = window.__casinoView; return { mode: v.mode, behind: v.behind, camera: v.camera, player: v.player, boom: v.boom, me: v.me }; });
{
  const { context, page, errors } = await newPlayer();
  const boot = async () => {
    await page.waitForFunction(() => window.__casinoView && window.XA_HOSTS?.ready, null, { timeout: 120000 });
    await page.evaluate(() => window.__casino.startAtDoor());
  };
  const stored = () => page.evaluate(() => localStorage.getItem('xtrata.parallax.view'));
  await page.goto(SITE + '/casino/', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await boot();
  // Nothing saved yet: first person, your own avatar hidden, and merely loading the page saves nothing.
  let v = await view(page);
  assert.equal(v.mode, 'first', 'first person is the default');
  assert.equal(await stored(), null, 'loading the page saves no choice');
  assert.ok(!v.me.some((m) => m.on), 'your own avatar is hidden in first person');
  assert.ok(Math.hypot(v.camera[0] - v.player.x, v.camera[2] - v.player.z) < 0.05, 'first person: the camera is at your eyes');
  // Out on the open floor (at the door the wall is right behind you and the boom is short, as it should be).
  await page.evaluate(() => window.__casinoView.standAt(0, 3));
  await page.keyboard.press('KeyV');
  await page.waitForFunction(() => window.__casinoView.mode === 'behind' && window.__casinoView.me.some((m) => !m.seated && m.on && m.built), null, { timeout: 60000 });
  // The boom eases back out after the switch; this test browser draws a frame only every 4 s, so that takes a while here.
  await page.waitForFunction(() => window.__casinoView.boom > 2.4, null, { timeout: 180000 });
  v = await view(page);
  const [cx, cy, cz] = v.camera, back = Math.hypot(cx - v.player.x, cz - v.player.z);
  assert.ok(back > 1.5 && back < 2.8 && cz > v.player.z && cy > 1.6, `camera behind and above you (${back.toFixed(2)} m back, ${cy.toFixed(2)} m up)`);
  if (shots) await page.screenshot({ path: `${shots}/8-behind-you.png`, timeout: 120000, animations: 'disabled' });
  assert.equal(await stored(), 'behind', 'the choice of behind you is remembered');
  // A reload keeps the chosen view.
  await page.reload({ waitUntil: 'domcontentloaded', timeout: 120000 });
  await boot();
  assert.equal((await view(page)).mode, 'behind', 'behind you is still chosen after a reload');
  // And back to first person, also remembered across a reload.
  await page.keyboard.press('KeyV');
  await page.waitForFunction(() => window.__casinoView.mode === 'first' && !window.__casinoView.me.some((m) => m.on), null, { timeout: 20000 });
  v = await view(page);
  assert.ok(Math.hypot(v.camera[0] - v.player.x, v.camera[2] - v.player.z) < 0.05, 'first person: the camera is at your eyes');
  assert.equal(await stored(), 'first', 'the choice of first person is remembered');
  await page.reload({ waitUntil: 'domcontentloaded', timeout: 120000 });
  await boot();
  assert.equal((await view(page)).mode, 'first', 'first person is still chosen after a reload');
  // Back to behind you, to check that against the back wall the boom shortens instead of going through it.
  await page.keyboard.press('KeyV');
  await page.waitForFunction(() => window.__casinoView.mode === 'behind' && window.__casinoView.me.some((m) => m.on), null, { timeout: 20000 });
  await page.evaluate(() => { window.__casinoView.standAt(0, 9.0); });
  await page.waitForTimeout(9000);
  v = await view(page);
  assert.ok(v.camera[2] < 11 - 0.3, `the camera stays inside the room (z ${v.camera[2].toFixed(2)})`);
  assert.deepEqual(errors, []);
  await context.close();
  console.log('ok V · first person by default, V for your own avatar behind you, each choice remembered after a reload, the boom stops at walls');
}

// ---- P. personal space: other players are solid while you are signed in, and you pass through them while you are not ----
{
  const { context, page, errors } = await newPlayer();
  await page.goto(SITE + '/casino/', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForFunction(() => window.__casinoView && window.PXRoomHost && window.XA_HOSTS?.ready, null, { timeout: 120000 });
  await page.evaluate(() => { window.__casino.startAtDoor(); window.PXRoomHost.move({ key: 'ST2BOB00000000000000000000000000000000', label: 'Bob', x: 0, z: 6, r: 0, at: Date.now() }); });
  const gap = () => page.evaluate(() => { const p = window.__casinoView.standAt(0.05, 6.05); return Math.hypot(p.x, p.z - 6); });
  await page.evaluate(() => window.PXRoomHost.self({ signed: true, address: 'ST1ALICE000000000000000000000000000000' }));
  const t0 = Date.now(); let d = await gap();
  while (d < 0.6 && Date.now() - t0 < 30000) { await page.waitForTimeout(1000); d = await gap(); }
  assert.ok(d >= 0.6, `signed in: kept out of Bob's personal space (${d.toFixed(2)} m)`);
  await page.evaluate(() => window.PXRoomHost.self({ signed: false, address: null }));
  d = await gap();
  assert.ok(d < 0.1, `signed out (invisible): walks through Bob (${d.toFixed(2)} m)`);
  assert.deepEqual(errors, []);
  await context.close();
  console.log('ok P · personal space while signed in (about 0.6 m); invisible visitors pass through');
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
