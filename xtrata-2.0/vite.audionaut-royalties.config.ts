import { defineConfig } from 'vite';
export default defineConfig({
  publicDir: false,
  build: { emptyOutDir: false, outDir: 'music/artist/assets',
    lib: { entry: 'src/audionaut-royalties/page.ts', formats: ['es'], fileName: () => 'audionauts.js' },
    rollupOptions: { output: { inlineDynamicImports: true } } }
});
