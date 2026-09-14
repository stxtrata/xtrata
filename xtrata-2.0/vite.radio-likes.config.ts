import {defineConfig} from 'vite';
export default defineConfig({publicDir:false,build:{emptyOutDir:false,outDir:'public/radio',lib:{entry:'src/radio-likes/page.ts',formats:['es'],fileName:()=> 'onchain.js'},rollupOptions:{output:{inlineDynamicImports:true}}}});
