#!/usr/bin/env node
/**
 * xtrata-corpus-mint.mjs — generalised from xtrata-reader-mint.mjs.
 * Inscribe ANY corpus artifact (doc / manifest / reader) on xtrata-v3-2-3,
 * with the SAME safety model: dry-run by default, hash self-test, on-chain
 * fee quote + single-tx eligibility, pause/balance/budget checks, confirm
 * prompt, and an xtrata-corpus-map.json ledger entry.
 *
 * Adds two things the original lacked (needed for supersession updates):
 *   - MIME is configurable (docs=text/markdown, manifest=application/vnd.xtrata.manifest+json)
 *   - PARENTS support -> uses mint-single-tx-with-relationships when set.
 *
 * Env:
 *   WALLET_MNEMONIC        derive key + broadcast (omit for dry-run)
 *   XTRATA_SENDER_ADDRESS  sender for dry-run read-only calls
 *   XTRATA_NETWORK         mainnet|testnet (default mainnet)
 *   DRY_RUN                default 1 (set 0 to broadcast)
 *   REQUIRE_CONFIRM        default 1 (interactive yes/no before broadcast)
 *   MINT_FILE              artifact path (required)
 *   MINT_MIME             default text/html
 *   MINT_URI              token-uri string (<=256 ascii)
 *   MINT_DEPS             comma-sep dependency ids
 *   MINT_PARENTS          comma-sep parent ids (supersession; sender MUST OWN each)
 *   MINT_LEDGER_KEY       key under which to record in xtrata-corpus-map.json
 *   MINT_MAX_TX_FEE_USTX  default 50000
 *   MINT_SESSION_BUDGET_USTX default 400000
 */
import fs from 'node:fs';
import readline from 'node:readline';
import { sha256 } from '@noble/hashes/sha256';
import { bytesToHex } from '@noble/hashes/utils';
import { mnemonicToSeedSync } from '@scure/bip39';
import { HDKey } from '@scure/bip32';
import {
  makeContractCall, broadcastTransaction, callReadOnlyFunction,
  bufferCV, uintCV, stringAsciiCV, listCV, makeStandardSTXPostCondition,
  FungibleConditionCode, PostConditionMode, AnchorMode, cvToJSON,
  getAddressFromPrivateKey, TransactionVersion,
} from '@stacks/transactions';
import { StacksMainnet, StacksTestnet } from '@stacks/network';

const NET=(process.env.XTRATA_NETWORK||'mainnet').toLowerCase();
const network=NET==='testnet'?new StacksTestnet():new StacksMainnet();
const CORE=['SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X','xtrata-v3-2-3'];
const CHUNK_SIZE=16_384;
const FILE=process.env.MINT_FILE||process.env.READER_FILE||'./xtrata-xip-booklet-rich.html';
const URI=process.env.MINT_URI||process.env.READER_URI||'xtrata:xip/reader';
const MIME=process.env.MINT_MIME||'text/html';
const DEPS=(process.env.MINT_DEPS||process.env.READER_DEPS||'').split(',').map(s=>s.trim()).filter(Boolean).map(BigInt);
const PARENTS=(process.env.MINT_PARENTS||'').split(',').map(s=>s.trim()).filter(Boolean).map(BigInt);
const LEDGER_KEY=process.env.MINT_LEDGER_KEY||'reader';
const MAX_TX_FEE=BigInt(process.env.MINT_MAX_TX_FEE_USTX||process.env.READER_MAX_TX_FEE_USTX||'50000');
const SESSION_BUDGET=BigInt(process.env.MINT_SESSION_BUDGET_USTX||process.env.READER_SESSION_BUDGET_USTX||'400000');
const DRY_RUN=process.env.DRY_RUN!=='0';
const REQUIRE_CONFIRM=process.env.REQUIRE_CONFIRM!=='0';
const SELFTEST_HASH='d85faf0f9f48c46fdfc959def3e64ed9126ef62538fc5fd6c5f09e37ee25c64e';

