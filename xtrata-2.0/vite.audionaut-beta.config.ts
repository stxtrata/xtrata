import {defineConfig} from 'vite';
export default defineConfig({publicDir:false,build:{emptyOutDir:false,outDir:'public/audionaut-beta',lib:{entry:'src/audionaut-beta/page.ts',formats:['es'],fileName:()=> 'audionaut-pro-gate.js'},rollupOptions:{output:{inlineDynamicImports:true}}}});
