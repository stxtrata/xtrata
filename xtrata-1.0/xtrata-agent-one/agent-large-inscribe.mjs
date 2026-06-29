#!/usr/bin/env node
/**
 * agent-large-inscribe.mjs — automated STAGED runway for large files (33 chunks
 * up to the 2048-chunk / 32 MiB limit) on Xtrata v3.2.3.
 *
 * Lifecycle: begin-or-get -> add-chunk-batch (<=32 chunks each) x N -> seal.
 * Resume-aware (reads on-chain get-upload-state), whole-job budgeted, deny-capped
 * on the two fee-paying calls (begin, seal; uploads are fee-free), dry-run-first.
 *
 * Env:
 *   WALLET_MNEMONIC | XTRATA_SENDER_ADDRESS (dry-run)   XTRATA_NETWORK(=mainnet)
 *   LARGE_FILE=./big.png            (required)
 *   LARGE_URI=xtrata:asset/...      (required, token-uri)
 *   LARGE_MIME=image/png            (optional; else guessed)
 *   LARGE_DEPS=1063,1051            (optional dependencies -> seal-recursive)
 *   LARGE_PARENT=134              (optional parent; wallet MUST own it at seal -> seal-with-relationships)
 *   LARGE_ESCROW=1               (parent-handoff: await the requester's parent transfer, then return it)
 *   LARGE_RETURN_TO=SP...        (requester address; receives parent back + child + change)
 *   LARGE_REFUND_USTX=0          (optional STX change to refund to the requester)
 *   DRY_RUN(=1)  REQUIRE_CONFIRM(=1)
 *   LARGE_PER_TX_FEE_USTX(=2000000)  per-tx fee cap (fees auto-estimated per tx)
 *   LARGE_SESSION_BUDGET_USTX(=30000000)  whole-job miner-fee cap
 */
import fs from 'node:fs';
import readline from 'node:readline';
import path from 'node:path';
import { sha256 } from '@noble/hashes/sha256';
import { bytesToHex } from '@noble/hashes/utils';
import { mnemonicToSeedSync } from '@scure/bip39';
import { HDKey } from '@scure/bip32';
import {
  makeContractCall, broadcastTransaction, callReadOnlyFunction,
  bufferCV, uintCV, stringAsciiCV, listCV, makeStandardSTXPostCondition,
  FungibleConditionCode, PostConditionMode, AnchorMode, cvToJSON,
  getAddressFromPrivateKey, TransactionVersion, standardPrincipalCV, makeSTXTokenTransfer,
} from '@stacks/transactions';
import { StacksMainnet, StacksTestnet } from '@stacks/network';

const NET=(process.env.XTRATA_NETWORK||'mainnet').toLowerCase();
const network=NET==='testnet'?new StacksTestnet():new StacksMainnet();
// Optional Hiro API key to avoid the public rate limit (free at platform.hiro.so).
const HIRO_KEY=process.env.HIRO_API_KEY||'';
const hfetch=(url,opts={})=>fetch(url,{...opts,headers:{...(opts.headers||{}),...(HIRO_KEY?{'x-api-key':HIRO_KEY}:{})}});
if(HIRO_KEY){ try{ network.fetchFn=hfetch; }catch{} }
const CORE=['SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X','xtrata-v3-2-3'];
const CHUNK_SIZE=16_384, BATCH=32, MAX_TOTAL_CHUNKS=2048, MODE_STAGED=1;
const FILE=process.env.LARGE_FILE, URI=process.env.LARGE_URI;
const MIMEenv=process.env.LARGE_MIME;
const DEPS=(process.env.LARGE_DEPS||'').split(',').map(s=>s.trim()).filter(Boolean).map(BigInt);
const PARENT=process.env.LARGE_PARENT?BigInt(process.env.LARGE_PARENT):null;
const PER_TX_FEE_CAP=BigInt(process.env.LARGE_PER_TX_FEE_USTX||'2000000');     // 2 STX hard cap per tx
const EST_BATCH_FEE=BigInt(process.env.LARGE_EST_BATCH_FEE_USTX||'400000');    // rough dry-run projection only
const SESSION_BUDGET=BigInt(process.env.LARGE_SESSION_BUDGET_USTX||'30000000');// 30 STX whole-job cap
// Escrow (parent-handoff service): take brief custody of a parent the requester
// owns, seal with it, then return parent + deliver child + refund change.
const ESCROW=process.env.LARGE_ESCROW==='1';
const RETURN_TO=process.env.LARGE_RETURN_TO||null;          // requester address (gets parent, child, change back)
const DELIVER_TO=process.env.LARGE_DELIVER_TO||null;        // optional: transfer the minted inscription to this wallet after seal
const REFUND_USTX=process.env.LARGE_REFUND_USTX?BigInt(process.env.LARGE_REFUND_USTX):0n;
let spentMiner=0n;
const DRY_RUN=process.env.DRY_RUN!=='0';
const REQUIRE_CONFIRM=process.env.REQUIRE_CONFIRM!=='0';
const SELFTEST='d85faf0f9f48c46fdfc959def3e64ed9126ef62538fc5fd6c5f09e37ee25c64e';
if(!FILE||!URI){console.error('Set LARGE_FILE and LARGE_URI');process.exit(2);}

