import { defineConfig } from 'vite';
export default defineConfig({
  publicDir: false,
  build: { emptyOutDir: false, outDir: 'music/artist/assets',
    lib: { entry: 'src/music-artist/page.ts', formats: ['es'], fileName: () => 'artist.js' },
    rollupOptions: { output: { inlineDynamicImports: true } } }
});
