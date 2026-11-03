import { refreshRadioMetadata } from '../lib/radio-metadata';
import { catalogueReport } from '../lib/radio-report';
import type { Env } from '../lib/db';
export async function onRequest(context:{request:Request;env:Env;waitUntil?:(p:Promise<unknown>)=>void}) {
 const {request,env}=context;
 // Through the context: detached from it the runtime refuses waitUntil ("Illegal invocation").
 const waitUntil=context.waitUntil?(p:Promise<unknown>)=>context.waitUntil!(p):undefined;
 const headers={'content-type':'application/json','cache-control':'no-store'};
 if(request.method!=='GET') return new Response('{}',{status:405,headers});
 const url=new URL(request.url);
 if(!['24h','7d','30d','all'].includes(url.searchParams.get('range')||'24h')) return new Response(JSON.stringify({error:'Invalid period'}),{status:400,headers});
 if(waitUntil) waitUntil(refreshRadioMetadata(env));
 try { return new Response(JSON.stringify(await catalogueReport(env,url,waitUntil)),{headers:headers}); }
 catch { return new Response(JSON.stringify({error:'Statistics are not activated yet. The operator must apply migration 012.'}),{status:503,headers}); }
}
