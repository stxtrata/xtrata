import {chainConfig,chainStates} from './radio-chain-likes';
import type {Env} from './db';
async function retry<T>(read:()=>Promise<T>):Promise<T>{try{return await read();}catch{return read();}}
/** One failed batch must not erase other songs' confirmed global totals. */
export async function catalogueChainTotals(env:Env,ids:number[]){
 const totals=new Map<number,string>();
 let status:'ready'|'partial'|'unavailable'|'disabled'='ready';
 try{
  const config=await retry(()=>chainConfig(env));
  if(!config.enabled)return {totals,status:'disabled' as const};
  let failed=false;
  for(let i=0;i<ids.length;i+=25){
   const batch=ids.slice(i,i+25);
   try{for(const row of await retry(()=>chainStates(config.contract,batch)))totals.set(row.id,row.total);}
   catch{failed=true;}
  }
  if(failed)status=totals.size?'partial':'unavailable';
 }catch{status='unavailable';}
 return {totals,status};
}
