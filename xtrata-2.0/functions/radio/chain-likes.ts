import {ChainReadUnavailable,chainConfig,chainStates,chainTransaction} from '../lib/radio-chain-likes';
import type {Env} from '../lib/db';
import {linksFor} from '../lib/radio-listening-wallet';

/**
 * Listening wallets linked to `wallet` by a dual-signed link (both keys signed it, verified when saved).
 * Their likes are this wallet's likes, so the liked playlist follows the listener. No database: none.
 */
async function linkedListening(env:Env,wallet?:string):Promise<string[]>{
 if(!wallet||!(env as any).DB)return [];
 try{return (await linksFor(env as any,wallet)).map(l=>l.listening).filter(a=>a!==wallet);}catch{return [];}
}
type Row={id:number;liked:boolean;total:string;by?:string[]};
/** Liked if the wallet or any linked listening wallet liked it; `by` says which, so an unlike can go to the right one. */
export function mergeLinkedRows(wallet:string,own:Row[],linked:{listening:string;rows:Row[]}[]):Row[]{
 return own.map(r=>{
  const by=[...(r.liked?[wallet]:[]),...linked.filter(l=>l.rows.find(x=>x.id===r.id)?.liked===true).map(l=>l.listening)];
  return {...r,liked:by.length>0,by};
 });
}
export async function onRequest({request,env}:{request:Request;env:Env}){
 const reply=(body:unknown,status=200,extra:Record<string,string>={})=>new Response(JSON.stringify(body),{status,headers:{'content-type':'application/json','cache-control':'no-store',...extra}});
 if(request.method!=='GET')return reply({},405);
 try {
  const config=await chainConfig(env);if(!config.enabled)return reply(config);
  const url=new URL(request.url),listener=url.searchParams.get('wallet')||undefined;
  if(url.searchParams.has('txid'))return reply({...config,...await chainTransaction(config.contract,url.searchParams.get('txid')!,listener||'',env)});
  if(!url.searchParams.has('ids'))return reply(config);
  const raw=url.searchParams.get('ids')!;if(!/^\d+(,\d+){0,24}$/.test(raw))return reply({error:'Request up to 25 song IDs'},400);
  const ids=raw.split(',').map(Number);
  const rows=await chainStates(config.contract,ids,listener,env);
  const linked=await linkedListening(env,listener);
  if(!linked.length)return reply({...config,rows});
  // A failed read of a linked wallet fails the whole answer: showing its likes as missing would be wrong.
  const linkedRows=[];for(const listening of linked)linkedRows.push({listening,rows:await chainStates(config.contract,ids,listening,env)});
  return reply({...config,rows:mergeLinkedRows(listener!,rows,linkedRows),linked});
 }catch(error){
  const retryAfter=error instanceof ChainReadUnavailable?error.retryAfter:30;
  return reply({error:'On-chain likes are temporarily unavailable. No transaction has been requested.',code:'upstream_unavailable',retryAfter},503,{'retry-after':String(retryAfter)});
 }
}
