import {defineConfig} from 'vite';
export default defineConfig({publicDir:false,build:{emptyOutDir:false,outDir:'public/arcade',lib:{entry:'src/arcade-submit/page.ts',formats:['es'],fileName:()=> 'submit.js'},rollupOptions:{output:{inlineDynamicImports:true}}}});
