import { defineConfig } from 'vite';

// Standalone build for the Agent One wallet shim ONLY.
// It bundles @stacks/connect (+ the app's src/lib/wallet logic) into a single IIFE
// that sets window.XtrataWallet, written next to the wizard so the static wizard can
// use the site's real wallet-connect without any CDN.
//
//   npx vite build -c vite.agent-one-wallet.config.ts
//   -> xtrata-agent-one/wizard/agent-one-wallet.js
//
// Does not affect the main app build.
export default defineConfig({
  publicDir: false, // lib bundle: do not copy public/ into the wizard folder
  build: {
    lib: {
      entry: 'src/agent-one/agent-one-wallet.ts',
      name: 'XtrataWalletBundle',
      formats: ['iife'],
      fileName: () => 'agent-one-wallet.js',
    },
    outDir: 'xtrata-agent-one/wizard',
    emptyOutDir: false,   // keep wizard/index.html — only add the .js
    minify: true,
  },
});
