#!/usr/bin/env node
/**
 * patch-agent-bundle.mjs — re-applies the 2026-07-01.5 fix set to a freshly built wizard/agent-one.js.
 *
 * WHY: the site build regenerates agent-one.js from src/agent-one/agent-core.ts, wiping these fixes.
 * Until they are ported into the TypeScript source (see AGENT-CORE-PORT.md), run this AFTER every
 * rebuild and BEFORE deploying:   node site-integration/patch-agent-bundle.mjs
 *
 * Every patch asserts its target appears EXACTLY ONCE in the bundle; if the build output ever drifts
 * (different minified names), the script fails loudly instead of half-patching.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const BUILD = '2026-07-01.5';
const FILE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../wizard/agent-one.js');
let src = fs.readFileSync(FILE, 'utf8');

if (src.includes('XAO_AGENT_BUILD')) { console.log('bundle already patched (' + BUILD + ') — nothing to do'); process.exit(0); }

const P = [];
const patch = (name, find, replace) => P.push({ name, find, replace });

// 1 ─ IndexedDB byte persistence + verbose logger helpers
patch('helpers', 'Eb="xao-job-",ya=new Map,Ol=e=>Eb+e;',
`Eb="xao-job-",ya=new Map,Ol=e=>Eb+e,xaoIdb=()=>new Promise((res,rej)=>{try{const r=indexedDB.open("xtrata-agent-one",1);r.onupgradeneeded=()=>{try{r.result.createObjectStore("files")}catch{}},r.onsuccess=()=>res(r.result),r.onerror=()=>rej(r.error)}catch(e){rej(e)}}),xaoSaveBytes=async(id,bytes)=>{try{const db=await xaoIdb();await new Promise((res,rej)=>{const tx=db.transaction("files","readwrite");tx.objectStore("files").put(bytes,id),tx.oncomplete=res,tx.onerror=()=>rej(tx.error)}),db.close()}catch(e){console.warn("xao: could not persist file bytes:",e)}},xaoLoadBytes=async id=>{try{const db=await xaoIdb();const r=await new Promise((res,rej)=>{const q=db.transaction("files").objectStore("files").get(id);q.onsuccess=()=>res(q.result||null),q.onerror=()=>rej(q.error)});return db.close(),r?r instanceof Uint8Array?r:new Uint8Array(r):null}catch{return null}},xaoDeleteBytes=async id=>{try{const db=await xaoIdb();db.transaction("files","readwrite").objectStore("files").delete(id),db.close()}catch{}},xaoRestoreBytes=async id=>{if(ya.has(id))return!0;const b=await xaoLoadBytes(id);return b&&b.length?(ya.set(id,b),!0):!1},xaoLog=(id,msg)=>{try{console.info("[xao "+new Date().toISOString().slice(11,19)+"]"+(id?" "+id+" ·":"")+" "+msg)}catch{}if(!id)return;try{const j=ct(id);j.log=((j.log||[]).slice(-199)).concat(new Date().toISOString()+" "+msg),He(j)}catch{}};`);

// 2 ─ Nakamoto-aware confirmation polling
patch('waitTx-iterations', 'async function Pl(e){for(let t=0;t<120;t++){', 'async function Pl(e){for(let t=0;t<210;t++){');
patch('waitTx-cadence', 'catch(n){if(String(n).includes("TX abort"))throw n}await pa(8e3)}throw new Error("not confirmed: "+e)',
  'catch(n){if(String(n).includes("TX abort"))throw n}await pa(t<45?2e3:6e3)}throw new Error("not confirmed: "+e)');

// 3 ─ faster funding watcher
patch('watcher-tick', 'setInterval(tI,bi?2e3:8e3)', 'setInterval(tI,bi?2e3:4e3)');

// 4 ─ statusJob: mempool "payment seen"
patch('status-pending', 'async function wa(e){const t=await ZE(e);return{jobId:e.jobId,status:e.status,depositAddress:e.depositAddress,requiredUstx:e.requiredUstx,balanceUstx:t.toString(),funded:t>=BigInt(e.requiredUstx),tokenId:e.tokenId||null}}',
`async function wa(e){const t=await ZE(e);const xaoFunded=t>=BigInt(e.requiredUstx);let xaoPending=!1;if(!xaoFunded&&!e.mock&&e.depositAddress&&e.status==="AWAITING_DEPOSIT")try{xaoPending=(((await(await da(\`/extended/v1/address/\${e.depositAddress}/mempool?limit=10\`)).json()).results)||[]).some(x=>x.token_transfer&&x.token_transfer.recipient_address===e.depositAddress)}catch{}return{jobId:e.jobId,status:e.status,depositAddress:e.depositAddress,requiredUstx:e.requiredUstx,balanceUstx:t.toString(),funded:xaoFunded,pending:xaoPending,tokenId:e.tokenId||null}}`);

// 5 ─ dust-resistant funder detection (largest cumulative payer)
patch('funder', 'async function vb(e){try{const n=((await(await da(`/extended/v1/address/${e}/stx_inbound?limit=20`)).json()).results||[]).filter(r=>r.sender&&BigInt(r.amount||"0")>0n);if(n.length)return n[0].sender}catch{}try{const t=await(await da(`/extended/v1/address/${e}/transactions?limit=20`)).json();for(const n of t.results||[]){const r=n.tx||n;if(r.token_transfer&&r.token_transfer.recipient_address===e&&r.sender_address)return r.sender_address}}catch{}return null}',
`async function vb(e){const xaoTop=m=>{let b=null,ba=-1n;for(const[k,v]of m)v>ba&&(b=k,ba=v);return b};try{const d=await(await da(\`/extended/v1/address/\${e}/stx_inbound?limit=50\`)).json(),m=new Map;for(const r of d.results||[]){const a=BigInt(r.amount||"0");r.sender&&a>0n&&m.set(r.sender,(m.get(r.sender)||0n)+a)}if(m.size)return xaoTop(m)}catch{}try{const t=await(await da(\`/extended/v1/address/\${e}/transactions?limit=50\`)).json(),m=new Map;for(const n of t.results||[]){const r=n.tx||n;if(r.token_transfer&&r.token_transfer.recipient_address===e&&r.sender_address){const a=BigInt(r.token_transfer.amount||"0");a>0n&&m.set(r.sender_address,(m.get(r.sender_address)||0n)+a)}}if(m.size)return xaoTop(m)}catch{}return null}`);

// 6 ─ createJob: duplicate-hash guard + collision-proof ids + persist bytes
patch('dup-hash-guard', 'const h=new Uint8Array(await t.arrayBuffer()),u=await Ib({bytes:h.length,marginUstx:a,agentFeePct:l}),d=VE(),',
`const h=new Uint8Array(await t.arrayBuffer());if(!bi){const xaoH=yb(Nl(h)),xaoEx=await Dl(xaoH);if(xaoEx)throw new Error(\`This exact content is already inscribed on-chain as token #\${xaoEx}. Inscribing an identical hash is blocked by the contract — no payment was taken.\`)}const u=await Ib({bytes:h.length,marginUstx:a,agentFeePct:l}),d=VE(),`);
patch('jobid+persist', 'f=`job-${Date.now()}`;ya.set(f,h);', 'f=`job-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;ya.set(f,h);await xaoSaveBytes(f,h);');

// 7 ─ runJob: restore bytes from IndexedDB; skip funding gate on resume; log progress
patch('bytes-restore', 'const n=ya.get(e.jobId);if(!n)throw new Error("file bytes not in memory (tab reloaded) — returning funds");',
  'let n=ya.get(e.jobId);if(!n&&await xaoRestoreBytes(e.jobId)&&(n=ya.get(e.jobId)),!n)throw new Error("file bytes not in memory or on disk (storage cleared) — returning funds");');
patch('funding-gate', 'const t=await Xn(e.depositAddress);if(t<BigInt(e.requiredUstx))throw new Error(`not funded: need ${e.requiredUstx}, have ${t}`);e.depositReceivedUstx=t.toString();',
  'if(!e.depositReceivedUstx){const t=await Xn(e.depositAddress);if(t<BigInt(e.requiredUstx))throw new Error(`not funded: need ${e.requiredUstx}, have ${t}`);e.depositReceivedUstx=t.toString()}');
patch('progress-log', 's=await WE(e,r.key,r.address,n,i=>{e.progress=i,e.progressAt=new Date().toISOString(),He(e)})',
  's=await WE(e,r.key,r.address,n,i=>{e.progress=i,e.progressAt=new Date().toISOString(),He(e),xaoLog(e.jobId,i)})');

// 8 ─ idempotent single-tx mint
patch('idempotent-mint', 'l.length&&u.push(li(l));const{d}=await ga(e,t,h,u,o);return xb(d)||await Dl(c)}',
  'l.length&&u.push(li(l));const xaoPre=await Dl(c);if(xaoPre)return xaoPre;const{d}=await ga(e,t,h,u,o);return xb(d)||await Dl(c)}');

// 9 ─ tx sender: fee-spike retries → fee-wait (fees may settle) → bounded fallback; verbose logging
patch('ga-fee-policy', 'async function ga(e,t,n,r,s){const i=s!=null?[HA(t,ai.LessEqual,s)]:[],o=await Wg({contractAddress:Bs[0],contractName:Bs[1],functionName:n,functionArgs:r,senderKey:e,network:Yn,postConditionMode:vr.Deny,postConditions:i,anchorMode:Me.Any}),a=BigInt(o.auth.spendingCondition.fee.toString());if(a>KE)throw new Error(`${n} fee ${a} exceeds cap`);const c=await pl(o,Yn);if(c.error)throw new Error(`${n}: ${c.error} ${c.reason||""}`);const l=c.txid||c,h=await Pl(l);return{txid:l,d:h}}',
`const xaoLastFee=new Map();async function ga(e,t,n,r,s){const i=s!=null?[HA(t,ai.LessEqual,s)]:[];let o,a;
for(let xaoTry=0;;xaoTry++){
  const xaoOpts={contractAddress:Bs[0],contractName:Bs[1],functionName:n,functionArgs:r,senderKey:e,network:Yn,postConditionMode:vr.Deny,postConditions:i,anchorMode:Me.Any};
  o=await Wg(xaoOpts);a=BigInt(o.auth.spendingCondition.fee.toString());
  xaoLog(null,\`\${n}: fee estimate \${a} µSTX (cap \${KE}, try \${xaoTry+1})\`);
  if(a<=KE)break;
  if(xaoTry<3){xaoLog(null,\`\${n}: estimator spike — retrying (\${xaoTry+1}/3)\`);await pa(6e3);continue}
  if(xaoTry<15){xaoLog(null,\`\${n}: network fees high — waiting for them to settle (\${xaoTry-2}/12)\`);await pa(2e4);continue}
  const xaoFb=xaoLastFee.get(n),xaoFee=xaoFb&&xaoFb*2n<=KE?xaoFb*2n:KE;
  xaoLog(null,\`\${n}: fees still elevated — using bounded fallback fee \${xaoFee}\`);
  o=await Wg({...xaoOpts,fee:xaoFee});a=xaoFee;break;
}
xaoLastFee.set(n,a);const c=await pl(o,Yn);if(c.error){xaoLog(null,\`\${n}: broadcast REJECTED — \${c.error} \${c.reason||""}\`);throw new Error(\`\${n}: \${c.error} \${c.reason||""}\`)}const l=c.txid||c;xaoLog(null,\`\${n}: broadcast 0x\${String(l).replace(/^0x/,"")} · fee \${a} µSTX — awaiting confirmation\`);const xaoT0=Date.now(),h=await Pl(l);xaoLog(null,\`\${n}: confirmed in \${((Date.now()-xaoT0)/1000).toFixed(1)}s\`);return{txid:l,d:h}}`);

// 10 ─ auto-resume on transient errors (instead of refund-on-first-failure)
patch('auto-resume', 'function xi(e,t){_r.add(e),Promise.resolve().then(t).then(()=>_r.delete(e)).catch(async n=>{try{const r=ct(e);r.error=Dt(n),He(r)}catch{}try{await xa(ct(e),"error: "+Dt(n))}catch{}_r.delete(e)})}',
`const xaoFatal=/TX abort|not funded|locked to|unrecoverable|file bytes|empty file|exceeds single-tx|could not determine/i;
function xi(e,t){_r.add(e),Promise.resolve().then(t).then(()=>{try{const j=ct(e);j.retryCount&&j.status==="COMPLETE"&&(delete j.retryCount,He(j))}catch{}_r.delete(e)}).catch(async n=>{const msg=Dt(n);
try{const r=ct(e);r.error=msg,He(r);
if(!xaoFatal.test(msg)&&r.status!=="AWAITING_DEPOSIT"&&(r.retryCount=(r.retryCount||0)+1)<=4){
r.status=r.tokenId?"INSCRIBED":"FUNDED";
r.progress="recovered from a hiccup — resuming where it left off (attempt "+r.retryCount+"/4)";
r.progressAt=new Date().toISOString();He(r);
xaoLog(e,\`TRANSIENT error — auto-resume scheduled (\${r.retryCount}/4): \${msg}\`);
_r.delete(e);return}
xaoLog(e,\`FATAL error — refunding: \${msg}\`);
}catch{}
try{await xa(ct(e),"error: "+msg)}catch{}_r.delete(e)})}`);

// 11 ─ funding watcher: retry backoff, deliver-only resume, EXPIRED pickup, funded shortcut, byte restore
patch('watcher-head', 'if(_r.has(e.jobId)||e.status!=="AWAITING_DEPOSIT"&&e.status!=="FUNDED")continue;let t=!1;try{t=(await wa(e)).funded}catch{continue}',
`if(_r.has(e.jobId))continue;
if(e.retryCount&&e.status!=="AWAITING_DEPOSIT"&&Date.now()-(Date.parse(e.progressAt||"")||0)<15e3*e.retryCount)continue;
if(e.status==="INSCRIBED"&&e.fastTrack&&e.tokenId){xaoLog(e.jobId,\`inscribed (token #\${e.tokenId}) but undelivered — resuming delivery\`);xi(e.jobId,async()=>{const jj=ct(e.jobId);jj.status="DELIVERING",He(jj),await Lb(jj)});continue}
if(e.status!=="AWAITING_DEPOSIT"&&e.status!=="FUNDED"&&e.status!=="EXPIRED")continue;let t=!!e.depositReceivedUstx;if(!t)try{t=(await wa(e)).funded}catch{continue}`);
patch('watcher-funded', 'if(t){if(!ya.has(e.jobId)){xi(e.jobId,()=>xa(ct(e.jobId),"tab reloaded — file bytes gone, returning funds"));continue}e.fastTrack&&xi(e.jobId,()=>eI(ct(e.jobId)))}',
`if(t){if(!await xaoRestoreBytes(e.jobId)){e.bytesMisses=(e.bytesMisses||0)+1,He(e);if(e.bytesMisses<3)continue;xi(e.jobId,()=>xa(ct(e.jobId),"file bytes unrecoverable (browser storage cleared) — returning funds"));continue}e.bytesMisses=0,e.fastTrack&&(xaoLog(e.jobId,e.retryCount?\`resuming inscription (attempt \${e.retryCount+1})\`:"funded — starting auto-processing"),xi(e.jobId,()=>eI(ct(e.jobId))))}`);

// 12 ─ reaper: EXPIRED skip + patient AWAITING_DEPOSIT window (12×)
patch('reaper', 'async function nI(){const e=Date.now();for(const t of Fl()){if(_r.has(t.jobId)||["COMPLETE","CANCELLED","NEEDS_RECOVERY"].includes(t.status))continue;const n=Date.parse(t.progressAt||t.createdAt||"")||0;!n||e-n<pb||xi(t.jobId,()=>xa(ct(t.jobId),"expired — no progress within window"))}}',
'async function nI(){const e=Date.now();for(const t of Fl()){if(_r.has(t.jobId)||["COMPLETE","CANCELLED","NEEDS_RECOVERY","EXPIRED"].includes(t.status))continue;const n=Date.parse(t.progressAt||t.createdAt||"")||0,xaoWin=t.status==="AWAITING_DEPOSIT"?pb*12:pb;!n||e-n<xaoWin||xi(t.jobId,()=>xa(ct(t.jobId),"expired — no progress within window"))}}');

// 13 ─ never strand a never-funded job's key
patch('keep-key', 'return i!=null&&i<=Qt?(delete e.ephemeralMnemonic,e.status="CANCELLED"):',
  'return i!=null&&i<=Qt?(e.depositReceivedUstx||i>0n?(delete e.ephemeralMnemonic,e.status="CANCELLED"):(e.keepKey=!0,e.status="EXPIRED",e.keepKeyReason="never funded — key kept so a late payment is never stranded")):');

// 14 ─ IndexedDB cleanup on terminal states + delete
patch('cleanup-delete', 'localStorage.removeItem(Ol(e)),ya.delete(e)', 'localStorage.removeItem(Ol(e)),ya.delete(e),xaoDeleteBytes(e)');
patch('cleanup-complete', 'e.status="COMPLETE",He(e),{receipt:P}', 'e.status="COMPLETE",He(e),xaoDeleteBytes(e.jobId),{receipt:P}');
patch('cleanup-cancel', 'e.cancelReason=t,e.cancelledAt=new Date().toISOString(),s.refundTx&&(e.refundTx=s.refundTx),He(e),s',
  'e.cancelReason=t,e.cancelledAt=new Date().toISOString(),s.refundTx&&(e.refundTx=s.refundTx),He(e),e.status==="CANCELLED"&&xaoDeleteBytes(e.jobId),s');

// 15 ─ build tag + job log API (the version handshake suno.html checks)
patch('build-tag', 'window.XtrataAgent={health:async()=>({ok:!0,mock:bi,core:Ul,net:"mainnet",windowMs:pb})',
  `window.XAO_AGENT_BUILD="${BUILD}",window.XtrataAgent={build:"${BUILD}",health:async()=>({ok:!0,mock:bi,core:Ul,net:"mainnet",windowMs:pb,build:"${BUILD}"})`);
patch('joblog-api', 'getReceiptHtml:e=>{try{return ct(e).receiptHtml||null}catch{return null}}}',
  'getReceiptHtml:e=>{try{return ct(e).receiptHtml||null}catch{return null}},getJobLog:e=>{try{return ct(e).log||[]}catch{return[]}}}');

let fail = 0;
for (const { name, find, replace } of P) {
  const count = src.split(find).length - 1;
  if (count !== 1) { console.error(`✗ ${name}: target found ${count}× (expected 1) — build output drifted, DO NOT DEPLOY`); fail++; continue; }
  src = src.replace(find, replace);
  console.log(`✓ ${name}`);
}
if (fail) { console.error(`\n${fail} patch(es) failed — bundle NOT written.`); process.exit(1); }
fs.writeFileSync(FILE, src);
console.log(`\nAll ${P.length} patches applied → ${FILE} (build ${BUILD})`);
