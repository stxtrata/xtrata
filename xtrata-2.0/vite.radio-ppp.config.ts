import {defineConfig} from 'vite';
// /radio pay-per-play panel. The listening wallet itself is a separate origin (vite.listening-wallet.config.ts).
export default defineConfig({publicDir:false,build:{emptyOutDir:false,outDir:'public/radio',lib:{entry:'src/radio-ppp/page.ts',formats:['es'],fileName:()=> 'ppp.js'},rollupOptions:{output:{inlineDynamicImports:true}}}});
