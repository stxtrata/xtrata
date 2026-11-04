#!/usr/bin/env node
// Build only this standalone machine. No casino files are opened for writing.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {gzipSync,gunzipSync} from 'node:zlib';
import {fileURLToPath} from 'node:url';
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8'),write=(p,s)=>{fs.mkdirSync(path.dirname(path.join(ROOT,p)),{recursive:true});fs.writeFileSync(path.join(ROOT,p),s);};
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
const EXPECTED='203f8735007d8df9c2058be24c8e65fe269abac341438c0217128baef69f9bed';
const engine=read('src/engine.js');
const fullEngineHash='7f619182ada01119a713c64874eb1a7e024d7c210e0dca0ec2e8afc05c143168';
const engineBlock=engine.match(/const BF = \(\(\) => \{[\s\S]*?\n\}\)\(\);/)?.[0];
if(hash(engine)!==fullEngineHash||engineBlock?.length!==11429||hash(engineBlock)!==EXPECTED)throw Error('Immutable engine mismatch');
const manifest=JSON.parse(read('art/assets.json')),assetData={};
const mime=p=>p.endsWith('.mp3')?'audio/mpeg':p.endsWith('.ogg')?'audio/ogg':p.endsWith('.webp')?'image/webp':p.endsWith('.svg')?'image/svg+xml':'image/png';
function collect(value){if(!value||typeof value!=='object')return;for(const[k,v]of Object.entries(value)){if((k==='image'||k==='file')&&typeof v==='string'&&v.startsWith('art/')){const file=path.join(ROOT,v);if(!fs.existsSync(file))throw Error('Missing bundled asset '+v);assetData[v]='data:'+mime(v)+';base64,'+fs.readFileSync(file).toString('base64');}else if(typeof v==='object')collect(v);}}
manifest.family=manifest.family.filter(x=>!['family-06','family-57'].includes(x.key));
if(manifest.symbols?.wild?.image)delete manifest.symbols.wild.collectionSnapshot;
collect(manifest);
function compact(v){if(Array.isArray(v))return v.map(compact);if(!v||typeof v!=='object')return v;const o={};for(const[k,x]of Object.entries(v))if(!['attempt_errors','image_uri','image_canonical_uri','token_uri','retrieved_from','sha256','bundledSha256','processing','readError'].includes(k))o[k]=compact(x);return o;}
const runtimeAssets=compact(manifest),reports=fs.readdirSync(path.join(ROOT,'checks/results')).filter(n=>/^rtp-appendix-\d+\.json$/.test(n)).map(n=>JSON.parse(read('checks/results/'+n))).map(({seed,paidSpins,rtpPercent,deviationPercentagePoints})=>({seed,paidSpins,rtpPercent,deviationPercentagePoints}));
const safeJSON=v=>JSON.stringify(v).replaceAll('<','\\u003c').replaceAll('\u2028','\\u2028').replaceAll('\u2029','\\u2029');
const assets=`window.CORGI_ART=${safeJSON(runtimeAssets)};(function(){const files=${safeJSON(assetData)};function load(v){if(v&&typeof v==='object')for(const[k,x]of Object.entries(v)){if((k==='image'||k==='file')&&typeof x==='string'&&files[x])v[k]=files[x];else if(typeof x==='object')load(x);}}load(window.CORGI_ART);})();window.CK_RTP_REPORTS=${safeJSON(reports)};try{window.PX_STANDALONE_TEST=window.parent.PX_STANDALONE_TEST===true;}catch(_){};`;
const script=read('src/game.js').replace('/* @PRISTINE_ENGINE@ */','const PX_PURE=Object.freeze({...BF});').replace('/* @LAB_RNG@ */',read('src/lab-rng.js'));
if(script.includes('/* @'))throw Error('A build token was not expanded');
const css=read('src/game.css');
const game='<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#12392c"><title>Corgi Kennel · ParallaX Casino</title><style>'+css+'</style></head><body>'+read('src/game.html')+'<script>'+read('src/layr-account.js')+'</script><script>'+read('src/compat.js')+'</script><script>'+engine+'</script><script>'+read('vendor/xlogo.js')+'</script><script>'+assets+'</script><script>'+script+'</script></body></html>';
const anchors=[
  /<script>\/\* One existing LAYR account/g,
  /GAME_ID='corgi-kennel', *LAYR=window\.ParallaxLAYRAccount, *E=LAYR\.machine\(GAME_ID,BF\)/g,
  /const screen *= *canvas\(2800, *1920\), *sg *= *screen\.getContext\('2d'\); *sg\.setTransform\(2, *0, *0, *2, *0, *0\);/g,
  /connect\(\s*ac\.destination\s*\)/g,
  /window\.PX_CASINO_ENGINE=\{/g
];
for(const anchor of anchors)if([...game.matchAll(anchor)].length!==1)throw Error('Invalid room patch anchor '+anchor);
const model=read('src/model.json'),cabinet=JSON.parse(model);
const roles=new Set(),actions=new Set();
function checkNode(node){roles.add(node.role);if(node.g!=null&&node.action)actions.add(node.action);for(const child of node.children)checkNode(child);}
for(const key of ['geometries','materials','textures'])if(!Array.isArray(cabinet[key]))throw Error('Missing cabinet '+key);
checkNode(cabinet.root);
for(const role of ['screenMesh','crest','spinPhysical','lever'])if(!roles.has(role))throw Error('Missing cabinet role '+role);
for(const action of ['spin','betUp','betDown','auto','pays'])if(!actions.has(action)||!roles.has('btn-'+action)||!roles.has('btnface-'+action))throw Error('Incomplete deck action '+action);
const pack={name:'Corgi Kennel',description:'The Welsh kennel club · real token art, three bonus games and Best in Show',color:'#163e2c',accent:'#f59e0b',model:gzipSync(model,{level:9}).toString('base64'),game:gzipSync(game,{level:9}).toString('base64'),css};
write('pack.json',JSON.stringify(pack));write('pack.js','window.CK_PACK='+safeJSON(pack)+';\n');write('dist/corgi-kennel-game.html',game);
const bootstrap=`window.PX_STANDALONE_TEST=true;try{window.CK_TEST_TAB=sessionStorage.getItem('corgi-kennel.tab');if(!window.CK_TEST_TAB){window.CK_TEST_TAB=Array.from(crypto.getRandomValues(new Uint32Array(3)),v=>v.toString(16)).join('-');sessionStorage.setItem('corgi-kennel.tab',window.CK_TEST_TAB);}}catch(_){window.CK_TEST_TAB='standalone';}`;
const index='<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#142b1d"><meta name="description" content="Corgi Kennel: a standalone ParallaX Casino machine with authentic Welsh-family art, a green and brass cabinet, animated bonuses and practice previews."><title>Corgi Kennel · The Welsh Kennel Club</title><style>'+read('src/host.css')+'</style></head><body>'+read('src/host.html')+'<script>'+bootstrap+'</script><script>'+read('vendor/layr-test-stub.js')+'</script><script>'+read('vendor/three-r128.min.js')+'</script><script>'+read('vendor/software-renderer.js')+'</script><script>window.PX_MODEL='+model+';window.PX_GAME_HTML='+safeJSON(game)+';</script><script>'+read('src/host.js')+'</script></body></html>';
write('index.html',index);
const metadata={builtAt:new Date().toISOString(),engineCharacters:engineBlock.length,engineSha256:hash(engineBlock),fullEngineSha256:hash(engine),patchAnchors:anchors.length,packBytes:Buffer.byteLength(JSON.stringify(pack)),gameBytes:Buffer.byteLength(game),modelBytes:Buffer.byteLength(model),standaloneBytes:Buffer.byteLength(index),assetCount:Object.keys(assetData).length,budgetBytes:3*1024*1024,withinBudget:Buffer.byteLength(JSON.stringify(pack))<=3*1024*1024,threeRevision:'128',selfContained:true};
write('checks/results/build.json',JSON.stringify(metadata,null,2)+'\n');
if(gunzipSync(Buffer.from(pack.game,'base64')).toString()!==game)throw Error('Game round-trip failed');
if(gunzipSync(Buffer.from(pack.model,'base64')).toString()!==model)throw Error('Model round-trip failed');
console.log(JSON.stringify(metadata,null,2));
