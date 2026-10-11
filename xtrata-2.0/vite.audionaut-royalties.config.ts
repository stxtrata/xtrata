import { defineConfig } from 'vite';
export default defineConfig({
  publicDir: false,
  build: { emptyOutDir: false, outDir: 'public/audionauts/royalties',
    lib: { entry: 'src/audionaut-royalties/page.ts', formats: ['es'], fileName: () => 'page.js' },
    rollupOptions: { output: { inlineDynamicImports: true } } }
});
