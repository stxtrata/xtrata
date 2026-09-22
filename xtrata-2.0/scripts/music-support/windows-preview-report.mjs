// Native Windows build evidence for a single NSIS installer. The report holds
// only public artifact metadata and a checksum; it never opens the app or any
// user-data location.
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {createReadStream,existsSync} from 'node:fs';
import {mkdir,readFile,stat,writeFile} from 'node:fs/promises';
import {basename,dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const projectRoot=resolve(dirname(fileURLToPath(import.meta.url)),'../..');

function argument(name){
 const index=process.argv.indexOf(name);
 return index>=0?process.argv[index+1]:undefined;
}
async function sha256(path){
 const hash=createHash('sha256');
 for await(const chunk of createReadStream(path))hash.update(chunk);
 return hash.digest('hex');
}
function sourceRevision(){
 let root,revision;
 try{root=execFileSync('git',['rev-parse','--show-toplevel'],{cwd:projectRoot,encoding:'utf8'}).trim();revision=execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim();}
 catch{throw Error('Cannot determine the source revision for this release evidence.');}
 const dirty=execFileSync('git',['status','--porcelain','--untracked-files=normal'],{cwd:root,encoding:'utf8'}).trim();
 if(dirty)throw Error('Refusing Windows release evidence from a dirty source tree. Changed paths (no file contents):\n'+dirty+'\nResolve the generating step and rebuild.');
 if(process.env.GITHUB_SHA&&process.env.GITHUB_SHA!==revision)throw Error('The CI source revision does not match the checked-out source tree.');
 return revision;
}
function authenticodeStatus(path){
 const escaped=path.replace(/'/g,"''");
 try{
  return execFileSync('powershell.exe',['-NoProfile','-NonInteractive','-Command',`(Get-AuthenticodeSignature -LiteralPath '${escaped}').Status`],{encoding:'utf8'}).trim()||'Unknown';
 }catch{return 'Unavailable';}
}

if(process.platform!=='win32')throw Error('Windows preview evidence must be generated on the native Windows build host.');
const packageMetadata=JSON.parse(await readFile(resolve(projectRoot,'desktop/music/package.json'),'utf8'));
const installerName=`Xtrata-Music-${packageMetadata.version}-windows11-preview-x64.exe`;
const artifactDirectory=resolve(argument('--artifact-dir')||resolve(projectRoot,'.artifacts/music-desktop'));
const installer=resolve(artifactDirectory,installerName);
if(!existsSync(installer))throw Error(`Windows NSIS installer was not found: ${installer}`);
const reportPath=resolve(argument('--report')||`${installer}.report.json`);
const checksumPath=resolve(argument('--checksum')||`${installer}.sha256`);
const checksum=await sha256(installer);
const report={
 schema:'xtrata-music-windows-preview-report-v1',
 product:'Xtrata Music',
 version:packageMetadata.version,
 target:'Windows 11 x64 preview',
 artifact:basename(installer),
 artifactBytes:(await stat(installer)).size,
 sha256:checksum,
 checksumFile:basename(checksumPath),
 sourceRevision:sourceRevision(),
 buildHost:{platform:process.platform,architecture:process.arch},
 signing:{
  authenticodeStatus:authenticodeStatus(installer),
  note:'Authenticode status is measured on this Windows build host; preview signing is not implied by a successful build.',
 },
};
await mkdir(dirname(reportPath),{recursive:true});
await writeFile(reportPath,JSON.stringify(report,null,2)+'\n',{mode:0o600});
await writeFile(checksumPath,`${checksum} *${basename(installer)}\n`,{mode:0o600});
console.log(`PASS: SHA-256 written to ${basename(checksumPath)} with evidence in ${basename(reportPath)}; Authenticode ${report.signing.authenticodeStatus}.`);
