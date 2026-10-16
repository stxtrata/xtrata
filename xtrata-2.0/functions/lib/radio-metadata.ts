import {onInscriptionRequest} from '../inscription/handler';
import {queryAll,run,type Env} from './db';
import {inscriptionMetadata,inscriptionArtwork,inscriptionHasAudio} from '../../src/lib/radio/inscription-metadata';
import {hiddenTrackRange,webmAudioOnly,linkedAudioId,HIDDEN_TRAILER_BYTES,MEDIA_HEAD_BYTES} from '../../src/lib/radio/song-sources.mjs';
import {RADIO_CONTRACT} from './radio-report';

/**
 * When the song rules last widened: hidden tracks, audio-only WebM minted as video/webm, and HTML players that link
 * their audio from another inscription (src/lib/radio/song-sources.mjs). A "not a song" answer from before this is
 * checked once more under the new rules; after that it stands like any other.
 */
export const SONG_RULES_SINCE = Date.UTC(2026, 9, 16);
const MAX_HTML = 32 * 1024 * 1024;

/** song: 0 not a song, 1 a song, 2 a hidden track (a song meant to be found, not listed: station lists leave it out). */
type Found = {title:string;artist:string;album:string;cover:string;song:0|1|2};

const fetchInscription = (env:Env, id:number, range?:string) =>
 // Invoke the runtime directly: a same-zone fetch can bypass the Pages function.
 onInscriptionRequest({env,request:new Request('https://xtrata.xyz/inscription/'+id,{signal:AbortSignal.timeout(15000),...(range?{headers:{Range:range}}:{})}),params:{tokenId:String(id)}} as any);

async function readAll(response:Response, limit:number):Promise<Uint8Array> {
 const reader=response.body!.getReader(),parts:Uint8Array[]=[];let size=0;
 while(true){const r=await reader.read();if(r.done)break;size+=r.value.length;if(size>limit){await reader.cancel();throw Error('Too large');}parts.push(r.value);}
 const out=new Uint8Array(size);let at=0;for(const p of parts){out.set(p,at);at+=p.length;}return out;
}

/** A byte range of an inscription and the file's full size. A server that ignores Range sends it all: slice it here. */
async function bytesOf(env:Env, id:number, range:string):Promise<{bytes:Uint8Array;total:number}> {
 const response=await fetchInscription(env,id,range);
 if(!response.ok){await response.body?.cancel();throw Error('Unavailable');}
 if(response.status!==206){
  const all=await readAll(response,MAX_HTML);
  const suffix=/^bytes=-(\d+)$/.exec(range),span=/^bytes=(\d+)-(\d+)$/.exec(range);
  const bytes=suffix?all.subarray(Math.max(0,all.length-Number(suffix[1]))):span?all.subarray(Number(span[1]),Number(span[2])+1):all;
  return {bytes,total:all.length};
 }
 const total=Number((response.headers.get('content-range')||'').split('/')[1]);
 return {bytes:await readAll(response,MEDIA_HEAD_BYTES*2),total};
}

/** A video inscription is a song when every track in it is audio, and a hidden track when one is appended to it. */
async function inspectVideo(env:Env, id:number):Promise<Found> {
 const none={title:'',artist:'',album:'',cover:''};
 const tail=await bytesOf(env,id,`bytes=-${HIDDEN_TRAILER_BYTES}`);
 if(hiddenTrackRange(tail.bytes,tail.total))return {...none,song:2};
 const head=await bytesOf(env,id,`bytes=0-${MEDIA_HEAD_BYTES-1}`);
 return {...none,song:webmAudioOnly(head.bytes)?1:0};
}

async function inspectHtml(env:Env, id:number):Promise<Found> {
 const response=await fetchInscription(env,id);
 if(!response.ok||!response.headers.get('content-type')?.includes('text/html')){await response.body?.cancel();throw Error('Unavailable');}
 const html=new TextDecoder().decode(await readAll(response,MAX_HTML));
 const meta=inscriptionMetadata(html);
 return {...meta,cover:inscriptionArtwork(html),song:inscriptionHasAudio(html)||linkedAudioId(html)!==null?1:0};
}

