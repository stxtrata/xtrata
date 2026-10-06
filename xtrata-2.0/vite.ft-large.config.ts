import { resolve } from 'node:path';
import { defineConfig } from 'vite';

// Standalone bundle for the large-token ("over 512 KB") route on Forever Twins collection pages.
//   npx vite build -c vite.ft-large.config.ts   ->   forever-twins/assets/xtrata-ft-large.js
// Loaded lazily by forever-twins/collection/view.html only for collections with largeOnDemand: true.
export default defineConfig({
  publicDir: false,
  build: {
    emptyOutDir: false,
    lib: { entry: resolve(process.cwd(), 'src/forever-twins/large/index.ts'), formats: ['es'], fileName: () => 'xtrata-ft-large.js' },
    outDir: 'forever-twins/assets',
    rollupOptions: { output: { inlineDynamicImports: true } }
  }
});
