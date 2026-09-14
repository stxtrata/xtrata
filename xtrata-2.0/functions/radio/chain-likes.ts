import {chainConfig,chainStates,chainTransaction} from '../lib/radio-chain-likes';
import type {Env} from '../lib/db';
export async function onRequest({request,env}:{request:Request;env:Env}){
 const reply=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{'content-type':'application/json','cache-control':'no-store'}});
 if(request.method!=='GET')return reply({},405);
 try {
  const config=await chainConfig(env);if(!config.enabled)return reply(config);
  const url=new URL(request.url),listener=url.searchParams.get('wallet')||undefined;
  if(url.searchParams.has('txid'))return reply({...config,...await chainTransaction(config.contract,url.searchParams.get('txid')!,listener||'')});
  if(!url.searchParams.has('ids'))return reply(config);
  const raw=url.searchParams.get('ids')!;if(!/^\d+(,\d+){0,24}$/.test(raw))return reply({error:'Request up to 25 song IDs'},400);
  return reply({...config,rows:await chainStates(config.contract,raw.split(',').map(Number),listener)});
 }catch{return reply({error:'On-chain likes are temporarily unavailable. No transaction has been requested.'},503);}
}
