import {defineConfig} from 'vite';
export default defineConfig({publicDir:false,build:{emptyOutDir:false,outDir:'public/radio',lib:{entry:'src/music-profile/page.ts',formats:['es'],fileName:()=> 'music-profile.js'},rollupOptions:{output:{inlineDynamicImports:true}}}});
