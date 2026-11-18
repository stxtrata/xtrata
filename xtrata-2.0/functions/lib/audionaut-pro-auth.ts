// Pro-only server authorization. Client wallet addresses never establish a session.
import {readCreatorSession} from './creator-auth';
import {findAudionaut, type GateResult} from '../../src/audionaut/core';
import {applyHiroApiKey,getHiroApiKeys,shouldRetryWithNextHiroKey} from './hiro-keys';
import type {Env} from './db';
const cache=new Map<string,{expires:number,result:GateResult}>();
const pending=new Map<string,Promise<GateResult>>();
const TTL=60_000,DEADLINE=15_000;
export const PRO_NO_STORE={'Cache-Control':'private, no-store','Vary':'Cookie'};
export async function checkProMembership(env:Env,address:string,{fetchImpl=fetch,now=Date.now(),refresh=false}:{fetchImpl?:typeof fetch;now?:number;refresh?:boolean}={}){
  const cached=cache.get(address);if(!refresh&&cached&&cached.expires>now)return cached.result;
  if(pending.has(address))return pending.get(address)!;
  const task=(async()=>{
    const controller=new AbortController();let timer:ReturnType<typeof setTimeout>;
    const timeout=new Promise<never>((_,reject)=>{timer=setTimeout(()=>{controller.abort();reject(new Error('Ownership verification timed out. Try again.'));},DEADLINE);});
    const keyed:typeof fetch=async(input,init)=>{
      const keys=getHiroApiKeys(env),candidates=keys.length?keys:[null];
      for(let i=0;i<candidates.length;i++){
        const headers=new Headers(init?.headers);applyHiroApiKey(headers,candidates[i]);
        const response=await fetchImpl(input,{...init,headers,signal:controller.signal});
        if(i<candidates.length-1&&shouldRetryWithNextHiroKey(response.status))continue;return response;
      }
      throw new Error('Ownership service unavailable.');
    };
    try{
      const result=await Promise.race([findAudionaut(address,{hiroBase:'https://api.hiro.so',fetchImpl:keyed,signal:controller.signal,maxHeld:1000,concurrency:4}),timeout]);
      if(!result.holds&&result.truncated)throw new Error('Could not verify the complete holding list. Try again or use a wallet with fewer unrelated inscriptions.');
      cache.set(address,{expires:now+TTL,result});
      while(cache.size>256)cache.delete(cache.keys().next().value!);
      return result;
    }finally{clearTimeout(timer!);}
  })();pending.set(address,task);
  try{return await task;}finally{pending.delete(address);}
}
export async function authorizePro(request:Request,env:Env){
  const {session,ok}=await readCreatorSession(request,env);
  if(!ok)return {allowed:false,status:503,error:'Xtrata sign-in is temporarily unavailable.'};
  if(!session)return {allowed:false,status:401,error:'Sign in with Xtrata to open AudioNaut Pro.'};
  try{
    const membership=await checkProMembership(env,session.address);
    return membership.holds?{allowed:true,status:200,address:session.address,tokenId:membership.tokenId,expiresAt:session.expiresAt}:{allowed:false,status:403,address:session.address,error:'This wallet does not currently hold an Audionaut.'};
  }catch(error){return {allowed:false,status:503,address:session.address,error:error instanceof Error?error.message:'Ownership verification unavailable.'};}
}
export function clearProMembershipCache(){cache.clear();pending.clear();}
