import { defineConfig } from 'playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: 'wallet-browser.spec.ts',
  timeout: 30_000,
  use: { baseURL: 'http://127.0.0.1:4179', headless: true },
  webServer: {
    command: 'npx vite --host 127.0.0.1 --port 4179',
    url: 'http://127.0.0.1:4179/tests/fixtures/wallet-session.html',
    reuseExistingServer: true,
    timeout: 120_000
  }
});