function deriveStacksWallet(m){const seed=mnemonicToSeedSync(m.trim().replace(/,\s*/g,' '));const c=HDKey.fromMasterSeed(seed).derive("m/44'/5757'/0'/0/0");if(!c.privateKey)throw new Error('derivation failed');const k=bytesToHex(c.privateKey)+'01';return {senderKey:k,address:getAddressFromPrivateKey(k,NET==='testnet'?TransactionVersion.Testnet:TransactionVersion.Mainnet)};}
const MNEMONIC=process.env.WALLET_MNEMONIC||'';
let SENDER,SENDER_KEY='';
if(MNEMONIC)({address:SENDER,senderKey:SENDER_KEY}=deriveStacksWallet(MNEMONIC));
else{SENDER=process.env.XTRATA_SENDER_ADDRESS;if(!SENDER){console.error('Set WALLET_MNEMONIC or XTRATA_SENDER_ADDRESS');process.exit(2);}}

const hex=u8=>Buffer.from(u8).toString('hex');
const log=r=>console.log(JSON.stringify({ts:new Date().toISOString(),...r}));
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
function chunkBytes(d){const o=[];for(let i=0;i<d.length;i+=CHUNK_SIZE)o.push(d.slice(i,i+CHUNK_SIZE));return o;}
function incHash(chunks){let h=new Uint8Array(32);for(const c of chunks){const m=new Uint8Array(h.length+c.length);m.set(h,0);m.set(c,h.length);h=sha256(m);}return h;}
function selfTest(){if(hex(incHash([new TextEncoder().encode('xtrata-method-v1')]))!==SELFTEST_HASH)throw new Error('hash self-test failed');}
async function callReadOnly(fn,args){return callReadOnlyFunction({contractAddress:CORE[0],contractName:CORE[1],functionName:fn,functionArgs:args,senderAddress:SENDER,network});}
async function quote(sz,nc){const t=cvToJSON(await callReadOnly('quote-single-tx-fee',[uintCV(sz),uintCV(nc)])).value.value;return {totalFee:BigInt(t['total-fee'].value),eligible:t['single-tx-eligible'].value===true};}
async function isPaused(){const j=cvToJSON(await callReadOnly('is-paused',[]));return (j.value?.value??j.value)===true;}
async function ownerOf(id){try{const j=cvToJSON(await callReadOnly('get-owner',[uintCV(id)]));const v=j.value?.value?.value??j.value?.value??null;return typeof v==='string'?v:(v?.value??null);}catch(e){return null;}}
async function getBalance(){const d=await(await fetch(`${network.coreApiUrl}/extended/v1/address/${SENDER}/stx`)).json();return BigInt(d.balance||'0');}
async function waitForConfirmation(txid){const url=`${network.coreApiUrl}/extended/v1/tx/${txid}`;for(let i=0;i<90;i++){try{const d=await(await fetch(url)).json();if(d.tx_status==='success')return d;if(d.tx_status&&d.tx_status.startsWith('abort'))throw new Error(`TX ${d.tx_status}: ${d.tx_result?.repr||''}`);}catch(e){if(String(e).includes('TX abort'))throw e;}await sleep(10000);}throw new Error('not confirmed');}
const tokenIdFromTx=d=>{const m=/token-id u(\d+)/.exec(d?.tx_result?.repr||'');return m?m[1]:null;};

