// The shipped expanded frontend speaks its actual HTTP/Clarity ABI to simnet.
// No real wallet, network or transaction broadcast is used.
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {webcrypto} from 'node:crypto';
import {JSDOM,VirtualConsole} from '../../X-Chess_2.0/node_modules/jsdom/lib/api.js';
import {initSimnet} from '../../X-Chess_2.0/node_modules/@stacks/clarinet-sdk/dist/esm/node/src/index.js';
import {Cl,serializeCV,deserializeCV} from '../../X-Chess_2.0/node_modules/@stacks/transactions/dist/index.js';
const sim=await initSimnet(new URL('../Clarinet.toml',import.meta.url).pathname);
const sender=sim.getAccounts().get('deployer'), contract='xchess-core-v3';
const html=readFileSync(new URL('../dist/v3-expanded.html',import.meta.url),'utf8');
let txCount=0;const transactions=new Map(),calls=[],errors=[],results=[];
const json=value=>new Response(JSON.stringify(value),{headers:{'Content-Type':'application/json'}});
function boot(url='https://fixture.test/') {
 return new JSDOM(html,{url,runScripts:'dangerously',pretendToBeVisual:true,virtualConsole:new VirtualConsole(),beforeParse(w){
  Object.assign(w,{TextEncoder,TextDecoder,AbortController,AbortSignal,Response,Request,Headers});
  w.TextEncoder=class extends TextEncoder { encode(text){ return w.Uint8Array.from(super.encode(text)); } };
  Object.defineProperty(w.crypto,'subtle',{value:webcrypto.subtle});
  w.matchMedia=()=>({matches:false,addEventListener(){},removeEventListener(){}});
  w.ResizeObserver=class{observe(){}unobserve(){}disconnect(){}};
  w.addEventListener('error',e=>errors.push(e.message));
  w.fetch=async(url,init={})=>{
   const path=new URL(url,'http://localhost:3999').pathname;
   if(path==='/v2/info')return json({network_id:2147483648,stacks_tip:'tip-'+sim.blockHeight,stacks_tip_height:sim.blockHeight});
   if(path.startsWith('/v2/contracts/call-read/')){
    const body=JSON.parse(init.body), fn=path.split('/').at(-1);
    const receipt=sim.callReadOnlyFn(contract,fn,body.arguments.map(x=>deserializeCV(x)),sender);
    calls.push({type:'read',fn});return json({okay:true,result:serializeCV(receipt.result)});
   }
   if(path.startsWith('/extended/v1/block/by_height/'))return json({canonical:true,hash:'tip-'+path.split('/').at(-1)});
   if(path.startsWith('/extended/v1/tx/'))return json(transactions.get(path.split('/').at(-1)));
   throw Error('Unexpected test request: '+path);
  };
  w.StacksProvider={request:async(method,params)=>{
   if(method!=='stx_callContract')return {addresses:[{symbol:'STX',address:sender}]};
   assert.equal(params.postConditionMode,'deny');
   assert.ok(params.postConditions.every(p=>typeof p==='string'),'Uses V2 serialized postconditions');
   const receipt=sim.callPublicFn(contract,params.functionName,params.functionArgs.map(x=>deserializeCV(x)),sender);
   assert.match(Cl.prettyPrint(receipt.result),/^\(ok /,'Contract rejected '+params.functionName);
   const txid='0x'+(++txCount).toString(16).padStart(64,'0');
   transactions.set(txid,{tx_status:'success',canonical:true,is_unanchored:false,tx_result:{hex:serializeCV(receipt.result)}});
   calls.push({type:'sign',fn:params.functionName,params});return {txid};
  }};
 }});
}
const pause=()=>new Promise(r=>setTimeout(r,30));
async function until(fn){for(let i=0;i<1500;i++){if(fn())return;await pause();}throw Error('Timed out waiting for UI: '+dom.window.document.getElementById("x-chess-root")?.textContent.slice(-1500));}
let dom=boot();await until(()=>dom.window.document.querySelector('[data-square]'));
const doc=()=>dom.window.document;
const visible=()=>[...doc().body.children].filter(el=>el.tagName!=="SCRIPT").map(el=>el.textContent).join(" ");
async function click(name,scope=doc()) {const el=[...scope.querySelectorAll('button')].find(b=>(b.getAttribute('aria-label')||b.textContent).trim()===name);assert.ok(el,'Missing '+name);el.click();await pause();}
async function test(name,fn){try{await fn();results.push({name,passed:true}); console.log("PASS",name);}catch(e){results.push({name,passed:false,error:e.message}); console.log("FAIL",name,e.message);}}
await test('connect with V2 wallet policy',async()=>{await click('Connect wallet');await click('window.StacksProvider');await until(()=>!doc().querySelector('[role="dialog"]'));});
await test('open new community game, quote, sign and authoritative recovery',async()=>{
 await click('New game');await click('Community',doc().querySelector('[role="dialog"]'));
 await click('Review rules & current costs');await until(()=>visible().includes('Approve opening in wallet'));
 await click('Approve opening in wallet');await until(()=>visible().includes('ON-CHAIN GAME'));
 assert.equal(txCount,1);assert.equal(doc().querySelectorAll('[data-square]').length,64);
 assert.equal(calls.find(c=>c.type==='sign').fn,'open-v3-game');
});
await test('preview, sign and confirm e2e4 against the same contract',async()=>{
 doc().querySelector('[data-square="e2"]').click();await pause();doc().querySelector('[data-square="e4"]').click();
 await until(()=>visible().includes('Approve in wallet'));await click('Approve in wallet');
 await until(()=>doc().querySelector('[data-square="e4"]')?.getAttribute('aria-label').includes('white pawn') && visible().includes('accepted'));
 assert.equal(txCount,2);assert.equal(calls.filter(c=>c.type==='sign'&&c.fn==='submit').length,1);
});
const savedUrl=dom.window.location.href;dom.window.close();dom=boot(savedUrl);
await test('clean-page recovery reconstructs committed rules and move',async()=>{
 await until(()=>visible().includes('Rules recovered and all submissions replayed.'));
 assert.match(doc().querySelector('[data-square="e4"]').getAttribute('aria-label'),/white pawn/);assert.equal(txCount,2);
});
await test('no frontend exceptions during full journey',()=>assert.deepEqual(errors,[]));
dom.window.close();
const report={passed:results.filter(r=>r.passed).length,failed:results.filter(r=>!r.passed).length,results,calls:calls.map(({type,fn})=>({type,fn}))};
writeFileSync(new URL('../journey-results.json',import.meta.url),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));process.exitCode=report.failed?1:0;
