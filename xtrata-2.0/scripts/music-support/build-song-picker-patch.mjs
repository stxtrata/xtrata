// Build a UI-only patch from the verified Windows 1.0.2 app archive.
import {createRequire} from 'node:module';
import {readFile,writeFile,mkdir,mkdtemp,rm} from 'node:fs/promises';
import {join,resolve} from 'node:path';
import {tmpdir} from 'node:os';
import {createHash} from 'node:crypto';
const require=createRequire(new URL('../../desktop/music/package.json',import.meta.url));
const asar=require('@electron/asar');
const [input,out]=process.argv.slice(2);
if(!input||!out)throw Error('Usage: node build-song-picker-patch.mjs <original app.asar> <output directory>');
const digest=b=>createHash('sha256').update(b).digest('hex');
const original=resolve(input),output=resolve(out),target='app/scripts/wizard/music-lounge.html';
const originalHash=digest(await readFile(original));
if(originalHash!=='3dd13c6ffdc532383a74cc4656e8f58fa2144269011b45d801cbbcafe754a849')throw Error('Not the verified Windows 1.0.2 archive.');
const html=asar.extractFile(original,target).toString();
const before='<select id="radio-songs">',after='<select id="radio-songs" size="8" aria-label="Pick a song">';
if(html.split(before).length!==2)throw Error('Expected exactly one original song picker.');
const pkg=JSON.parse(asar.extractFile(original,'package.json'));
if(pkg.version!=='1.0.2')throw Error('Patch is only for 1.0.2.');
const temp=await mkdtemp(join(tmpdir(),'music-picker-patch-'));
try{
 asar.extractAll(original,temp);
 await writeFile(join(temp,target),html.replace(before,after));
 await mkdir(output,{recursive:true});
 const patched=join(output,'app.asar');await asar.createPackage(temp,patched);
 const oldFiles=asar.listPackage(original).filter(p=>asar.statFile(original,p.slice(1)).size!==undefined);
 const newFiles=asar.listPackage(patched).filter(p=>asar.statFile(patched,p.slice(1)).size!==undefined);
 if(JSON.stringify(oldFiles.slice().sort())!==JSON.stringify(newFiles.slice().sort()))throw Error('Archive file set changed.');
 const changed=oldFiles.filter(p=>!asar.extractFile(original,p.slice(1)).equals(asar.extractFile(patched,p.slice(1))));
 if(changed.length!==1||changed[0]!=='/'+target)throw Error('Unexpected payload changes: '+changed.join(','));
 const patchedHash=digest(await readFile(patched));
 await writeFile(join(output,'app.asar.sha256'),patchedHash+'  app.asar\n');
 await writeFile(join(output,'patch-report.json'),JSON.stringify({version:'1.0.2',patch:'song-picker-1',originalHash,patchedHash,changedFiles:changed,verification:'Only the lounge HTML payload differs; Windows physical testing pending.'},null,2)+'\n');
 console.log(JSON.stringify({originalHash,patchedHash,changedFiles:changed}));
}finally{await rm(temp,{recursive:true,force:true});}
