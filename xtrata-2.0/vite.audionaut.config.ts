import {defineConfig} from 'vite';
export default defineConfig({publicDir:false,build:{emptyOutDir:false,outDir:'public/audionaut',lib:{entry:'src/audionaut/page.ts',formats:['es'],fileName:()=> 'audionaut-gate.js'},rollupOptions:{output:{inlineDynamicImports:true}}}});
