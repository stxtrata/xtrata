#!/usr/bin/env node
// Runs the actual standalone account stub in separate document realms, sharing IndexedDB and storage.
// fake-indexeddb supplies transaction serialization; this harness does not reimplement lease decisions.
// Setup: npm install --prefix checks ; node tools/check-lease.mjs
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { createHash, webcrypto } from 'node:crypto';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const require=createRequire(import.meta.url);
let IDBFactory;
try{({IDBFactory}=require(process.env.CK_IDB_MODULE||path.join(root,'checks/node_modules/fake-indexeddb')));}catch{throw Error('Install test-only IndexedDB support with: npm install --prefix checks');}
const adapterPath=process.env.CK_LEASE_ADAPTER||path.join(root,'vendor/layr-test-stub.js');
const adapter=fs.readFileSync(adapterPath,'utf8'),engine=fs.readFileSync(path.join(root,'src/engine.js'),'utf8');
const KEY='xtrata.parallax.test.corgi-kennel.layr.v1.lease-qa';
const LEASE_KEY='xtrata.parallax.test.corgi-kennel.lease.v1.lease-qa',RELEASE_PREFIX=LEASE_KEY+'.released.';
const DATABASE='xtrata-parallax-test-corgi-kennel-lock';
const plain=value=>JSON.parse(JSON.stringify(value));
const turn=()=>new Promise(resolve=>setImmediate(resolve));
async function flush(){for(let i=0;i<8;i++)await turn();}
async function waitFor(fn){for(let i=0;i<300;i++){if(fn())return;await turn();}throw Error('Test event did not occur.');}

function world(){
  const factory=new IDBFactory(),storage=new Map();let now=1700000000000;
  async function record(){
    const db=await new Promise((resolve,reject)=>{const r=factory.open(DATABASE,1);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});
    try{return await new Promise((resolve,reject)=>{const tx=db.transaction('leases','readonly'),r=tx.objectStore('leases').get(KEY);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});}finally{db.close();}
  }
  function documentRealm(name){
    const events=new Map(),documentEvents=new Map(),intervals=new Map();let serial=0;
    const d={name,dead:false,holdCompletions:false,held:[],failMarkers:false,cancelledTransactions:0};
    const bind=(map,type,fn)=>{if(!map.has(type))map.set(type,[]);map.get(type).push(fn);};
    function databaseView(db){
      return {createObjectStore:(...args)=>db.createObjectStore(...args),transaction(...args){
        // A new async transaction cannot be relied on once the browser destroys its document.
        if(d.dead){d.cancelledTransactions++;throw Error('Simulated document teardown cancelled IndexedDB cleanup.');}
        const tx=db.transaction(...args);let view;
        view=new Proxy(tx,{get(target,key){const value=Reflect.get(target,key,target);return typeof value==='function'?value.bind(target):value;},set(target,key,value){
          if(key==='oncomplete'){target.oncomplete=event=>{const deliver=()=>value.call(view,event);if(d.holdCompletions)d.held.push(deliver);else deliver();};return true;}
          Reflect.set(target,key,value,target);return true;
        }});
        return view;
      }};
    }
    const indexedDB={open(...args){
      const native=factory.open(...args),request={result:null,error:null,onupgradeneeded:null,onsuccess:null,onerror:null};
      native.onupgradeneeded=event=>{request.result=databaseView(native.result);request.onupgradeneeded?.(event);};
      native.onsuccess=event=>{request.result=databaseView(native.result);request.onsuccess?.(event);};
      native.onerror=event=>{request.error=native.error;request.onerror?.(event);};
      return request;
    }};
    const localStorage={getItem:key=>storage.get(key)??null,setItem(key,value){if(d.failMarkers&&key.startsWith(RELEASE_PREFIX))throw Error('Simulated unavailable release storage.');storage.set(key,String(value));},removeItem:key=>storage.delete(key)};
    class Clock extends Date{static now(){return now;}}
    const scope={console,Date:Clock,crypto:webcrypto,indexedDB,localStorage,navigator:{},CK_TEST_TAB:'lease-qa',
      document:{hidden:false,addEventListener:(type,fn)=>bind(documentEvents,type,fn)},
      addEventListener:(type,fn)=>bind(events,type,fn),
      setInterval(fn){const id=++serial;intervals.set(id,fn);return id;},clearInterval:id=>intervals.delete(id)};
    scope.window=scope;scope.parent=scope;scope.globalThis=scope;
    const context=vm.createContext(scope);
    vm.runInContext(adapter,context,{filename:path.basename(adapterPath)});
    vm.runInContext(engine+'\nglobalThis.__engine=BF;',context,{filename:'exact-engine.js'});
    d.account=scope.ParallaxLAYRAccount;d.engine=()=>d.account.machine('corgi-kennel',scope.__engine);
    d.open=()=>{const E=d.engine();return {E,state:d.account.openGame('corgi-kennel',E)};};
    d.hide=({destroy=true}={})=>{for(const fn of events.get('pagehide')||[])fn({persisted:!destroy});d.dead=destroy;};
    d.releaseCompletions=()=>{d.holdCompletions=false;for(const fn of d.held.splice(0))fn();};
    d.renew=()=>{for(const fn of [...intervals.values()])fn();};
    d.intervalCount=()=>intervals.size;
    return d;
  }
  return {storage,record,document:documentRealm,advance:ms=>{now+=ms;},mirror:()=>JSON.parse(storage.get(LEASE_KEY)||'null')};
}

