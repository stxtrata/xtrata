import {defineConfig} from 'vite';
// ParallaX Casino: page side of the testnet casino wallet (docs/plans/CASINO-PASSKEY-WALLET-PLAN.md). The wallet itself is a separate
// origin (vite.casino-wallet.config.ts). Not part of `prebuild`: rebuild by hand with `npm run build:casino-passkey` and commit
// public/casino/passkey-wallet.js. emptyOutDir MUST stay false: public/casino also holds index.html, room.js and adrian.glb.
export default defineConfig({publicDir:false,build:{emptyOutDir:false,minify:true,outDir:'public/casino',lib:{entry:'src/casino-room/passkey-wallet.ts',formats:['es'],fileName:()=> 'passkey-wallet.js'},rollupOptions:{output:{inlineDynamicImports:true}}}});
