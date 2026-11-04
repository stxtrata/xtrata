#!/usr/bin/env node
// Runs the ACTUAL packed game/controller and authentic standalone account adapter in Node VM contexts.
// No browser automation, copied state machine, injected game helper or synthetic outcome is used.
// DOM/canvas drawing, audio and wall-clock animation are mocked; layout and GPU checks remain separate.
// Setup: npm install --prefix checks ; node tools/check-controller.mjs
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { gunzipSync } from 'node:zlib';
import { createHash } from 'node:crypto';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const require=createRequire(import.meta.url);
let parseHTML;
try{({parseHTML}=require(process.env.CK_DOM_MODULE||path.join(root,'checks/node_modules/linkedom')));}catch{throw Error('Install the test-only DOM library with: npm install --prefix checks');}
const pack=JSON.parse(fs.readFileSync(path.join(root,'pack.json'),'utf8'));
const game=gunzipSync(Buffer.from(pack.game,'base64')).toString('utf8');
const adapter=fs.readFileSync(path.join(root,'vendor/layr-test-stub.js'),'utf8');
const scripts=[...game.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map(m=>m[1]);
const KEY='xtrata.parallax.test.corgi-kennel.layr.v1.controller-qa';
function clock(){
  let time=1,serial=0;const timers=new Map(),rafs=new Map();
  return {now:()=>time,setTimeout(fn,delay=0){const id=++serial;timers.set(id,{fn,at:time+Number(delay)});return id;},clearTimeout:id=>timers.delete(id),requestAnimationFrame(fn){const id=++serial;rafs.set(id,fn);return id;},cancelAnimationFrame:id=>rafs.delete(id),async step(ms=100){
    const end=time+ms;while(time<end){time=Math.min(end,time+50);for(const[id,t]of[...timers])if(t.at<=time){timers.delete(id);t.fn();}const q=[...rafs.values()];rafs.clear();for(const fn of q)fn(time);await Promise.resolve();}
  }};
}
const clone=x=>JSON.parse(JSON.stringify(x));
function contextBase(document,timer){
  const listeners=new Map();let cryptoState=0x35aafe01;
  const sandbox={console,document,performance:{now:timer.now},Date,Math,JSON,Object,Array,Number,String,Boolean,Map,WeakMap,Set,Uint32Array,Uint8Array,Float32Array,Error,Promise,RegExp,Intl,Blob,URL,
    setTimeout:timer.setTimeout,clearTimeout:timer.clearTimeout,setInterval:()=>1,clearInterval:()=>{},requestAnimationFrame:timer.requestAnimationFrame,cancelAnimationFrame:timer.cancelAnimationFrame,
    crypto:{getRandomValues(a){for(let i=0;i<a.length;i++){cryptoState^=cryptoState<<13;cryptoState^=cryptoState>>>17;cryptoState^=cryptoState<<5;a[i]=cryptoState>>>0;}return a;}},
    matchMedia:()=>({matches:false,addEventListener(){},removeEventListener(){}}),
    navigator:{locks:{request(_key,_options,callback){return Promise.resolve(callback({name:_key}));}}},
    addEventListener(type,fn){if(!listeners.has(type))listeners.set(type,[]);listeners.get(type).push(fn);},removeEventListener(){},
    Image:class{width=512;height=512;set src(v){this._src=v;this.onload?.();}get src(){return this._src;}},Audio:class{play(){return Promise.resolve();}},
    postMessage(){},Event:document.defaultView.Event,KeyboardEvent:document.defaultView.Event,devicePixelRatio:1,innerWidth:1440,innerHeight:900};
  sandbox.window=sandbox;sandbox.self=sandbox;sandbox.globalThis=sandbox;return sandbox;
}
async function makeHost(test=true){
  const {document}=parseHTML('<html><body></body></html>'),timer=clock();const storage=new Map([[KEY,JSON.stringify({bank:10000,layrGames:{}})]]);let writes=0,failNext=false;
  const localStorage={getItem:k=>storage.get(k)??null,setItem(k,v){if(failNext){failNext=false;throw Error('Simulated atomic storage failure');}writes++;storage.set(k,String(v));},removeItem:k=>storage.delete(k)};
  const scope=contextBase(document,timer);scope.parent=scope;scope.localStorage=localStorage;scope.CK_TEST_TAB='controller-qa';scope.PX_STANDALONE_TEST=test;
  const context=vm.createContext(scope);vm.runInContext(adapter,context,{filename:'authentic-layr-test-stub.js'});const account=scope.ParallaxLAYRAccount;await account.acquire();
  const calls=[];
  // Model the real room's hook: it wraps raw BF methods after PX_PURE is captured, before LAYR.machine.
  const observed={...account,machine(id,bf){for(const name of['start','settle','pick','respin','collect','endFree','gamble']){const fn=bf[name];bf[name]=(...args)=>{calls.push(name);return fn(...args);};}return account.machine(id,bf);}};
  scope.ParallaxLAYRAccount=observed;
  return {scope,account,storage,localStorage,calls,raw:()=>storage.get(KEY),writes:()=>writes,failNext:()=>{failNext=true;}};
}
async function makeGame(host){
  const {document,window}=parseHTML(game),timer=clock();
  const fakeCanvas=new WeakMap();
  window.HTMLCanvasElement.prototype.getContext=function(){if(!fakeCanvas.has(this))fakeCanvas.set(this,new Proxy({canvas:this,measureText:s=>({width:String(s).length*10}),createLinearGradient:()=>({addColorStop(){}}),createRadialGradient:()=>({addColorStop(){}})}, {get(o,k){return k in o?o[k]:(()=>{});},set(o,k,v){o[k]=v;return true;}}));return fakeCanvas.get(this);};
  window.HTMLElement.prototype.getBoundingClientRect=function(){return{x:0,y:0,left:0,top:0,right:1400,bottom:960,width:1400,height:960};};
  const dialog=document.getElementById('modal');Object.defineProperty(dialog,'open',{get(){return this.hasAttribute('open');}});dialog.showModal=function(){this.setAttribute('open','');};dialog.close=function(){this.removeAttribute('open');};
  const scope=contextBase(document,timer);scope.HTMLDialogElement={prototype:{showModal(){}}};scope.parent=host.scope;scope.localStorage=host.localStorage;
  const context=vm.createContext(scope);scripts.forEach((s,i)=>vm.runInContext(s,context,{filename:'packed-game-script-'+i+'.js'}));
  const api=scope.PX_CASINO_ENGINE;await api.activate();await timer.step(100);
  return {host,scope,context,document,timer,api,inspect:()=>api.inspect?.(),click:id=>{const el=document.getElementById(id);assert.ok(el,'Expected control '+id);el.onclick?.({target:el});}};
}
function setValue(el,value){assert.ok(el);if(el.tagName==='SELECT'){for(const op of el.querySelectorAll('option'))op.selected=op.value===String(value);}else el.value=String(value);}
function choosePreview(h,event,seed='controller-21',bet=100){
  h.api.action('lab');const button=h.document.querySelector(`[data-preview="${event}"]`);assert.ok(button,'Preview item '+event);button.onclick();
  setValue(h.document.getElementById('labBet'),bet);setValue(h.document.getElementById('labMode'),'seeded');setValue(h.document.getElementById('labSeed'),seed);h.click('labRun');
}
async function finishPreview(h,skip=false){
  for(let i=0;i<1400;i++){
    const p=h.inspect();if(!p?.preview){assert.ok(p?.lastPreview,'Preview must record completion');return clone(p.lastPreview);}
    const scene=p.scene;
    if(h.api.ui().modalOpen&&p.preview.event==='fund-info')h.click('fundPreviewDone');
    else if(scene){
      if(scene.stage==='summary')h.api.action('sceneContinue');
      else if(skip)h.api.action('sceneSkip');
      else if(scene.stage==='intro')h.api.action('sceneStart');
      else if(scene.stage==='play'&&scene.type==='hold'){const f=p.state.features[0];h.api.action(f.index===f.frames.length-1?'sceneCollect':'sceneRespin');}
      else if(scene.stage==='play'&&scene.type==='pick'){const f=p.state.features[0];if(f.picks.length===3)h.api.action('sceneCollect');else{let j=0;while(f.picks.includes(j))j++;h.api.action('pick:'+j);}}
    }
    await h.timer.step(100);
  }
  throw Error('Controller did not finish preview: '+JSON.stringify(h.inspect()?.scene));
}
const tests=[];
async function test(name,fn){try{const evidence=await fn();tests.push({name,pass:true,evidence});console.log('PASS '+name);}catch(error){tests.push({name,pass:false,error:error.stack||String(error)});console.log('FAIL '+name+': '+error.message);}}
const events=['free','retrigger','pick','hold','full-hold','jackpot','gamble-win','gamble-loss','scatter-3','scatter-4','scatter-5','fund-info'];
await test('All twelve actual controller previews preserve account bytes and bypass room observers',async()=>{
  const host=await makeHost(),h=await makeGame(host),rows=[];
  for(const event of events){const before=host.raw(),writes=host.writes(),calls=host.calls.length;choosePreview(h,event);const r=await finishPreview(h);assert.equal(host.raw(),before);assert.equal(host.writes(),writes);assert.equal(host.calls.length,calls);assert.ok(r.history.every(x=>x.kind.startsWith('LAB')));rows.push({event,payout:r.payout,net:r.net,spins:r.spins,accountWrites:host.writes()-writes,roomObserverCalls:host.calls.length-calls});}
  return rows;
});
await test('Skip and played presentation pay identical amounts through the actual controller',async()=>{
  const host=await makeHost(),h=await makeGame(host),rows=[];
  for(const event of events.filter(x=>x!=='fund-info')){choosePreview(h,event,'skip-'+event);const played=await finishPreview(h);choosePreview(h,event,'skip-'+event);const skipped=await finishPreview(h,true);assert.equal(skipped.payout,played.payout);assert.equal(skipped.net,played.net);assert.equal(skipped.spins,played.spins);rows.push({event,played:played.payout,skipped:skipped.payout,net:played.net,spins:played.spins});}
  return rows;
});
await test('Actual account reload preserves pending id, one debit, one fund contribution and one settlement',async()=>{
  const host=await makeHost(),h=await makeGame(host);h.api.action('spin');const pending=h.inspect().state.pending;assert.ok(pending);assert.equal(host.account.balance(),9900);assert.equal(h.inspect().state.machineFund.balance,1);const id=pending.id;
  const reloaded=await makeGame(host),first=reloaded.inspect();assert.equal(first.state.pending,null);assert.equal(first.state.history[0].id,id);assert.deepEqual(first.state.grid,pending.grid);assert.equal(first.state.spins,1);assert.equal(first.state.machineFund.balance,1);const settled=host.account.balance();
  await reloaded.api.activate();assert.equal(host.account.balance(),settled);assert.equal(reloaded.inspect().state.spins,1);assert.equal(reloaded.inspect().state.history.filter(x=>x.id===id).length,1);
  return{roundId:id,balanceAfterDebit:9900,balanceAfterReload:settled,fund:1,settledSpins:1};
});
await test('Rejected storage commit rolls back stake and fund',async()=>{
  const host=await makeHost(),h=await makeGame(host),before=host.raw();host.failNext();h.api.action('spin');assert.equal(host.raw(),before);assert.equal(host.account.balance(),10000);assert.equal(h.inspect().state.machineFund.balance,0);assert.equal(h.inspect().state.pending,null);return{balance:10000,fund:0,pending:null};
});
await test('Leaving a running preview immediately restores the real account',async()=>{
  const host=await makeHost(),h=await makeGame(host),before=host.raw();choosePreview(h,'full-hold');assert.ok(h.inspect().preview);h.api.action('leavePreview');await h.timer.step(3000);assert.equal(h.inspect().preview,null);assert.equal(host.raw(),before);return{accountBytesUnchanged:true};
});
await test('Opening and closing a panel during free play resumes laps',async()=>{
  const host=await makeHost(),h=await makeGame(host);choosePreview(h,'free');for(let i=0;i<100;i++){if(h.inspect().scene?.stage==='intro'){h.api.action('sceneStart');break;}await h.timer.step(100);}assert.equal(h.inspect().scene?.stage,'play');const before=h.inspect().state.freeCount;h.api.action('fund');h.api.closeModal();await h.timer.step(3000);const after=h.inspect().state.freeCount;assert.ok(after>before,'Free spins stalled after closing Fund');h.api.action('leavePreview');return{lapsBefore:before,lapsAfter:after};
});
await test('Entering fullscreen during free play resumes laps',async()=>{
  const host=await makeHost(),h=await makeGame(host);choosePreview(h,'free');for(let i=0;i<100;i++){if(h.inspect().scene?.stage==='intro'){h.api.action('sceneStart');break;}await h.timer.step(100);}const before=h.inspect().state.freeCount;h.api.action('fullscreen');await h.timer.step(3000);assert.ok(h.inspect().state.freeCount>before,'Free spins stalled after fullscreen entry');h.api.action('leavePreview');return{resumed:true};
});
await test('Run All completes all twelve events without account or observer changes',async()=>{
  const host=await makeHost(),h=await makeGame(host),before=host.raw(),writes=host.writes(),calls=host.calls.length;h.api.action('lab');setValue(h.document.getElementById('labBet'),100);setValue(h.document.getElementById('labMode'),'seeded');h.click('labAll');for(let i=0;i<5000&&!h.inspect().lastSuite;i++)await h.timer.step(100);assert.equal(h.inspect().lastSuite?.length,12);assert.equal(host.raw(),before);assert.equal(host.writes(),writes);assert.equal(host.calls.length,calls);return{events:h.inspect().lastSuite.map(x=>x.event),accountWrites:0,roomObserverCalls:0};
});
await test('Disconnect during the Run All gap cannot restart preview',async()=>{
  const host=await makeHost(),h=await makeGame(host);h.api.action('lab');setValue(h.document.getElementById('labBet'),100);setValue(h.document.getElementById('labMode'),'seeded');h.click('labAll');let gap=false;for(let i=0;i<3000;i++){await h.timer.step(50);const s=h.inspect();if(!s.preview&&s.lastPreview&&!s.lastSuite){gap=true;break;}}assert.ok(gap,'Reached inter-item transition');h.api.deactivate();await h.timer.step(2000);assert.equal(h.inspect().preview,null,'Practice restarted after disconnect');return{previewAfterDisconnect:null};
});
await test('Reconnect during the Run All gap cancels the old suite',async()=>{
  const host=await makeHost(),h=await makeGame(host);h.api.action('lab');setValue(h.document.getElementById('labBet'),100);setValue(h.document.getElementById('labMode'),'seeded');h.click('labAll');let gap=false;for(let i=0;i<3000;i++){await h.timer.step(50);const s=h.inspect();if(!s.preview&&s.lastPreview&&!s.lastSuite){gap=true;break;}}assert.ok(gap,'Reached inter-item transition');h.api.deactivate();await h.api.activate();await h.timer.step(2000);assert.equal(h.inspect().preview,null,'Old Run All suite resumed after reconnect');return{previewAfterReconnect:null};
});
await test('Disconnect cancels an activation awaiting account acquisition',async()=>{
  const host=await makeHost(),h=await makeGame(host);let resolveAcquire;const gate=new Promise(r=>{resolveAcquire=r;});host.scope.ParallaxLAYRAccount.acquire=()=>gate;const pending=h.api.activate().catch(()=>false);h.api.deactivate();resolveAcquire(true);await pending;h.api.action('spin');assert.equal(h.inspect().state.pending,null,'Late activation re-enabled a disconnected machine');assert.equal(host.account.balance(),10000);return{noLateSpin:true,balance:10000};
});
await test('Cancelled gamble transition cannot overwrite the next preview outcome',async()=>{
  const host=await makeHost(),h=await makeGame(host);h.api.action('settings');const setting=h.document.getElementById('settingReduced');setting.checked=true;setting.onchange({target:setting});h.api.closeModal();
  choosePreview(h,'gamble-win','cancelled-gamble');for(let i=0;i<100&&h.inspect().scene?.stage!=='intro';i++)await h.timer.step(33);assert.equal(h.inspect().scene?.type,'gamble');assert.equal(h.inspect().scene?.stage,'intro');h.api.action('leavePreview');
  choosePreview(h,'gamble-loss','next-gamble');for(let i=0;i<100&&h.inspect().scene?.stage!=='intro';i++)await h.timer.step(33);assert.equal(h.inspect().scene?.stage,'intro');await h.timer.step(33);const result=await finishPreview(h);assert.equal(result.summary.win,false,'An old delayed reveal replaced the new losing result');return{secondPreview:'gamble-loss',summaryWin:result.summary.win,net:result.net};
});
await test('Production exposes safe preview but no developer inspection or forcing object',async()=>{
  const host=await makeHost(false),h=await makeGame(host);assert.equal(h.api.inspect,undefined);assert.equal(h.scope.PX_LAB_RNG,undefined);assert.equal(h.scope.PX_PURE,undefined);h.api.action('test');assert.equal(h.api.ui().modalOpen,false);h.api.action('lab');assert.ok(h.document.getElementById('labRun'));return{developerInspect:false,windowForcing:false,productionPreview:true};
});
const result={status:tests.every(x=>x.pass)?'PASS':'FAIL',checkedAt:new Date().toISOString(),packedGameSha256:createHash('sha256').update(game).digest('hex'),scope:'Actual packed controller and authentic standalone LAYR adapter in Node VM + LinkeDOM. Drawing/audio/layout are mocked; visual and browser compatibility checks are separate.',tests};
fs.mkdirSync(path.join(root,'checks/results'),{recursive:true});fs.writeFileSync(path.join(root,'checks/results/controller.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({status:result.status,passed:tests.filter(x=>x.pass).length,total:tests.length},null,2));if(result.status==='FAIL')process.exitCode=1;