function guessMime(f){const e=path.extname(f).toLowerCase();return {'.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.gif':'image/gif','.webp':'image/webp','.svg':'image/svg+xml','.mp4':'video/mp4','.webm':'video/webm','.mp3':'audio/mpeg','.wav':'audio/wav','.pdf':'application/pdf','.json':'application/json','.html':'text/html','.txt':'text/plain','.md':'text/markdown','.wasm':'application/wasm','.gz':'application/gzip'}[e]||'application/octet-stream';}
const MIME=MIMEenv||guessMime(FILE);

function derive(m){const s=mnemonicToSeedSync(m.trim().replace(/,\s*/g,' '));const c=HDKey.fromMasterSeed(s).derive("m/44'/5757'/0'/0/0");if(!c.privateKey)throw new Error('derive');const k=bytesToHex(c.privateKey)+'01';return {senderKey:k,address:getAddressFromPrivateKey(k,NET==='testnet'?TransactionVersion.Testnet:TransactionVersion.Mainnet)};}
const MN=process.env.WALLET_MNEMONIC||'';let SENDER,SKEY='';
if(MN)({address:SENDER,senderKey:SKEY}=derive(MN));else{SENDER=process.env.XTRATA_SENDER_ADDRESS;if(!SENDER){console.error('Set WALLET_MNEMONIC or XTRATA_SENDER_ADDRESS');process.exit(2);}}

const hex=u8=>Buffer.from(u8).toString('hex');
const log=r=>console.log(JSON.stringify({ts:new Date().toISOString(),...r}));
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const chunkBytes=d=>{const o=[];for(let i=0;i<d.length;i+=CHUNK_SIZE)o.push(d.slice(i,i+CHUNK_SIZE));return o;};
const incHash=ch=>{let h=new Uint8Array(32);for(const c of ch){const m=new Uint8Array(h.length+c.length);m.set(h,0);m.set(c,h.length);h=sha256(m);}return h;};
function selfTest(){if(hex(incHash([new TextEncoder().encode('xtrata-method-v1')]))!==SELFTEST)throw new Error('hash self-test failed');}
async function ro(fn,a){return callReadOnlyFunction({contractAddress:CORE[0],contractName:CORE[1],functionName:fn,functionArgs:a,senderAddress:SENDER,network});}
async function quoteStaged(sz,nc){const t=cvToJSON(await ro('quote-inscription-fee',[uintCV(sz),uintCV(nc),uintCV(MODE_STAGED)])).value.value;return {beginFee:BigInt(t['begin-fee'].value),sealFee:BigInt(t['seal-fee'].value),totalFee:BigInt(t['total-fee'].value),batches:Number(t['upload-batches'].value)};}
async function idByHash(h){const j=cvToJSON(await ro('get-id-by-hash',[bufferCV(h)]));return j.value?BigInt(j.value.value):null;}
async function isPaused(){const j=cvToJSON(await ro('is-paused',[]));return (j.value?.value??j.value)===true;}
async function bal(){const d=await(await fetch(`${network.coreApiUrl}/extended/v1/address/${SENDER}/stx`)).json();return BigInt(d.balance||'0');}
async function wait(txid){const u=`${network.coreApiUrl}/extended/v1/tx/${txid}`;for(let i=0;i<120;i++){try{const d=await(await fetch(u)).json();if(d.tx_status==='success')return d;if(d.tx_status&&d.tx_status.startsWith('abort'))throw new Error('TX '+d.tx_status+': '+(d.tx_result?.repr||''));}catch(e){if(String(e).includes('TX abort'))throw e;}await sleep(10000);}throw new Error('not confirmed');}
const tidFrom=d=>{const r=d?.tx_result?.repr||'';const m=/token-id u(\d+)/.exec(r)||/\(ok u(\d+)\)/.exec(r);return m?m[1]:null;};

