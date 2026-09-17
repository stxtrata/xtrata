import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const out = fileURLToPath(new URL('../../.artifacts/radio-support-preview/', import.meta.url));
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ headless: true, channel: 'chrome' });
try {
  for (const width of [1200, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    const errors = []; page.on('pageerror', e => errors.push(e.message));
    // Fixture has no external services; unexpected network access is blocked.
    await page.route('**/*', route => {
      if (new URL(route.request().url()).origin === 'http://127.0.0.1:8799') return route.continue();
      errors.push('Unexpected external request'); return route.abort();
    });
    await page.goto('http://127.0.0.1:8799/src/radio-support-preview/index.html');
    await page.getByText('Confirmed 0.020000 STX', { exact: false }).waitFor();
    await page.locator('summary').click();
    await page.getByText('Debit not confirmed', { exact: false }).waitFor();
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    await page.screenshot({ path: `${out}preview-${width}.png`, fullPage: true });
    await page.locator('select').selectOption('absent');
    await page.getByText('Listening free. Music Wallet integration is in development.').waitFor();
    assert.equal(await page.locator('details').isVisible(), false);
    await page.locator('select').selectOption('timeout');
    await page.getByText('Music Wallet unavailable · listening free.').waitFor();
    assert.deepEqual(errors, []);
    await page.close();
  }
  console.log('Preview browser checks passed at 1200px and 390px. Real radio/bridge gates remain outstanding.');
} finally { await browser.close(); }
