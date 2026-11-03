/**
 * Build for the ParallaX Casino wallet origin (casino-wallet.xtrata.xyz), a SEPARATE Cloudflare Pages project
 * (`xtrata-casino-wallet`). Output: dist-casino-wallet/ (index.html, create.html, hashed assets, _headers).
 *
 * Same rules as the radio's wallet box (vite.listening-wallet.config.ts, docs/PASSKEY-WALLET.md §5a): the parents in
 * VITE_CASINO_WALLET_PARENTS are baked into both the bridge allowlist and the CSP frame-ancestors, and nothing else may ever be
 * added to this origin (no CDN, analytics, fonts or third-party script). TESTNET only.
 * Plan: docs/plans/CASINO-PASSKEY-WALLET-PLAN.md.
 */
import { resolve } from 'node:path';
import { writeFileSync } from 'node:fs';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import { walletHeaders } from './vite.listening-wallet.config';

// The casino runs at https://xtrata.xyz/casino. Add a staging origin through the variable when testing there.
const DEFAULT_PARENTS = 'https://xtrata.xyz';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  const parents = (process.env.VITE_CASINO_WALLET_PARENTS || env.VITE_CASINO_WALLET_PARENTS || DEFAULT_PARENTS)
    .split(',').map((s) => s.trim()).filter(Boolean);
  const outDir = resolve(__dirname, 'dist-casino-wallet');
  const headers: Plugin = {
    name: 'casino-wallet-headers',
    closeBundle() { writeFileSync(resolve(outDir, '_headers'), walletHeaders(parents)); }
  };
  return {
    root: resolve(__dirname, 'src/casino-wallet/frame'),
    base: '/',
    publicDir: false,
    envDir: __dirname,
    define: { 'import.meta.env.VITE_CASINO_WALLET_PARENTS': JSON.stringify(parents.join(',')) },
    build: {
      outDir, emptyOutDir: true, modulePreload: { polyfill: false }, sourcemap: false, target: 'es2020',
      rollupOptions: { input: { index: resolve(__dirname, 'src/casino-wallet/frame/index.html'), create: resolve(__dirname, 'src/casino-wallet/frame/create.html') } }
    },
    plugins: [headers]
  };
});
