import { defineConfig } from 'vite';
export default defineConfig({
  publicDir: false,
  build: {
    emptyOutDir: false,
    outDir: 'public/bounty/zdao/tracker/1',
    lib: { entry: 'src/bounty-tracker/wallet.ts', formats: ['es'], fileName: () => 'wallet.js' },
    rollupOptions: { output: { inlineDynamicImports: true } }
  }
});
