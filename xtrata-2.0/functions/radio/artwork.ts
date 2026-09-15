import {queryAll,type Env} from '../lib/db';
import {safeArtwork} from '../../src/lib/radio/inscription-metadata';
export async function onRequest({request,env}:{request:Request;env:Env}) {
 if(request.method!=='GET')return new Response(null,{status:405,headers:{allow:'GET'}});
 const id=new URL(request.url).searchParams.get('id');
 if(!id||!/^\d{1,10}$/.test(id)||Number(id)<1)return new Response(null,{status:400});
 try {
  const result=await queryAll(env,"SELECT cover FROM radio_metadata WHERE token_id=? AND cover!=''",[Number(id)]);
  const cover=safeArtwork((result.results?.[0] as any)?.cover);
  if(cover.startsWith('https:'))return new Response(null,{status:302,headers:{location:cover,'cache-control':'public, max-age=86400','referrer-policy':'no-referrer'}});
  if(cover.startsWith('data:')) {
   const [prefix,data]=cover.split(',');const bytes=Uint8Array.from(atob(data),c=>c.charCodeAt(0));
   return new Response(bytes,{headers:{'content-type':prefix.slice(5,-7),'cache-control':'public, max-age=86400','x-content-type-options':'nosniff','content-security-policy':"default-src 'none'"}});
  }
 }catch { /* absent artwork or migration */ }
 return new Response(null,{status:404,headers:{'cache-control':'no-store'}});
}
