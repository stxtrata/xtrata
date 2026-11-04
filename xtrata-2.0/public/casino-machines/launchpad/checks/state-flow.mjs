#!/usr/bin/env node
// Non-browser integration checks around the actual game/account scripts.
// DOM drawing is a no-op; this proves state behavior only, not rendered UI.
import vm from 'node:vm';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const sources=Object.fromEntries(['engine.js','lab-scenarios.js','test-account.js','game.js'].map(n=>[n,readFileSync(resolve(root,'src',n),'utf8')]));
function harness(storage=new Map(),options={}){
 let time=0,tid=0,raf=[],timer=new Map(),randomIndex=0,writeFail=false;const errors=[],els=new Map(),events=new Map(),roundLog=[];
 const classes=()=>({add(){},remove(){},toggle(){},contains(){return false;}});
 const gradient={addColorStop(){}};
 const draw=new Proxy({}, {get:(_,k)=>k==='createLinearGradient'||k==='createRadialGradient'?()=>gradient:()=>{}});
 class El{
  constructor(id=''){this.id=id;this.dataset={};this.classList=classes();this.hidden=false;this.value='';this.checked=false;this.textContent='';this.style={setProperty(){}};this.isConnected=true;this._html='';}
  set innerHTML(s){this._html=s;if(this.id==='panelBody'){
   for(const id of ['labBet','labSeed','labRandom','rtpResult','rtpCount'])els.delete(id);
   for(const m of s.matchAll(/<input\b[^>]*\bid="([^"]+)"[^>]*>/g)){const e=new El(m[1]);e.value=/\bvalue="([^"]*)"/.exec(m[0])?.[1]||'';e.checked=/\bchecked\b/.test(m[0]);els.set(e.id,e);}
   for(const m of s.matchAll(/<select\b[^>]*\bid="([^"]+)"[^>]*>([\s\S]*?)<\/select>/g)){const e=new El(m[1]),opts=[...m[2].matchAll(/<option\b[^>]*value="([^"]+)"([^>]*)>/g)];e.value=(opts.find(x=>/selected/.test(x[2]))||opts[0])?.[1]||'';els.set(e.id,e);}
  }}
  get innerHTML(){return this._html;} appendChild(e){return e;}setAttribute(){}removeAttribute(){}focus(){document.activeElement=this;}addEventListener(){}getContext(){return draw;}
  getBoundingClientRect(){return {height:100,width:1400,left:0,top:0};}querySelectorAll(){return [];}cloneNode(){const e=new El(this.id);e._html=this._html;return e;}matches(){return false;}
 }
 const optional=new Set(['labBet','labSeed','labRandom','rtpResult','rtpCount']);
 const document={hidden:false,activeElement:null,fullscreenElement:null,body:new El('body'),documentElement:new El('html'),getElementById(id){if(optional.has(id))return els.get(id)||null;if(!els.has(id))els.set(id,new El(id));return els.get(id);},createElement(){return new El();},querySelectorAll(){return [];},querySelector(){return null;},addEventListener(n,f){const a=events.get(n)||[];a.push(f);events.set(n,a);},dispatchEvent(e){for(const f of events.get(e.type)||[])f(e);}};
 const ctx={console,document,performance:{now:()=>time},Math,Date,Uint32Array,Map,Set,WeakMap,JSON,Object,Array,Number,String,Boolean,Error,Promise,RegExp,URL,URLSearchParams,Blob,location:{search:'?qa=state-flow'},
 localStorage:{getItem:k=>storage.get(k)||null,setItem(k,v){if(writeFail)throw Error('quota');storage.set(k,v);}},
 crypto:{getRandomValues(a){const stops=options.stops||[15,8,23,30,4];for(let i=0;i<a.length;i++){const index=options.repeatBase?randomIndex++%21:randomIndex++;a[i]=stops[index]??42;}return a;}},
 matchMedia:()=>({matches:false}),ResizeObserver:class{observe(){}},Image:class{constructor(){this.complete=false;this.naturalWidth=0;}},
 requestAnimationFrame:f=>{raf.push(f);return raf.length;},setTimeout(f,delay=0){timer.set(++tid,{f,at:time+delay});return tid;},clearTimeout:id=>timer.delete(id),
 Event:class{constructor(type,opts={}){this.type=type;Object.assign(this,opts);}},KeyboardEvent:class{constructor(type,opts={}){this.type=type;Object.assign(this,opts);}}
 };
 ctx.window=ctx;ctx.parent=ctx;ctx.PX_STANDALONE_TEST=true;ctx.addEventListener=document.addEventListener.bind(document);vm.createContext(ctx);
 vm.runInContext(sources['engine.js'],ctx);vm.runInContext(sources['lab-scenarios.js'],ctx);vm.runInContext(sources['test-account.js'],ctx);
 if(options.unavailable)ctx.ParallaxLAYRAccount=Object.freeze({...ctx.ParallaxLAYRAccount,acquire:async()=>false,ready:()=>false,error:()=> 'Test lease held elsewhere'});
 ctx.__roundLog=roundLog;
 const game=options.hook?sources['game.js'].replace('E=LAYR.machine(GAME_ID,BF)','E=LAYR.machine(GAME_ID,(()=>{const original=BF.start;BF.start=function(...args){__roundLog.push("start");return original(...args)};return BF})())'):sources['game.js'];
 vm.runInContext(game,ctx);
 const api=ctx.PX_CASINO_ENGINE,account=ctx.ParallaxLAYRAccount;
 function advance(ms){const end=time+ms;while(time<end){time=Math.min(end,time+100);for(const [id,t]of [...timer])if(t.at<=time){timer.delete(id);try{t.f();}catch(e){errors.push(e.message);}}const work=raf;raf=[];for(const f of work)try{f(time);}catch(e){errors.push(e.message);}}}
 function click(selector,data={}){const el=new El();el.dataset=data;el.closest=s=>s===selector?el:null;for(const f of events.get('click')||[])try{f({target:el});}catch(e){errors.push(e.message);}}
 function launchLab(id,seed='launchpad22',bet=100){api.action('lab');document.getElementById('labBet').value=String(bet);document.getElementById('labSeed').value=seed;click('[data-scenario]',{scenario:id});click('[data-lab-run]');advance(2500);}
 function complete(){for(let i=0;i<180;i++){const u=api.ui();if(u.spinning){advance(2000);continue;}if(!u.sceneDetail)break;if(u.sceneDetail.stage==='summary'){api.action('feature');advance(100);continue;}if(u.sceneDetail.kind==='gamble'){api.action('ape');advance(2000);continue;}if(u.sceneDetail.stage==='trigger'||u.sceneDetail.stage==='intro'){api.action('feature');advance(100);continue;}api.action('feature');advance(1100);}}
 return {api,account,advance,click,launchLab,complete,errors,storage,document,roundLog,ctx,setWriteFail(v){writeFail=v;}};
}
const checks=[];
function check(name,fn){try{const detail=fn();checks.push({name,pass:!!detail.pass,...detail});}catch(e){checks.push({name,pass:false,error:e.stack});}}
const h=harness();await h.api.activate();
check('commit before animation',()=>{h.api.action('spin');const r=h.account.snapshot(),p=r.games.launchpad.pending;return {pass:!!p&&r.bank===9900&&!!p.jackpot,pendingId:p?.id,bank:r.bank,jackpot:p?.jackpot};});
const resumed=harness(h.storage);await resumed.api.activate();resumed.advance(2000);
check('reload settles exactly once',()=>{const r=resumed.account.snapshot();return {pass:r.bank===10000&&r.games.launchpad.spins===1&&!r.games.launchpad.pending,bank:r.bank,spins:r.games.launchpad.spins};});
const again=harness(h.storage);await again.api.activate();again.advance(2000);
check('second reload cannot pay again',()=>{const r=again.account.snapshot();return {pass:r.bank===10000&&r.games.launchpad.spins===1,bank:r.bank,spins:r.games.launchpad.spins};});
const p=harness();await p.api.activate();const before=JSON.stringify(p.account.snapshot());p.launchLab('pick');p.complete();p.api.action('exitPreview');
check('practice pick leaves whole account unchanged',()=>({pass:JSON.stringify(p.account.snapshot())===before&&p.errors.length===0,errors:p.errors}));
const repl=harness();await repl.api.activate();repl.launchLab('pick','alpha');repl.complete();repl.api.action('lab');repl.document.getElementById('labSeed').value='different-input';repl.document.getElementById('labBet').value='500';repl.click('[data-lab-replay]');repl.advance(2500);repl.api.action('lab');
check('Replay ignores newly edited options',()=>({pass:repl.document.getElementById('labSeed').value==='alpha'&&repl.document.getElementById('labBet').value==='100',actualSeed:repl.document.getElementById('labSeed').value,actualBet:repl.document.getElementById('labBet').value,errors:repl.errors}));
const f=harness(new Map(),{stops:[10,10,10,12,12]});await f.api.activate();f.api.action('spin');f.advance(2500);f.api.action('feature');f.api.deactivate();await f.api.activate();f.advance(4000);
check('reconnect resumes a live free-spin scene',()=>({pass:f.account.snapshot().games.launchpad.spins>1&&f.errors.length===0,spins:f.account.snapshot().games.launchpad.spins,errors:f.errors}));
const race=harness();await race.api.activate();race.api.action('lab');race.click('[data-lab-all]');race.advance(2500);race.api.action('skip');race.api.action('feature');race.api.action('exitPreview');race.advance(1000);
check('exit cancels queued Run all continuation',()=>({pass:race.errors.length===0&&!race.api.ui().practice,errors:race.errors,practice:race.api.ui().practice}));
const fail=harness();await fail.api.activate();fail.api.action('spin');fail.advance(2000);fail.setWriteFail(true);fail.api.action('spin');
check('storage failure preserves newest memory state',()=>({pass:fail.account.snapshot().bank===9900&&!!fail.account.snapshot().games.launchpad.pending,bank:fail.account.snapshot().bank,pending:!!fail.account.snapshot().games.launchpad.pending,errors:fail.errors}));
const auto=harness(new Map(),{repeatBase:true});await auto.api.activate();auto.api.action('turbo');auto.api.action('auto');auto.advance(30000);
check('Auto makes exactly25 bonus-free spins',()=>({pass:auto.account.snapshot().games.launchpad.spins===25&&!auto.api.ui().auto&&auto.errors.length===0,spins:auto.account.snapshot().games.launchpad.spins,errors:auto.errors}));
for(const item of ['free','free-retrigger','pick','chain','chain-full','jackpot']){
 const play=harness(),skip=harness();await play.api.activate();await skip.api.activate();play.launchLab(item);skip.launchLab(item);play.complete();
 for(let i=0;i<100;i++){const u=skip.api.ui();if(u.spinning){skip.advance(2000);continue;}if(!u.sceneDetail)break;if(u.sceneDetail.stage==='summary')skip.api.action('feature');else skip.api.action('skip');skip.advance(100);}
 check('Skip equals full play: '+item,()=>({pass:play.api.ui().balance===skip.api.ui().balance&&!play.api.ui().sceneDetail&&!skip.api.ui().sceneDetail&&play.errors.length===0&&skip.errors.length===0,playedBalance:play.api.ui().balance,skippedBalance:skip.api.ui().balance,errors:[...play.errors,...skip.errors]}));
}
const suite=harness();await suite.api.activate();const suiteBefore=JSON.stringify(suite.account.snapshot());suite.api.action('lab');suite.click('[data-lab-all]');suite.advance(2500);
for(let i=0;i<300&&suite.api.ui().runAllCount<12;i++){const u=suite.api.ui();if(u.spinning){suite.advance(2000);continue;}if(!u.sceneDetail){suite.advance(2000);continue;}if(u.sceneDetail.stage==='summary')suite.api.action('feature');else if(u.sceneDetail.kind==='gamble'){suite.api.action('ape');suite.advance(2000);}else suite.api.action('skip');suite.advance(500);}
check('Run all completes12 items without changing account',()=>({pass:suite.api.ui().runAllCount===12&&JSON.stringify(suite.account.snapshot())===suiteBefore&&suite.errors.length===0,count:suite.api.ui().runAllCount,errors:suite.errors}));
const hooked=harness(new Map(),{hook:true});await hooked.api.activate();hooked.api.action('spin');hooked.advance(2500);const logBefore=hooked.roundLog.length,hookBefore=JSON.stringify(hooked.account.snapshot());hooked.launchLab('chain-full');hooked.complete();hooked.api.action('exitPreview');
check('pristine preview bypasses simulated room round-log hook',()=>({pass:logBefore===1&&hooked.roundLog.length===1&&JSON.stringify(hooked.account.snapshot())===hookBefore&&hooked.errors.length===0,realStarts:logBefore,totalLoggedStarts:hooked.roundLog.length,errors:hooked.errors}));
check('no forcing API is exposed on window',()=>({pass:!('LaunchpadLab'in hooked.ctx)&&!('PX_PURE'in hooked.ctx),LaunchpadLabOnWindow:'LaunchpadLab'in hooked.ctx,PXPureOnWindow:'PX_PURE'in hooked.ctx}));
const locked=harness(new Map(),{unavailable:true});let refused=false,refusal='';try{await locked.api.activate();}catch(e){refused=true;refusal=e.message;}locked.api.action('spin');locked.advance(2000);
check('failed LAYR acquisition refuses activation and spending',()=>({pass:refused&&locked.account.balance()===10000&&!locked.api.ui().spinning,refused,message:refusal,balance:locked.account.balance()}));
const result={scope:'Actual game/account state logic with no-op DOM/canvas; not a browser rendering or device test.',pass:checks.every(c=>c.pass),checks};
mkdirSync(resolve(root,'checks/results'),{recursive:true});writeFileSync(resolve(root,'checks/results/state-flow.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));if(!result.pass)process.exitCode=1;