const principalCV=standardPrincipalCV;
async function getUploadIndex(h){
  const j=cvToJSON(await ro('get-upload-state',[bufferCV(h),principalCV(SENDER)]));
  if(!j.value) return null;                 // no session
  const t=j.value.value;
  return Number(t['current-index'].value);
}
async function send(fnName,args,postFee){
  const post = postFee!=null ? [makeStandardSTXPostCondition(SENDER,FungibleConditionCode.LessEqual,postFee)] : [];
  // omit `fee` so the SDK/node estimates it from the actual tx size (upload
  // batches are ~512 KB and need much larger fees than control-plane calls).
  const tx=await makeContractCall({contractAddress:CORE[0],contractName:CORE[1],functionName:fnName,functionArgs:args,senderKey:SKEY,network,postConditionMode:PostConditionMode.Deny,postConditions:post,anchorMode:AnchorMode.Any});
  const usedFee=BigInt(tx.auth.spendingCondition.fee.toString());
  if(usedFee>PER_TX_FEE_CAP) throw new Error(`${fnName} estimated fee ${usedFee} exceeds per-tx cap ${PER_TX_FEE_CAP} (raise LARGE_PER_TX_FEE_USTX if mempool is busy)`);
  if(spentMiner+usedFee>SESSION_BUDGET) throw new Error(`cumulative miner fees ${spentMiner+usedFee} would exceed session budget ${SESSION_BUDGET}`);
  spentMiner+=usedFee;
  const res=await broadcastTransaction(tx,network);
  if(res.error)throw new Error('broadcast '+fnName+': '+res.error+' '+(res.reason||''));
  const txid=res.txid||res; const d=await wait(txid); return {txid,d,fee:usedFee};
}
async function getOwner(id){const o=cvToJSON(await ro('get-owner',[uintCV(id)]));const v=o.value?.value;return v?(v.value??v):null;}
// NFT transfer (Allow mode: moving a specific token we intend to move). Fee auto-estimated + capped.
async function sendTransfer(fnName,args){
  const tx=await makeContractCall({contractAddress:CORE[0],contractName:CORE[1],functionName:fnName,functionArgs:args,senderKey:SKEY,network,postConditionMode:PostConditionMode.Allow,anchorMode:AnchorMode.Any});
  const usedFee=BigInt(tx.auth.spendingCondition.fee.toString());
  if(usedFee>PER_TX_FEE_CAP) throw new Error(`${fnName} fee ${usedFee} exceeds cap`);
  if(spentMiner+usedFee>SESSION_BUDGET) throw new Error('return transfers would exceed session budget');
  spentMiner+=usedFee;
  const res=await broadcastTransaction(tx,network);
  if(res.error)throw new Error('broadcast '+fnName+': '+res.error+' '+(res.reason||''));
  const txid=res.txid||res; await wait(txid); return txid;
}
async function stxRefund(to,amount){
  const tx=await makeSTXTokenTransfer({recipient:to,amount,senderKey:SKEY,network,anchorMode:AnchorMode.Any});
  const res=await broadcastTransaction(tx,network);
  if(res.error)throw new Error('broadcast refund: '+res.error+' '+(res.reason||''));
  const txid=res.txid||res; await wait(txid); return txid;
}
async function awaitParent(){
  log({event:'await-parent',parent:PARENT.toString(),
       action:`Sign in your wallet now: transfer(u${PARENT}, <your address>, '${SENDER}) on ${CORE[0]}.${CORE[1]}. Polling until received…`});
  for(;;){
    const owner=await getOwner(PARENT);
    if(owner===SENDER){log({event:'parent-received',parent:PARENT.toString()});return;}
    log({event:'await-parent-poll',currentOwner:owner});
    await sleep(15000);
  }
}

