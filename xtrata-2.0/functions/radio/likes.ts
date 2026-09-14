import {queryAll,type Env} from '../lib/db';
import {RADIO_CONTRACT} from '../lib/radio-report';
import {UUID} from './plays';
export async function onRequest({request,env}:{request:Request;env:Env & {TELEMETRY_SALT?:string}}) {
 const reply=(data:unknown,status=200)=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json','cache-control':'no-store'}});
 if(request.method!=='PUT')return reply({},405);
 if(request.headers.get('origin')!==new URL(request.url).origin||request.headers.get('sec-fetch-site')==='cross-site')return reply({},403);
 if(!env.TELEMETRY_SALT)return reply({error:'Likes not configured'},503);
 try {
  if(!request.headers.get('content-type')?.startsWith('application/json'))return reply({},415);
  const reader=request.body?.getReader();if(!reader)return reply({},400);
  let text='',size=0;const decoder=new TextDecoder();while(true){const r=await reader.read();if(r.done)break;size+=r.value.length;if(size>16000){await reader.cancel();return reply({},413);}text+=decoder.decode(r.value,{stream:true});}text+=decoder.decode();
  let b;try{b=JSON.parse(text);}catch{return reply({},400);}
  if(!b||!UUID.test(b.browserId)||!UUID.test(b.operationId)||!Number.isSafeInteger(b.revision)||b.revision<0||b.revision>Date.now()+60000||!Array.isArray(b.ids)||b.ids.length>200||!b.ids.every((n:unknown)=>Number.isSafeInteger(n)&&Number(n)>0&&Number(n)<=10000000))return reply({},400);
  const hash=[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(env.TELEMETRY_SALT+':likes:'+b.browserId)))].map(v=>v.toString(16).padStart(2,'0')).join('');
  const old=(await queryAll(env,'SELECT revision,updated_at FROM radio_like_browsers WHERE browser_hash=?',[hash])).results?.[0] as {revision:number;updated_at:number}|undefined;
  if(old&&b.revision<=old.revision)return reply({ok:true,duplicate:true});
  if(old&&Date.now()-old.updated_at<1000)return reply({error:'Retry later'},429);
  const db=(env.DB||env.D1||env.db) as (D1Database & {batch(statements:D1PreparedStatement[]):Promise<unknown>})|undefined;if(!db)throw Error('No DB');
  await db.batch([
   db.prepare(`INSERT INTO radio_like_browsers(browser_hash,revision,operation_id,updated_at) VALUES(?,?,?,?) ON CONFLICT(browser_hash) DO UPDATE SET revision=excluded.revision,operation_id=excluded.operation_id,updated_at=excluded.updated_at WHERE excluded.revision>radio_like_browsers.revision`).bind(hash,b.revision,b.operationId,Date.now()),
   db.prepare('DELETE FROM radio_likes WHERE browser_hash=? AND EXISTS(SELECT 1 FROM radio_like_browsers WHERE browser_hash=? AND operation_id=?)').bind(hash,hash,b.operationId),
   db.prepare(`INSERT OR IGNORE INTO radio_likes(browser_hash,token_id) SELECT ?,i.token_id FROM inscription_index i JOIN json_each(?) j ON i.token_id=j.value WHERE i.contract=? AND i.sealed=1 AND (i.mime LIKE 'audio/%' OR i.mime LIKE 'text/html%') AND EXISTS(SELECT 1 FROM radio_like_browsers WHERE browser_hash=? AND operation_id=?)`).bind(hash,JSON.stringify([...new Set(b.ids)]),RADIO_CONTRACT,hash,b.operationId)
  ]);
  return reply({ok:true});
 }catch{return reply({error:'Likes unavailable; check migration 013'},503);}
}