const tests=[];
async function test(name,fn){try{const evidence=await fn();tests.push({name,pass:true,evidence});console.log('PASS '+name);}catch(error){tests.push({name,pass:false,error:error.stack||String(error)});console.log('FAIL '+name+': '+error.message);}}

await test('A genuinely live foreign lease remains exclusive',async()=>{
  const w=world(),owner=w.document('owner'),other=w.document('other');assert.equal(await owner.account.acquire(),true);owner.account.saveRoom({bank:10000});
  const before=w.storage.get(KEY);assert.equal(await other.account.acquire(),false);assert.equal(other.account.ready(),false);assert.equal(other.account.saveRoom({bank:1}),false);assert.equal(w.storage.get(KEY),before);assert.equal(owner.account.ready(),true);
  return {foreignAcquire:false,foreignWrite:false,ownerStillReady:true,balance:owner.account.balance()};
});

await test('Reload recovers the committed round when unload cleanup is cancelled',async()=>{
  const w=world(),old=w.document('departing');assert.equal(await old.account.acquire(),true);old.account.saveRoom({bank:10000});const first=old.open(),initialMeter=first.state.jackpots[100];
  first.E.start(first.state,n=>Math.min(7,n-1));const pending=plain(first.state.pending),saved=w.storage.get(KEY),oldToken=(await w.record()).id;
  old.hide();await flush();assert.equal((await w.record()).id,oldToken,'This regression must leave the old IDB record unexpired.');
  const next=w.document('replacement');assert.equal(await next.account.acquire(),true,'A released exact owner must transfer without waiting 60 seconds.');assert.equal(w.storage.get(KEY),saved,'Acquisition must not alter account state.');
  const second=next.open();assert.deepEqual(plain(second.state.pending),pending);assert.equal(next.account.balance(),9900);assert.equal(second.state.jackpots[100],initialMeter+2);
  second.E.settle(second.state);const settledBalance=next.account.balance();assert.equal(second.state.spins,1);assert.equal(second.state.wagered,100);assert.equal(second.state.history[0].id,pending.id);assert.deepEqual(plain(second.state.grid),pending.grid);assert.equal(second.state.jackpots[100],initialMeter+2);
  assert.equal(old.account.ready(),false);assert.throws(()=>first.E.settle(first.state),/another tab|paused|Reconnect/);
  next.hide();await flush();const again=w.document('second reload');assert.equal(await again.account.acquire(),true);const third=again.open();assert.equal(third.state.pending,null);assert.equal(third.state.spins,1);assert.equal(third.state.history.filter(x=>x.id===pending.id).length,1);assert.equal(again.account.balance(),settledBalance);
  return {cancelledUnloadTransactions:old.cancelledTransactions,roundId:pending.id,pendingGridRecovered:true,paidDebits:1,jackpotContribution:2,settlements:1,noDoubleCredit:true,balance:settledBalance};
});

await test('Two simultaneous replacements cannot both acquire a released lease',async()=>{
  const w=world(),old=w.document('old');assert.equal(await old.account.acquire(),true);old.hide();await flush();const a=w.document('contender A'),b=w.document('contender B'),results=await Promise.all([a.account.acquire(),b.account.acquire()]);
  assert.equal(results.filter(Boolean).length,1);assert.equal([a,b].filter(x=>x.account.ready()).length,1);
  return {successfulAcquisitions:1,liveOwners:1,results};
});

await test('A stale release marker cannot authorize taking a new live owner',async()=>{
  const w=world(),a=w.document('A');assert.equal(await a.account.acquire(),true);const retired=(await w.record()).id;a.hide();await flush();const b=w.document('B');assert.equal(await b.account.acquire(),true);
  w.storage.set(RELEASE_PREFIX+retired,JSON.stringify({id:retired,releasedAt:Date.now()}));const before=plain(await w.record()),c=w.document('C');assert.equal(await c.account.acquire(),false);assert.deepEqual(plain(await w.record()),before);assert.equal(b.account.ready(),true);
  return {staleMarkerIgnored:true,newOwnerStillExclusive:true};
});

