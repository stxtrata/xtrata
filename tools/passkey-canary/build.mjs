import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
const here=fileURLToPath(new URL('.',import.meta.url));
const require=createRequire(new URL('upstream/package.json',import.meta.url));
const {build}=require('esbuild');
await build({entryPoints:[here+'adapter.ts'],bundle:true,platform:'node',format:'esm',outfile:here+'generated/adapter.mjs',packages:'external'});
await build({entryPoints:[here+'canary/main.ts'],bundle:true,platform:'browser',format:'esm',outfile:here+'canary/app.js',minify:false});
console.log('Built the adapter and browser page. The pinned Xtrata seed snapshot/bundle is unchanged.');
