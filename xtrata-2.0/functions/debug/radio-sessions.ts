import { queryAll, type Env } from '../lib/db';
import { configuredDebugKey, hasDebugAccess } from '../lib/debug-auth';
export async function onRequest({request,env}:{request:Request;env:Env & {DEBUG_VIEW_KEY?:string}}) {
 const headers={'content-type':'application/json','cache-control':'private, no-store'};
 const reply=(data:unknown,status=200)=>new Response(JSON.stringify(data),{status,headers});
 const key=configuredDebugKey(env);if(!key||!hasDebugAccess(request,key))return reply({error:'Sign in at /debug first.'},401);
 if(request.method!=='GET')return reply({},405);
 const url=new URL(request.url),offset=Number(url.searchParams.get('offset')||0);
 if(!Number.isSafeInteger(offset)||offset<0||offset>100000)return reply({error:'Invalid page'},400);
 try {const rows=await queryAll(env,`SELECT contract,token_id,source,duration,seconds,created_at,updated_at,qualified_at,completed_at,closed,rule_version FROM radio_plays ORDER BY created_at DESC,session_id LIMIT 51 OFFSET ?`,[offset]);
 const all=rows.results||[];return reply({sessions:all.slice(0,50),nextOffset:all.length>50?offset+50:null});}
 catch{return reply({error:'Session data unavailable; check migration 011.'},503);}
}
