// Local-only browser smoke: real public bridge and exact supplied game bytes;
// wallet and receipt services are simulated. No signatures or network broadcasts.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { createServer } from 'vite';
import { chromium } from 'playwright';

if (!process.argv[2])
  throw Error('Usage: node scripts/timeloop-public-wallet-smoke.mjs /path/to/production-game.html');
const gameBytes = await readFile(resolve(process.argv[2]));
const payer = 'SP000000000000000000002Q6VF78';
const recipient = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const txId = '0x' + 'a'.repeat(64);
const host = `<!doctype html><html><head><meta charset="utf-8"><title>Local simulated wallet — no broadcast</title>
<style>body{margin:0;background:#191919;color:white}iframe{display:block;border:0;width:100%;height:95vh}</style></head><body>
<p>LOCAL SIMULATION — no real wallet, signatures or payment</p><iframe title="Timeloop game" sandbox="allow-scripts"></iframe>
<script type="module">
import { installPublicWalletBridge, reviewPublicWalletRequest } from '/src/lib/viewer/public-wallet-bridge.ts';
window.mock = { address:'${payer}', mode:'cancel', transfers:[], connections:0 };
const session = () => ({isConnected:true,address:window.mock.address,network:'mainnet'});
const bridge = installPublicWalletBridge({host:window,
 wallet:{getSession:session,connect:async()=>{window.mock.connections++;return session()},disconnect:async()=>{}},
 review:reviewPublicWalletRequest,sessionChanged:()=>{},
 transfer: options => {window.mock.transfers.push({...options}); if(window.mock.mode==='cancel') options.onCancel();
 else if(window.mock.mode==='error') options.onError(Error('Simulated provider failure'));
 else options.onFinish({txId:'${txId}'})}
});
const frame=document.querySelector('iframe');bridge.register(frame,'Prepared local preview');
frame.srcdoc=await (await fetch('/__timeloop_game.html')).text();
</script></body></html>`;
const server = await createServer({
  server: { host: '127.0.0.1', port: 0 },
  plugins: [
    {
      name: 'local-timeloop-wallet-fixture',
      configureServer(vite) {
        vite.middlewares.use((req, res, next) => {
          if (req.url === '/__timeloop_host.html' || req.url === '/__timeloop_game.html') {
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            res.end(req.url === '/__timeloop_host.html' ? host : gameBytes);
          } else next();
        });
      }
    }
  ]
});
let browser;
try {
  await server.listen();
  const port = server.httpServer.address().port;
  browser = await chromium.launch({
    headless: true,
    ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
      ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH }
      : {})
  });
  const page = await browser.newPage({ viewport: { width: 1200, height: 1000 } });
  page.setDefaultTimeout(12_000);
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  let status = 'pending';
  await page.route('**/*', async (route) => {
    const url = new URL(route.request().url());
    if (url.hostname === '127.0.0.1' && Number(url.port) === port) return route.continue();
    assert.equal(url.origin, 'https://api.hiro.so', 'Unexpected external request');
    const tx = {
      tx_id: txId,
      sender: { address: payer },
      block: status === 'success' ? { height: 900 } : null,
      status,
      type: 'token_transfer',
      token_transfer: {
        recipient,
        amount: '1000000',
        memo: { hex: '0x' + Buffer.from('TD:WEDNESDAY:1').toString('hex').padEnd(68, '0') }
      }
    };
    return route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify(url.pathname.includes('/principals/') ? { results: [] } : tx),
      headers: { 'Access-Control-Allow-Origin': '*' }
    });
  });
  await page.goto(`http://127.0.0.1:${port}/__timeloop_host.html`);
  const game = page.frameLocator('iframe');
  const button = (name) => game.getByRole('button', { name, exact: true });
  const review = page.getByRole('dialog', { name: 'Xtrata wallet request' });
  await game.locator('.live-clock').waitFor();
  await button('Help ?').click();
  await button('Café episode & receipt recovery').click();
  await button('Connect café wallet').click();
  await review.getByRole('button', { name: 'Cancel', exact: true }).click();
  await game.getByText('Wallet connection cancelled.', { exact: false }).waitFor();
  assert.equal(await page.evaluate(() => window.mock.connections), 0);
  await button('Connect café wallet').click();
  await review.getByRole('button', { name: 'Choose wallet' }).click();
  await game.getByText('Mainnet wallet connected.', { exact: false }).waitFor();
  const consent = game.getByRole('checkbox', { name: /I want the optional episode/ });
  const purchase = button('Review 1 STX purchase in wallet');
  await consent.check();
  await purchase.click();
  await review.getByText(/Amount: 1.000000 STX/).waitFor();
  assert.match(await review.innerText(), /Requested fee: 0.003000 STX/);
  assert.match(await review.innerText(), new RegExp(recipient));
  await review.getByRole('button', { name: 'Cancel', exact: true }).click();
  await game.getByText('Wallet approval was cancelled.', { exact: false }).waitFor();
  assert.equal(await page.evaluate(() => window.mock.transfers.length), 0);
  await consent.check();
  await purchase.click();
  await review.getByRole('button', { name: 'Continue to wallet' }).click();
  await game.getByText('Wallet approval was cancelled.', { exact: false }).waitFor();
  assert.equal(await page.evaluate(() => window.mock.transfers.length), 1);
  // Change accounts while the host review is open: no payment request reaches the wallet.
  await consent.check();
  await purchase.click();
  await review.waitFor();
  await page.evaluate((value) => {
    window.mock.address = value;
  }, recipient);
  await review.getByRole('button', { name: 'Continue to wallet' }).click();
  await game.getByText('Wallet account or network changed.', { exact: false }).waitFor();
  assert.equal(await page.evaluate(() => window.mock.transfers.length), 1);
  // The game's pending marker is conservative on account mismatch; clear only
  // through its explicit history acknowledgement, as a player would.
  await game.getByRole('checkbox', { name: /I checked wallet history/ }).check();
  await button('Clear rejected request marker').click();
  await page.evaluate((value) => {
    window.mock.address = value;
    window.mock.mode = 'approve';
  }, payer);
  await button('Connect café wallet').click();
  await review.getByRole('button', { name: 'Choose wallet' }).click();
  await game.getByText('Mainnet wallet connected.', { exact: false }).waitFor();
  await consent.check();
  await purchase.click();
  await review.getByRole('button', { name: 'Continue to wallet' }).click();
  await game.getByText('The wallet returned a transaction ID.', { exact: false }).waitFor();
  const transfer = await page.evaluate(() => window.mock.transfers.at(-1));
  assert.equal(transfer.amount, '1000000');
  assert.equal(transfer.fee, '3000');
  assert.equal(transfer.recipient, recipient);
  assert.equal(transfer.stxAddress, payer);
  assert.equal(transfer.memo, 'TD:WEDNESDAY:1');
  await button('Check payment / recover episode').click();
  await game.getByText('Payment is pending.', { exact: false }).waitFor();
  assert.equal(await game.locator('.cafe-journal').count(), 0);
  status = 'success';
  await button('Check payment / recover episode').click();
  await game.locator('.cafe-journal').waitFor();
  // Existing save-memo flow uses the same bridge without an explicit fee.
  await button('Return to Wednesday').click();
  await button('Help ?').click();
  await button('Connect Xtrata wallet').click();
  await review.getByRole('button', { name: 'Choose wallet' }).click();
  await game.getByText('Wallet connected. Generate a fresh save', { exact: false }).waitFor();
  await button('Generate inscription save').click();
  const save = JSON.parse(await game.getByLabel('Inscription save JSON').inputValue());
  assert.equal(save.wallet.address, payer);
  await game.getByLabel('Save contract', { exact: true }).fill(`${recipient}.xtrata-v2-1-0`);
  await game.getByLabel('Save inscription ID', { exact: true }).fill('123');
  await button('Generate wallet memo').click();
  await game.getByRole('checkbox', { name: /I checked this is my confirmed save/ }).check();
  await button('Review memo transaction in wallet').click();
  await review.getByText(/Amount: 0.000001 STX/).waitFor();
  assert.match(await review.innerText(), /Requested fee: wallet estimate/);
  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    assert.ok(
      await review.evaluate((element) => element.scrollWidth <= element.clientWidth + 1),
      'Review overflows mobile width'
    );
  }
  await review.getByRole('button', { name: 'Continue to wallet' }).click();
  await game.getByText('Wallet returned transaction', { exact: false }).waitFor();
  const memoTransfer = await page.evaluate(() => window.mock.transfers.at(-1));
  assert.equal(memoTransfer.amount, '1');
  assert.equal(memoTransfer.recipient, payer);
  assert.equal(memoTransfer.fee, undefined);
  assert.match(memoTransfer.memo, /^TD1:/);
  assert.deepEqual(errors, []);

  // Also exercise the actual homepage preview renderer and its installed bridge.
  // Test-only module interception exposes the existing renderer and substitutes
  // the wallet session adapter; neither hook is shipped in production source.
  const homepage = await browser.newPage({ viewport: { width: 1200, height: 1000 } });
  const homeErrors = [];
  homepage.on('pageerror', (error) => homeErrors.push(error.message));
  await homepage.route('**/*', async (route) => {
    const url = new URL(route.request().url());
    if (url.hostname !== '127.0.0.1' || Number(url.port) !== port)
      return route.fulfill({ contentType: 'application/json', body: '{}' });
    if (url.pathname === '/src/lib/wallet/adapter.ts') {
      return route.fulfill({
        contentType: 'text/javascript',
        body: `export function createStacksWalletAdapter(){let s={isConnected:false};return {getSession:()=>s,connect:async()=>s={isConnected:true,address:'${payer}',network:'mainnet'},disconnect:async()=>{s={isConnected:false}}}}`
      });
    }
    if (url.pathname === '/src/home/main.js') {
      const response = await route.fetch();
      const source = await response.text();
      const anchor = 'const setExplorerModeFromRequest = () => {';
      assert.ok(source.includes(anchor));
      return route.fulfill({
        response,
        body: source.replace(
          anchor,
          `window.__timeloopSmokeOpen = html => {
        const target=document.getElementById('tokenPreviewMedia');
        renderBytesPreview(target,new TextEncoder().encode(html),'text/html',()=>{},
          {interactiveHtml:true,htmlDoc:html,walletLabel:'Inscription #123'});
        // Bring the existing preview into view without replacing its iframe.
        for(let el=target;el;el=el.parentElement){el.hidden=false;el.style.display='block';}
        target.style.cssText='position:fixed;inset:0;z-index:9999;background:#111;display:block';
        const frame=target.querySelector('iframe');frame.style.cssText='width:100%;height:100%;border:0';
      };
      ${anchor}`
        )
      });
    }
    if (['fetch', 'xhr'].includes(route.request().resourceType()))
      return route.fulfill({ contentType: 'application/json', body: '{}' });
    return route.continue();
  });
  await homepage.goto(`http://127.0.0.1:${port}/`);
  await homepage.waitForFunction(() => typeof window.__timeloopSmokeOpen === 'function');
  await homepage.evaluate((html) => window.__timeloopSmokeOpen(html), gameBytes.toString('utf8'));
  const homeGame = homepage.frameLocator('#tokenPreviewMedia iframe');
  await homeGame.locator('.live-clock').waitFor();
  await homeGame.getByRole('button', { name: 'Help ?', exact: true }).click();
  await homeGame.getByRole('button', { name: 'Connect Xtrata wallet', exact: true }).click();
  await homepage
    .getByRole('dialog', { name: 'Xtrata wallet request' })
    .getByRole('button', { name: 'Choose wallet' })
    .click();
  await homeGame.getByText('Wallet connected. Generate a fresh save', { exact: false }).waitFor();
  assert.equal(
    await homepage.locator('#tokenPreviewMedia iframe').getAttribute('sandbox'),
    'allow-scripts'
  );
  assert.deepEqual(homeErrors, []);
  console.log(
    JSON.stringify(
      {
        passed: true,
        gameSha256: createHash('sha256').update(gameBytes).digest('hex'),
        checks: [
          'host connect consent',
          'host payment cancellation',
          'wallet cancellation',
          'account change during approval',
          'exact cafe payload',
          'pending receipt refused',
          'confirmed simulated receipt unlock',
          'save JSON wallet metadata',
          'one-microSTX memo with estimated fee',
          '390/320px host review',
          'actual homepage renderer connects without replacing its sandboxed game frame',
          'no browser errors'
        ],
        livePayments: 0
      },
      null,
      2
    )
  );
} finally {
  await browser?.close();
  await server.close();
}
