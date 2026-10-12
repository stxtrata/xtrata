/**
 * Build for the listening wallet origin (wallet.xtrata.xyz), a SEPARATE Cloudflare Pages
 * project. Output: dist-listening-wallet/ (index.html, hashed assets, _headers).
 *
 * VITE_LISTENING_WALLET_PARENTS (comma-separated exact origins) is baked into both the
 * bridge allowlist and the CSP frame-ancestors, so the two can never drift apart.
 * Nothing else may ever be added to this origin: no CDN, analytics, fonts or third-party
 * script. See docs/PASSKEY-WALLET.md §5a and docs/radio/PAY-PER-PLAY.md.
 */
import { resolve } from 'node:path';
import { writeFileSync } from 'node:fs';
import { defineConfig, loadEnv, type Plugin } from 'vite';

// Production only by default. Staging must be added explicitly via the variable.
const DEFAULT_PARENTS = 'https://xtrata.xyz';

export function walletHeaders(parents: string[]): string {
  for (const p of parents) {
    if (!/^https:\/\/[a-z0-9.-]+$/.test(p) || p.includes('*')) throw new Error(`Invalid parent origin "${p}"`);
  }
  const csp = [
    "default-src 'none'",
    "script-src 'self'",
    "style-src 'self'",
    "img-src 'self' data:",
    "connect-src 'none'",
    `frame-ancestors ${parents.join(' ')}`,
    "base-uri 'none'",
    "form-action 'none'",
    "object-src 'none'"
  ].join('; ');
  return [
    '/*',
    `  Content-Security-Policy: ${csp}`,
    '  X-Content-Type-Options: nosniff',
    '  Referrer-Policy: no-referrer',
    '  Cross-Origin-Resource-Policy: same-origin',
    // Opened top-level (not framed), the wallet keeps no opener link to whoever opened it.
    '  Cross-Origin-Opener-Policy: same-origin',
    '/index.html',
    '  Cache-Control: no-cache',
    '/',
    '  Cache-Control: no-cache',
    ''
  ].join('\n');
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  const parents = (process.env.VITE_LISTENING_WALLET_PARENTS || env.VITE_LISTENING_WALLET_PARENTS || DEFAULT_PARENTS)
    .split(',').map((s) => s.trim()).filter(Boolean);
  const outDir = resolve(__dirname, 'dist-listening-wallet');
  const headers: Plugin = {
    name: 'listening-wallet-headers',
    closeBundle() { writeFileSync(resolve(outDir, '_headers'), walletHeaders(parents)); }
  };
  return {
    root: resolve(__dirname, 'src/listening-wallet/frame'),
    base: '/',
    publicDir: false,
    envDir: __dirname,
    define: { 'import.meta.env.VITE_LISTENING_WALLET_PARENTS': JSON.stringify(parents.join(',')) },
    build: { outDir, emptyOutDir: true, modulePreload: { polyfill: false }, sourcemap: false, target: 'es2020' },
    plugins: [headers]
  };
});
