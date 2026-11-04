// Pool Party build chain, adapted from the supplied DOG Army build. Engine bytes remain unchanged.
import {readFile,writeFile,mkdir,stat} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {gzipSync,gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {dirname,join,extname} from 'node:path';
import {fileURLToPath} from 'node:url';
const ROOT=join(dirname(fileURLToPath(import.meta.url)),'..'),r=p=>readFile(join(ROOT,p),'utf8'),sha=s=>createHash('sha256').update(s).digest('hex');
const engine=await r('src/engine.js'),hash=(await r('src/engine.sha256')).trim();
if(sha(engine)!==hash)throw Error('Canonical engine modified');
const begin=engine.indexOf('const BF = (() => {'),end=engine.indexOf('\n})();',begin)+6,block=engine.slice(begin,end);
if(block.length!==11429||sha(block)!=='203f8735007d8df9c2058be24c8e65fe269abac341438c0217128baef69f9bed')throw Error('Embedded engine block mismatch');
const pure=block.replace('const BF =','const PX_PURE ='); // Independent pristine preview copy; never passes through the account or room log.
const MIME={'.svg':'image/svg+xml','.png':'image/png','.mp3':'audio/mpeg'},files={};
for(const f of ['art/usda.svg','art/diko.svg','art/cha.png','art/velar.svg','art/alex.png','art/stx.svg','art/xtrata.svg','art/brand/parallax-casino-wordmark.svg'])files[f]=`data:${MIME[extname(f)]};base64,${(await readFile(join(ROOT,f))).toString('base64')}`;
const art={data:JSON.parse(await r('data/pool-party-snapshots.json')),files};
const css=await r('src/game.css'),body=await r('src/game-body.html'),game=(await Promise.all(['a','b','c','scenes','d','e'].map(x=>r('src/game.'+x+'.js')))).join('\n');
new Function(game);
const script=s=>'<script>'+s.replaceAll('</script','<\\/script')+'</script>';
const html='<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#06b6d4"><title>Pool Party — ParallaX Casino</title><style>'+css+'</style></head><body>'+body+'\n'+script(await r('src/layr.js'))+'\n'+script(await r('src/compat.js'))+'\n'+script(engine)+'\n'+script(pure)+'\n'+script(await r('src/xlogo.js'))+'\n'+script('window.POOLPARTY_ART='+JSON.stringify(art)+';')+'\n'+script(game)+'</body></html>';
const hooks={layr:html.split('<script>/* One existing LAYR account').length-1,engineLine:(html.match(/GAME_ID='pool-party', *LAYR=window\.ParallaxLAYRAccount, *E=LAYR\.machine\(GAME_ID,BF\)/g)||[]).length,screenLine:html.split("const screen=canvas(2800,1920),sg=screen.getContext('2d');sg.setTransform(2,0,0,2,0,0);").length-1,destination:html.split('connect(ac.destination)').length-1,api:html.split('window.PX_CASINO_ENGINE={').length-1};
for(const[k,n]of Object.entries(hooks))if(n!==1)throw Error('Room hook '+k+' count '+n);
await mkdir(join(ROOT,'dist'),{recursive:true});await writeFile(join(ROOT,'dist/game.html'),html);
if(process.env.GAME_ONLY==='1'){console.log('Game built',Buffer.byteLength(html),'bytes',hooks);process.exit(0);}
const model=await r('build/model.json'),m=JSON.parse(model);for(const k of ['root','geometries','materials','textures'])if(!m[k])throw Error('Invalid packed model');
const roles=new Set(),actions=new Set();(function visit(n){if(n.role)roles.add(n.role);if(n.action)actions.add(n.action);(n.children||[]).forEach(visit)})(m.root);
for(const k of ['screenMesh','crest','spinPhysical','lever'])if(!roles.has(k))throw Error('Cabinet missing '+k);
for(const k of ['spin','betUp','betDown','auto','pays'])if(!actions.has(k))throw Error('Cabinet action missing '+k);
const gz=s=>gzipSync(Buffer.from(s),{level:9}).toString('base64');
const pack={name:'Pool Party',description:'A Stacks DeFi rooftop pool · Happy Hour, Yield Farm and Deep Liquidity',color:'#effaf5',accent:'#06b6d4',model:gz(model),game:gz(html),css};
if(gunzipSync(Buffer.from(pack.game,'base64')).toString()!==html)throw Error('Pack round-trip failed');
const packJS='/* Pool Party standalone pack */\nwindow.POOLPARTY_PACK='+JSON.stringify(pack)+';\n';
await writeFile(join(ROOT,'pack.json'),JSON.stringify(pack));await writeFile(join(ROOT,'pack.js'),packJS);
if(existsSync(join(ROOT,'src/host.html'))){let host=await r('src/host.html');host=host.replace('<script src="vendor/three.r128.min.js"></script>',script(await r('vendor/three.r128.min.js'))).replace('<script src="src/software.js"></script>',script(await r('src/software.js'))).replace('<script src="pack.js"></script>',script(packJS));await writeFile(join(ROOT,'index.html'),host);}
const sizes={game:Buffer.byteLength(html),model:Buffer.byteLength(model),pack:Buffer.byteLength(JSON.stringify(pack)),standalone:(await stat(join(ROOT,'index.html'))).size};
await writeFile(join(ROOT,'checks/results/build.json'),JSON.stringify({engineFileSha256:hash,engineBlockSha256:sha(block),engineBlockCharacters:block.length,hooks,roles:[...roles],actions:[...actions],sizes,budgetBytes:2097152,withinBudget:sizes.pack<=2097152},null,2));
console.log(JSON.stringify({sizes,hooks,engine:sha(block)},null,2));
