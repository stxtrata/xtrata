import {radioArtist,radioTitle} from '../../src/lib/radio/artist-credits.mjs';
const OWNER='SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const MAX=32*1024*1024;
async function bytes(response,limit){
 if(!response.ok)throw Error(`Music service HTTP ${response.status}`);
 const chunks=[];let total=0;
 for await(const chunk of response.body){total+=chunk.length;if(total>limit)throw Error('Audio inscription is too large for this test player.');chunks.push(chunk);}
 return Buffer.concat(chunks);
}
export class RadioMedia {
 constructor(request=fetch){this.request=request;this.loaded=new Set();this.cache=new Map();this.tracks=[];this.updated=0;}
 async catalogue(){
  if(this.updated>Date.now()-150000)return this.tracks;
  const r=await this.request('https://xtrata.xyz/radio/counts?range=all&chainLikes=0',{signal:AbortSignal.timeout(30000),redirect:'error'});
  const data=JSON.parse((await bytes(r,2*1024*1024)).toString());
  if(!Array.isArray(data.tracks))throw Error('Song catalogue unavailable.');
  this.tracks=data.tracks.filter(t=>Number.isSafeInteger(t.id)&&t.id>=0&&['Audio','Audio player'].includes(t.status)).slice(0,2000).map(t=>({id:t.id,title:radioTitle(t.id,String(t.title||`Inscription #${t.id}`).slice(0,200)),artist:radioArtist(t.id,String(t.artist||'').slice(0,200)),album:String(t.album||'').slice(0,200),hasArtwork:!!t.thumbnail}));
  this.updated=Date.now();return this.tracks;
 }
 async artwork(id){
  if(!Number.isSafeInteger(id)||id<0)throw Error('Invalid song ID.');
  const response=await this.request(`https://xtrata.xyz/radio/artwork?id=${id}`,{signal:AbortSignal.timeout(15000),redirect:'error'});
  const mime=(response.headers.get('content-type')||'').split(';')[0];
  if(!['image/png','image/jpeg','image/webp','image/gif'].includes(mime))throw Error('Artwork unavailable.');
  return {mime,body:await bytes(response,2*1024*1024)};
 }
 async audio(id){
  if(!Number.isSafeInteger(id)||id<0)throw Error('Invalid song ID.');
  if(this.cache.has(id))return this.cache.get(id);
  const songs=await this.catalogue();if(!songs.some(t=>t.id===id))throw Error('Choose a verified song from the catalogue.');
  const url=new URL('https://xtrata.xyz/runtime/content');url.search=new URLSearchParams({contractId:OWNER+'.xtrata-v3-2-3',tokenId:String(id),network:'mainnet'}).toString();
  const response=await this.request(url,{signal:AbortSignal.timeout(45000),redirect:'error'});
  if(response.headers.get('x-xtrata-runtime-contract')!==OWNER+'.xtrata-v3-2-3'||response.headers.get('x-xtrata-runtime-network')!=='mainnet')throw Error('Audio contract/network could not be verified.');
  let mime=(response.headers.get('content-type')||'').split(';')[0].toLowerCase(),body=await bytes(response,MAX);
  if(mime==='text/html'){
   // Extract bytes only. Inscription scripts/markup never enter the privileged page.
   const match=body.toString('utf8').match(/<(?:audio|source)\b[^>]*\bsrc=["']data:(audio\/[a-z0-9.+-]+)(?:;[^,"']*)?;base64,([a-z0-9+/=\s]+)["']/i);
   if(!match)throw Error('No directly embedded audio found. This song plays free elsewhere.');
   mime=match[1].toLowerCase();body=Buffer.from(match[2].replace(/\s/g,''),'base64');
  }
  if(!/^audio\/[a-z0-9.+-]+$/.test(mime)||!body.length)throw Error('Unsupported audio inscription.');
  const result={mime,body};this.loaded.add(id);this.cache.set(id,result);
  // Only two tracks' bytes are held; this is not an unbounded media archive.
  while(this.cache.size>2)this.cache.delete(this.cache.keys().next().value);
  return result;
 }
}
