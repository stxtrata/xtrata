import {defineConfig} from 'vite';
export default defineConfig({publicDir:false,build:{emptyOutDir:false,outDir:'public/radio',lib:{entry:'src/radio-likes/wallet.ts',formats:['es'],fileName:()=> 'wallet.js'},rollupOptions:{output:{inlineDynamicImports:true}}}});