async function main(){
  selfTest();
  const data=new Uint8Array(fs.readFileSync(FILE));
  const chunks=chunkBytes(data); const total=chunks.length; const h=incHash(chunks); const fh=hex(h);
  if(total<1){console.error('empty file');process.exit(2);}
  if(total>MAX_TOTAL_CHUNKS){console.error(`too big: ${total} chunks > ${MAX_TOTAL_CHUNKS} (32 MiB)`);process.exit(2);}
  if(total<=32) log({event:'note',msg:'<=32 chunks: single-tx route (agent-large not needed) would be cheaper'});
  const exists=await idByHash(h);
  if(exists!==null){log({event:'already-inscribed',tokenId:exists.toString(),hash:fh});return;}
  const q=await quoteStaged(BigInt(data.length),BigInt(total));
  const numBatches=Math.ceil(total/BATCH);
  const minerRough=BigInt(numBatches)*EST_BATCH_FEE+200000n;   // ROUGH: batches are ~512KB each; real fee estimated per-tx at runtime
  const grand=q.totalFee+minerRough;
  log({event:'plan',file:FILE,mime:MIME,uri:URI,bytes:data.length,chunks:total,batches:numBatches,
       beginFee:q.beginFee.toString(),sealFee:q.sealFee.toString(),protocolTotal:q.totalFee.toString(),
       minerRough:minerRough.toString(),grandRough:grand.toString(),
       feeNote:'miner fees auto-estimated per tx at runtime; upload batches are large and cost more than this rough projection',
       parent:PARENT?PARENT.toString():null,deps:DEPS.map(String),deliverTo:DELIVER_TO});
  if(PARENT!==null){
    const owner=await getOwner(PARENT);
    if(owner===SENDER) log({event:'parent-ok',parent:PARENT.toString(),owner});
    else if(ESCROW) log({event:'parent-pending',parent:PARENT.toString(),owner,note:'escrow: will request the transfer and await it just before seal'});
    else { log({event:'parent-not-owned',parent:PARENT.toString(),owner,need:SENDER,action:`send parent NFT #${PARENT} to ${SENDER}, then re-run (or set LARGE_ESCROW=1)`}); if(!DRY_RUN) process.exit(7); }
  }
  try{if(await isPaused()){log({event:'abort',reason:'paused'});process.exit(4);}}catch(e){log({event:'paused-err',error:String(e)});}
  if(grand>SESSION_BUDGET){log({event:'abort',reason:'exceeds budget',grandTotal:grand.toString(),budget:SESSION_BUDGET.toString()});if(!DRY_RUN)process.exit(6);}
  try{const b=await bal();log({event:'balance',balanceUstx:b.toString(),grandTotal:grand.toString()});if(!DRY_RUN&&b<grand)log({event:'balance-warning',detail:`balance ${b} < needed ${grand}`});}catch(e){log({event:'balance-err',error:String(e)});}
  let idx=await getUploadIndex(h);
  log({event:'resume-check',sessionExists:idx!==null,currentIndex:idx??0});
  if(DRY_RUN){log({event:'dry-run-complete'});return;}
  if(!SKEY){console.error('WALLET_MNEMONIC required');process.exit(2);}
  if(REQUIRE_CONFIRM){const rl=readline.createInterface({input:process.stdin,output:process.stdout});const a=await new Promise(r=>rl.question(`\nStaged inscribe ${path.basename(FILE)} — ${total} chunks / ${numBatches} batches, ~${grand} uSTX max, from ${SENDER}. Proceed? (yes/no) `,x=>{rl.close();r(x);}));if(a.trim().toLowerCase()!=='yes'){log({event:'aborted'});return;}}

  // 1) begin (skip if session already open)
  if(idx===null){
    const {txid}=await send('begin-or-get',[bufferCV(h),stringAsciiCV(MIME),uintCV(BigInt(data.length)),uintCV(BigInt(total))],q.beginFee);
    log({event:'began',txid}); idx=0;
  }
  // 2) upload loop from idx
  while(idx<total){
    const batch=chunks.slice(idx,idx+BATCH);
    const {txid,fee}=await send('add-chunk-batch',[bufferCV(h),listCV(batch.map(c=>bufferCV(c)))],null);
    const newIdx=await getUploadIndex(h);
    log({event:'batch',from:idx,to:newIdx,txid,fee:fee.toString(),spentMiner:spentMiner.toString()});
    if(newIdx===null||newIdx<=idx){throw new Error(`upload did not advance (idx ${idx} -> ${newIdx}); aborting`);}
    idx=newIdx;
  }
  // 3) seal
  let sealFn,sealArgs;
  if(PARENT!==null){
    let owner=await getOwner(PARENT);
    if(owner!==SENDER){ if(ESCROW) await awaitParent(); else throw new Error(`parent #${PARENT} not owned by ${SENDER} at seal (owner: ${owner||'none'})`); }
    sealFn='seal-with-relationships';sealArgs=[bufferCV(h),stringAsciiCV(URI),listCV(DEPS.map(d=>uintCV(d))),listCV([uintCV(PARENT)])];
  } else if(DEPS.length>0){
    sealFn='seal-recursive';sealArgs=[bufferCV(h),stringAsciiCV(URI),listCV(DEPS.map(d=>uintCV(d)))];
  } else {
    sealFn='seal-inscription';sealArgs=[bufferCV(h),stringAsciiCV(URI)];
  }
  const {txid:sealTx,d}=await send(sealFn,sealArgs,q.sealFee);
  const tokenId=tidFrom(d);
  log({event:'sealed',tokenId,txid:sealTx,hash:fh,uri:URI});
  const record={tokenId,sealTx,hash:fh,mime:MIME,bytes:data.length,chunks:total,parent:PARENT?PARENT.toString():null,dependencies:DEPS.map(String),minerSpent:spentMiner.toString()};

  // Escrow returns: parent home, child delivered, change refunded.
  if(ESCROW && RETURN_TO){
    const parentTx=await sendTransfer('transfer',[uintCV(PARENT),principalCV(SENDER),principalCV(RETURN_TO)]);
    log({event:'parent-returned',parent:PARENT.toString(),to:RETURN_TO,txid:parentTx});
    let childTx=null;
    if(tokenId){ childTx=await sendTransfer('transfer',[uintCV(BigInt(tokenId)),principalCV(SENDER),principalCV(RETURN_TO)]); log({event:'child-delivered',child:tokenId,to:RETURN_TO,txid:childTx}); }
    let refundTx=null;
    if(REFUND_USTX>0n){ refundTx=await stxRefund(RETURN_TO,REFUND_USTX); log({event:'change-refunded',amount:REFUND_USTX.toString(),to:RETURN_TO,txid:refundTx}); }
    record.escrow={returnedTo:RETURN_TO,parentReturnTx:parentTx,childDeliverTx:childTx,refundTx,refundUstx:REFUND_USTX.toString()};
    log({event:'receipt',parent:PARENT.toString(),child:tokenId,returnedTo:RETURN_TO,parentReturnTx:parentTx,childDeliverTx:childTx,refundTx,note:'inscribe as an XIP-011 type:receipt via agent-entry-inscribe to make it permanent'});
  }

  // Optional standalone delivery: transfer the freshly-minted inscription to another wallet.
  if(DELIVER_TO && !ESCROW && tokenId){
    const childTx=await sendTransfer('transfer',[uintCV(BigInt(tokenId)),principalCV(SENDER),principalCV(DELIVER_TO)]);
    record.deliveredTo=DELIVER_TO; record.deliverTx=childTx;
    log({event:'delivered',child:tokenId,to:DELIVER_TO,txid:childTx});
  }

  let map={};try{map=JSON.parse(fs.readFileSync('./large-map.json','utf8'));}catch{}
  map[URI]=record;
  fs.writeFileSync('./large-map.json',JSON.stringify(map,null,2));
  log({event:'done',tokenId,uri:URI,escrow:!!(ESCROW&&RETURN_TO)});
}
main().catch(e=>{log({event:'crash',error:String(e)});process.exit(1);});
