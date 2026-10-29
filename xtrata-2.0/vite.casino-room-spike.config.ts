import {defineConfig} from 'vite';
// Casino room test page bundle (docs/plans/CASINO-PRESENCE-PLAN.md, P0 spike). Not part of `prebuild`: rebuild by hand with
// `npm run build:casino-room-spike` and commit public/casino-room-spike/spike.js, so a failure here can never break a deploy.
export default defineConfig({publicDir:false,build:{emptyOutDir:false,outDir:'public/casino-room-spike',lib:{entry:'src/casino-room-spike/main.ts',formats:['es'],fileName:()=> 'spike.js'},rollupOptions:{output:{inlineDynamicImports:true}}}});
