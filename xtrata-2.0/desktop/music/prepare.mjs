import {mkdir,copyFile,rm} from 'node:fs/promises';
import {dirname,join} from 'node:path';
import {fileURLToPath} from 'node:url';
const here=dirname(fileURLToPath(import.meta.url)),root=join(here,'../..'),out=join(here,'app');
// Copy only reviewed source. Never package a repository tree or wallet directory.
const names=['radio-plays-server.mjs','radio-plays-backend.mjs','radio-listening.mjs','radio-media.mjs','radio-plays-ui.js','radio-plays-ui.css','radio-listening-ui.js','music-lounge.html','music-lounge.css','music-lounge.js','music-web-bridge.mjs','inscribe.mjs','compose.mjs','personas.mjs'];
await rm(out,{recursive:true,force:true});
for(const path of [...names.map(n=>'scripts/wizard/'+n),'src/lib/radio/artist-credits.mjs','public/radio/chain-activity.js']){await mkdir(dirname(join(out,path)),{recursive:true});await copyFile(join(root,path),join(out,path));}
console.log('Prepared desktop source; no wallet files included.');
