import { expect, test } from 'playwright/test';

const ADDRESS = 'SP2JXKMSH007NPYAQHKJPQMAQYAD90NQGTVJVQ02B';

test('connect, account-change and disconnect propagate between tabs', async ({ context }) => {
  const first = await context.newPage();
  const second = await context.newPage();
  await Promise.all([
    first.goto('/tests/fixtures/wallet-session.html'),
    second.goto('/tests/fixtures/wallet-session.html')
  ]);
  await Promise.all([
    first.waitForFunction(() => document.documentElement.dataset.ready === 'true'),
    second.waitForFunction(() => document.documentElement.dataset.ready === 'true')
  ]);

  await first.evaluate((address) => window.walletHarness.connect(address), ADDRESS);
  await expect.poll(() => second.evaluate(() => window.walletHarness.load().status))
    .toBe('CONNECTED');
  await expect.poll(() => second.evaluate(() => window.walletHarness.load().address))
    .toBe(ADDRESS);

  await first.evaluate(() => window.walletHarness.accountChanged());
  await expect.poll(() => second.evaluate(() => window.walletHarness.load().status))
    .toBe('RECONNECT_REQUIRED');

  await first.evaluate(() => window.walletHarness.disconnect());
  await expect.poll(() => second.evaluate(() => window.walletHarness.load().status))
    .toBe('DISCONNECTED');
});

test('every static wizard exposes explicit account change and disconnect', async ({ page }) => {
  for (const file of ['index.html', 'suno.html', 'manifests.html']) {
    await page.goto(`/xtrata-agent-one/wizard/${file}?mock=1`);
    await expect(page.locator('#connectBtn')).toHaveText(/Connect wallet|Change account/);
    await expect(page.locator('#disconnectBtn')).toHaveCount(1);
  }
});

declare global {
  interface Window {
    walletHarness: {
      load(): { status: string; address?: string };
      connect(address: string, providerId?: string): unknown;
      accountChanged(): unknown;
      disconnect(): unknown;
    };
  }
}
