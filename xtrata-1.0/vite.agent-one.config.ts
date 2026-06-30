import { defineConfig } from 'vite';

// Standalone build for the FULL in-browser Agent One (wallet shim + agent core).
// Bundles src/agent-one/index.ts into a single IIFE written next to the wizard, so the
// static wizard runs the entire flow client-side (no /api server). It sets both
// window.XtrataWallet and window.XtrataAgent.
//
//   npx vite build -c vite.agent-one.config.ts
//   -> xtrata-agent-one/wizard/agent-one.js
//
// The wizard loads agent-one.js INSTEAD of agent-one-wallet.js. Does not affect the main app build.
export default defineConfig({
  build: {
    lib: {
      entry: 'src/agent-one/index.ts',
      name: 'XtrataAgentBundle',
      formats: ['iife'],
      fileName: () => 'agent-one.js',
    },
    outDir: 'xtrata-agent-one/wizard',
    emptyOutDir: false,   // keep wizard/index.html + suno.html — only add the .js
    minify: true,
  },
});
