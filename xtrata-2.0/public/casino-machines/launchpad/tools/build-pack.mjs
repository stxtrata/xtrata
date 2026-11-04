#!/usr/bin/env node
import {readFileSync,writeFileSync,mkdirSync,statSync,existsSync,copyFileSync} from 'node:fs';
import {gzipSync,gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>readFileSync(path.join(root,p),'utf8');
const packB64=s=>gzipSync(Buffer.from(s),{level:9,mtime:0}).toString('base64');
const engine=read('src/engine.js');
const sha256=s=>createHash('sha256').update(s).digest('hex');
const fileHash=sha256(engine);
if(fileHash!=='7f619182ada01119a713c64874eb1a7e024d7c210e0dca0ec2e8afc05c143168')throw Error('The immutable engine file changed.');
const art=JSON.parse(read('art/runtime-art.json'));
let game=read('src/game-shell.html');
for(const [key,value] of Object.entries({CSS:read('src/game.css'),ACCOUNT:read('src/layr-account.js'),COMPAT:read('src/compat.js'),XLOGO:read('src/xlogo.js'),ENGINE:engine,LAB:read('src/lab-scenarios.js'),ART:'const LAUNCHPAD_ART='+JSON.stringify(art).replace(/<\/script/gi,'<\\/script')+';',GAME:read('src/game.js')}))game=game.replace('/*__'+key+'__*/',()=>value);
if(/\/\*__[A-Z_]+__\*\//.test(game))throw Error('Unfilled game template.');
const start=game.indexOf('const BF = (() => {');
const end=game.indexOf('\n})();',start);
const span=game.slice(start,end+6),hash=sha256(span);
if(span.length!==11429||hash!=='203f8735007d8df9c2058be24c8e65fe269abac341438c0217128baef69f9bed')throw Error('The embedded engine changed.');
const anchors=[
 /<script>\/\* One existing LAYR account/g,
 /GAME_ID='launchpad', *LAYR=window\.ParallaxLAYRAccount, *E=LAYR\.machine\(GAME_ID,BF\)/g,
 /const screen *= *canvas\(2800, *1920\), *sg *= *screen\.getContext\('2d'\); *sg\.setTransform\(2, *0, *0, *2, *0, *0\);/g,
 /connect\(\s*ac\.destination\s*\)/g,
 /window\.PX_CASINO_ENGINE=\{/g
];
const anchorCounts=anchors.map(pattern=>[...game.matchAll(pattern)].length);
if(anchorCounts.some(count=>count!==1))throw Error('Room patch anchor counts: '+anchorCounts.join(', '));
const model=JSON.parse(read('src/cabinet.json'));
const nodes=new Map();
function scan(node){
 if(node.role&&!nodes.has(node.role))nodes.set(node.role,node);
 node.children.forEach(scan);
}
scan(model.root);
for(const role of ['screenMesh','crest','spinPhysical','lever'])if(!nodes.has(role))throw Error('Missing cabinet role: '+role);
if(nodes.get('lever').action)throw Error('The lever cannot be included in the deck actions.');
for(const action of ['spin','betUp','betDown','auto','pays']){
 for(const role of ['btn-'+action,'btnface-'+action]){
  const node=nodes.get(role);
  if(node?.action!==action||node.g==null)throw Error('Missing physical action mesh: '+role);
 }
}
const pack={name:'Launchpad',description:'From curve to pool · Stacks launchpad mission control',color:'#e6ece7',accent:'#f97316',model:packB64(JSON.stringify(model)),game:packB64(game),css:'.px-launchpad{--machine-accent:#f97316}'};
writeFileSync(path.join(root,'pack.json'),JSON.stringify(pack));
writeFileSync(path.join(root,'game.html'),game);
let index=read('src/host-shell.html');
const embeddedPack={...pack};
for(const [key,value] of Object.entries({CSS:read('src/host.css'),THREE:read('vendor/three-r128.min.js'),SOFTWARE:read('vendor/software-renderer.js'),ACCOUNT:read('src/test-account.js'),PACK:JSON.stringify(embeddedPack).replace(/<\/script/gi,'<\\/script'),MODEL:JSON.stringify(model).replace(/<\/script/gi,'<\\/script'),HOST:read('src/host.js')}))index=index.replace('/*__'+key+'__*/',()=>value);
if(/\/\*__[A-Z_]+__\*\//.test(index))throw Error('Unfilled host template.');
writeFileSync(path.join(root,'index.html'),index);
mkdirSync(path.join(root,'dist'),{recursive:true});writeFileSync(path.join(root,'dist/index.html'),index);
for(const [src,dst] of [['checks/browser-runner.html','dist/checks.html'],['checks/presentation-runner.js','dist/presentation-runner.js']])if(existsSync(path.join(root,src)))copyFileSync(path.join(root,src),path.join(root,dst));
if(existsSync(path.join(root,'checks/browser-runner.html'))){
 const runner=read('checks/browser-runner.html').replace('"__STANDALONE_HTML__"',()=>JSON.stringify(Buffer.from(index).toString('base64'))).replace('<script src="./presentation-runner.js"></script>',()=>'<script>'+read('checks/presentation-runner.js')+'</script>').replace('<script src="./browser-flow-runner.js"></script>',()=>'<script>'+read('checks/browser-flow-runner.js')+'</script>');
 writeFileSync(path.join(root,'browser-checks.html'),runner);writeFileSync(path.join(root,'dist/checks.html'),runner);
}
const report={createdAt:new Date().toISOString(),engine:{chars:span.length,sha256:hash,fileSha256:fileHash},anchorCounts,cabinetRoles:true,packBytes:statSync(path.join(root,'pack.json')).size,indexBytes:statSync(path.join(root,'index.html')).size,gameBytes:Buffer.byteLength(game),modelBytes:Buffer.byteLength(JSON.stringify(model)),packBudgetBytes:2*1024*1024,withinPackBudget:statSync(path.join(root,'pack.json')).size<=2*1024*1024,decodes:{model:JSON.parse(gunzipSync(Buffer.from(pack.model,'base64'))).root!=null,game:gunzipSync(Buffer.from(pack.game,'base64')).toString()===game}};
mkdirSync(path.join(root,'checks/results'),{recursive:true});writeFileSync(path.join(root,'checks/results/build.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