await test('A losing contender cannot overwrite the owner release marker',async()=>{
  const w=world(),owner=w.document('owner'),loser=w.document('loser');assert.equal(await owner.account.acquire(),true);assert.equal(await loser.account.acquire(),false);const token=(await w.record()).id;
  owner.hide();loser.hide();await flush();assert.equal(JSON.parse(w.storage.get(RELEASE_PREFIX+token)).id,token);const next=w.document('next');assert.equal(await next.account.acquire(),true);
  return {separateOwnerMarkers:true,reloadAccepted:true};
});

await test('Delayed first-acquisition completion cannot revive a retired document',async()=>{
  const w=world(),old=w.document('old');old.holdCompletions=true;const acquiring=old.account.acquire();await waitFor(()=>old.held.length>0);old.hide();await flush();
  const next=w.document('next');assert.equal(await next.account.acquire(),true);const mirror=plain(w.mirror());old.releaseCompletions();assert.equal(await acquiring,false);assert.equal(old.account.ready(),false);assert.equal(next.account.ready(),true);assert.deepEqual(plain(w.mirror()),mirror);
  return {lateAcquireRejected:true,oldOwnerNotRevived:true,newMirrorPreserved:true};
});

await test('Delayed renewal completion cannot overwrite the new owner mirror',async()=>{
  const w=world(),old=w.document('old');assert.equal(await old.account.acquire(),true);old.holdCompletions=true;w.advance(10000);old.renew();await waitFor(()=>old.held.length>0);old.hide();await flush();
  const next=w.document('next');assert.equal(await next.account.acquire(),true);const mirror=plain(w.mirror());old.releaseCompletions();await flush();assert.equal(old.account.ready(),false);assert.equal(next.account.ready(),true);assert.deepEqual(plain(w.mirror()),mirror);
  return {lateRenewalIgnored:true,newMirrorPreserved:true};
});

await test('A restored document rotates its retired token and restarts renewal',async()=>{
  const w=world(),a=w.document('restored');assert.equal(await a.account.acquire(),true);const original=(await w.record()).id;a.hide({destroy:false});await flush();assert.equal(a.intervalCount(),0);assert.equal(await a.account.acquire(),true);
  const acquired=plain(await w.record());assert.notEqual(acquired.id,original);assert.equal(a.intervalCount(),1);w.advance(10000);a.renew();await flush();const renewed=await w.record();assert.equal(renewed.id,acquired.id);assert.equal(renewed.expires,acquired.expires+10000);const foreign=w.document('foreign');assert.equal(await foreign.account.acquire(),false);
  return {rotatedToken:true,activeRenewalTimers:1,renewalExtendedByMs:10000,foreignOwnerBlocked:true};
});

await test('Unavailable release storage fails conservatively until the original lease expires',async()=>{
  const w=world(),old=w.document('old');assert.equal(await old.account.acquire(),true);old.failMarkers=true;old.hide();await flush();const next=w.document('next');assert.equal(await next.account.acquire(),false);w.advance(60001);assert.equal(await next.account.acquire(),true);
  return {noUnprovenEarlyTakeover:true,normalExpiryRecovery:true};
});

await test('Pagehide before IndexedDB opens cannot create a late live owner',async()=>{
  const w=world(),old=w.document('old'),pending=old.account.acquire();old.hide();assert.equal(await pending,false);const next=w.document('next');assert.equal(await next.account.acquire(),true);assert.equal(old.account.ready(),false);
  return {lateOwnership:false,replacementAcquired:true};
});

const canonicalSha256=createHash('sha256').update(fs.readFileSync(path.join(root,'src/layr-account.js'))).digest('hex');
const expectedCanonical='659bea0c6afc283fd851b9cd1d25573c4fc58d4a7968f7c94e3f6ee77882eed4';
const result={status:tests.every(x=>x.pass)&&canonicalSha256===expectedCanonical?'PASS':'FAIL',checkedAt:new Date().toISOString(),stubSha256:createHash('sha256').update(adapter).digest('hex'),canonicalSha256,canonicalUnchanged:canonicalSha256===expectedCanonical,
  scope:'Actual standalone stub and immutable engine in separate Node VM documents, shared fake-indexeddb 6.2.4, localStorage and lifecycle failure injection. Browser reload acceptance remains separate.',tests};
const output=process.env.CK_LEASE_RESULTS||path.join(root,'checks/results/lease.json');fs.writeFileSync(output,JSON.stringify(result,null,2)+'\n');
console.log(`${tests.filter(x=>x.pass).length}/${tests.length} lease checks passed; canonical adapter unchanged: ${result.canonicalUnchanged}`);
if(result.status!=='PASS')process.exitCode=1;
