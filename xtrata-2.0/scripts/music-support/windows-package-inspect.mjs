// Native Windows package inspection for the desktop preview. This reads the
// generated ASAR without launching the application and reports only names and
// counts, never file contents or wallet material.
import {existsSync} from 'node:fs';
import {mkdir,readdir,writeFile} from 'node:fs/promises';
import {basename,dirname,join,relative,resolve} from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import {createReadStream} from 'node:fs';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'../..');
const requireFromDesktop=createRequire(pathToFileURL(resolve(root,'desktop/music/package.json')));
const {listPackage}=requireFromDesktop('@electron/asar');
const forbidden=[
 /(^|\/)(unlock\.key|vault\.json|journal\.json|setup\.lock|run\.lock)$/i,
 /(^|\/)(?:id_rsa|id_ed25519|[^/]+\.(?:pem|p12|pfx))$/i,
 /(^|\/)\.env(?:\.[^/]*)?$/i,
 /(^|\/)(?:__tests__|tests)(?:\/|$)/i,
 /\.map$/i,
 /\.(?:ts|tsx)$/i,
 /(^|\/)(?:smoke-entry|startup-test)\.mjs$/i,
 /(^|\/)scripts\/music-support(?:\/|$)/i,
];
const required=[
 'main.mjs',
 'window.mjs',
 'navigation.mjs',
 'release-platforms.mjs',
 'unavailable-wallet.mjs',
 'windows-vault-protection.mjs',
 'app/scripts/wizard/radio-plays-backend.mjs',
 'app/scripts/wizard/radio-plays-server.mjs',
 'app/scripts/wizard/music-web-bridge.mjs',
 'app/scripts/wizard/radio-listening.mjs',
 'app/scripts/wizard/radio-media.mjs',
 'app/scripts/wizard/radio-listening-policy.mjs',
 'app/scripts/wizard/music-release-policy.mjs',
];

function argument(name){
 const index=process.argv.indexOf(name);
 return index>=0?process.argv[index+1]:undefined;
}
async function listFiles(directory){
 if(!existsSync(directory))return [];
 const output=[];
 async function visit(current){
  for(const entry of await readdir(current,{withFileTypes:true})){
   const path=join(current,entry.name);
   if(entry.isDirectory())await visit(path);
   else if(entry.isFile())output.push(relative(directory,path).replace(/\\/g,'/'));
  }
 }
 await visit(directory);
 return output;
}
async function sha256(path){
 const hash=createHash('sha256');
 for await(const chunk of createReadStream(path))hash.update(chunk);
 return hash.digest('hex');
}

const archiveArgument=argument('--asar')||process.argv[2];
const reportArgument=argument('--report');
if(!archiveArgument)throw Error('Usage: node windows-package-inspect.mjs --asar <path-to-app.asar> [--report <path>]');
const archive=resolve(archiveArgument);
if(!existsSync(archive))throw Error(`Packaged ASAR was not found: ${archive}`);

const entries=listPackage(archive).map(entry=>entry.replace(/\\/g,'/').replace(/^\/+/,''));
// Inspect the entire generated application payload, not only app.asar. This
// includes asar.unpacked, Electron resources and any accidental extra files
// that an installer would place beneath win-unpacked.
const payloadDirectory=dirname(dirname(archive));
const payloadEntries=await listFiles(payloadDirectory);
const matchedForbidden=[...entries,...payloadEntries].filter(entry=>forbidden.some(pattern=>pattern.test(entry)));
const missingRequired=required.filter(entry=>!entries.includes(entry));
if(matchedForbidden.length||missingRequired.length){
 const parts=[];
 if(matchedForbidden.length)parts.push(`forbidden packaged paths: ${matchedForbidden.join(', ')}`);
 if(missingRequired.length)parts.push(`required packaged paths missing: ${missingRequired.join(', ')}`);
 throw Error(`Windows package inspection failed (${parts.join('; ')}).`);
}

const report={
 schema:'xtrata-music-windows-package-inspection-v1',
 target:'Windows 11 x64 preview',
 archive:basename(archive),
 archiveSha256:await sha256(archive),
 asarEntryCount:entries.length,
 payloadEntryCount:payloadEntries.length,
 checks:{
  walletSecretsInPackage:false,
  developmentOrTestFilesInPackage:false,
  requiredRuntimeFilesPresent:true,
 },
};
if(reportArgument){
 const reportPath=resolve(reportArgument);
 await mkdir(dirname(reportPath),{recursive:true});
 await writeFile(reportPath,JSON.stringify(report,null,2)+'\n',{mode:0o600});
}
console.log(`PASS: inspected ${report.archive} (${report.asarEntryCount} entries); no wallet, test, or development files found.`);
