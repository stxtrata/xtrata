// Package reviewed bytes and source. Never signs, deploys or inscribes.
import {readFile,writeFile,mkdir,copyFile,cp,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {join} from 'node:path';
const hash=b=>createHash('sha256').update(b).digest('hex');
const readJson=async p=>JSON.parse(await readFile(p,'utf8'));
const out='releases/2.3.1',manifest=await readJson('dist/manifest.json');
if(manifest.build!=='2.3.1'||hash(await readFile('dist/xchess.html'))!==manifest.htmlSha256)throw Error('Wrong candidate bytes');
const reportNames=['tests.json','final-artifact-tests.json','contracts.json','vector-test.json','browser-report.json','peer-browser-report.json'];
const reports={};
for(const name of reportNames){const r=await readJson('dist/'+name);if(!(r.success??r.passed))throw Error('Report failed: '+name);if(name.includes('browser')&&r.artifactSha256!==manifest.htmlSha256)throw Error('Stale browser artifact: '+name);reports[name]={sha256:hash(await readFile('dist/'+name)),passed:r.numPassedTests??r.results.length,skipped:r.numPendingTests??0};}
const peer=await readJson('dist/peer-manifest.json');
for(const [path,digest] of Object.entries(peer.peerSources))if(hash(await readFile(path))!==digest)throw Error('Source changed after build: '+path);
await mkdir(out,{recursive:true});await mkdir(out+'/evidence',{recursive:true});
for(const name of ['xchess.html','manifest.json','peer-manifest.json','reproducibility.json','verify-peer.mjs'])await copyFile('dist/'+name,out+'/'+name);
await copyFile('contracts/xchess-peer-v1.clar',out+'/xchess-peer-v1.clar');
await copyFile('ops/PEER-2.3.1.md',out+'/README.md');
await copyFile('tests/peer/vectors/fools-mate.json',out+'/peer-fools-mate.json');
for(const name of [...reportNames,'offline-verification.json','clarinet-check.log','docs-audit.log','serverless-audit.log','typecheck.log','source-rebuild.json'])await copyFile('dist/'+name,out+'/evidence/'+name);
const source=out+'/source';await mkdir(source,{recursive:true});
for(const dir of ['packages','apps','contracts','tests/peer','harness/peer','harness/browser','harness/runtime/captured'])await cp(dir,source+'/'+dir,{recursive:true});
for(const file of ['package.json','package-lock.json','tsconfig.json','vitest.config.ts','vitest.clarinet.config.ts','Clarinet.toml','settings/Devnet.toml','tests/clarity/peer.test.ts','harness/candidate.mjs','harness/candidate.json','harness/serverless-audit.mjs']){const dest=source+'/'+file;await mkdir(dest.slice(0,dest.lastIndexOf('/')),{recursive:true});await copyFile(file,dest);}
await writeFile(source+'/README.md','# Rebuildable candidate source\n\nRun `npm ci`, `npm run build:candidate`, and `npm run test:peer`.\nThe source snapshot includes the full application/build modules and focused peer tests.\nThe parent workspace contains the full historical regression harness.\nRun the peer registry test with `npx vitest run -c vitest.clarinet.config.ts tests/clarity/peer.test.ts`.\nLocal browser tests use `CHROME_BIN` to select Chrome. No command deploys a contract.\n');
await writeFile(out+'/VALIDATION.json',JSON.stringify({version:'2.3.1',artifactSha256:manifest.htmlSha256,bytes:manifest.bytes,xtrataChunks:manifest.xtrataChunks,packagedAt:new Date().toISOString(),reports,sourceRebuild:await readJson('dist/source-rebuild.json'),notes:[
'Full regression passed with 17 deliberate skips (13 deep perft, three live-network tests and one vector generator).',
'After the full run, only peer button styling changed; final focused tests and both browser reports validate the exact packaged HTML.',
'Contract suite uses actual frontend create/join ABI in simnet; no live transaction, registry deployment or inscription was performed.',
'Native WebRTC ran in separate Chrome profiles with manual signed offer/answer and no ICE services; local fixture HTTP commands coordinate tests, not application move transport.',
'Wallet automation uses stubs and captured Xtrata scripts. Real wallet signing, production viewer networking and sealed inscription read-back remain manual/deployment checks.',
'Offline example is a frozen public browser-generated vector, independently checked by the bundled Node verifier. It has no verified Stacks identity.',
'12 Clarinet analysis warnings remain; both contracts check successfully. No peer timeout adjudication, hosted referee, rating or payout integration exists.'
],manualVisualCheck:'Final desktop Quick Play inspected in Chrome through browser UI; native browser tests additionally assert mobile board tracks fit and keyboard focus works.'},null,2)+'\n');
async function walk(dir,prefix=''){const paths=[];for(const e of await readdir(dir,{withFileTypes:true})){const p=join(dir,e.name),rel=join(prefix,e.name);if(e.isDirectory())paths.push(...await walk(p,rel));else if(rel!=='SHA256SUMS')paths.push([rel,hash(await readFile(p))]);}return paths;}
const files=(await walk(out)).sort(([a],[b])=>a.localeCompare(b));await writeFile(out+'/SHA256SUMS',files.map(([p,h])=>h+'  '+p).join('\n')+'\n');
console.log(JSON.stringify({release:out,files:files.length,artifactSha256:manifest.htmlSha256,reports},null,2));
