import {mkdir,copyFile,rm,readFile,writeFile} from 'node:fs/promises';
import {dirname,join} from 'node:path';
import {fileURLToPath} from 'node:url';
const here=dirname(fileURLToPath(import.meta.url)),root=join(here,'../..'),out=join(here,'app');
// Copy only reviewed source. Never package a repository tree or wallet directory.
const names=['music-profile-proof.mjs','music-profile-local.mjs','music-profile-ui.js','music-version.json','music-logo.webp','radio-plays-server.mjs','radio-plays-backend.mjs','radio-listening.mjs','radio-listening-policy.mjs','radio-media.mjs','radio-plays-ui.js','radio-plays-ui.css','radio-listening-ui.js','music-lounge.html','music-lounge.css','music-lounge.js','music-web-bridge.mjs','music-release-policy.mjs','inscribe.mjs','compose.mjs','personas.mjs'];
await rm(out,{recursive:true,force:true});
for(const path of [...names.map(n=>'scripts/wizard/'+n),'src/lib/radio/artist-credits.mjs','public/radio/chain-activity.js','public/radio/paid-receipt.mjs']){await mkdir(dirname(join(out,path)),{recursive:true});await copyFile(join(root,path),join(out,path));}
const versions=JSON.parse(await readFile(join(here,'release-versions.json'),'utf8'));
const version=versions[process.platform]||JSON.parse(await readFile(join(here,'package.json'),'utf8')).version;
await writeFile(join(out,'scripts/wizard/music-version.json'),JSON.stringify({version})+'\n');
console.log('Prepared desktop source; no wallet files included.');