/** Inspect one immutable inscription and store what it is. A failed read is retried tomorrow. */
async function inspect(env:Env, id:number, mime:string) {
 try {
  const found=mime.startsWith('video/')?await inspectVideo(env,id):await inspectHtml(env,id);
  await run(env,"UPDATE radio_metadata SET title=?,artist=?,album=?,cover=?,cover_checked=1,is_song=?,status='ready' WHERE token_id=?",[found.title,found.artist,found.album,found.cover,found.song,id]);
 } catch {await run(env,"UPDATE radio_metadata SET status='failed' WHERE token_id=?",[id]);}
}

// Which rows need a look: never seen, seen before cover/album/song were recorded, a "not a song" from before the
// current rules, or a failed read more than a day old. Shared by the pick and the claim so they always agree.
const DUE=`(radio_metadata.status='ready' AND (radio_metadata.cover_checked=0 OR radio_metadata.is_song IS NULL OR radio_metadata.album IS NULL OR (radio_metadata.is_song=0 AND radio_metadata.checked_at<?))) OR (radio_metadata.status!='ready' AND radio_metadata.checked_at<?)`;

/** Claim a row so simultaneous refreshes never download the same file. */
async function claim(env:Env, id:number, now:number, retryFailed=false) {
 const claimed=await queryAll(env,`INSERT INTO radio_metadata(token_id,checked_at,status) VALUES(?,?,'pending')
  ON CONFLICT(token_id) DO UPDATE SET checked_at=excluded.checked_at,status='pending'
  WHERE ${DUE}${retryFailed?" OR radio_metadata.status='failed'":''} RETURNING token_id`,[id,now,SONG_RULES_SINCE,now-86400000]);
 return !!claimed.results?.length;
}

/**
 * At most two bounded inscription reads per refresh. Community "dud" reports do not stop a look: the server's own
 * reading of the immutable file is what decides, and it happens once per inscription (twice when the rules widen).
 */
export async function refreshRadioMetadata(env:Env) {
 try {
  const now=Date.now();
  const rows=await queryAll(env,`SELECT i.token_id,i.mime FROM inscription_index i LEFT JOIN radio_metadata ON radio_metadata.token_id=i.token_id
   WHERE i.contract=? AND i.sealed=1 AND (i.mime LIKE 'text/html%' OR i.mime LIKE 'video/%') AND (radio_metadata.token_id IS NULL OR ${DUE})
   ORDER BY COALESCE(radio_metadata.checked_at,0),i.token_id LIMIT 2`,[RADIO_CONTRACT,SONG_RULES_SINCE,now-86400000]);
  for(const row of (rows.results||[]) as {token_id:number;mime:string}[]) {
   if(await claim(env,row.token_id,now)) await inspect(env,row.token_id,String(row.mime||'').toLowerCase());
  }
 }catch { /* optional enrichment never takes down reports */ }
}

/**
 * Look at particular inscriptions now (the album maker naming songs the catalogue has not reached yet). Only
 * indexed HTML or video inscriptions on the radio's contract, at most `limit` of them, each only when due (a
 * failed read is tried again straight away: someone is waiting on it).
 */
export async function checkSongsNow(env:Env, ids:number[], limit=6) {
 const wanted=[...new Set(ids.filter((n)=>Number.isSafeInteger(n)&&n>0))].slice(0,limit);
 if(!wanted.length)return;
 try {
  const rows=await queryAll(env,`SELECT token_id,mime FROM inscription_index WHERE contract=? AND sealed=1 AND (mime LIKE 'text/html%' OR mime LIKE 'video/%') AND token_id IN (${wanted.map(()=>'?').join(',')})`,[RADIO_CONTRACT,...wanted]);
  const now=Date.now();
  for(const row of (rows.results||[]) as {token_id:number;mime:string}[]) {
   if(await claim(env,row.token_id,now,true)) await inspect(env,row.token_id,String(row.mime||'').toLowerCase());
  }
 }catch { /* best effort: the caller reports what is still missing */ }
}
