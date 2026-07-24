import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { Cl, cvToHex } from '@stacks/transactions';

const expectedHash = '9434263320d2b013d7a6513210480c4cd881d4546072ae3efa0867caa1626768';
const baseUrl = process.env.POF_CONSOLE_URL || 'http://127.0.0.1:5173';
const browser = await chromium.launch({
  headless: true,
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
});

try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.route('https://api.hiro.so/**', async (route) => {
    const url = route.request().url();
    if (url.includes('/get-inscription-meta')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          okay: true,
          result: cvToHex(Cl.some(Cl.tuple({
            'mime-type': Cl.stringAscii('text/javascript'),
            'total-size': Cl.uint(39080),
            sealed: Cl.bool(true),
            'final-hash': Cl.buffer(Buffer.from(expectedHash, 'hex'))
          })))
        })
      });
      return;
    }
    if (url.includes('/v2/contracts/interface/') && url.endsWith('/proof-of-free-v1')) {
      await route.fulfill({ status: 404, body: '{}' });
      return;
    }
    await route.fulfill({ status: 404, body: '{}' });
  });
  await page.goto(`${baseUrl}/web/deploy-console.html`, { waitUntil: 'networkidle' });
  const card = page.locator('.card', {
    has: page.getByRole('heading', { name: 'Proof of Free v1 — Living Synth v3 controller' })
  });
  await assert.doesNotReject(() => card.waitFor());
  const inputs = card.locator('input');
  assert.equal(await inputs.nth(1).inputValue(), expectedHash);
  const preflight = card.getByRole('button', { name: /Load \+ preflight/ });
  assert.equal(await preflight.isDisabled(), true);

  await inputs.nth(0).fill('12345');
  await card.getByRole('button', { name: /Verify inscribed engine/ }).click();
  await card.getByText(/Verified Xtrata #12345/).waitFor();
  assert.equal(await preflight.isDisabled(), false);
  await preflight.click();
  await card.getByText('OK — ready for wallet deploy').waitFor();
  await card.getByRole('button', { name: 'Download generated .clar' }).waitFor();
  assert.match(await card.textContent(), /39080 bytes/);
  console.log('deploy console PoF smoke: engine gate, hash binding and generated-source preflight passed');
} finally {
  await browser.close();
}
