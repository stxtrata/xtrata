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
const HASH='b81f1a0e1de406102e739f78d200041a270f498edab1bb3320aec54f33cbbbe1';
const sha = s => createHash('sha256').update(s).digest('hex');
function publicEntry(entry){const result={...entry};delete result.raw;return result;}
export function policy(p) {
  if (!Number.isInteger(p.core)||p.core<1||p.core>3||!Number.isSafeInteger(p.song)||p.song<0||!Number.isInteger(p.fee)||p.fee<1||p.fee>1000||!Number.isInteger(p.count)||p.count<1||p.count>5) throw Error('Use core 1–3, an integer song ID, fee 1–1000 microSTX and 1–5 tests.');
  if ((p.fee+50)*p.count>5000) throw Error('Run exceeds 0.005 STX ceiling.');
  return p;
}
export class RadioWizard {
 constructor(directory, request=fetch) { this.dir=directory;this.request=request;this.running=false;this.stopped=false;this.stopEpoch=0;this.session=randomBytes(16).toString('hex');this.message='Idle. No payments authorised.'; }
 async json(name) { return JSON.parse(await readFile(join(this.dir,name),'utf8')); }
 async save(name,v) {
  const path=join(this.dir,name),file=await open(path+'.tmp','w',0o600);
  try {await file.writeFile(JSON.stringify(v));await file.sync();} finally {await file.close();}
  await rename(path+'.tmp',path);
  const directory=await open(this.dir,'r');try {await directory.sync();}finally{await directory.close();}
 }
 guard() { if(this.stopped||killSwitchEngaged())throw Error('Wizard stopped by operator or kill switch.'); }
 async setup() {
  await mkdir(this.dir,{recursive:true,mode:0o700});
  const lock=await open(join(this.dir,'setup.lock'),'wx',0o600);
  try {
   try { const v=await this.json('vault.json');return {address:v.address}; } catch(e) { if(e.code!=='ENOENT')throw e; }
   this.guard();
   const key=randomBytes(32).toString('hex')+'01', address=T.getAddressFromPrivateKey(key,T.TransactionVersion.Mainnet);
   const wrapping=randomBytes(32),iv=randomBytes(12),cipher=createCipheriv('aes-256-gcm',wrapping,iv);cipher.setAAD(Buffer.from(address));
   const encrypted=Buffer.concat([cipher.update(key,'utf8'),cipher.final()]);
   // Refuse overwrite, including after partial setup. Operator must inspect an interrupted setup.
   await writeFile(join(this.dir,'unlock.key'),wrapping,{flag:'wx',mode:0o600});
   await writeFile(join(this.dir,'vault.json'),JSON.stringify({address,iv:iv.toString('hex'),tag:cipher.getAuthTag().toString('hex'),encrypted:encrypted.toString('hex')}),{flag:'wx',mode:0o600});
   return {address};
  } finally {await lock.close();await unlink(join(this.dir,'setup.lock'));}
 }
 async key() { const v=await this.json('vault.json');const d=createDecipheriv('aes-256-gcm',await readFile(join(this.dir,'unlock.key')),Buffer.from(v.iv,'hex'));d.setAAD(Buffer.from(v.address));d.setAuthTag(Buffer.from(v.tag,'hex'));const key=Buffer.concat([d.update(Buffer.from(v.encrypted,'hex')),d.final()]).toString('utf8');if(T.getAddressFromPrivateKey(key,T.TransactionVersion.Mainnet)!==v.address||v.address===OWNER)throw Error('Wizard identity mismatch.');return key; }
 async api(path,options={}) { const r=await this.request('https://api.hiro.so'+path,{...options,signal:AbortSignal.timeout(20000),headers:{...(process.env.HIRO_API_KEY?{'x-api-key':process.env.HIRO_API_KEY}:{}),...options.headers}});if(!r.ok){let reason='';try{const body=await r.json();if(typeof body.reason==='string'&&/^[A-Za-z0-9_]{1,64}$/.test(body.reason))reason=body.reason;}catch{/* Keep only a bounded node reason code, never raw response data. */}const e=Error('Chain request failed: HTTP '+r.status+(reason?' ('+reason+')':''));e.status=r.status;e.reason=reason;throw e;}return r.json(); }
 async read(fn,args=[]) {const r=await this.api(`/v2/contracts/call-read/${OWNER}/${NAME}/${fn}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sender:OWNER,arguments:args.map(T.cvToHex)})});if(!r.okay)throw Error('Contract read failed.');return T.cvToJSON(T.hexToCV(r.result));}
 async journal(){try{return await this.json('journal.json');}catch(e){if(e.code==='ENOENT')return [];throw e;}}
 async status(chain=false) {
  const diskRunning=await stat(join(this.dir,'run.lock')).then(()=>true,e=>{if(e.code==='ENOENT')return false;throw e;});
  const {address}=await this.json('vault.json');let balance=null,recovery=null;
  if(chain){
   const account=await this.api(`/v2/accounts/${address}?proof=0`);balance=BigInt(account.balance).toString();
   if(!diskRunning&&!this.running){try{await this.exclusive(async()=>{await this.reconcile(await this.journal());await this.reconcileReturns();});}catch(e){recovery=e.message;}}
  }
  const log=await this.journal(),returns=await this.optional('returns.json',[]),quote=await this.optional('return-quote.json',null);
  return {address,balanceMicroSTX:balance,overLimit:balance!==null&&BigInt(balance)>1000000n,
   running:this.running||diskRunning,stopped:this.stopped,recovery,
   message:diskRunning&&!this.running?'A backend operation holds the process lock.':this.message,
   spendCeilingMicroSTX:10000,entries:log.map(publicEntry),returns:returns.map(publicEntry),
   returnQuote:quote&&quote.expires>Date.now()&&quote.session===this.session&&quote.stopEpoch===this.stopEpoch?quote:null};
 }
 async optional(name,fallback){try{return await this.json(name);}catch(e){if(e.code==='ENOENT')return fallback;throw e;}}
 async exclusive(work){
  if(this.running)throw Error('An operation is active. Stop new payments and wait, then retry.');
  this.running=true;let lock;
  try{lock=await open(join(this.dir,'run.lock'),'wx',0o600);return await work();}
  catch(e){if(e.code==='EEXIST')throw Error('Another operation holds the wallet lock. Wait for it to finish.');throw e;}
  finally{this.running=false;if(lock){await lock.close();await unlink(join(this.dir,'run.lock'));}}
 }
 async returnAccount(address){
  const info=await this.api('/v2/info');if(info.network_id!==1)throw Error('Mainnet identity check failed.');
  const account=await this.api(`/v2/accounts/${address}?proof=0`),nonces=await this.api(`/extended/v1/address/${address}/nonces`);
  if(!Number.isSafeInteger(account.nonce)||account.nonce<0||nonces.possible_next_nonce!==account.nonce||nonces.detected_missing_nonces?.length||nonces.detected_mempool_nonces?.length)throw Error('A pending or conflicting payment must resolve before returning funds.');
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
   const key=await this.key();
   const tx=await T.makeSTXTokenTransfer({recipient:q.recipient,amount:BigInt(q.amount),fee:BigInt(q.fee),nonce:BigInt(q.nonce),
    network:new StacksMainnet(),memo:'Xtrata Music return',anchorMode:T.AnchorMode.Any,senderKey:key});
   if(killSwitchEngaged()||epoch!==this.stopEpoch||q.expires<=Date.now())throw Error('Return stopped or review expired.');
   const e={id:q.id,mode:q.mode,address,recipient:q.recipient,amount:q.amount,fee:q.fee,nonce:q.nonce,
    txid:'0x'+tx.txid(),raw:Buffer.from(tx.serialize()).toString('hex'),status:'prepared',createdAt:new Date().toISOString()};
   log.push(e);await this.save('returns.json',log);await this.save('return-quote.json',null);
   // Persist before submission. Any failure from this point remains uncertain.
   if(killSwitchEngaged()||epoch!==this.stopEpoch)throw Error('Return saved but stopped. Reconcile before any further transfer.');
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
 async retryPreparedPlay(txid,fee){
  if(typeof txid!=='string'||!/^0x[0-9a-f]{64}$/.test(txid)||!Number.isInteger(fee)||fee<1||fee>1000)throw Error('Invalid explicit recovery request.');
  return this.exclusive(async()=>{
   if(killSwitchEngaged())throw Error('Wizard kill switch is engaged.');
   const epoch=this.stopEpoch;
   const log=await this.journal(),e=log.find(row=>row.txid===txid);
   if(!e||e.status!=='prepared'||e.priorAttempts?.length||fee<=e.fee)throw Error('Only a saved prepared attempt can be explicitly retried once at a higher fee.');
   if(log.some(row=>row!==e&&row.status!=='confirmed'))throw Error('Another payment needs recovery first.');
   await this.reconcileReturns();
   const quote=await this.optional('return-quote.json',null);if(quote?.expires>Date.now())throw Error('Finish the return review first.');
   try{await this.api('/extended/v1/tx/'+txid);throw Error('Original transaction is visible. Reconcile it instead.');}catch(error){if(error.status!==404)throw error;}
   const {address}=await this.json('vault.json'),account=await this.returnAccount(address),old=T.deserializeTransaction(Buffer.from(e.raw,'hex'));
   const args=[T.uintCV(e.core),T.uintCV(e.song),T.bufferCV(Buffer.from(e.receipt,'hex'))];
   if(e.address!==address||old.txid()!==txid.slice(2)||old.version!==T.TransactionVersion.Mainnet||old.chainId!==1||
    T.addressToString(old.payload.contractAddress)!==OWNER||old.payload.contractName.content!==NAME||old.payload.functionName.content!=='play'||
    old.payload.functionArgs.length!==3||args.some((arg,i)=>T.cvToHex(arg)!==T.cvToHex(old.payload.functionArgs[i]))||
    old.auth.spendingCondition.nonce!==BigInt(account.nonce)||old.auth.spendingCondition.fee!==BigInt(e.fee))throw Error('Saved transaction or available nonce does not match the recovery request.');
   const receipt=await this.read('get-receipt',[T.standardPrincipalCV(address),args[2]]);
   if(receipt.type!=='(optional none)'||receipt.value!==null)throw Error('The play receipt already exists or could not be verified.');
   const source=await this.api(`/v2/contracts/source/${OWNER}/${NAME}?proof=0`);if(sha(source.source)!==HASH)throw Error('Deployed source differs from pinned helper.');
   if(account.balance>1000000n||account.balance<BigInt(fee+50+1000))throw Error('Balance is outside supported recovery limits.');
   if(log.reduce((total,row)=>total+row.fee+50,0)-e.fee+fee>10000)throw Error('Recovery exceeds the lifetime test budget.');
   const owner=await this.read('get-owner',[args[0],args[1]]),recipient=owner?.success===true?owner.value?.value?.value:null;
   if(typeof recipient!=='string'||recipient.includes('.')||recipient===address)throw Error('Master owner is not eligible.');
   if(epoch!==this.stopEpoch||killSwitchEngaged())throw Error('Recovery stopped before signing.');
   const key=await this.key();
   const tx=await T.makeContractCall({contractAddress:OWNER,contractName:NAME,functionName:'play',functionArgs:args,senderKey:key,network:new StacksMainnet(),
    fee:BigInt(fee),nonce:old.auth.spendingCondition.nonce,anchorMode:T.AnchorMode.Any,postConditionMode:T.PostConditionMode.Deny,
    postConditions:[T.makeStandardSTXPostCondition(address,T.FungibleConditionCode.Equal,50n)]});
   if(epoch!==this.stopEpoch||killSwitchEngaged())throw Error('Recovery stopped before submission.');
   await this.save('recovery-original-'+txid.slice(2)+'.json',e);
   e.priorAttempts=[{txid:e.txid,fee:e.fee}];e.recoveryNonce=account.nonce;e.fee=fee;e.recipient=recipient;e.txid='0x'+tx.txid();e.raw=Buffer.from(tx.serialize()).toString('hex');e.recoveryAt=new Date().toISOString();
   await this.save('journal.json',log);
   if(epoch!==this.stopEpoch||killSwitchEngaged())throw Error('Recovery saved but stopped; reconcile before proceeding.');
   const result=await this.api('/v2/transactions',{method:'POST',headers:{'Content-Type':'application/octet-stream'},body:Buffer.from(e.raw,'hex')});
   if(String(result).replace(/^0x/,'')!==tx.txid())throw Error('Recovery submission outcome unknown. Do not retry automatically.');
   e.status='submitted';await this.save('journal.json',log);return publicEntry(e);
  });
 }
 async reconcile(log) {
  for(const e of log.filter(e=>e.status!=='confirmed')) {
   const attempts=[{txid:e.txid,fee:e.fee},...(e.priorAttempts||[])];let found=null,visible=false;
   for(const attempt of attempts){
    let tx;try{tx=await this.api('/extended/v1/tx/'+attempt.txid);}catch(error){if(error.status===404)continue;throw error;}
    visible=true;
    if(tx.tx_status==='success'&&tx.canonical===true&&tx.is_unanchored===false){found={tx,attempt};break;}
   }
   if(!found)throw Error(visible?'Saved transaction remains pending, failed or noncanonical. No new payment permitted.':'Saved transaction not visible yet. No replacement or new payment will be made.');
   const {tx,attempt}=found;
   if(tx.sender_address!==e.address||tx.contract_call?.contract_id!==OWNER+'.'+NAME||tx.contract_call?.function_name!=='play')throw Error('Transaction identity mismatch.');
   if(e.priorAttempts?.length&&(tx.tx_id!==attempt.txid||tx.nonce!==e.recoveryNonce||String(tx.fee_rate)!==String(attempt.fee)))throw Error('Recovered transaction identity mismatch.');
   const receipt=await this.read('get-receipt',[T.standardPrincipalCV(e.address),T.bufferCV(Buffer.from(e.receipt,'hex'))]);const r=receipt?.value?.value;
   if(receipt?.type==='(optional none)'&&receipt.value===null){const error=Error('Confirmed transaction is waiting for its play receipt to become available.');error.code='RECEIPT_PENDING';throw error;}
   if(r?.core?.value!==String(e.core)||r?.id?.value!==String(e.song))throw Error('Receipt verification failed.');
   e.status='confirmed';e.recipient=r.recipient.value;e.confirmedTxid=attempt.txid;e.actualFee=attempt.fee;await this.save('journal.json',log);
  }
 }
 async run(input,context={}) {
  if(this.running)throw Error('Runner already active.');const p=policy(input);this.running=true;this.stopped=false;
  let lock;
  try {
   lock=await open(join(this.dir,'run.lock'),'wx',0o600);this.guard();
   const quote=await this.optional('return-quote.json',null);if(quote?.expires>Date.now())throw Error('Finish or cancel the pending return review first.');
   await this.reconcileReturns();const log=await this.journal();await this.reconcile(log);
   if(!context.continuous&&log.reduce((s,e)=>s+e.fee+50,0)+(p.fee+50)*p.count>10000)throw Error('Lifetime test ceiling of 0.01 STX reached.');
   const source=await this.api(`/v2/contracts/source/${OWNER}/${NAME}?proof=0`);if(sha(source.source)!==HASH)throw Error('Deployed source differs from pinned helper.');
   const info=await this.api('/v2/info');if(info.network_id!==1)throw Error('Mainnet identity check failed.');
   const key=await this.key(),{address}=await this.json('vault.json');
   for(let i=0;i<p.count;i++) {
    this.guard();const account=await this.api(`/v2/accounts/${address}?proof=0`),nonces=await this.api(`/extended/v1/address/${address}/nonces`);
    if(!Number.isSafeInteger(account.nonce)||nonces.possible_next_nonce!==account.nonce||nonces.detected_missing_nonces?.length)throw Error('Conflicting or pending nonce.');
    if(BigInt(account.balance)>1000000n)throw Error('Balance is above 1 STX. Return the excess before starting tests.');
    if(BigInt(account.balance)<BigInt(p.fee+50+(context.continuous?0:1000)))throw Error(context.continuous?'Insufficient confirmed balance for another paid start.':'Insufficient confirmed balance; retain 0.001 STX reserve.');
    const owner=await this.read('get-owner',[T.uintCV(p.core),T.uintCV(p.song)]);const recipient=owner?.success===true?owner.value?.value?.value:null;
    if(typeof recipient!=='string'||recipient.includes('.')||recipient===address)throw Error('Master missing, escrowed or held by payer.');
    const receipt=randomBytes(16).toString('hex');
    const tx=await T.makeContractCall({contractAddress:OWNER,contractName:NAME,functionName:'play',functionArgs:[T.uintCV(p.core),T.uintCV(p.song),T.bufferCV(Buffer.from(receipt,'hex'))],senderKey:key,network:new StacksMainnet(),fee:BigInt(p.fee),nonce:BigInt(account.nonce),anchorMode:T.AnchorMode.Any,postConditionMode:T.PostConditionMode.Deny,postConditions:[T.makeStandardSTXPostCondition(address,T.FungibleConditionCode.Equal,50n)]});
    this.guard();const e={...(context.playbackId?{playbackId:context.playbackId,listeningSession:context.listeningSession,title:String(context.title||'').slice(0,200),artist:String(context.artist||'').slice(0,200)}:{}),createdAt:new Date().toISOString(),address,core:p.core,song:p.song,fee:p.fee,receipt,recipient,txid:'0x'+tx.txid(),raw:Buffer.from(tx.serialize()).toString('hex'),status:'prepared'};
    log.push(e);await this.save('journal.json',log);this.guard();
    const result=await this.api('/v2/transactions',{method:'POST',headers:{'Content-Type':'application/octet-stream'},body:Buffer.from(e.raw,'hex')});if(String(result).replace(/^0x/,'')!==tx.txid())throw Error('Unexpected broadcast response; reconcile before proceeding.');
    e.status='submitted';await this.save('journal.json',log);this.message='Submitted '+e.txid+'; waiting for confirmation.';
    let confirmed=false;
    for(let attempt=0;attempt<120;attempt++){this.guard();await new Promise(r=>setTimeout(r,5000));try{await this.reconcile(log);confirmed=true;break;}catch(error){if(error.code!=='RECEIPT_PENDING'&&!/pending|not visible/.test(error.message))throw error;}}
    if(!confirmed)throw Error('Confirmation wait expired. No new payment sent.');
   }
   this.message='Run confirmed; receipts verified.';
  }catch(e){this.message=e.message;throw e;}finally{this.running=false;if(lock){await lock.close();await unlink(join(this.dir,'run.lock'));}}
 }
}
