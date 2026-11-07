// Browser check of the radio's connect pop-up: "Connect wallet" offers Xtrata Music Wallet first (a passkey wallet
// made on this device), then Xverse or Leather. Uses the claim harness' world: the real radio page and the real
// wallet frame, a virtual passkey, a mocked server and chain. Nothing is signed or broadcast (AGENTS.md).
//
//   VITE_LISTENING_WALLET_PARENTS=https://radio.xtrata.test npm run build:listening-wallet
//   CHROME_PATH=/usr/bin/google-chrome node scripts/test-radio-music-wallet-connect.mjs [screenshot-dir]
import assert from 'node:assert/strict';
import { addAuthenticator, makeMock, SITE, startWorld, WALLET } from './claim-harness/lib/world.mjs';
import { panelNow, walletFrame } from './claim-harness/lib/person.mjs';

const shots = process.argv[2];
const log = [];
const record = (e) => log.push(e);

async function run(device) {
  const world = await startWorld({ device, mock: makeMock(), record });
  const page = await world.context.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  const auth = await addAuthenticator(world.context, page, record);
  try {
    await page.goto(SITE + '/radio.html');
    const connect = page.locator('#radio-wallet-connect');
    await page.waitForFunction(() => typeof window.XtrataRadioConnectChooser === 'function', null, { timeout: 15000 });
    // Wait for the wallet box to answer, so the pop-up knows this device has no passkey yet.
    await page.waitForFunction(() => /Start listening/.test(document.querySelector('#ppp')?.textContent ?? ''), null, { timeout: 15000 });
    assert.equal(await connect.textContent(), 'Connect wallet', `${device}: top bar button`);

    // 1. Cancel closes it and opens nothing else.
    await connect.click();
    const dialog = page.locator('dialog.ppp-connect');
    await dialog.waitFor({ timeout: 5000 });
    const rows = await dialog.locator('.ppp-connect__opt b').allTextContents();
    assert.deepEqual(rows, ['Xtrata Music Wallet', 'Xverse or Leather'], `${device}: rows in order`);
    if (shots) await page.screenshot({ path: `${shots}/connect-${device}.png` });
    await dialog.getByRole('button', { name: 'Cancel' }).click();
    await dialog.waitFor({ state: 'detached', timeout: 3000 });
    assert.equal(await page.locator('connect-modal').count(), 0, `${device}: cancel opens no Stacks chooser`);

    // 2. Xverse or Leather goes on to the usual Stacks chooser.
    await connect.click();
    await dialog.getByRole('button', { name: /Xverse or Leather/ }).click();
    await page.locator('connect-modal').waitFor({ state: 'attached', timeout: 5000 });
    await page.keyboard.press('Escape');
    await page.locator('connect-modal').waitFor({ state: 'detached', timeout: 5000 });

    // 3. Xtrata Music Wallet makes the passkey wallet on this device.
    await connect.click();
    await dialog.getByRole('button', { name: /Xtrata Music Wallet/ }).click();
    const t0 = Date.now();
    let made = false;
    while (Date.now() - t0 < 30000 && !made) {
      const panel = await panelNow(page);
      if (panel?.enabled) {
        const frame = await walletFrame(page);
        if (/\(new tab\)/.test(panel.label)) {
          await frame.locator('#p-ok').click();
          const tab = page.frameLocator('#harness-newtab');
          await tab.getByRole('button', { name: 'Create passkey' }).click({ timeout: 8000 });
          await tab.getByText('Passkey saved ✓').waitFor({ timeout: 8000 });
          await page.evaluate(() => document.getElementById('harness-newtab')?.remove());
        } else await frame.locator('#p-ok').click();
        await page.waitForTimeout(1200);
      } else await page.waitForTimeout(250);
      made = (await page.evaluate(() => document.documentElement.dataset.pppSolo ?? '')).startsWith('SP');
    }
    assert.ok(made, `${device}: Xtrata Music Wallet made`);
    assert.equal((await auth.credentials()).length, 1, `${device}: exactly one passkey`);
    // Now in use: the top bar button only adds a Stacks wallet, with no pop-up.
    await page.waitForFunction(() => document.getElementById('radio-wallet-connect')?.textContent === 'I have a Stacks wallet', null, { timeout: 5000 });
    await connect.click();
    await page.locator('connect-modal').waitFor({ state: 'attached', timeout: 5000 });
    assert.equal(await dialog.count(), 0, `${device}: no pop-up once the music wallet is in use`);
    await page.keyboard.press('Escape');
    if (shots) await page.screenshot({ path: `${shots}/after-${device}.png` });
    assert.deepEqual(errors, [], `${device}: page errors`);
    console.log(`ok ${device}`);
  } finally { await world.browser.close(); }
}

/**
 * A device whose listening wallet is linked to a Stacks wallet, with that Stacks wallet NOT connected: the pop-up names
 * it ("Xtrata Music Wallet · SP…"), and choosing it unlocks it and runs it, credited to that wallet.
 */
