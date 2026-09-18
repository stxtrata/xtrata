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
const names=['music-web-bridge.mjs','music-web-approval.html','music-web-approval.js','radio-plays-server.mjs','radio-plays-backend.mjs','radio-listening.mjs','radio-media.mjs','radio-plays-panel.html','radio-plays-ui.js','radio-plays-ui.css','radio-listening-ui.js','music-lounge.html','music-lounge.css','music-lounge.js','inscribe.mjs','compose.mjs','personas.mjs'];
try{
 const target=join(stage,'xtrata-music-support');
 for(const rel of ['src/lib/radio/artist-credits.mjs',...names.map(n=>'scripts/wizard/'+n)]){await mkdir(dirname(join(target,rel)),{recursive:true});await copyFile(join(root,rel),join(target,rel));}
 await copyFile(join(root,'scripts/music-support/runtime/package.json'),join(target,'package.json'));
 await copyFile(join(root,'scripts/music-support/runtime/package-lock.json'),join(target,'package-lock.json'));
 await copyFile(join(root,'scripts/music-support/setup.mjs'),join(target,'setup.mjs'));
 await copyFile(join(root,'scripts/music-support/open.mjs'),join(target,'open.mjs'));
 await copyFile(join(root,'docs/radio/MUSIC-SUPPORT-INSTALL.md'),join(target,'README.md'));
 await copyFile(join(root,'scripts/music-support/README.html'),join(target,'README.html'));
 await copyFile(join(root,'scripts/music-support/README.html'),join(target,'1 - READ ME FIRST.html'));
 const mac='#!/bin/sh\ncd "$(dirname "$0")" || exit 1\nif ! command -v node >/dev/null 2>&1; then\n  open "https://nodejs.org/en/download"\n  osascript -e \'display dialog "Install Node.js 24 LTS from the page that just opened, then double-click START HERE again." buttons {"OK"} default button "OK" with title "Xtrata Music"\'\n  exit 1\nfi\nnode open.mjs\nstatus=$?\nif [ "$status" -ne 0 ]; then\n  printf "\\nSetup did not finish. Read README.html, then press Return to close.\\n"\n  read -r answer\nfi\nexit "$status"\n';
 const windows='@echo off\r\ncd /d "%~dp0"\r\nwhere node >nul 2>nul\r\nif errorlevel 1 (\r\n  start "" "https://nodejs.org/en/download"\r\n  echo Install Node.js 24 LTS from the page that opened, then double-click START HERE again.\r\n  pause\r\n  exit /b 1\r\n)\r\nnode open.mjs\r\nif errorlevel 1 pause\r\n';
 const linux='#!/bin/sh\ncd "$(dirname "$0")" || exit 1\nif ! command -v node >/dev/null 2>&1; then\n  printf "Install Node.js 24 LTS from https://nodejs.org/en/download and run this file again.\\n"\n  exit 1\nfi\nnode open.mjs\n';
 await writeFile(join(target,'START HERE - Mac.command'),mac,{mode:0o755});
 await writeFile(join(target,'START HERE - Windows.cmd'),windows);
 await writeFile(join(target,'START HERE - Linux.sh'),linux,{mode:0o755});
 await writeFile(join(target,'Install.command'),'#!/bin/sh\nexec "$(dirname "$0")/START HERE - Mac.command"\n',{mode:0o755});
 await writeFile(join(target,'Start.command'),'#!/bin/sh\nexec "$(dirname "$0")/START HERE - Mac.command"\n',{mode:0o755});
 await writeFile(join(target,'Install.cmd'),'@echo off\r\ncall "%~dp0START HERE - Windows.cmd"\r\n');
 await writeFile(join(target,'Start.cmd'),'@echo off\r\ncall "%~dp0START HERE - Windows.cmd"\r\n');
 const archive=join(out,'xtrata-music-support.tar.gz');execFileSync('tar',['-czf',archive,'-C',stage,'xtrata-music-support'],{env:{...process.env,COPYFILE_DISABLE:'1'}});
 await writeFile(join(out,'xtrata-music-support.sha256'),createHash('sha256').update(await readFile(archive)).digest('hex')+'  xtrata-music-support.tar.gz\n');
 console.log('Built Music Support source package (no wallet data).');
}finally{await rm(stage,{recursive:true,force:true});}
