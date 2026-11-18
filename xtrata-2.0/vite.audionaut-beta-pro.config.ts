import {defineConfig} from 'vite';
export default defineConfig({publicDir:false,build:{emptyOutDir:false,outDir:'public/audionaut-beta-pro',lib:{entry:'src/audionaut-beta-pro/page.ts',formats:['es'],fileName:()=> 'audionaut-pro-gate.js'},rollupOptions:{output:{inlineDynamicImports:true}}}});
