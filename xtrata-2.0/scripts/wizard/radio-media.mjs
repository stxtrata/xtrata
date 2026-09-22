import {radioArtist,radioTitle} from '../../src/lib/radio/artist-credits.mjs';
const OWNER='SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const MAX=32*1024*1024;
const MAX_DURATION_SECONDS=24*60*60;

// This page can play several common audio formats, but payment eligibility is
// deliberately narrower: it is derived from the verified bytes served here,
// never from a renderer- or extension-supplied duration.  Unknown formats stay
// playable and free until a decoder is added and tested for them.
function wavDuration(body){
 if(body.length<12||body.subarray(0,4).toString('ascii')!=='RIFF'||body.subarray(8,12).toString('ascii')!=='WAVE')return null;
 let position=12,rate=0,blockAlign=0,data=0;
 while(position+8<=body.length){
  const chunk=body.subarray(position,position+4).toString('ascii');
  const size=body.readUInt32LE(position+4),end=position+8+size;
  if(end>body.length)return null;
  if(chunk==='fmt '&&size>=16){rate=body.readUInt32LE(position+12);blockAlign=body.readUInt16LE(position+20);}
  if(chunk==='data')data+=size;
  position=end+(size%2);
 }
 const seconds=data/(rate*blockAlign);
 return Number.isFinite(seconds)&&seconds>0&&seconds<=MAX_DURATION_SECONDS?seconds:null;
}
function mp3Frame(body,position){
 if(position+4>body.length||body[position]!==0xff||(body[position+1]&0xe0)!==0xe0)return null;
 const version=(body[position+1]>>3)&3,layer=(body[position+1]>>1)&3,bitrateIndex=(body[position+2]>>4)&15,sampleIndex=(body[position+2]>>2)&3,padding=(body[position+2]>>1)&1;
 if(version===1||layer===0||bitrateIndex===0||bitrateIndex===15||sampleIndex===3)return null;
 const sampleBase=[44100,48000,32000][sampleIndex];
 const sampleRate=version===3?sampleBase:version===2?sampleBase/2:sampleBase/4;
 const tables=version===3
  ?{1:[0,32,64,96,128,160,192,224,256,288,320,352,384,416,448],2:[0,32,48,56,64,80,96,112,128,160,192,224,256,320,384],3:[0,32,40,48,56,64,80,96,112,128,160,192,224,256,320]}
  :{1:[0,32,48,56,64,80,96,112,128,144,160,176,192,224,256],2:[0,8,16,24,32,40,48,56,64,80,96,112,128,144,160],3:[0,8,16,24,32,40,48,56,64,80,96,112,128,144,160]};
 const bitrate=tables[4-layer][bitrateIndex]*1000;
 const samples=layer===3?384:layer===2?1152:version===3?1152:576;
 const size=layer===3?Math.floor((12*bitrate/sampleRate)+padding)*4:layer===1&&version!==3?Math.floor((72*bitrate/sampleRate)+padding):Math.floor((144*bitrate/sampleRate)+padding);
 return Number.isSafeInteger(size)&&size>=4?{size,seconds:samples/sampleRate}:null;
}
function mp3Duration(body){
 let position=0;
 if(body.length>=10&&body.subarray(0,3).toString('ascii')==='ID3'){
  const size=((body[6]&0x7f)*0x200000)+((body[7]&0x7f)*0x4000)+((body[8]&0x7f)*0x80)+(body[9]&0x7f);
  position=10+size+((body[5]&0x10)?10:0);
  if(position>=body.length)return null;
 }
 let frames=0,total=0,scan=0;
 while(position+4<=body.length){
  const frame=mp3Frame(body,position);
  if(!frame){
   // Permit an ID3v1 tail, but reject broken/interleaved data rather than
   // estimating a duration from an untrusted partial file.
   if(frames&&body.length-position===128&&body.subarray(position,position+3).toString('ascii')==='TAG')break;
   if(!frames&&scan++<4096){position++;continue;}
   return null;
  }
  if(position+frame.size>body.length)return null;
  total+=frame.seconds;frames++;position+=frame.size;
  if(total>MAX_DURATION_SECONDS)return null;
 }
 return frames&&Number.isFinite(total)&&total>0?total:null;
}
export function audioDuration(body){
 if(!Buffer.isBuffer(body))return null;
 return wavDuration(body)??mp3Duration(body);
}
async function bytes(response,limit){
 if(!response.ok)throw Error(`Music service HTTP ${response.status}`);
 const chunks=[];let total=0;
 for await(const chunk of response.body){total+=chunk.length;if(total>limit)throw Error('Audio inscription is too large for this test player.');chunks.push(chunk);}
 return Buffer.concat(chunks);
}
export class RadioMedia {
 constructor(request=fetch){this.request=request;this.loaded=new Set();this.cache=new Map();this.tracks=[];this.updated=0;}
 async catalogue(force=false){
  if(!force&&this.updated>Date.now()-150000)return this.tracks;
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
  const result={mime,body,duration:audioDuration(body)};this.loaded.add(id);this.cache.set(id,result);
  // Only two tracks' bytes are held; this is not an unbounded media archive.
  while(this.cache.size>2)this.cache.delete(this.cache.keys().next().value);
  return result;
 }
}
