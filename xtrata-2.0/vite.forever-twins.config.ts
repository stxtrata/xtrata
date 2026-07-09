import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  // The root public directory belongs to the main app. Copying it here would
  // pollute Forever Twins' asset directory on every wallet bridge build.
  publicDir: false,
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
