import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      entry: resolve(process.cwd(), 'src/forever-twins/wallet.ts'),
      formats: ['es'],
      fileName: () => 'xtrata-forever-twins.js'
    },
    outDir: 'forever-twins/assets',
    rollupOptions: {
      output: {
        inlineDynamicImports: true
      }
    }
  }
});
