import {defineConfig} from 'vite';
export default defineConfig({base:'/radio/',publicDir:false,worker:{format:'es'},build:{emptyOutDir:false,outDir:'public/radio',lib:{entry:'src/radio-test-wallet/page.ts',formats:['es'],fileName:()=> 'test-wallet.js'},rollupOptions:{output:{inlineDynamicImports:true}}}});
