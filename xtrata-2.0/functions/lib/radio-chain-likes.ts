import {Cl,cvToJSON,deserializeCV,serializeCV,validateStacksAddress} from '@stacks/transactions';
import type {Env} from './db';
import {applyHiroApiKey,getHiroApiKeys,shouldRetryWithNextHiroKey} from './hiro-keys';
const CORE='SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3';
const API='https://api.mainnet.hiro.so';
export function likesContract(env:Env):string|null {
 const value=env.RADIO_LIKES_CONTRACT;
 if(typeof value!=='string'||!/^SP[A-Z0-9]+\.[a-zA-Z][a-zA-Z0-9_-]{0,39}$/.test(value))return null;
 return validateStacksAddress(value.split('.')[0])?value:null;
}
/** Thrown when Hiro cannot answer right now. `retryAfter` is a hint (seconds) for clients. */
export class ChainReadUnavailable extends Error{
 retryAfter:number;
 constructor(message:string,retryAfter=30){super(message);this.name='ChainReadUnavailable';this.retryAfter=retryAfter;}
}
const KEY_COOLDOWN_MS=120000,READ_TIMEOUT_MS=12000,TRANSIENT_RETRY_MS=300,CONFIG_TTL_MS=3600000;
/** Per-isolate: keys that Hiro recently refused go to the back of the queue instead of being retried first. */
const keyCooldownUntil=new Map<string,number>();
const configCache=new Map<string,{value:ChainConfig;at:number}>();
/** Test hook: clears cooldowns and the cached deployment config. */
export function resetChainReadState(){keyCooldownUntil.clear();configCache.clear();}
const sleep=(ms:number)=>new Promise<void>(resolve=>setTimeout(resolve,ms));
const isTransient=(status:number)=>status===500||status===502||status===503||status===504;
function retryAfterSeconds(response:Response,fallback:number){
 const parsed=Number(response.headers.get('retry-after'));
 return Number.isFinite(parsed)&&parsed>0?Math.min(Math.max(Math.ceil(parsed),5),120):fallback;
}
type ChainFetchOptions={retryTransient?:boolean};
/** Use server-held credentials for every radio read, never exposing keys to clients. */
async function chainFetch(env:Env,path:string,init:RequestInit,operation:string,options:ChainFetchOptions={}){
 const keys=getHiroApiKeys(env);
 const at=Date.now();
 // Keys that are not cooling down go first; cooling keys stay as a last resort.
 const attempts: Array<string|null>=keys.length?[...keys.filter(k=>(keyCooldownUntil.get(k)||0)<=at),...keys.filter(k=>(keyCooldownUntil.get(k)||0)>at)]:[null];
 const signal=AbortSignal.timeout(READ_TIMEOUT_MS);
 let transientRetried=false;
 for(let i=0;i<attempts.length;i++){
  const key=attempts[i];
  const headers=new Headers(init.headers);applyHiroApiKey(headers,key);
  let response:Response;
  try{response=await fetch(API+path,{...init,headers,signal});}
  catch{
   console.warn('[radio:chain-read]',{operation,reason:'network-or-timeout',authenticated:keys.length>0});
   if(options.retryTransient&&!transientRetried&&!signal.aborted){transientRetried=true;await sleep(TRANSIENT_RETRY_MS);i--;continue;}
   throw new ChainReadUnavailable('Chain read network failure',15);
  }
  if(response.ok||response.status===404)return response;
  console.warn('[radio:chain-read]',{operation,status:response.status,authenticated:keys.length>0});
  if(key&&shouldRetryWithNextHiroKey(response.status)){
   keyCooldownUntil.set(key,Date.now()+(response.status===429?retryAfterSeconds(response,KEY_COOLDOWN_MS/1000)*1000:KEY_COOLDOWN_MS));
   if(i+1<attempts.length){await response.body?.cancel();continue;}
  }else if(options.retryTransient&&isTransient(response.status)&&!transientRetried){
   transientRetried=true;await response.body?.cancel();await sleep(TRANSIENT_RETRY_MS);i--;continue;
  }
  return response;
 }
 throw new ChainReadUnavailable('Chain read unavailable');
}
async function read(contract:string,fn:string,args:Parameters<typeof serializeCV>[0][],sender:string,env:Env){
 const [address,name]=contract.split('.');
 const response=await chainFetch(env,`/v2/contracts/call-read/${address}/${name}/${fn}`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({sender,arguments:args.map(a=>'0x'+Array.from(serializeCV(a)).map(b=>b.toString(16).padStart(2,'0')).join(''))}),},fn,{retryTransient:true});
 if(!response.ok)throw new ChainReadUnavailable('Chain read unavailable',response.status===429?retryAfterSeconds(response,30):15);const body=await response.json() as any;
 if(!body.okay||typeof body.result!=='string')throw Error('Contract read failed');
 const decoded=cvToJSON(deserializeCV(body.result));if(!decoded.success)throw Error('Contract rejected read');return decoded.value;
}
type ChainConfig={enabled:true;contract:string;network:'mainnet';batchLimit:25;platformFee:0};
/** The likes contract is immutable, so the verified config is cached and served stale if Hiro is unavailable. */
export async function chainConfig(env:Env):Promise<ChainConfig|{enabled:false}>{
 const contract=likesContract(env);if(!contract)return {enabled:false as const};
 const cached=configCache.get(contract);
 if(cached&&Date.now()-cached.at<CONFIG_TTL_MS)return cached.value;
 let result:any;
 try{result=await read(contract,'get-config',[],contract.split('.')[0],env);}
 catch(error){if(cached&&error instanceof ChainReadUnavailable)return cached.value;throw error;}
 const v=result.value;
 if(v.version?.value!=='1'||v.core?.value!==CORE||v['batch-limit']?.value!=='25'||v['platform-fee']?.value!=='0')throw Error('Unexpected likes contract configuration');
 const value:ChainConfig={enabled:true as const,contract,network:'mainnet' as const,batchLimit:25,platformFee:0};
 configCache.set(contract,{value,at:Date.now()});return value;
}
export async function chainStates(contract:string,ids:number[],listener=contract.split('.')[0],env:Env={}){
 if(ids.length>25||!ids.every(n=>Number.isSafeInteger(n)&&n>=0))throw Error('Invalid song IDs');
 if(!validateStacksAddress(listener)||!listener.startsWith('SP'))throw Error('Use a mainnet wallet');
 const result=await read(contract,'get-state',[Cl.list(ids.map(n=>Cl.uint(n))),Cl.standardPrincipal(listener)],listener,env);
 const rows=result.value.map((r:any)=>({id:Number(r.value.id.value),liked:r.value.liked.value,total:String(r.value.total.value)}));
 if(rows.length!==ids.length||rows.some((r:any,i:number)=>r.id!==ids[i]||typeof r.liked!=='boolean'||!/^\d+$/.test(r.total)))throw Error('Malformed chain state');
 return rows as {id:number;liked:boolean;total:string}[];
}
export async function chainTransaction(contract:string,txid:string,listener:string,env:Env={}){
 if(!/^0x[0-9a-f]{64}$/i.test(txid)||!validateStacksAddress(listener))throw Error('Invalid transaction');
 const response=await chainFetch(env,`/extended/v1/tx/${txid}?unanchored=false`,{},'transaction');
 if(response.status===404)return {status:'pending'};if(!response.ok)throw Error('Transaction lookup unavailable');const tx=await response.json() as any;
 if(tx.sender_address!==listener||tx.contract_call?.contract_id!==contract||!['set-liked','set-likes'].includes(tx.contract_call?.function_name))throw Error('Transaction does not match this wallet and contract');
 if(String(tx.tx_status).startsWith('dropped_'))return {status:'failed'};
 if(tx.is_unanchored!==false||tx.canonical!==true||!Number.isSafeInteger(tx.block_height)||tx.block_height<1)return {status:'pending'};
 return {status:tx.tx_status==='success'?'confirmed':String(tx.tx_status).startsWith('abort_')||String(tx.tx_status).startsWith('dropped_')?'failed':'pending'};
}
