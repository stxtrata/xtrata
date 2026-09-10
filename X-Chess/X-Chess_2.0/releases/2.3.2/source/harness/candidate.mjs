// One explicit, reproducible inscription candidate. Never publishes or signs.
import {build} from 'esbuild';
import {spawnSync} from 'node:child_process';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(fileURLToPath(new URL('..',import.meta.url)));
process.chdir(root);
const config=JSON.parse(readFileSync('harness/candidate.json','utf8'));
for(const key of ['version','network','contract','built'])if(!config[key])throw Error('Missing explicit build '+key);
const args=['packages/build/build.mjs',...Object.entries(config).flatMap(([key,value])=>['--'+key,String(value)])];
function run(command,args,env={}) {
  const result=spawnSync(command,args,{stdio:'inherit',env:{...process.env,...env}});
  if(result.status!==0)throw Error(`${command} ${args.join(' ')} failed (${result.status}): ${result.error ?? ''}`);
}
const hash=()=>createHash('sha256').update(readFileSync('dist/xchess.html')).digest('hex');
run(process.execPath,args);const first=hash();const manifest=JSON.parse(readFileSync('dist/manifest.json','utf8'));
run(process.execPath,args);if(first!==hash())throw Error('Rebuild was not byte-for-byte reproducible');
const protocols={replayHash:'30404093ddc8ed66457728cf504989aa21c113f9bb0e1da0f910b412c4c8ef25',rulesHash:'eeb6632332bc2c920c3cdf9f8c66b8d832b1e103992fb77f95100875e134f434',ratingHash:'870dd72d3797a803ce62950f60824f81103cfebce1894407a5f87aabbb42552d',contractHash:'8048e4be63d665c4ac4b94afc6c74187d185f822cedd60fb24d5ece7567b3c9f'};
for(const [key,value] of Object.entries(protocols))if(manifest[key]!==value)throw Error(`${key} differs from inscription 3034`);
if(manifest.contract!==config.contract || manifest.network!==config.network || manifest.build!==config.version || manifest.built!==config.built || manifest.xtrataChunks>32)throw Error('Candidate target or chunk budget failed');
const peerFiles=['contracts/xchess-peer-v1.clar',...['crypto','protocol','store','transport','registry','ui'].map(n=>'packages/peer/'+n+'.ts')];
const peerSources=Object.fromEntries(peerFiles.map(p=>[p,createHash('sha256').update(readFileSync(p)).digest('hex')]));
await build({entryPoints:['harness/peer/verify.ts'],outfile:'dist/verify-peer.mjs',bundle:true,platform:'node',format:'esm',target:'node22',legalComments:'none'});
writeFileSync('dist/peer-manifest.json',JSON.stringify({artifactSha256:first,protocol:'xchess-peer-v1',engine:'xchess-engine-v1:2ce32043537e211ff09dec435ae8c9eec89d21e6e71a082fc4ed0a929668bd33',registryDeployed:true,registry:'SPARQA0T0GWJZADHRMGNVTJ51D014V8P7XPDSTNH.xchess-peer-v1',mandatoryService:null,peerSources,offlineVerifierSha256:createHash('sha256').update(readFileSync('dist/verify-peer.mjs')).digest('hex')},null,2)+'\n');
writeFileSync('dist/reproducibility.json',JSON.stringify({passed:true,artifactSha256:first,config,protocolsUnchangedFrom:3034,protocols},null,2)+'\n');
if(process.argv.includes('--verify')) {
  run('npm',['run','typecheck']);run('clarinet',['check']);
  run('npm',['run','audit:serverless']);run('npm',['run','audit:docs']);
  run('npx',['vitest','run','--reporter=default','--reporter=json','--outputFile.json=dist/tests.json']);
  run('npx',['vitest','run','tests/perft','--reporter=default','--reporter=json','--outputFile.json=dist/deep-perft.json'],{PERFT_DEEP:'1'});
  run('npx',['vitest','run','-c','vitest.clarinet.config.ts','--reporter=default','--reporter=json','--outputFile.json=dist/contracts.json']);
  run(process.execPath,['harness/browser/ci.mjs']);run(process.execPath,['harness/peer/ci.mjs']);
}
console.log('Candidate ready for review: '+first);
