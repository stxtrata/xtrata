import {AsyncLocalStorage} from 'node:async_hooks';
const playbackRetryScope=new AsyncLocalStorage();
export const serviceRetryDelay=attempt=>Math.min(60000,5000*2**Math.min(attempt,4));
export function waitForPlaybackRetry(ms,signal){return new Promise((resolve,reject)=>{const cancel=()=>{clearTimeout(timer);signal?.removeEventListener('abort',cancel);reject(Error('Song ended or support stopped. No new payment will be sent.'));};const timer=setTimeout(()=>{signal?.removeEventListener('abort',cancel);resolve();},Math.min(ms,2147483647));signal?.addEventListener('abort',cancel,{once:true});if(signal?.aborted)cancel();});}
import {uniqueListenReceipt} from '../../public/radio/paid-receipt.mjs';
/** Local-only radio wizard. Secrets never cross the HTTP boundary. */
import { randomBytes, createCipheriv, createDecipheriv, createHash } from 'node:crypto';
import { mkdir, readFile, writeFile, rename, open, unlink, stat } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { killSwitchEngaged } from './inscribe.mjs';
const require = createRequire(import.meta.url);
const T = require('@stacks/transactions');
const { StacksMainnet } = require('@stacks/network');
const OWNER='SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X', NAME='xtrata-radio-plays-v1-0';
export const BUMP_AFTER_MS=180000;
const HASH='b81f1a0e1de406102e739f78d200041a270f498edab1bb3320aec54f33cbbbe1';
const WINDOWS_VAULT_SCHEME='windows-dpapi-v1', LOCK_VERSION=1, LOCK_STALE_MS=120000;
const sha = s => createHash('sha256').update(s).digest('hex');
export function publicEntry(entry){
 const allowed=['playbackId','createdAt','address','core','song','fee','receipt','recipient','txid','status','title','artist','nonce','bytes','feeChosen','feeReason','feeEstimates','submittedAt','confirmedAt','blockHeight','confirmationSeconds','rejectionReason','failedAt','failureStatus','failedTxid','confirmedTxid','actualFee','recoveryNonce','recoveryAt','resendAttempts','lastResendAt','mode','amount','kind','feeCap'];
 const result=Object.fromEntries(allowed.filter(k=>entry[k]!==undefined).map(k=>[k,entry[k]]));
 if(entry.feeEstimates)result.feeEstimates=Object.fromEntries(['low','medium','high','fetchedAt'].filter(k=>entry.feeEstimates[k]!==undefined).map(k=>[k,entry.feeEstimates[k]]));
 if(entry.priorAttempts)result.priorAttempts=entry.priorAttempts.map(a=>Object.fromEntries(['txid','fee','submittedAt'].filter(k=>a[k]!==undefined).map(k=>[k,a[k]])));
 return result;
}
export function sizedPlayFee(transaction,chosenFee){
 const bytes=transaction.serialize().length;
 if(bytes!==257)throw Error('Unexpected play transaction size: '+bytes+' bytes; signing refused.');
 if(!Number.isSafeInteger(chosenFee)||chosenFee<1||chosenFee>1000)throw Error('Invalid chosen network fee.');
 return {bytes,fee:Math.max(chosenFee,bytes)};
}
export function policy(p) {
  if (!Number.isInteger(p.core)||p.core<1||p.core>3||!Number.isSafeInteger(p.song)||p.song<0||!Number.isInteger(p.fee)||p.fee<1||p.fee>1000||!Number.isInteger(p.count)||p.count<1||p.count>5) throw Error('Use core 1–3, an integer song ID, fee 1–1000 microSTX and 1–5 tests.');
  if ((p.fee+50)*p.count>5000) throw Error('Run exceeds 0.005 STX ceiling.');
  return p;
}
export class RadioWizard {
 constructor(directory, request=fetch, options={}) {
  this.queuedPaidStarts=options.queuedPaidStarts===true;this.maxPending=options.maxPending??5;if(!Number.isInteger(this.maxPending)||this.maxPending<1||this.maxPending>20)throw Error('Pending limit must be 1–20.');
  this.dir=directory;this.request=request;this.running=false;this.stopped=false;this.stopEpoch=0;this.session=randomBytes(16).toString('hex');this.message='Idle. No payments authorised.';
  this.platform=options.platform||process.platform;this.vaultProtector=options.vaultProtector||null;
  this.now=options.now||Date.now;this.pid=options.pid||process.pid;this.lockStaleMs=options.lockStaleMs||LOCK_STALE_MS;this.canRecoverStaleLock=options.canRecoverStaleLock===true;
  this.isProcessAlive=options.isProcessAlive||((pid)=>{try{process.kill(pid,0);return true;}catch(error){if(error.code==='ESRCH')return false;throw error;}});
  this.storageFault=null;this.readIntervalMs=options.readIntervalMs??1000;this.apiPending=new Map();this.apiCache=new Map();this.apiTail=Promise.resolve();this.nextReadAt=0;this.cooldownUntil=0;this.rateFailures=0;this.balanceSnapshot=null;this.lastBalanceCheck=null;this.lastPassiveCheck=0;
 }
 async json(name) { return JSON.parse(await readFile(join(this.dir,name),'utf8')); }
 async save(name,v) {
  const path=join(this.dir,name),temporary=join(this.dir,'.'+name+'.'+this.pid+'.'+randomBytes(8).toString('hex')+'.tmp');let file;
  try {
   file=await open(temporary,'wx',0o600);await file.writeFile(JSON.stringify(v));await file.sync();await file.close();file=null;
   // Rename is an atomic replacement on the local filesystem. A failed write
   // leaves the last complete record in place and blocks any new spending.
   await rename(temporary,path);
   // Flush the committed record too. POSIX additionally flushes the directory
   // entry; Windows does not expose a directory fsync through Node, so it uses
   // NTFS's atomic rename together with a second file flush.
   // Windows FlushFileBuffers requires a handle with write access.
   const committed=await open(path,this.platform==='win32'?'r+':'r');try{await committed.sync();}finally{await committed.close();}
   if(this.platform!=='win32'){
    const directory=await open(this.dir,'r');try{await directory.sync();}finally{await directory.close();}
   }
  }catch(error){
   try{await file?.close();}catch{/* The original error is the useful one. */}
   this.recordStorageFault(error);throw error;
  }
 }
 recordStorageFault(error){this.storageFault='Wallet storage needs attention: '+String(error?.message||error).slice(0,200);this.stopped=true;}
 ensureStorageHealthy(){if(this.storageFault)throw Error(this.storageFault);}
 guard() { this.ensureStorageHealthy();if(this.stopped||killSwitchEngaged())throw Error('Wizard stopped by operator or kill switch.'); }
 async recoverStaleLock(path){
  let lock,info;
  try{[lock,info]=await Promise.all([readFile(path,'utf8'),stat(path)]);}catch(error){if(error.code==='ENOENT')return true;throw error;}
  let record;try{record=JSON.parse(lock);}catch{throw Error('A wallet lock is unreadable. Spending remains disabled until it is inspected.');}
  if(!record||record.version!==LOCK_VERSION||!Number.isInteger(record.pid)||record.pid<1||!Number.isFinite(record.createdAt))throw Error('A wallet lock is invalid. Spending remains disabled until it is inspected.');
  if(this.now()-record.createdAt<this.lockStaleMs||info.size>1024)throw Error('Another operation holds the wallet lock. Wait for it to finish.');
  let alive;try{alive=this.isProcessAlive(record.pid);}catch{throw Error('The existing wallet lock could not be verified. Spending remains disabled.');}
  if(alive)throw Error('Another operation holds the wallet lock. Wait for it to finish.');
  // A pathname lock cannot offer a cross-process compare-and-swap in Node.
  // Only Electron's already-held per-user single-instance guard permits this
  // conservative stale-lock cleanup; standalone callers fail closed instead.
  if(!this.canRecoverStaleLock)throw Error('A stale wallet lock was found. Spending remains disabled until the single app instance can recover it.');
  const quarantine=path+'.stale-'+record.pid+'-'+randomBytes(6).toString('hex');
  try{await rename(path,quarantine);return true;}catch(error){if(error.code==='ENOENT')return true;throw Error('A stale wallet lock could not be recovered. Spending remains disabled.');}
 }
 async acquireLock(name){
  const path=join(this.dir,name);
  for(let attempt=0;attempt<2;attempt++){
   let file;
   try{
    file=await open(path,'wx',0o600);const record={version:LOCK_VERSION,pid:this.pid,createdAt:this.now()};await file.writeFile(JSON.stringify(record));await file.sync();return {file,path};
   }catch(error){
    try{await file?.close();}catch{/* Preserve the lock write error. */}
    // A lock that could not be created, written or flushed may be a disk,
    // permission or interrupted-write fault.  Do not leave the wallet able to
    // guess at a later spend; any partial lock stays for conservative review.
    if(error.code!=='EEXIST'){
     this.recordStorageFault(error);
     throw Error('Wallet lock could not be written. Spending has been disabled.');
    }
    await this.recoverStaleLock(path);
   }
  }
  throw Error('Another operation holds the wallet lock. Wait for it to finish.');
 }
 async releaseLock(lock){
  try{await lock.file.close();await unlink(lock.path);}catch(error){this.recordStorageFault(error);throw Error('Wallet lock cleanup failed. Spending has been disabled.');}
 }
 async setup() {
  await mkdir(this.dir,{recursive:true,mode:0o700});
  const lock=await this.acquireLock('setup.lock');
  try {
   try {
    const v=await this.json('vault.json');
    if(!v||typeof v.address!=='string'||!T.validateStacksAddress(v.address))throw Error('Wallet data is invalid. It was not replaced.');
    if(this.platform==='win32'&&v.scheme!==WINDOWS_VAULT_SCHEME)throw Error('A legacy wallet was found. It was not migrated or replaced; recover or return it using the original app before using this Windows preview.');
    if(v.scheme===WINDOWS_VAULT_SCHEME&&(!this.vaultProtector||this.vaultProtector.scheme!==WINDOWS_VAULT_SCHEME))throw Error('This protected wallet can only be opened by Xtrata Music on Windows. It was not replaced.');
    // A syntactically valid DPAPI record can still be unreadable for this
    // Windows user. Verify it during startup so the UI cannot invite support
    // approval and repeatedly fail later starts from an unavailable wallet.
    if(this.platform==='win32')await this.key();
    return {address:v.address};
   } catch(e) { if(e.code!=='ENOENT')throw e; }
   this.guard();
   const key=randomBytes(32).toString('hex')+'01', address=T.getAddressFromPrivateKey(key,T.TransactionVersion.Mainnet);
   if(this.platform==='win32'){
    if(!this.vaultProtector||this.vaultProtector.scheme!==WINDOWS_VAULT_SCHEME)throw Error('Windows protected storage is unavailable. Xtrata Music will not create a spending wallet without DPAPI.');
    const protectedKey=await this.vaultProtector.protect(key);
    await this.save('vault.json',{version:2,scheme:WINDOWS_VAULT_SCHEME,address,protectedKey});
    return {address};
   }
   const wrapping=randomBytes(32),iv=randomBytes(12),cipher=createCipheriv('aes-256-gcm',wrapping,iv);cipher.setAAD(Buffer.from(address));
   const encrypted=Buffer.concat([cipher.update(key,'utf8'),cipher.final()]);
   // Refuse overwrite, including after partial setup. Operator must inspect an interrupted setup.
   await writeFile(join(this.dir,'unlock.key'),wrapping,{flag:'wx',mode:0o600});
   await writeFile(join(this.dir,'vault.json'),JSON.stringify({address,iv:iv.toString('hex'),tag:cipher.getAuthTag().toString('hex'),encrypted:encrypted.toString('hex')}),{flag:'wx',mode:0o600});
   return {address};
  } finally {await this.releaseLock(lock);}
 }
 async key() {
  const v=await this.json('vault.json');let key;
  if(v.scheme===WINDOWS_VAULT_SCHEME){
   if(this.platform!=='win32'||!this.vaultProtector||this.vaultProtector.scheme!==WINDOWS_VAULT_SCHEME)throw Error('This protected wallet can only be opened by Xtrata Music on Windows. It was not replaced.');
   const opened=await this.vaultProtector.unprotect(v.protectedKey);key=opened.secret;
   if(opened.reprotected){await this.save('vault.json',{...v,protectedKey:opened.reprotected});}
  }else{
   if(this.platform==='win32')throw Error('A legacy wallet cannot be opened by this Windows preview. It was not replaced.');
   const d=createDecipheriv('aes-256-gcm',await readFile(join(this.dir,'unlock.key')),Buffer.from(v.iv,'hex'));d.setAAD(Buffer.from(v.address));d.setAuthTag(Buffer.from(v.tag,'hex'));key=Buffer.concat([d.update(Buffer.from(v.encrypted,'hex')),d.final()]).toString('utf8');
  }
  if(T.getAddressFromPrivateKey(key,T.TransactionVersion.Mainnet)!==v.address||v.address===OWNER)throw Error('Wizard identity mismatch.');return key;
 }
 rateLimitError(){const e=Error('Chain service is busy. Checks paused for '+Math.max(1,Math.ceil((this.cooldownUntil-this.now())/1000))+' seconds; listening continues free.');e.status=429;return e;}
 async api(path,options={}) {
  const context=playbackRetryScope.getStore();
  for(let attempt=0;;attempt++){
   try{return await this.apiOnce(path,options);}catch(error){
    if(error.status!==503||!context?.retrySignal)throw error;
    if(context.retrySignal.aborted)throw Error('Song ended or support stopped. No new payment will be sent.');
    context.authorised?.();
    const delay=Math.max(serviceRetryDelay(attempt),error.retryAfterMs||0);
    context.onServiceRetry?.(delay);
    await waitForPlaybackRetry(delay,context.retrySignal);
    context.authorised?.();
   }
  }
 }
 async apiOnce(path,options={}) {
  const {cacheMs=0,...requestOptions}=options;
  const read=(requestOptions.method||'GET')==='GET'||path.startsWith('/v2/contracts/call-read/')||path==='/v2/fees/transaction';
  const key=path+'|'+String(requestOptions.body||'');
  const ttl=path.includes('/contracts/source/')?3600000:path==='/v2/info'?300000:cacheMs;
  const cached=this.apiCache.get(key);if(read&&cached&&cached.until>this.now())return structuredClone(cached.value);
  if(this.now()<this.cooldownUntil)throw this.rateLimitError();
  if(read&&this.apiPending.has(key))return structuredClone(await this.apiPending.get(key));
  const perform=async()=>{
   if(this.now()<this.cooldownUntil)throw this.rateLimitError();
   const r=await this.request('https://api.hiro.so'+path,{...requestOptions,signal:playbackRetryScope.getStore()?.retrySignal?AbortSignal.any([AbortSignal.timeout(20000),playbackRetryScope.getStore().retrySignal]):AbortSignal.timeout(20000),headers:{...(process.env.HIRO_API_KEY?{'x-api-key':process.env.HIRO_API_KEY}:{}),...requestOptions.headers}});
   if(r.status===429){
    this.rateFailures++;const retry=r.headers?.get?.('retry-after');const seconds=retry&&/^\d+(?:\.\d+)?$/.test(retry)?Number(retry):NaN;
    const requested=Number.isFinite(seconds)?seconds*1000:retry?Date.parse(retry)-this.now():0;
    const delay=Math.max(Number.isFinite(requested)?requested:0,Math.min(300000,30000*2**Math.min(this.rateFailures-1,4)));
    this.cooldownUntil=Math.max(this.cooldownUntil,this.now()+delay);throw this.rateLimitError();
   }
   if(!r.ok){let reason='';try{const body=await r.json();if(typeof (body.reason||body.error)==='string'&&/^[A-Za-z0-9_]{1,64}$/.test(body.reason||body.error))reason=body.reason||body.error;}catch{}const e=Error('Chain request failed: HTTP '+r.status+(reason?' ('+reason+')':''));e.status=r.status;e.reason=reason;if(r.status===503){const h=r.headers?.get?.('retry-after');const ms=h&&/^\d+(?:\.\d+)?$/.test(h)?Number(h)*1000:Date.parse(h)-this.now();e.retryAfterMs=Number.isFinite(ms)?Math.max(0,ms):0;}throw e;}
   const value=await r.json();this.rateFailures=0;if(read&&ttl){for(const [k,v] of this.apiCache)if(v.until<=this.now())this.apiCache.delete(k);if(this.apiCache.size>=128)this.apiCache.delete(this.apiCache.keys().next().value);this.apiCache.set(key,{until:this.now()+ttl,value});}return value;
  };
  // Never queue a signed submission: its caller has just checked consent.
  if(!read){for(const k of this.apiCache.keys())if(!k.includes('/contracts/source/')&&!k.startsWith('/v2/info|'))this.apiCache.delete(k);return perform();}
  const task=this.apiTail.catch(()=>{}).then(async()=>{
   if(this.now()<this.cooldownUntil)throw this.rateLimitError();
   const delay=this.nextReadAt-this.now();if(delay>0)await new Promise(r=>setTimeout(r,delay));
   this.nextReadAt=this.now()+this.readIntervalMs;return perform();
  });
  this.apiPending.set(key,task);this.apiTail=task.catch(()=>{});
  try{return structuredClone(await task);}finally{this.apiPending.delete(key);}
 }

