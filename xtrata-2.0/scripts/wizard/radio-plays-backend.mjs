/** Local-only radio wizard. Secrets never cross the HTTP boundary. */
import { randomBytes, createCipheriv, createDecipheriv, createHash } from 'node:crypto';
import { mkdir, readFile, writeFile, rename, open, unlink } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { killSwitchEngaged } from './inscribe.mjs';
const require = createRequire(import.meta.url);
const T = require('@stacks/transactions');
const { StacksMainnet } = require('@stacks/network');
const OWNER='SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X', NAME='xtrata-radio-plays-v1-0';
const HASH='b81f1a0e1de406102e739f78d200041a270f498edab1bb3320aec54f33cbbbe1';
const sha = s => createHash('sha256').update(s).digest('hex');
export function policy(p) {
  if (!Number.isInteger(p.core)||p.core<1||p.core>3||!Number.isSafeInteger(p.song)||p.song<0||!Number.isInteger(p.fee)||p.fee<1||p.fee>1000||!Number.isInteger(p.count)||p.count<1||p.count>5) throw Error('Use core 1–3, an integer song ID, fee 1–1000 microSTX and 1–5 tests.');
  if ((p.fee+50)*p.count>5000) throw Error('Run exceeds 0.005 STX ceiling.');
  return p;
}
export class RadioWizard {
 constructor(directory, request=fetch) { this.dir=directory;this.request=request;this.running=false;this.stopped=false;this.message='Idle. No payments authorised.'; }
 async json(name) { return JSON.parse(await readFile(join(this.dir,name),'utf8')); }
 async save(name,v) { const path=join(this.dir,name);await writeFile(path+'.tmp',JSON.stringify(v),{mode:0o600});await rename(path+'.tmp',path); }
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
 async api(path,options={}) { const r=await this.request('https://api.hiro.so'+path,{...options,signal:AbortSignal.timeout(20000),headers:{...(process.env.HIRO_API_KEY?{'x-api-key':process.env.HIRO_API_KEY}:{}),...options.headers}});if(!r.ok){const e=Error('Chain request failed: HTTP '+r.status);e.status=r.status;throw e;}return r.json(); }
 async read(fn,args=[]) {const r=await this.api(`/v2/contracts/call-read/${OWNER}/${NAME}/${fn}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sender:OWNER,arguments:args.map(T.cvToHex)})});if(!r.okay)throw Error('Contract read failed.');return T.cvToJSON(T.hexToCV(r.result));}
 async journal(){try{return await this.json('journal.json');}catch(e){if(e.code==='ENOENT')return [];throw e;}}
 async status(chain=false){const {address}=await this.json('vault.json');const log=await this.journal();let balance=null;if(chain){const a=await this.api(`/v2/accounts/${address}?proof=0`);balance=BigInt(a.balance).toString();}return {address,balanceMicroSTX:balance,running:this.running,message:this.message,spendCeilingMicroSTX:10000,entries:log.map(({raw,...e})=>e)};}
 stop(){this.stopped=true;this.message='Stopped. Already submitted transactions may confirm.';}
 async reconcile(log) {
  for(const e of log.filter(e=>e.status!=='confirmed')) {
   let tx;try{tx=await this.api('/extended/v1/tx/'+e.txid);}catch(error){if(error.status===404)throw Error('Saved transaction not visible yet. No replacement or new payment will be made.');throw error;}
   if(tx.tx_status!=='success'||tx.canonical!==true||tx.is_unanchored!==false)throw Error('Saved transaction remains pending, failed or noncanonical. No new payment permitted.');
   if(tx.sender_address!==e.address||tx.contract_call?.contract_id!==OWNER+'.'+NAME||tx.contract_call?.function_name!=='play')throw Error('Transaction identity mismatch.');
   const receipt=await this.read('get-receipt',[T.standardPrincipalCV(e.address),T.bufferCV(Buffer.from(e.receipt,'hex'))]);const r=receipt?.value?.value;
   if(r?.core?.value!==String(e.core)||r?.id?.value!==String(e.song))throw Error('Receipt verification failed.');
   e.status='confirmed';e.recipient=r.recipient.value;await this.save('journal.json',log);
  }
 }
 async run(input) {
  if(this.running)throw Error('Runner already active.');const p=policy(input);this.running=true;this.stopped=false;
  let lock;
  try {
   lock=await open(join(this.dir,'run.lock'),'wx',0o600);this.guard();
   const log=await this.journal();await this.reconcile(log);
   if(log.reduce((s,e)=>s+e.fee+50,0)+(p.fee+50)*p.count>10000)throw Error('Lifetime test ceiling of 0.01 STX reached.');
   const source=await this.api(`/v2/contracts/source/${OWNER}/${NAME}?proof=0`);if(sha(source.source)!==HASH)throw Error('Deployed source differs from pinned helper.');
   const info=await this.api('/v2/info');if(info.network_id!==1)throw Error('Mainnet identity check failed.');
   const key=await this.key(),{address}=await this.json('vault.json');
   for(let i=0;i<p.count;i++) {
    this.guard();const account=await this.api(`/v2/accounts/${address}?proof=0`),nonces=await this.api(`/extended/v1/address/${address}/nonces`);
    if(!Number.isSafeInteger(account.nonce)||nonces.possible_next_nonce!==account.nonce||nonces.detected_missing_nonces?.length)throw Error('Conflicting or pending nonce.');
    if(BigInt(account.balance)<BigInt(p.fee+50+1000))throw Error('Insufficient confirmed balance; retain 0.001 STX reserve.');
    const owner=await this.read('get-owner',[T.uintCV(p.core),T.uintCV(p.song)]);const recipient=owner?.success===true?owner.value?.value?.value:null;
    if(typeof recipient!=='string'||recipient.includes('.')||recipient===address)throw Error('Master missing, escrowed or held by payer.');
    const receipt=randomBytes(16).toString('hex');
    const tx=await T.makeContractCall({contractAddress:OWNER,contractName:NAME,functionName:'play',functionArgs:[T.uintCV(p.core),T.uintCV(p.song),T.bufferCV(Buffer.from(receipt,'hex'))],senderKey:key,network:new StacksMainnet(),fee:BigInt(p.fee),nonce:BigInt(account.nonce),anchorMode:T.AnchorMode.Any,postConditionMode:T.PostConditionMode.Deny,postConditions:[T.makeStandardSTXPostCondition(address,T.FungibleConditionCode.Equal,50n)]});
    this.guard();const e={address,core:p.core,song:p.song,fee:p.fee,receipt,recipient,txid:'0x'+tx.txid(),raw:Buffer.from(tx.serialize()).toString('hex'),status:'prepared'};
    log.push(e);await this.save('journal.json',log);this.guard();
    const result=await this.api('/v2/transactions',{method:'POST',headers:{'Content-Type':'application/octet-stream'},body:Buffer.from(e.raw,'hex')});if(String(result).replace(/^0x/,'')!==tx.txid())throw Error('Unexpected broadcast response; reconcile before proceeding.');
    e.status='submitted';await this.save('journal.json',log);this.message='Submitted '+e.txid+'; waiting for confirmation.';
    let confirmed=false;
    for(let attempt=0;attempt<120;attempt++){this.guard();await new Promise(r=>setTimeout(r,5000));try{await this.reconcile(log);confirmed=true;break;}catch(error){if(!/pending|not visible/.test(error.message))throw error;}}
    if(!confirmed)throw Error('Confirmation wait expired. No new payment sent.');
   }
   this.message='Run confirmed; receipts verified.';
  }catch(e){this.message=e.message;throw e;}finally{this.running=false;if(lock){await lock.close();await unlink(join(this.dir,'run.lock'));}}
 }
}