const LINKED_MAIN = 'SP10W2EEM757922QTVDZZ5CSEW55JEFNN30J69TM7';
async function runLinked(device) {
  const world = await startWorld({ device, mock: makeMock(), record });
  const page = await world.context.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  // Like the server with RADIO_PPP_ALLOWLIST=all: open to any main wallet the page names.
  await page.route('**/radio/listening-wallet/config*', async (route) => {
    const main = new URL(route.request().url()).searchParams.get('main');
    await route.fulfill({ json: {
      enabled: true, allowed: !!main, here: true, radioUrl: SITE + '/radio.html', canary: true, walletOrigin: WALLET, passkeyOnly: true,
      limits: { playFee: '300', returnFee: '3000', maxSessionPlays: 3000, sessionHours: 168 },
      gifts: { enabled: true, treasury: world.mock.treasury, turnstileSiteKey: null, admin: false, fee: '3000' }
    } });
  });
  // The server's record of verified links (public): this device's wallet is linked to LINKED_MAIN.
  let linkedListening = '';
  await page.route('**/radio/listening-wallet/link*', (route) => route.fulfill({ json: { links: linkedListening ? [{ listening: linkedListening, main: LINKED_MAIN, issued: 1, mainSignature: '00' }] : [] } }));
  const auth = await addAuthenticator(world.context, page, record);
  const dialog = page.locator('dialog.ppp-connect');
  const connect = page.locator('#radio-wallet-connect');
  const tapPanels = async (until, ms = 30000) => {
    const t0 = Date.now();
    while (Date.now() - t0 < ms) {
      if (await until()) return true;
      const panel = await panelNow(page);
      if (panel?.enabled) {
        const frame = await walletFrame(page);
        if (/\(new tab\)/.test(panel.label)) {
          await frame.locator('#p-ok').click();
          const tab = page.frameLocator('#harness-newtab');
          await tab.getByRole('button', { name: 'Create passkey' }).click({ timeout: 8000 });
          await tab.getByText('Passkey saved ✓').waitFor({ timeout: 8000 });
          await page.evaluate(() => document.getElementById('harness-newtab')?.remove());
        } else await frame.locator('#p-ok').click();
        await page.waitForTimeout(1200);
      } else await page.waitForTimeout(250);
    }
    return until();
  };
  try {
    // A wallet made here, then linked to a Stacks wallet (the link is set in the wallet box's own record, as linking would).
    await page.goto(SITE + '/radio.html');
    await page.waitForFunction(() => /Start listening/.test(document.querySelector('#ppp')?.textContent ?? ''), null, { timeout: 15000 });
    await connect.click();
    await dialog.getByRole('button', { name: /^Xtrata Music Wallet/ }).click();
    assert.ok(await tapPanels(async () => (await page.evaluate(() => document.documentElement.dataset.pppSolo ?? '')).startsWith('SP')), `${device}: wallet made`);
    const frame = await walletFrame(page);
    linkedListening = await frame.evaluate((main) => {
      const k = 'xtrata.listening-wallet.v1', v = JSON.parse(localStorage.getItem(k));
      v.wallets[0].link = { main, issued: 1, mainSignature: '00' };
      localStorage.setItem(k, JSON.stringify(v));
      return v.wallets[0].address;
    }, LINKED_MAIN);

    // Later visit, no Stacks wallet connected.
    await page.reload();
    await page.waitForFunction(() => /This device has a listening wallet for/.test(document.querySelector('#ppp')?.textContent ?? ''), null, { timeout: 15000 });
    assert.equal(await connect.textContent(), 'Connect wallet');
    await connect.click();
    await dialog.waitFor({ timeout: 5000 });
    const rows = await dialog.locator('.ppp-connect__opt b').allTextContents();
    assert.equal(rows.length, 2, `${device}: one linked row + Stacks`);
    assert.match(rows[0], /^Xtrata Music Wallet · SP10/, `${device}: linked row named by its wallet`);
    assert.equal(rows[1], 'Xverse or Leather');
    if (shots) await page.screenshot({ path: `${shots}/linked-connect-${device}.png` });
    await dialog.getByRole('button', { name: /^Xtrata Music Wallet · / }).click();
    // One passkey tap in the box, then it runs credited to the linked wallet, with no Stacks wallet connected.
    const running = async () => page.evaluate(() => {
      const as = document.documentElement.dataset.pppAs ?? '';
      const label = document.getElementById('radio-wallet-address')?.textContent ?? '';
      const t = document.querySelector('#ppp')?.textContent ?? '';
      const top = document.getElementById('ppp-top')?.textContent ?? '';
      return !!as && label === '♪ ' + as && !/This device has a listening wallet for/.test(t) && /Add plays|plays left|Plays off/.test(top);
    });
    if (!(await tapPanels(running))) {
      const why = await page.evaluate(() => ({ as: document.documentElement.dataset.pppAs, label: document.getElementById('radio-wallet-address')?.textContent, top: document.getElementById('ppp-top')?.textContent, ppp: (document.querySelector('#ppp')?.textContent ?? '').slice(0, 400) }));
      if (shots) await page.screenshot({ path: `${shots}/linked-fail-${device}.png` });
      assert.fail(`${device}: linked wallet open without its Stacks wallet: ${JSON.stringify(why)} panel=${JSON.stringify(await panelNow(page))}`);
    }
    const session = await page.evaluate(() => JSON.parse(localStorage.getItem('xtrata.wallet.session') || 'null'));
    assert.ok(!session?.isConnected, `${device}: no Stacks wallet was connected`);
    assert.equal((await auth.credentials()).length, 1, `${device}: still one passkey`);
    if (shots) await page.screenshot({ path: `${shots}/linked-open-${device}.png` });
    assert.deepEqual(errors, [], `${device}: page errors`);
    console.log(`ok linked ${device}`);
  } finally { await world.browser.close(); }
}

for (const device of ['desktop', 'iphone']) await run(device);
for (const device of ['desktop', 'iphone']) await runLinked(device);
