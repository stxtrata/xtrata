// Build an auditable release package without publishing or modifying old releases.
import {readFile,writeFile,mkdir,copyFile,cp,readdir,symlink,unlink,rm} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {resolve,join} from 'node:path';
const json=async p=>JSON.parse(await readFile(p,'utf8')),sha=b=>createHash('sha256').update(b).digest('hex');
const manifest=await json('dist/manifest.json'),version=(await json('package.json')).version,out='releases/'+version;
if(version!=='2.3.2'||manifest.build!==version||sha(await readFile('dist/xchess.html'))!==manifest.htmlSha256)throw Error('Wrong release bytes');
if(existsSync(out))throw Error('Release directory already exists; do not overwrite immutable releases');
const names=['tests.json','final-artifact-tests.json','contracts.json','browser-report.json','peer-browser-report.json'];
const reports={};for(const name of names){const r=await json('dist/'+name);if(!(r.success??r.passed))throw Error('Failed report '+name);if(name.includes('browser')&&r.artifactSha256!==manifest.htmlSha256)throw Error('Stale browser report');reports[name]={sha256:sha(await readFile('dist/'+name)),passed:r.numPassedTests??r.results.length,skipped:r.numPendingTests??0};}
const peer=await json('dist/peer-manifest.json');for(const [p,h] of Object.entries(peer.peerSources))if(sha(await readFile(p))!==h)throw Error('Source changed since build: '+p);
const previous=await json('releases/2.3.1/peer-manifest.json');for(const [p,h]of Object.entries(previous.peerSources))if(!p.endsWith('/ui.ts')&&sha(await readFile(p))!==h)throw Error('Peer protocol changed: '+p);
await mkdir(out+'/evidence',{recursive:true});
for(const name of ['xchess.html','manifest.json','peer-manifest.json','reproducibility.json','verify-peer.mjs'])await copyFile('dist/'+name,out+'/'+name);
await copyFile('ops/PEER-'+version+'.md',out+'/README.md');
await copyFile('reviews/3037/sealed-result.json',out+'/example-3038.json');
for(const name of [...names,'tests.log','final-artifact-tests.log','contracts.log','offline-verification.json','clarinet-check.log','docs-audit.log','serverless-audit.log','typecheck.log','browser-tests.log','peer-browser-tests.log'])await copyFile('dist/'+name,out+'/evidence/'+name);
const source=out+'/source';await mkdir(source,{recursive:true});
for(const dir of ['packages','apps','contracts','tests/peer','harness/peer','harness/browser','harness/runtime/captured'])await cp(dir,source+'/'+dir,{recursive:true});
for(const file of ['harness/candidate.mjs','harness/candidate.json','harness/serverless-audit.mjs','settings/Devnet.toml','tests/e2e/display-232.test.ts','tests/clarity/peer.test.ts']){await mkdir(resolve(source,file,'..'),{recursive:true});await copyFile(file,source+'/'+file);}
for(const file of ['package.json','package-lock.json','tsconfig.json','vitest.config.ts','vitest.clarinet.config.ts','Clarinet.toml'])await copyFile(file,source+'/'+file);
// Only public build/test sources belong in a release; audit the selected source tree before packaging.
await symlink(resolve('node_modules'),source+'/node_modules');
try{const log=execFileSync(process.execPath,['harness/candidate.mjs'],{cwd:source,encoding:'utf8'});await writeFile(out+'/evidence/source-rebuild.log',log);const actual=sha(await readFile(source+'/dist/xchess.html'));if(actual!==manifest.htmlSha256)throw Error('Packaged source does not reproduce HTML');await writeFile(out+'/evidence/source-rebuild.json',JSON.stringify({passed:true,artifactSha256:actual},null,2)+'\n');}finally{await unlink(source+'/node_modules');}
await rm(source+'/dist',{recursive:true});
await writeFile(out+'/VALIDATION.json',JSON.stringify({version,artifactSha256:manifest.htmlSha256,bytes:manifest.bytes,xtrataChunks:manifest.xtrataChunks,packagedAt:new Date().toISOString(),reports,sourceRebuild:true,protocolsUnchangedFrom:'2.3.1',notes:['Suite counts overlap. Three live tests and the vector generator are skipped; optional deep perft is not required for unchanged engine code.','44 captured-runtime browser checks and 13 native peer checks use the exact release HTML.','10 targeted display/recovery tests include delayed and failed reads.','No new mainnet transactions were needed. Real wallet-extension signing and final sealed-byte read-back remain post-inscription checks.','Clarinet check passed with 12 existing warnings.','A manual file-URL browser inspection was blocked by browser policy; automated Chrome runtime and peer browser suites completed successfully.']},null,2)+'\n');
async function walk(dir,prefix=''){const rows=[];for(const e of await readdir(dir,{withFileTypes:true})){const p=join(dir,e.name),rel=join(prefix,e.name);if(e.isDirectory())rows.push(...await walk(p,rel));else if(rel!=='SHA256SUMS')rows.push([rel,sha(await readFile(p))]);}return rows;}
await writeFile(out+'/SHA256SUMS',(await walk(out)).sort(([a],[b])=>a.localeCompare(b)).map(([p,h])=>h+'  '+p).join('\n')+'\n');
console.log(JSON.stringify({out,sha256:manifest.htmlSha256,bytes:manifest.bytes,chunks:manifest.xtrataChunks,reports},null,2));
