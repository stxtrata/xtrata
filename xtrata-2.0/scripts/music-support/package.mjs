import {mkdtemp,mkdir,copyFile,writeFile,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const root=fileURLToPath(new URL('../../',import.meta.url));
const stage=await mkdtemp(join(tmpdir(),'music-support-package-'));
const out=join(root,'public/downloads');await mkdir(out,{recursive:true});
// Explicit allowlist: never archive a working directory, vault, journal or .artifacts.
const names=['radio-plays-server.mjs','radio-plays-backend.mjs','radio-listening.mjs','radio-media.mjs','radio-plays-panel.html','radio-plays-ui.js','radio-plays-ui.css','radio-listening-ui.js','music-lounge.html','music-lounge.css','music-lounge.js','inscribe.mjs','compose.mjs','personas.mjs'];
try{
 const target=join(stage,'xtrata-music-support');
 for(const rel of ['package.json','package-lock.json','src/lib/radio/artist-credits.mjs',...names.map(n=>'scripts/wizard/'+n)]){await mkdir(dirname(join(target,rel)),{recursive:true});await copyFile(join(root,rel),join(target,rel));}
 await copyFile(join(root,'scripts/music-support/setup.mjs'),join(target,'setup.mjs'));
 await copyFile(join(root,'docs/radio/MUSIC-LOUNGE.md'),join(target,'README.md'));
 await writeFile(join(target,'Install.command'),'#!/bin/sh\ncd "$(dirname "$0")" || exit 1\nnode setup.mjs\nread -r answer\n',{mode:0o755});
 await writeFile(join(target,'Install.cmd'),'@echo off\r\ncd /d "%~dp0"\r\nnode setup.mjs\r\npause\r\n');
 await writeFile(join(target,'Start.command'),'#!/bin/sh\ncd "$(dirname "$0")" || exit 1\nnpm run music:lounge\n',{mode:0o755});
 await writeFile(join(target,'Start.cmd'),'@echo off\r\ncd /d "%~dp0"\r\nnpm run music:lounge\r\npause\r\n');
 const archive=join(out,'xtrata-music-support.tar.gz');execFileSync('tar',['-czf',archive,'-C',stage,'xtrata-music-support'],{env:{...process.env,COPYFILE_DISABLE:'1'}});
 await writeFile(join(out,'xtrata-music-support.sha256'),createHash('sha256').update(await readFile(archive)).digest('hex')+'  xtrata-music-support.tar.gz\n');
 console.log('Built Music Support source package (no wallet data).');
}finally{await rm(stage,{recursive:true,force:true});}