 async estimatePlayFee(tx){
  if(this.feeEstimateTask)return this.feeEstimateTask;
  if(this.feeEstimateCheckedAt!==undefined&&this.now()-this.feeEstimateCheckedAt<60000)return this.feeEstimate&&this.now()-this.feeEstimate.fetchedAt<600000?this.feeEstimate:null;
  const task=(async()=>{
   this.feeEstimateCheckedAt=this.now();
   try{
    let values;
    try{const result=await this.api('/v2/fees/transaction',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({transaction_payload:Buffer.from(T.serializePayload(tx.payload)).toString('hex'),estimated_len:257})});values=result.estimations?.map(e=>Math.ceil(e.fee));}
    catch(error){if(error.reason!=='NoEstimateAvailable')throw error;const rate=await this.api('/v2/fees/transfer');if(!Number.isFinite(rate)||rate<0)throw Error('Invalid transfer estimate');values=Array(3).fill(Math.ceil(rate*257));}
    if(!Array.isArray(values)||values.length!==3||values.some(v=>!Number.isSafeInteger(v)||v<0))throw Error('Invalid fee estimate');
    const [low,medium,high]=values;this.feeEstimate={low,medium,high,fetchedAt:this.now()};return this.feeEstimate;
   }catch{if(this.feeEstimate&&this.now()-this.feeEstimate.fetchedAt<600000)return this.feeEstimate;return null;}
  })();this.feeEstimateTask=task;
  try{return await task;}finally{this.feeEstimateTask=null;}
 }
 async choosePlayFee(tx,cap){
  if(!Number.isInteger(cap)||cap<257||cap>1000)throw Error('Invalid network fee cap.');
  sizedPlayFee(tx,257);const estimates=await this.estimatePlayFee(tx),fee=Math.max(257,estimates?.low??257);
  if(fee>cap)throw Error('Network busy — this listen stays free');
  return {fee,estimates,reason:fee===257?'floor':'estimate'};
 }
 async bumpPending(log,approval){
  const e=this.pending(log)[0];if(!e||e.status!=='submitted'||!e.feeCap||e.listeningSession!==approval?.listeningSession||e.feeCap!==approval.feeCap||!Number.isFinite(Date.parse(e.submittedAt))||this.now()-Date.parse(e.submittedAt)<BUMP_AFTER_MS||(e.priorAttempts?.length||0)>=2)return;
  approval.authorised();this.guard();
  const visible=await this.api('/extended/v1/tx/'+e.txid);
  if(visible.tx_status!=='pending'||visible.tx_id!==e.txid||String(visible.nonce)!==e.nonce||visible.sender_address!==e.address||String(visible.fee_rate)!==String(e.fee))return;
  const tx=this.assertSavedPlay(e,e.address),estimates=await this.estimatePlayFee(tx);
  if(this.now()<this.cooldownUntil)throw this.rateLimitError();
  const fee=Math.min(e.feeCap,Math.max(e.fee+1,Math.ceil(e.fee*1.5),estimates?.low??257));if(fee<=e.fee)return;
  approval.authorised();
  await this.retryPreparedPlay(e.txid,fee,{...approval,estimates,log});
 }
 async read(fn,args=[]) {const r=await this.api(`/v2/contracts/call-read/${OWNER}/${NAME}/${fn}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sender:OWNER,arguments:args.map(T.cvToHex)})});if(!r.okay)throw Error('Contract read failed.');return T.cvToJSON(T.hexToCV(r.result));}
 async journal(){try{const log=await this.json('journal.json');if(!Array.isArray(log))throw Error('Invalid payment journal.');for(const e of log){if(e.raw){const nonce=T.deserializeTransaction(Buffer.from(e.raw,'hex')).auth.spendingCondition.nonce.toString();if(e.nonce!==undefined&&e.nonce!==nonce)throw Error('Saved nonce differs from signed payment.');e.nonce=nonce;}}return log;}catch(e){if(e.code==='ENOENT')return [];throw e;}}
 assertSavedPlay(e,address){
  if(!e.raw)throw Error('Saved payment bytes unavailable.');
  const tx=T.deserializeTransaction(Buffer.from(e.raw,'hex'));
  tx.verifyOrigin();const args=[T.uintCV(e.core),T.uintCV(e.song),T.bufferCV(Buffer.from(e.receipt,'hex'))];
  const pc=T.makeStandardSTXPostCondition(address,T.FungibleConditionCode.Equal,50n);
  if(e.address!==address||tx.auth.spendingCondition.signer!==T.createAddress(address).hash160||'0x'+tx.txid()!==e.txid||tx.version!==T.TransactionVersion.Mainnet||tx.chainId!==1||T.addressToString(tx.payload.contractAddress)!==OWNER||tx.payload.contractName.content!==NAME||tx.payload.functionName.content!=='play'||tx.payload.functionArgs.length!==3||args.some((a,i)=>T.cvToHex(a)!==T.cvToHex(tx.payload.functionArgs[i]))||tx.auth.spendingCondition.fee!==BigInt(e.fee)||tx.postConditionMode!==T.PostConditionMode.Deny||tx.postConditions.values.length!==1||Buffer.from(T.serializePostCondition(tx.postConditions.values[0])).toString('hex')!==Buffer.from(T.serializePostCondition(pc)).toString('hex'))throw Error('Saved payment identity mismatch.');
  return tx;
 }
 pending(log){return log.filter(e=>!['confirmed','failed'].includes(e.status)).sort((a,b)=>BigInt(a.nonce??0)<BigInt(b.nonce??0)?-1:1);}
 queueNonce(log,account,nonces){
  if(!Number.isSafeInteger(account.nonce)||account.nonce<0||!Number.isSafeInteger(nonces.possible_next_nonce)||!Array.isArray(nonces.detected_mempool_nonces)||!Array.isArray(nonces.detected_missing_nonces))throw Error('Chain nonce information is incomplete. This start stays free.');
  const chain=BigInt(account.nonce),known=new Map();
  for(const e of log){if(!e.raw||typeof e.nonce!=='string'||!/^\d+$/.test(e.nonce))throw Error('Saved payment nonce is unknown. Recovery required.');if(known.has(e.nonce))throw Error('Duplicate saved nonce. Recovery required.');known.set(e.nonce,e);}
  for(const n of [...nonces.detected_mempool_nonces,...nonces.detected_missing_nonces]){if(!Number.isSafeInteger(n)||n<0)throw Error('Invalid chain nonce.');if(BigInt(n)>=chain&&!known.has(String(n)))throw Error('Foreign or missing wallet nonce. This start stays free.');}
  if(nonces.detected_missing_nonces.some(n=>BigInt(n)>=chain))throw Error('Saved nonce gap needs recovery before another payment.');
  const pending=this.pending(log);if(pending.length>=this.maxPending)throw Error('Pending payment limit reached. This start stays free.');
  for(const e of pending)if(e.status!=='submitted'||BigInt(e.nonce)<chain||(e.resendAttempts||0)>=3)throw Error('Earlier payment is uncertain or needs recovery. This start stays free.');
  let next=chain;for(const n of known.keys())if(BigInt(n)>=next)next=BigInt(n)+1n;
  if(next-chain>BigInt(this.maxPending))throw Error('Saved nonce chain is too long.');
  for(let n=chain;n<next;n++){const e=known.get(String(n));if(!e||e.status!=='submitted')throw Error('Earlier nonce is missing or not accepted. This start stays free.');}
  if(BigInt(nonces.possible_next_nonce)>next||BigInt(nonces.possible_next_nonce)<chain)throw Error('Chain nonce disagrees with saved payments.');
  return next;
 }
 async submitNext(input,context){
  if(!this.queuedPaidStarts)throw Error('Queued paid starts are disabled.');
  if(input.count!==1||typeof context?.authorised!=='function'||!context.playbackId)throw Error('A queued payment requires current playback consent.');
  return this.run(input,{...context,submitOnly:true});
 }
 async status(chain=false) {
  const diskRunning=await stat(join(this.dir,'run.lock')).then(()=>true,e=>{if(e.code==='ENOENT')return false;throw e;});
  const {address}=await this.json('vault.json');let balance=null,recovery=null;
  if(chain){
   if(this.now()-this.lastBalanceCheck>=60000||this.lastBalanceCheck===null){
    this.lastBalanceCheck=this.now();
    try{const account=await this.api(`/v2/accounts/${address}?proof=0`,{cacheMs:30000});this.balanceSnapshot=BigInt(account.balance).toString();this.balanceStale=false;}
    catch(e){this.balanceStale=true;this.balanceError=e.status===429?e.message:'Balance unavailable. Showing the last known balance when available.';}
   }
   balance=this.balanceSnapshot;if(this.balanceStale)recovery=this.balanceError;
   // Payment reconciliation belongs to listening/confirmation, not balance refresh.
   if(!diskRunning&&!this.running&&this.now()-this.lastPassiveCheck>=60000){this.lastPassiveCheck=this.now();try{await this.exclusive(()=>this.reconcileReturns());}catch(e){recovery=e.message;}}
  }
  const log=await this.journal(),returns=await this.optional('returns.json',[]),quote=await this.optional('return-quote.json',null);
  return {address,balanceMicroSTX:balance,balanceStale:!!this.balanceStale,rateLimited:this.now()<this.cooldownUntil,overLimit:balance!==null&&BigInt(balance)>1000000n,
   running:this.running||diskRunning,stopped:this.stopped,recovery,
   message:this.storageFault||(diskRunning&&!this.running?'A backend operation holds the process lock.':this.message),
   spendCeilingMicroSTX:10000,entries:log.map(publicEntry),returns:returns.map(publicEntry),
   returnQuote:quote&&quote.expires>Date.now()&&quote.session===this.session&&quote.stopEpoch===this.stopEpoch?quote:null};
 }
 async optional(name,fallback){try{return await this.json(name);}catch(e){if(e.code==='ENOENT')return fallback;throw e;}}
 async exclusive(work){
  if(this.running)throw Error('An operation is active. Stop new payments and wait, then retry.');
  this.running=true;let lock,thrown;
  try{lock=await this.acquireLock('run.lock');return await work();}
  catch(e){thrown=e;throw e;}
  finally{this.running=false;if(lock){try{await this.releaseLock(lock);}catch(error){if(!thrown)throw error;}}}
 }
 async returnAccount(address,allowPending=false){
  const info=await this.api('/v2/info');if(info.network_id!==1)throw Error('Mainnet identity check failed.');
  const account=await this.api(`/v2/accounts/${address}?proof=0`),nonces=await this.api(`/extended/v1/address/${address}/nonces`);
  if(!Number.isSafeInteger(account.nonce)||account.nonce<0||(!allowPending&&(nonces.possible_next_nonce!==account.nonce||nonces.detected_missing_nonces?.length||nonces.detected_mempool_nonces?.length)))throw Error('A pending or conflicting payment must resolve before returning funds.');
  if(!/^(?:0x[0-9a-f]+|[0-9]+)$/i.test(account.balance))throw Error('Invalid chain balance.');
  return {balance:BigInt(account.balance),nonce:account.nonce};
 }
 returnAmount(mode,balance,fee){
  const amount=balance-BigInt(fee)-(mode==='excess'?1000000n:0n);
  if(amount<=0n)throw Error(mode==='excess'?'The excess cannot cover this network fee. Try Return all or cancel.':'The balance cannot cover this network fee.');
  return amount;
 }
 async prepareReturn(input){
  if(!input||Object.keys(input).sort().join(',')!=='fee,mode,recipient'||!['excess','all'].includes(input.mode)||!Number.isInteger(input.fee)||input.fee<1||input.fee>1000)throw Error('Choose Return excess or Return all and a fee of 1–1000 microSTX.');
  if(typeof input.recipient!=='string'||!T.validateStacksAddress(input.recipient)||![20,22].includes(T.createAddress(input.recipient).version))throw Error('Enter a valid Stacks mainnet return address.');
  // Stop the test loop first. A currently submitted payment is never cancelled.
  this.stop();
  return this.exclusive(async()=>{
   if(killSwitchEngaged())throw Error('Wizard kill switch is engaged.');
   const {address}=await this.json('vault.json');if(address===input.recipient)throw Error('Choose a different return address.');
   await this.reconcile(await this.journal());await this.reconcileReturns();
   const {balance,nonce}=await this.returnAccount(address);
   const quote={session:this.session,stopEpoch:this.stopEpoch,id:randomBytes(16).toString('hex'),mode:input.mode,recipient:input.recipient,fee:input.fee,
    amount:this.returnAmount(input.mode,balance,input.fee).toString(),balance:balance.toString(),nonce,address,
    remaining:input.mode==='excess'?'1000000':'0',expires:Date.now()+120000};
   await this.save('return-quote.json',quote);return quote;
  });
 }
 async cancelReturn(id){return this.exclusive(async()=>{
  const quote=await this.optional('return-quote.json',null);
  if(quote?.id!==id)throw Error('This return review is no longer current.');
  await this.save('return-quote.json',null);return {message:'Return cancelled. No transfer was sent. Tests remain stopped until explicitly approved.'};
 });}
 async confirmReturn(id){
  if(typeof id!=='string'||!/^[0-9a-f]{32}$/.test(id))throw Error('Invalid return request.');
  return this.exclusive(async()=>{
   const epoch=this.stopEpoch;
   this.ensureStorageHealthy();
   const log=await this.optional('returns.json',[]),existing=log.find(e=>e.id===id);
   if(existing)return publicEntry(existing);
   const q=await this.optional('return-quote.json',null);
   if(!q||q.id!==id||q.expires<=Date.now()||q.session!==this.session||q.stopEpoch!==this.stopEpoch)throw Error('Return review expired. Review the amount again.');
   if(killSwitchEngaged())throw Error('Wizard kill switch is engaged.');
   await this.reconcile(await this.journal());await this.reconcileReturns();
   const {address}=await this.json('vault.json'),account=await this.returnAccount(address);
   if(address!==q.address||account.balance.toString()!==q.balance||account.nonce!==q.nonce)throw Error('Balance or pending payments changed. Review the return again.');
   if(this.returnAmount(q.mode,account.balance,q.fee).toString()!==q.amount)throw Error('Return amount changed. Review again.');
   if(killSwitchEngaged()||epoch!==this.stopEpoch||q.expires<=Date.now())throw Error('Return stopped or review expired.');
   this.ensureStorageHealthy();
   const key=await this.key();if(epoch!==this.stopEpoch||killSwitchEngaged())throw Error('Recovery stopped before signing.');
   const tx=await T.makeSTXTokenTransfer({recipient:q.recipient,amount:BigInt(q.amount),fee:BigInt(q.fee),nonce:BigInt(q.nonce),
    network:new StacksMainnet(),memo:'Xtrata Music return',anchorMode:T.AnchorMode.Any,senderKey:key});
   if(killSwitchEngaged()||epoch!==this.stopEpoch||q.expires<=Date.now())throw Error('Return stopped or review expired.');
   const e={id:q.id,mode:q.mode,address,recipient:q.recipient,amount:q.amount,fee:q.fee,nonce:q.nonce,
    txid:'0x'+tx.txid(),raw:Buffer.from(tx.serialize()).toString('hex'),status:'prepared',createdAt:new Date().toISOString()};
   log.push(e);await this.save('returns.json',log);await this.save('return-quote.json',null);
   // Persist before submission. Any failure from this point remains uncertain.
   if(killSwitchEngaged()||epoch!==this.stopEpoch)throw Error('Return saved but stopped. Reconcile before any further transfer.');
   this.ensureStorageHealthy();
   const response=await this.api('/v2/transactions',{method:'POST',headers:{'Content-Type':'application/octet-stream'},body:Buffer.from(e.raw,'hex')});
   if(String(response).replace(/^0x/,'')!==tx.txid())throw Error('Unexpected submission response. Refresh to reconcile; do not create another return.');
   e.status='submitted';await this.save('returns.json',log);this.stopped=true;
   this.message='Return submitted. Refresh for confirmation. Tests remain stopped.';
   return publicEntry(e);
  });
 }
 async reconcileReturns(){
  const log=await this.optional('returns.json',[]);
  for(const e of log.filter(e=>!['confirmed','aborted'].includes(e.status))){
   let tx;try{tx=await this.api('/extended/v1/tx/'+e.txid);}catch(error){if(error.status===404)throw Error('A saved return is not visible yet. No new payment or replacement will be made.');throw error;}
   if(tx.canonical!==true||tx.is_unanchored!==false||!['success','abort_by_response','abort_by_post_condition'].includes(tx.tx_status))throw Error('A return is pending or uncertain. Wait and refresh before another payment.');
   if(tx.tx_id!==e.txid||tx.tx_type!=='token_transfer'||tx.sender_address!==e.address||tx.nonce!==e.nonce||String(tx.fee_rate)!==String(e.fee)||tx.token_transfer?.recipient_address!==e.recipient||String(tx.token_transfer?.amount)!==e.amount)throw Error('Return transaction identity mismatch.');
   e.status=tx.tx_status==='success'?'confirmed':'aborted';e.confirmedAt=new Date().toISOString();await this.save('returns.json',log);
  }
 }

 stop(){this.stopEpoch++;this.stopped=true;this.message='Stopped. Already submitted transactions may confirm.';}
 async retryPreparedPlay(txid,fee,automatic=null){
  if(typeof txid!=='string'||!/^0x[0-9a-f]{64}$/.test(txid)||!Number.isInteger(fee)||fee<1||fee>1000)throw Error('Invalid explicit recovery request.');
  const operation=async()=>{
   const check=()=>{if(automatic){automatic.authorised();this.guard();}if(this.now()<this.cooldownUntil)throw this.rateLimitError();};check();
   if(killSwitchEngaged())throw Error('Wizard kill switch is engaged.');
   this.ensureStorageHealthy();
   const epoch=this.stopEpoch;
   const log=automatic?.log||await this.journal(),e=log.find(row=>row.txid===txid);
   if(!e||!['prepared','submitted'].includes(e.status)||(e.priorAttempts?.length||0)>=(automatic?2:1)||fee<=e.fee)throw Error('Only a saved prepared attempt can be explicitly retried once at a higher fee.');
   if(automatic&&(e.status!=='submitted'||e.listeningSession!==automatic.listeningSession||e.feeCap!==automatic.feeCap||fee>e.feeCap))throw Error('Fee replacement has no matching approval.');
   if(this.pending(log)[0]!==e)throw Error('Another payment needs recovery first.');
   await this.reconcileReturns();
   const quote=await this.optional('return-quote.json',null);if(quote?.expires>Date.now())throw Error('Finish the return review first.');
   try{const visible=await this.api('/extended/v1/tx/'+txid);if(e.status!=='submitted'||visible.tx_status!=='pending')throw Error('Original transaction is visible. Reconcile it instead.');}catch(error){if(error.status!==404||automatic)throw error;}
   const {address}=await this.json('vault.json'),account=await this.returnAccount(address,true),old=this.assertSavedPlay(e,address);
   const nonces=await this.api(`/extended/v1/address/${address}/nonces`);
   if(automatic&&(!Number.isSafeInteger(nonces.possible_next_nonce)||!Array.isArray(nonces.detected_mempool_nonces)||!Array.isArray(nonces.detected_missing_nonces)))throw Error('Recovery nonce information is incomplete.');
   if([...nonces.detected_mempool_nonces||[],...nonces.detected_missing_nonces||[]].some(n=>!log.some(row=>row.nonce===String(n))))throw Error('Foreign recovery nonce.');
   const args=[T.uintCV(e.core),T.uintCV(e.song),T.bufferCV(Buffer.from(e.receipt,'hex'))];
   if(e.address!==address||old.txid()!==txid.slice(2)||old.version!==T.TransactionVersion.Mainnet||old.chainId!==1||
    T.addressToString(old.payload.contractAddress)!==OWNER||old.payload.contractName.content!==NAME||old.payload.functionName.content!=='play'||
    old.payload.functionArgs.length!==3||args.some((arg,i)=>T.cvToHex(arg)!==T.cvToHex(old.payload.functionArgs[i]))||
    old.auth.spendingCondition.nonce!==BigInt(account.nonce)||old.auth.spendingCondition.fee!==BigInt(e.fee))throw Error('Saved transaction or available nonce does not match the recovery request.');
   const receipt=await this.read('get-receipt',[T.standardPrincipalCV(address),args[2]]);
   if(receipt.type!=='(optional none)'||receipt.value!==null)throw Error('The play receipt already exists or could not be verified.');
   const source=await this.api(`/v2/contracts/source/${OWNER}/${NAME}?proof=0`);if(sha(source.source)!==HASH)throw Error('Deployed source differs from pinned helper.');
   if(account.balance<this.pending(log).reduce((sum,row)=>sum+BigInt(row===e?Math.max(fee,row.feeCap||0):(row.feeCap||row.fee))+50n,automatic?.continuous?0n:1000n))throw Error('Balance is outside supported recovery limits.');
   if(!automatic?.continuous&&log.reduce((total,row)=>total+(row.feeCap||row.fee)+50,0)-(e.feeCap||e.fee)+Math.max(fee,e.feeCap||0)>10000)throw Error('Recovery exceeds the lifetime test budget.');
   const owner=await this.read('get-owner',[args[0],args[1]]),recipient=owner?.success===true?owner.value?.value?.value:null;
   if(typeof recipient!=='string'||recipient.includes('.')||recipient===address)throw Error('Master owner is not eligible.');
   if(epoch!==this.stopEpoch||killSwitchEngaged())throw Error('Recovery stopped before signing.');
   this.ensureStorageHealthy();
   check();const info=await this.api('/v2/info');if(info.network_id!==1)throw Error('Mainnet identity check failed.');
   const key=await this.key();check();if(epoch!==this.stopEpoch||killSwitchEngaged())throw Error('Recovery stopped before signing.');
   const privateKey=T.createStacksPrivateKey(key),publicKey=T.publicKeyToString(T.getPublicKey(privateKey));
   const tx=await T.makeUnsignedContractCall({contractAddress:OWNER,contractName:NAME,functionName:'play',functionArgs:args,publicKey,network:new StacksMainnet(),
    fee:BigInt(fee),nonce:old.auth.spendingCondition.nonce,anchorMode:T.AnchorMode.Any,postConditionMode:T.PostConditionMode.Deny,
    postConditions:[T.makeStandardSTXPostCondition(address,T.FungibleConditionCode.Equal,50n)]});
   sizedPlayFee(tx,fee);check();if(epoch!==this.stopEpoch||killSwitchEngaged())throw Error('Recovery stopped before signing.');
   new T.TransactionSigner(tx).signOrigin(privateKey);
   if(epoch!==this.stopEpoch||killSwitchEngaged())throw Error('Recovery stopped before submission.');
   await this.save('recovery-original-'+txid.slice(2)+'.json',e);
   e.priorAttempts=[...(e.priorAttempts||[]),{txid:e.txid,fee:e.fee,raw:e.raw,submittedAt:e.submittedAt}];e.recoveryNonce=account.nonce;e.status='prepared';e.fee=fee;e.recipient=recipient;e.txid='0x'+tx.txid();e.raw=Buffer.from(tx.serialize()).toString('hex');e.recoveryAt=new Date(this.now()).toISOString();e.feeReason='bump';if(automatic)e.feeEstimates=automatic.estimates;
   await this.save('journal.json',log);
   if(epoch!==this.stopEpoch||killSwitchEngaged())throw Error('Recovery saved but stopped; reconcile before proceeding.');
   this.ensureStorageHealthy();check();
   let result;try{result=await this.api('/v2/transactions',{method:'POST',headers:{'Content-Type':'application/octet-stream'},body:Buffer.from(e.raw,'hex')});}catch(error){if(error.status>=400&&error.status<500){e.rejectionReason=error.reason||('HTTP '+error.status);await this.save('journal.json',log);}throw error;}
   if(String(result).replace(/^0x/,'')!==tx.txid())throw Error('Recovery submission outcome unknown. Do not retry automatically.');
   e.status='submitted';e.submittedAt=new Date(this.now()).toISOString();await this.save('journal.json',log);return publicEntry(e);
  };return automatic?operation():this.exclusive(operation);
 }
 // Caller must hold the operation lock and provide a current-session consent guard.
 // Reuses signed bytes; never signs, replaces fees, discards history or fills nonce gaps.
 async rebroadcastMissing(log, authorised) {
  const pending=this.pending(log);if(!pending.length)return;
  const e=pending[0];if(!e.raw)throw Error('Saved payment bytes unavailable.');
  const tries=e.resendAttempts||0;
  if(tries>=3)throw Error('Recovery retry limit reached. Copy the diagnostic report for Xtrata.');
  if(e.lastResendAt&&this.now()-e.lastResendAt<60000)return;
  const {address}=await this.json('vault.json'),tx=this.assertSavedPlay(e,address);
  const args=[T.uintCV(e.core),T.uintCV(e.song),T.bufferCV(Buffer.from(e.receipt,'hex'))];
  tx.verifyOrigin();
  if(tx.auth.spendingCondition.signer!==T.createAddress(address).hash160)throw Error('Saved payment signer mismatch.');
  if(e.address!==address||'0x'+tx.txid()!==e.txid||tx.version!==T.TransactionVersion.Mainnet||tx.chainId!==1||
   T.addressToString(tx.payload.contractAddress)!==OWNER||tx.payload.contractName.content!==NAME||tx.payload.functionName.content!=='play'||
   tx.payload.functionArgs.length!==3||args.some((a,i)=>T.cvToHex(a)!==T.cvToHex(tx.payload.functionArgs[i]))||
   tx.auth.spendingCondition.fee!==BigInt(e.fee))throw Error('Saved payment identity mismatch.');
  const info=await this.api('/v2/info');if(info.network_id!==1)throw Error('Mainnet identity check failed.');
  const account=await this.api(`/v2/accounts/${address}?proof=0`),nonces=await this.api(`/extended/v1/address/${address}/nonces`);
  if(!Number.isSafeInteger(account.nonce)||BigInt(account.nonce)!==tx.auth.spendingCondition.nonce||(nonces.detected_mempool_nonces||[]).some(n=>n===account.nonce||!pending.some(e=>e.nonce===String(n)))||(nonces.detected_missing_nonces||[]).some(n=>!pending.some(e=>e.nonce===String(n)&&e.raw)))throw Error('Recovery nonce is occupied or uncertain.');
  if(BigInt(account.balance)<pending.reduce((sum,e)=>sum+BigInt(e.fee)+50n,0n))throw Error('Insufficient funds to recover the saved payment.');
  const receipt=await this.read('get-receipt',[T.standardPrincipalCV(address),args[2]]);
  if(receipt?.type!=='(optional none)'||receipt.value!==null)throw Error('Saved payment receipt exists or cannot be verified.');
  // Recheck after asynchronous reads, including a confirmation during diagnosis.
  try{await this.api('/extended/v1/tx/'+e.txid);return;}catch(error){if(error.status!==404)throw error;}
  authorised();this.ensureStorageHealthy();if(killSwitchEngaged())throw Error('Wizard stopped by kill switch.');
  e.resendAttempts=tries+1;e.lastResendAt=this.now();await this.save('journal.json',log);
  authorised();this.ensureStorageHealthy();if(killSwitchEngaged())throw Error('Wizard stopped by kill switch.');
  const result=await this.api('/v2/transactions',{method:'POST',headers:{'Content-Type':'application/octet-stream'},body:Buffer.from(e.raw,'hex')});
  if(String(result).replace(/^0x/,'')!==tx.txid())throw Error('Recovery response uncertain. Checking the same transaction; no new payment created.');
  e.status='submitted';e.submittedAt=new Date(this.now()).toISOString();await this.save('journal.json',log);
 }
 async reconcile(log, authorised=null,approval=null) {
  let unresolved=null;const pending=this.pending(log);
  for(const e of pending) {
   const attempts=[{txid:e.txid,fee:e.fee},...(e.priorAttempts||[])];let found=null,failed=null,visible=false;
   for(const attempt of attempts){
    let tx;try{tx=await this.api('/extended/v1/tx/'+attempt.txid);}catch(error){if(error.status===404)continue;throw error;}
    visible=true;
    if(tx.tx_status==='success'&&tx.canonical===true&&tx.is_unanchored===false){found={tx,attempt};break;}
    if(['abort_by_response','abort_by_post_condition'].includes(tx.tx_status)&&tx.canonical===true&&tx.is_unanchored===false)failed={tx,attempt};
   }
   if(!found&&!failed){if(!visible&&authorised&&e===pending[0])await this.rebroadcastMissing(log,authorised);else if(visible&&approval&&e===pending[0])await this.bumpPending(log,approval);const error=Error(visible?'Checking an earlier payment on the network. Music continues free.':'Saved transaction not visible yet. Checking the earlier payment; music continues free.');error.code='PAYMENT_UNRESOLVED';unresolved=error;continue;}
   const {tx,attempt}=found||failed;
   if(tx.sender_address!==e.address||tx.contract_call?.contract_id!==OWNER+'.'+NAME||tx.contract_call?.function_name!=='play')throw Error('Transaction identity mismatch.');
   if(e.priorAttempts?.length&&(tx.tx_id!==attempt.txid||tx.nonce!==e.recoveryNonce||String(tx.fee_rate)!==String(attempt.fee)))throw Error('Recovered transaction identity mismatch.');
   if(failed&&!found){
    // A canonical abort is terminal evidence for this exact prepared payment.
    // It is retained as failed and never re-broadcast or replaced.
    e.status='failed';e.failedAt=new Date().toISOString();e.failureStatus=tx.tx_status;e.failedTxid=attempt.txid;e.actualFee=attempt.fee;await this.save('journal.json',log);continue;
   }
   const receipt=await this.read('get-receipt',[T.standardPrincipalCV(e.address),T.bufferCV(Buffer.from(e.receipt,'hex'))]);const r=receipt?.value?.value;
   if(receipt?.type==='(optional none)'&&receipt.value===null){const error=Error('Confirmed transaction is waiting for its play receipt to become available.');error.code='RECEIPT_PENDING';unresolved=error;continue;}
   if(r?.core?.value!==String(e.core)||r?.id?.value!==String(e.song))throw Error('Receipt verification failed.');
   e.status='confirmed';e.confirmedAt=new Date(this.now()).toISOString();e.blockHeight=tx.block_height??null;e.confirmationSeconds=e.submittedAt?Math.max(0,Math.floor((this.now()-Date.parse(e.submittedAt))/1000)):null;e.recipient=r.recipient.value;e.confirmedTxid=attempt.txid;e.actualFee=attempt.fee;await this.save('journal.json',log);
  }
  if(unresolved)throw unresolved;
 }
 async run(input,context={}) {
  return playbackRetryScope.run(context,()=>this.runOnce(input,context));
 }
 async runOnce(input,context={}) {
  if(context.submitOnly&&!this.queuedPaidStarts)throw Error('Queued paid starts are disabled.');if(this.running)throw Error('Runner already active.');policy(input);const chosenFee=context.feeCap?257:input.fee,p=policy({...input,fee:Math.max(input.fee,257)});this.running=true;this.stopped=false;
  let lock,thrown;
  try {
   lock=await this.acquireLock('run.lock');this.guard();const epoch=this.stopEpoch;const authorised=()=>{this.guard();if(epoch!==this.stopEpoch)throw Error('Payment stopped.');context.authorised?.();};authorised();
   const quote=await this.optional('return-quote.json',null);if(quote?.expires>Date.now())throw Error('Finish or cancel the pending return review first.');
   await this.reconcileReturns();const log=await this.journal();if(!context.submitOnly)await this.reconcile(log);
   if(context.playbackId){const existing=log.find(e=>e.playbackId===context.playbackId);if(existing)return publicEntry(existing);}
   if(!context.continuous&&log.reduce((s,e)=>s+(e.feeCap||e.fee)+50,0)+(p.fee+50)*p.count>10000)throw Error('Lifetime test ceiling of 0.01 STX reached.');
   const source=await this.api(`/v2/contracts/source/${OWNER}/${NAME}?proof=0`);if(sha(source.source)!==HASH)throw Error('Deployed source differs from pinned helper.');
   const info=await this.api('/v2/info');if(info.network_id!==1)throw Error('Mainnet identity check failed.');
   const key=await this.key(),{address}=await this.json('vault.json');
   for(let i=0;i<p.count;i++) {
    this.guard();const account=await this.api(`/v2/accounts/${address}?proof=0`),nonces=await this.api(`/extended/v1/address/${address}/nonces`);
    if(context.submitOnly)for(const entry of log)this.assertSavedPlay(entry,address);
    const head=this.pending(log)[0];if(context.feeCap&&head?.feeCap&&(head.listeningSession!==context.listeningSession||(head.priorAttempts?.length||0)>=2||head.fee>=head.feeCap))throw Error('Earlier payment needs recovery before another listen.');
    const nonce=context.submitOnly?this.queueNonce(log,account,nonces):BigInt(account.nonce);
    if(!context.submitOnly&&(!Number.isSafeInteger(account.nonce)||nonces.possible_next_nonce!==account.nonce||nonces.detected_missing_nonces?.length))throw Error('Conflicting or pending nonce.');
    const reserved=context.submitOnly?this.pending(log).reduce((sum,e)=>sum+BigInt(e.feeCap||e.fee)+50n,0n):0n;
    if(BigInt(account.balance)<reserved+BigInt(p.fee+50+(context.continuous?0:1000)))throw Error(context.continuous?'Insufficient confirmed balance for another paid start.':'Insufficient confirmed balance; retain 0.001 STX reserve.');
    const owner=await this.read('get-owner',[T.uintCV(p.core),T.uintCV(p.song)]);const recipient=owner?.success===true?owner.value?.value?.value:null;
    if(typeof recipient!=='string'||recipient.includes('.')||recipient===address)throw Error('Master missing, escrowed or held by payer.');
    let receipt;if(context.listen)receipt=uniqueListenReceipt(context.listen,log,randomBytes);else do{receipt=randomBytes(16).toString('hex');}while(log.some(e=>e.receipt===receipt));
    const privateKey=T.createStacksPrivateKey(key),publicKey=T.publicKeyToString(T.getPublicKey(privateKey));
    const tx=await T.makeUnsignedContractCall({contractAddress:OWNER,contractName:NAME,functionName:'play',functionArgs:[T.uintCV(p.core),T.uintCV(p.song),T.bufferCV(Buffer.from(receipt,'hex'))],publicKey,network:new StacksMainnet(),fee:BigInt(p.fee),nonce,anchorMode:T.AnchorMode.Any,postConditionMode:T.PostConditionMode.Deny,postConditions:[T.makeStandardSTXPostCondition(address,T.FungibleConditionCode.Equal,50n)]});
    const sized=sizedPlayFee(tx,chosenFee),choice=context.feeCap?await this.choosePlayFee(tx,context.feeCap):{fee:sized.fee,reason:'floor',estimates:null};p.fee=choice.fee;tx.setFee(BigInt(p.fee));if(this.now()<this.cooldownUntil)throw this.rateLimitError();authorised();
    new T.TransactionSigner(tx).signOrigin(privateKey);
    this.guard();const e={...(context.playbackId?{playbackId:context.playbackId,listeningSession:context.listeningSession,title:String(context.title||'').slice(0,200),artist:String(context.artist||'').slice(0,200)}:{}),createdAt:new Date().toISOString(),nonce:String(nonce),bytes:sized.bytes,feeChosen:chosenFee,feeReason:choice.reason,feeEstimates:choice.estimates,...(context.feeCap?{feeCap:context.feeCap}:{}),address,core:p.core,song:p.song,fee:p.fee,receipt,recipient,txid:'0x'+tx.txid(),raw:Buffer.from(tx.serialize()).toString('hex'),status:'prepared'};
    log.push(e);await this.save('journal.json',log);authorised();
    let result;try{result=await this.api('/v2/transactions',{method:'POST',headers:{'Content-Type':'application/octet-stream'},body:Buffer.from(e.raw,'hex')});}catch(error){if(error.status>=400&&error.status<500){e.rejectionReason=error.reason||('HTTP '+error.status);await this.save('journal.json',log);}throw error;}if(String(result).replace(/^0x/,'')!==tx.txid())throw Error('Unexpected broadcast response; reconcile before proceeding.');
    e.status='submitted';e.submittedAt=new Date(this.now()).toISOString();await this.save('journal.json',log);this.message='Submitted '+e.txid+'; waiting for confirmation.';
    if(context.submitOnly)return publicEntry(e);
    let confirmed=false;
    for(let attempt=0;attempt<20;attempt++){this.guard();await new Promise(r=>setTimeout(r,30000));try{await this.reconcile(log,authorised,context.feeCap?{...context,authorised}:null);confirmed=true;break;}catch(error){if(error.status!==429&&!['RECEIPT_PENDING','PAYMENT_UNRESOLVED'].includes(error.code)&&!/pending|not visible/.test(error.message))throw error;}}
    if(!confirmed)throw Error('Confirmation wait expired. No new payment sent.');
   }
   this.message='Run confirmed; receipts verified.';
  }catch(e){thrown=e;this.message=e.message;throw e;}finally{this.running=false;if(lock){try{await this.releaseLock(lock);}catch(error){if(!thrown)throw error;}}}
 }
}
