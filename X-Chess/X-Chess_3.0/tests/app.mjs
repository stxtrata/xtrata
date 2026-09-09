// Run from any directory: node reviews/v3.0/test-v3.mjs [path-to-v3-html]
// No real wallet or network: all requests are intercepted.
import {readFileSync, writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {createHash, webcrypto} from 'node:crypto';
import assert from 'node:assert/strict';
import {JSDOM, VirtualConsole} from '../../X-Chess_2.0/node_modules/jsdom/lib/api.js';
const source = process.argv[2] || fileURLToPath(new URL('../dist/v3-expanded.html',import.meta.url));
const html = readFileSync(source, 'utf8');
const results = [];
async function test(name, fn) {try {await fn(); results.push({name, passed:true}); console.log('PASS',name);} catch(e) {results.push({name, passed:false, error:e.message}); console.log('FAIL',name,e.message.slice(0,300));}}
const pause = () => new Promise(r=>setTimeout(r,65));
function boot({instrument=false, url='https://example.test/i/9999', storage}={}) {
  const errors=[], requests=[];
  // Expose existing bundle symbols only for engine/protocol tests; UI tests use original bytes.
  const input=instrument && !html.includes("XChessAudit") ? html.replace('window.XChessBoot=', 'window.__audit={Chess:gn,replay:Ta,rules:hy,reader:jm,parseLink:lT,connect:dT,providers:Qc,exportBundle:uT,importBundle:cT,demo:bT};window.XChessBoot=') : html;
  const dom=new JSDOM(input,{url,runScripts:'dangerously',pretendToBeVisual:true,virtualConsole:new VirtualConsole(),beforeParse(w){
    Object.assign(w,{TextEncoder,TextDecoder,AbortController,AbortSignal});
    Object.defineProperty(w.crypto,'subtle',{value:webcrypto.subtle});
    w.matchMedia=()=>({matches:false,addEventListener(){},removeEventListener(){}});
    w.ResizeObserver=class {observe(){} unobserve(){} disconnect(){}};
    w.fetch=async u=>{requests.push(String(u));throw Error('Test network offline');};
    if(storage)for(const name of ['sessionStorage','localStorage'])Object.defineProperty(w,name,{get(){throw Error('storage denied');}});
    w.addEventListener('error',e=>errors.push(e.message));
  }});
  return {dom,w:dom.window,d:dom.window.document,errors,requests};
}
const ui=boot(); await pause(); const {d,w}=ui;
const button = text => [...d.querySelectorAll('button')].find(b=>(b.getAttribute('aria-label')||b.textContent).trim()===text);
const click=async text=>{const b=button(text);assert.ok(b,'Missing button '+text);b.click();await pause();};
const square=async s=>{d.querySelector(`[data-square="${s}"]`).click();await pause();};
await test('UI: boots one 64-square board without errors',()=>{assert.equal(d.querySelectorAll('[data-square]').length,64);assert.deepEqual(ui.errors,[]);});
await test('UI: no network requests during practice boot',()=>assert.equal(ui.requests.length,0));
await test('UI: a1 is dark and h1 is light',()=>{assert.ok(d.querySelector('[data-square="a1"]').classList.contains('dark'));assert.ok(d.querySelector('[data-square="h1"]').classList.contains('light'));});
await test('UI: board has one tab stop (v2.2 keyboard parity)',()=>assert.equal([...d.querySelectorAll('[data-square]')].filter(b=>b.tabIndex===0).length,1));
await test('UI: Home moves focus to start of row',()=>{const b=d.querySelector('[data-square="d4"]');b.focus();b.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Home',bubbles:true}));assert.equal(d.activeElement.dataset.square,'a4');});
await test('UI: flip reverses board',async()=>{await click('Flip board');assert.equal(d.querySelector('[data-square]').dataset.square,'h1');assert.equal([...d.querySelectorAll('[data-square]')].filter(b=>b.tabIndex===0).length,1);await click('Flip board');});
await test('UI: legal move preview then commit updates board',async()=>{await square('f1');await square('e2');assert.ok(d.querySelector('.move-preview').textContent.includes('f1e2'));await click('Play move');assert.match(d.querySelector('[data-square="e2"]').getAttribute('aria-label'),/white bishop/);assert.match(d.querySelector('.turn-card').textContent,/Black to move/);});
await test('UI: replay refuses new moves',async()=>{await click('Starting position');await square('e2');await square('e4');assert.ok(!d.querySelector('.move-preview'),'Unexpected move preview');assert.match((d.getElementById("x-chess-root")?.textContent || ""),/Return to the live position/);await click('Live position');});
await test('UI: duplicate boot remains single board',async()=>{w.XChessBoot();await pause();assert.equal(d.querySelectorAll('[data-square]').length,64);});
await test('UI: default New game can create local practice without a wallet',async()=>{await click('New game');await click('Create local practice game');assert.ok(!d.querySelector('[role="dialog"]'),'New game dialog remains open');});
ui.dom.window.close();
const isolated=boot({instrument:true});await pause();const api=isolated.w.XChessAudit ?? isolated.w.__audit;assert.ok(api,'Instrumentation point missing');
const W='ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM', B='ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5';
function replay(moves,extra={}){const rules={...api.rules(),white:W,black:B,...extra};const entries=moves.map((value,seq)=>({value,seq,sender:seq%2?B:W,height:seq+1}));return api.replay(rules,entries,entries.length);}
const fixtures=[
 ['start',undefined,8902],
 ['kiwipete','r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1',97862],
 ['en passant endgame','8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1',2812],
 ['promotions/pins','r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1',9467],
 ['position 5','rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8',62379],
 ['position 6','r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10',89890]
];
for(const [name,fen,count] of fixtures) await test('Engine perft depth 3: '+name,()=>assert.equal(new api.Chess(fen).perft(3),count));
await test('Replay: Fool’s mate and reject after termination',()=>{const r=replay(['f2f3','e7e5','g2g4','d8h4','a2a3']);assert.equal(r.result,'0-1');assert.equal(r.termination,'checkmate');assert.equal(r.verdicts[4].reason,'after-termination');});
await test('Replay: en passant',()=>{const r=replay(['e2e4','a7a6','e4e5','d7d5','e5d6']);assert.equal(r.accepted.length,5);assert.match(r.verdicts[4].san,/exd6/);});
await test('Replay: castle kingside',()=>{const r=replay(['e2e4','e7e5','g1f3','b8c6','f1c4','g8f6','e1g1']);assert.equal(r.verdicts[6].san,'O-O');});
for(const p of ['q','r','b','n'])await test('Replay: promotion to '+p,()=>{const r=replay(['a7a8'+p],{fen:'7k/P7/8/8/8/8/8/7K w - - 0 1'});assert.equal(r.accepted.length,1);assert.match(r.fen,new RegExp('^'+p.toUpperCase()));});
await test('Replay: threefold repetition',()=>assert.equal(replay(['g1f3','g8f6','f3g1','f6g8','g1f3','g8f6','f3g1','f6g8']).termination,'repetition'));
await test('Replay: 100 halfmoves',()=>assert.equal(replay(['a1a2'],{fen:'7k/8/8/8/8/8/8/R6K w - - 99 1'}).termination,'fifty-move'));
await test('Replay: two knights versus king remains playable',()=>assert.equal(replay([],{fen:'7k/8/8/8/8/8/8/NN5K w - - 0 1'}).result,undefined));
await test('Replay: unbound control cannot claim seat',()=>{const r=replay(['resgn'],{white:'first-mover',black:'anyone-else'});assert.equal(r.verdicts[0].reason,'unbound-control-sender');assert.equal(r.white,undefined);});
await test('Replay: incomplete evidence rejected',()=>assert.equal(api.replay(api.rules(),[],1).state,'incomplete'));
await test('Evidence: export/import preserves replay',()=>{const g=api.demo();const imported=api.importBundle(JSON.stringify(api.exportBundle(g)));assert.equal(imported.provenance.source,'bundle');assert.equal(api.replay(imported.rules,imported.entries,imported.count).fen,api.replay(g.rules,g.entries,g.count).fen);});
await test('Compatibility: V3 reader never reinterprets V2 protocol',async()=>{const reader=new api.reader({tip:async()=>({hash:'abc',height:1}),read:async(_,fn)=>{if(fn==='get-protocol-v3')return 'xchess-core-v1';throw Error('Unexpected '+fn);}});await assert.rejects(reader.game({network:'mainnet',contract:'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xchess-core-v1-canary',gameId:47}),/unsupported-contract-protocol/);});
await test('Compatibility: unqualified links stay outside V3 reader',()=>assert.throws(()=>api.parseLink('#game=47'),/invalid-identity/));
await test('Wallet: cancellation makes one request only',async()=>{let calls=0;await assert.rejects(api.connect({request:async()=>{calls++;throw Object.assign(Error('User rejected'),{code:4001});}},'testnet'));assert.equal(calls,1);});
await test('Wallet: detects Xverse BitcoinProvider (v2.2 supported shape)',()=>assert.equal(api.providers({XverseProviders:{BitcoinProvider:{request(){}}}}).length,1));
await test('Wallet: accepts correct-network address',async()=>assert.equal(await api.connect({request:async()=>({addresses:[{address:W}]})},'testnet'),W));
await test('Wallet: rejects wrong-network address',async()=>assert.rejects(api.connect({request:async()=>({addresses:[{address:W}]})},'mainnet')));
await test('Protocol: unsupported extension semantics are not replayed',async()=>{
 const reader=new api.reader({tip:async()=>({hash:'abc',height:1}),read:async(_,fn)=>fn==='get-protocol-v3'?{protocol:3}:{'options-version':2,options:[]}});
 await assert.rejects(reader.game({network:'testnet',contract:W+'.xchess-core-v3',gameId:1}),/unsupported-game-options/);
});
isolated.dom.window.close();
await test('UI: blocked local and session storage do not crash boot',async()=>{const b=boot({storage:true});await pause();assert.equal(b.d.querySelectorAll('[data-square]').length,64);assert.deepEqual(b.errors,[]);b.dom.window.close();});
await test('Artifact: fits existing 32-chunk budget',()=>assert.ok(Math.ceil(Buffer.byteLength(readFileSync(new URL('../dist/xchess.html',import.meta.url)))/16384)<=32));
await test('Artifact: no external script or stylesheet dependencies',()=>{assert.doesNotMatch(html,/<script[^>]+src=|<link[^>]+href=|@import/i);});
const report={source,sha256:createHash('sha256').update(html).digest('hex'),bytes:Buffer.byteLength(html),chunks:Math.ceil(Buffer.byteLength(html)/16384),passed:results.filter(r=>r.passed).length,failed:results.filter(r=>!r.passed).length,results};
writeFileSync(fileURLToPath(new URL('../app-results.json',import.meta.url)),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
