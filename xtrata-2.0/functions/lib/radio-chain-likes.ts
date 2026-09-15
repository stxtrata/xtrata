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
/** Use server-held credentials for every radio read, never exposing keys to clients. */
async function chainFetch(env:Env,path:string,init:RequestInit,operation:string){
 const keys=getHiroApiKeys(env);
 const attempts: Array<string|null>=keys.length?keys.slice(0,2):[null];
 const signal=AbortSignal.timeout(12000);
 for(let i=0;i<attempts.length;i++){
  const headers=new Headers(init.headers);applyHiroApiKey(headers,attempts[i]);
  let response:Response;
  try{response=await fetch(API+path,{...init,headers,signal});}
  catch{console.warn('[radio:chain-read]',{operation,reason:'network-or-timeout',authenticated:keys.length>0});throw Error('Chain read network failure');}
  if(response.ok||response.status===404)return response;
  console.warn('[radio:chain-read]',{operation,status:response.status,authenticated:keys.length>0});
  if(i+1<attempts.length&&shouldRetryWithNextHiroKey(response.status)){
   await response.body?.cancel();continue;
  }
  return response;
 }
 throw Error('Chain read unavailable');
}
async function read(contract:string,fn:string,args:Parameters<typeof serializeCV>[0][],sender:string,env:Env){
 const [address,name]=contract.split('.');
 const response=await chainFetch(env,`/v2/contracts/call-read/${address}/${name}/${fn}`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({sender,arguments:args.map(a=>'0x'+Array.from(serializeCV(a)).map(b=>b.toString(16).padStart(2,'0')).join(''))}),},fn);
 if(!response.ok)throw Error('Chain read unavailable');const body=await response.json() as any;
 if(!body.okay||typeof body.result!=='string')throw Error('Contract read failed');
 const decoded=cvToJSON(deserializeCV(body.result));if(!decoded.success)throw Error('Contract rejected read');return decoded.value;
}
export async function chainConfig(env:Env){
 const contract=likesContract(env);if(!contract)return {enabled:false as const};
 const result=await read(contract,'get-config',[],contract.split('.')[0],env);const v=result.value;
 if(v.version?.value!=='1'||v.core?.value!==CORE||v['batch-limit']?.value!=='25'||v['platform-fee']?.value!=='0')throw Error('Unexpected likes contract configuration');
 return {enabled:true as const,contract,network:'mainnet' as const,batchLimit:25,platformFee:0};
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