async function main(){
  selfTest();
  if(!fs.existsSync(FILE)){console.error('artifact not found: '+FILE);process.exit(2);}
  const bytes=new Uint8Array(fs.readFileSync(FILE));
  const chunks=chunkBytes(bytes); const h=incHash(chunks); const fh=hex(h);
  if(URI.length===0||URI.length>256||!/^[\x00-\x7F]*$/.test(URI)){console.error('bad token-uri');process.exit(2);}
  if(MIME.length>64){console.error('mime > 64');process.exit(2);}
  log({event:'artifact-built',file:FILE,bytes:bytes.length,chunks:chunks.length,inscriptionFinalHash:fh,mime:MIME,tokenUri:URI,dependencies:DEPS.map(String),parents:PARENTS.map(String),ledgerKey:LEDGER_KEY});
  if(MNEMONIC&&process.env.XTRATA_SENDER_ADDRESS&&process.env.XTRATA_SENDER_ADDRESS!==SENDER){console.error(`Address mismatch ${SENDER}`);process.exit(2);}
  try{if(await isPaused()){log({event:'abort',reason:'paused'});process.exit(4);}}catch(e){log({event:'paused-check-error',error:String(e)});}
  // parent-ownership pre-check (supersession requires sender to own each parent)
  for(const p of PARENTS){const o=await ownerOf(p);log({event:'parent-owner-check',parent:p.toString(),owner:o,ownedBySender:o===SENDER});if(o&&o!==SENDER&&!DRY_RUN){log({event:'abort',reason:'parent-not-owned-by-sender',parent:p.toString(),owner:o});process.exit(7);}}
  const {totalFee,eligible}=await quote(BigInt(bytes.length),BigInt(chunks.length));
  if(!eligible){log({event:'abort',reason:'not single-tx eligible',chunks:chunks.length});process.exit(5);}
  const maxTotal=totalFee+MAX_TX_FEE;
  log({event:'plan',fn:PARENTS.length>0?'mint-single-tx-with-relationships':(DEPS.length>0?'mint-single-tx-recursive':'mint-single-tx'),spendCap:totalFee.toString(),maxTxFee:MAX_TX_FEE.toString(),maxTotal:maxTotal.toString()});
  if(maxTotal>SESSION_BUDGET){log({event:'abort',reason:'exceeds budget',maxTotal:maxTotal.toString(),budget:SESSION_BUDGET.toString()});if(!DRY_RUN)process.exit(6);}
  try{const bal=await getBalance();log({event:'balance',balanceUstx:bal.toString()});if(!DRY_RUN&&bal<maxTotal)log({event:'balance-warning',detail:`balance ${bal} < ${maxTotal}`});}catch(e){log({event:'balance-error',error:String(e)});}
  if(DRY_RUN){log({event:'dry-run-complete',note:'no broadcast'});return;}
  if(!SENDER_KEY){console.error('WALLET_MNEMONIC required to spend');process.exit(2);}
  if(REQUIRE_CONFIRM){const rl=readline.createInterface({input:process.stdin,output:process.stdout});const a=await new Promise(r=>rl.question(`\nInscribe ${LEDGER_KEY} on ${NET}? mime=${MIME} uri=${URI} deps=${DEPS.map(String).join(',')||'-'} parents=${PARENTS.map(String).join(',')||'-'} cap=${maxTotal} uSTX (yes/no) `,x=>{rl.close();r(x);}));if(a.trim().toLowerCase()!=='yes'){log({event:'aborted-by-user'});return;}}
  let fn,args;
  const base=[bufferCV(h),stringAsciiCV(MIME),uintCV(BigInt(bytes.length)),listCV(chunks.map(c=>bufferCV(c))),stringAsciiCV(URI)];
  if(PARENTS.length>0){fn='mint-single-tx-with-relationships';args=[...base,listCV(DEPS.map(id=>uintCV(id))),listCV(PARENTS.map(id=>uintCV(id)))];}
  else if(DEPS.length>0){fn='mint-single-tx-recursive';args=[...base,listCV(DEPS.map(id=>uintCV(id)))];}
  else{fn='mint-single-tx';args=base;}
  const tx=await makeContractCall({contractAddress:CORE[0],contractName:CORE[1],functionName:fn,functionArgs:args,senderKey:SENDER_KEY,network,fee:MAX_TX_FEE,postConditionMode:PostConditionMode.Deny,postConditions:[makeStandardSTXPostCondition(SENDER,FungibleConditionCode.LessEqual,totalFee)],anchorMode:AnchorMode.Any});
  const res=await broadcastTransaction(tx,network);
  if(res.error)throw new Error(`broadcast: ${res.error} ${res.reason||''}`);
  const txid=res.txid||res; const d=await waitForConfirmation(txid); const tokenId=tokenIdFromTx(d);
  let map={};try{map=JSON.parse(fs.readFileSync('./xtrata-corpus-map.json','utf8'));}catch{}
  map[LEDGER_KEY]={tokenId,txid,hash:fh,uri:URI,mime:MIME,dependencies:DEPS.map(String),parents:PARENTS.map(String)};
  fs.writeFileSync('./xtrata-corpus-map.json',JSON.stringify(map,null,2));
  log({event:'minted',ledgerKey:LEDGER_KEY,tokenId,txid,dependencies:DEPS.map(String),parents:PARENTS.map(String)});
}
main().catch(e=>{log({event:'crash',error:String(e)});process.exit(1);});
