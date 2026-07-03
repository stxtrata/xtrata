import { defineConfig } from 'vite';

// Standalone Xtrata Radio widget for static side pages. Bundles the radio
// (styles inlined) into a single IIFE at public/xtrata-radio.js so every page
// can carry the station; the copy in public/ ships to dist/ on the main build.
//   npx vite build -c vite.radio.config.ts
export default defineConfig({
  publicDir: false,
  build: {
    lib: {
      entry: 'src/home/radio-standalone.js',
      name: 'XtrataRadio',
      formats: ['iife'],
      fileName: () => 'xtrata-radio.js',
    },
    outDir: 'public',
    emptyOutDir: false,
    minify: true,
  },
});
