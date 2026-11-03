import {defineConfig} from 'vite';
// Casino room client bundle for /casino (docs/plans/CASINO-PRESENCE-PLAN.md, P1). Not part of `prebuild`: rebuild by hand with
// `npm run build:casino-room` and commit public/casino/room.js, so a failure here can never break a deploy.
// emptyOutDir MUST stay false: public/casino also holds index.html and adrian.glb.
export default defineConfig({publicDir:false,build:{emptyOutDir:false,minify:true,outDir:'public/casino',lib:{entry:'src/casino-room/main.ts',formats:['es'],fileName:()=> 'room.js'},rollupOptions:{output:{inlineDynamicImports:true}}}});
